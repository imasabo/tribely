import { getInitials } from '@/lib/userDisplay';
import type { LessonJoinRequest } from '@/types/lessonJoinRequest';

/** Join requests for Alex's Feature Engineering session (alex-l5). */
export const mockLessonJoinRequests: LessonJoinRequest[] = [
  {
    id: 'join-req-alex-l5-1',
    lessonId: 'alex-l5',
    requesterId: 'friend-jordan',
    requesterName: 'Jordan Park',
    requesterInitials: getInitials('Jordan Park'),
    message: 'I’ve used pandas a bit — excited to learn feature pipelines.',
    requestedAtLabel: '2 hours ago',
    status: 'accepted',
  },
  {
    id: 'join-req-alex-l5-2',
    lessonId: 'alex-l5',
    requesterId: 'friend-sam',
    requesterName: 'Sam Rivera',
    requesterInitials: getInitials('Sam Rivera'),
    requestedAtLabel: 'Yesterday',
    status: 'accepted',
  },
  {
    id: 'join-req-alex-l5-3',
    lessonId: 'alex-l5',
    requesterId: 'friend-priya',
    requesterName: 'Priya Nair',
    requesterInitials: getInitials('Priya Nair'),
    requestedAtLabel: 'Jun 1, 2026',
    status: 'accepted',
  },
  {
    id: 'join-req-alex-l5-4',
    lessonId: 'alex-l5',
    requesterId: 'friend-taylor',
    requesterName: 'Taylor Kim',
    requesterInitials: getInitials('Taylor Kim'),
    requestedAtLabel: 'Today',
    status: 'pending',
  },
  {
    id: 'join-req-alex-l5-5',
    lessonId: 'alex-l5',
    requesterId: 'friend-marcus',
    requesterName: 'Marcus Lee',
    requesterInitials: getInitials('Marcus Lee'),
    message: 'Can I bring my laptop?',
    requestedAtLabel: 'Today',
    status: 'pending',
  },
];
