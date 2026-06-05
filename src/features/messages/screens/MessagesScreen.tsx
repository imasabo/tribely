import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/Avatar';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { colors } from '@/constants/theme';
import { truncateInboxTitle } from '@/lib/truncateText';
import { useAuth } from '@/providers/AuthProvider';
import { lessonChatService } from '@/services/lessonChat.service';
import type { LessonChatInboxItem } from '@/types/lessonChat';

function InboxRow({ item, onPress }: { item: LessonChatInboxItem; onPress: () => void }) {
  const preview = item.lastMessageBody
    ? item.lastMessageSender
      ? `${item.lastMessageSender}: ${item.lastMessageBody}`
      : item.lastMessageBody
    : 'No messages yet';

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 border-b border-border bg-card py-4 pl-3 pr-5 active:opacity-90">
      <View className="w-3 items-center justify-center self-stretch">
        {item.hasUnread ? (
          <View
            className="h-2.5 w-2.5 rounded-full bg-primary"
            accessibilityLabel="Unread messages"
          />
        ) : null}
      </View>
      <Avatar size="inbox" initials={item.teacherAvatar} personPlaceholder />
      <View className="min-w-0 flex-1 shrink">
        <View className="min-w-0 flex-row items-center gap-2">
          <Text
            accessibilityLabel={item.title}
            ellipsizeMode="tail"
            numberOfLines={1}
            className={`min-w-0 flex-1 shrink text-base ${item.hasUnread ? 'font-bold' : 'font-semibold'} text-foreground`}>
            {truncateInboxTitle(item.title)}
          </Text>
          {item.lastMessageAtLabel ? (
            <Text className="shrink-0 text-[11px] text-muted-foreground">
              {item.lastMessageAtLabel}
            </Text>
          ) : null}
        </View>
        <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={1}>
          {item.isHost ? 'Your lesson' : item.teacherName} · {item.scheduledAtLabel}
        </Text>
        <Text
          className={`mt-1 text-sm ${item.hasUnread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
          numberOfLines={2}>
          {preview}
        </Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

export function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [items, setItems] = useState<LessonChatInboxItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInbox = useCallback(async () => {
    setLoading(true);
    const inbox = await lessonChatService.listInbox(user?.uid);
    setItems(inbox);
    setLoading(false);
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      void loadInbox();
    }, [loadInbox])
  );

  return (
    <View className="flex-1 bg-background">
      <View
        className="border-b border-border px-5 pb-4"
        style={{ paddingTop: insets.top + 12 }}>
        <Text className="text-2xl font-bold text-foreground">Messages</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Lesson chats with your hosts and learners
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : items.length === 0 ? (
        <CenteredMessage message="No lesson chats yet. Join or host a lesson to start messaging." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.lessonId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          renderItem={({ item }) => (
            <InboxRow item={item} onPress={() => router.push(`/lesson/${item.lessonId}/chat`)} />
          )}
        />
      )}
    </View>
  );
}
