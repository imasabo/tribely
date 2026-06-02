import { Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import type { ActivityComment } from '@/types/domain';

interface ActivityCommentItemProps {
  comment: ActivityComment;
}

export function ActivityCommentItem({ comment }: ActivityCommentItemProps) {
  return (
    <View className="flex-row gap-3 px-5 py-2">
      <Avatar initials={comment.authorAvatar} size="sm" />
      <View className="flex-1 pt-0.5">
        <Text className="text-[13px] leading-relaxed text-foreground">
          <Text className="font-semibold">{comment.authorName}</Text>
          <Text> {comment.body}</Text>
        </Text>
        <Text className="mt-1 text-[11px] text-muted-foreground">{comment.createdAtLabel}</Text>
      </View>
    </View>
  );
}
