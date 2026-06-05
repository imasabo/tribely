/** Teacher rating label for lesson cards and detail — em dash when unrated. */
export function formatLessonRating(rating: number): string {
  return rating > 0 ? rating.toFixed(1) : '—';
}
