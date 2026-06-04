import { Pressable, ScrollView, Text } from 'react-native';

import { discoverSortOptions } from '@/data/mock/lessons';
import type { DiscoverSortOption } from '@/features/discover/types';
import { useDiscoverFilters } from '@/providers/DiscoverFiltersProvider';

interface DiscoverSortChipsProps {
  className?: string;
}

export function DiscoverSortChips({ className }: DiscoverSortChipsProps) {
  const { selectedSort, setSelectedSort } = useDiscoverFilters();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}>
      {discoverSortOptions.map((opt) => (
        <Pressable
          key={opt}
          onPress={() => setSelectedSort(opt as DiscoverSortOption)}
          className={`mr-2 rounded-full border px-3.5 py-1.5 ${
            selectedSort === opt ? 'border-primary bg-secondary' : 'border-border bg-card'
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
