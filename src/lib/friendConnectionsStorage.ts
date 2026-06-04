import * as SecureStore from 'expo-secure-store';

import type { FriendConnectionsState } from '@/types/social';

const CONNECTIONS_KEY_PREFIX = 'tribely.friend_connections';

const EMPTY_STATE: FriendConnectionsState = {
  friends: [],
  sentRequests: [],
  receivedRequests: [],
};

/** Demo friends for first-time local storage (matches home feed mock users). */
export const DEFAULT_SEED_FRIEND_IDS = [
  'friend-marcus',
  'friend-sam',
  'friend-jordan',
  'friend-taylor',
  'friend-riley',
];

const SEEDED_STATE: FriendConnectionsState = {
  friends: DEFAULT_SEED_FRIEND_IDS,
  sentRequests: [],
  receivedRequests: [],
};

function storageKey(viewerId: string): string {
  return `${CONNECTIONS_KEY_PREFIX}.${viewerId}`;
}

export async function loadFriendConnections(
  viewerId: string | null | undefined
): Promise<FriendConnectionsState> {
  if (!viewerId) return { ...EMPTY_STATE, friends: [], sentRequests: [], receivedRequests: [] };

  try {
    const raw = await SecureStore.getItemAsync(storageKey(viewerId));
    if (!raw) {
      await saveFriendConnections(viewerId, SEEDED_STATE);
      return { ...SEEDED_STATE };
    }

    const parsed = JSON.parse(raw) as FriendConnectionsState;
    return {
      friends: Array.isArray(parsed.friends) ? parsed.friends : [],
      sentRequests: Array.isArray(parsed.sentRequests) ? parsed.sentRequests : [],
      receivedRequests: Array.isArray(parsed.receivedRequests)
        ? parsed.receivedRequests
        : [],
    };
  } catch {
    return { ...EMPTY_STATE };
  }
}

export async function saveFriendConnections(
  viewerId: string,
  state: FriendConnectionsState
): Promise<void> {
  await SecureStore.setItemAsync(storageKey(viewerId), JSON.stringify(state));
}
