import { useEffect, useState } from 'react';

import { lessonsService } from '@/services/lessons.service';
import type { Lesson } from '@/types/domain';

export function useLessonSearch(query: string) {
  const [results, setResults] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    lessonsService
      .search(trimmed)
      .then((lessons) => {
        if (mounted) setResults(lessons);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [query]);

  return { results, loading };
}
