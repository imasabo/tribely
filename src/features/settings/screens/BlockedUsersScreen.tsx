import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { BlockedUserRow } from '@/features/settings/components/BlockedUserRow';
import { useBlockedUsers } from '@/providers/BlockedUsersProvider';

export function BlockedUsersScreen() {
  const insets = useSafeAreaInsets();
  const { blockedUsers, loading, unblockUser } = useBlockedUsers();

  const confirmUnblock = (displayName: string, userId: string) => {
    Alert.alert(
      `Unblock ${displayName}?`,
      'They will be able to view your profile and send you friend requests again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: () => void unblockUser(userId),
        },
      ]
    );
  };

  if (loading) {
    return <LoadingScreen message="Loading blocked users…" />;
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
        <Text className="flex-1 text-[17px] font-semibold text-foreground">Blocked users</Text>
      </View>

      {blockedUsers.length === 0 ? (
        <CenteredMessage message="You haven't blocked anyone. Blocked people can't see your profile or contact you on Tribely." />
      ) : (
        <>
          <Text className="px-5 pb-2 pt-4 text-xs text-muted-foreground">
            Blocked people can't see your profile, lessons, or send you friend requests.
          </Text>
          <FlatList
            data={blockedUsers}
            keyExtractor={(item) => item.userId}
            renderItem={({ item }) => (
              <BlockedUserRow
                user={item}
                onUnblock={() => confirmUnblock(item.displayName, item.userId)}
              />
            )}
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          />
        </>
      )}
    </View>
  );
}
