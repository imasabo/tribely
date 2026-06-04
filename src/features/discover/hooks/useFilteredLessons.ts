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

export function useFilteredLessons(
  lessons: Lesson[],
  options?: { category?: string }
) {
  const { appliedSheetFilters, selectedSort } = useDiscoverFilters();
  const { mode: locationMode } = useDiscoverLocationContext();
  const filterByDistance = canFilterLessonsByDistance(locationMode);

  return useMemo(() => {
    const category = options?.category ?? 'All';
    const filtered = applyDiscoverSheetFilters(
      applyDiscoverCategoryFilter(lessons, category),
      appliedSheetFilters,
      { filterByDistance }
    );
    return sortDiscoverLessons(filtered, selectedSort);
  }, [lessons, appliedSheetFilters, selectedSort, options?.category, filterByDistance]);
}
