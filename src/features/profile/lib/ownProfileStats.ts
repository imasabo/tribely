/** Mock stat-detail key for the signed-in user (Alex Kim in dev). */
export const OWN_PROFILE_STATS_USER_ID = 'dev-user-alex';

/** Map live auth uid → mock stats bundle (Firebase anonymous vs dev mock). */
export function resolveProfileStatsUserId(
  routeUserId: string,
  viewerUid?: string | null
): string {
  if (viewerUid && routeUserId === viewerUid) {
    return OWN_PROFILE_STATS_USER_ID;
  }
  return routeUserId;
}
