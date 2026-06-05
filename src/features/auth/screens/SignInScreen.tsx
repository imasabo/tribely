import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { colors, screenStyle } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signInAsGuest, signInForUsernamePreview, isDevAuth, authDevBypass } =
    useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [previewingUsername, setPreviewingUsername] = useState(false);

  const handleGuestSignIn = async () => {
    setSubmitting(true);
    try {
      await signInAsGuest();
      router.replace('/');
    } catch (e) {
      Alert.alert(
        'Could not start dev session',
        e instanceof Error ? e.message : 'Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
      router.replace('/');
    } catch (e) {
      Alert.alert(
        'Sign in failed',
        e instanceof Error
          ? e.message
          : 'Use a development build (npx expo run:ios) with Google Sign-In configured.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUsernamePreview = async () => {
    setPreviewingUsername(true);
    try {
      await signInForUsernamePreview();
      router.replace('/');
    } catch (e) {
      Alert.alert(
        'Could not start preview',
        e instanceof Error ? e.message : 'Please try again.'
      );
    } finally {
      setPreviewingUsername(false);
    }
  };

  return (
    <View style={[screenStyle, { paddingTop: insets.top }]}>
      <View style={styles.main}>
        <View style={styles.hero}>
          <View style={styles.appIcon}>
            <Feather name="zap" size={30} color="#fff" />
          </View>

          <Text style={styles.appName}>Tribely</Text>
          <Text style={styles.tagline}>
            Sign in to discover lessons and connect with people near you.
          </Text>
        </View>

        <View style={styles.actions}>
          {authDevBypass ? (
            <>
              <Pressable
                onPress={handleGuestSignIn}
                disabled={submitting || previewingUsername}
                accessibilityRole="button"
                accessibilityLabel="Continue without signing in"
                style={({ pressed }) => [
                  styles.guestButton,
                  pressed && !submitting && styles.guestButtonPressed,
                  submitting && styles.googleButtonDisabled,
                ]}>
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.guestButtonLabel}>Continue without signing in</Text>
                )}
              </Pressable>
              <Pressable
                onPress={handleUsernamePreview}
                disabled={submitting || previewingUsername}
                accessibilityRole="button"
                accessibilityLabel="Preview username setup"
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.secondaryButtonPressed,
                ]}>
                {previewingUsername ? (
                  <ActivityIndicator size="small" color={colors.foreground} />
                ) : (
                  <Text style={styles.secondaryButtonLabel}>Preview username setup</Text>
                )}
              </Pressable>
              <Text style={styles.devNote}>
                Dev mode: mock data only, no network auth. Sign out in Settings to return
                here. Set EXPO_PUBLIC_USE_REAL_AUTH=true for real Google and Firestore.
              </Text>
            </>
          ) : (
            <Pressable
              onPress={handleGoogleSignIn}
              disabled={submitting}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              style={({ pressed }) => [
                styles.googleButton,
                pressed && !submitting && styles.googleButtonPressed,
                submitting && styles.googleButtonDisabled,
              ]}>
              <View style={styles.googleButtonContent}>
                {submitting ? (
                  <ActivityIndicator size="small" color={colors.foreground} />
                ) : (
                  <GoogleIcon />
                )}
                <Text style={styles.googleButtonLabel}>
                  {submitting ? 'Signing in…' : 'Continue with Google'}
                </Text>
              </View>
            </Pressable>
          )}

          {isDevAuth && !authDevBypass ? (
            <Text style={styles.devNote}>
              Development build required for Google Sign-In.
            </Text>
          ) : null}
        </View>
      </View>

      <View
        style={[
          styles.legalFooter,
          { paddingBottom: Math.max(insets.bottom, 20) + 8 },
        ]}>
        <Text style={styles.legal}>
          By continuing, you agree to the{' '}
          <Text style={styles.legalLink}>Terms of Service</Text>
          {' and '}
          <Text style={styles.legalLink}>Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 24,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  actions: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 52,
    gap: 16,
  },
  appIcon: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: Platform.select({ ios: 0.37, default: 0 }),
    color: colors.foreground,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: Platform.select({ ios: -0.41, default: 0 }),
    color: colors.mutedForeground,
    textAlign: 'center',
    maxWidth: 300,
  },
  legalFooter: {
    paddingHorizontal: 28,
  },
  googleButton: {
    width: '100%',
    height: 50,
    borderRadius: 13,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonPressed: {
    opacity: 0.85,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  googleButtonLabel: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: Platform.select({ ios: -0.41, default: 0 }),
    color: colors.foreground,
  },
  guestButton: {
    width: '100%',
    height: 50,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButtonPressed: {
    opacity: 0.9,
  },
  guestButtonLabel: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: Platform.select({ ios: -0.41, default: 0 }),
    color: '#fff',
  },
  secondaryButton: {
    width: '100%',
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonPressed: {
    opacity: 0.7,
  },
  secondaryButtonLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.primary,
  },
  devNote: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: Platform.select({ ios: -0.08, default: 0 }),
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  legal: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: Platform.select({ ios: -0.08, default: 0 }),
    color: colors.mutedForeground,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  legalLink: {
    color: colors.primary,
  },
});
