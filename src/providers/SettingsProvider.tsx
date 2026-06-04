import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { loadUserSettings, saveUserSettings } from '@/lib/settingsStorage';
import { useAuth } from '@/providers/AuthProvider';
import {
  DEFAULT_USER_SETTINGS,
  type NotificationSettings,
  type PrivacySettings,
  type UserSettings,
} from '@/types/settings';

type SettingsContextValue = {
  settings: UserSettings;
  loading: boolean;
  updateNotifications: (patch: Partial<NotificationSettings>) => Promise<void>;
  updatePrivacy: (patch: Partial<PrivacySettings>) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user?.uid) {
        if (!cancelled) {
          setSettings(DEFAULT_USER_SETTINGS);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const loaded = await loadUserSettings(user.uid);
      if (!cancelled) {
        setSettings(loaded);
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const updateNotifications = useCallback(
    async (patch: Partial<NotificationSettings>) => {
      setSettings((prev) => {
        const next: UserSettings = {
          ...prev,
          notifications: { ...prev.notifications, ...patch },
        };
        if (user?.uid) void saveUserSettings(user.uid, next);
        return next;
      });
    },
    [user?.uid]
  );

  const updatePrivacy = useCallback(
    async (patch: Partial<PrivacySettings>) => {
      setSettings((prev) => {
        const next: UserSettings = {
          ...prev,
          privacy: { ...prev.privacy, ...patch },
        };
        if (user?.uid) void saveUserSettings(user.uid, next);
        return next;
      });
    },
    [user?.uid]
  );

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      loading,
      updateNotifications,
      updatePrivacy,
    }),
    [settings, loading, updateNotifications, updatePrivacy]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
