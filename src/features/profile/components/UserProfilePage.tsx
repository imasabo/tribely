import { router } from 'expo-router';
import { type ReactNode } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

import { ProfileCover } from '@/features/profile/components/ProfileCover';
import { ProfileCoverHeaderOverlay } from '@/features/profile/components/ProfileCoverHeaderOverlay';
import { ProfileFriendConnection } from '@/features/profile/components/ProfileFriendConnection';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfileIdentity } from '@/features/profile/components/ProfileIdentity';
import { ProfileUpcomingEntry } from '@/features/profile/components/ProfileUpcomingEntry';
import { ProfileRecentActivity } from '@/features/profile/components/ProfileRecentActivity';
import { ProfileStatsRow } from '@/features/profile/components/ProfileStatsRow';
import { ProfileTopicsSection } from '@/features/profile/components/ProfileTopicsSection';
import { getProfileScrollTopInset } from '@/features/profile/lib/profileCoverMetrics';
import { getProfileStatHref } from '@/features/profile/lib/profileStatNavigation';
import type {
  ProfileActivityItem,
  ProfileStatKey,
  ProfileViewModel,
} from '@/features/profile/types';
import { getInitials } from '@/lib/userDisplay';
import type { FriendConnectionStatus } from '@/types/social';

const TAB_BAR_SCROLL_PADDING = 100;

export interface ProfileFriendConnectionConfig {
  status: FriendConnectionStatus;
  requesting: boolean;
  onSendFriendRequest: () => void;
}

export interface UserProfilePageProps {
  profile: ProfileViewModel;
  /** User id for stat detail routes (own profile + public profiles). */
  profileUserId: string;
  /** Override initials; defaults to profile display name. */
  initials?: string;
  headerStart?: ReactNode;
  headerEnd?: ReactNode;
  avatarAccessory?: ReactNode;
  showEditBadge?: boolean;
  friendConnection?: ProfileFriendConnectionConfig;
  teachSectionTitle?: string;
  learnSectionTitle?: string;
  /** Own profile: tap avatar badge to edit. */
  onEditPress?: () => void;
  hideEmptyTopicSections?: boolean;
  recentActivity?: ProfileActivityItem[];
  /** Own profile: upcoming lessons entry card. */
  showUpcomingLessons?: boolean;
  /** Extra sections below topics (own profile only, etc.) */
  children?: ReactNode;
}

export function UserProfilePage({
  profile,
  profileUserId,
  initials: initialsOverride,
  headerStart,
  headerEnd,
  avatarAccessory,
  showEditBadge = false,
  friendConnection,
  teachSectionTitle = 'Teaches',
  learnSectionTitle = 'Wants to learn',
  onEditPress,
  hideEmptyTopicSections = true,
  recentActivity,
  showUpcomingLessons = false,
  children,
}: UserProfilePageProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const scrollTopInset = getProfileScrollTopInset(insets.top);

  const initials = initialsOverride ?? getInitials(profile.displayName);
  const showTeach = profile.teachTopics.length > 0 || !hideEmptyTopicSections;
  const showLearn =
    profile.learnTopics.length > 0 || !hideEmptyTopicSections;

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleStatPress = (statKey: ProfileStatKey) => {
    const href = getProfileStatHref(profileUserId, statKey);
    if (href) router.push(href);
  };

  return (
    <View className="flex-1 bg-background">
      <ProfileCover scrollY={scrollY} />
      <ProfileCoverHeaderOverlay headerStart={headerStart} headerEnd={headerEnd} />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces
        alwaysBounceVertical
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            minHeight: windowHeight,
            paddingBottom: TAB_BAR_SCROLL_PADDING,
          },
        ]}>
        <View style={{ height: scrollTopInset }} />

        <View className="flex-1 bg-background">
          <ProfileHeader
            initials={initials}
            avatarAccessory={avatarAccessory}
            showEditBadge={showEditBadge}
            onEditPress={onEditPress}>
            <ProfileIdentity
              displayName={profile.displayName}
              username={profile.username}
              metaLine={profile.metaLine}
              bio={profile.bio}
              action={
                friendConnection ? (
                  <ProfileFriendConnection
                    status={friendConnection.status}
                    requesting={friendConnection.requesting}
                    onSendFriendRequest={friendConnection.onSendFriendRequest}
                  />
                ) : undefined
              }
            />
            <ProfileStatsRow
              stats={profile.stats}
              className="mt-4"
              onStatPress={handleStatPress}
            />
          </ProfileHeader>

          <View className="gap-5 px-5 pb-8">
            {showUpcomingLessons ? <ProfileUpcomingEntry /> : null}
            {showTeach ? (
              <ProfileTopicsSection
                title={teachSectionTitle}
                topics={profile.teachTopics}
                variant="teach"
              />
            ) : null}
            {showLearn ? (
              <ProfileTopicsSection
                title={learnSectionTitle}
                topics={profile.learnTopics}
                variant="learn"
              />
            ) : null}
            {recentActivity ? <ProfileRecentActivity items={recentActivity} /> : null}
            {children}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = {
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
} as const;
