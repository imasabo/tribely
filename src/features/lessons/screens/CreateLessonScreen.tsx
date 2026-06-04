import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { DismissKeyboard } from '@/components/ui/DismissKeyboard';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { useLesson } from '@/features/lessons/hooks/useLesson';
import { isValidGoogleSlidesUrl, parseGoogleSlidesUrl } from '@/lib/googleSlides';
import { useAuth } from '@/providers/AuthProvider';
import { lessonsService } from '@/services/lessons.service';
import type { LessonDurationMinutes } from '@/types/domain';

const DURATION_OPTIONS: { label: string; minutes: LessonDurationMinutes }[] = [
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
  { label: '60 min', minutes: 60 },
];

const MAX_LEARNER_OPTIONS = [2, 4, 6, 8, 10, 12] as const;
const DEFAULT_MAX_LEARNERS = 6;

/** Phase 3: wire to useCreateLesson + Firestore */
export function CreateLessonScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { templateLessonId } = useLocalSearchParams<{ templateLessonId?: string }>();
  const resolvedTemplateId =
    typeof templateLessonId === 'string'
      ? templateLessonId
      : Array.isArray(templateLessonId)
        ? templateLessonId[0]
        : undefined;

  const { lesson: templateLesson, loading: templateLoading } = useLesson(resolvedTemplateId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<LessonDurationMinutes>(60);
  const [maxLearners, setMaxLearners] = useState<number>(DEFAULT_MAX_LEARNERS);
  const [slidesUrl, setSlidesUrl] = useState('');
  const [slidesError, setSlidesError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [templateApplied, setTemplateApplied] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!templateLesson || templateApplied) return;

    setTitle(templateLesson.title);
    setDescription(
      templateLesson.description ??
        'Same lesson as before — update anything that changed for this new session.'
    );
    setLocation(templateLesson.locationName);
    setDurationMinutes(templateLesson.durationMinutes);
    setSlidesUrl(templateLesson.googleSlidesUrl);
    setMaxLearners(templateLesson.maxLearners ?? DEFAULT_MAX_LEARNERS);
    setScheduledAt('');
    setTemplateApplied(true);
  }, [templateLesson, templateApplied]);

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

  const handlePublish = async () => {
    setTouched(true);
    if (!title.trim()) return;
    if (!scheduledAt.trim()) return;
    if (!validateSlides(slidesUrl)) return;

    const teacherId = user?.uid ?? 'dev-user-alex';
    const teacherName = user?.displayName ?? 'Alex Kim';

    setPublishing(true);
    try {
      const { lessonId } = await lessonsService.publish({
        teacherId,
        teacherName,
        title: title.trim(),
        description: description.trim(),
        locationName: location.trim(),
        durationMinutes,
        googleSlidesUrl: slidesUrl,
        scheduledAtLabel: scheduledAt.trim(),
        templateLessonId: resolvedTemplateId,
        category: templateLesson?.category,
        categoryEmoji: templateLesson?.categoryEmoji,
        slidePreviewColors: templateLesson?.slidePreviewColors,
        maxLearners,
      });

      router.replace(`/lesson/${lessonId}`);
    } catch {
      setPublishing(false);
    }
  };

  const showValid = touched && slidesUrl.length > 0 && isValidGoogleSlidesUrl(slidesUrl);
  const isDuplicate = Boolean(resolvedTemplateId);

  if (isDuplicate && templateLoading) {
    return <LoadingScreen message="Loading lesson template…" />;
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-foreground/5">
          <Feather name="x" size={18} color={colors.foreground} />
        </Pressable>
        <Text className="text-base font-semibold text-foreground">
          {isDuplicate ? 'New session' : 'Create Lesson'}
        </Text>
        <View className="w-9" />
      </View>

      <DismissKeyboard className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="never"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          {isDuplicate && templateLesson ? (
            <View className="mb-5 rounded-2xl border border-primary/30 bg-secondary px-4 py-3">
              <Text className="text-sm font-semibold text-primary">Scheduling another session</Text>
              <Text className="mt-1 text-xs leading-5 text-muted-foreground">
                Content is copied from “{templateLesson.title}”. Set a new date and time below.
              </Text>
            </View>
          ) : (
            <Text className="mb-6 text-[22px] font-bold text-foreground">Share what you know</Text>
          )}

          <View className="mb-4 gap-1.5">
            <Text className="text-sm font-medium text-foreground">Lesson title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Intro to Python for Beginners"
              placeholderTextColor={colors.mutedForeground}
              className="rounded-xl bg-muted px-4 py-3.5 text-base text-foreground"
            />
          </View>

          <View className="mb-4 gap-1.5">
            <Text className="text-sm font-medium text-foreground">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="What will learners take away?"
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={4}
              className="min-h-[100px] rounded-xl bg-muted px-4 py-3.5 text-base text-foreground"
              textAlignVertical="top"
            />
          </View>

          <View className="mb-4 gap-1.5">
            <Text className="text-sm font-medium text-foreground">When</Text>
            <TextInput
              value={scheduledAt}
              onChangeText={setScheduledAt}
              placeholder="e.g. Jun 15, 2026 · 2:30 PM"
              placeholderTextColor={colors.mutedForeground}
              className="rounded-xl bg-muted px-4 py-3.5 text-base text-foreground"
            />
          </View>

          <View className="mb-4 gap-1.5">
            <Text className="text-sm font-medium text-foreground">Location</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Where will you meet?"
              placeholderTextColor={colors.mutedForeground}
              className="rounded-xl bg-muted px-4 py-3.5 text-base text-foreground"
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

          <View className="mb-4 gap-2">
            <Text className="text-sm font-medium text-foreground">Max participants</Text>
            <Text className="text-xs text-muted-foreground">
              How many learners can join this session?
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {MAX_LEARNER_OPTIONS.map((count) => {
                const selected = maxLearners === count;
                return (
                  <Pressable
                    key={count}
                    onPress={() => setMaxLearners(count)}
                    className={`min-w-[52px] rounded-xl border px-4 py-3 ${
                      selected ? 'border-primary bg-secondary' : 'border-border bg-card'
                    }`}>
                    <Text
                      className={`text-center text-sm font-medium ${
                        selected ? 'text-primary' : 'text-foreground'
                      }`}>
                      {count}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="mb-4 flex-row gap-3">
            {DURATION_OPTIONS.map((option) => {
              const selected = durationMinutes === option.minutes;
              return (
                <Pressable
                  key={option.minutes}
                  onPress={() => setDurationMinutes(option.minutes)}
                  className={`flex-1 rounded-xl border py-3 ${
                    selected ? 'border-primary bg-secondary' : 'border-border bg-card'
                  }`}>
                  <Text
                    className={`text-center text-sm font-medium ${
                      selected ? 'text-primary' : 'text-foreground'
                    }`}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Button
            title={isDuplicate ? 'Publish new session' : 'Publish Lesson'}
            fullWidth
            loading={publishing}
            onPress={() => void handlePublish()}
          />
        </ScrollView>
      </DismissKeyboard>
    </View>
  );
}
