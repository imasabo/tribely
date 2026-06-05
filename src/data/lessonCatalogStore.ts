import { allCatalogLessons } from '@/data/mock/profileTeachingLessons';
import { mockProfileStatDetails } from '@/data/mock/profileStatDetails';
import { isLessonOwner } from '@/lib/lessonEnrollment';
import {
  createInitialSessions,
  newSessionId,
  syncLessonScheduleFields,
} from '@/lib/lessonSessions';
import { getInitials } from '@/lib/userDisplay';
import type { ProfileTaughtItem } from '@/features/profile/types';
import type { Lesson, LessonDurationMinutes } from '@/types/domain';

export interface PublishLessonInput {
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  locationName: string;
  durationMinutes: LessonDurationMinutes;
  googleSlidesUrl: string;
  scheduledAtLabel: string;
  category?: string;
  categoryEmoji?: string;
  slidePreviewColors?: [string, string, string];
  maxLearners: number;
  /** Reuse this lesson id and append a session instead of creating a new lesson. */
  templateLessonId?: string;
}

const CATALOG_SEED_VERSION = 4;

const catalog = new Map<string, Lesson>();
const extraTaughtByTeacher = new Map<string, ProfileTaughtItem[]>();
let catalogSeedVersion = 0;

function targetSessionCountForLesson(lessonId: string): number {
  for (const bundle of Object.values(mockProfileStatDetails)) {
    const taught = bundle.taught.find((item) => item.lessonId === lessonId);
    if (taught) return Math.max(1, taught.sessionCount);
  }
  return 1;
}

function normalizeLesson(lesson: Lesson): Lesson {
  const existingSessions = lesson.sessions ?? [];
  const sessionCount =
    existingSessions.length > 0 ? existingSessions.length : targetSessionCountForLesson(lesson.id);

  const sessions =
    existingSessions.length > 0
      ? existingSessions
      : createInitialSessions(lesson.id, lesson.scheduledAtLabel, sessionCount);

  return syncLessonScheduleFields({
    ...lesson,
    sessions,
  });
}

function seedCatalog() {
  if (catalog.size > 0 && catalogSeedVersion === CATALOG_SEED_VERSION) return;

  catalog.clear();
  catalogSeedVersion = CATALOG_SEED_VERSION;

  for (const lesson of allCatalogLessons()) {
    catalog.set(lesson.id, normalizeLesson(lesson));
  }
}

function ensureSeeded() {
  seedCatalog();
}

function taughtItemFromLesson(lesson: Lesson): ProfileTaughtItem {
  const sessions = lesson.sessions ?? [];
  const lastLabel = sessions[sessions.length - 1]?.scheduledAtLabel ?? 'Recently';

  return {
    id: `${lesson.teacherId}-taught-${lesson.id}`,
    lessonId: lesson.id,
    title: lesson.title,
    category: lesson.category,
    categoryEmoji: lesson.categoryEmoji,
    completedAtLabel: `Last session · ${lastLabel.replace(/^.*·\s*/, '').trim() || lastLabel}`,
    sessionCount: sessions.length,
    rating: lesson.rating,
  };
}

export const lessonCatalogStore = {
  getById(id: string): Lesson | null {
    ensureSeeded();
    return catalog.get(id) ?? null;
  },

  listAll(): Lesson[] {
    ensureSeeded();
    return Array.from(catalog.values());
  },

  getExtraTaughtForTeacher(teacherId: string): ProfileTaughtItem[] {
    return extraTaughtByTeacher.get(teacherId) ?? [];
  },

  setEnrolledCount(lessonId: string, enrolledCount: number): void {
    ensureSeeded();
    const lesson = catalog.get(lessonId);
    if (!lesson) return;
    catalog.set(lessonId, { ...lesson, enrolledCount });
  },

  async publish(input: PublishLessonInput): Promise<{ lessonId: string }> {
    ensureSeeded();

    if (input.templateLessonId) {
      const existing = catalog.get(input.templateLessonId);
      if (!existing) {
        throw new Error('Lesson not found');
      }
      if (!isLessonOwner(existing, input.teacherId)) {
        throw new Error('Only the lesson creator can schedule another session');
      }

      const session = {
        id: newSessionId(existing.id),
        scheduledAtLabel: input.scheduledAtLabel,
      };

      const updated = syncLessonScheduleFields({
        ...existing,
        title: input.title.trim() || existing.title,
        description: input.description.trim() || existing.description,
        locationName: input.locationName.trim() || existing.locationName,
        durationMinutes: input.durationMinutes,
        googleSlidesUrl: input.googleSlidesUrl,
        category: input.category ?? existing.category,
        categoryEmoji: input.categoryEmoji ?? existing.categoryEmoji,
        slidePreviewColors: input.slidePreviewColors ?? existing.slidePreviewColors,
        maxLearners: input.maxLearners,
        enrolledCount: 0,
        sessions: [...(existing.sessions ?? []), session],
      });

      catalog.set(existing.id, updated);
      return { lessonId: existing.id };
    }

    const lessonId = `lesson-${Date.now()}`;
    const teacherAvatar = getInitials(input.teacherName);

    const lesson = syncLessonScheduleFields({
      id: lessonId,
      title: input.title.trim(),
      teacherId: input.teacherId,
      teacherName: input.teacherName,
      teacherAvatar,
      category: input.category ?? 'General',
      categoryEmoji: input.categoryEmoji ?? '📚',
      distanceLabel: '0.5 mi',
      durationMinutes: input.durationMinutes,
      rating: 0,
      reviewCount: 0,
      locationName: input.locationName.trim(),
      description: input.description.trim() || undefined,
      googleSlidesUrl: input.googleSlidesUrl,
      slidePreviewColors: input.slidePreviewColors ?? ['#0F766E', '#134E4A', '#1F2937'],
      sessions: createInitialSessions(lessonId, input.scheduledAtLabel, 1),
      scheduledAtLabel: input.scheduledAtLabel,
      maxLearners: input.maxLearners,
      enrolledCount: 0,
    });

    catalog.set(lessonId, lesson);

    const taughtItem = taughtItemFromLesson(lesson);
    const extras = extraTaughtByTeacher.get(input.teacherId) ?? [];
    extraTaughtByTeacher.set(input.teacherId, [taughtItem, ...extras]);

    return { lessonId };
  },
};
