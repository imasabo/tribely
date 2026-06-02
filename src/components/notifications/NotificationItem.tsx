import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/constants/theme';
import type { AppNotification, NotificationType } from '@/types/domain';

const iconByType: Record<NotificationType, keyof typeof Feather.glyphMap> = {
  lesson_completed: 'check-circle',
  comment: 'message-circle',
  like: 'heart',
  booking_reminder: 'calendar',
  lesson_nearby: 'map-pin',
};

interface NotificationItemProps {
  notification: AppNotification;
  onPress: () => void;
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const icon = iconByType[notification.type];

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row gap-3 border-b border-border px-5 py-4 active:opacity-95 ${
        notification.read ? 'bg-background' : 'bg-secondary/40'
      }`}>
      {notification.actorAvatar ? (
        <Avatar initials={notification.actorAvatar} size="sm" />
      ) : (
        <View className="h-6 w-6 items-center justify-center rounded-full bg-primary/10">
          <Feather name={icon} size={14} color={colors.primary} />
        </View>
      )}

      <View className="flex-1">
        <View className="mb-0.5 flex-row items-center justify-between gap-2">
          <Text className="flex-1 text-sm font-semibold text-foreground">{notification.title}</Text>
          <Text className="text-[11px] text-muted-foreground">{notification.createdAtLabel}</Text>
        </View>
        <Text className="text-[13px] leading-relaxed text-muted-foreground">{notification.body}</Text>
      </View>

      {!notification.read ? (
        <View className="mt-2 h-2 w-2 rounded-full bg-primary" />
      ) : null}
    </Pressable>
  );
}
