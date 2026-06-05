import { Redirect, Stack, useSegments } from 'expo-router';
import { View } from 'react-native';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { screenStyle, stackContentStyle } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthLayout() {
  const {
    loading,
    profile,
    profileLoading,
    isAuthenticated,
    needsUsernameOnboarding,
    needsProfileSetup,
  } = useAuth();
  const segments = useSegments();
  const current = segments[segments.length - 1];
  const onSetupUsername = current === 'setup-username';
  const onSetupProfile = current === 'setup-profile';

  if (loading || (isAuthenticated && profileLoading && !profile)) {
    return (
      <View style={screenStyle}>
        <LoadingScreen />
      </View>
    );
  }

  if (isAuthenticated && needsUsernameOnboarding && !onSetupUsername) {
    return <Redirect href="/(auth)/setup-username" />;
  }

  if (isAuthenticated && needsProfileSetup && !onSetupProfile) {
    return <Redirect href="/(auth)/setup-profile" />;
  }

  if (isAuthenticated && !needsUsernameOnboarding && !needsProfileSetup) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={screenStyle}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: stackContentStyle,
        }}
      />
    </View>
  );
}
