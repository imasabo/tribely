import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/constants/theme';
import { formatUsernameLabel } from '@/lib/username';
import type { FriendListItem } from '@/types/friendList';

interface FriendListRowProps {
  friend: FriendListItem;
  onPress: () => void;
}

export function FriendListRow({ friend, onPress }: FriendListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${friend.displayName}'s profile`}
      className="flex-row items-center gap-3 border-b border-border px-4 py-3.5 active:opacity-80">
      <Avatar initials={friend.initials} size="md" />
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-medium text-foreground" numberOfLines={1}>
          {friend.displayName}
        </Text>
        <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={1}>
          {formatUsernameLabel(friend.username)}
        </Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}
