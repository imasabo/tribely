import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoogleSlidesEmbed } from '@/components/lesson/GoogleSlidesEmbed';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { LessonJoinRequestRow } from '@/features/lessons/components/LessonJoinRequestRow';
import { useLesson } from '@/features/lessons/hooks/useLesson';
import {
  canRequestToJoin,
  enrollmentLabel,
  isLessonFull,
  isLessonOwner,
} from '@/lib/lessonEnrollment';
import { formatLessonRating } from '@/lib/lessonRating';
import {
  canShareLessonCompletion,
  getUpcomingSessions,
  hasEndedSession,
  hasUpcomingSessions,
  lessonCompletionUnlockLabel,
  sessionCountFor,
} from '@/lib/lessonSessions';
import { useAuth } from '@/providers/AuthProvider';
import { lessonChatService } from '@/services/lessonChat.service';
import { lessonCompletionsService } from '@/services/lessonCompletions.service';
import { learnerRatingsService } from '@/services/learnerRatings.service';
import { lessonJoinRequestsService } from '@/services/lessonJoinRequests.service';
import type { LessonJoinRequest } from '@/types/lessonJoinRequest';

interface LessonDetailScreenProps {
  lessonId: string;
}

function SessionRow({ session }: { session: { id: string; scheduledAtLabel: string } }) {
  return (
    <View className="flex-row items-center gap-3 py-2">
      <View className="h-8 w-8 items-center justify-center rounded-full bg-secondary">
        <Feather name="calendar" size={14} color={colors.primary} />
      </View>
      <Text className="flex-1 text-sm font-medium text-foreground">{session.scheduledAtLabel}</Text>
    </View>
  );
}

