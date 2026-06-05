import type { LearnerRating } from '@/types/learnerRating';

/** Seed: Alex already rated some Feature Engineering learners. */
export const mockLearnerRatings: LearnerRating[] = [
  {
    id: 'lr-alex-l5-jordan',
    lessonId: 'alex-l5',
    lessonTitle: 'Intro to Feature Engineering',
    teacherId: 'dev-user-alex',
    teacherName: 'Alex Kim',
    teacherInitials: 'AK',
    learnerId: 'friend-jordan',
    learnerName: 'Jordan Park',
    learnerInitials: 'JP',
    rating: 5,
    reviewSnippet: 'Great questions and stayed engaged through the exercises.',
    createdAtLabel: 'Mar 22, 2026',
  },
  {
    id: 'lr-alex-l5-sam',
    lessonId: 'alex-l5',
    lessonTitle: 'Intro to Feature Engineering',
    teacherId: 'dev-user-alex',
    teacherName: 'Alex Kim',
    teacherInitials: 'AK',
    learnerId: 'friend-sam',
    learnerName: 'Sam Rivera',
    learnerInitials: 'SR',
    rating: 4,
    createdAtLabel: 'Mar 22, 2026',
  },
];
