import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/Avatar';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { resolveProfileStatsUserId } from '@/features/profile/lib/ownProfileStats';
import type {
  ProfileReviewItem,
  ProfileStatKey,
  ProfileStudentItem,
  ProfileTaughtItem,
} from '@/features/profile/types';
import { useAuth } from '@/providers/AuthProvider';
import { profileStatsService } from '@/services/profileStats.service';

interface ProfileStatDetailScreenProps {
  userId: string;
  statKey: Exclude<ProfileStatKey, 'rating'>;
}

export function ProfileStatDetailScreen({ userId, statKey }: ProfileStatDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const statsUserId = resolveProfileStatsUserId(userId, user?.uid);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [items, setItems] = useState<
    ProfileTaughtItem[] | ProfileStudentItem[] | ProfileReviewItem[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [name, data] = await Promise.all([
          profileStatsService.getDisplayName(statsUserId),
          statKey === 'taught'
            ? profileStatsService.getTaught(statsUserId)
            : statKey === 'students'
              ? profileStatsService.getStudents(statsUserId)
              : profileStatsService.getReviews(statsUserId),
        ]);

        if (!cancelled) {
          setDisplayName(name);
          setItems(data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [statsUserId, statKey]);

  const title = profileStatsService.titleForStat(statKey);
  const subtitle = displayName ? `${displayName}'s ${title.toLowerCase()}` : undefined;

  if (loading) {
    return <LoadingScreen message="Loading…" />;
  }

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
          <View className="flex-1">
            <Text className="text-[17px] font-semibold text-foreground">{title}</Text>
            {subtitle ? (
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {items.length === 0 ? (
        <CenteredMessage message={profileStatsService.emptyMessageForStat(statKey)} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => {
            if (statKey === 'taught') {
              return <TaughtRow item={item as ProfileTaughtItem} />;
            }
            if (statKey === 'students') {
              return <StudentRow item={item as ProfileStudentItem} />;
            }
            return <ReviewRow item={item as ProfileReviewItem} />;
          }}
        />
      )}
    </View>
  );
}

function TaughtRow({ item }: { item: ProfileTaughtItem }) {
  return (
    <View className="rounded-2xl border border-border bg-card p-4">
      <Text className="text-[11px] text-muted-foreground">
        {item.categoryEmoji} {item.category}
      </Text>
      <Text className="mt-1 text-base font-semibold text-foreground">{item.title}</Text>
      <Text className="mt-1 text-xs text-muted-foreground">{item.completedAtLabel}</Text>
      <View className="mt-3 flex-row items-center gap-4">
        <Text className="text-xs text-muted-foreground">
          {item.sessionCount} session{item.sessionCount === 1 ? '' : 's'}
        </Text>
        <View className="flex-row items-center gap-1">
          <Feather name="star" size={12} color={colors.accent} />
          <Text className="text-xs font-medium text-foreground">{item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  );
}

function StudentRow({ item }: { item: ProfileStudentItem }) {
  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <Avatar initials={item.initials} size="md" />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-foreground">{item.displayName}</Text>
        <Text className="mt-0.5 text-xs text-muted-foreground">
          {item.lessonsCompleted} lesson{item.lessonsCompleted === 1 ? '' : 's'} ·{' '}
          {item.lastLessonTitle}
        </Text>
        <Text className="mt-1 text-[11px] text-muted-foreground">{item.lastSeenLabel}</Text>
      </View>
    </View>
  );
}

function ReviewRow({ item }: { item: ProfileReviewItem }) {
  return (
    <View className="rounded-2xl border border-border bg-card p-4">
      <View className="flex-row items-start gap-3">
        <Avatar initials={item.authorInitials} size="md" />
        <View className="flex-1">
          <View className="flex-row items-center justify-between gap-2">
            <Text className="text-sm font-semibold text-foreground">{item.authorName}</Text>
            <View className="flex-row items-center gap-1">
              <Feather name="star" size={12} color={colors.accent} />
              <Text className="text-sm font-medium text-foreground">{item.rating}</Text>
            </View>
          </View>
          <Text className="mt-0.5 text-[11px] text-muted-foreground">
            {item.lessonTitle} · {item.createdAtLabel}
          </Text>
        </View>
      </View>
      <Text className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{item.body}</Text>
    </View>
  );
}
