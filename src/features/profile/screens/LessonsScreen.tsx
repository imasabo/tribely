import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { UserLessonRow } from '@/features/profile/components/UserLessonRow';
import { OWN_PROFILE_STATS_USER_ID } from '@/features/profile/lib/ownProfileStats';
import type { UserLessonItem, UserLessonsBundle } from '@/features/profile/types';
import { useAuth } from '@/providers/AuthProvider';
import { userLessonsService } from '@/services/userLessons.service';

type LessonsTab = 'teaching' | 'attending' | 'completed';

function pickInitialTab(bundle: UserLessonsBundle): LessonsTab {
  if (bundle.teaching.length > 0) return 'teaching';
  if (bundle.attending.length > 0) return 'attending';
  if (bundle.completed.length > 0) return 'completed';
  return 'teaching';
}

export function LessonsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [bundle, setBundle] = useState<UserLessonsBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<LessonsTab>('teaching');
  const hasLoadedRef = useRef(false);

  const loadBundle = useCallback(
    (options?: { silent?: boolean }) => {
      if (!options?.silent) setLoading(true);
      return userLessonsService
        .getForUser(OWN_PROFILE_STATS_USER_ID, user?.uid)
        .then((data) => {
          setBundle(data);
          setActiveTab((prev) => {
            const items =
              prev === 'teaching'
                ? data.teaching
                : prev === 'attending'
                  ? data.attending
                  : data.completed;
            if (items.length > 0) return prev;
            return pickInitialTab(data);
          });
        })
        .finally(() => {
          if (!options?.silent) setLoading(false);
        });
    },
    [user?.uid]
  );

  useFocusEffect(
    useCallback(() => {
      void loadBundle({ silent: hasLoadedRef.current });
      hasLoadedRef.current = true;
    }, [loadBundle])
  );

  const tabOptions = useMemo(
    () => [
      { id: 'teaching' as const, label: 'Teaching', badge: bundle?.teaching.length },
      { id: 'attending' as const, label: 'Attending', badge: bundle?.attending.length },
      { id: 'completed' as const, label: 'Completed', badge: bundle?.completed.length },
    ],
    [bundle?.attending.length, bundle?.completed.length, bundle?.teaching.length]
  );

  const openLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  if (loading) {
    return <LoadingScreen message="Loading lessons…" />;
  }

  if (!bundle) {
    return <CenteredMessage message="Could not load your lessons." />;
  }

  const isEmpty =
    bundle.teaching.length === 0 &&
    bundle.attending.length === 0 &&
    bundle.completed.length === 0;

  const activeItems: UserLessonItem[] =
    activeTab === 'teaching'
      ? bundle.teaching
      : activeTab === 'attending'
        ? bundle.attending
        : bundle.completed;

  const emptyTabMessage =
    activeTab === 'teaching'
      ? 'No upcoming lessons you\'re teaching.'
      : activeTab === 'attending'
        ? 'No upcoming lessons you\'ve joined.'
        : 'No completed lessons yet.';

  return (
    <View className="flex-1 bg-background">
      <View
        className="border-b border-border px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-9 w-9 items-center justify-center rounded-full bg-muted active:opacity-80">
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </Pressable>
          <Text className="flex-1 text-[17px] font-semibold text-foreground">Lessons</Text>
        </View>
      </View>

      {isEmpty ? (
        <CenteredMessage message="Nothing on your schedule yet. Discover a lesson or create one to teach." />
      ) : (
        <>
          <View className="px-5 pt-4">
            <SegmentedTabs options={tabOptions} value={activeTab} onChange={setActiveTab} />
          </View>

          {activeItems.length === 0 ? (
            <CenteredMessage message={emptyTabMessage} />
          ) : (
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}>
              <View className="gap-3">
                {activeItems.map((item) => (
                  <UserLessonRow
                    key={item.id}
                    item={item}
                    showRoleBadge={activeTab === 'completed'}
                    onPress={() => openLesson(item.lessonId)}
                  />
                ))}
              </View>
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}
