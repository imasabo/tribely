import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { OWN_PROFILE_STATS_USER_ID } from '@/features/profile/lib/ownProfileStats';
import type { UpcomingLessonsBundle } from '@/features/profile/types';
import { useAuth } from '@/providers/AuthProvider';
import { upcomingLessonsService } from '@/services/upcomingLessons.service';

export function ProfileUpcomingEntry() {
  const { user } = useAuth();
  const [bundle, setBundle] = useState<UpcomingLessonsBundle | null>(null);

  useEffect(() => {
    let cancelled = false;

    void upcomingLessonsService
      .getForUser(OWN_PROFILE_STATS_USER_ID, user?.uid)
      .then((data) => {
        if (!cancelled) setBundle(data);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  if (!bundle) return null;

  const total = bundle.teaching.length + bundle.attending.length;
  const summaryParts: string[] = [];

  if (bundle.teaching.length > 0) {
    summaryParts.push(
      `${bundle.teaching.length} teaching`
    );
  }
  if (bundle.attending.length > 0) {
    summaryParts.push(
      `${bundle.attending.length} attending`
    );
  }

  const summary =
    summaryParts.length > 0 ? summaryParts.join(' · ') : 'Nothing scheduled yet';

  return (
    <Pressable
      onPress={() => router.push('/upcoming-lessons')}
      accessibilityRole="button"
      accessibilityLabel="View upcoming lessons"
      className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5 active:opacity-90">
      <View className="flex-1 pr-3">
        <View className="flex-row items-center gap-2">
          <Feather name="calendar" size={16} color={colors.primary} />
          <Text className="text-[15px] font-semibold text-foreground">Upcoming lessons</Text>
        </View>
        <Text className="mt-1 text-xs text-muted-foreground">{summary}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {total > 0 ? (
          <View className="min-w-[22px] items-center justify-center rounded-full bg-primary px-2 py-0.5">
            <Text className="text-[11px] font-semibold text-white">{total}</Text>
          </View>
        ) : null}
        <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
      </View>
    </Pressable>
  );
}
