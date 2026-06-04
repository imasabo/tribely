import {
  discoverLessons,
  friendLessonActivity,
  homeLessons,
} from '@/data/mock/lessons';
import type { FriendLessonActivity, Lesson } from '@/types/domain';

/**
 * Lessons data access layer.
 * Phase 2: swap implementations to use Firestore queries.
 */
export const lessonsService = {
  async listFriendActivity(): Promise<FriendLessonActivity[]> {
    return friendLessonActivity;
  },

  async getFriendActivityById(id: string): Promise<FriendLessonActivity | null> {
    return friendLessonActivity.find((activity) => activity.id === id) ?? null;
  },

  async listDiscover(): Promise<Lesson[]> {
    return discoverLessons;
  },

  async getById(id: string): Promise<Lesson | null> {
    const all = [...homeLessons, ...discoverLessons];
    return all.find((l) => l.id === id) ?? null;
  },

  async search(query: string): Promise<Lesson[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    const all = [...homeLessons, ...discoverLessons];
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
};
