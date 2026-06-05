import { collections } from '@/constants/collections';
import { firestore, isFirestoreAvailable, serverTimestamp } from '@/lib/firestore/client';
import type { UserDoc } from '@/types/firestore';
import type { UserProfile } from '@/types/userProfile';
import type { AuthUser } from '@/types/auth';

function defaultStats(): UserDoc['stats'] {
  return { rating: 0, lessonsTaught: 0, students: 0, reviews: 0 };
}

function mapUserDoc(uid: string, data: UserDoc): UserProfile {
  return {
    uid,
    username: data.username ?? null,
    displayName: data.displayName,
    email: data.email,
    photoURL: data.photoURL,
    role: data.role,
    bio: data.bio ?? '',
    city: data.city,
    teachTopics: data.teachTopics ?? [],
    learnTopics: data.learnTopics ?? [],
    onboardingComplete: data.onboardingComplete === true,
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
      onboardingComplete: true,
      updatedAt: serverTimestamp(),
    };
    if (input.displayName?.trim()) {
      patch.displayName = input.displayName.trim();
    }

    const existing = await ref.get();
    if (existing.exists) {
      await ref.update(patch);
    } else {
      await ref.set({
        displayName: input.displayName?.trim() || 'New member',
        email: '',
        role: 'both',
        teachTopics: [],
        learnTopics: [],
        stats: defaultStats(),
        onboardingComplete: true,
        username: input.username,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    const snap = await ref.get();
    const data = snap.data() as UserDoc | undefined;
    if (!data) {
      throw new Error('Profile was saved but could not be loaded. Please try again.');
    }
    return mapUserDoc(uid, data);
  },
};
