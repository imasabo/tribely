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
import type { UserProfile } from '@/types/userProfile';

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

function profileDataFromAuth(profile: UserProfile): OwnProfileData {
  const displayName = profile.displayName || DEFAULT_OWN_PROFILE.displayName;
  return {
    username: profile.username
      ? resolveUsername(profile.username, displayName)
      : usernameFromDisplayName(displayName),
    displayName,
    bio: profile.bio || '',
    teachTopics:
      profile.teachTopics.length > 0 ? profile.teachTopics : DEFAULT_OWN_PROFILE.teachTopics,
    learnTopics:
      profile.learnTopics.length > 0 ? profile.learnTopics : DEFAULT_OWN_PROFILE.learnTopics,
  };
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
  const { user, profile: authProfile } = useAuth();
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

      if (authProfile?.onboardingComplete) {
        const fromAuth = profileDataFromAuth(authProfile);
        if (mounted) {
          setProfile(fromAuth);
          setLoading(false);
        }
        await saveOwnProfile(user.uid, fromAuth);
        return;
      }

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
  }, [user?.uid, authProfile]);

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
