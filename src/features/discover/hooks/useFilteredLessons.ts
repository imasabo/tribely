import { useMemo } from 'react';

import {
  applyDiscoverCategoryFilter,
  applyDiscoverSheetFilters,
  sortDiscoverLessons,
} from '@/features/discover/lib/applyDiscoverFilters';
import { useDiscoverFilters } from '@/providers/DiscoverFiltersProvider';
import type { Lesson } from '@/types/domain';

export function useFilteredLessons(
  lessons: Lesson[],
  options?: { category?: string }
) {
  const { appliedSheetFilters, selectedSort } = useDiscoverFilters();

  return useMemo(() => {
    const category = options?.category ?? 'All';
    const filtered = applyDiscoverSheetFilters(
      applyDiscoverCategoryFilter(lessons, category),
      appliedSheetFilters
    );
    return sortDiscoverLessons(filtered, selectedSort);
  }, [lessons, appliedSheetFilters, selectedSort, options?.category]);
}
