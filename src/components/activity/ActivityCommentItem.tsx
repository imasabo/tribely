import { Feather } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/constants/theme';
import { useActivityEngagement } from '@/providers/ActivityEngagementProvider';
import type { ActivityComment } from '@/types/domain';

const AVATAR_SIZE = 24;
const AVATAR_GAP = 10;
const COMMENT_FONT_SIZE = 13;
/** Matches one line of comment text — avatar is centered in this height. */
const COMMENT_LINE_HEIGHT = 18;

interface ActivityCommentItemProps {
  activityId: string;
  comment: ActivityComment;
}

export function ActivityCommentItem({ activityId, comment }: ActivityCommentItemProps) {
  const { isCommentLiked, toggleCommentLike } = useActivityEngagement(activityId);
  const liked = isCommentLiked(comment.id);

  return (
    <View style={styles.row}>
      <View style={styles.avatarSlot}>
        <Avatar initials={comment.authorAvatar} size="sm" />
      </View>

      <View style={styles.body}>
        <Text style={styles.commentText}>
          <Text style={styles.authorName}>{comment.authorName}</Text>
          <Text> {comment.body}</Text>
        </Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>{comment.createdAtLabel}</Text>
          <Pressable
            onPress={() => toggleCommentLike(comment.id)}
            accessibilityLabel={liked ? 'Unlike comment' : 'Like comment'}
            hitSlop={8}
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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: AVATAR_GAP,
  },
  avatarSlot: {
    width: AVATAR_SIZE,
    height: COMMENT_LINE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  commentText: {
    fontSize: COMMENT_FONT_SIZE,
    lineHeight: COMMENT_LINE_HEIGHT,
    color: colors.foreground,
    ...Platform.select({
      android: { includeFontPadding: false, textAlignVertical: 'center' },
      default: {},
    }),
  },
  authorName: {
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  metaText: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
});
