import { lessonCatalogStore } from '@/data/lessonCatalogStore';
import { isLessonOwner } from '@/lib/lessonEnrollment';
import type { Lesson } from '@/types/domain';
import type { LessonJoinRequest } from '@/types/lessonJoinRequest';

export function canAccessLessonChat(
  lesson: Lesson,
  viewerUid: string | undefined,
  acceptedRequests: LessonJoinRequest[]
): boolean {
  if (!viewerUid) return false;
  if (isLessonOwner(lesson, viewerUid)) return true;
  return acceptedRequests.some(
    (r) => r.requesterId === viewerUid && r.status === 'accepted'
  );
}

export function chatMemberCount(lesson: Lesson, acceptedLearnerCount: number): number {
  return 1 + acceptedLearnerCount;
}

export function resolveChatSenderId(viewerUid: string | undefined): string {
  return viewerUid ?? 'dev-user-alex';
}

export function getLessonForChat(lessonId: string) {
  return lessonCatalogStore.getById(lessonId);
}
