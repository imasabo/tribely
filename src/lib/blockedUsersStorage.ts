import * as SecureStore from 'expo-secure-store';

const KEY_PREFIX = 'tribely.blocked_users';

function storageKey(userId: string): string {
  return `${KEY_PREFIX}.${userId}`;
}

export async function loadBlockedUserIds(
  userId: string | null | undefined
): Promise<string[]> {
  if (!userId) return [];

  try {
    const raw = await SecureStore.getItemAsync(storageKey(userId));
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((id): id is string => typeof id === 'string' && id.length > 0);
  } catch {
    return [];
  }
}

export async function saveBlockedUserIds(userId: string, blockedIds: string[]): Promise<void> {
  await SecureStore.setItemAsync(storageKey(userId), JSON.stringify(blockedIds));
}
