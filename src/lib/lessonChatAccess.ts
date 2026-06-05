import { OWN_PROFILE_STATS_USER_ID } from '@/features/profile/lib/ownProfileStats';
import { lessonCatalogStore } from '@/data/lessonCatalogStore';
import { isLessonOwner } from '@/lib/lessonEnrollment';
import type { Lesson } from '@/types/domain';
import type { LessonJoinRequest } from '@/types/lessonJoinRequest';

/** Returns the signed-in viewer id (Firebase uid or Expo Go dev session). */
export function resolveChatViewerId(viewerUid: string | undefined): string | undefined {
  return viewerUid;
}

export function canAccessLessonChat(
  lesson: Lesson,
  viewerUid: string | undefined,
  acceptedRequests: LessonJoinRequest[]
): boolean {
  const viewerKey = resolveChatViewerId(viewerUid);
  if (!viewerKey) return false;
  if (isLessonOwner(lesson, viewerUid)) return true;
  return acceptedRequests.some(
    (r) => r.requesterId === viewerKey && r.status === 'accepted'
  );
}

export function chatMemberCount(lesson: Lesson, acceptedLearnerCount: number): number {
  return 1 + acceptedLearnerCount;
}

export function resolveChatSenderId(viewerUid: string | undefined): string {
  return resolveChatViewerId(viewerUid) ?? OWN_PROFILE_STATS_USER_ID;
}

export function getLessonForChat(lessonId: string) {
  return lessonCatalogStore.getById(lessonId);
}
