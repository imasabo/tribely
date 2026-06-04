/** Visible green gradient body below the status bar (excludes safe area). */
export const PROFILE_GRADIENT_BODY_HEIGHT = 128;

/** Avatar overlaps the bottom edge of the cover (matches -mt-10). */
export const PROFILE_AVATAR_OVERLAP = 40;

export const PROFILE_COVER_PULL_STRETCH_MAX = 280;

export function getProfileCoverHeight(safeAreaTop: number): number {
  return PROFILE_GRADIENT_BODY_HEIGHT + safeAreaTop;
}

export function getProfileScrollTopInset(safeAreaTop: number): number {
  return getProfileCoverHeight(safeAreaTop) - PROFILE_AVATAR_OVERLAP;
}
