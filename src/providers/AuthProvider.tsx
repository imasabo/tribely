import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { isAuthDevBypassEnabled, isRealAuthEnabled } from '@/constants/devFlags';
import { configureGoogleSignIn, signInWithGoogleCredential, signOutGoogle } from '@/lib/googleSignIn';
import { getAuth, isFirebaseNativeAvailable } from '@/lib/firebase';
import { loadOwnProfile } from '@/lib/ownProfileStorage';
import { isValidUsername, normalizeUsernameInput } from '@/lib/username';
import { usersService } from '@/services/users.service';
import { usernameService } from '@/services/username.service';
import type { AuthUser } from '@/types/auth';
import { EMPTY_USER_PROFILE_STATS, type UserProfile } from '@/types/userProfile';

const ONBOARDING_KEY = 'tribely.has_seen_onboarding';
const DEV_USER_KEY = 'tribely.dev_auth_user';

const PREVIEW_AUTH_USER: AuthUser = {
  uid: 'dev-preview-user',
  email: 'preview@tribely.app',
  displayName: 'Preview User',
};

const PREVIEW_AUTH_PROFILE: UserProfile = {
  uid: PREVIEW_AUTH_USER.uid,
  username: null,
  displayName: PREVIEW_AUTH_USER.displayName ?? 'Preview User',
  email: PREVIEW_AUTH_USER.email ?? '',
  role: 'both',
  bio: '',
  teachTopics: [],
  learnTopics: [],
  stats: { ...EMPTY_USER_PROFILE_STATS },
  onboardingComplete: false,
};

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
  city: 'San Francisco, CA',
  teachTopics: ['Guitar', 'Music Theory'],
  learnTopics: ['Spanish', 'Photography'],
  stats: { rating: 0, lessonsTaught: 0, students: 0, reviews: 0 },
  joinedAtLabel: 'Joined March 2025',
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
  needsProfileSetup: boolean;
  isDevAuth: boolean;
  /** True when EXPO_PUBLIC_USE_REAL_AUTH is enabled (always true in production). */
  useRealAuth: boolean;
  /** True when using Expo Go mock auth or dev auth bypass (preview user). */
  authDevBypass: boolean;
  signInWithGoogle: () => Promise<void>;
  /** Dev only: mock user with no credentials; UI uses local mock data only. */
  signInAsGuest: () => Promise<void>;
  /** Dev only: mock user that still needs username onboarding (sign-up flow preview). */
  signInForUsernamePreview: () => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  completeUsernameOnboarding: (input: { username: string }) => Promise<void>;
  completeProfileSetup: (input: {
    displayName: string;
    bio?: string;
    city?: string;
    teachTopics: string[];
    learnTopics: string[];
  }) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

