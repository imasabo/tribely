import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

import {
  emptyOwnProfileViewModel,
  userProfileToViewModel,
} from '@/features/profile/lib/profileViewModel';
import type { ProfileViewModel } from '@/features/profile/types';
import { isFirestoreAvailable } from '@/lib/firestore/client';
import { saveOwnProfile, type OwnProfileData } from '@/lib/ownProfileStorage';
import { isValidUsername, usernameFromDisplayName } from '@/lib/username';
import { useAuth } from '@/providers/AuthProvider';
import { usersService } from '@/services/users.service';
import type { UserProfile } from '@/types/userProfile';

type OwnProfileContextValue = {
  profile: OwnProfileData;
  viewModel: ProfileViewModel;
  loading: boolean;
  updateProfile: (patch: Partial<OwnProfileData>) => Promise<void>;
};

const OwnProfileContext = createContext<OwnProfileContextValue | null>(null);

function authProfileToOwnData(profile: UserProfile): OwnProfileData {
  const displayName = profile.displayName;
  return {
    username: profile.username
      ? isValidUsername(profile.username)
        ? profile.username
        : usernameFromDisplayName(displayName)
      : usernameFromDisplayName(displayName),
    displayName,
    bio: profile.bio ?? '',
    city: profile.city ?? '',
    teachTopics: profile.teachTopics ?? [],
    learnTopics: profile.learnTopics ?? [],
  };
}

const EMPTY_OWN_DATA: OwnProfileData = {
  username: '',
  displayName: '',
  bio: '',
  city: '',
  teachTopics: [],
  learnTopics: [],
};

export function OwnProfileProvider({ children }: { children: ReactNode }) {
  const { user, profile: authProfile, profileLoading, refreshProfile, authDevBypass } =
    useAuth();

  const profile = useMemo(() => {
    if (authProfile?.onboardingComplete) {
      return authProfileToOwnData(authProfile);
    }
    return EMPTY_OWN_DATA;
  }, [authProfile]);

  const viewModel = useMemo(() => {
    if (authProfile?.onboardingComplete) {
      return userProfileToViewModel(authProfile);
    }
    return emptyOwnProfileViewModel(user?.displayName ?? '');
  }, [authProfile, user?.displayName]);

  const loading = !!user && profileLoading && !authProfile;

  const updateProfile = useCallback(
    async (patch: Partial<OwnProfileData>) => {
      if (!user?.uid) {
        throw new Error('You must be signed in to update your profile.');
      }

      const next: OwnProfileData = { ...profile, ...patch };

      if (isFirestoreAvailable() && !authDevBypass) {
        const updated = await usersService.updateOwnProfile(user.uid, {
          displayName: next.displayName,
          bio: next.bio,
          city: next.city,
          teachTopics: next.teachTopics,
          learnTopics: next.learnTopics,
        });
        await saveOwnProfile(user.uid, authProfileToOwnData(updated));
        await refreshProfile();
        return;
      }

      await saveOwnProfile(user.uid, next);
      await refreshProfile();
    },
    [user?.uid, profile, refreshProfile, authDevBypass]
  );

  const value = useMemo<OwnProfileContextValue>(
    () => ({
      profile,
      viewModel,
      loading,
      updateProfile,
    }),
    [profile, viewModel, loading, updateProfile]
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
