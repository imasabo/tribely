import * as SecureStore from 'expo-secure-store';

export interface SavedUserArea {
  city: string;
  latitude: number;
  longitude: number;
}

const AREA_KEY_PREFIX = 'tribely.user_area';

function storageKey(userId: string | null | undefined): string {
  return userId ? `${AREA_KEY_PREFIX}.${userId}` : `${AREA_KEY_PREFIX}.guest`;
}

export async function loadUserArea(
  userId: string | null | undefined
): Promise<SavedUserArea | null> {
  try {
    const raw = await SecureStore.getItemAsync(storageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedUserArea;
    if (
      typeof parsed.city === 'string' &&
      typeof parsed.latitude === 'number' &&
      typeof parsed.longitude === 'number'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveUserArea(
  userId: string | null | undefined,
  area: SavedUserArea
): Promise<void> {
  await SecureStore.setItemAsync(storageKey(userId), JSON.stringify(area));
}

export async function clearUserArea(userId: string | null | undefined): Promise<void> {
  await SecureStore.deleteItemAsync(storageKey(userId));
}
