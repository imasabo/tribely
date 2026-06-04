import {
  DEFAULT_DISCOVER_SHEET_FILTERS,
  DISCOVER_WHEN_OPTIONS,
  type DiscoverSheetFilters,
} from '@/features/discover/types';
import type { LessonDurationMinutes } from '@/types/domain';

export type DiscoverFilterPillId = 'distance' | 'when' | 'durations';

export interface DiscoverFilterPill {
  id: DiscoverFilterPillId;
  label: string;
}

function formatDurationPillLabel(durations: LessonDurationMinutes[]): string {
  const sorted = [...durations].sort((a, b) => a - b);
  if (sorted.length === 1) return `${sorted[0]} min`;
  return sorted.map((minutes) => `${minutes} min`).join(' · ');
}

function durationsMatchDefault(durations: LessonDurationMinutes[]): boolean {
  const defaults = DEFAULT_DISCOVER_SHEET_FILTERS.durations;
  return (
    durations.length === defaults.length && durations.every((d) => defaults.includes(d))
  );
}

export function getActiveDiscoverFilterPills(
  filters: DiscoverSheetFilters,
  options?: { includeDistance?: boolean }
): DiscoverFilterPill[] {
  const includeDistance = options?.includeDistance ?? true;
  const pills: DiscoverFilterPill[] = [];

  if (
    includeDistance &&
    filters.distanceMiles !== DEFAULT_DISCOVER_SHEET_FILTERS.distanceMiles
  ) {
    pills.push({ id: 'distance', label: `${filters.distanceMiles} mi` });
  }

  if (filters.when !== DEFAULT_DISCOVER_SHEET_FILTERS.when) {
    const whenLabel =
      DISCOVER_WHEN_OPTIONS.find((opt) => opt.value === filters.when)?.label ?? filters.when;
    pills.push({ id: 'when', label: whenLabel });
  }

  if (!durationsMatchDefault(filters.durations)) {
    pills.push({ id: 'durations', label: formatDurationPillLabel(filters.durations) });
  }

  return pills;
}

export function removeDiscoverFilterPill(
  filters: DiscoverSheetFilters,
  pillId: DiscoverFilterPillId
): DiscoverSheetFilters {
  switch (pillId) {
    case 'distance':
      return { ...filters, distanceMiles: DEFAULT_DISCOVER_SHEET_FILTERS.distanceMiles };
    case 'when':
      return { ...filters, when: DEFAULT_DISCOVER_SHEET_FILTERS.when };
    case 'durations':
      return {
        ...filters,
        durations: [...DEFAULT_DISCOVER_SHEET_FILTERS.durations],
      };
    default:
      return filters;
  }
}
