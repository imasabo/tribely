import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  removeDiscoverFilterPill,
  type DiscoverFilterPillId,
} from '@/features/discover/lib/discoverFilterPills';
import {
  countActiveSheetFilters,
  DEFAULT_DISCOVER_SHEET_FILTERS,
  type DiscoverSheetFilters,
  type DiscoverSortOption,
} from '@/features/discover/types';

function cloneSheetFilters(filters: DiscoverSheetFilters = DEFAULT_DISCOVER_SHEET_FILTERS): DiscoverSheetFilters {
  return {
    ...filters,
    durations: [...filters.durations],
  };
}

interface DiscoverFiltersContextValue {
  appliedSheetFilters: DiscoverSheetFilters;
  selectedSort: DiscoverSortOption;
  activeFilterCount: number;
  sheetVisible: boolean;
  draftSheetFilters: DiscoverSheetFilters;
  openFilterSheet: () => void;
  closeFilterSheet: () => void;
  setDraftSheetFilters: (filters: DiscoverSheetFilters) => void;
  applySheetFilters: () => void;
  resetDraftSheetFilters: () => void;
  resetAppliedSheetFilters: () => void;
  removeAppliedFilterPill: (pillId: DiscoverFilterPillId) => void;
  setSelectedSort: (sort: DiscoverSortOption) => void;
}

const DiscoverFiltersContext = createContext<DiscoverFiltersContextValue | null>(null);

export function DiscoverFiltersProvider({ children }: { children: ReactNode }) {
  const [appliedSheetFilters, setAppliedSheetFilters] = useState(cloneSheetFilters);
  const [draftSheetFilters, setDraftSheetFilters] = useState(cloneSheetFilters);
  const [selectedSort, setSelectedSort] = useState<DiscoverSortOption>('Nearest');
  const [sheetVisible, setSheetVisible] = useState(false);

  const activeFilterCount = countActiveSheetFilters(appliedSheetFilters);

  const openFilterSheet = useCallback(() => {
    setDraftSheetFilters(cloneSheetFilters(appliedSheetFilters));
    setSheetVisible(true);
  }, [appliedSheetFilters]);

  const closeFilterSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  const applySheetFilters = useCallback(() => {
    setAppliedSheetFilters(cloneSheetFilters(draftSheetFilters));
    setSheetVisible(false);
  }, [draftSheetFilters]);

  const resetDraftSheetFilters = useCallback(() => {
    setDraftSheetFilters(cloneSheetFilters());
  }, []);

  const resetAppliedSheetFilters = useCallback(() => {
    setAppliedSheetFilters(cloneSheetFilters());
  }, []);

  const removeAppliedFilterPill = useCallback((pillId: DiscoverFilterPillId) => {
    setAppliedSheetFilters((prev) =>
      cloneSheetFilters(removeDiscoverFilterPill(prev, pillId))
    );
  }, []);

  const value = useMemo(
    () => ({
      appliedSheetFilters,
      selectedSort,
      activeFilterCount,
      sheetVisible,
      draftSheetFilters,
      openFilterSheet,
      closeFilterSheet,
      setDraftSheetFilters,
      applySheetFilters,
      resetDraftSheetFilters,
      resetAppliedSheetFilters,
      removeAppliedFilterPill,
      setSelectedSort,
    }),
    [
      appliedSheetFilters,
      selectedSort,
      activeFilterCount,
      sheetVisible,
      draftSheetFilters,
      openFilterSheet,
      closeFilterSheet,
      applySheetFilters,
      resetDraftSheetFilters,
      resetAppliedSheetFilters,
      removeAppliedFilterPill,
    ]
  );

  return (
    <DiscoverFiltersContext.Provider value={value}>{children}</DiscoverFiltersContext.Provider>
  );
}

export function useDiscoverFilters() {
  const ctx = useContext(DiscoverFiltersContext);
  if (!ctx) {
    throw new Error('useDiscoverFilters must be used within DiscoverFiltersProvider');
  }
  return ctx;
}
