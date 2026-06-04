import { DiscoverFilterSheet } from '@/features/discover/components/DiscoverFilterSheet';
import { useDiscoverLocationFeatures } from '@/features/discover/hooks/useDiscoverLocationFeatures';
import { useDiscoverFilters } from '@/providers/DiscoverFiltersProvider';

/** Renders the shared filter sheet — mount once near app root or on screens that use filters. */
export function DiscoverFiltersModal() {
  const {
    sheetVisible,
    draftSheetFilters,
    setDraftSheetFilters,
    applySheetFilters,
    resetDraftSheetFilters,
    closeFilterSheet,
  } = useDiscoverFilters();
  const { distanceFilteringEnabled } = useDiscoverLocationFeatures();

  return (
    <DiscoverFilterSheet
      visible={sheetVisible}
      draft={draftSheetFilters}
      distanceFilterEnabled={distanceFilteringEnabled}
      onChange={setDraftSheetFilters}
      onApply={applySheetFilters}
      onReset={resetDraftSheetFilters}
      onClose={closeFilterSheet}
    />
  );
}
