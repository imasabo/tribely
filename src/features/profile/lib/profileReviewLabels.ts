import type { ProfileReviewFilter } from '@/features/profile/lib/profileReviewSummary';

export const PROFILE_REVIEW_TAB_OPTIONS: { id: ProfileReviewFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'as_teacher', label: 'Teaching' },
  { id: 'as_learner', label: 'Learning' },
];
