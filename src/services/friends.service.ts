import { mockPublicProfiles } from '@/data/mock/users';
import { getInitials } from '@/lib/userDisplay';
import { loadFriendConnections } from '@/lib/friendConnectionsStorage';
import type { FriendListItem } from '@/types/friendList';

/**
 * Friends list data access.
 * Phase 2: Firestore friends subcollection + profile resolution.
 */
export const friendsService = {
  async getFriendIds(viewerId: string | null | undefined): Promise<string[]> {
    const state = await loadFriendConnections(viewerId);
    return state.friends;
  },

  async resolveFriends(friendIds: string[]): Promise<FriendListItem[]> {
    const items: FriendListItem[] = [];

    for (const userId of friendIds) {
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
