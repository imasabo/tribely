import { mockLearnerRatings } from '@/data/mock/learnerRatings';
import type { ProfileReviewItem } from '@/features/profile/types';
import type { LearnerRating } from '@/types/learnerRating';

const RATINGS_SEED_VERSION = 1;

const ratings = new Map<string, LearnerRating>();
let ratingsSeedVersion = 0;

function ratingKey(lessonId: string, learnerId: string): string {
  return `${lessonId}:${learnerId}`;
}

function seedRatings() {
  if (ratings.size > 0 && ratingsSeedVersion === RATINGS_SEED_VERSION) return;
  ratings.clear();
  ratingsSeedVersion = RATINGS_SEED_VERSION;
  for (const rating of mockLearnerRatings) {
    ratings.set(ratingKey(rating.lessonId, rating.learnerId), { ...rating });
  }
}

export interface SubmitLearnerRatingInput {
  lessonId: string;
  lessonTitle: string;
  teacherId: string;
  teacherName: string;
  teacherInitials: string;
  learnerId: string;
  learnerName: string;
  learnerInitials: string;
  rating: number;
  reviewSnippet?: string;
}

export const learnerRatingsStore = {
  listForLesson(lessonId: string): LearnerRating[] {
    seedRatings();
    return Array.from(ratings.values()).filter((r) => r.lessonId === lessonId);
  },

  getForLearner(lessonId: string, learnerId: string): LearnerRating | null {
    seedRatings();
    return ratings.get(ratingKey(lessonId, learnerId)) ?? null;
  },

  hasRated(lessonId: string, learnerId: string): boolean {
    return learnerRatingsStore.getForLearner(lessonId, learnerId) != null;
  },

  listReviewsForLearnerProfile(learnerId: string): ProfileReviewItem[] {
    seedRatings();
    return Array.from(ratings.values())
      .filter((r) => r.learnerId === learnerId)
      .map((r) => ({
        id: r.id,
        authorName: r.teacherName,
        authorInitials: r.teacherInitials,
        rating: r.rating,
        body: r.reviewSnippet ?? '',
        lessonTitle: r.lessonTitle,
        createdAtLabel: r.createdAtLabel,
        context: 'as_learner' as const,
      }));
  },

  submit(input: SubmitLearnerRatingInput): LearnerRating {
    seedRatings();
    const key = ratingKey(input.lessonId, input.learnerId);
    const review = input.reviewSnippet?.trim();

    const rating: LearnerRating = {
      id: ratings.get(key)?.id ?? `lr-${input.lessonId}-${input.learnerId}-${Date.now()}`,
      lessonId: input.lessonId,
      lessonTitle: input.lessonTitle,
      teacherId: input.teacherId,
      teacherName: input.teacherName,
      teacherInitials: input.teacherInitials,
      learnerId: input.learnerId,
      learnerName: input.learnerName,
      learnerInitials: input.learnerInitials,
      rating: input.rating,
      reviewSnippet: review || undefined,
      createdAtLabel: 'Just now',
    };

    ratings.set(key, rating);
    return rating;
  },
};
