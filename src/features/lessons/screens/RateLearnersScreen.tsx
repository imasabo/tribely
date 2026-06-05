import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { LearnerRatingCard } from '@/features/lessons/components/LearnerRatingCard';
import { useLesson } from '@/features/lessons/hooks/useLesson';
import { hasEndedSession, lessonCompletionUnlockLabel } from '@/lib/lessonSessions';
import { useAuth } from '@/providers/AuthProvider';
import {
  learnerRatingsService,
  type LearnerToRate,
} from '@/services/learnerRatings.service';

interface RateLearnersScreenProps {
  lessonId: string;
}

export function RateLearnersScreen({ lessonId }: RateLearnersScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { lesson, loading: lessonLoading } = useLesson(lessonId);

  const [learners, setLearners] = useState<LearnerToRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const loadLearners = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!options?.silent) setLoading(true);
      try {
        const list = await learnerRatingsService.listLearnersToRate(lessonId, user?.uid);
        setLearners(list);
      } finally {
        if (!options?.silent) setLoading(false);
      }
    },
    [lessonId, user?.uid]
  );

  useFocusEffect(
    useCallback(() => {
      void loadLearners({ silent: learners.length > 0 });
    }, [loadLearners, learners.length])
  );

  const handleSubmit =
    (learner: LearnerToRate) => async (rating: number, reviewSnippet?: string) => {
      setSubmittingId(learner.learnerId);
      try {
        await learnerRatingsService.submit({
          lessonId,
          learnerId: learner.learnerId,
          learnerName: learner.learnerName,
          viewerUid: user?.uid,
          teacherDisplayName: user?.displayName ?? 'Alex Kim',
          rating,
          reviewSnippet,
        });
        await loadLearners({ silent: true });
      } finally {
        setSubmittingId(null);
      }
    };

  if (lessonLoading || loading) {
    return <LoadingScreen message="Loading learners…" />;
  }

  if (!lesson) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-muted-foreground">Lesson not found</Text>
      </View>
    );
  }

  const sessionEnded = hasEndedSession(lesson);
  const unlockLabel = lessonCompletionUnlockLabel(lesson);

  if (!sessionEnded) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base font-semibold text-foreground">
            Session still in progress
          </Text>
          <Text className="mt-2 text-center text-sm text-muted-foreground">
            You can rate learners after the lesson ends
            {unlockLabel ? ` — ${unlockLabel}` : ''}.
          </Text>
          <Pressable onPress={() => router.back()} className="mt-6 active:opacity-80">
            <Text className="text-sm font-semibold text-primary">Back to lesson</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const unratedCount = learners.filter((l) => l.existingRating == null).length;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-foreground/5">
          <Feather name="x" size={18} color={colors.foreground} />
        </Pressable>
        <Text className="text-base font-semibold text-foreground">Rate learners</Text>
        <View className="w-9" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        <Text className="text-[22px] font-bold text-foreground">How did your learners do?</Text>
        <Text className="mt-2 text-sm leading-5 text-muted-foreground">
          {lesson.title} — optional notes stay on their profile as teacher feedback (not on the
          home feed).
        </Text>
        {unratedCount > 0 ? (
          <Text className="mt-2 text-sm font-medium text-primary">
            {unratedCount} learner{unratedCount === 1 ? '' : 's'} left to rate
          </Text>
        ) : learners.length > 0 ? (
          <Text className="mt-2 text-sm font-medium text-muted-foreground">
            All learners rated for this lesson
          </Text>
        ) : null}

        {learners.length === 0 ? (
          <View className="mt-8">
            <CenteredMessage message="No accepted learners to rate for this lesson yet." />
          </View>
        ) : (
          <View className="mt-6 gap-3">
            {learners.map((learner) => (
              <LearnerRatingCard
                key={learner.learnerId}
                learner={learner}
                submitting={submittingId === learner.learnerId}
                onSubmit={handleSubmit(learner)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
