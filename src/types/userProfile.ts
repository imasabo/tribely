import type { UserRole } from '@/types/domain';

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
  onboardingComplete: boolean;
}
