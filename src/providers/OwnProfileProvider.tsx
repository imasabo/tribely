import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { MOCK_OWN_PROFILE_VIEW_MODEL } from '@/features/profile/lib/profileViewModel';
import type { ProfileViewModel } from '@/features/profile/types';
import {
  loadOwnProfile,
  saveOwnProfile,
  type OwnProfileData,
} from '@/lib/ownProfileStorage';
import { isValidUsername, usernameFromDisplayName } from '@/lib/username';
import { useAuth } from '@/providers/AuthProvider';

const DEFAULT_OWN_PROFILE: OwnProfileData = {
  username: MOCK_OWN_PROFILE_VIEW_MODEL.username,
  displayName: MOCK_OWN_PROFILE_VIEW_MODEL.displayName,
  bio: MOCK_OWN_PROFILE_VIEW_MODEL.bio ?? '',
  teachTopics: [...MOCK_OWN_PROFILE_VIEW_MODEL.teachTopics],
  learnTopics: [...MOCK_OWN_PROFILE_VIEW_MODEL.learnTopics],
};

type OwnProfileContextValue = {
  profile: OwnProfileData;
  viewModel: ProfileViewModel;
  loading: boolean;
  updateProfile: (patch: Partial<OwnProfileData>) => Promise<void>;
};

const OwnProfileContext = createContext<OwnProfileContextValue | null>(null);

function resolveUsername(stored: string, displayName: string): string {
  if (isValidUsername(stored)) return stored;
  return usernameFromDisplayName(displayName || MOCK_OWN_PROFILE_VIEW_MODEL.displayName);
}

function toViewModel(data: OwnProfileData): ProfileViewModel {
  return {
    ...MOCK_OWN_PROFILE_VIEW_MODEL,
    username: resolveUsername(data.username, data.displayName),
    displayName: data.displayName,
    bio: data.bio,
    teachTopics: data.teachTopics,
    learnTopics: data.learnTopics,
  };
}

export function OwnProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<OwnProfileData>(DEFAULT_OWN_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      if (!user?.uid) {
        if (mounted) {
          setProfile(DEFAULT_OWN_PROFILE);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const stored = await loadOwnProfile(user.uid);
      if (!mounted) return;

      setProfile(
        stored
          ? {
              username: resolveUsername(
                stored.username,
                stored.displayName || DEFAULT_OWN_PROFILE.displayName
              ),
              displayName: stored.displayName || DEFAULT_OWN_PROFILE.displayName,
              bio: stored.bio || DEFAULT_OWN_PROFILE.bio,
              teachTopics:
                stored.teachTopics.length > 0
                  ? stored.teachTopics
                  : DEFAULT_OWN_PROFILE.teachTopics,
              learnTopics:
                stored.learnTopics.length > 0
                  ? stored.learnTopics
                  : DEFAULT_OWN_PROFILE.learnTopics,
            }
          : DEFAULT_OWN_PROFILE
      );
      setLoading(false);
    }

    hydrate();

    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  const updateProfile = useCallback(
    async (patch: Partial<OwnProfileData>) => {
      let next: OwnProfileData | null = null;
      setProfile((prev) => {
        next = { ...prev, ...patch };
        return next;
      });
      if (next && user?.uid) {
        await saveOwnProfile(user.uid, next);
      }
    },
    [user?.uid]
  );

  const value = useMemo<OwnProfileContextValue>(
    () => ({
      profile,
      viewModel: toViewModel(profile),
      loading,
      updateProfile,
    }),
    [profile, loading, updateProfile]
  );

  return (
    <OwnProfileContext.Provider value={value}>{children}</OwnProfileContext.Provider>
  );
}

export function useOwnProfile(): OwnProfileContextValue {
  const ctx = useContext(OwnProfileContext);
  if (!ctx) {
    throw new Error('useOwnProfile must be used within OwnProfileProvider');
  }
  return ctx;
}
