import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { UpcomingLessonRow } from '@/features/profile/components/UpcomingLessonRow';
import { OWN_PROFILE_STATS_USER_ID } from '@/features/profile/lib/ownProfileStats';
import type { UpcomingLessonItem, UpcomingLessonsBundle } from '@/features/profile/types';
import { useAuth } from '@/providers/AuthProvider';
import { upcomingLessonsService } from '@/services/upcomingLessons.service';

type UpcomingTab = 'teaching' | 'attending';

function pickInitialTab(bundle: UpcomingLessonsBundle): UpcomingTab {
  if (bundle.teaching.length > 0) return 'teaching';
  if (bundle.attending.length > 0) return 'attending';
  return 'teaching';
}

export function UpcomingLessonsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [bundle, setBundle] = useState<UpcomingLessonsBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<UpcomingTab>('teaching');

  useEffect(() => {
    let cancelled = false;

    void upcomingLessonsService
      .getForUser(OWN_PROFILE_STATS_USER_ID, user?.uid)
      .then((data) => {
        if (!cancelled) {
          setBundle(data);
          setActiveTab(pickInitialTab(data));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const tabOptions = useMemo(
    () => [
      { id: 'teaching' as const, label: 'Teaching', badge: bundle?.teaching.length },
      { id: 'attending' as const, label: 'Attending', badge: bundle?.attending.length },
    ],
    [bundle?.attending.length, bundle?.teaching.length]
  );

  const openLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  if (loading) {
    return <LoadingScreen message="Loading upcoming lessons…" />;
  }

  if (!bundle) {
    return <CenteredMessage message="Could not load your schedule." />;
  }

  const isEmpty = bundle.teaching.length === 0 && bundle.attending.length === 0;
  const activeItems: UpcomingLessonItem[] =
    activeTab === 'teaching' ? bundle.teaching : bundle.attending;

  const emptyTabMessage =
    activeTab === 'teaching'
      ? 'No lessons you\'re teaching scheduled.'
      : 'No lessons you\'ve joined yet.';

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
          <Text className="flex-1 text-[17px] font-semibold text-foreground">Upcoming lessons</Text>
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
                  <UpcomingLessonRow
                    key={item.id}
                    item={item}
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
