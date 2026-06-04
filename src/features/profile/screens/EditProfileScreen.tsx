import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { FormTextField } from '@/components/ui/FormTextField';
import { colors } from '@/constants/theme';
import { charLimitOutlineStyle } from '@/features/profile/lib/profileFieldStyles';
import {
  PROFILE_BIO_CHAR_LIMIT,
  PROFILE_NAME_CHAR_LIMIT,
  PROFILE_USERNAME_CHAR_LIMIT,
} from '@/features/profile/lib/profileLimits';
import { ProfileTopicsEditor } from '@/features/profile/components/ProfileTopicsEditor';
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
  const [teachTopics, setTeachTopics] = useState(profile.teachTopics);
  const [learnTopics, setLearnTopics] = useState(profile.learnTopics);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUsername(profile.username);
    setDisplayName(profile.displayName);
    setBio(profile.bio);
    setTeachTopics(profile.teachTopics);
    setLearnTopics(profile.learnTopics);
  }, [profile]);

  const usernameValid = isValidUsername(username);
  const canSave = usernameValid && displayName.trim().length > 0 && !saving;

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

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="mb-4 gap-1.5">
          <Text className="text-sm font-medium text-foreground">Username</Text>
          <View className="relative justify-center">
            <Text className="absolute left-4 z-10 text-base text-muted-foreground">@</Text>
            <FormTextField
              value={username}
              onChangeText={handleUsernameChange}
              placeholder="username"
              maxLength={PROFILE_USERNAME_CHAR_LIMIT}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                { paddingLeft: 28 },
                charLimitOutlineStyle(username.length, PROFILE_USERNAME_CHAR_LIMIT),
              ]}
            />
          </View>
          {usernameHint ? (
            <Text className="text-xs text-muted-foreground">{usernameHint}</Text>
          ) : null}
        </View>

        <View className="mb-4 gap-1.5">
          <Text className="text-sm font-medium text-foreground">Name</Text>
          <FormTextField
            variant="multiline"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            maxLength={PROFILE_NAME_CHAR_LIMIT}
            scrollEnabled={false}
            style={[
              { minHeight: 52, maxHeight: 80 },
              charLimitOutlineStyle(displayName.length, PROFILE_NAME_CHAR_LIMIT),
            ]}
          />
        </View>

        <View className="mb-6 gap-1.5">
          <Text className="text-sm font-medium text-foreground">Bio</Text>
          <FormTextField
            variant="multiline"
            value={bio}
            onChangeText={setBio}
            placeholder="A short intro"
            maxLength={PROFILE_BIO_CHAR_LIMIT}
            style={charLimitOutlineStyle(bio.length, PROFILE_BIO_CHAR_LIMIT)}
          />
        </View>

        <View className="gap-6">
          <ProfileTopicsEditor
            title="I Teach"
            topics={teachTopics}
            variant="teach"
            onChange={setTeachTopics}
          />
          <ProfileTopicsEditor
            title="I Want to Learn"
            topics={learnTopics}
            variant="learn"
            onChange={setLearnTopics}
          />
        </View>
      </ScrollView>

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
