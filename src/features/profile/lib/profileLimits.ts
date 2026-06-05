export const PROFILE_USERNAME_CHAR_LIMIT = 30;
export const PROFILE_NAME_MIN_LENGTH = 2;
export const PROFILE_NAME_CHAR_LIMIT = 50;
export const PROFILE_BIO_CHAR_LIMIT = 200;
export const PROFILE_TOPIC_CHAR_LIMIT = 40;

export function validateDisplayName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'Name is required.';
  }
  if (trimmed.length < PROFILE_NAME_MIN_LENGTH) {
    return `Name must be at least ${PROFILE_NAME_MIN_LENGTH} characters.`;
  }
  if (trimmed.length > PROFILE_NAME_CHAR_LIMIT) {
    return `Name must be at most ${PROFILE_NAME_CHAR_LIMIT} characters.`;
  }
  return null;
}
