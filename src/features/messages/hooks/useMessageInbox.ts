import { useCallback, useEffect, useRef, useState } from 'react';

import { lessonChatService } from '@/services/lessonChat.service';
import type { LessonChatInboxItem } from '@/types/lessonChat';

type LoadMode = 'initial' | 'refresh';

export function useMessageInbox(viewerUid: string | undefined) {
  const [items, setItems] = useState<LessonChatInboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadInFlightRef = useRef(false);

  const load = useCallback(
    async (mode: LoadMode = 'initial') => {
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
        setItems(await lessonChatService.listInbox(viewerUid));
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load messages';
        setError(message);
        if (mode === 'initial') {
          setItems([]);
        }
      } finally {
        loadInFlightRef.current = false;
        if (mode === 'refresh') {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [viewerUid]
  );

  useEffect(() => {
    void load('initial');
  }, [load]);

  const refetch = useCallback(() => load('refresh'), [load]);

  return { items, loading, refreshing, error, refetch, retry: () => load('initial') };
}
