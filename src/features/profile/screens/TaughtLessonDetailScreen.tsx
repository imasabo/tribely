import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoogleSlidesCardPreview } from '@/components/lesson/GoogleSlidesCardPreview';
import { Button } from '@/components/ui/Button';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { useLesson } from '@/features/lessons/hooks/useLesson';
import { isLessonOwner } from '@/lib/lessonEnrollment';
import { sessionCountFor } from '@/lib/lessonSessions';
import { useAuth } from '@/providers/AuthProvider';
import { lessonChatService } from '@/services/lessonChat.service';
import { lessonJoinRequestsService } from '@/services/lessonJoinRequests.service';
import type { ProfileTaughtItem } from '@/features/profile/types';
import { profileStatsService } from '@/services/profileStats.service';

interface TaughtLessonDetailScreenProps {
  lessonId: string;
  profileUserId: string;
}

export function TaughtLessonDetailScreen({
  lessonId,
  profileUserId,
}: TaughtLessonDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { lesson, loading: lessonLoading, error: lessonError, refetch } = useLesson(lessonId);
  const [taughtMeta, setTaughtMeta] = useState<ProfileTaughtItem | null>(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [pendingJoinCount, setPendingJoinCount] = useState(0);
  const [canAccessChat, setCanAccessChat] = useState(false);

  const loadTaughtMeta = useCallback(() => {
    setMetaLoading(true);
    void Promise.all([
      profileStatsService.findTaughtByLessonId(profileUserId, lessonId),
      lessonJoinRequestsService.listPendingByLesson(lessonId),
      lessonChatService.canAccess(lessonId, user?.uid),
    ]).then(([item, pending, chatAllowed]) => {
      setTaughtMeta(item);
      setPendingJoinCount(pending.length);
      setCanAccessChat(chatAllowed);
      setMetaLoading(false);
    });
  }, [profileUserId, lessonId, user?.uid]);

  useEffect(() => {
    loadTaughtMeta();
  }, [loadTaughtMeta]);

  useFocusEffect(
    useCallback(() => {
      void refetch();
      loadTaughtMeta();
    }, [refetch, loadTaughtMeta])
  );

  const openCreateAnotherSession = () => {
    router.push({
      pathname: '/create',
      params: { templateLessonId: lessonId },
    });
  };

  if (lessonLoading || metaLoading) {
    return <LoadingScreen message="Loading lesson…" />;
  }

  if (lessonError || !lesson) {
    return (
      <View className="flex-1 bg-background">
        <CenteredMessage
          message={lessonError ?? 'Lesson not found'}
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const isOwner = isLessonOwner(lesson, user?.uid);

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center gap-3 border-b border-border px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-9 w-9 items-center justify-center rounded-full bg-muted active:opacity-80">
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text className="flex-1 text-[17px] font-semibold text-foreground" numberOfLines={1}>
          {lesson.title}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}>
        <View className="overflow-hidden rounded-2xl border border-border bg-card">
          <View className="h-40">
            <GoogleSlidesCardPreview
              variant="featured"
              colors={lesson.slidePreviewColors}
              className="h-full w-full"
            />
          </View>
          <View className="p-4">
            <Text className="text-[11px] text-muted-foreground">
              {lesson.categoryEmoji} {lesson.category}
            </Text>
            <Text className="mt-1 text-xl font-bold text-foreground">{lesson.title}</Text>
            <Text className="mt-2 text-sm text-muted-foreground">{lesson.locationName}</Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              {lesson.durationMinutes} min · {lesson.scheduledAtLabel}
            </Text>
            {taughtMeta ? (
              <View className="mt-4 flex-row flex-wrap gap-4">
                <View>
                  <Text className="text-[11px] text-muted-foreground">Sessions taught</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {sessionCountFor(lesson)}
                  </Text>
                </View>
                <View>
                  <Text className="text-[11px] text-muted-foreground">Avg. rating</Text>
                  <View className="flex-row items-center gap-1">
                    <Feather name="star" size={12} color={colors.accent} />
                    <Text className="text-sm font-semibold text-foreground">
                      {taughtMeta.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text className="text-[11px] text-muted-foreground">Last session</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {taughtMeta.completedAtLabel.replace(/^Last session · /, '')}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>

        {isOwner && pendingJoinCount > 0 ? (
          <View className="mt-4 rounded-2xl border border-primary/30 bg-secondary px-4 py-3">
            <Text className="text-sm font-semibold text-primary">
              {pendingJoinCount} pending join request{pendingJoinCount === 1 ? '' : 's'}
            </Text>
            <Text className="mt-1 text-xs leading-5 text-muted-foreground">
              Review and accept learners on the public lesson page.
            </Text>
          </View>
        ) : null}

        <View className="mt-6 gap-3">
          {canAccessChat ? (
            <Button
              title="Lesson chat"
              fullWidth
              onPress={() => router.push(`/lesson/${lessonId}/chat`)}
              icon={<Feather name="message-circle" size={16} color="#fff" />}
            />
          ) : null}
          {isOwner ? (
            <Button
              title="Schedule another session"
              fullWidth
              onPress={openCreateAnotherSession}
              icon={<Feather name="calendar" size={16} color="#fff" />}
            />
          ) : null}
          <Button
            title={
              pendingJoinCount > 0 && isOwner
                ? `Review join requests (${pendingJoinCount})`
                : 'View public lesson page'
            }
            variant="outline"
            fullWidth
            onPress={() => router.push(`/lesson/${lessonId}`)}
          />
        </View>

        {isOwner ? (
          <Text className="mt-4 text-center text-xs leading-5 text-muted-foreground">
            Reuse your slides, description, and lesson details — set a new date and time for the
            next session.
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
