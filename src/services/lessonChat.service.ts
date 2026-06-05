import { mockLessonChatMessages } from '@/data/mock/lessonChatMessages';
import { canAccessLessonChat, getLessonForChat, resolveChatSenderId } from '@/lib/lessonChatAccess';
import { getInitials } from '@/lib/userDisplay';
import { lessonJoinRequestsService } from '@/services/lessonJoinRequests.service';
import { isLessonOwner } from '@/lib/lessonEnrollment';
import { lessonCatalogStore } from '@/data/lessonCatalogStore';
import type { LessonChatInboxItem, LessonChatMessage } from '@/types/lessonChat';

const CHAT_SEED_VERSION = 5;

const messages = new Map<string, LessonChatMessage>();
let chatSeedVersion = 0;

function seedMessages() {
  if (messages.size > 0 && chatSeedVersion === CHAT_SEED_VERSION) return;
  messages.clear();
  chatSeedVersion = CHAT_SEED_VERSION;
  for (const message of mockLessonChatMessages) {
    messages.set(message.id, { ...message });
  }
}

function listForLesson(lessonId: string): LessonChatMessage[] {
  seedMessages();
  return Array.from(messages.values())
    .filter((m) => m.lessonId === lessonId)
    .sort((a, b) => a.sentAt - b.sentAt);
}

function formatSentAtLabel(date = new Date()): string {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export const lessonChatService = {
  async canAccess(lessonId: string, viewerUid: string | undefined): Promise<boolean> {
    const lesson = getLessonForChat(lessonId);
    if (!lesson) return false;
    const accepted = await lessonJoinRequestsService.listAcceptedByLesson(lessonId);
    return canAccessLessonChat(lesson, viewerUid, accepted);
  },

  async listMessages(lessonId: string): Promise<LessonChatMessage[]> {
    return listForLesson(lessonId);
  },

  async listInbox(viewerUid: string | undefined): Promise<LessonChatInboxItem[]> {
    const lessons = lessonCatalogStore.listAll();
    const items: LessonChatInboxItem[] = [];

    for (const lesson of lessons) {
      const accepted = await lessonJoinRequestsService.listAcceptedByLesson(lesson.id);
      if (!canAccessLessonChat(lesson, viewerUid, accepted)) continue;

      const thread = listForLesson(lesson.id);
      const last = thread[thread.length - 1];

      const viewerId = resolveChatSenderId(viewerUid);

      items.push({
        lessonId: lesson.id,
        title: lesson.title,
        teacherName: lesson.teacherName,
        teacherAvatar: lesson.teacherAvatar,
        scheduledAtLabel: lesson.scheduledAtLabel,
        lastMessageBody: last?.body,
        lastMessageSender: last?.senderName,
        lastMessageAtLabel: last?.sentAtLabel,
        lastSentAt: last?.sentAt,
        isHost: isLessonOwner(lesson, viewerUid),
        hasUnread: Boolean(last && last.senderId !== viewerId),
      });
    }

    return items.sort((a, b) => (b.lastSentAt ?? 0) - (a.lastSentAt ?? 0));
  },

  async sendMessage(params: {
    lessonId: string;
    senderId: string;
    senderName: string;
    body: string;
  }): Promise<LessonChatMessage | null> {
    seedMessages();
    const lesson = getLessonForChat(params.lessonId);
    if (!lesson) return null;

    const accepted = await lessonJoinRequestsService.listAcceptedByLesson(params.lessonId);
    if (!canAccessLessonChat(lesson, params.senderId, accepted)) return null;

    const now = Date.now();
    const message: LessonChatMessage = {
      id: `chat-${params.lessonId}-${now}`,
      lessonId: params.lessonId,
      senderId: params.senderId,
      senderName: params.senderName,
      senderInitials: getInitials(params.senderName),
      body: params.body.trim(),
      sentAtLabel: formatSentAtLabel(new Date(now)),
      sentAt: now,
    };

    messages.set(message.id, message);
    return message;
  },
};
