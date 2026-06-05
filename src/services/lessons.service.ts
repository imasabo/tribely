import { isAuthDevBypassEnabled } from '@/constants/devFlags';
import { collections } from '@/constants/collections';
import { discoverLessons } from '@/data/mock/lessons';
import { activityFeedStore } from '@/data/activityFeedStore';
import {
  lessonCatalogStore,
  type PublishLessonInput,
} from '@/data/lessonCatalogStore';
import { isLessonOwner } from '@/lib/lessonEnrollment';
import {
  firestore,
  isFirestoreAvailable,
  serverTimestamp,
  timestampFromDate,
} from '@/lib/firestore/client';
import {
  findDiscoverCityByLabel,
  getDiscoverCityById,
} from '@/data/discoverCities';
import { enrichLessonsWithTeacherStats } from '@/lib/enrichLessonsWithTeacherStats';
import { lessonFromFirestore } from '@/mappers/lesson.mapper';
import type { LessonDoc } from '@/types/firestore';
import type { FriendLessonActivity, Lesson } from '@/types/domain';

export type { PublishLessonInput };

function useFirestoreLessons(): boolean {
  return isFirestoreAvailable() && !isAuthDevBypassEnabled();
}

async function getFromFirestore(id: string): Promise<Lesson | null> {
  const snap = await firestore().collection(collections.lessons).doc(id).get();
  if (!snap.exists) return null;

  const data = snap.data() as LessonDoc | undefined;
  if (!data) return null;

  const [lesson] = await enrichLessonsWithTeacherStats([lessonFromFirestore(snap.id, data)]);
  return lesson ?? null;
}

function mapFirestoreLessonDoc(
  doc: { id: string; data: () => LessonDoc | undefined }
): Lesson | null {
  const data = doc.data();
  if (!data || data.status !== 'published') return null;
  return lessonFromFirestore(doc.id, data);
}

function mapFirestoreLessonDocs(
  docs: { id: string; data: () => LessonDoc | undefined }[]
): Lesson[] {
  return docs
    .map(mapFirestoreLessonDoc)
    .filter((lesson): lesson is Lesson => lesson != null);
}

async function listPublishedFromFirestore(): Promise<Lesson[]> {
  const snap = await firestore()
    .collection(collections.lessons)
    .where('status', '==', 'published')
    .get();

  return mapFirestoreLessonDocs(snap.docs);
}

async function listByTeacherFromFirestore(teacherId: string): Promise<Lesson[]> {
  const snap = await firestore()
    .collection(collections.lessons)
    .where('teacherId', '==', teacherId)
    .get();

  return mapFirestoreLessonDocs(snap.docs);
}

function resolveLessonCityCoords(input: PublishLessonInput) {
  const discoverCity =
    getDiscoverCityById(input.cityId) ?? findDiscoverCityByLabel(input.city);

  return {
    city: input.city.trim(),
    cityId: discoverCity?.id ?? input.cityId,
    lat: discoverCity?.latitude ?? 0,
    lng: discoverCity?.longitude ?? 0,
  };
}

