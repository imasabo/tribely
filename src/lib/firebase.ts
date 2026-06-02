/**
 * Firebase native SDK entry point.
 *
 * Before running on device:
 * 1. Add GoogleService-Info.plist and google-services.json (gitignored)
 * 2. Enable Auth + Firestore + Storage in Firebase Console
 * 3. Use a dev client build: npx expo run:ios
 */
import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const firebaseApp = getApp();
export { auth, firestore, storage };
