/** App-level auth user (Firebase or dev fallback). */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}
