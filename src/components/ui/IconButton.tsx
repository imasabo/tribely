import { Feather } from '@expo/vector-icons';
import { Pressable, View, type PressableProps } from 'react-native';

import { colors } from '@/constants/theme';

type IconButtonVariant = 'muted' | 'primary';

interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: keyof typeof Feather.glyphMap;
  size?: number;
  variant?: IconButtonVariant;
  showBadge?: boolean;
}

const variantClasses: Record<IconButtonVariant, string> = {
  muted: 'bg-muted',
  primary: 'bg-primary',
};

const iconColors: Record<IconButtonVariant, string> = {
  muted: colors.foreground,
  primary: '#fff',
};

export function IconButton({
  icon,
  size = 18,
  variant = 'muted',
  showBadge,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      className={`relative h-9 w-9 items-center justify-center rounded-full ${variantClasses[variant]} ${className ?? ''}`}
      {...props}>
      <Feather name={icon} size={size} color={iconColors[variant]} />
      {showBadge ? (
        <View className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
      ) : null}
    </Pressable>
  );
}
