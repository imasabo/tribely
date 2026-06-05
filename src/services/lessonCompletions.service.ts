import { activityFeedStore } from '@/data/activityFeedStore';
import { lessonCatalogStore } from '@/data/lessonCatalogStore';
import { canShareLessonCompletion } from '@/lib/lessonSessions';
import { resolveChatViewerId } from '@/lib/lessonChatAccess';
import { getInitials } from '@/lib/userDisplay';
import type { FriendLessonActivity } from '@/types/domain';

export interface SubmitLessonCompletionInput {
  lessonId: string;
  viewerUid: string | undefined;
  displayName: string;
  rating?: number;
  reviewSnippet?: string;
}

export const lessonCompletionsService = {
  async listFeed(): Promise<FriendLessonActivity[]> {
    return activityFeedStore.list();
  },

  async hasCompleted(lessonId: string, viewerUid: string | undefined): Promise<boolean> {
    const userId = resolveChatViewerId(viewerUid);
    if (!userId) return false;
    return activityFeedStore.hasUserCompleted(userId, lessonId);
  },

  async submit(input: SubmitLessonCompletionInput): Promise<FriendLessonActivity> {
    const userId = resolveChatViewerId(input.viewerUid);
    if (!userId) {
      throw new Error('Sign in to post your completion.');
    }

    const lesson = lessonCatalogStore.getById(input.lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    if (!canShareLessonCompletion(lesson)) {
      throw new Error('You can share your experience after the lesson ends.');
    }

    const name = input.displayName.trim() || 'You';
    return activityFeedStore.addCompletion({
      lessonId: input.lessonId,
      userId,
      userName: name,
      userAvatar: getInitials(name),
      rating: input.rating,
      reviewSnippet: input.reviewSnippet,
    });
  },
};
