/**
 * Auth / username dev toggles (read from .env). Restart Metro after changing .env.
 *
 * EXPO_PUBLIC_USE_REAL_AUTH=true  → Google Sign-In + Firestore username checks (dev build)
 * EXPO_PUBLIC_USE_REAL_AUTH=false → Preview sign-in + local-only username checks
 *
 * Production builds always use real auth regardless of this flag.
 */
export function isRealAuthEnabled(): boolean {
  if (!__DEV__) return true;

  const raw = process.env.EXPO_PUBLIC_USE_REAL_AUTH?.trim().toLowerCase();
  if (!raw) return false;
  return raw === 'true' || raw === '1' || raw === 'yes';
}

/** True when dev bypass is active (preview user, no Google / no Firestore username reads). */
export function isAuthDevBypassEnabled(): boolean {
  return __DEV__ && !isRealAuthEnabled();
}
