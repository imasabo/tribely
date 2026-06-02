export type LessonDurationMinutes = 30 | 45 | 60;
export type LessonStatus = 'draft' | 'published' | 'completed' | 'cancelled';
export type UserRole = 'teacher' | 'learner' | 'both';

/** View model consumed by UI components */
export interface Lesson {
  id: string;
  title: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  category: string;
  categoryEmoji: string;
  distanceLabel: string;
  durationMinutes: LessonDurationMinutes;
  rating: number;
  reviewCount: number;
  scheduledAtLabel: string;
  locationName: string;
  featured?: boolean;
  slidePreviewColors: [string, string, string];
  priceCents?: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  bio?: string;
  city?: string;
  teachTopics: string[];
  learnTopics: string[];
  stats: {
    rating: number;
    lessonsTaught: number;
    students: number;
    reviews: number;
  };
}

/** A lesson a friend recently completed — shown on the home feed. */
export interface FriendLessonActivity {
  id: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  completedAtLabel: string;
  lesson: Lesson;
  ratingGiven?: number;
  reviewSnippet?: string;
}
