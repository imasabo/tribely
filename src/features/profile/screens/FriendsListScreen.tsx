import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { FriendListRow } from '@/features/profile/components/FriendListRow';
import { useFriendConnections } from '@/providers/FriendConnectionsProvider';

export function FriendsListScreen() {
  const insets = useSafeAreaInsets();
  const { friends, friendCount, loading, reload } = useFriendConnections();

  useFocusEffect(
    useCallback(() => {
      void reload({ background: true });
    }, [reload])
  );

  if (loading && friends.length === 0) {
    return <LoadingScreen message="Loading friends…" />;
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
        <Text className="flex-1 text-[17px] font-semibold text-foreground">Friends</Text>
        <Text className="text-[15px] font-semibold text-muted-foreground">{friendCount}</Text>
      </View>

      {friends.length === 0 ? (
        <CenteredMessage message="You haven't added any friends yet. Connect with people after a lesson or from their profile." />
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <FriendListRow
              friend={item}
              onPress={() => router.push(`/user/${item.userId}`)}
            />
          )}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        />
      )}
    </View>
  );
}
