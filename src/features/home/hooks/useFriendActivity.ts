import { useCallback, useEffect, useState } from 'react';

import { lessonsService } from '@/services/lessons.service';
import type { FriendLessonActivity } from '@/types/domain';

export function useFriendActivity() {
  const [activities, setActivities] = useState<FriendLessonActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setActivities(await lessonsService.listFriendActivity());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load friend activity');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { activities, loading, error, refetch: load };
}
