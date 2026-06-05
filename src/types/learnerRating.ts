/** A teacher's rating of a learner after a lesson session. */
export interface LearnerRating {
  id: string;
  lessonId: string;
  lessonTitle: string;
  teacherId: string;
  teacherName: string;
  teacherInitials: string;
  learnerId: string;
  learnerName: string;
  learnerInitials: string;
  rating: number;
  reviewSnippet?: string;
  createdAtLabel: string;
}
