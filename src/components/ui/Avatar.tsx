import { Text, View, ViewProps } from 'react-native';

interface AvatarProps extends ViewProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: { box: 'h-6 w-6', text: 'text-[10px]' },
  md: { box: 'h-9 w-9', text: 'text-[13px]' },
  lg: { box: 'h-20 w-20', text: 'text-2xl' },
};

export function Avatar({ initials, size = 'md', className, ...props }: AvatarProps) {
  const s = sizeClasses[size];
  return (
    <View
      className={`items-center justify-center rounded-full bg-primary ${s.box} ${className ?? ''}`}
      {...props}>
      <Text className={`font-semibold text-primary-foreground ${s.text}`}>{initials}</Text>
    </View>
  );
}
