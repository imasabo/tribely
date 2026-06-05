import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

interface StarRatingPickerProps {
  value?: number;
  onChange: (rating: number | undefined) => void;
  max?: number;
}

export function StarRatingPicker({ value, onChange, max = 5 }: StarRatingPickerProps) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2">
        {Array.from({ length: max }, (_, index) => {
          const star = index + 1;
          const filled = value != null && star <= value;
          return (
            <Pressable
              key={star}
              onPress={() => onChange(value === star ? undefined : star)}
              accessibilityRole="button"
              accessibilityLabel={`${star} star${star === 1 ? '' : 's'}`}
              accessibilityState={{ selected: filled }}
              hitSlop={6}
              className="active:opacity-70">
              <Ionicons
                name={filled ? 'star' : 'star-outline'}
                size={28}
                color={filled ? colors.accent : colors.mutedForeground}
              />
            </Pressable>
          );
        })}
      </View>
      <Text className="text-xs text-muted-foreground">
        {value != null ? `${value} of ${max} selected — tap again to clear` : 'Optional'}
      </Text>
    </View>
  );
}
