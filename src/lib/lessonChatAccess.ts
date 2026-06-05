import { OWN_PROFILE_STATS_USER_ID } from '@/features/profile/lib/ownProfileStats';
import { lessonCatalogStore } from '@/data/lessonCatalogStore';
import { isLessonOwner } from '@/lib/lessonEnrollment';
import type { Lesson } from '@/types/domain';
import type { LessonJoinRequest } from '@/types/lessonJoinRequest';

/** Maps live auth uid → mock id used in join-request seeds (Alex in dev). */
export function resolveChatViewerId(viewerUid: string | undefined): string | undefined {
  if (!viewerUid) return undefined;
  if (viewerUid === OWN_PROFILE_STATS_USER_ID) return viewerUid;
  return OWN_PROFILE_STATS_USER_ID;
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