export function LessonDetailScreen({ lessonId }: LessonDetailScreenProps) {
  const { user } = useAuth();
  const { lesson, loading, error, refetch } = useLesson(lessonId);
  const insets = useSafeAreaInsets();
  const [joinRequests, setJoinRequests] = useState<LessonJoinRequest[]>([]);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [canAccessChat, setCanAccessChat] = useState(false);
  const [hasPostedCompletion, setHasPostedCompletion] = useState(false);
  const [learnersToRateCount, setLearnersToRateCount] = useState(0);
  const [canRateLearners, setCanRateLearners] = useState(false);

  const loadJoinRequests = useCallback(async () => {
    if (!lessonId) return;
    const [pending, chatAllowed, completed, rateAllowed, unrated] = await Promise.all([
      lessonJoinRequestsService.listPendingByLesson(lessonId),
      lessonChatService.canAccess(lessonId, user?.uid),
      lessonCompletionsService.hasCompleted(lessonId, user?.uid),
      learnerRatingsService.canRateLearners(lessonId, user?.uid),
      learnerRatingsService.countUnratedLearners(lessonId, user?.uid),
    ]);
    setJoinRequests(pending);
    setCanAccessChat(chatAllowed);
    setHasPostedCompletion(completed);
    setCanRateLearners(rateAllowed);
    setLearnersToRateCount(unrated);

    if (user?.uid) {
      const mine = await lessonJoinRequestsService.hasPendingRequest(lessonId, user.uid);
      setHasPendingRequest(mine);
    } else {
      setHasPendingRequest(false);
    }
  }, [lessonId, user?.uid]);

  useFocusEffect(
    useCallback(() => {
      void refetch();
      void loadJoinRequests();
    }, [refetch, loadJoinRequests])
  );

  if (loading) {
    return <LoadingScreen message="Loading lesson…" />;
  }

  if (error || !lesson) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center text-muted-foreground">{error ?? 'Lesson not found'}</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-primary">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const sessions = lesson.sessions ?? [];
  const upcoming = getUpcomingSessions(sessions);
  const hasUpcoming = hasUpcomingSessions(lesson);
  const canShareCompletion = canShareLessonCompletion(lesson);
  const completionUnlockLabel = lessonCompletionUnlockLabel(lesson);
  const lessonFull = isLessonFull(lesson);
  const isOwner = isLessonOwner(lesson, user?.uid);
  const canJoin =
    !isOwner && canRequestToJoin(lesson) && !canAccessChat && !hasPendingRequest;
  const totalSessions = sessionCountFor(lesson);
  const enrollment = enrollmentLabel(lesson);
  const pendingCount = joinRequests.length;
  const hasSlides = Boolean(lesson.googleSlidesUrl?.trim());

  const openFullScreenSlides = () => {
    router.push(`/lesson/${lessonId}/slides`);
  };

  const openTeacherProfile = () => {
    if (isOwner) return;
    router.push(`/user/${lesson.teacherId}`);
  };

  const openLessonChat = () => {
    router.push(`/lesson/${lessonId}/chat`);
  };

  const openCompleteLesson = () => {
    router.push(`/lesson/${lessonId}/complete`);
  };

  const openRateLearners = () => {
    router.push(`/lesson/${lessonId}/rate-learners`);
  };

  const sessionEndedForHost = hasEndedSession(lesson);

  const handleRequestToJoin = async () => {
    if (!user?.uid || !user.displayName) return;
    setRequestSubmitting(true);
    try {
      await lessonJoinRequestsService.submitRequest({
        lessonId,
        requesterId: user.uid,
        requesterName: user.displayName,
      });
      setHasPendingRequest(true);
      await loadJoinRequests();
    } finally {
      setRequestSubmitting(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    await lessonJoinRequestsService.updateStatus(requestId, 'accepted');
    await refetch();
    await loadJoinRequests();
  };

  const handleDecline = async (requestId: string) => {
    await lessonJoinRequestsService.updateStatus(requestId, 'declined');
    await loadJoinRequests();
  };

  const footerPadding = insets.bottom + 16;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="relative h-72">
          <GoogleSlidesEmbed
            shareUrl={lesson.googleSlidesUrl}
            slidePreviewColors={lesson.slidePreviewColors}
            className="h-full"
            nestedInScrollView
          />

          <View
            className="absolute left-4 right-4 flex-row justify-between"
            style={{ top: insets.top + 8 }}
            pointerEvents="box-none">
            <Pressable
              onPress={() => router.back()}
              className="h-9 w-9 items-center justify-center rounded-full bg-black/40">
              <Feather name="arrow-left" size={18} color="#fff" />
            </Pressable>
            <View className="flex-row gap-2">
              <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-black/40">
                <Feather name="heart" size={16} color="#fff" />
              </Pressable>
              <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-black/40">
                <Feather name="share-2" size={16} color="#fff" />
              </Pressable>
            </View>
          </View>

          {hasSlides ? (
            <Pressable
              onPress={openFullScreenSlides}
              className="absolute bottom-3 right-3 flex-row items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 active:opacity-80">
              <Feather name="maximize-2" size={14} color="#fff" />
              <Text className="text-xs font-medium text-white">Full screen</Text>
            </Pressable>
          ) : null}
        </View>

        <View className="px-5 pt-5">
          <View className="mb-3 flex-row flex-wrap items-center gap-2">
            <View className="rounded-full bg-secondary px-2.5 py-1">
              <Text className="text-xs font-medium text-primary">
                {lesson.durationMinutes} min lesson
              </Text>
            </View>
            <View className="rounded-full bg-muted px-2.5 py-1">
              <Text className="text-xs font-medium text-muted-foreground">
                {totalSessions} session{totalSessions === 1 ? '' : 's'}
              </Text>
            </View>
            {isOwner ? (
              <View className="rounded-full bg-primary/10 px-2.5 py-1">
                <Text className="text-xs font-medium text-primary">Your lesson</Text>
              </View>
            ) : null}
          </View>

          <Text className="mb-4 text-[22px] font-bold leading-tight tracking-tight text-foreground">
            {lesson.title}
          </Text>

          {lesson.description ? (
            <Text className="mb-4 text-sm leading-6 text-muted-foreground">{lesson.description}</Text>
          ) : null}

          {!isOwner && !hasUpcoming ? (
            <View className="mb-4 rounded-2xl border border-border bg-muted/50 px-4 py-3">
              <Text className="text-sm font-semibold text-foreground">Reference only</Text>
              <Text className="mt-1 text-xs leading-5 text-muted-foreground">
                This lesson has been taught before, but there are no upcoming sessions. You can
                browse the slides and teacher profile — joining opens when a new session is
                scheduled.
              </Text>
            </View>
          ) : null}

          {!isOwner && hasUpcoming && lessonFull ? (
            <View className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3">
              <Text className="text-sm font-semibold text-foreground">Session full</Text>
              <Text className="mt-1 text-xs leading-5 text-muted-foreground">
                {enrollment ?? 'All spots are taken'}. You can still browse the slides — check back
                if a spot opens or the teacher adds another session.
              </Text>
            </View>
          ) : null}

          {!isOwner ? (
            <Pressable
              onPress={openTeacherProfile}
              accessibilityRole="link"
              accessibilityLabel={`View ${lesson.teacherName}'s profile`}
              className="mb-5 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3 active:opacity-90">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
                <Text className="font-semibold text-white">{lesson.teacherAvatar}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">{lesson.teacherName}</Text>
                <View className="flex-row items-center gap-1">
                  <Feather name="star" size={12} color={colors.accent} />
                  <Text className="text-sm text-muted-foreground">
                    {formatLessonRating(lesson.rating)} · {lesson.reviewCount} reviews
                  </Text>
                </View>
                <Text className="mt-0.5 text-xs text-muted-foreground">View profile</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          ) : null}

          <View className="mb-5 gap-3 rounded-2xl border border-border bg-card p-4">
            {upcoming.length > 0 ? (
              <>
                <Text className="text-sm font-semibold text-foreground">Upcoming sessions</Text>
                {upcoming.map((session) => (
                  <SessionRow key={session.id} session={session} />
                ))}
              </>
            ) : null}

            <View
              className={`flex-row items-center gap-3 ${upcoming.length > 0 ? 'border-t border-border pt-3' : ''}`}>
              <Feather name="map-pin" size={16} color={colors.primary} />
              <Text className="flex-1 text-sm text-foreground">{lesson.locationName}</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Feather name="navigation" size={16} color={colors.primary} />
              <Text className="text-sm text-foreground">{lesson.distanceLabel} away</Text>
            </View>
            {hasUpcoming && enrollment ? (
              <View className="flex-row items-center gap-3">
                <Feather name="users" size={16} color={colors.primary} />
                <Text
                  className={`text-sm ${lessonFull ? 'font-medium text-destructive' : 'text-foreground'}`}>
                  {enrollment}
                  {lessonFull ? ' · Full' : ''}
                </Text>
              </View>
            ) : null}
          </View>

          {isOwner && (hasUpcoming || pendingCount > 0) ? (
            <View className="mb-5 gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-[17px] font-semibold text-foreground">Join requests</Text>
                {pendingCount > 0 ? (
                  <View className="rounded-full bg-primary px-2.5 py-0.5">
                    <Text className="text-xs font-semibold text-primary-foreground">
                      {pendingCount}
                    </Text>
                  </View>
                ) : null}
              </View>
              {pendingCount === 0 ? (
                <Text className="text-sm text-muted-foreground">
                  No pending requests yet. Learners can request to join from this lesson page.
                </Text>
              ) : (
                joinRequests.map((request) => (
                  <LessonJoinRequestRow
                    key={request.id}
                    request={request}
                    actionsDisabled={lessonFull}
                    onAccept={() => void handleAccept(request.id)}
                    onDecline={() => void handleDecline(request.id)}
                  />
                ))
              )}
            </View>
          ) : null}

          <Text className="mb-2 text-[17px] font-semibold text-foreground">
            {isOwner ? 'Your slide deck' : 'Slide deck'}
          </Text>
          <Text className="mb-4 text-sm leading-5 text-muted-foreground">
            {hasSlides
              ? isOwner
                ? 'Preview what learners will see before they join. Tap above for full screen.'
                : 'Swipe through the teacher\'s Google Slides before requesting to join. Tap the preview above for full screen.'
              : isOwner
                ? 'No slides added yet. Add a Google Slides link when you create or edit this lesson.'
                : 'This lesson has no slides yet.'}
          </Text>

          {hasSlides ? (
            <Button
              title="Open slides full screen"
              variant="outline"
              fullWidth
              onPress={openFullScreenSlides}
            />
          ) : null}
        </View>
      </ScrollView>

      <View
        className="border-t border-border bg-background px-5 pt-4"
        style={{ paddingBottom: footerPadding }}>
        {isOwner ? (
          <>
            {canRateLearners && learnersToRateCount > 0 ? (
              <Button
                title={`Rate learners (${learnersToRateCount})`}
                fullWidth
                className="mb-3"
                onPress={openRateLearners}
                icon={<Feather name="star" size={16} color="#fff" />}
              />
            ) : canRateLearners && learnersToRateCount === 0 ? (
              <Text className="mb-3 text-center text-xs text-muted-foreground">
                All accepted learners have been rated.
              </Text>
            ) : !sessionEndedForHost ? (
              <Text className="mb-3 text-center text-xs text-muted-foreground">
                Rate learners after a session ends.
              </Text>
            ) : null}
            {canAccessChat ? (
              <Button
                title="Open lesson chat"
                fullWidth
                variant={canRateLearners ? 'outline' : 'primary'}
                className="mb-3"
                onPress={openLessonChat}
                icon={<Feather name="message-circle" size={16} color={colors.primary} />}
              />
            ) : null}
            <Text className="mb-2 text-center text-sm font-medium text-foreground">
              You&apos;re hosting this lesson
            </Text>
            {hasUpcoming && enrollment ? (
              <Text className="mb-3 text-center text-xs text-muted-foreground">
                {enrollment}
                {pendingCount > 0
                  ? ` · ${pendingCount} pending request${pendingCount === 1 ? '' : 's'}`
                  : ''}
              </Text>
            ) : (
              <Text className="mb-3 text-center text-xs text-muted-foreground">
                No upcoming sessions scheduled.
              </Text>
            )}
          </>
        ) : canAccessChat ? (
          <>
            {!hasPostedCompletion && canShareCompletion ? (
              <Button
                title="Share your experience"
                fullWidth
                onPress={openCompleteLesson}
                icon={<Feather name="check-circle" size={16} color="#fff" />}
              />
            ) : !hasPostedCompletion && !canShareCompletion ? (
              <Text className="mb-3 text-center text-xs text-muted-foreground">
                Share your experience after the lesson ends
                {completionUnlockLabel ? ` (${completionUnlockLabel})` : ''}.
              </Text>
            ) : hasPostedCompletion ? (
              <Text className="mb-3 text-center text-xs text-muted-foreground">
                Your completion is on the home feed.
              </Text>
            ) : null}
            <Button
              title="Open lesson chat"
              fullWidth
              variant={hasPostedCompletion ? 'primary' : 'outline'}
              className={hasPostedCompletion ? undefined : 'mt-3'}
              onPress={openLessonChat}
              icon={
                <Feather
                  name="message-circle"
                  size={16}
                  color={hasPostedCompletion ? '#fff' : colors.primary}
                />
              }
            />
          </>
        ) : hasPendingRequest ? (
          <>
            <Button title="Request pending" fullWidth disabled />
            <Text className="mt-2 text-center text-xs text-muted-foreground">
              The teacher will review your request.
            </Text>
          </>
        ) : canJoin ? (
          <Button
            title="Request to Join"
            fullWidth
            loading={requestSubmitting}
            onPress={() => void handleRequestToJoin()}
          />
        ) : lessonFull ? (
          <>
            <Button title="Lesson full" fullWidth disabled />
            <Text className="mt-2 text-center text-xs text-muted-foreground">
              {enrollment}. Joining is closed for this session.
            </Text>
          </>
        ) : (
          <>
            <Button title="No upcoming sessions" fullWidth disabled />
            <Text className="mt-2 text-center text-xs text-muted-foreground">
              Check back when the teacher schedules another session.
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
