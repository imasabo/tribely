export interface LessonChatMessage {
  id: string;
  lessonId: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  body: string;
  /** Display label, e.g. "10:42 AM" or "Yesterday" */
  sentAtLabel: string;
  /** ISO timestamp for ordering */
  sentAt: number;
}
