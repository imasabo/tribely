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
import {
  LessonChatMembersSheet,
  type LessonChatMember,
} from '@/features/lessons/components/LessonChatMembersSheet';
import { colors } from '@/constants/theme';
import { chatMemberCount } from '@/lib/lessonChatAccess';
import { OWN_PROFILE_STATS_USER_ID } from '@/features/profile/lib/ownProfileStats';
import { isLessonOwner } from '@/lib/lessonEnrollment';
import { useLesson } from '@/features/lessons/hooks/useLesson';
import { useAuth } from '@/providers/AuthProvider';
import { lessonChatService } from '@/services/lessonChat.service';
import { lessonJoinRequestsService } from '@/services/lessonJoinRequests.service';
import type { Lesson } from '@/types/domain';
import type { LessonJoinRequest } from '@/types/lessonJoinRequest';
import type { LessonChatMessage } from '@/types/lessonChat';

const CHAT_CHAR_LIMIT = 400;

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

function buildChatMembers(lesson: Lesson, acceptedMembers: LessonJoinRequest[]): LessonChatMember[] {
  return [
    {
      id: lesson.teacherId,
      name: lesson.teacherName,
      initials: lesson.teacherAvatar,
      role: 'host',
    },
    ...acceptedMembers.map((request) => ({
      id: request.requesterId,
      name: request.requesterName,
      initials: request.requesterInitials,
      role: 'learner' as const,
    })),
  ];
}

export function LessonChatScreen({ lessonId }: LessonChatScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { lesson, loading: lessonLoading } = useLesson(lessonId);
  const listRef = useRef<FlatList<ChatListItem>>(null);

  const [messages, setMessages] = useState<LessonChatMessage[]>([]);
  const [acceptedMembers, setAcceptedMembers] = useState<LessonJoinRequest[]>([]);
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [membersSheetVisible, setMembersSheetVisible] = useState(false);

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
    setAcceptedMembers(accepted);
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

  const chatMembers = buildChatMembers(lesson, acceptedMembers);
  const members = chatMemberCount(lesson, acceptedMembers.length);
  const listItems = buildChatListItems(messages);
  const isOwner = isLessonOwner(lesson, user?.uid);

  const openMemberProfile = (member: LessonChatMember) => {
    setMembersSheetVisible(false);
    router.push(`/user/${member.id}`);
  };
  const charCount = draft.length;
  const limitProgress = Math.min(charCount / CHAT_CHAR_LIMIT, 1);
  const nearLimit = charCount >= CHAT_CHAR_LIMIT * 0.9;

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
          <View className="min-w-0 flex-1">
            <Pressable
              onPress={() => router.push(`/lesson/${lessonId}`)}
              accessibilityRole="link"
              accessibilityLabel={`View lesson: ${lesson.title}`}
              className="max-w-full flex-row items-center gap-1.5 self-start rounded-full border border-border bg-muted/50 py-1 pl-3 pr-2 active:opacity-70">
              <Text
                className="min-w-0 shrink text-[17px] font-semibold text-foreground"
                numberOfLines={1}
                ellipsizeMode="tail">
                {lesson.title}
              </Text>
              <View className="h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                <Feather name="arrow-right" size={14} color={colors.foreground} />
              </View>
            </Pressable>
            <Pressable
              onPress={() => setMembersSheetVisible(true)}
              accessibilityRole="button"
              accessibilityLabel={`${members} members, view member list`}
              className="flex-row items-center gap-1 self-start active:opacity-70">
              <Text className="text-xs font-medium text-primary">
                {members} members
              </Text>
              <Feather name="chevron-down" size={14} color={colors.primary} />
              <Text className="text-xs text-muted-foreground">
                · {isOwner ? "You're hosting" : 'Accepted learner'}
              </Text>
            </Pressable>
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

        <View className="bg-card" style={{ paddingBottom: insets.bottom + 8 }}>
          <View
            style={styles.limitBarTrack}
            accessibilityLabel={`${charCount} of ${CHAT_CHAR_LIMIT} characters`}
            accessibilityRole="progressbar"
            accessibilityValue={{
              min: 0,
              max: CHAT_CHAR_LIMIT,
              now: charCount,
            }}>
            <View
              style={[
                styles.limitBarFill,
                {
                  width: `${limitProgress * 100}%`,
                  backgroundColor: nearLimit ? colors.accent : colors.primary,
                },
              ]}
            />
          </View>
          <View className="flex-row items-end gap-2 px-4 py-3">
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Message…"
              placeholderTextColor={colors.mutedForeground}
              multiline
              maxLength={CHAT_CHAR_LIMIT}
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

      <LessonChatMembersSheet
        visible={membersSheetVisible}
        members={chatMembers}
        onClose={() => setMembersSheetVisible(false)}
        onMemberPress={openMemberProfile}
      />
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  limitBarTrack: {
    height: 2,
    width: '100%',
    backgroundColor: colors.border,
  },
  limitBarFill: {
    height: '100%',
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
