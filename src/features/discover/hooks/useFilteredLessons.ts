import { useMemo } from 'react';

import {
  applyDiscoverCategoryFilter,
  applyDiscoverSheetFilters,
  sortDiscoverLessons,
} from '@/features/discover/lib/applyDiscoverFilters';
import { canFilterLessonsByDistance } from '@/features/discover/lib/discoverLocation';
import { useDiscoverFilters } from '@/providers/DiscoverFiltersProvider';
import { useDiscoverLocationContext } from '@/providers/DiscoverLocationProvider';
import type { Lesson } from '@/types/domain';

export function useFilteredLessons(lessons: Lesson[]) {
  const { appliedSheetFilters, selectedSort, selectedCategory } = useDiscoverFilters();
  const { mode: locationMode } = useDiscoverLocationContext();
  const filterByDistance = canFilterLessonsByDistance(locationMode);

  return useMemo(() => {
    const filtered = applyDiscoverSheetFilters(
      applyDiscoverCategoryFilter(lessons, selectedCategory),
      appliedSheetFilters,
      { filterByDistance }
    );
    return sortDiscoverLessons(filtered, selectedSort);
  }, [lessons, appliedSheetFilters, selectedSort, selectedCategory, filterByDistance]);
}
