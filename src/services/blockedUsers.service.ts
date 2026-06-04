import { mockPublicProfiles } from '@/data/mock/users';
import { loadBlockedUserIds } from '@/lib/blockedUsersStorage';
import { getInitials } from '@/lib/userDisplay';
import type { BlockedUserListItem } from '@/types/blockedUser';

/**
 * Blocked users data access.
 * Phase 2: Firestore blocked_users subcollection + profile resolution.
 */
export const blockedUsersService = {
  async getBlockedUserIds(viewerId: string | null | undefined): Promise<string[]> {
    return loadBlockedUserIds(viewerId);
  },

  async resolveBlockedUsers(blockedIds: string[]): Promise<BlockedUserListItem[]> {
    const items: BlockedUserListItem[] = [];

    for (const userId of blockedIds) {
      const profile = mockPublicProfiles[userId];
      if (profile) {
        items.push({
          userId,
          displayName: profile.displayName,
          username: profile.username,
          initials: getInitials(profile.displayName),
        });
        continue;
      }

      items.push({
        userId,
        displayName: 'Unknown user',
        username: userId,
        initials: '??',
      });
    }

    return items.sort((a, b) => a.displayName.localeCompare(b.displayName));
  },
};
