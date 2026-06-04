import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { formatUsernameLabel } from '@/lib/username';

interface ProfileIdentityProps {
  displayName: string;
  username: string;
  metaLine: string;
  bio?: string;
  /** Shown on the same row as the display name (e.g. Edit). */
  nameAccessory?: ReactNode;
  /** Slot below bio (friend action, etc.) */
  action?: ReactNode;
}

export function ProfileIdentity({
  displayName,
  username,
  metaLine,
  bio,
  nameAccessory,
  action,
}: ProfileIdentityProps) {
  return (
    <View>
      <View className="flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="text-[22px] font-bold tracking-tight text-foreground">
            {displayName}
          </Text>
          <Text className="mt-0.5 text-sm font-medium text-primary">
            {formatUsernameLabel(username)}
          </Text>
        </View>
        {nameAccessory}
      </View>
      {metaLine ? (
        <Text className="mt-0.5 text-sm text-muted-foreground">{metaLine}</Text>
      ) : null}
      {bio ? (
        <Text className="mt-2.5 text-[15px] leading-6 text-foreground">{bio}</Text>
      ) : null}
      {action ? <View className="mt-4">{action}</View> : null}
    </View>
  );
}
