import { mockTeacherProfiles } from '@/data/mock/teacherProfiles';
import { mockPublicProfiles, type PublicUserProfile } from '@/data/mock/users';
import { loadFriendConnections, saveFriendConnections } from '@/lib/friendConnectionsStorage';
import type { FriendConnectionStatus } from '@/types/social';

/**
 * Users data access layer.
 * Phase 2: Firestore profiles + friend request documents.
 */
export const usersService = {
  async getPublicProfile(userId: string): Promise<PublicUserProfile | null> {
    return mockPublicProfiles[userId] ?? mockTeacherProfiles[userId] ?? null;
  },

  async getConnectionStatus(
    viewerId: string | null | undefined,
    targetUserId: string
  ): Promise<FriendConnectionStatus> {
    if (!viewerId) return 'none';
    if (viewerId === targetUserId) return 'self';

    const state = await loadFriendConnections(viewerId);

    if (state.friends.includes(targetUserId)) return 'friends';
    if (state.sentRequests.includes(targetUserId)) return 'request_sent';
    if (state.receivedRequests.includes(targetUserId)) return 'request_received';
    return 'none';
  },

  async sendFriendRequest(
    viewerId: string,
    targetUserId: string
  ): Promise<FriendConnectionStatus> {
    if (viewerId === targetUserId) return 'self';

    const state = await loadFriendConnections(viewerId);

    if (state.friends.includes(targetUserId)) return 'friends';
    if (state.sentRequests.includes(targetUserId)) return 'request_sent';

    await saveFriendConnections(viewerId, {
      ...state,
      sentRequests: [...state.sentRequests, targetUserId],
    });

    return 'request_sent';
  },
};
