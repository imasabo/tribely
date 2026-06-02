import { useCallback, useEffect, useState } from 'react';

import { lessonsService } from '@/services/lessons.service';
import type { Lesson } from '@/types/domain';

export function useDiscoverLessons() {
  const [featured, setFeatured] = useState<Lesson[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [featuredLessons, discoverLessons] = await Promise.all([
        lessonsService.listFeatured(),
        lessonsService.listDiscover(),
      ]);
      setFeatured(featuredLessons);
      setLessons(discoverLessons);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { featured, lessons, loading, error, refetch: load };
}
