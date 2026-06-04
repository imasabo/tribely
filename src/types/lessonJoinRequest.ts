export type LessonJoinRequestStatus = 'pending' | 'accepted' | 'declined';

export interface LessonJoinRequest {
  id: string;
  lessonId: string;
  requesterId: string;
  requesterName: string;
  requesterInitials: string;
  message?: string;
  requestedAtLabel: string;
  status: LessonJoinRequestStatus;
}
