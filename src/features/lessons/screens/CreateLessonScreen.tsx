import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { LimitedTextField } from '@/components/ui/LimitedTextField';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ScheduleDateTimeFields } from '@/components/ui/ScheduleDateTimeFields';
import { colors } from '@/constants/theme';
import {
  combineDateAndTime,
  defaultSessionDate,
  formatScheduledAtLabel,
} from '@/lib/lessonSchedule';
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

const MAX_LEARNER_OPTIONS = [1, 2, 4, 6, 8, 10] as const;
const DEFAULT_MAX_LEARNERS = 6;
const LESSON_TITLE_CHAR_LIMIT = 80;
const LESSON_DESCRIPTION_CHAR_LIMIT = 500;

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
  const defaultSchedule = defaultSessionDate();
  const [sessionDate, setSessionDate] = useState<Date | null>(null);
  const [sessionTime, setSessionTime] = useState(defaultSchedule);
  const [scheduleDateError, setScheduleDateError] = useState<string | null>(null);
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
    setSessionDate(null);
    setSessionTime(defaultSessionDate());
    setScheduleDateError(null);
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
    if (!sessionDate) {
      setScheduleDateError('Select a date for this session.');
      return;
    }
    setScheduleDateError(null);
    const scheduledAt = combineDateAndTime(sessionDate, sessionTime);
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
        scheduledAtLabel: formatScheduledAtLabel(scheduledAt),
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

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          nestedScrollEnabled
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

          <View className="mb-4">
            <LimitedTextField
              label="Lesson title"
              value={title}
              onChangeText={setTitle}
              maxLength={LESSON_TITLE_CHAR_LIMIT}
              placeholder="e.g. Intro to Python for Beginners"
            />
          </View>

          <View className="mb-4">
            <LimitedTextField
              label="Description"
              value={description}
              onChangeText={setDescription}
              maxLength={LESSON_DESCRIPTION_CHAR_LIMIT}
              placeholder="What will learners take away?"
              multiline
            />
          </View>

          <View className="mb-4">
            <Text className="mb-3 text-sm font-medium text-foreground">When</Text>
            <ScheduleDateTimeFields
              date={sessionDate}
              time={sessionTime}
              onDateChange={(next) => {
                setSessionDate(next);
                setScheduleDateError(null);
              }}
              onTimeChange={setSessionTime}
              dateError={
                scheduleDateError ?? (touched && !sessionDate ? 'Select a date' : undefined)
              }
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
            <View className="flex-row gap-2">
              {MAX_LEARNER_OPTIONS.map((count) => {
                const selected = maxLearners === count;
                return (
                  <Pressable
                    key={count}
                    onPress={() => setMaxLearners(count)}
                    className={`flex-1 rounded-xl border py-3 ${
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
      </KeyboardAvoidingView>
    </View>
  );
}
