import type { DiscoverLocationMode } from '@/features/discover/lib/discoverLocation';
import { DEFAULT_DISCOVER_CATEGORY } from '@/features/discover/types';

export interface DiscoverNoResultsContext {
  locationMode: DiscoverLocationMode;
  fallbackCity?: string;
  distanceFilteringEnabled: boolean;
  selectedCategory: string;
  activeSheetFilterCount: number;
  /** Search only — when results exist but filters hide them all */
  searchQuery?: string;
  searchResultCount?: number;
}

export function hasDiscoverListFilters(ctx: DiscoverNoResultsContext): boolean {
  return (
    ctx.selectedCategory !== DEFAULT_DISCOVER_CATEGORY || ctx.activeSheetFilterCount > 0
  );
}

export function getDiscoverNoResultsHint(ctx: DiscoverNoResultsContext): string {
  if (ctx.locationMode === 'needs_city') {
    return 'Choose a city above, or turn on location in Settings, to see lessons near you.';
  }

  if (ctx.searchQuery && ctx.searchResultCount === 0) {
    return `No lessons found for "${ctx.searchQuery}". Try another search term.`;
  }

  if (ctx.searchQuery && ctx.searchResultCount != null && ctx.searchResultCount > 0) {
    const count = ctx.searchResultCount;
    const base = `${count} result${count === 1 ? '' : 's'} for "${ctx.searchQuery}"`;
    if (!hasDiscoverListFilters(ctx)) {
      return base;
    }
    return `${base} — ${getFilterAdjustmentHint(ctx)}`;
  }

  if (!hasDiscoverListFilters(ctx)) {
    if (ctx.locationMode === 'fallback' && ctx.fallbackCity) {
      return `No lessons in ${ctx.fallbackCity} right now. Check back soon or try another category.`;
    }
    return 'No lessons match right now. Check back soon or try another category.';
  }

  return getFilterAdjustmentHint(ctx);
}

function getFilterAdjustmentHint(ctx: DiscoverNoResultsContext): string {
  const tips: string[] = [];

  if (ctx.selectedCategory !== DEFAULT_DISCOVER_CATEGORY) {
    tips.push('another category');
  }

  if (ctx.activeSheetFilterCount > 0) {
    if (ctx.distanceFilteringEnabled) {
      tips.push('widening distance');
    }
    tips.push('when or duration');
  }

  if (tips.length === 0) {
    return 'Try adjusting your filters.';
  }

  if (tips.length === 1) {
    return `Try ${tips[0]}.`;
  }

  return `Try ${tips.slice(0, -1).join(', ')}, or ${tips[tips.length - 1]}.`;
}
