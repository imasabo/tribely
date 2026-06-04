import type { Href } from 'expo-router';

import type { ProfileStatKey } from '@/features/profile/types';

export function getProfileStatHref(
  userId: string,
  statKey: ProfileStatKey
): Href | null {
  if (statKey === 'rating') {
    return `/user/${userId}/reviews?source=rating` as Href;
  }
  return `/user/${userId}/${statKey}` as Href;
}
