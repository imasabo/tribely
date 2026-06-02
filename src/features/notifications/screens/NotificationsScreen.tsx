import { Feather } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NotificationItem } from '@/components/notifications/NotificationItem';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';

export function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { notifications, loading, error, markAllRead, markRead } = useNotifications();

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  const handlePress = (id: string, href?: string) => {
    markRead(id);
    if (href) {
      router.push(href as Href);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading notifications…" />;
  }

  if (error) {
    return <CenteredMessage message={error} />;
  }

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center gap-3 border-b border-border px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}>
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-muted active:opacity-80">
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text className="flex-1 text-[17px] font-semibold text-foreground">Notifications</Text>
      </View>

      {notifications.length === 0 ? (
        <CenteredMessage message="You’re all caught up — no notifications yet." />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onPress={() => handlePress(item.id, item.href)}
            />
          )}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        />
      )}
    </View>
  );
}
