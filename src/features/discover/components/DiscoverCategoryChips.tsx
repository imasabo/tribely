import { Pressable, ScrollView, Text } from 'react-native';

import { discoverFilters } from '@/data/mock/lessons';
import { useDiscoverFilters } from '@/providers/DiscoverFiltersProvider';

interface DiscoverCategoryChipsProps {
  className?: string;
}

export function DiscoverCategoryChips({ className }: DiscoverCategoryChipsProps) {
  const { selectedCategory, setSelectedCategory } = useDiscoverFilters();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}
      contentContainerStyle={{ paddingRight: 20 }}>
      {discoverFilters.map((category) => (
        <Pressable
          key={category}
          onPress={() => setSelectedCategory(category)}
          className={`mr-2 rounded-full border px-3.5 py-1.5 ${
            selectedCategory === category
              ? 'border-primary bg-primary'
              : 'border-border bg-card'
          }`}>
          <Text
            className={`text-xs font-medium ${
              selectedCategory === category ? 'text-white' : 'text-foreground'
            }`}>
            {category}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
