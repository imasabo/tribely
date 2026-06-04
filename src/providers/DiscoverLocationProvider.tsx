import { createContext, useContext, type ReactNode } from 'react';

import { useDiscoverLocation, type DiscoverLocationState } from '@/features/discover/hooks/useDiscoverLocation';

const DiscoverLocationContext = createContext<DiscoverLocationState | null>(null);

export function DiscoverLocationProvider({ children }: { children: ReactNode }) {
  const value = useDiscoverLocation();
  return (
    <DiscoverLocationContext.Provider value={value}>{children}</DiscoverLocationContext.Provider>
  );
}

export function useDiscoverLocationContext() {
  const ctx = useContext(DiscoverLocationContext);
  if (!ctx) {
    throw new Error('useDiscoverLocationContext must be used within DiscoverLocationProvider');
  }
  return ctx;
}
