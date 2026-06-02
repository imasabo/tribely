import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/constants/theme';
import { useActivityEngagement } from '@/providers/ActivityEngagementProvider';
import type { ActivityComment } from '@/types/domain';

interface ActivityCommentItemProps {
  activityId: string;
  comment: ActivityComment;
}

export function ActivityCommentItem({ activityId, comment }: ActivityCommentItemProps) {
  const { isCommentLiked, toggleCommentLike } = useActivityEngagement(activityId);
  const liked = isCommentLiked(comment.id);

  return (
    <View className="flex-row gap-3 px-5 py-2">
      <Avatar initials={comment.authorAvatar} size="sm" />
      <View className="flex-1 pt-0.5">
        <Text className="text-[13px] leading-relaxed text-foreground">
          <Text className="font-semibold">{comment.authorName}</Text>
          <Text> {comment.body}</Text>
        </Text>
        <View className="mt-1 flex-row items-center gap-3">
          <Text className="text-[11px] text-muted-foreground">{comment.createdAtLabel}</Text>
          <Pressable
            onPress={() => toggleCommentLike(comment.id)}
            accessibilityLabel={liked ? 'Unlike comment' : 'Like comment'}
            className="active:opacity-70">
            <Feather
              name="heart"
              size={14}
              color={liked ? colors.destructive : colors.mutedForeground}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
