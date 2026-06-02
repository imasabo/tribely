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

import { getAuth, isFirebaseNativeAvailable } from '@/lib/firebase';
import type { AuthUser } from '@/types/auth';

const ONBOARDING_KEY = 'tribely.has_seen_onboarding';
const DEV_USER_KEY = 'tribely.dev_auth_user';

const DEV_MOCK_USER: AuthUser = {
  uid: 'dev-user-alex',
  email: 'alex@example.com',
  displayName: 'Alex Kim',
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  /** True when using local mock auth (Expo Go). Firebase requires a dev build. */
  isDevAuth: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapFirebaseUser(fbUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
}): AuthUser {
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const isDevAuth = !isFirebaseNativeAvailable;

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    async function bootstrap() {
      try {
        const seen = await SecureStore.getItemAsync(ONBOARDING_KEY);
        if (mounted) setHasSeenOnboarding(seen === 'true');

        const auth = getAuth();

        if (auth) {
          unsubscribe = auth().onAuthStateChanged((fbUser) => {
            if (!mounted) return;
            setUser(fbUser ? mapFirebaseUser(fbUser) : null);
            setLoading(false);
          });
          return;
        }

        // Expo Go: restore dev session if present
        const stored = await SecureStore.getItemAsync(DEV_USER_KEY);
        if (mounted && stored) {
          setUser(JSON.parse(stored) as AuthUser);
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    bootstrap();

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  const completeOnboarding = useCallback(async () => {
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
    setHasSeenOnboarding(true);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const auth = getAuth();

    if (auth) {
      // Phase 1: Google Sign-In credential — anonymous for gate testing until then
      await auth().signInAnonymously();
      return;
    }

    // Expo Go: local dev session (UI / navigation testing only)
    await SecureStore.setItemAsync(DEV_USER_KEY, JSON.stringify(DEV_MOCK_USER));
    setUser(DEV_MOCK_USER);
  }, []);

  const signOut = useCallback(async () => {
    const auth = getAuth();
    if (auth) {
      await auth().signOut();
      return;
    }
    await SecureStore.deleteItemAsync(DEV_USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      hasSeenOnboarding,
      isAuthenticated: !!user,
      isDevAuth,
      signInWithGoogle,
      signOut,
      completeOnboarding,
    }),
    [user, loading, hasSeenOnboarding, isDevAuth, signInWithGoogle, signOut, completeOnboarding]
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
