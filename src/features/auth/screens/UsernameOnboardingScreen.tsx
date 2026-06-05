import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { FormTextField } from '@/components/ui/FormTextField';
import { UsernameFormField } from '@/components/ui/UsernameFormField';
import { colors, screenStyle } from '@/constants/theme';
import {
  PROFILE_NAME_CHAR_LIMIT,
  PROFILE_NAME_MIN_LENGTH,
  PROFILE_USERNAME_CHAR_LIMIT,
  validateDisplayName,
} from '@/features/profile/lib/profileLimits';
import { charLimitOutlineStyle } from '@/features/profile/lib/profileFieldStyles';
import { isFirestoreAvailable } from '@/lib/firestore/client';
import {
  normalizeUsernameInput,
  validateUsernameForClaim,
} from '@/lib/username';
import { useAuth } from '@/providers/AuthProvider';
import { usernameService } from '@/services/username.service';

type Availability = 'idle' | 'available' | 'taken' | 'reserved' | 'invalid';

const fieldErrorOutline = {
  borderColor: colors.destructive,
} as const;

export function UsernameOnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile, completeUsernameOnboarding, authDevBypass, signOut } = useAuth();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState<Availability>('idle');
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [lastCheckedUsername, setLastCheckedUsername] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.displayName) {
      setDisplayName(profile.displayName);
    }
  }, [profile?.displayName]);

  const normalized = normalizeUsernameInput(username);

  const runAvailabilityCheck = useCallback(async (): Promise<boolean> => {
    if (!normalized) {
      setAvailability('idle');
      setUsernameError('Username is required.');
      return false;
    }

    const validationError = validateUsernameForClaim(username);
    if (validationError) {
      setAvailability('invalid');
      setUsernameError(validationError);
      return false;
    }

    const local = usernameService.checkAvailability(normalized, user?.uid);
    if (local !== 'available') {
      setAvailability(local);
      setUsernameError(
        local === 'reserved'
          ? 'That username is reserved.'
          : 'Use 3–30 characters: lowercase letters, numbers, and underscores only.'
      );
      return false;
    }

    setUsernameError(null);

    if (authDevBypass || !isFirestoreAvailable()) {
      setAvailability('available');
      return true;
    }

    setChecking(true);
    try {
      const taken = await usernameService.isUsernameTaken(normalized, user?.uid);
      if (taken) {
        setAvailability('taken');
        setUsernameError('That username is already taken.');
        return false;
      }
      setAvailability('available');
      return true;
    } catch {
      setAvailability('available');
      return true;
    } finally {
      setChecking(false);
    }
  }, [normalized, username, user?.uid, authDevBypass]);

  const handleUsernameBlur = () => {
    setUsernameChecked(true);
    if (normalized === lastCheckedUsername) {
      return;
    }
    void runAvailabilityCheck().then(() => {
      setLastCheckedUsername(normalized);
    });
  };

  const handleUsernameChange = (text: string) => {
    setUsername(normalizeUsernameInput(text));
    setUsernameError(null);
    setUsernameChecked(false);
    setAvailability('idle');
    setLastCheckedUsername(null);
  };

  const handleDisplayNameChange = (text: string) => {
    setDisplayName(text);
    setDisplayNameError(null);
  };

  const usernameHint = (() => {
    if (usernameError) return usernameError;
    if (!usernameChecked) {
      return `3–${PROFILE_USERNAME_CHAR_LIMIT} characters: lowercase letters, numbers, and underscores.`;
    }
    if (checking) return 'Checking availability…';
    if (availability === 'available') return `@${normalized} is available.`;
    if (username.length >= PROFILE_USERNAME_CHAR_LIMIT) {
      return `${PROFILE_USERNAME_CHAR_LIMIT} character limit reached.`;
    }
    return `3–${PROFILE_USERNAME_CHAR_LIMIT} characters: lowercase letters, numbers, and underscores.`;
  })();

  const displayNameHint = (() => {
    if (displayNameError) return displayNameError;
    if (displayName.length >= PROFILE_NAME_CHAR_LIMIT) {
      return `${PROFILE_NAME_CHAR_LIMIT} character limit reached.`;
    }
    return `${PROFILE_NAME_MIN_LENGTH}–${PROFILE_NAME_CHAR_LIMIT} characters.`;
  })();

  const usernameHintIsError =
    !!usernameError ||
    availability === 'taken' ||
    availability === 'reserved' ||
    (username.length >= PROFILE_USERNAME_CHAR_LIMIT &&
      !(usernameChecked && availability === 'available'));
  const usernameHintIsSuccess =
    usernameChecked && !checking && !usernameError && availability === 'available';

  const displayNameHintIsError =
    !!displayNameError || displayName.length >= PROFILE_NAME_CHAR_LIMIT;

  const handleContinue = async () => {
    let hasError = false;

    const trimmedName = displayName.trim();
    const nameError = validateDisplayName(displayName);
    if (nameError) {
      setDisplayNameError(nameError);
      hasError = true;
    }

    setUsernameChecked(true);
    const usernameOk =
      normalized === lastCheckedUsername && availability === 'available' && !usernameError
        ? true
        : await runAvailabilityCheck().then((ok) => {
            setLastCheckedUsername(normalized);
            return ok;
          });
    if (!usernameOk) {
      hasError = true;
    }

    if (hasError) return;

    setSubmitting(true);
    try {
      if (!authDevBypass && isFirestoreAvailable()) {
        const taken = await usernameService.isUsernameTaken(normalized, user?.uid);
        if (taken) {
          setUsernameError('That username is already taken.');
          setAvailability('taken');
          setUsernameChecked(true);
          return;
        }
      }

      await completeUsernameOnboarding({
        username: normalized,
        displayName: trimmedName,
      });
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert(
        'Could not save username',
        e instanceof Error ? e.message : 'Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToSignIn = () => {
    void signOut().then(() => {
      router.replace('/(auth)/sign-in');
    });
  };

  return (
    <Pressable
      style={[screenStyle, { paddingTop: insets.top }]}
      onPress={Keyboard.dismiss}
      accessible={false}>
      <View style={styles.main}>
        {authDevBypass ? (
          <View style={styles.topBar}>
            <Pressable
              onPress={handleBackToSignIn}
              accessibilityRole="button"
              accessibilityLabel="Back to sign in"
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}>
              <Feather name="arrow-left" size={18} color={colors.foreground} />
            </Pressable>
          </View>
        ) : null}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.appIcon}>
              <Feather name="zap" size={30} color="#fff" />
            </View>
            <Text style={styles.title}>Pick a username</Text>
            <Text style={styles.tagline}>
              Choose how others find you on Tribely.
            </Text>
          </View>

          <View style={styles.fields}>
            <View style={styles.fieldGroup}>
              <Text
                style={[styles.fieldLabel, usernameError && styles.fieldLabelError]}>
                Username
              </Text>
              <UsernameFormField
                value={username}
                onChangeText={handleUsernameChange}
                onBlur={handleUsernameBlur}
                placeholder="your_name"
                maxLength={PROFILE_USERNAME_CHAR_LIMIT}
                autoFocus
                containerStyle={[
                  charLimitOutlineStyle(username.length, PROFILE_USERNAME_CHAR_LIMIT),
                  usernameError ? fieldErrorOutline : undefined,
                ]}
              />
              <View style={styles.hintRow}>
                {checking ? (
                  <ActivityIndicator size="small" color={colors.mutedForeground} />
                ) : null}
                <Text
                  style={[
                    styles.hint,
                    usernameHintIsError && styles.hintError,
                    usernameHintIsSuccess && styles.hintSuccess,
                  ]}>
                  {usernameHint}
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text
                style={[styles.fieldLabel, displayNameError && styles.fieldLabelError]}>
                Name
              </Text>
              <FormTextField
                value={displayName}
                onChangeText={handleDisplayNameChange}
                placeholder="Display name"
                multiline={false}
                maxLength={PROFILE_NAME_CHAR_LIMIT}
                onBlur={() => {
                  const nameError = validateDisplayName(displayName);
                  if (nameError) {
                    setDisplayNameError(nameError);
                  }
                }}
                style={[
                  charLimitOutlineStyle(displayName.length, PROFILE_NAME_CHAR_LIMIT),
                  displayNameError ? fieldErrorOutline : undefined,
                ]}
              />
              <Text
                style={[
                  styles.hint,
                  displayNameHintIsError && styles.hintError,
                ]}>
                {displayNameHint}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 20) + 8 },
          ]}>
          <Button
            title="Continue"
            fullWidth
            loading={submitting}
            onPress={handleContinue}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 24,
    paddingBottom: 32,
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
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: Platform.select({ ios: 0.37, default: 0 }),
    color: colors.foreground,
    marginBottom: 12,
    textAlign: 'center',
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
  fields: {
    paddingHorizontal: 20,
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: Platform.select({ ios: -0.24, default: 0 }),
    color: colors.foreground,
  },
  fieldLabelError: {
    color: colors.destructive,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 18,
  },
  hint: {
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: Platform.select({ ios: -0.08, default: 0 }),
    color: colors.mutedForeground,
  },
  hintError: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.destructive,
  },
  hintSuccess: {
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: colors.background,
  },
});
