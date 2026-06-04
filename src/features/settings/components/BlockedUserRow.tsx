import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import type { BlockedUserListItem } from '@/types/blockedUser';

interface BlockedUserRowProps {
  user: BlockedUserListItem;
  onUnblock: () => void;
}

export function BlockedUserRow({ user, onUnblock }: BlockedUserRowProps) {
  return (
    <View className="flex-row items-center gap-3 border-b border-border px-4 py-3.5">
      <Avatar initials={user.initials} size="md" />
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-medium text-foreground" numberOfLines={1}>
          {user.displayName}
        </Text>
        <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={1}>
          @{user.username}
        </Text>
      </View>
      <Pressable
        onPress={onUnblock}
        accessibilityRole="button"
        accessibilityLabel={`Unblock ${user.displayName}`}
        className="rounded-full border border-border px-3 py-1.5 active:opacity-80">
        <Text className="text-[13px] font-semibold text-foreground">Unblock</Text>
      </Pressable>
    </View>
  );
}
