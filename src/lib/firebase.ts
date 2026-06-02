import { NativeModules } from 'react-native';

/**
 * True when running a custom dev/production build with RN Firebase linked.
 * False in Expo Go — use `npm run start:go` only for UI; use `npx expo run:ios` for Firebase.
 */
export const isFirebaseNativeAvailable = Boolean(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (NativeModules as Record<string, unknown>).RNFBAppModule
);

type FirebaseAuth = typeof import('@react-native-firebase/auth').default;
type FirebaseFirestore = typeof import('@react-native-firebase/firestore').default;
type FirebaseStorage = typeof import('@react-native-firebase/storage').default;

let authModule: FirebaseAuth | null | undefined;
let firestoreModule: FirebaseFirestore | null | undefined;
let storageModule: FirebaseStorage | null | undefined;

function loadAuth(): FirebaseAuth | null {
  if (!isFirebaseNativeAvailable) return null;
  if (authModule !== undefined) return authModule;
  try {
    // Lazy require — avoids crashing Expo Go at import time
    authModule = require('@react-native-firebase/auth').default;
  } catch {
    authModule = null;
  }
  return authModule;
}

function loadFirestore(): FirebaseFirestore | null {
  if (!isFirebaseNativeAvailable) return null;
  if (firestoreModule !== undefined) return firestoreModule;
  try {
    firestoreModule = require('@react-native-firebase/firestore').default;
  } catch {
    firestoreModule = null;
  }
  return firestoreModule;
}

function loadStorage(): FirebaseStorage | null {
  if (!isFirebaseNativeAvailable) return null;
  if (storageModule !== undefined) return storageModule;
  try {
    storageModule = require('@react-native-firebase/storage').default;
  } catch {
    storageModule = null;
  }
  return storageModule;
}

/** Firebase Auth — null in Expo Go */
export function getAuth(): FirebaseAuth | null {
  return loadAuth();
}

/** Firestore — null in Expo Go */
export function getFirestore(): FirebaseFirestore | null {
  return loadFirestore();
}

/** Storage — null in Expo Go */
export function getStorage(): FirebaseStorage | null {
  return loadStorage();
}
