import { collections } from '@/constants/collections';
import { firestore, isFirestoreAvailable, serverTimestamp } from '@/lib/firestore/client';
import { isReservedUsername } from '@/lib/usernameReserved';
import { isValidUsername, normalizeUsernameInput } from '@/lib/username';
import type { UsernameClaimDoc } from '@/types/firestore';

export type UsernameAvailability = 'available' | 'taken' | 'reserved' | 'invalid';

export const usernameService = {
  checkAvailability(username: string, currentUid?: string): UsernameAvailability {
    const normalized = normalizeUsernameInput(username);
    if (!isValidUsername(normalized)) return 'invalid';
    if (isReservedUsername(normalized)) return 'reserved';
    return 'available';
  },

  async isUsernameTaken(username: string, currentUid?: string): Promise<boolean> {
    const normalized = normalizeUsernameInput(username);
    const availability = this.checkAvailability(normalized, currentUid);
    if (availability !== 'available') return true;

    if (!isFirestoreAvailable()) return false;

    const snap = await firestore()
      .collection(collections.usernames)
      .doc(normalized)
      .get();

    if (!snap.exists) return false;
    const data = snap.data() as UsernameClaimDoc | undefined;
    if (!data?.uid) return false;
    return data.uid !== currentUid;
  },

  async claimUsername(params: {
    uid: string;
    username: string;
    previousUsername?: string | null;
  }): Promise<void> {
    if (!isFirestoreAvailable()) {
      throw new Error('Firestore is unavailable in Expo Go.');
    }

    const normalized = normalizeUsernameInput(params.username);
    if (!isValidUsername(normalized)) {
      throw new Error('Choose a valid username.');
    }
    if (isReservedUsername(normalized)) {
      throw new Error('That username is reserved.');
    }
    if (!params.uid) {
      throw new Error('You must be signed in to claim a username.');
    }

    const db = firestore();
    const claimRef = db.collection(collections.usernames).doc(normalized);
    const previous =
      params.previousUsername != null
        ? normalizeUsernameInput(params.previousUsername)
        : null;

    await db.runTransaction(async (tx) => {
      const claimSnap = await tx.get(claimRef);
      if (claimSnap.exists) {
        const existing = claimSnap.data() as UsernameClaimDoc | undefined;
        if (existing?.uid && existing.uid !== params.uid) {
          throw new Error('That username is already taken.');
        }
        if (existing?.uid === params.uid) {
          return;
        }
      }

      if (previous && previous !== normalized && isValidUsername(previous)) {
        const prevRef = db.collection(collections.usernames).doc(previous);
        const prevSnap = await tx.get(prevRef);
        if (prevSnap.exists) {
          const prevData = prevSnap.data() as UsernameClaimDoc | undefined;
          if (prevData?.uid === params.uid) {
            tx.delete(prevRef);
          }
        }
      }

      const claim: UsernameClaimDoc = {
        uid: params.uid,
        createdAt: serverTimestamp() as UsernameClaimDoc['createdAt'],
      };
      tx.set(claimRef, claim);
    });
  },
};
