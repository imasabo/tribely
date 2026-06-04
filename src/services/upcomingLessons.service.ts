import { mockUpcomingLessons } from '@/data/mock/upcomingLessons';
import { resolveProfileStatsUserId } from '@/features/profile/lib/ownProfileStats';
import type { UpcomingLessonsBundle } from '@/features/profile/types';

const emptyBundle: UpcomingLessonsBundle = {
  teaching: [],
  attending: [],
};

function resolveBundle(userId: string): UpcomingLessonsBundle {
  return mockUpcomingLessons[userId] ?? emptyBundle;
}

export const upcomingLessonsService = {
  async getForUser(
    userId: string,
    viewerUid?: string | null
  ): Promise<UpcomingLessonsBundle> {
    const resolvedId = resolveProfileStatsUserId(userId, viewerUid);
    return resolveBundle(resolvedId);
  },
};
