import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useDiscoverLocationFeatures } from '@/features/discover/hooks/useDiscoverLocationFeatures';
import { useDiscoverFilters } from '@/providers/DiscoverFiltersProvider';

interface DiscoverFilterButtonProps {
  className?: string;
}

export function DiscoverFilterButton({ className }: DiscoverFilterButtonProps) {
  const { openFilterSheet } = useDiscoverFilters();
  const { activeFilterCount } = useDiscoverLocationFeatures();

  return (
    <Pressable
      onPress={openFilterSheet}
      className={`relative h-12 w-12 items-center justify-center rounded-xl bg-primary active:opacity-90 ${className ?? ''}`}>
      <Feather name="sliders" size={17} color="#fff" />
      {activeFilterCount > 0 ? (
        <View className="absolute -right-1 -top-1 h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1">
          <Text className="text-[10px] font-bold text-white">{activeFilterCount}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
