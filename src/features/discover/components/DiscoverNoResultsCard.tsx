import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

interface DiscoverNoResultsCardProps {
  title?: string;
  hint: string;
  onClear?: () => void;
  clearLabel?: string;
}

export function DiscoverNoResultsCard({
  title = 'No lessons match',
  hint,
  onClear,
  clearLabel = 'Clear all filters',
}: DiscoverNoResultsCardProps) {
  return (
    <View className="items-center rounded-2xl border border-dashed border-border bg-card px-6 py-10">
      <Feather name="sliders" size={28} color={colors.mutedForeground} />
      <Text className="mt-3 text-center text-base font-semibold text-foreground">{title}</Text>
      <Text className="mt-1 text-center text-sm leading-5 text-muted-foreground">{hint}</Text>
      {onClear ? (
        <Pressable onPress={onClear} className="mt-4 active:opacity-80">
          <Text className="text-sm font-semibold text-primary">{clearLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
