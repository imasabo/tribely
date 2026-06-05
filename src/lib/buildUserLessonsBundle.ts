import { activityFeedStore } from '@/data/activityFeedStore';
import { learnerRatingsStore } from '@/data/learnerRatingsStore';
import { lessonCatalogStore } from '@/data/lessonCatalogStore';
import { mockLessonJoinRequests } from '@/data/mock/lessonJoinRequests';
import { isLessonOwner } from '@/lib/lessonEnrollment';
import {
  canShareLessonCompletion,
  formatSessionCompletedLabel,
  getCompletionSession,
  getSessionEndDate,
  getUpcomingSessions,
  hasUpcomingSessions,
  isSessionEnded,
} from '@/lib/lessonSessions';
import type { UserLessonItem, UserLessonsBundle, UserLessonRole } from '@/features/profile/types';
import type { Lesson, LessonSession } from '@/types/domain';

function defaultSessions(lesson: Lesson): LessonSession[] {
  return lesson.sessions ?? [{ id: `${lesson.id}-s1`, scheduledAtLabel: lesson.scheduledAtLabel }];
}

function lessonToUserItem(
  lesson: Lesson,
  role: UserLessonRole,
  options: {
    id: string;
    scheduledAtLabel: string;
    completedAtLabel?: string;
    canShareExperience?: boolean;
    hasSharedExperience?: boolean;
    canRateLearners?: boolean;
    learnersToRateCount?: number;
  }
): UserLessonItem {
  return {
    id: options.id,
    lessonId: lesson.id,
    role,
    title: lesson.title,
    category: lesson.category,
    categoryEmoji: lesson.categoryEmoji,
    scheduledAtLabel: options.scheduledAtLabel,
    locationName: lesson.locationName,
    durationMinutes: lesson.durationMinutes,
    slidePreviewColors: lesson.slidePreviewColors,
    teacherName: role === 'attending' ? lesson.teacherName : undefined,
    teacherAvatar: role === 'attending' ? lesson.teacherAvatar : undefined,
    enrolledCount: role === 'teaching' ? lesson.enrolledCount : undefined,
    maxLearners: role === 'teaching' ? lesson.maxLearners : undefined,
    completedAtLabel: options.completedAtLabel,
    canShareExperience: options.canShareExperience,
    hasSharedExperience: options.hasSharedExperience,
    canRateLearners: options.canRateLearners,
    learnersToRateCount: options.learnersToRateCount,
  };
}

function countLearnersToRate(lessonId: string): number {
  const accepted = mockLessonJoinRequests.filter(
    (r) => r.lessonId === lessonId && r.status === 'accepted'
  );
  return accepted.filter((r) => !learnerRatingsStore.hasRated(lessonId, r.requesterId)).length;
}

function sortBySessionEndDesc(items: UserLessonItem[], lessonsById: Map<string, Lesson>, now: Date) {
  return [...items].sort((a, b) => {
    const lessonA = lessonsById.get(a.lessonId);
    const lessonB = lessonsById.get(b.lessonId);
    if (!lessonA || !lessonB) return 0;
    const sessionA = defaultSessions(lessonA).find((s) => s.scheduledAtLabel === a.scheduledAtLabel);
    const sessionB = defaultSessions(lessonB).find((s) => s.scheduledAtLabel === b.scheduledAtLabel);
    const endA = sessionA
      ? getSessionEndDate(sessionA, lessonA.durationMinutes, now)?.getTime() ?? 0
      : 0;
    const endB = sessionB
      ? getSessionEndDate(sessionB, lessonB.durationMinutes, now)?.getTime() ?? 0
      : 0;
    return endB - endA;
  });
}

export type BuildUserLessonsBundleOptions = {
  /** Lessons loaded from Firestore (and other remote sources). */
  remoteLessons?: Lesson[];
  now?: Date;
};

