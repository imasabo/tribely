import {
  discoverLessons,
  homeLessons,
} from '@/data/mock/lessons';
import type { Lesson } from '@/types/domain';

/**
 * Lessons data access layer.
 * Phase 2: swap implementations to use Firestore queries.
 */
export const lessonsService = {
  async listNearby(): Promise<Lesson[]> {
    return homeLessons;
  },

  async listDiscover(): Promise<Lesson[]> {
    return discoverLessons;
  },

  async getById(id: string): Promise<Lesson | null> {
    const all = [...homeLessons, ...discoverLessons];
    return all.find((l) => l.id === id) ?? null;
  },
};
