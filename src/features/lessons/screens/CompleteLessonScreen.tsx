import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { FormTextField } from '@/components/ui/FormTextField';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { StarRatingPicker } from '@/components/ui/StarRatingPicker';
import { colors } from '@/constants/theme';
import { useLesson } from '@/features/lessons/hooks/useLesson';
import {
  canShareLessonCompletion,
  lessonCompletionUnlockLabel,
} from '@/lib/lessonSessions';
import { useAuth } from '@/providers/AuthProvider';
import { lessonCompletionsService } from '@/services/lessonCompletions.service';

const REVIEW_CHAR_LIMIT = 280;

interface CompleteLessonScreenProps {
  lessonId: string;
}

export function CompleteLessonScreen({ lessonId }: CompleteLessonScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { lesson, loading } = useLesson(lessonId);

  const [rating, setRating] = useState<number | undefined>();
  const [review, setReview] = useState('');
  const [alreadyPosted, setAlreadyPosted] = useState<boolean | null>(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void lessonCompletionsService.hasCompleted(lessonId, user?.uid).then(setAlreadyPosted);
  }, [lessonId, user?.uid]);

  const handlePost = async () => {
    setError(null);
    setPosting(true);
    try {
      await lessonCompletionsService.submit({
        lessonId,
        viewerUid: user?.uid,
        displayName: user?.displayName ?? 'Alex Kim',
        rating,
        reviewSnippet: review.trim() || undefined,
      });
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not post completion');
      setPosting(false);
    }
  };

  if (loading || alreadyPosted === null) {
    return <LoadingScreen message="Loading…" />;
  }

  if (!lesson) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-muted-foreground">Lesson not found</Text>
      </View>
    );
  }

  if (alreadyPosted) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base font-semibold text-foreground">
            You already posted this completion
          </Text>
          <Text className="mt-2 text-center text-sm text-muted-foreground">
            It should appear on your home feed.
          </Text>
          <Button title="Back to home" className="mt-6" onPress={() => router.replace('/(tabs)')} />
        </View>
      </View>
    );
  }

  const canShare = lesson ? canShareLessonCompletion(lesson) : false;
  const unlockLabel = lesson ? lessonCompletionUnlockLabel(lesson) : null;

  if (lesson && !canShare) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base font-semibold text-foreground">
            Lesson still in progress
          </Text>
          <Text className="mt-2 text-center text-sm text-muted-foreground">
            You can share your experience after the session ends
            {unlockLabel ? ` — ${unlockLabel}` : ''}.
          </Text>
          <Button title="Back to lesson" className="mt-6" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-foreground/5">
          <Feather name="x" size={18} color={colors.foreground} />
        </Pressable>
        <Text className="text-base font-semibold text-foreground">Complete lesson</Text>
        <View className="w-9" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text className="text-[22px] font-bold text-foreground">Share your experience</Text>
          <Text className="mt-2 text-sm leading-5 text-muted-foreground">
            {lesson.title} — optional rating and note. Friends will see this on the home feed when
            you post.
          </Text>

          <View className="mt-8 gap-2">
            <Text className="text-sm font-medium text-foreground">Rating</Text>
            <StarRatingPicker value={rating} onChange={setRating} />
          </View>

          <View className="mt-6 gap-2">
            <Text className="text-sm font-medium text-foreground">How did it go?</Text>
            <FormTextField
              variant="multiline"
              value={review}
              onChangeText={setReview}
              placeholder="Share what you learned (optional)"
              maxLength={REVIEW_CHAR_LIMIT}
              style={{ minHeight: 120 }}
            />
            {review.length > 0 ? (
              <Text className="text-right text-xs text-muted-foreground">
                {review.length}/{REVIEW_CHAR_LIMIT}
              </Text>
            ) : null}
          </View>

          {error ? <Text className="mt-4 text-sm text-destructive">{error}</Text> : null}
        </ScrollView>

        <View
          className="border-t border-border px-5 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          <Button title="Post to feed" fullWidth loading={posting} onPress={() => void handlePost()} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
