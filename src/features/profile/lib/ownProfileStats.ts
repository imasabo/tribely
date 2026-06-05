/** Mock lesson catalog is still keyed to this user id in local dev data. */
export const OWN_PROFILE_STATS_USER_ID = 'dev-user-alex';

/** Resolve the user id used for profile stat routes and lesson bundles. */
export function resolveProfileStatsUserId(
  routeUserId: string,
  _viewerUid?: string | null
): string {
  return routeUserId;
}
