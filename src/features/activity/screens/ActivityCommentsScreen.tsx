import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityCommentItem } from '@/components/activity/ActivityCommentItem';
import { FriendActivityCard } from '@/components/lesson/FriendActivityCard';
import { Avatar } from '@/components/ui/Avatar';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { colors } from '@/constants/theme';
import { getInitials } from '@/lib/userDisplay';
import { useActivityEngagement } from '@/providers/ActivityEngagementProvider';
import { useAuth } from '@/providers/AuthProvider';
import { lessonsService } from '@/services/lessons.service';
import type { FriendLessonActivity } from '@/types/domain';

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

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
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
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 16 }}
        ListHeaderComponent={
          <View className="border-b border-border px-5 py-4">
            <FriendActivityCard
              activity={activity}
              showActions={false}
              onLessonPress={() => router.push(`/lesson/${activity.lesson.id}`)}
            />
          </View>
        }
        ListEmptyComponent={
          <Text className="px-5 py-8 text-center text-[15px] text-muted-foreground">
            No comments yet. Start the conversation.
          </Text>
        }
        renderItem={({ item }) => <ActivityCommentItem comment={item} />}
      />

      <View
        className="flex-row items-end gap-2 border-t border-border bg-background px-4 pt-3"
        style={{ paddingBottom: insets.bottom + 8 }}>
        <Avatar initials={authorInitials} size="sm" />
        <TextInput
          value={draftComment}
          onChangeText={setDraftComment}
          placeholder="Add a comment…"
          placeholderTextColor={colors.mutedForeground}
          multiline
          className="max-h-24 min-h-[40px] flex-1 rounded-2xl bg-muted px-4 py-2.5 text-[15px] text-foreground"
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
    </KeyboardAvoidingView>
  );
}
