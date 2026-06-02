import { useCallback, useEffect, useState } from 'react';

import { lessonsService } from '@/services/lessons.service';
import type { Lesson } from '@/types/domain';

export function useLesson(id: string | undefined) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setLesson(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await lessonsService.getById(id);
      setLesson(result);
      if (!result) setError('Lesson not found');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load lesson');
      setLesson(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { lesson, loading, error, refetch: load };
}
