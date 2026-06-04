import { discoverLessons, homeLessons } from '@/data/mock/lessons';
import type { PublicUserProfile } from '@/data/mock/users';
import type { Lesson } from '@/types/domain';

function profileFromLesson(lesson: Lesson): PublicUserProfile {
  return {
    id: lesson.teacherId,
    displayName: lesson.teacherName,
    email: `${lesson.teacherId}@tribely.app`,
    role: 'teacher',
    bio: `Teaches ${lesson.category.toLowerCase()} lessons in the Bay Area. Book a session to learn hands-on with a small group.`,
    city: 'San Francisco, CA',
    joinedAtLabel: 'Joined 2025',
    teachTopics: [lesson.category],
    learnTopics: [],
    stats: {
      rating: lesson.rating,
      lessonsTaught: Math.max(1, Math.round(lesson.reviewCount / 4)),
      students: lesson.reviewCount,
      reviews: lesson.reviewCount,
    },
  };
}

/** Teacher profiles keyed by `lesson.teacherId` — built from mock lessons. */
export const mockTeacherProfiles: Record<string, PublicUserProfile> = (() => {
  const profiles: Record<string, PublicUserProfile> = {};

  for (const lesson of [...homeLessons, ...discoverLessons]) {
    if (!profiles[lesson.teacherId]) {
      profiles[lesson.teacherId] = profileFromLesson(lesson);
    }
  }

  return profiles;
})();
