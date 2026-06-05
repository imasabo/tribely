import type { LessonChatMessage } from '@/types/lessonChat';

const base = Date.now() - 1000 * 60 * 60 * 5;
const watercolorBase = Date.now() - 1000 * 60 * 45;
const guitarBase = Date.now() - 1000 * 60 * 8;
const longTitleBase = Date.now() - 1000 * 60 * 3;

/** Long lesson title — inbox truncation demo (Alex is a learner). */
const mockLongTitleLearnerChatMessages: LessonChatMessage[] = [
  {
    id: 'chat-long-title-1',
    lessonId: 'chat-long-title',
    senderId: 'dev-user-alex',
    senderName: 'Alex Kim',
    senderInitials: 'AK',
    body: 'Hi Priya — will we cover deployment pipelines in this session?',
    sentAtLabel: '11:40 AM',
    sentAt: longTitleBase - 1000 * 60 * 25,
  },
  {
    id: 'chat-long-title-2',
    lessonId: 'chat-long-title',
    senderId: 'teacher-pn',
    senderName: 'Priya Nair',
    senderInitials: 'PN',
    body: 'Yes — bring a laptop with Docker installed. Slides link is in the lesson page.',
    sentAtLabel: '12:05 PM',
    sentAt: longTitleBase,
  },
];

/** Lesson 2 — Alex is a learner; Marcus hosts. */
const mockGuitarLearnerChatMessages: LessonChatMessage[] = [
  {
    id: 'chat-lesson-2-1',
    lessonId: '2',
    senderId: 'teacher-mr',
    senderName: 'Marcus Rivera',
    senderInitials: 'MR',
    body: 'Welcome to the guitar chat! Bring a tuner if you have one — we’ll start with G, C, and D.',
    sentAtLabel: '3:10 PM',
    sentAt: guitarBase - 1000 * 60 * 60 * 2,
  },
  {
    id: 'chat-lesson-2-2',
    lessonId: '2',
    senderId: 'dev-user-alex',
    senderName: 'Alex Kim',
    senderInitials: 'AK',
    body: 'Sounds good — I’ve never played before. Any acoustic recommendations?',
    sentAtLabel: '3:18 PM',
    sentAt: guitarBase - 1000 * 60 * 60,
  },
  {
    id: 'chat-lesson-2-3',
    lessonId: '2',
    senderId: 'teacher-mr',
    senderName: 'Marcus Rivera',
    senderInitials: 'MR',
    body: 'Any full-size acoustic is fine for today. Meet at the Dolores Park picnic tables near the playground.',
    sentAtLabel: '5:02 PM',
    sentAt: guitarBase,
  },
];

/** Lesson 3 — Alex is a learner; Amara hosts. */
export const mockLearnerLessonChatMessages: LessonChatMessage[] = [
  {
    id: 'chat-lesson-3-1',
    lessonId: '3',
    senderId: 'dev-user-alex',
    senderName: 'Alex Kim',
    senderInitials: 'AK',
    body: 'Hi Amara! Should I bring my own brushes or are supplies included?',
    sentAtLabel: '9:12 AM',
    sentAt: watercolorBase - 1000 * 60 * 60 * 20,
  },
  {
    id: 'chat-lesson-3-2',
    lessonId: '3',
    senderId: 'teacher-ao',
    senderName: 'Amara Osei',
    senderInitials: 'AO',
    body: 'Brushes and paper are provided — just bring an apron if you have one.',
    sentAtLabel: '9:18 AM',
    sentAt: watercolorBase - 1000 * 60 * 60 * 19,
  },
  {
    id: 'chat-lesson-3-3',
    lessonId: '3',
    senderId: 'dev-user-alex',
    senderName: 'Alex Kim',
    senderInitials: 'AK',
    body: 'Perfect, thanks!',
    sentAtLabel: '9:20 AM',
    sentAt: watercolorBase - 1000 * 60 * 60 * 18.5,
  },
  {
    id: 'chat-lesson-3-4',
    lessonId: '3',
    senderId: 'teacher-ao',
    senderName: 'Amara Osei',
    senderInitials: 'AO',
    body: 'See you tomorrow at the Mission library — room 204. I posted the supply list in the lesson notes.',
    sentAtLabel: '4:05 PM',
    sentAt: watercolorBase,
  },
];

/** Group chat for alex-l5 — teacher + accepted learners. */
const mockHostLessonChatMessages: LessonChatMessage[] = [
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

export const mockLessonChatMessages: LessonChatMessage[] = [
  ...mockHostLessonChatMessages,
  ...mockLearnerLessonChatMessages,
  ...mockGuitarLearnerChatMessages,
  ...mockLongTitleLearnerChatMessages,
];
