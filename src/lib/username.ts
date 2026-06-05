export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

const USERNAME_PATTERN = /^[a-z0-9_]+$/;

/** Strip @, lowercase, and keep only allowed characters while typing. */
export function normalizeUsernameInput(value: string): string {
  return value
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, USERNAME_MAX_LENGTH);
}

export function isValidUsername(username: string): boolean {
  return (
    username.length >= USERNAME_MIN_LENGTH &&
    username.length <= USERNAME_MAX_LENGTH &&
    USERNAME_PATTERN.test(username)
  );
}

export function validateUsernameForClaim(username: string): string | null {
  const normalized = normalizeUsernameInput(username);
  if (!isValidUsername(normalized)) {
    return 'Use 3–30 characters: lowercase letters, numbers, and underscores only.';
  }
  return null;
}

export function formatUsernameLabel(username: string): string {
  return `@${username}`;
}

/** Fallback when migrating mock data without a stored username. */
export function usernameFromDisplayName(displayName: string): string {
  const slug = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, USERNAME_MAX_LENGTH);

  if (slug.length >= USERNAME_MIN_LENGTH) return slug;

  return `user${slug}`.slice(0, USERNAME_MAX_LENGTH).padEnd(USERNAME_MIN_LENGTH, '0');
}
