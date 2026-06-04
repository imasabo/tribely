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
  title: string;
  description: string;
  category: string;
  categoryEmoji: string;
  durationMinutes: LessonDurationMinutes;
  priceCents: number;
  location: LessonLocationDoc;
  scheduledAt: FirestoreTimestamp;
  status: LessonStatus;
  googleSlidesUrl: string;
  maxLearners: number;
  featured: boolean;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export interface UserDoc {
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
    rating: number;
    lessonsTaught: number;
    students: number;
    reviews: number;
  };
  createdAt: FirestoreTimestamp;
}
