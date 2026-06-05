import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

import { GOOGLE_WEB_CLIENT_ID } from '@/constants/googleAuth';
import { getAuth, isFirebaseNativeAvailable } from '@/lib/firebase';

let configured = false;

export function configureGoogleSignIn(): void {
  if (!isFirebaseNativeAvailable || configured) return;

  if (!GOOGLE_WEB_CLIENT_ID) {
    console.warn(
      '[Tribely] Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to your Firebase Web OAuth client ID for Google Sign-In.'
    );
  }

  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
  });
  configured = true;
}

export async function signInWithGoogleCredential(): Promise<void> {
  const auth = getAuth();
  if (!auth) {
    throw new Error('Firebase Auth is not available. Use a development build (npx expo run:ios).');
  }

  if (!GOOGLE_WEB_CLIENT_ID) {
    throw new Error(
      'Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID. Add your Firebase Web OAuth client ID to .env.'
    );
  }

  configureGoogleSignIn();

  if (Platform.OS === 'android') {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  const response = await GoogleSignin.signIn();
  if (response.type === 'cancelled') {
    throw new Error('Sign in was cancelled.');
  }

  const idToken =
    response.data.idToken ?? (await GoogleSignin.getTokens()).idToken;
  if (!idToken) {
    throw new Error('Google Sign-In did not return an ID token.');
  }

  const credential = auth.GoogleAuthProvider.credential(idToken);
  await auth().signInWithCredential(credential);
}

export async function signOutGoogle(): Promise<void> {
  try {
    configureGoogleSignIn();
    await GoogleSignin.signOut();
  } catch {
    // Ignore when no Google session exists
  }
}
