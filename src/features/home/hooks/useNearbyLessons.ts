import { useCallback, useEffect, useMemo, useState } from 'react';

import { lessonsService } from '@/services/lessons.service';
import type { Lesson } from '@/types/domain';

export function useNearbyLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLessons(await lessonsService.listNearby());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const featured = useMemo(() => lessons.filter((l) => l.featured), [lessons]);
  const nearby = useMemo(() => lessons.filter((l) => !l.featured), [lessons]);

  return { lessons, featured, nearby, loading, error, refetch: load };
}
