import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import type { LessonDurationMinutes, LessonStatus, UserRole } from './domain';

export type FirestoreTimestamp = FirebaseFirestoreTypes.Timestamp;

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
  deckStoragePath: string;
  maxLearners: number;
  featured: boolean;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export interface UserDoc {
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
