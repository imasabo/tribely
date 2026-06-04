import { discoverLessons, friendLessonActivity } from '@/data/mock/lessons';
import {
  lessonCatalogStore,
  type PublishLessonInput,
} from '@/data/lessonCatalogStore';
import type { FriendLessonActivity, Lesson } from '@/types/domain';

export type { PublishLessonInput };

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
    const runtime = lessonCatalogStore.listAll();
    const discoverIds = new Set(discoverLessons.map((l) => l.id));
    const merged = [
      ...runtime.filter((l) => !discoverIds.has(l.id)),
      ...discoverLessons.map((seed) => lessonCatalogStore.getById(seed.id) ?? seed),
    ];
    return merged;
  },

  async getById(id: string): Promise<Lesson | null> {
    return lessonCatalogStore.getById(id) ?? null;
  },

  async search(query: string): Promise<Lesson[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    const all = lessonCatalogStore.listAll();
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
    return lessonCatalogStore.publish(input);
  },
};
