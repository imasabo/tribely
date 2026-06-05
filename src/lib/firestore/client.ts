import { getFirestore, isFirebaseNativeAvailable } from '@/lib/firebase';

export function firestore() {
  const db = getFirestore();
  if (!db) {
    throw new Error(
      'Firestore is unavailable. Run a development build (npx expo run:ios) — Expo Go does not include Firebase.'
    );
  }
  return db();
}

export function serverTimestamp() {
  const mod = getFirestore();
  if (!mod) {
    throw new Error('Firestore is unavailable.');
  }
  return mod.FieldValue.serverTimestamp();
}

export function isFirestoreAvailable(): boolean {
  return isFirebaseNativeAvailable && getFirestore() != null;
}

export function timestampFromDate(date: Date) {
  const mod = getFirestore();
  if (!mod) {
    throw new Error('Firestore is unavailable.');
  }
  return mod.Timestamp.fromDate(date);
}
