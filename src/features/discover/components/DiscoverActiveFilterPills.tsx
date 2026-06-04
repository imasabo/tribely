import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { useDiscoverLocationFeatures } from '@/features/discover/hooks/useDiscoverLocationFeatures';
import {
  getActiveDiscoverFilterPills,
  type DiscoverFilterPillId,
} from '@/features/discover/lib/discoverFilterPills';
import { useDiscoverFilters } from '@/providers/DiscoverFiltersProvider';

interface DiscoverActiveFilterPillsProps {
  className?: string;
}

export function DiscoverActiveFilterPills({ className }: DiscoverActiveFilterPillsProps) {
  const { appliedSheetFilters, removeAppliedFilterPill } = useDiscoverFilters();
  const { distanceFilteringEnabled } = useDiscoverLocationFeatures();

  const pills = getActiveDiscoverFilterPills(appliedSheetFilters, {
    includeDistance: distanceFilteringEnabled,
  });

  if (pills.length === 0) return null;

  return (
    <View className={className}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-5"
        contentContainerStyle={{ paddingRight: 20 }}
        keyboardShouldPersistTaps="handled">
        {pills.map((pill) => (
          <Pressable
            key={pill.id}
            onPress={() => removeAppliedFilterPill(pill.id)}
            accessibilityLabel={`Remove ${pill.label} filter`}
            className="mr-2 flex-row items-center gap-1 rounded-full border border-primary bg-secondary py-1.5 pl-3 pr-2 active:opacity-80">
            <Text className="text-xs font-medium text-primary">{pill.label}</Text>
            <Feather name="x" size={14} color={colors.primary} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
