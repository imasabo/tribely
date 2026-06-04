export interface NotificationSettings {
  lessonReminders: boolean;
  friendActivity: boolean;
  commentsAndLikes: boolean;
  friendRequests: boolean;
}

export interface PrivacySettings {
  /** When false, profile is hidden from non-friends (Phase 2). */
  profileVisible: boolean;
}

export interface UserSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  notifications: {
    lessonReminders: true,
    friendActivity: true,
    commentsAndLikes: true,
    friendRequests: true,
  },
  privacy: {
    profileVisible: true,
  },
};
