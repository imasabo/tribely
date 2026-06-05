import type { LessonDurationMinutes, LessonStatus, UserRole } from './domain';

/** Use Firestore Timestamp when native SDK is available; Date for mocks/tests */
export type FirestoreTimestamp = {
  toDate: () => Date;
};

export interface LessonLocationDoc {
  name: string;
  lat: number;
  lng: number;
  geohash?: string;
}

export interface LessonDoc {
  teacherId: string;
  /** Denormalized for lesson cards and detail without a user lookup. */
  teacherDisplayName?: string;
  title: string;
  description: string;
  category: string;
  categoryEmoji: string;
  durationMinutes: LessonDurationMinutes;
  /** Discover city label, e.g. "San Francisco, CA". */
  city?: string;
  /** Discover city id for filtering, e.g. "sf". */
  cityId?: string;
  location: LessonLocationDoc;
  scheduledAt: FirestoreTimestamp;
  status: LessonStatus;
  /** Optional until the teacher adds slides. */
  googleSlidesUrl?: string;
  maxLearners: number;
  featured: boolean;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export interface UserDoc {
  /** Set during username onboarding; absent until claimed. */
  username?: string;
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
  onboardingComplete: boolean;
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

export interface UsernameClaimDoc {
  uid: string;
  createdAt: FirestoreTimestamp;
}