async function createInFirestore(input: PublishLessonInput): Promise<{ lessonId: string }> {
  const ref = firestore().collection(collections.lessons).doc();
  const slides = input.googleSlidesUrl?.trim() ?? '';
  const resolvedCity = resolveLessonCityCoords(input);

  const doc: Omit<LessonDoc, 'createdAt' | 'updatedAt'> & {
    createdAt: ReturnType<typeof serverTimestamp>;
    updatedAt: ReturnType<typeof serverTimestamp>;
  } = {
    teacherId: input.teacherId,
    teacherDisplayName: input.teacherName.trim(),
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category ?? 'General',
    categoryEmoji: input.categoryEmoji ?? '📚',
    durationMinutes: input.durationMinutes,
    city: resolvedCity.city,
    cityId: resolvedCity.cityId,
    location: {
      name: input.locationName.trim(),
      lat: resolvedCity.lat,
      lng: resolvedCity.lng,
    },
    scheduledAt: timestampFromDate(input.scheduledAt),
    status: 'published',
    maxLearners: input.maxLearners,
    featured: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (slides) {
    doc.googleSlidesUrl = slides;
  }

  await ref.set(doc);
  return { lessonId: ref.id };
}

/**
 * Lessons data access layer.
 * Real auth: Firestore for create/read; dev bypass: in-memory catalog.
 */
export const lessonsService = {
  async listFriendActivity(): Promise<FriendLessonActivity[]> {
    return activityFeedStore.list();
  },

  async getFriendActivityById(id: string): Promise<FriendLessonActivity | null> {
    return activityFeedStore.list().find((activity) => activity.id === id) ?? null;
  },

  async listDiscover(): Promise<Lesson[]> {
    const runtime = lessonCatalogStore.listAll();
    const discoverIds = new Set(discoverLessons.map((l) => l.id));
    const merged = [
      ...runtime.filter((l) => !discoverIds.has(l.id)),
      ...discoverLessons.map((seed) => lessonCatalogStore.getById(seed.id) ?? seed),
    ];

    if (!useFirestoreLessons()) {
      return merged;
    }

    try {
      const remote = await listPublishedFromFirestore();
      const seen = new Set(merged.map((lesson) => lesson.id));
      const extras = remote.filter((lesson) => !seen.has(lesson.id));
      return enrichLessonsWithTeacherStats([...extras, ...merged]);
    } catch (error) {
      console.warn('[Tribely] Failed to load Firestore lessons for discover', error);
      return merged;
    }
  },

  async listByTeacher(teacherId: string): Promise<Lesson[]> {
    if (!useFirestoreLessons()) {
      return lessonCatalogStore
        .listAll()
        .filter((lesson) => lesson.teacherId === teacherId);
    }

    try {
      return enrichLessonsWithTeacherStats(await listByTeacherFromFirestore(teacherId));
    } catch (error) {
      console.warn('[Tribely] Failed to load teacher lessons from Firestore', error);
      return [];
    }
  },

  async getById(id: string): Promise<Lesson | null> {
    if (useFirestoreLessons()) {
      try {
        const remote = await getFromFirestore(id);
        if (remote) return remote;
      } catch (error) {
        console.warn('[Tribely] Failed to load lesson from Firestore', error);
      }
    }

    return lessonCatalogStore.getById(id) ?? null;
  },

  async search(query: string): Promise<Lesson[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    const all = await this.listDiscover();
    const seen = new Set<string>();

    return all.filter((lesson) => {
      if (seen.has(lesson.id)) return false;
      seen.add(lesson.id);

      const haystack = [
        lesson.title,
        lesson.teacherName,
        lesson.category,
        lesson.locationName,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalized);
    });
  },

  async publish(input: PublishLessonInput): Promise<{ lessonId: string }> {
    if (input.templateLessonId) {
      const catalogLesson = lessonCatalogStore.getById(input.templateLessonId);
      if (catalogLesson) {
        return lessonCatalogStore.publish(input);
      }

      if (useFirestoreLessons()) {
        const existing = await getFromFirestore(input.templateLessonId);
        if (!existing) {
          throw new Error('Lesson not found');
        }
        if (!isLessonOwner(existing, input.teacherId)) {
          throw new Error('Only the lesson creator can schedule another session');
        }

        return createInFirestore({
          ...input,
          category: input.category ?? existing.category,
          categoryEmoji: input.categoryEmoji ?? existing.categoryEmoji,
          slidePreviewColors: input.slidePreviewColors ?? existing.slidePreviewColors,
          googleSlidesUrl: input.googleSlidesUrl?.trim() || existing.googleSlidesUrl,
        });
      }

      throw new Error('Lesson not found');
    }

    if (useFirestoreLessons()) {
      return createInFirestore(input);
    }

    return lessonCatalogStore.publish(input);
  },
};
