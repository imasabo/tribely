import { isFirebaseNativeAvailable } from '@/lib/firebase';

/** Mock stat-detail key for the signed-in user (Alex Kim in Expo Go). */
export const OWN_PROFILE_STATS_USER_ID = 'dev-user-alex';

/** Map viewer uid → mock stats id in Expo Go only. */
export function resolveProfileStatsUserId(
  routeUserId: string,
  viewerUid?: string | null
): string {
  if (isFirebaseNativeAvailable) return routeUserId;
  if (viewerUid && routeUserId === viewerUid) {
    return OWN_PROFILE_STATS_USER_ID;
  }
  return routeUserId;
}
