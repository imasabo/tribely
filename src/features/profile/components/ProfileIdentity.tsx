import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

interface ProfileIdentityProps {
  displayName: string;
  metaLine: string;
  bio?: string;
  /** Slot below bio (friend action, etc.) */
  action?: ReactNode;
}

export function ProfileIdentity({ displayName, metaLine, bio, action }: ProfileIdentityProps) {
  return (
    <View>
      <Text className="text-[22px] font-bold tracking-tight text-foreground">{displayName}</Text>
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
