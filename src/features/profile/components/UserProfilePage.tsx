import { type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { ProfileFriendConnection } from '@/features/profile/components/ProfileFriendConnection';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfileIdentity } from '@/features/profile/components/ProfileIdentity';
import { ProfileRecentActivity } from '@/features/profile/components/ProfileRecentActivity';
import { ProfileStatsRow } from '@/features/profile/components/ProfileStatsRow';
import { ProfileTopicsSection } from '@/features/profile/components/ProfileTopicsSection';
import type { ProfileActivityItem, ProfileViewModel } from '@/features/profile/types';
import { getInitials } from '@/lib/userDisplay';
import type { FriendConnectionStatus } from '@/types/social';

export interface ProfileFriendConnectionConfig {
  status: FriendConnectionStatus;
  requesting: boolean;
  onSendFriendRequest: () => void;
}

export interface UserProfilePageProps {
  profile: ProfileViewModel;
  /** Override initials; defaults to profile display name. */
  initials?: string;
  headerStart?: ReactNode;
  headerEnd?: ReactNode;
  avatarAccessory?: ReactNode;
  showEditBadge?: boolean;
  friendConnection?: ProfileFriendConnectionConfig;
  teachSectionTitle?: string;
  learnSectionTitle?: string;
  /** Own profile: always show teach row with + Add. Public: hide empty sections. */
  showAddTeachChip?: boolean;
  hideEmptyTopicSections?: boolean;
  recentActivity?: ProfileActivityItem[];
  /** Extra sections below topics (own profile only, etc.) */
  children?: ReactNode;
}

export function UserProfilePage({
  profile,
  initials: initialsOverride,
  headerStart,
  headerEnd,
  avatarAccessory,
  showEditBadge = false,
  friendConnection,
  teachSectionTitle = 'Teaches',
  learnSectionTitle = 'Wants to learn',
  showAddTeachChip = false,
  hideEmptyTopicSections = true,
  recentActivity,
  children,
}: UserProfilePageProps) {
  const initials = initialsOverride ?? getInitials(profile.displayName);
  const showTeach =
    profile.teachTopics.length > 0 || showAddTeachChip || !hideEmptyTopicSections;
  const showLearn =
    profile.learnTopics.length > 0 || !hideEmptyTopicSections;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      <ProfileHeader
        initials={initials}
        headerStart={headerStart}
        headerEnd={headerEnd}
        avatarAccessory={avatarAccessory}
        showEditBadge={showEditBadge}>
        <ProfileIdentity
          displayName={profile.displayName}
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
        <ProfileStatsRow stats={profile.stats} className="mt-4" />
      </ProfileHeader>

      <View className="gap-5 px-5 pb-8">
        {showTeach ? (
          <ProfileTopicsSection
            title={teachSectionTitle}
            topics={profile.teachTopics}
            variant="teach"
            showAddChip={showAddTeachChip}
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
    </ScrollView>
  );
}
