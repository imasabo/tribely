import { Text, View } from 'react-native';

import { DiscoverActiveFilterPills } from '@/features/discover/components/DiscoverActiveFilterPills';
import { DiscoverCategoryChips } from '@/features/discover/components/DiscoverCategoryChips';
import { DiscoverSortChips } from '@/features/discover/components/DiscoverSortChips';

interface DiscoverListControlsProps {
  className?: string;
}

/** Category → active sheet filters → sort. Shared by Discover and Search. */
export function DiscoverListControls({ className }: DiscoverListControlsProps) {
  return (
    <View className={className}>
      <DiscoverCategoryChips className="mb-2 px-5" />
      <DiscoverActiveFilterPills className="mb-2" />
      <View className="mb-3 flex-row items-center gap-2.5 px-5">
        <Text className="shrink-0 text-xs font-medium text-muted-foreground">Sort</Text>
        <View className="min-w-0 flex-1">
          <DiscoverSortChips />
        </View>
      </View>
    </View>
  );
}
