export interface LessonChatInboxItem {
  lessonId: string;
  title: string;
  teacherName: string;
  teacherAvatar: string;
  scheduledAtLabel: string;
  lastMessageBody?: string;
  lastMessageSender?: string;
  lastMessageAtLabel?: string;
  lastSentAt?: number;
  isHost: boolean;
}

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
