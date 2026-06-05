import { Redirect } from 'expo-router';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/providers/AuthProvider';

export default function RootIndex() {
  const {
    loading,
    profile,
    profileLoading,
    isAuthenticated,
    hasSeenOnboarding,
    needsUsernameOnboarding,
    needsProfileSetup,
  } = useAuth();

  if (loading || (isAuthenticated && profileLoading && !profile)) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    if (needsUsernameOnboarding) {
      return <Redirect href="/(auth)/setup-username" />;
    }
    if (needsProfileSetup) {
      return <Redirect href="/(auth)/setup-profile" />;
    }
    return <Redirect href="/(tabs)" />;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
