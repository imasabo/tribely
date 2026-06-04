import { mockProfileStatDetails } from '@/data/mock/profileStatDetails';
import { mockTeacherProfiles } from '@/data/mock/teacherProfiles';
import { mockPublicProfiles } from '@/data/mock/users';
import { OWN_PROFILE_STATS_USER_ID } from '@/features/profile/lib/ownProfileStats';
import type {
  ProfileReviewItem,
  ProfileStatKey,
  ProfileStudentItem,
  ProfileTaughtItem,
} from '@/features/profile/types';

function resolveBundle(userId: string) {
  return mockProfileStatDetails[userId] ?? null;
}

function displayNameFor(userId: string): string | null {
  if (userId === OWN_PROFILE_STATS_USER_ID) return 'Alex Kim';
  const profile = mockPublicProfiles[userId] ?? mockTeacherProfiles[userId];
  return profile?.displayName ?? null;
}

export const profileStatsService = {
  async getDisplayName(userId: string): Promise<string | null> {
    return displayNameFor(userId);
  },

  async getTaught(userId: string): Promise<ProfileTaughtItem[]> {
    return resolveBundle(userId)?.taught ?? [];
  },

  async getStudents(userId: string): Promise<ProfileStudentItem[]> {
    return resolveBundle(userId)?.students ?? [];
  },

  async getReviews(userId: string): Promise<ProfileReviewItem[]> {
    return resolveBundle(userId)?.reviews ?? [];
  },

  titleForStat(statKey: ProfileStatKey): string {
    switch (statKey) {
      case 'taught':
        return 'Lessons taught';
      case 'students':
        return 'Students';
      case 'reviews':
        return 'Reviews';
      default:
        return '';
    }
  },

  emptyMessageForStat(statKey: ProfileStatKey): string {
    switch (statKey) {
      case 'taught':
        return 'No lessons taught yet.';
      case 'students':
        return 'No students yet.';
      case 'reviews':
        return 'No reviews yet.';
      default:
        return 'Nothing to show yet.';
    }
  },
};
