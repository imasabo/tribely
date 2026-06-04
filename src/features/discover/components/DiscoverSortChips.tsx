import { Pressable, ScrollView, Text } from 'react-native';

import { discoverSortOptions } from '@/data/mock/lessons';
import { useDiscoverLocationFeatures } from '@/features/discover/hooks/useDiscoverLocationFeatures';
import type { DiscoverSortOption } from '@/features/discover/types';
import { useDiscoverFilters } from '@/providers/DiscoverFiltersProvider';

interface DiscoverSortChipsProps {
  className?: string;
}

export function DiscoverSortChips({ className }: DiscoverSortChipsProps) {
  const { selectedSort, setSelectedSort } = useDiscoverFilters();
  const { distanceFilteringEnabled } = useDiscoverLocationFeatures();

  const sortOptions = distanceFilteringEnabled
    ? discoverSortOptions
    : discoverSortOptions.filter((opt) => opt !== 'Nearest');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}>
      {sortOptions.map((opt) => (
        <Pressable
          key={opt}
          onPress={() => setSelectedSort(opt as DiscoverSortOption)}
          className={`mr-1.5 rounded-full border px-3 py-1.5 ${
            selectedSort === opt
              ? 'border-primary/30 bg-secondary'
              : 'border-transparent bg-muted'
          }`}>
          <Text
            className={`text-xs ${
              selectedSort === opt ? 'font-semibold text-primary' : 'text-muted-foreground'
            }`}>
            {opt}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
