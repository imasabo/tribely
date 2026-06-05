import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { configureGoogleSignIn, signInWithGoogleCredential, signOutGoogle } from '@/lib/googleSignIn';
import { getAuth, isFirebaseNativeAvailable } from '@/lib/firebase';
import { normalizeUsernameInput } from '@/lib/username';
import { usersService } from '@/services/users.service';
import { usernameService } from '@/services/username.service';
import type { AuthUser } from '@/types/auth';
import type { UserProfile } from '@/types/userProfile';

const ONBOARDING_KEY = 'tribely.has_seen_onboarding';
const DEV_USER_KEY = 'tribely.dev_auth_user';

const DEV_MOCK_USER: AuthUser = {
  uid: 'dev-user-alex',
  email: 'alex@example.com',
  displayName: 'Alex Kim',
};

const DEV_MOCK_PROFILE: UserProfile = {
  uid: DEV_MOCK_USER.uid,
  username: 'alexkim',
  displayName: DEV_MOCK_USER.displayName ?? 'Alex Kim',
  email: DEV_MOCK_USER.email ?? '',
  role: 'both',
  bio: '',
  teachTopics: ['Guitar', 'Music Theory'],
  learnTopics: ['Spanish', 'Photography'],
  onboardingComplete: true,
};

type AuthContextValue = {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  needsUsernameOnboarding: boolean;
  isDevAuth: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  completeUsernameOnboarding: (input: {
    username: string;
    displayName?: string;
  }) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapFirebaseUser(fbUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}): AuthUser {
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName,
    photoURL: fbUser.photoURL ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const isDevAuth = !isFirebaseNativeAvailable;

  const loadProfileForUser = useCallback(async (authUser: AuthUser) => {
    setProfileLoading(true);
    try {
      const loaded = await usersService.getProfile(authUser.uid);
      if (loaded) {
        setProfile(loaded);
        return;
      }
      const created = await usersService.ensureStubProfile(authUser);
      setProfile(created);
    } catch (error) {
      console.warn('[Tribely] Failed to load user profile', error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFirebaseNativeAvailable) {
      configureGoogleSignIn();
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    async function bootstrap() {
      try {
        const seen = await SecureStore.getItemAsync(ONBOARDING_KEY);
        if (mounted) setHasSeenOnboarding(seen === 'true');

        const auth = getAuth();

        if (auth) {
          unsubscribe = auth().onAuthStateChanged(async (fbUser) => {
            if (!mounted) return;

            if (!fbUser) {
              setUser(null);
              setProfile(null);
              setProfileLoading(false);
              setLoading(false);
              return;
            }

            const mapped = mapFirebaseUser(fbUser);
            setUser(mapped);
            setLoading(false);
            await loadProfileForUser(mapped);
          });
          return;
        }

        const stored = await SecureStore.getItemAsync(DEV_USER_KEY);
        if (mounted && stored) {
          const parsed = JSON.parse(stored) as AuthUser;
          setUser(parsed);
          setProfile(DEV_MOCK_PROFILE);
        }
      } catch {
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    bootstrap();

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, [loadProfileForUser]);

  const completeOnboarding = useCallback(async () => {
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
    setHasSeenOnboarding(true);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    if (isDevAuth) {
      setProfile(DEV_MOCK_PROFILE);
      return;
    }
    await loadProfileForUser(user);
  }, [user, isDevAuth, loadProfileForUser]);

  const signInWithGoogle = useCallback(async () => {
    const auth = getAuth();

    if (auth) {
      await signInWithGoogleCredential();
      return;
    }

    await SecureStore.setItemAsync(DEV_USER_KEY, JSON.stringify(DEV_MOCK_USER));
    setUser(DEV_MOCK_USER);
    setProfile(DEV_MOCK_PROFILE);
  }, []);

  const signOut = useCallback(async () => {
    const auth = getAuth();
    if (auth) {
      await signOutGoogle();
      await auth().signOut();
      return;
    }
    await SecureStore.deleteItemAsync(DEV_USER_KEY);
    setUser(null);
    setProfile(null);
  }, []);

  const completeUsernameOnboarding = useCallback(
    async (input: { username: string; displayName?: string }) => {
      if (!user) {
        throw new Error('You must be signed in to choose a username.');
      }
      if (isDevAuth) {
        setProfile({
          ...DEV_MOCK_PROFILE,
          username: input.username.trim().toLowerCase(),
          displayName: input.displayName?.trim() || DEV_MOCK_PROFILE.displayName,
          onboardingComplete: true,
        });
        return;
      }

      const auth = getAuth();
      const firebaseUid = auth?.().currentUser?.uid ?? user.uid;
      if (!firebaseUid) {
        throw new Error('You must be signed in to choose a username.');
      }

      const normalized = normalizeUsernameInput(input.username);

      await usersService.ensureStubProfile({
        uid: firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      await usernameService.claimUsername({
        uid: firebaseUid,
        username: normalized,
        previousUsername: profile?.username,
      });
      const updated = await usersService.updateAfterUsernameClaim(firebaseUid, {
        username: normalized,
        displayName: input.displayName,
      });
      setProfile(updated);
    },
    [user, isDevAuth, profile?.username]
  );

  const needsUsernameOnboarding =
    !!user && !profileLoading && (profile == null || !profile.onboardingComplete);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      profileLoading,
      hasSeenOnboarding,
      isAuthenticated: !!user,
      needsUsernameOnboarding,
      isDevAuth,
      signInWithGoogle,
      signOut,
      completeOnboarding,
      completeUsernameOnboarding,
      refreshProfile,
    }),
    [
      user,
      profile,
      loading,
      profileLoading,
      hasSeenOnboarding,
      needsUsernameOnboarding,
      isDevAuth,
      signInWithGoogle,
      signOut,
      completeOnboarding,
      completeUsernameOnboarding,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
