import { lessonCatalogStore } from '@/data/lessonCatalogStore';
import { learnerRatingsStore } from '@/data/learnerRatingsStore';
import { mockLessonJoinRequests } from '@/data/mock/lessonJoinRequests';
import { isLessonOwner } from '@/lib/lessonEnrollment';
import { resolveChatViewerId } from '@/lib/lessonChatAccess';
import { hasEndedSession } from '@/lib/lessonSessions';
import { getInitials } from '@/lib/userDisplay';
import type { LearnerRating } from '@/types/learnerRating';

export interface LearnerToRate {
  learnerId: string;
  learnerName: string;
  learnerInitials: string;
  existingRating: LearnerRating | null;
}

export interface SubmitLearnerRatingParams {
  lessonId: string;
  learnerId: string;
  learnerName: string;
  viewerUid: string | undefined;
  teacherDisplayName: string;
  rating: number;
  reviewSnippet?: string;
}

export const learnerRatingsService = {
  async canRateLearners(lessonId: string, viewerUid: string | undefined): Promise<boolean> {
    const lesson = lessonCatalogStore.getById(lessonId);
    if (!lesson || !isLessonOwner(lesson, viewerUid)) return false;
    if (!hasEndedSession(lesson)) return false;
    const learners = await this.listLearnersToRate(lessonId, viewerUid);
    return learners.length > 0;
  },

  async countUnratedLearners(lessonId: string, viewerUid: string | undefined): Promise<number> {
    const learners = await this.listLearnersToRate(lessonId, viewerUid);
    return learners.filter((l) => l.existingRating == null).length;
  },

  async listLearnersToRate(lessonId: string, viewerUid: string | undefined): Promise<LearnerToRate[]> {
    const teacherId = resolveChatViewerId(viewerUid);
    if (!teacherId) return [];

    const lesson = lessonCatalogStore.getById(lessonId);
    if (!lesson || !isLessonOwner(lesson, viewerUid)) return [];

    const accepted = mockLessonJoinRequests.filter(
      (r) => r.lessonId === lessonId && r.status === 'accepted'
    );

    return accepted.map((request) => ({
      learnerId: request.requesterId,
      learnerName: request.requesterName,
      learnerInitials: request.requesterInitials,
      existingRating: learnerRatingsStore.getForLearner(lessonId, request.requesterId),
    }));
  },

  async submit(params: SubmitLearnerRatingParams): Promise<LearnerRating> {
    const teacherId = resolveChatViewerId(params.viewerUid);
    if (!teacherId) {
      throw new Error('Sign in to rate learners.');
    }

    const lesson = lessonCatalogStore.getById(params.lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    if (!isLessonOwner(lesson, params.viewerUid)) {
      throw new Error('Only the lesson host can rate learners.');
    }
    if (!hasEndedSession(lesson)) {
      throw new Error('You can rate learners after a session ends.');
    }

    const accepted = mockLessonJoinRequests.some(
      (r) =>
        r.lessonId === params.lessonId &&
        r.requesterId === params.learnerId &&
        r.status === 'accepted'
    );
    if (!accepted) {
      throw new Error('This learner was not in your session.');
    }

    if (params.rating < 1 || params.rating > 5) {
      throw new Error('Choose a rating from 1 to 5 stars.');
    }

    const teacherName = params.teacherDisplayName.trim() || 'You';
    return learnerRatingsStore.submit({
      lessonId: params.lessonId,
      lessonTitle: lesson.title,
      teacherId,
      teacherName,
      teacherInitials: getInitials(teacherName),
      learnerId: params.learnerId,
      learnerName: params.learnerName,
      learnerInitials: getInitials(params.learnerName),
      rating: params.rating,
      reviewSnippet: params.reviewSnippet,
    });
  },

  async listReviewsForLearnerProfile(learnerId: string) {
    return learnerRatingsStore.listReviewsForLearnerProfile(learnerId);
  },
};
