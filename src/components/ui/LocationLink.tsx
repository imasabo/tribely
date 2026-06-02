import { Feather } from '@expo/vector-icons';
import { Pressable, Text, type PressableProps } from 'react-native';

import { colors } from '@/constants/theme';

interface LocationLinkProps extends Omit<PressableProps, 'children'> {
  label: string;
}

export function LocationLink({ label, className, ...props }: LocationLinkProps) {
  return (
    <Pressable className={`flex-row items-center gap-1.5 ${className ?? ''}`} {...props}>
      <Feather name="map-pin" size={13} color={colors.primary} />
      <Text className="text-[13px] font-medium text-primary">{label}</Text>
      <Feather name="chevron-right" size={13} color={colors.primary} />
    </Pressable>
  );
}
