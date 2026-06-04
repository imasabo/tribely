import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import {
  SettingsDivider,
  SettingsSection,
} from '@/features/settings/components/SettingsSection';
import {
  SettingsNavRow,
  SettingsToggleRow,
  SettingsValueRow,
} from '@/features/settings/components/SettingsRow';
import { useBlockedUsers } from '@/providers/BlockedUsersProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useSettings } from '@/providers/SettingsProvider';

const HELP_URL = 'https://tribely.app/help';
const TERMS_URL = 'https://tribely.app/terms';
const PRIVACY_URL = 'https://tribely.app/privacy';

async function openExternalUrl(url: string, label: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await WebBrowser.openBrowserAsync(url);
      return;
    }
  } catch {
    // fall through
  }

  Alert.alert(label, 'This link is not available yet. Check back soon.');
}

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut, isDevAuth } = useAuth();
  const { settings, loading, updateNotifications, updatePrivacy } = useSettings();
  const { blockedUsers } = useBlockedUsers();

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out of Tribely?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          void signOut().then(() => {
            router.replace('/(auth)/sign-in');
          });
        },
      },
    ]);
  };

  if (loading) {
    return <LoadingScreen message="Loading settings…" />;
  }

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center gap-3 border-b border-border px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-9 w-9 items-center justify-center rounded-full bg-muted active:opacity-80">
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text className="flex-1 text-[17px] font-semibold text-foreground">Settings</Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag">
        <SettingsSection title="Account">
          <SettingsNavRow
            icon="user"
            label="Edit profile"
            subtitle="Name, bio, topics, and username"
            onPress={() => router.push('/edit-profile')}
          />
          <SettingsDivider />
          <SettingsValueRow
            label="Email"
            value={user?.email ?? 'Not set'}
            subtitle={isDevAuth ? 'Dev session (Expo Go)' : undefined}
          />
        </SettingsSection>

        <SettingsSection
          title="Notifications"
          footer="Push notifications will be available in a future update. These preferences are saved for when they launch.">
          <SettingsNavRow
            icon="bell"
            label="Notification inbox"
            subtitle="See recent activity and friend updates"
            onPress={() => router.push('/notifications')}
          />
          <SettingsDivider />
          <SettingsToggleRow
            label="Lesson reminders"
            subtitle="Upcoming sessions you're teaching or attending"
            value={settings.notifications.lessonReminders}
            onValueChange={(lessonReminders) => void updateNotifications({ lessonReminders })}
          />
          <SettingsDivider />
          <SettingsToggleRow
            label="Friend activity"
            subtitle="When friends complete a lesson"
            value={settings.notifications.friendActivity}
            onValueChange={(friendActivity) => void updateNotifications({ friendActivity })}
          />
          <SettingsDivider />
          <SettingsToggleRow
            label="Comments and likes"
            subtitle="On your activity posts"
            value={settings.notifications.commentsAndLikes}
            onValueChange={(commentsAndLikes) =>
              void updateNotifications({ commentsAndLikes })
            }
          />
          <SettingsDivider />
          <SettingsToggleRow
            label="Friend requests"
            subtitle="When someone wants to connect"
            value={settings.notifications.friendRequests}
            onValueChange={(friendRequests) => void updateNotifications({ friendRequests })}
          />
        </SettingsSection>

        <SettingsSection
          title="Privacy"
          footer="Visibility controls will apply when public profiles launch on Tribely.">
          <SettingsToggleRow
            label="Public profile"
            subtitle="Allow others to find and view your profile"
            value={settings.privacy.profileVisible}
            onValueChange={(profileVisible) => void updatePrivacy({ profileVisible })}
          />
          <SettingsDivider />
          <SettingsNavRow
            icon="slash"
            label="Blocked users"
            subtitle={
              blockedUsers.length === 0
                ? 'Manage people you have blocked'
                : `${blockedUsers.length} blocked`
            }
            onPress={() => router.push('/blocked-users')}
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsNavRow
            icon="help-circle"
            label="Help center"
            onPress={() => void openExternalUrl(HELP_URL, 'Help center')}
          />
          <SettingsDivider />
          <SettingsNavRow
            icon="file-text"
            label="Terms of service"
            onPress={() => void openExternalUrl(TERMS_URL, 'Terms of service')}
          />
          <SettingsDivider />
          <SettingsNavRow
            icon="shield"
            label="Privacy policy"
            onPress={() => void openExternalUrl(PRIVACY_URL, 'Privacy policy')}
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsValueRow label="Version" value={appVersion} />
        </SettingsSection>

        <View className="overflow-hidden rounded-2xl border border-border bg-card">
          <Pressable
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            className="items-center px-4 py-3.5 active:opacity-80">
            <Text className="text-[15px] font-semibold text-destructive">Sign out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
