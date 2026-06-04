import { Feather } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

export { PROFILE_GRADIENT_BODY_HEIGHT } from '@/features/profile/lib/profileCoverMetrics';

interface ProfileHeaderProps {
  initials: string;
  children: ReactNode;
  avatarAccessory?: ReactNode;
  showEditBadge?: boolean;
  onEditPress?: () => void;
}

/** Profile body below the fixed cover (avatar, identity, stats). */
export function ProfileHeader({
  initials,
  children,
  avatarAccessory,
  showEditBadge = false,
  onEditPress,
}: ProfileHeaderProps) {
  return (
    <View className="bg-background px-5 pb-5">
      <View className="-mt-10 mb-4 flex-row items-end justify-between">
        <View className="relative">
          {showEditBadge && onEditPress ? (
            <Pressable
              onPress={onEditPress}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              className="active:opacity-90">
              <View className="h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-primary shadow-lg">
                <Text className="text-2xl font-bold text-white">{initials}</Text>
              </View>
              <View className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-accent">
                <Feather name="edit-2" size={10} color="#fff" />
              </View>
            </Pressable>
          ) : (
            <View className="h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-primary shadow-lg">
              <Text className="text-2xl font-bold text-white">{initials}</Text>
            </View>
          )}
        </View>
        {avatarAccessory}
      </View>
      {children}
    </View>
  );
}

interface ProfileHeaderIconButtonProps {
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  accessibilityLabel: string;
  variant?: 'onGradient' | 'onBackground';
}

export function ProfileHeaderIconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'onGradient',
}: ProfileHeaderIconButtonProps) {
  const isOnGradient = variant === 'onGradient';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={`h-9 w-9 items-center justify-center rounded-full active:opacity-80 ${
        isOnGradient ? 'bg-black/25' : 'bg-muted'
      }`}>
      <Feather name={icon} size={18} color={isOnGradient ? '#fff' : colors.foreground} />
    </Pressable>
  );
}
