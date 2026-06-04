import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/Avatar';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { colors } from '@/constants/theme';
import { ProfileRatingsOverview } from '@/features/profile/components/ProfileRatingsOverview';
import { PROFILE_REVIEW_TAB_OPTIONS } from '@/features/profile/lib/profileReviewLabels';
import { resolveProfileStatsUserId } from '@/features/profile/lib/ownProfileStats';
import {
  buildProfileReviewSummary,
  filterProfileReviews,
  emptyMessageForReviewFilter,
  type ProfileReviewFilter,
  type ProfileReviewSummary,
} from '@/features/profile/lib/profileReviewSummary';
import type {
  ProfileReviewItem,
  ProfileStatKey,
  ProfileStudentItem,
  ProfileTaughtItem,
} from '@/features/profile/types';
import { useAuth } from '@/providers/AuthProvider';
import { useFriendConnections } from '@/providers/FriendConnectionsProvider';
import { profileStatsService } from '@/services/profileStats.service';

export type ProfileReviewsScreenSource = 'rating' | 'reviews';

interface ProfileStatDetailScreenProps {
  userId: string;
  statKey: Exclude<ProfileStatKey, 'rating'>;
  initialReviewFilter?: ProfileReviewFilter;
  reviewsSource?: ProfileReviewsScreenSource;
}

export function ProfileStatDetailScreen({
  userId,
  statKey,
  initialReviewFilter = 'all',
  reviewsSource = 'reviews',
}: ProfileStatDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { friends } = useFriendConnections();
  const statsUserId = resolveProfileStatsUserId(userId, user?.uid);
  const friendUserIds = useMemo(() => new Set(friends.map((f) => f.userId)), [friends]);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [items, setItems] = useState<
    ProfileTaughtItem[] | ProfileStudentItem[] | ProfileReviewItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [reviewFilter, setReviewFilter] = useState<ProfileReviewFilter>(initialReviewFilter);

  useEffect(() => {
    setReviewFilter(initialReviewFilter);
  }, [initialReviewFilter]);

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

  const reviewItems = statKey === 'reviews' ? (items as ProfileReviewItem[]) : [];
  const reviewSummary = useMemo(
    (): ProfileReviewSummary => buildProfileReviewSummary(reviewItems),
    [reviewItems]
  );

  const filteredReviews = useMemo(
    () => filterProfileReviews(reviewItems, reviewFilter),
    [reviewItems, reviewFilter]
  );

  const reviewTabOptions = useMemo(
    () =>
      PROFILE_REVIEW_TAB_OPTIONS.map((option) => ({
        ...option,
        badge:
          option.id === 'all'
            ? reviewItems.length
            : reviewItems.filter((review) => review.context === option.id).length,
      })),
    [reviewItems]
  );

  const title =
    statKey === 'reviews' && reviewsSource === 'rating'
      ? 'Rating'
      : profileStatsService.titleForStat(statKey);

  const subtitle = displayName
    ? reviewsSource === 'rating' && statKey === 'reviews'
      ? `${displayName}'s overall lesson rating`
      : `${displayName}'s ${title.toLowerCase()}`
    : undefined;

  if (loading) {
    return <LoadingScreen message="Loading…" />;
  }

  const listData = statKey === 'reviews' ? filteredReviews : items;
  const emptyMessage =
    statKey === 'reviews'
      ? emptyMessageForReviewFilter(reviewFilter)
      : profileStatsService.emptyMessageForStat(statKey);
  const isReviewsScreen = statKey === 'reviews';
  const showReviewTabs = isReviewsScreen && reviewItems.length > 0;
  const headerCount = isReviewsScreen ? reviewItems.length : items.length;

  const listHeader = isReviewsScreen ? (
    <View>
      <ProfileRatingsOverview
        summary={reviewSummary}
        onSelectFilter={setReviewFilter}
      />
      {showReviewTabs ? (
        <SegmentedTabs
          options={reviewTabOptions}
          value={reviewFilter}
          onChange={setReviewFilter}
          className="mb-4"
        />
      ) : null}
    </View>
  ) : null;

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
              <Text className="text-xs text-muted-foreground" numberOfLines={2}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          <Text className="text-[15px] font-semibold text-muted-foreground">{headerCount}</Text>
        </View>
      </View>

      {isReviewsScreen ? (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            flexGrow: listData.length === 0 ? 1 : undefined,
          }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={<CenteredMessage message={emptyMessage} />}
          renderItem={({ item }) => <ReviewRow item={item} />}
        />
      ) : listData.length === 0 ? (
        <CenteredMessage message={emptyMessage} />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => {
            if (statKey === 'taught') {
              return (
                <TaughtRow
                  item={item as ProfileTaughtItem}
                  onPress={() =>
                    router.push({
                      pathname: '/taught-lesson/[lessonId]',
                      params: { lessonId: (item as ProfileTaughtItem).lessonId, userId: statsUserId },
                    })
                  }
                />
              );
            }
            const student = item as ProfileStudentItem;
            return (
              <StudentRow
                item={student}
                isFriend={
                  student.userId != null && friendUserIds.has(student.userId)
                }
              />
            );
          }}
        />
      )}
    </View>
  );
}

function TaughtRow({ item, onPress }: { item: ProfileTaughtItem; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${item.title}`}
      className="flex-row items-center rounded-2xl border border-border bg-card p-4 active:opacity-80">
      <View className="min-w-0 flex-1">
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
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

function StudentRow({ item, isFriend }: { item: ProfileStudentItem; isFriend: boolean }) {
  const canOpenProfile = item.userId != null;

  const content = (
    <>
      <Avatar initials={item.initials} size="md" />
      <View className="min-w-0 flex-1">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="text-sm font-semibold text-foreground">{item.displayName}</Text>
          {isFriend ? (
            <View className="flex-row items-center gap-1 rounded-full bg-secondary px-2 py-0.5">
              <Feather name="user-check" size={10} color={colors.primary} />
              <Text className="text-[10px] font-semibold text-primary">Friend</Text>
            </View>
          ) : null}
        </View>
        <Text className="mt-0.5 text-xs text-muted-foreground">
          {item.lessonsCompleted} lesson{item.lessonsCompleted === 1 ? '' : 's'} ·{' '}
          {item.lastLessonTitle}
        </Text>
        <Text className="mt-1 text-[11px] text-muted-foreground">{item.lastSeenLabel}</Text>
      </View>
      {canOpenProfile ? (
        <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
      ) : null}
    </>
  );

  if (!canOpenProfile) {
    return (
      <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => router.push(`/user/${item.userId}`)}
      accessibilityRole="button"
      accessibilityLabel={`View ${item.displayName}'s profile`}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4 active:opacity-80">
      {content}
    </Pressable>
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
