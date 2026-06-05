const RESERVED = new Set([
  'admin',
  'support',
  'help',
  'tribely',
  'root',
  'system',
  'moderator',
  'null',
  'undefined',
]);

export function isReservedUsername(username: string): boolean {
  return RESERVED.has(username.toLowerCase());
}
