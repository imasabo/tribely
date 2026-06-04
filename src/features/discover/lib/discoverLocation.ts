import type { DiscoverDistanceMiles } from '@/features/discover/types';

export type DiscoverLocationMode =
  | 'idle'
  | 'loading'
  | 'device'
  | 'fallback'
  | 'needs_city';

export interface DiscoverLocationContext {
  mode: DiscoverLocationMode;
  /** Set when mode is `fallback` (user-picked city). */
  fallbackCity?: string;
}

/** Distance filter and per-lesson miles only apply with device GPS. */
export function canFilterLessonsByDistance(mode: DiscoverLocationMode): boolean {
  return mode === 'device';
}

export function formatWithinRadiusLabel(miles: DiscoverDistanceMiles): string {
  return `Within ${miles} mi`;
}

export function formatDiscoverLocationLabel(
  location: DiscoverLocationContext,
  distanceMiles: DiscoverDistanceMiles
): string {
  if (location.mode === 'device') {
    return formatWithinRadiusLabel(distanceMiles);
  }
  if (location.fallbackCity) {
    return location.fallbackCity;
  }
  if (location.mode === 'needs_city') {
    return 'Choose a city';
  }
  return 'Finding location…';
}

export function getDiscoverLocationTooltip(
  location: DiscoverLocationContext,
  distanceMiles: DiscoverDistanceMiles
): string {
  const unit = distanceMiles === 1 ? 'mile' : 'miles';

  if (location.mode === 'device') {
    return `Lessons shown are within ${distanceMiles} ${unit} of your current location.`;
  }

  if (location.fallbackCity) {
    const city = location.fallbackCity;
    return `Showing lessons in ${city}. Enable location in Settings to filter by distance from you.`;
  }

  if (location.mode === 'loading' || location.mode === 'idle') {
    return 'Finding your location…';
  }

  if (location.mode === 'needs_city') {
    return 'Choose a city to browse lessons, or enable location in Settings.';
  }

  return 'Choose a city to browse lessons, or enable location in Settings.';
}
