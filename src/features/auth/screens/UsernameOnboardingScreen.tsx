import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { FormTextField } from '@/components/ui/FormTextField';
import { UsernameFormField } from '@/components/ui/UsernameFormField';
import { colors, screenStyle } from '@/constants/theme';
import { isFirestoreAvailable } from '@/lib/firestore/client';
import {
  normalizeUsernameInput,
  USERNAME_MAX_LENGTH,
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
  const { user, profile, completeUsernameOnboarding, isDevAuth } = useAuth();
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

    if (isDevAuth || !isFirestoreAvailable()) {
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
  }, [normalized, username, user?.uid, isDevAuth]);

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
      return 'Lowercase letters, numbers, and underscores.';
    }
    if (checking) return 'Checking availability…';
    if (availability === 'available') return `@${normalized} is available.`;
    return 'Lowercase letters, numbers, and underscores.';
  })();

  const usernameHintIsError = !!usernameError;
  const usernameHintIsSuccess =
    usernameChecked && !checking && !usernameError && availability === 'available';

  const handleContinue = async () => {
    let hasError = false;

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      setDisplayNameError('Name is required.');
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
      if (!isDevAuth && isFirestoreAvailable()) {
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

  return (
    <View style={[screenStyle, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <View style={styles.flex}>
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
                maxLength={USERNAME_MAX_LENGTH}
                autoFocus
                containerStyle={usernameError ? fieldErrorOutline : undefined}
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
                onBlur={() => {
                  if (!displayName.trim()) {
                    setDisplayNameError('Name is required.');
                  }
                }}
                style={displayNameError ? fieldErrorOutline : undefined}
              />
              {displayNameError ? (
                <Text style={styles.hintError}>{displayNameError}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.spacer} />

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
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
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
  spacer: {
    flex: 1,
    minHeight: 16,
  },
  footer: {
    paddingHorizontal: 20,
  },
});