function mergeOwnedLessons(userId: string, remoteLessons: Lesson[]): Map<string, Lesson> {
  const owned = new Map<string, Lesson>();

  for (const lesson of lessonCatalogStore.listAll()) {
    if (isLessonOwner(lesson, userId)) {
      owned.set(lesson.id, lesson);
    }
  }

  for (const lesson of remoteLessons) {
    if (isLessonOwner(lesson, userId)) {
      owned.set(lesson.id, lesson);
    }
  }

  return owned;
}

function resolveLessonById(
  lessonId: string,
  remoteById: Map<string, Lesson>
): Lesson | null {
  return remoteById.get(lessonId) ?? lessonCatalogStore.getById(lessonId);
}

/** Builds teaching / attending / completed tabs from catalog, enrollments, and session times. */
export function buildUserLessonsBundle(
  userId: string,
  options?: BuildUserLessonsBundleOptions
): UserLessonsBundle {
  const now = options?.now ?? new Date();
  const remoteLessons = options?.remoteLessons ?? [];
  const remoteById = new Map(remoteLessons.map((lesson) => [lesson.id, lesson]));
  const teaching: UserLessonItem[] = [];
  const attending: UserLessonItem[] = [];
  const completed: UserLessonItem[] = [];
  const lessonsById = new Map<string, Lesson>();

  for (const lesson of mergeOwnedLessons(userId, remoteLessons).values()) {
    lessonsById.set(lesson.id, lesson);
    const sessions = defaultSessions(lesson);

    if (hasUpcomingSessions(lesson, now)) {
      const next = getUpcomingSessions(sessions, now)[0];
      teaching.push(
        lessonToUserItem(lesson, 'teaching', {
          id: `${lesson.id}-teaching`,
          scheduledAtLabel: next.scheduledAtLabel,
        })
      );
    }

    const endedSessions = sessions.filter((session) =>
      isSessionEnded(session, lesson.durationMinutes, now)
    );
    if (endedSessions.length > 0) {
      const latestEnded = endedSessions[endedSessions.length - 1];
      const toRate = countLearnersToRate(lesson.id);
      completed.push(
        lessonToUserItem(lesson, 'teaching', {
          id: `${lesson.id}-completed-taught`,
          scheduledAtLabel: latestEnded.scheduledAtLabel,
          completedAtLabel: formatSessionCompletedLabel(latestEnded, now),
          canRateLearners: toRate > 0,
          learnersToRateCount: toRate,
        })
      );
    }
  }

  const acceptedLessonIds = [
    ...new Set(
      mockLessonJoinRequests
        .filter((r) => r.requesterId === userId && r.status === 'accepted')
        .map((r) => r.lessonId)
    ),
  ];

  for (const lessonId of acceptedLessonIds) {
    const lesson = resolveLessonById(lessonId, remoteById);
    if (!lesson) continue;

    lessonsById.set(lesson.id, lesson);
    const sessions = defaultSessions(lesson);
    const hasShared = activityFeedStore.hasUserCompleted(userId, lesson.id);
    const sessionEnded = canShareLessonCompletion(lesson, now);

    const upcoming = getUpcomingSessions(sessions, now);
    if (upcoming.length > 0) {
      attending.push(
        lessonToUserItem(lesson, 'attending', {
          id: `${lesson.id}-attending`,
          scheduledAtLabel: upcoming[0].scheduledAtLabel,
        })
      );
    }

    if (sessionEnded) {
      const session = getCompletionSession(lesson, now);
      completed.push(
        lessonToUserItem(lesson, 'attending', {
          id: `${lesson.id}-completed-learned`,
          scheduledAtLabel: session.scheduledAtLabel,
          completedAtLabel: formatSessionCompletedLabel(session, now),
          canShareExperience: true,
          hasSharedExperience: hasShared,
        })
      );
    }
  }

  return {
    teaching,
    attending,
    completed: sortBySessionEndDesc(completed, lessonsById, now),
  };
}
