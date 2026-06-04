import type { Feather } from '@expo/vector-icons';

export type ProfileStatIcon = 'star' | 'book-open' | 'users' | 'award';

export type ProfileStatKey = 'rating' | 'taught' | 'students' | 'reviews';

export interface ProfileStatItem {
  label: string;
  value: string;
  icon: ProfileStatIcon;
  color?: string;
  statKey: ProfileStatKey;
}

export interface ProfileTaughtItem {
  id: string;
  title: string;
  category: string;
  categoryEmoji: string;
  completedAtLabel: string;
  sessionCount: number;
  rating: number;
}

export interface ProfileStudentItem {
  id: string;
  displayName: string;
  initials: string;
  lessonsCompleted: number;
  lastLessonTitle: string;
  lastSeenLabel: string;
}

export interface ProfileReviewItem {
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  body: string;
  lessonTitle: string;
  createdAtLabel: string;
}

export interface ProfileActivityItem {
  title: string;
  subtitle: string;
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

export type ProfileTopicVariant = 'teach' | 'learn';

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
