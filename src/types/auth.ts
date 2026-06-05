/** Firebase Auth session (identity only). Profile lives in UserProfile. */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}
