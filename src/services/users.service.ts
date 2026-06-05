import { collections } from '@/constants/collections';
import { firestore, isFirestoreAvailable, serverTimestamp } from '@/lib/firestore/client';
import type { UserDoc } from '@/types/firestore';
import {
  EMPTY_USER_PROFILE_STATS,
  type UserProfile,
  type UserProfileStats,
} from '@/types/userProfile';
import type { AuthUser } from '@/types/auth';

function defaultStats(): UserProfileStats {
  return { ...EMPTY_USER_PROFILE_STATS };
}

function formatJoinedAtLabel(createdAt: UserDoc['createdAt'] | undefined): string | undefined {
  if (!createdAt || typeof createdAt.toDate !== 'function') return undefined;
  const date = createdAt.toDate();
  return `Joined ${date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
}

function mapStats(data: UserDoc): UserProfileStats {
  const stats = data.stats;
  return {
    rating: stats?.rating ?? 0,
    lessonsTaught: stats?.lessonsTaught ?? 0,
    students: stats?.students ?? 0,
    reviews: stats?.reviews ?? 0,
  };
}

function parseOnboardingComplete(value: unknown): boolean {
  return value === true || value === 'true' || value === 1;
}

function mapUserDoc(uid: string, data: Partial<UserDoc>): UserProfile {
  return {
    uid,
    username: typeof data.username === 'string' ? data.username : null,
    displayName: data.displayName?.trim() || 'New member',
    email: data.email ?? '',
    photoURL: data.photoURL,
    role: data.role ?? 'both',
    bio: data.bio ?? '',
    city: data.city,
    teachTopics: Array.isArray(data.teachTopics) ? data.teachTopics : [],
    learnTopics: Array.isArray(data.learnTopics) ? data.learnTopics : [],
    stats: mapStats(data as UserDoc),
    joinedAtLabel: formatJoinedAtLabel(data.createdAt),
    onboardingComplete: parseOnboardingComplete(data.onboardingComplete),
  };
}

export const usersService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    if (!isFirestoreAvailable()) return null;

    const snap = await firestore().collection(collections.users).doc(uid).get();
    if (!snap.exists) return null;

    const data = snap.data() as UserDoc | undefined;
    if (!data) return null;

    return mapUserDoc(uid, data);
  },

  /** Create a stub profile after first Google sign-in (no username yet). */
  async ensureStubProfile(authUser: AuthUser): Promise<UserProfile> {
    if (!isFirestoreAvailable()) {
      throw new Error('Firestore is unavailable in Expo Go.');
    }

    const ref = firestore().collection(collections.users).doc(authUser.uid);
    const existing = await ref.get();

    if (existing.exists) {
      return mapUserDoc(authUser.uid, existing.data() as UserDoc);
    }

    const doc: Omit<UserDoc, 'createdAt' | 'updatedAt'> & {
      createdAt: ReturnType<typeof serverTimestamp>;
      updatedAt: ReturnType<typeof serverTimestamp>;
    } = {
      displayName: authUser.displayName?.trim() || 'New member',
      email: authUser.email ?? '',
      photoURL: authUser.photoURL ?? undefined,
      role: 'both',
      teachTopics: [],
      learnTopics: [],
      stats: defaultStats(),
      onboardingComplete: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await ref.set(doc);
    const created = await ref.get();
    const createdData = created.data() as UserDoc | undefined;
    if (!createdData) {
      throw new Error('Could not create your profile. Please try again.');
    }
    return mapUserDoc(authUser.uid, createdData);
  },

  async updateAfterUsernameClaim(
    uid: string,
    input: { username: string; displayName?: string }
  ): Promise<UserProfile> {
    if (!isFirestoreAvailable()) {
      throw new Error('Firestore is unavailable in Expo Go.');
    }

    const ref = firestore().collection(collections.users).doc(uid);
    const patch: Record<string, unknown> = {
      username: input.username,
      onboardingComplete: false,
      updatedAt: serverTimestamp(),
    };
    if (input.displayName?.trim()) {
      patch.displayName = input.displayName.trim();
    }

    const existing = await ref.get();
    if (!existing.exists) {
      await ref.set({
        displayName: input.displayName?.trim() || 'New member',
        email: '',
        role: 'both',
        teachTopics: [],
        learnTopics: [],
        stats: defaultStats(),
        onboardingComplete: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    await ref.update(patch);

    const snap = await ref.get();
    const data = snap.data() as UserDoc | undefined;
    if (!data) {
      throw new Error('Profile was saved but could not be loaded. Please try again.');
    }
    return mapUserDoc(uid, data);
  },

  async completeProfileSetup(
    uid: string,
    input: {
      displayName: string;
      bio?: string;
      city?: string;
      teachTopics: string[];
      learnTopics: string[];
    }
  ): Promise<UserProfile> {
    if (!isFirestoreAvailable()) {
      throw new Error('Firestore is unavailable in Expo Go.');
    }

    const ref = firestore().collection(collections.users).doc(uid);
    const existing = await ref.get();

    if (!existing.exists) {
      throw new Error('Your profile was not found. Please sign in again.');
    }

    await ref.update({
      displayName: input.displayName.trim(),
      bio: input.bio?.trim() ?? '',
      city: input.city?.trim() || null,
      teachTopics: input.teachTopics,
      learnTopics: input.learnTopics,
      onboardingComplete: true,
      updatedAt: serverTimestamp(),
    });

    const updated = await this.getProfile(uid);
    if (!updated) {
      throw new Error('Profile was saved but could not be loaded. Please try again.');
    }
    return updated;
  },

  async updateOwnProfile(
    uid: string,
    input: {
      displayName?: string;
      bio?: string;
      teachTopics?: string[];
      learnTopics?: string[];
      city?: string;
    }
  ): Promise<UserProfile> {
    if (!isFirestoreAvailable()) {
      throw new Error('Firestore is unavailable in Expo Go.');
    }

    const ref = firestore().collection(collections.users).doc(uid);
    const patch: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (input.displayName?.trim()) {
      patch.displayName = input.displayName.trim();
    }
    if (input.bio !== undefined) {
      patch.bio = input.bio.trim();
    }
    if (input.teachTopics !== undefined) {
      patch.teachTopics = input.teachTopics;
    }
    if (input.learnTopics !== undefined) {
      patch.learnTopics = input.learnTopics;
    }
    if (input.city !== undefined) {
      patch.city = input.city.trim() || null;
    }

    await ref.update(patch);
    const updated = await this.getProfile(uid);
    if (!updated) {
      throw new Error('Profile was saved but could not be loaded. Please try again.');
    }
    return updated;
  },
};
