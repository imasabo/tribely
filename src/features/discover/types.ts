import type { LessonDurationMinutes } from '@/types/domain';

export type DiscoverWhenFilter = 'any' | 'today' | 'this_week' | 'weekend';

export type DiscoverDistanceMiles = 1 | 2 | 5 | 10;

export type DiscoverSortOption = 'Nearest' | 'Rating' | 'Soonest' | 'Duration' | 'New';

export interface DiscoverSheetFilters {
  /** Radius in miles from the user's location (geo query in Phase 2). */
  distanceMiles: DiscoverDistanceMiles;
  when: DiscoverWhenFilter;
  durations: LessonDurationMinutes[];
}

export const DEFAULT_DISCOVER_CATEGORY = 'All';

export const DEFAULT_DISCOVER_SHEET_FILTERS: DiscoverSheetFilters = {
  distanceMiles: 2,
  when: 'any',
  durations: [30, 45, 60],
};

export const DISCOVER_DISTANCE_OPTIONS: DiscoverDistanceMiles[] = [1, 2, 5, 10];

export const DISCOVER_WHEN_OPTIONS: { value: DiscoverWhenFilter; label: string }[] = [
  { value: 'any', label: 'Any time' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This week' },
  { value: 'weekend', label: 'Weekend' },
];

export const DISCOVER_DURATION_OPTIONS: LessonDurationMinutes[] = [30, 45, 60];

export function countActiveSheetFilters(
  filters: DiscoverSheetFilters,
  options?: { includeDistance?: boolean }
): number {
  const includeDistance = options?.includeDistance ?? true;
  let count = 0;
  if (
    includeDistance &&
    filters.distanceMiles !== DEFAULT_DISCOVER_SHEET_FILTERS.distanceMiles
  ) {
    count++;
  }
  if (filters.when !== DEFAULT_DISCOVER_SHEET_FILTERS.when) count++;
  if (filters.durations.length !== DEFAULT_DISCOVER_SHEET_FILTERS.durations.length) count++;
  return count;
}

export function sheetFiltersEqual(a: DiscoverSheetFilters, b: DiscoverSheetFilters): boolean {
  return (
    a.distanceMiles === b.distanceMiles &&
    a.when === b.when &&
    a.durations.length === b.durations.length &&
    a.durations.every((d) => b.durations.includes(d))
  );
}
