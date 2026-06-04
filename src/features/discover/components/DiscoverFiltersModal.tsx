import { DiscoverFilterSheet } from '@/features/discover/components/DiscoverFilterSheet';
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

  return (
    <DiscoverFilterSheet
      visible={sheetVisible}
      draft={draftSheetFilters}
      onChange={setDraftSheetFilters}
      onApply={applySheetFilters}
      onReset={resetDraftSheetFilters}
      onClose={closeFilterSheet}
    />
  );
}
