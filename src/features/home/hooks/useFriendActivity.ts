import { useCallback, useEffect, useRef, useState } from 'react';

import { lessonsService } from '@/services/lessons.service';
import type { FriendLessonActivity } from '@/types/domain';

type LoadMode = 'initial' | 'refresh';

export function useFriendActivity() {
  const [activities, setActivities] = useState<FriendLessonActivity[]>([]);
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
      setActivities(await lessonsService.listFriendActivity());
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load friend activity';
      setError(message);
      if (mode === 'initial') {
        setActivities([]);
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

  return { activities, loading, refreshing, error, refetch, retry: () => load('initial') };
}
