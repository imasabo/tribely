import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/theme';
import type { FriendConnectionStatus } from '@/types/social';

interface ProfileFriendConnectionProps {
  status: FriendConnectionStatus;
  requesting: boolean;
  onSendFriendRequest: () => void;
}

export function ProfileFriendConnection({
  status,
  requesting,
  onSendFriendRequest,
}: ProfileFriendConnectionProps) {
  if (status === 'self') {
    return (
      <View className="rounded-xl border border-border bg-muted px-4 py-3">
        <Text className="text-center text-sm text-muted-foreground">This is your profile</Text>
      </View>
    );
  }

  if (status === 'friends') {
    return (
      <View className="flex-row items-center justify-center gap-2 rounded-xl border border-primary/30 bg-secondary px-4 py-3">
        <Feather name="check-circle" size={18} color={colors.primary} />
        <Text className="text-sm font-semibold text-primary">Friends</Text>
      </View>
    );
  }

  if (status === 'request_sent') {
    return (
      <Button
        title="Friend request sent"
        variant="outline"
        fullWidth
        disabled
        icon={<Feather name="clock" size={16} color={colors.mutedForeground} />}
      />
    );
  }

  if (status === 'request_received') {
    return (
      <View className="rounded-xl border border-border bg-card px-4 py-3">
        <Text className="text-center text-sm text-muted-foreground">
          This person sent you a friend request — respond from notifications.
        </Text>
      </View>
    );
  }

  return (
    <Button
      title="Add friend"
      fullWidth
      loading={requesting}
      onPress={onSendFriendRequest}
      icon={<Feather name="user-plus" size={16} color="#fff" />}
    />
  );
}
