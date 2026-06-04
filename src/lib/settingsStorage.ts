import * as SecureStore from 'expo-secure-store';

import {
  DEFAULT_USER_SETTINGS,
  type NotificationSettings,
  type PrivacySettings,
  type UserSettings,
} from '@/types/settings';

const KEY_PREFIX = 'tribely.user_settings';

function storageKey(userId: string): string {
  return `${KEY_PREFIX}.${userId}`;
}

function mergeNotificationSettings(
  partial?: Partial<NotificationSettings>
): NotificationSettings {
  return {
    lessonReminders:
      partial?.lessonReminders ?? DEFAULT_USER_SETTINGS.notifications.lessonReminders,
    friendActivity:
      partial?.friendActivity ?? DEFAULT_USER_SETTINGS.notifications.friendActivity,
    commentsAndLikes:
      partial?.commentsAndLikes ?? DEFAULT_USER_SETTINGS.notifications.commentsAndLikes,
    friendRequests:
      partial?.friendRequests ?? DEFAULT_USER_SETTINGS.notifications.friendRequests,
  };
}

function mergePrivacySettings(partial?: Partial<PrivacySettings>): PrivacySettings {
  return {
    profileVisible: partial?.profileVisible ?? DEFAULT_USER_SETTINGS.privacy.profileVisible,
  };
}

export async function loadUserSettings(
  userId: string | null | undefined
): Promise<UserSettings> {
  if (!userId) return DEFAULT_USER_SETTINGS;

  try {
    const raw = await SecureStore.getItemAsync(storageKey(userId));
    if (!raw) return DEFAULT_USER_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    return {
      notifications: mergeNotificationSettings(parsed.notifications),
      privacy: mergePrivacySettings(parsed.privacy),
    };
  } catch {
    return DEFAULT_USER_SETTINGS;
  }
}

export async function saveUserSettings(userId: string, settings: UserSettings): Promise<void> {
  await SecureStore.setItemAsync(storageKey(userId), JSON.stringify(settings));
}
