import type { LessonChatMessage } from '@/types/lessonChat';

const base = Date.now() - 1000 * 60 * 60 * 5;

/** Group chat for alex-l5 — teacher + accepted learners. */
export const mockLessonChatMessages: LessonChatMessage[] = [
  {
    id: 'chat-alex-l5-1',
    lessonId: 'alex-l5',
    senderId: 'dev-user-alex',
    senderName: 'Alex Kim',
    senderInitials: 'AK',
    body: 'Welcome to the Feature Engineering session chat. I’ll share prep notes here before tomorrow.',
    sentAtLabel: '10:15 AM',
    sentAt: base,
  },
  {
    id: 'chat-alex-l5-2',
    lessonId: 'alex-l5',
    senderId: 'friend-jordan',
    senderName: 'Jordan Park',
    senderInitials: 'JP',
    body: 'Thanks Alex! Should we install scikit-learn beforehand?',
    sentAtLabel: '10:22 AM',
    sentAt: base + 1000 * 60 * 7,
  },
  {
    id: 'chat-alex-l5-3',
    lessonId: 'alex-l5',
    senderId: 'dev-user-alex',
    senderName: 'Alex Kim',
    senderInitials: 'AK',
    body: 'Yes — I’ll drop a Colab link in a bit. Pandas 2.x is fine.',
    sentAtLabel: '10:24 AM',
    sentAt: base + 1000 * 60 * 9,
  },
  {
    id: 'chat-alex-l5-4',
    lessonId: 'alex-l5',
    senderId: 'friend-sam',
    senderName: 'Sam Rivera',
    senderInitials: 'SR',
    body: 'I’m bringing my laptop. Is there outlet access at WeWork SoMa?',
    sentAtLabel: '11:05 AM',
    sentAt: base + 1000 * 60 * 50,
  },
  {
    id: 'chat-alex-l5-5',
    lessonId: 'alex-l5',
    senderId: 'dev-user-alex',
    senderName: 'Alex Kim',
    senderInitials: 'AK',
    body: 'Plenty of outlets in the conference room — I’ll meet everyone in the lobby at 1:45.',
    sentAtLabel: '11:08 AM',
    sentAt: base + 1000 * 60 * 53,
  },
  {
    id: 'chat-alex-l5-6',
    lessonId: 'alex-l5',
    senderId: 'friend-priya',
    senderName: 'Priya Nair',
    senderInitials: 'PN',
    body: 'Perfect. See you tomorrow!',
    sentAtLabel: '2:41 PM',
    sentAt: base + 1000 * 60 * 60 * 4.5,
  },
];
