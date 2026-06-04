import { useEffect, useMemo } from 'react';

import {
  canFilterLessonsByDistance,
  formatDiscoverLocationLabel,
  getDiscoverLocationTooltip,
} from '@/features/discover/lib/discoverLocation';
import { countActiveSheetFilters } from '@/features/discover/types';
import { useDiscoverFilters } from '@/providers/DiscoverFiltersProvider';
import { useDiscoverLocationContext } from '@/providers/DiscoverLocationProvider';

export function useDiscoverLocationFeatures() {
  const { mode, fallbackCity } = useDiscoverLocationContext();
  const { appliedSheetFilters, selectedSort, setSelectedSort } = useDiscoverFilters();

  const distanceFilteringEnabled = canFilterLessonsByDistance(mode);
  const showLessonDistance = distanceFilteringEnabled;

  const locationLabel = useMemo(
    () =>
      formatDiscoverLocationLabel(
        { mode, fallbackCity },
        appliedSheetFilters.distanceMiles
      ),
    [mode, fallbackCity, appliedSheetFilters.distanceMiles]
  );

  const locationTooltip = useMemo(
    () =>
      getDiscoverLocationTooltip(
        { mode, fallbackCity },
        appliedSheetFilters.distanceMiles
      ),
    [mode, fallbackCity, appliedSheetFilters.distanceMiles]
  );

  const activeFilterCount = countActiveSheetFilters(appliedSheetFilters, {
    includeDistance: distanceFilteringEnabled,
  });

  useEffect(() => {
    if (!distanceFilteringEnabled && selectedSort === 'Nearest') {
      setSelectedSort('Rating');
    }
  }, [distanceFilteringEnabled, selectedSort, setSelectedSort]);

  return {
    mode,
    fallbackCity,
    distanceFilteringEnabled,
    showLessonDistance,
    locationLabel,
    locationTooltip,
    activeFilterCount,
  };
}
