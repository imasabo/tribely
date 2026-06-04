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
  /** Google Slides share link (edit or view). Required for all lessons. */
  googleSlidesUrl: string;
  /** Card thumbnail accent when not rendering a live embed. */
  slidePreviewColors: [string, string, string];
  priceCents?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  bio?: string;
  city?: string;
  teachTopics: string[];
  learnTopics: string[];
  stats: {
    /** Average star rating from lesson feedback (as teacher and as learner). */
    rating: number;
    lessonsTaught: number;
    students: number;
    reviews: number;
  };
}

/** A comment on a friend's completed-lesson activity. */
export interface ActivityComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  body: string;
  createdAtLabel: string;
}

export type NotificationType =
  | 'lesson_completed'
  | 'comment'
  | 'like'
  | 'booking_reminder'
  | 'lesson_nearby';

/** In-app notification shown in the notifications screen. */
export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAtLabel: string;
  read: boolean;
  actorName?: string;
  actorAvatar?: string;
  /** Route path, e.g. /activity/activity-1 or /lesson/1 */
  href?: string;
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
  likeCount?: number;
  likedByMe?: boolean;
  comments?: ActivityComment[];
}
