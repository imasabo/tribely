import { useMemo } from 'react';

import {
  applyDiscoverCategoryFilter,
  applyDiscoverCityFilter,
  applyDiscoverSheetFilters,
  sortDiscoverLessons,
} from '@/features/discover/lib/applyDiscoverFilters';
import { canFilterLessonsByDistance } from '@/features/discover/lib/discoverLocation';
import { useDiscoverFilters } from '@/providers/DiscoverFiltersProvider';
import { useDiscoverLocationContext } from '@/providers/DiscoverLocationProvider';
import type { Lesson } from '@/types/domain';

export function useFilteredLessons(lessons: Lesson[]) {
  const { appliedSheetFilters, selectedSort, selectedCategory } = useDiscoverFilters();
  const { mode: locationMode, fallbackCity } = useDiscoverLocationContext();
  const filterByDistance = canFilterLessonsByDistance(locationMode);
  const filterByCity = locationMode === 'fallback' || locationMode === 'needs_city';

  return useMemo(() => {
    let filtered = applyDiscoverCategoryFilter(lessons, selectedCategory);
    if (filterByCity) {
      filtered = applyDiscoverCityFilter(filtered, fallbackCity);
    }
    filtered = applyDiscoverSheetFilters(filtered, appliedSheetFilters, { filterByDistance });
    return sortDiscoverLessons(filtered, selectedSort);
  }, [
    lessons,
    appliedSheetFilters,
    selectedSort,
    selectedCategory,
    filterByDistance,
    filterByCity,
    fallbackCity,
  ]);
}
