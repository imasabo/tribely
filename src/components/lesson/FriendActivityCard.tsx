import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/constants/theme';
import { useActivityEngagement } from '@/providers/ActivityEngagementProvider';
import type { FriendLessonActivity } from '@/types/domain';

import { GoogleSlidesCardPreview } from './GoogleSlidesCardPreview';

interface FriendActivityCardProps {
  activity: FriendLessonActivity;
  onLessonPress: () => void;
  onCommentPress?: () => void;
  /** Hide like/comment actions — use on the comments screen. */
  showActions?: boolean;
}

export function FriendActivityCard({
  activity,
  onLessonPress,
  onCommentPress,
  showActions = true,
}: FriendActivityCardProps) {
  const { friendName, friendAvatar, completedAtLabel, lesson, ratingGiven, reviewSnippet } =
    activity;
  const { liked, toggleLike } = useActivityEngagement(activity.id);

  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-card">
      <View className="flex-row items-center gap-3 px-4 pt-4">
        <Avatar initials={friendAvatar} size="sm" />
        <View className="flex-1">
          <Text className="text-sm text-foreground">
            <Text className="font-semibold">{friendName}</Text>
            <Text className="text-muted-foreground"> completed a lesson</Text>
          </Text>
          <Text className="text-xs text-muted-foreground">{completedAtLabel}</Text>
        </View>
        {ratingGiven ? (
          <View className="flex-row items-center gap-0.5 rounded-full bg-accent/10 px-2 py-1">
            <Feather name="star" size={11} color={colors.accent} />
            <Text className="text-xs font-medium text-accent">{ratingGiven}</Text>
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={onLessonPress}
        className="m-4 overflow-hidden rounded-xl border border-border bg-muted/30 active:opacity-95">
        <View className="h-28 p-2">
          <GoogleSlidesCardPreview variant="featured" colors={lesson.slidePreviewColors} />
        </View>
        <View className="px-3 pb-3">
          <Text className="text-[11px] text-muted-foreground">
            {lesson.categoryEmoji} {lesson.category} · {lesson.durationMinutes} min
          </Text>
          <Text className="mt-0.5 text-sm font-semibold text-foreground">{lesson.title}</Text>
          <Text className="mt-0.5 text-xs text-muted-foreground">with {lesson.teacherName}</Text>
        </View>
      </Pressable>

      {reviewSnippet ? (
        <View className={`px-4 ${showActions ? 'pb-1' : 'pb-4'}`}>
          <Text className="text-[13px] leading-relaxed text-muted-foreground">{reviewSnippet}</Text>
        </View>
      ) : null}

      {showActions ? (
        <View className="mt-3 flex-row items-center gap-5 border-t border-border px-4 py-3">
          <Pressable
            onPress={toggleLike}
            accessibilityLabel={liked ? 'Unlike' : 'Like'}
            className="active:opacity-70">
            <Feather
              name="heart"
              size={20}
              color={liked ? colors.destructive : colors.mutedForeground}
            />
          </Pressable>

          {onCommentPress ? (
            <Pressable
              onPress={onCommentPress}
              accessibilityLabel="Comment"
              className="active:opacity-70">
              <Feather name="message-circle" size={20} color={colors.mutedForeground} />
            </Pressable>
          ) : null}
        </View>
      ) : !reviewSnippet ? (
        <View className="pb-4" />
      ) : null}
    </View>
  );
}
