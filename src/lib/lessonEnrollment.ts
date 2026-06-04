import { OWN_PROFILE_STATS_USER_ID } from '@/features/profile/lib/ownProfileStats';
import { hasUpcomingSessions } from '@/lib/lessonSessions';
import type { Lesson } from '@/types/domain';

export function isLessonFull(lesson: Lesson): boolean {
  const max = lesson.maxLearners;
  if (max == null || max <= 0) return false;
  return (lesson.enrolledCount ?? 0) >= max;
}

export function canRequestToJoin(lesson: Lesson): boolean {
  return hasUpcomingSessions(lesson) && !isLessonFull(lesson);
}

export function enrollmentLabel(lesson: Lesson): string | null {
  const max = lesson.maxLearners;
  if (max == null) return null;
  const enrolled = lesson.enrolledCount ?? 0;
  return `${enrolled}/${max} spots filled`;
}

/** True when the signed-in user teaches this lesson (handles mock teacher id vs live auth uid). */
export function isLessonOwner(lesson: Lesson, viewerUid: string | undefined): boolean {
  if (!viewerUid) return false;
  if (lesson.teacherId === viewerUid) return true;
  return lesson.teacherId === OWN_PROFILE_STATS_USER_ID;
}

export function spotsRemaining(lesson: Lesson): number | null {
  const max = lesson.maxLearners;
  if (max == null) return null;
  return Math.max(0, max - (lesson.enrolledCount ?? 0));
}
