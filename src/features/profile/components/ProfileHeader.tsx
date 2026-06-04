import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

const GRADIENT_BODY_HEIGHT = 128;

interface ProfileHeaderProps {
  initials: string;
  children: ReactNode;
  /** Top-left control (e.g. back on another user's profile). */
  headerStart?: ReactNode;
  /** Top-right control (e.g. settings on your profile). */
  headerEnd?: ReactNode;
  /** Shown to the right of the avatar (e.g. Edit profile). */
  avatarAccessory?: ReactNode;
  /** Small edit badge on the avatar — own profile only. */
  showEditBadge?: boolean;
}

export function ProfileHeader({
  initials,
  children,
  headerStart,
  headerEnd,
  avatarAccessory,
  showEditBadge = false,
}: ProfileHeaderProps) {
  const insets = useSafeAreaInsets();
  const hasHeaderControls = headerStart != null || headerEnd != null;

  return (
    <>
      <View className="relative">
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={{
            paddingTop: insets.top,
            height: GRADIENT_BODY_HEIGHT + insets.top,
          }}>
          {hasHeaderControls ? (
            <View
              className="flex-row items-center justify-between px-5"
              style={{ height: 44, marginTop: 4 }}>
              <View className="min-w-9">{headerStart}</View>
              <View className="min-w-9 items-end">{headerEnd}</View>
            </View>
          ) : null}
        </LinearGradient>
      </View>

      <View className="bg-background px-5 pb-5">
        <View className="-mt-10 mb-4 flex-row items-end justify-between">
          <View className="relative">
            <View className="h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-primary shadow-lg">
              <Text className="text-2xl font-bold text-white">{initials}</Text>
            </View>
            {showEditBadge ? (
              <View className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-accent">
                <Feather name="edit-2" size={10} color="#fff" />
              </View>
            ) : null}
          </View>
          {avatarAccessory}
        </View>
        {children}
      </View>
    </>
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
