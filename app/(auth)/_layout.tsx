import { Redirect, Stack, useSegments } from 'expo-router';
import { View } from 'react-native';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { screenStyle, stackContentStyle } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthLayout() {
  const {
    loading,
    profileLoading,
    isAuthenticated,
    needsUsernameOnboarding,
  } = useAuth();
  const segments = useSegments();
  const onSetupUsername = segments[segments.length - 1] === 'setup-username';

  if (loading || (isAuthenticated && profileLoading)) {
    return (
      <View style={screenStyle}>
        <LoadingScreen />
      </View>
    );
  }

  if (isAuthenticated && needsUsernameOnboarding && !onSetupUsername) {
    return <Redirect href="/(auth)/setup-username" />;
  }

  if (isAuthenticated && !needsUsernameOnboarding) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={screenStyle}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: stackContentStyle,
          sceneStyle: stackContentStyle,
        }}
      />
    </View>
  );
}
