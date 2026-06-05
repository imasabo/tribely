import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { UsernameFormField } from '@/components/ui/UsernameFormField';
import { colors } from '@/constants/theme';
import { charLimitOutlineStyle } from '@/features/profile/lib/profileFieldStyles';
import {
  PROFILE_USERNAME_CHAR_LIMIT,
  validateDisplayName,
} from '@/features/profile/lib/profileLimits';
import { ProfileBioField } from '@/features/profile/components/ProfileBioField';
import { ProfileCityField } from '@/features/profile/components/ProfileCityField';
import { ProfileInterestsEditor } from '@/features/profile/components/ProfileInterestsEditor';
import { ProfileNameField } from '@/features/profile/components/ProfileNameField';
import { useOwnProfile } from '@/providers/OwnProfileProvider';
import {
  isValidUsername,
  normalizeUsernameInput,
  USERNAME_MIN_LENGTH,
} from '@/lib/username';

export function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useOwnProfile();

  const [username, setUsername] = useState(profile.username);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [city, setCity] = useState(profile.city);
  const [teachTopics, setTeachTopics] = useState(profile.teachTopics);
  const [learnTopics, setLearnTopics] = useState(profile.learnTopics);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUsername(profile.username);
    setDisplayName(profile.displayName);
    setBio(profile.bio);
    setCity(profile.city);
    setTeachTopics(profile.teachTopics);
    setLearnTopics(profile.learnTopics);
  }, [profile]);

  const usernameValid = isValidUsername(username);
  const displayNameError = validateDisplayName(displayName);
  const canSave = usernameValid && !displayNameError && !saving;

  const usernameHint = useMemo(() => {
    if (username.length === 0) return 'Username is required.';
    if (username.length < USERNAME_MIN_LENGTH) {
      return `At least ${USERNAME_MIN_LENGTH} characters (letters, numbers, underscores).`;
    }
    if (!usernameValid) return 'Use only lowercase letters, numbers, and underscores.';
    return null;
  }, [username.length, usernameValid]);

  const handleUsernameChange = (value: string) => {
    setUsername(normalizeUsernameInput(value));
  };

  const handleSave = async () => {
    const name = displayName.trim();
    if (!canSave || !name) return;

    setSaving(true);
    try {
      await updateProfile({
        username,
        displayName: name,
        bio: bio.trim(),
        city: city.trim(),
        teachTopics,
        learnTopics,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close edit profile"
          className="h-9 w-9 items-center justify-center rounded-full bg-foreground/5 active:opacity-80">
          <Feather name="x" size={18} color={colors.foreground} />
        </Pressable>
        <Text className="text-base font-semibold text-foreground">Edit Profile</Text>
        <View className="w-9" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}>
        <View className="mb-4 gap-1.5">
          <Text className="text-sm font-medium text-foreground">Username</Text>
          <UsernameFormField
            value={username}
            onChangeText={handleUsernameChange}
            maxLength={PROFILE_USERNAME_CHAR_LIMIT}
            containerStyle={charLimitOutlineStyle(
              username.length,
              PROFILE_USERNAME_CHAR_LIMIT
            )}
          />
          {usernameHint ? (
            <Text className="text-xs text-muted-foreground">{usernameHint}</Text>
          ) : null}
        </View>

        <View className="mb-4">
          <ProfileNameField
            value={displayName}
            onChangeText={setDisplayName}
            error={displayNameError}
          />
        </View>

        <View className="mb-4">
          <ProfileCityField value={city} onChange={setCity} />
        </View>

        <View className="mb-6">
          <ProfileBioField value={bio} onChangeText={setBio} />
        </View>

        <ProfileInterestsEditor
          teachTopics={teachTopics}
          learnTopics={learnTopics}
          onTeachTopicsChange={setTeachTopics}
          onLearnTopicsChange={setLearnTopics}
        />
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        className="border-t border-border bg-background px-5 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button
          title="Save"
          onPress={handleSave}
          loading={saving}
          fullWidth
          disabled={!canSave}
        />
      </View>
    </View>
  );
}
