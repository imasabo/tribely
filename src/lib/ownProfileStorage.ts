import * as SecureStore from 'expo-secure-store';

export interface OwnProfileData {
  username: string;
  displayName: string;
  bio: string;
  city: string;
  teachTopics: string[];
  learnTopics: string[];
}

const KEY_PREFIX = 'tribely.own_profile';

function storageKey(userId: string): string {
  return `${KEY_PREFIX}.${userId}`;
}

export async function loadOwnProfile(
  userId: string | null | undefined
): Promise<OwnProfileData | null> {
  if (!userId) return null;

  try {
    const raw = await SecureStore.getItemAsync(storageKey(userId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<OwnProfileData>;
    return {
      username: typeof parsed.username === 'string' ? parsed.username : '',
      displayName: typeof parsed.displayName === 'string' ? parsed.displayName : '',
      bio: typeof parsed.bio === 'string' ? parsed.bio : '',
      city: typeof parsed.city === 'string' ? parsed.city : '',
      teachTopics: Array.isArray(parsed.teachTopics) ? parsed.teachTopics : [],
      learnTopics: Array.isArray(parsed.learnTopics) ? parsed.learnTopics : [],
    };
  } catch {
    return null;
  }
}

export async function saveOwnProfile(userId: string, data: OwnProfileData): Promise<void> {
  await SecureStore.setItemAsync(storageKey(userId), JSON.stringify(data));
}
