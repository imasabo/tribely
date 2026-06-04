import type { ProfileReviewContext, ProfileReviewItem } from '@/features/profile/types';

export type ProfileReviewFilter = 'all' | ProfileReviewContext;

export interface ProfileReviewRatingSlice {
  average: number | null;
  count: number;
}

export interface ProfileReviewSummary {
  overall: number | null;
  teaching: ProfileReviewRatingSlice;
  learning: ProfileReviewRatingSlice;
}

function averageRating(reviews: ProfileReviewItem[]): number | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function buildProfileReviewSummary(reviews: ProfileReviewItem[]): ProfileReviewSummary {
  const teaching = reviews.filter((review) => review.context === 'as_teacher');
  const learning = reviews.filter((review) => review.context === 'as_learner');

  return {
    overall: averageRating(reviews),
    teaching: { average: averageRating(teaching), count: teaching.length },
    learning: { average: averageRating(learning), count: learning.length },
  };
}

export function filterProfileReviews(
  reviews: ProfileReviewItem[],
  filter: ProfileReviewFilter
): ProfileReviewItem[] {
  if (filter === 'all') return reviews;
  return reviews.filter((review) => review.context === filter);
}

export function parseProfileReviewFilter(
  value: string | string[] | undefined
): ProfileReviewFilter {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'as_teacher' || raw === 'teaching') return 'as_teacher';
  if (raw === 'as_learner' || raw === 'learning') return 'as_learner';
  return 'all';
}

export function emptyMessageForReviewFilter(filter: ProfileReviewFilter): string {
  switch (filter) {
    case 'as_teacher':
      return 'No ratings from students yet.';
    case 'as_learner':
      return 'No ratings from teachers yet.';
    default:
      return 'No ratings yet — reviews appear after lessons you teach or attend.';
  }
}
