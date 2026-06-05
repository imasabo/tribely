import { friendLessonActivity } from '@/data/mock/lessons';
import { lessonCatalogStore } from '@/data/lessonCatalogStore';
import type { FriendLessonActivity } from '@/types/domain';

const FEED_SEED_VERSION = 1;

const activities: FriendLessonActivity[] = [];
const completedKeys = new Set<string>();
let feedSeedVersion = 0;

function completionKey(userId: string, lessonId: string): string {
  return `${userId}:${lessonId}`;
}

function seedFeed() {
  if (activities.length > 0 && feedSeedVersion === FEED_SEED_VERSION) return;
  activities.length = 0;
  completedKeys.clear();
  feedSeedVersion = FEED_SEED_VERSION;
  for (const activity of friendLessonActivity) {
    activities.push({ ...activity });
  }
}

export interface AddCompletionInput {
  lessonId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating?: number;
  reviewSnippet?: string;
}

export const activityFeedStore = {
  list(): FriendLessonActivity[] {
    seedFeed();
    return [...activities];
  },

  hasUserCompleted(userId: string, lessonId: string): boolean {
    seedFeed();
    return completedKeys.has(completionKey(userId, lessonId));
  },

  addCompletion(input: AddCompletionInput): FriendLessonActivity {
    seedFeed();
    const key = completionKey(input.userId, input.lessonId);
    if (completedKeys.has(key)) {
      throw new Error('You already shared a completion for this lesson.');
    }

    const lesson = lessonCatalogStore.getById(input.lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const review = input.reviewSnippet?.trim();
    const activity: FriendLessonActivity = {
      id: `activity-${input.lessonId}-${Date.now()}`,
      friendId: input.userId,
      friendName: input.userName,
      friendAvatar: input.userAvatar,
      completedAtLabel: 'Just now',
      lesson,
      ratingGiven: input.rating,
      reviewSnippet: review || undefined,
      likeCount: 0,
      comments: [],
    };

    activities.unshift(activity);
    completedKeys.add(key);
    return activity;
  },
};
