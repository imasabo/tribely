import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
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

import { auth } from '@/lib/firebase';

const ONBOARDING_KEY = 'tribely.has_seen_onboarding';

type AuthContextValue = {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const seen = await SecureStore.getItemAsync(ONBOARDING_KEY);
        if (mounted) setHasSeenOnboarding(seen === 'true');
      } finally {
        // auth listener will set loading false
      }
    }

    bootstrap();

    const unsubscribe = auth().onAuthStateChanged((nextUser) => {
      if (mounted) {
        setUser(nextUser);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const completeOnboarding = useCallback(async () => {
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
    setHasSeenOnboarding(true);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    // Phase 1: @react-native-google-signin + Firebase credential
    // Temporary: anonymous sign-in to validate auth gate (enable in Firebase Console)
    await auth().signInAnonymously();
  }, []);

  const signOut = useCallback(async () => {
    await auth().signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      hasSeenOnboarding,
      isAuthenticated: !!user,
      signInWithGoogle,
      signOut,
      completeOnboarding,
    }),
    [user, loading, hasSeenOnboarding, signInWithGoogle, signOut, completeOnboarding]
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
