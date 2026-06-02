import { Feather } from '@expo/vector-icons';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/constants/theme';

const containerClassName =
  'flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-3';

interface SearchFieldProps extends TextInputProps {
  containerClassName?: string;
}

/** Editable search input — use on the search screen. */
export function SearchField({
  containerClassName: containerClass,
  className,
  placeholderTextColor = colors.mutedForeground,
  ...props
}: SearchFieldProps) {
  return (
    <View className={`${containerClassName} ${containerClass ?? ''}`}>
      <Feather name="search" size={16} color={colors.mutedForeground} />
      <TextInput
        placeholderTextColor={placeholderTextColor}
        className={`flex-1 text-[15px] text-foreground ${className ?? ''}`}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        {...props}
      />
    </View>
  );
}

interface SearchBarProps {
  placeholder: string;
  onPress?: () => void;
  className?: string;
}

/** Tappable search affordance — opens search from list screens. */
export function SearchBar({ placeholder, onPress, className }: SearchBarProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={placeholder}
      className={`${containerClassName} active:opacity-90 ${className ?? ''}`}>
      <Feather name="search" size={16} color={colors.mutedForeground} />
      <TextInput
        editable={false}
        pointerEvents="none"
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        className="flex-1 text-[15px] text-muted-foreground"
      />
    </Pressable>
  );
}
