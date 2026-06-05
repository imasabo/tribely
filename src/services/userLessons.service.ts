import { buildUserLessonsBundle } from '@/lib/buildUserLessonsBundle';
import { resolveProfileStatsUserId } from '@/features/profile/lib/ownProfileStats';
import type { UserLessonsBundle } from '@/features/profile/types';
import { lessonsService } from '@/services/lessons.service';

export const userLessonsService = {
  async getForUser(userId: string, viewerUid?: string | null): Promise<UserLessonsBundle> {
    const resolvedId = resolveProfileStatsUserId(userId, viewerUid);
    const remoteLessons = await lessonsService.listByTeacher(resolvedId);
    return buildUserLessonsBundle(resolvedId, { remoteLessons });
  },
};
