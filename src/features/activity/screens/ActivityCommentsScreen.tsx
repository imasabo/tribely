import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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

import { ActivityCommentItem } from '@/components/activity/ActivityCommentItem';
import { FriendActivityCard } from '@/components/lesson/FriendActivityCard';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { DismissKeyboard } from '@/components/ui/DismissKeyboard';
import { colors } from '@/constants/theme';
import { getInitials } from '@/lib/userDisplay';
import { useActivityEngagement } from '@/providers/ActivityEngagementProvider';
import { useAuth } from '@/providers/AuthProvider';
import { lessonsService } from '@/services/lessons.service';
import type { FriendLessonActivity } from '@/types/domain';

const COMMENT_CHAR_LIMIT = 200;

interface ActivityCommentsScreenProps {
  activityId: string;
}

export function ActivityCommentsScreen({ activityId }: ActivityCommentsScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activity, setActivity] = useState<FriendLessonActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [draftComment, setDraftComment] = useState('');

  const { comments, addComment } = useActivityEngagement(activityId);

  const authorName = user?.displayName ?? 'You';
  const authorInitials = getInitials(user?.displayName, 'YO');

  useEffect(() => {
    let mounted = true;

    lessonsService.getFriendActivityById(activityId).then((result) => {
      if (mounted) {
        setActivity(result);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [activityId]);

  const postComment = useCallback(() => {
    const body = draftComment.trim();
    if (!body) return;

    addComment({
      id: `comment-${Date.now()}`,
      authorName,
      authorAvatar: authorInitials,
      body,
      createdAtLabel: 'Just now',
    });
    setDraftComment('');
  }, [addComment, authorInitials, authorName, draftComment]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!activity) {
    return <CenteredMessage message="Activity not found" />;
  }

  const charCount = draftComment.length;
  const limitProgress = Math.min(charCount / COMMENT_CHAR_LIMIT, 1);
  const nearLimit = charCount >= COMMENT_CHAR_LIMIT * 0.9;

  return (
    <DismissKeyboard className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
      <View
        className="flex-row items-center gap-3 border-b border-border px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}>
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-muted active:opacity-80">
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text className="text-[17px] font-semibold text-foreground">Comments</Text>
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="never"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 16 }}
        ListHeaderComponent={
          <View className="border-b border-border px-5 py-4">
            <FriendActivityCard
              activity={activity}
              showActions={false}
              onLessonPress={() => router.push(`/lesson/${activity.lesson.id}`)}
              onProfilePress={() => router.push(`/user/${activity.friendId}`)}
            />
          </View>
        }
        ListEmptyComponent={
          <Text className="px-5 py-8 text-center text-[15px] text-muted-foreground">
            No comments yet. Start the conversation.
          </Text>
        }
        renderItem={({ item }) => <ActivityCommentItem activityId={activityId} comment={item} />}
      />

      <View style={[styles.composer, { paddingBottom: insets.bottom + 8 }]}>
        <View
          style={styles.limitBarTrack}
          accessibilityLabel={`${charCount} of ${COMMENT_CHAR_LIMIT} characters`}
          accessibilityRole="progressbar"
          accessibilityValue={{
            min: 0,
            max: COMMENT_CHAR_LIMIT,
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

        <View className="flex-row items-end gap-2 px-4 pt-3">
          <TextInput
            value={draftComment}
            onChangeText={setDraftComment}
            placeholder="Add a comment…"
            placeholderTextColor={colors.mutedForeground}
            multiline
            scrollEnabled
            maxLength={COMMENT_CHAR_LIMIT}
            style={styles.commentInput}
            {...Platform.select({
              android: { includeFontPadding: false, textAlignVertical: 'center' },
              default: {},
            })}
          />
          <Pressable
            onPress={postComment}
            disabled={!draftComment.trim()}
            accessibilityLabel="Post comment"
            className={`mb-0.5 h-10 w-10 items-center justify-center rounded-full ${
              draftComment.trim() ? 'bg-primary active:opacity-90' : 'bg-muted'
            }`}>
            <Feather
              name="arrow-up"
              size={18}
              color={draftComment.trim() ? colors.primaryForeground : colors.mutedForeground}
            />
          </Pressable>
        </View>
      </View>
      </KeyboardAvoidingView>
    </DismissKeyboard>
  );
}

const INPUT_FONT_SIZE = 15;
const INPUT_LINE_HEIGHT = 20;
const INPUT_MIN_HEIGHT = 40;

const styles = StyleSheet.create({
  composer: {
    backgroundColor: colors.background,
  },
  limitBarTrack: {
    height: 2,
    width: '100%',
    backgroundColor: colors.border,
  },
  limitBarFill: {
    height: '100%',
  },
  commentInput: {
    flex: 1,
    minHeight: INPUT_MIN_HEIGHT,
    maxHeight: 96,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 11 : (INPUT_MIN_HEIGHT - INPUT_LINE_HEIGHT) / 2,
    paddingBottom: Platform.OS === 'ios' ? 9 : (INPUT_MIN_HEIGHT - INPUT_LINE_HEIGHT) / 2,
    fontSize: INPUT_FONT_SIZE,
    lineHeight: INPUT_LINE_HEIGHT,
    color: colors.foreground,
    backgroundColor: colors.muted,
    borderRadius: 16,
  },
});
