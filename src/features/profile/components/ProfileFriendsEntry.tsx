import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

interface ProfileFriendsEntryProps {
  count: number;
  onPress: () => void;
}

export function ProfileFriendsEntry({ count, onPress }: ProfileFriendsEntryProps) {
  const summary =
    count === 0
      ? 'Connect with people you learn and teach with'
      : count === 1
        ? '1 person in your network'
        : `${count} people in your network`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${count} friends, view friends list`}
      className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5 active:opacity-90">
      <View className="flex-1 pr-3">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Feather name="users" size={16} color={colors.primary} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-[15px] font-semibold text-foreground">Friends</Text>
            <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={1}>
              {summary}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <View className="min-w-[28px] items-center justify-center rounded-full bg-muted px-2.5 py-1">
          <Text className="text-[13px] font-bold text-foreground">{count}</Text>
        </View>
        <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
      </View>
    </Pressable>
  );
}
