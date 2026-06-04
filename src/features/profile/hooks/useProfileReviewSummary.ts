import { useCallback, useEffect, useState } from 'react';

import {
  buildProfileReviewSummary,
  type ProfileReviewSummary,
} from '@/features/profile/lib/profileReviewSummary';
import { profileStatsService } from '@/services/profileStats.service';

export function useProfileReviewSummary(userId: string) {
  const [summary, setSummary] = useState<ProfileReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!userId) {
      setSummary(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const reviews = await profileStatsService.getReviews(userId);
    setSummary(buildProfileReviewSummary(reviews));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { summary, loading, reload };
}
