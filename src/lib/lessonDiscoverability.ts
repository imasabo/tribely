import { getUpcomingSessions } from '@/lib/lessonSessions';
import type { Lesson } from '@/types/domain';

function defaultSessions(lesson: Lesson) {
  return lesson.sessions ?? [{ id: `${lesson.id}-s1`, scheduledAtLabel: lesson.scheduledAtLabel }];
}

/** True when the lesson has at least one session that has not started yet. */
export function isLessonDiscoverable(lesson: Lesson, now = new Date()): boolean {
  if (getUpcomingSessions(defaultSessions(lesson), now).length > 0) {
    return true;
  }

  if (lesson.scheduledAt) {
    return lesson.scheduledAt.getTime() >= now.getTime();
  }

  return false;
}

export function filterDiscoverableLessons(lessons: Lesson[], now = new Date()): Lesson[] {
  return lessons.filter((lesson) => isLessonDiscoverable(lesson, now));
}
