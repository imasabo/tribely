import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { DismissKeyboard } from '@/components/ui/DismissKeyboard';
import { LessonChatMessageBubble } from '@/features/lessons/components/LessonChatMessageBubble';
import { colors } from '@/constants/theme';
import { chatMemberCount } from '@/lib/lessonChatAccess';
import { OWN_PROFILE_STATS_USER_ID } from '@/features/profile/lib/ownProfileStats';
import { isLessonOwner } from '@/lib/lessonEnrollment';
import { useLesson } from '@/features/lessons/hooks/useLesson';
import { useAuth } from '@/providers/AuthProvider';
import { lessonChatService } from '@/services/lessonChat.service';
import { lessonJoinRequestsService } from '@/services/lessonJoinRequests.service';
import type { LessonChatMessage } from '@/types/lessonChat';

interface LessonChatScreenProps {
  lessonId: string;
}

type ChatListItem =
  | { type: 'date'; id: string; label: string }
  | { type: 'message'; id: string; message: LessonChatMessage };

function buildChatListItems(messages: LessonChatMessage[]): ChatListItem[] {
  const items: ChatListItem[] = [];
  let lastDateLabel = '';

  for (const message of messages) {
    const dateLabel = 'Today';
    if (dateLabel !== lastDateLabel) {
      items.push({ type: 'date', id: `date-${dateLabel}`, label: dateLabel });
      lastDateLabel = dateLabel;
    }
    items.push({ type: 'message', id: message.id, message });
  }

  return items;
}

function resolveViewerSenderId(viewerUid: string | undefined): string {
  if (!viewerUid) return OWN_PROFILE_STATS_USER_ID;
  return viewerUid;
}

export function LessonChatScreen({ lessonId }: LessonChatScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { lesson, loading: lessonLoading } = useLesson(lessonId);
  const listRef = useRef<FlatList<ChatListItem>>(null);

  const [messages, setMessages] = useState<LessonChatMessage[]>([]);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  const viewerSenderId = resolveViewerSenderId(user?.uid);
  const viewerName = user?.displayName ?? 'Alex Kim';

  const loadChat = useCallback(async () => {
    setLoading(true);
    const [allowed, list, accepted] = await Promise.all([
      lessonChatService.canAccess(lessonId, user?.uid),
      lessonChatService.listMessages(lessonId),
      lessonJoinRequestsService.listAcceptedByLesson(lessonId),
    ]);
    setCanAccess(allowed);
    setMessages(list);
    setAcceptedCount(accepted.length);
    setLoading(false);
  }, [lessonId, user?.uid]);

  useFocusEffect(
    useCallback(() => {
      void loadChat();
    }, [loadChat])
  );

  const postMessage = async () => {
    const body = draft.trim();
    if (!body || sending) return;

    setSending(true);
    const sent = await lessonChatService.sendMessage({
      lessonId,
      senderId: viewerSenderId,
      senderName: viewerName,
      body,
    });
    setSending(false);

    if (sent) {
      setDraft('');
      setMessages((prev) => [...prev, sent]);
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  };

  if (lessonLoading || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!lesson) {
    return <CenteredMessage message="Lesson not found" />;
  }

  if (canAccess === false) {
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
          <Text className="text-[17px] font-semibold text-foreground">Lesson chat</Text>
        </View>
        <CenteredMessage
          message="Chat opens after the teacher accepts your join request."
          actionLabel="Back to lesson"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const members = chatMemberCount(lesson, acceptedCount);
  const listItems = buildChatListItems(messages);
  const isOwner = isLessonOwner(lesson, user?.uid);

  return (
    <DismissKeyboard className="flex-1 bg-muted">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <View
          className="flex-row items-center gap-3 border-b border-border bg-card px-4 pb-3"
          style={{ paddingTop: insets.top + 8 }}>
          <Pressable
            onPress={() => router.back()}
            className="h-9 w-9 items-center justify-center rounded-full bg-muted active:opacity-80">
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-[17px] font-semibold text-foreground" numberOfLines={1}>
              {lesson.title}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {members} members · {isOwner ? 'You\'re hosting' : 'Accepted learner'}
            </Text>
          </View>
          <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <Feather name="message-circle" size={18} color={colors.primary} />
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={listItems}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerStyle={styles.messageList}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <Text className="py-12 text-center text-sm text-muted-foreground">
              No messages yet. Say hello to the group.
            </Text>
          }
          renderItem={({ item, index }) => {
            if (item.type === 'date') {
              return (
                <View className="my-4 items-center">
                  <View className="rounded-full bg-background/80 px-3 py-1">
                    <Text className="text-[11px] font-medium text-muted-foreground">{item.label}</Text>
                  </View>
                </View>
              );
            }

            const prev = listItems[index - 1];
            const prevMessage =
              prev?.type === 'message' ? prev.message : undefined;
            const isOwn = isOwner
              ? item.message.senderId === OWN_PROFILE_STATS_USER_ID ||
                item.message.senderId === viewerSenderId
              : item.message.senderId === viewerSenderId;
            const showAvatar = !isOwn && prevMessage?.senderId !== item.message.senderId;
            const showSenderName = !isOwn && prevMessage?.senderId !== item.message.senderId;

            return (
              <LessonChatMessageBubble
                message={item.message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                showSenderName={showSenderName}
              />
            );
          }}
        />

        <View
          className="border-t border-border bg-card"
          style={{ paddingBottom: insets.bottom + 8 }}>
          <View className="flex-row items-end gap-2 px-4 py-3">
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Message…"
              placeholderTextColor={colors.mutedForeground}
              multiline
              maxLength={2000}
              style={styles.input}
              {...Platform.select({
                android: { textAlignVertical: 'center' },
                default: {},
              })}
            />
            <Pressable
              onPress={() => void postMessage()}
              disabled={!draft.trim() || sending}
              accessibilityLabel="Send message"
              className={`mb-0.5 h-10 w-10 items-center justify-center rounded-full ${
                draft.trim() ? 'bg-primary active:opacity-90' : 'bg-muted'
              }`}>
              {sending ? (
                <ActivityIndicator size="small" color={colors.primaryForeground} />
              ) : (
                <Feather
                  name="arrow-up"
                  size={18}
                  color={draft.trim() ? colors.primaryForeground : colors.mutedForeground}
                />
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 15,
    lineHeight: 20,
    color: colors.foreground,
    backgroundColor: colors.muted,
    borderRadius: 20,
  },
});
