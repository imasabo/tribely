export const PROFILE_USERNAME_CHAR_LIMIT = 30;
export const PROFILE_NAME_MIN_LENGTH = 2;
export const PROFILE_NAME_CHAR_LIMIT = 50;
export const PROFILE_BIO_CHAR_LIMIT = 200;
export const PROFILE_TOPIC_CHAR_LIMIT = 40;

export function displayNameFieldHint(length: number, error: string | null): string | null {
  if (error) return error;
  if (length >= PROFILE_NAME_CHAR_LIMIT) {
    return `${PROFILE_NAME_CHAR_LIMIT} character limit reached.`;
  }
  return `${PROFILE_NAME_MIN_LENGTH}–${PROFILE_NAME_CHAR_LIMIT} characters.`;
}

export function bioFieldHint(length: number, optional = false): string | null {
  if (length >= PROFILE_BIO_CHAR_LIMIT) {
    return `${PROFILE_BIO_CHAR_LIMIT} character limit reached.`;
  }
  if (optional) return 'Optional';
  return null;
}

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
