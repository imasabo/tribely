/** First name from display name, or fallback. */
export function getFirstName(displayName: string | null | undefined, fallback = 'there'): string {
  if (!displayName?.trim()) return fallback;
  return displayName.trim().split(/\s+/)[0] ?? fallback;
}

/** Initials from display name (e.g. "Alex Kim" → "AK"). */
export function getInitials(displayName: string | null | undefined, fallback = '??'): string {
  if (!displayName?.trim()) return fallback;
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

/** Time-of-day greeting, e.g. "Good afternoon, Alex 👋". */
export function getTimeGreeting(firstName: string): string {
  const hour = new Date().getHours();
  const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  return `Good ${period}, ${firstName} 👋`;
}
