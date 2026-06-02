import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { ActivityEngagementProvider } from '@/providers/ActivityEngagementProvider';
import { AuthProvider } from '@/providers/AuthProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ActivityEngagementProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="create" options={{ presentation: 'card' }} />
            <Stack.Screen name="search" options={{ presentation: 'card' }} />
            <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
            <Stack.Screen name="activity/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="lesson/[id]" options={{ presentation: 'card' }} />
          </Stack>
        </ActivityEngagementProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
