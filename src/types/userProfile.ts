import type { UserRole } from '@/types/domain';

export interface UserProfileStats {
  rating: number;
  lessonsTaught: number;
  students: number;
  reviews: number;
}

/** Tribely user profile loaded after auth (Firestore users/{uid}). */
export interface UserProfile {
  uid: string;
  username: string | null;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  bio: string;
  city?: string;
  teachTopics: string[];
  learnTopics: string[];
  stats: UserProfileStats;
  /** e.g. "Joined March 2025" — derived from Firestore createdAt when available. */
  joinedAtLabel?: string;
  onboardingComplete: boolean;
}

export const EMPTY_USER_PROFILE_STATS: UserProfileStats = {
  rating: 0,
  lessonsTaught: 0,
  students: 0,
  reviews: 0,
};
