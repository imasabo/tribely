import { useCallback, useEffect, useRef, useState } from 'react';

import { lessonsService } from '@/services/lessons.service';
import type { Lesson } from '@/types/domain';

type LoadMode = 'initial' | 'refresh';

export function useDiscoverLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadInFlightRef = useRef(false);

  const load = useCallback(async (mode: LoadMode = 'initial') => {
    if (loadInFlightRef.current && mode === 'refresh') {
      return;
    }

    loadInFlightRef.current = true;
    if (mode === 'refresh') {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const discoverLessons = await lessonsService.listDiscover();
      setLessons(discoverLessons);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load lessons';
      setError(message);
      if (mode === 'initial') {
        setLessons([]);
      }
    } finally {
      loadInFlightRef.current = false;
      if (mode === 'refresh') {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void load('initial');
  }, [load]);

  const refetch = useCallback(() => load('refresh'), [load]);

  return { lessons, loading, refreshing, error, refetch, retry: () => load('initial') };
}
