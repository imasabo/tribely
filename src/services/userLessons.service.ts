import { buildUserLessonsBundle } from '@/lib/buildUserLessonsBundle';
import { resolveProfileStatsUserId } from '@/features/profile/lib/ownProfileStats';
import type { UserLessonsBundle } from '@/features/profile/types';

export const userLessonsService = {
  async getForUser(userId: string, viewerUid?: string | null): Promise<UserLessonsBundle> {
    const resolvedId = resolveProfileStatsUserId(userId, viewerUid);
    return buildUserLessonsBundle(resolvedId);
  },
};
