import { lessonCatalogStore } from '@/data/lessonCatalogStore';
import { mockLessonJoinRequests } from '@/data/mock/lessonJoinRequests';
import { isLessonFull } from '@/lib/lessonEnrollment';
import { getInitials } from '@/lib/userDisplay';
import type { LessonJoinRequest, LessonJoinRequestStatus } from '@/types/lessonJoinRequest';

const REQUESTS_SEED_VERSION = 6;

const requests = new Map<string, LessonJoinRequest>();
let requestsSeedVersion = 0;

function seedRequests() {
  if (requests.size > 0 && requestsSeedVersion === REQUESTS_SEED_VERSION) return;
  requests.clear();
  requestsSeedVersion = REQUESTS_SEED_VERSION;
  for (const request of mockLessonJoinRequests) {
    requests.set(request.id, { ...request });
  }
}

function listForLesson(lessonId: string): LessonJoinRequest[] {
  seedRequests();
  return Array.from(requests.values()).filter((r) => r.lessonId === lessonId);
}

export const lessonJoinRequestsService = {
  async listByLesson(lessonId: string): Promise<LessonJoinRequest[]> {
    return listForLesson(lessonId);
  },

  async listPendingByLesson(lessonId: string): Promise<LessonJoinRequest[]> {
    return listForLesson(lessonId).filter((r) => r.status === 'pending');
  },

  async listAcceptedByLesson(lessonId: string): Promise<LessonJoinRequest[]> {
    return listForLesson(lessonId).filter((r) => r.status === 'accepted');
  },

  async hasPendingRequest(lessonId: string, requesterId: string): Promise<boolean> {
    return listForLesson(lessonId).some(
      (r) => r.requesterId === requesterId && r.status === 'pending'
    );
  },

  async submitRequest(params: {
    lessonId: string;
    requesterId: string;
    requesterName: string;
    message?: string;
  }): Promise<LessonJoinRequest> {
    seedRequests();

    const existing = listForLesson(params.lessonId).find(
      (r) => r.requesterId === params.requesterId && r.status === 'pending'
    );
    if (existing) return existing;

    const request: LessonJoinRequest = {
      id: `join-req-${params.lessonId}-${Date.now()}`,
      lessonId: params.lessonId,
      requesterId: params.requesterId,
      requesterName: params.requesterName,
      requesterInitials: getInitials(params.requesterName),
      message: params.message,
      requestedAtLabel: 'Just now',
      status: 'pending',
    };

    requests.set(request.id, request);
    return request;
  },

  async updateStatus(
    requestId: string,
    status: LessonJoinRequestStatus
  ): Promise<LessonJoinRequest | null> {
    seedRequests();
    const request = requests.get(requestId);
    if (!request) return null;

    const lesson = lessonCatalogStore.getById(request.lessonId);
    if (!lesson) return null;

    if (status === 'accepted' && isLessonFull(lesson)) {
      return null;
    }

    const updated = { ...request, status };
    requests.set(requestId, updated);

    if (status === 'accepted') {
      const lessonNow = lessonCatalogStore.getById(request.lessonId);
      if (lessonNow && !isLessonFull(lessonNow)) {
        lessonCatalogStore.setEnrolledCount(
          request.lessonId,
          (lessonNow.enrolledCount ?? 0) + 1
        );
      }
    }

    return updated;
  },
};
