import type { Feather } from '@expo/vector-icons';

export type ProfileStatIcon = 'star' | 'book-open' | 'users' | 'award';

export type ProfileStatKey = 'rating' | 'taught' | 'students' | 'reviews';

export interface ProfileTaughtItem {
  id: string;
  lessonId: string;
  title: string;
  category: string;
  categoryEmoji: string;
  completedAtLabel: string;
  sessionCount: number;
  rating: number;
}

export interface ProfileStudentItem {
  id: string;
  /** Tribely member id when the student is a known profile. */
  userId?: string;
  displayName: string;
  initials: string;
  lessonsCompleted: number;
  lastLessonTitle: string;
  lastSeenLabel: string;
}

/** Whether the review rates this member as a teacher or as a learner in the session. */
export type ProfileReviewContext = 'as_teacher' | 'as_learner';

export interface ProfileReviewItem {
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  body: string;
  lessonTitle: string;
  createdAtLabel: string;
  /** Who left the rating: students (as teacher) or teachers (as learner). */
  context: ProfileReviewContext;
}

export interface ProfileStatItem {
  label: string;
  value: string;
  icon: ProfileStatIcon;
  statKey: ProfileStatKey;
  /** Short line under the label (e.g. Rating clarifier). */
  hint?: string;
}

export interface ProfileActivityItem {
  title: string;
  /** Date or meta line; role may be embedded or set via `role`. */
  subtitle: string;
  role?: 'taught' | 'learned';
  rating?: number;
}

/** Display model for the shared profile layout (self or another user). */
export interface ProfileViewModel {
  username: string;
  displayName: string;
  /** e.g. "San Francisco, CA · Joined March 2025" */
  metaLine: string;
  bio?: string;
  teachTopics: string[];
  learnTopics: string[];
  stats: ProfileStatItem[];
}

export type UpcomingLessonRole = 'teaching' | 'attending';

/** A lesson on the user's upcoming schedule. */
export interface UpcomingLessonItem {
  id: string;
  lessonId: string;
  role: UpcomingLessonRole;
  title: string;
  category: string;
  categoryEmoji: string;
  scheduledAtLabel: string;
  locationName: string;
  durationMinutes: number;
  slidePreviewColors: [string, string, string];
  teacherName?: string;
  teacherAvatar?: string;
  enrolledCount?: number;
  maxLearners?: number;
}

export interface UpcomingLessonsBundle {
  teaching: UpcomingLessonItem[];
  attending: UpcomingLessonItem[];
}
