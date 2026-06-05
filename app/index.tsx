import { Redirect } from 'expo-router';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/providers/AuthProvider';

export default function RootIndex() {
  const {
    loading,
    profileLoading,
    isAuthenticated,
    hasSeenOnboarding,
    needsUsernameOnboarding,
  } = useAuth();

  if (loading || (isAuthenticated && profileLoading)) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    if (needsUsernameOnboarding) {
      return <Redirect href="/(auth)/setup-username" />;
    }
    return <Redirect href="/(tabs)" />;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
