import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { colors, screenStyle } from '@/constants/theme';
import { validateDisplayName } from '@/features/profile/lib/profileLimits';
import { ProfileBioField } from '@/features/profile/components/ProfileBioField';
import { ProfileCityField } from '@/features/profile/components/ProfileCityField';
import { ProfileInterestsEditor } from '@/features/profile/components/ProfileInterestsEditor';
import { ProfileNameField } from '@/features/profile/components/ProfileNameField';
import { useAuth } from '@/providers/AuthProvider';

export function ProfileSetupScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile, completeProfileSetup, authDevBypass, signOut } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [teachTopics, setTeachTopics] = useState<string[]>([]);
  const [learnTopics, setLearnTopics] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.displayName) {
      setDisplayName(profile.displayName);
    } else if (user?.displayName) {
      setDisplayName(user.displayName);
    }
    if (profile?.bio) setBio(profile.bio);
    if (profile?.city) setCity(profile.city);
    if (profile?.teachTopics?.length) setTeachTopics(profile.teachTopics);
    if (profile?.learnTopics?.length) setLearnTopics(profile.learnTopics);
  }, [profile, user?.displayName]);

  const handleContinue = async () => {
    const nameError = validateDisplayName(displayName);
    if (nameError) {
      setDisplayNameError(nameError);
      return;
    }

    setSubmitting(true);
    try {
      await completeProfileSetup({
        displayName: displayName.trim(),
        bio: bio.trim(),
        city: city.trim(),
        teachTopics,
        learnTopics,
      });
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert(
        'Could not save profile',
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
    <View style={[screenStyle, { paddingTop: insets.top }]}>
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
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={insets.top}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}>
            <View style={styles.hero}>
              <View style={styles.appIcon}>
                <Feather name="user" size={28} color="#fff" />
              </View>
              <Text style={styles.title}>Set up your profile</Text>
              <Text style={styles.tagline}>
                Add a few details so others know what you teach and want to learn.
              </Text>
            </View>

            <View style={styles.fields}>
              <ProfileNameField
                value={displayName}
                onChangeText={(text) => {
                  setDisplayName(text);
                  setDisplayNameError(null);
                }}
                error={displayNameError}
                autoFocus
                onBlur={() => {
                  const err = validateDisplayName(displayName);
                  if (err) setDisplayNameError(err);
                }}
              />

              <ProfileCityField value={city} onChange={setCity} />

              <ProfileBioField value={bio} onChangeText={setBio} />

              <ProfileInterestsEditor
                sectionTitle="Interests"
                teachTitle="I teach"
                learnTitle="I want to learn"
                teachTopics={teachTopics}
                learnTopics={learnTopics}
                onTeachTopicsChange={setTeachTopics}
                onLearnTopicsChange={setLearnTopics}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View
          style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) + 8 }]}>
          <Button
            title="Continue"
            fullWidth
            loading={submitting}
            onPress={handleContinue}
          />
        </View>
      </View>
    </View>
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
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    backgroundColor: colors.background,
    paddingBottom: 24,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 24,
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
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: Platform.select({ ios: 0.36, default: 0 }),
    color: colors.foreground,
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  fields: {
    paddingHorizontal: 20,
    gap: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(31, 41, 55, 0.08)',
    backgroundColor: colors.background,
  },
});
