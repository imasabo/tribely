import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { DismissKeyboard } from '@/components/ui/DismissKeyboard';
import { colors } from '@/constants/theme';
import { isValidGoogleSlidesUrl, parseGoogleSlidesUrl } from '@/lib/googleSlides';

/** Phase 3: wire to useCreateLesson + Firestore */
export function CreateLessonScreen() {
  const insets = useSafeAreaInsets();
  const [slidesUrl, setSlidesUrl] = useState('');
  const [slidesError, setSlidesError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validateSlides = (url: string) => {
    const result = parseGoogleSlidesUrl(url);
    if (!result.ok) {
      setSlidesError(result.error);
      return false;
    }
    setSlidesError(null);
    return true;
  };

  const handleSlidesChange = (text: string) => {
    setSlidesUrl(text);
    if (touched) validateSlides(text);
  };

  const handlePublish = () => {
    setTouched(true);
    if (!validateSlides(slidesUrl)) return;
    router.replace('/(tabs)');
  };

  const showValid = touched && slidesUrl.length > 0 && isValidGoogleSlidesUrl(slidesUrl);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-foreground/5">
          <Feather name="x" size={18} color={colors.foreground} />
        </Pressable>
        <Text className="text-base font-semibold text-foreground">Create Lesson</Text>
        <View className="w-9" />
      </View>

      <DismissKeyboard className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="never"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
        <Text className="mb-6 text-[22px] font-bold text-foreground">Share what you know</Text>

        <View className="mb-4 gap-1.5">
          <Text className="text-sm font-medium text-foreground">Lesson title</Text>
          <TextInput
            placeholder="e.g. Intro to Python for Beginners"
            placeholderTextColor={colors.mutedForeground}
            className="rounded-xl bg-muted px-4 py-3.5 text-base text-foreground"
          />
        </View>

        <View className="mb-4 gap-1.5">
          <Text className="text-sm font-medium text-foreground">Description</Text>
          <TextInput
            placeholder="What will learners take away?"
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            className="min-h-[100px] rounded-xl bg-muted px-4 py-3.5 text-base text-foreground"
            textAlignVertical="top"
          />
        </View>

        <View className="mb-6 gap-2">
          <Text className="text-sm font-medium text-foreground">Google Slides link</Text>
          <Text className="text-xs leading-5 text-muted-foreground">
            Paste the share link from Google Slides (File → Share → Anyone with the link). Only
            Google Slides are supported — no PowerPoint uploads.
          </Text>
          <View
            className={`flex-row items-start gap-3 rounded-2xl border bg-card p-4 ${
              slidesError ? 'border-destructive' : showValid ? 'border-primary' : 'border-border'
            }`}>
            <View className="mt-0.5 h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Feather name="layout" size={20} color="#fff" />
            </View>
            <View className="flex-1 gap-2">
              <TextInput
                value={slidesUrl}
                onChangeText={handleSlidesChange}
                onBlur={() => {
                  setTouched(true);
                  validateSlides(slidesUrl);
                }}
                placeholder="https://docs.google.com/presentation/d/…/edit"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                className="text-base text-foreground"
              />
              {slidesError ? (
                <Text className="text-xs text-destructive">{slidesError}</Text>
              ) : showValid ? (
                <View className="flex-row items-center gap-1">
                  <Feather name="check-circle" size={14} color={colors.primary} />
                  <Text className="text-xs text-primary">Valid Google Slides link</Text>
                </View>
              ) : (
                <Text className="text-xs text-muted-foreground">Required</Text>
              )}
            </View>
          </View>
        </View>

        <View className="mb-4 flex-row gap-3">
          {(['30 min', '45 min', '60 min'] as const).map((d, i) => (
            <Pressable
              key={d}
              className={`flex-1 rounded-xl border py-3 ${i === 2 ? 'border-primary bg-secondary' : 'border-border bg-card'}`}>
              <Text
                className={`text-center text-sm font-medium ${i === 2 ? 'text-primary' : 'text-foreground'}`}>
                {d}
              </Text>
            </Pressable>
          ))}
        </View>

        <Button title="Publish Lesson" fullWidth onPress={handlePublish} />
        </ScrollView>
      </DismissKeyboard>
    </View>
  );
}
