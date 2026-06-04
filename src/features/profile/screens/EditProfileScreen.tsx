import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/theme';
import { ProfileTopicsEditor } from '@/features/profile/components/ProfileTopicsEditor';
import { useOwnProfile } from '@/providers/OwnProfileProvider';

export function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useOwnProfile();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [teachTopics, setTeachTopics] = useState(profile.teachTopics);
  const [learnTopics, setLearnTopics] = useState(profile.learnTopics);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(profile.displayName);
    setBio(profile.bio);
    setTeachTopics(profile.teachTopics);
    setLearnTopics(profile.learnTopics);
  }, [profile]);

  const handleSave = async () => {
    const name = displayName.trim();
    if (!name) return;

    setSaving(true);
    try {
      await updateProfile({
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
          <Text className="text-sm font-medium text-foreground">Name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            placeholderTextColor={colors.mutedForeground}
            className="rounded-xl bg-muted px-4 py-3.5 text-base text-foreground"
          />
        </View>

        <View className="mb-6 gap-1.5">
          <Text className="text-sm font-medium text-foreground">Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="A short intro"
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-[100px] rounded-xl bg-muted px-4 py-3.5 text-base text-foreground"
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
          disabled={!displayName.trim() || saving}
        />
      </View>
    </View>
  );
}