function fallbackProfileFromAuth(authUser: AuthUser): UserProfile {
  return {
    uid: authUser.uid,
    username: null,
    displayName: authUser.displayName?.trim() || 'New member',
    email: authUser.email ?? '',
    photoURL: authUser.photoURL ?? undefined,
    role: 'both',
    bio: '',
    teachTopics: [],
    learnTopics: [],
    stats: { ...EMPTY_USER_PROFILE_STATS },
    onboardingComplete: false,
  };
}

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
  const useRealAuth = isRealAuthEnabled();
  const authDevBypass = isDevAuth || isAuthDevBypassEnabled();
  const previewAuthRef = useRef(false);

  const loadProfileForUser = useCallback(
    async (authUser: AuthUser, options?: { background?: boolean }) => {
      const background = options?.background ?? false;
      if (!background) {
        setProfileLoading(true);
      }
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
        setProfile((current) => current ?? fallbackProfileFromAuth(authUser));
      } finally {
        if (!background) {
          setProfileLoading(false);
        }
      }
    },
    []
  );

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
          if (isAuthDevBypassEnabled()) {
            const stored = await SecureStore.getItemAsync(DEV_USER_KEY);
            if (mounted && stored) {
              const parsed = JSON.parse(stored) as
                | AuthUser
                | { user: AuthUser; profile: UserProfile };
              previewAuthRef.current = true;
              if (typeof parsed === 'object' && parsed !== null && 'profile' in parsed) {
                setUser(parsed.user);
                setProfile(parsed.profile);
              } else {
                const authUser = parsed as AuthUser;
                setUser(authUser);
                setProfile(
                  authUser.uid === PREVIEW_AUTH_USER.uid
                    ? { ...PREVIEW_AUTH_PROFILE, onboardingComplete: true }
                    : DEV_MOCK_PROFILE
                );
              }
              setProfileLoading(false);
              setLoading(false);
            }
          }

          unsubscribe = auth().onAuthStateChanged(async (fbUser) => {
            if (!mounted || previewAuthRef.current) return;

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

          if (previewAuthRef.current) {
            return;
          }
          return;
        }

        const stored = await SecureStore.getItemAsync(DEV_USER_KEY);
        if (mounted && stored) {
          const parsed = JSON.parse(stored) as
            | AuthUser
            | { user: AuthUser; profile: UserProfile };
          if (typeof parsed === 'object' && parsed !== null && 'profile' in parsed) {
            setUser(parsed.user);
            setProfile(parsed.profile);
          } else {
            setUser(parsed as AuthUser);
            setProfile(DEV_MOCK_PROFILE);
          }
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

    if (authDevBypass) {
      const stored = await loadOwnProfile(user.uid);
      setProfile((current) => {
        const base =
          current?.onboardingComplete
            ? current
            : user.uid === PREVIEW_AUTH_USER.uid
              ? { ...PREVIEW_AUTH_PROFILE, onboardingComplete: true }
              : DEV_MOCK_PROFILE;

        if (!stored) return base;

        return {
          ...base,
          uid: user.uid,
          username: isValidUsername(stored.username) ? stored.username : base.username,
          displayName: stored.displayName || base.displayName,
          bio: stored.bio ?? base.bio,
          teachTopics: stored.teachTopics ?? base.teachTopics,
          learnTopics: stored.learnTopics ?? base.learnTopics,
          onboardingComplete: true,
        };
      });
      return;
    }

    if (isDevAuth) {
      setProfile(DEV_MOCK_PROFILE);
      return;
    }
    await loadProfileForUser(user, { background: true });
  }, [user, isDevAuth, authDevBypass, loadProfileForUser]);

  const startDevGuestSession = useCallback(async () => {
    previewAuthRef.current = true;
    const auth = getAuth();
    if (auth) {
      try {
        await signOutGoogle();
        await auth().signOut();
      } catch {
        // Ignore when no Firebase session exists
      }
    }
    await SecureStore.setItemAsync(
      DEV_USER_KEY,
      JSON.stringify({ user: DEV_MOCK_USER, profile: DEV_MOCK_PROFILE })
    );
    setUser(DEV_MOCK_USER);
    setProfile(DEV_MOCK_PROFILE);
    setProfileLoading(false);
  }, []);

  const signInAsGuest = useCallback(async () => {
    if (!authDevBypass) {
      throw new Error('Guest sign-in is only available in development.');
    }
    await startDevGuestSession();
  }, [authDevBypass, startDevGuestSession]);

  const signInForUsernamePreview = useCallback(async () => {
    if (!__DEV__) {
      throw new Error('Username preview is only available in development.');
    }
    previewAuthRef.current = true;
    const auth = getAuth();
    if (auth) {
      try {
        await signOutGoogle();
        await auth().signOut();
      } catch {
        // Ignore when no Firebase session exists
      }
    }
    try {
      await SecureStore.deleteItemAsync(DEV_USER_KEY);
    } catch {
      // Key may not exist
    }
    setUser(PREVIEW_AUTH_USER);
    setProfile(PREVIEW_AUTH_PROFILE);
    setProfileLoading(false);
  }, [authDevBypass]);

  const signInWithGoogle = useCallback(async () => {
    const auth = getAuth();
    if (auth) {
      await signInWithGoogleCredential();
      return;
    }

    if (authDevBypass) {
      await startDevGuestSession();
    }
  }, [authDevBypass, startDevGuestSession]);

  const signOut = useCallback(async () => {
    previewAuthRef.current = false;
    setUser(null);
    setProfile(null);
    setProfileLoading(false);
    try {
      await SecureStore.deleteItemAsync(DEV_USER_KEY);
    } catch {
      // Key may not exist
    }

    const auth = getAuth();
    if (auth) {
      try {
        await signOutGoogle();
        await auth().signOut();
      } catch {
        // Ignore when Firebase is unavailable
      }
    }
  }, []);

  const completeUsernameOnboarding = useCallback(
    async (input: { username: string }) => {
      if (!user) {
        throw new Error('You must be signed in to choose a username.');
      }
      const useLocalSave =
        authDevBypass || previewAuthRef.current || user.uid === PREVIEW_AUTH_USER.uid;

      if (useLocalSave) {
        const base =
          previewAuthRef.current || user.uid === PREVIEW_AUTH_USER.uid
            ? PREVIEW_AUTH_PROFILE
            : DEV_MOCK_PROFILE;
        const normalized = normalizeUsernameInput(input.username);
        const nextProfile: UserProfile = {
          ...base,
          uid: user.uid,
          email: user.email ?? base.email,
          username: normalized,
          displayName: user.displayName || base.displayName,
          onboardingComplete: false,
        };
        previewAuthRef.current = true;
        setProfile(nextProfile);
        setProfileLoading(false);
        try {
          await SecureStore.setItemAsync(
            DEV_USER_KEY,
            JSON.stringify({ user, profile: nextProfile })
          );
        } catch (error) {
          console.warn('[Tribely] Dev username saved in memory only', error);
        }
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
        displayName: user.displayName ?? undefined,
      });
      setProfile(updated);
    },
    [user, authDevBypass, profile?.username]
  );

  const completeProfileSetup = useCallback(
    async (input: {
      displayName: string;
      bio?: string;
      city?: string;
      teachTopics: string[];
      learnTopics: string[];
    }) => {
      if (!user) {
        throw new Error('You must be signed in to set up your profile.');
      }

      const useLocalSave =
        authDevBypass || previewAuthRef.current || user.uid === PREVIEW_AUTH_USER.uid;

      if (useLocalSave) {
        const base =
          previewAuthRef.current || user.uid === PREVIEW_AUTH_USER.uid
            ? PREVIEW_AUTH_PROFILE
            : DEV_MOCK_PROFILE;
        const nextProfile: UserProfile = {
          ...base,
          uid: user.uid,
          email: user.email ?? base.email,
          username: profile?.username ?? base.username,
          displayName: input.displayName.trim(),
          bio: input.bio?.trim() ?? '',
          city: input.city?.trim() || undefined,
          teachTopics: input.teachTopics,
          learnTopics: input.learnTopics,
          onboardingComplete: true,
        };
        previewAuthRef.current = true;
        setProfile(nextProfile);
        setProfileLoading(false);
        try {
          await SecureStore.setItemAsync(
            DEV_USER_KEY,
            JSON.stringify({ user, profile: nextProfile })
          );
        } catch (error) {
          console.warn('[Tribely] Dev profile saved in memory only', error);
        }
        return;
      }

      const auth = getAuth();
      const firebaseUid = auth?.().currentUser?.uid ?? user.uid;
      if (!firebaseUid) {
        throw new Error('You must be signed in to set up your profile.');
      }

      const updated = await usersService.completeProfileSetup(firebaseUid, input);
      setProfile(updated);
    },
    [user, authDevBypass, profile?.username]
  );

  const needsUsernameOnboarding =
    !!user && !profileLoading && !profile?.username;

  const needsProfileSetup =
    !!user && !profileLoading && !!profile?.username && !profile.onboardingComplete;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      profileLoading,
      hasSeenOnboarding,
      isAuthenticated: !!user,
      needsUsernameOnboarding,
      needsProfileSetup,
      isDevAuth,
      useRealAuth,
      authDevBypass,
      signInWithGoogle,
      signInAsGuest,
      signInForUsernamePreview,
      signOut,
      completeOnboarding,
      completeUsernameOnboarding,
      completeProfileSetup,
      refreshProfile,
    }),
    [
      user,
      profile,
      loading,
      profileLoading,
      hasSeenOnboarding,
      needsUsernameOnboarding,
      needsProfileSetup,
      isDevAuth,
      useRealAuth,
      authDevBypass,
      signInWithGoogle,
      signInAsGuest,
      signInForUsernamePreview,
      signOut,
      completeOnboarding,
      completeUsernameOnboarding,
      completeProfileSetup,
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
