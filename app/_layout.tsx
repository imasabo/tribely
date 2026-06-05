import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { ActivityEngagementProvider } from '@/providers/ActivityEngagementProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { OwnProfileProvider } from '@/providers/OwnProfileProvider';
import { BlockedUsersProvider } from '@/providers/BlockedUsersProvider';
import { FriendConnectionsProvider } from '@/providers/FriendConnectionsProvider';
import { SettingsProvider } from '@/providers/SettingsProvider';
import { DiscoverFiltersModal } from '@/features/discover/components/DiscoverFiltersModal';
import { DiscoverFiltersProvider } from '@/providers/DiscoverFiltersProvider';
import { DiscoverLocationProvider } from '@/providers/DiscoverLocationProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <OwnProfileProvider>
        <SettingsProvider>
        <BlockedUsersProvider>
        <FriendConnectionsProvider>
        <DiscoverFiltersProvider>
          <DiscoverLocationProvider>
          <ActivityEngagementProvider>
            <StatusBar style="dark" />
            <DiscoverFiltersModal />
            <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="create" options={{ presentation: 'card' }} />
            <Stack.Screen name="edit-profile" options={{ presentation: 'card' }} />
            <Stack.Screen name="settings" options={{ presentation: 'card' }} />
            <Stack.Screen name="blocked-users" options={{ presentation: 'card' }} />
            <Stack.Screen name="report-user" options={{ presentation: 'card' }} />
            <Stack.Screen name="friends" options={{ presentation: 'card' }} />
            <Stack.Screen name="taught-lesson/[lessonId]" options={{ presentation: 'card' }} />
            <Stack.Screen name="lessons" options={{ presentation: 'card' }} />
            <Stack.Screen name="upcoming-lessons" options={{ presentation: 'card' }} />
            <Stack.Screen name="search" options={{ presentation: 'card' }} />
            <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
            <Stack.Screen name="activity/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="user/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="user/[id]/taught" options={{ presentation: 'card' }} />
            <Stack.Screen name="user/[id]/students" options={{ presentation: 'card' }} />
            <Stack.Screen name="user/[id]/reviews" options={{ presentation: 'card' }} />
            <Stack.Screen name="lesson/[id]/index" options={{ presentation: 'card' }} />
            <Stack.Screen name="lesson/[id]/chat" options={{ presentation: 'card' }} />
            <Stack.Screen name="lesson/[id]/complete" options={{ presentation: 'card' }} />
            <Stack.Screen name="lesson/[id]/rate-learners" options={{ presentation: 'card' }} />
            <Stack.Screen
              name="lesson/[id]/slides"
              options={{ presentation: 'fullScreenModal', animation: 'fade' }}
            />
            </Stack>
          </ActivityEngagementProvider>
          </DiscoverLocationProvider>
        </DiscoverFiltersProvider>
        </FriendConnectionsProvider>
        </BlockedUsersProvider>
        </SettingsProvider>
        </OwnProfileProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
