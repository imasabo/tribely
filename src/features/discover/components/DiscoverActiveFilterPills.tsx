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
    <View className={`flex-row items-center gap-2 px-5 ${className ?? ''}`}>
      <Text className="shrink-0 text-xs font-medium text-muted-foreground">Active</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="min-w-0 flex-1"
        contentContainerStyle={{ paddingRight: 8, alignItems: 'center' }}
        keyboardShouldPersistTaps="handled">
        {pills.map((pill) => (
          <Pressable
            key={pill.id}
            onPress={() => removeAppliedFilterPill(pill.id)}
            accessibilityLabel={`Remove ${pill.label} filter`}
            className="mr-1.5 flex-row items-center gap-1 rounded-full border border-border bg-card py-1 pl-2.5 pr-1.5 active:opacity-80">
            <Text className="text-xs font-medium text-foreground">{pill.label}</Text>
            <Feather name="x" size={12} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
