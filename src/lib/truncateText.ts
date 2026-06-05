/** Truncate for single-line inbox rows; keeps layout stable before native ellipsis. */
export function truncateInboxTitle(title: string, maxLength = 48): string {
  const trimmed = title.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 3).trimEnd()}...`;
}
