import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback } from 'react';

import { ProfileEditLink } from '@/features/profile/components/ProfileEditLink';
import { ProfileFriendsEntry } from '@/features/profile/components/ProfileFriendsEntry';
import { UserProfilePage } from '@/features/profile/components/UserProfilePage';
import { ProfileHeaderIconButton } from '@/features/profile/components/ProfileHeader';
import { OWN_PROFILE_STATS_USER_ID } from '@/features/profile/lib/ownProfileStats';
import { isFirebaseNativeAvailable } from '@/lib/firebase';
import { MOCK_OWN_PROFILE_ACTIVITY } from '@/features/profile/lib/profileViewModel';
import { useFriendConnections } from '@/providers/FriendConnectionsProvider';
import { useOwnProfile } from '@/providers/OwnProfileProvider';
import { useAuth } from '@/providers/AuthProvider';
import { getInitials } from '@/lib/userDisplay';

export function ProfileScreen() {
  const { user } = useAuth();
  const { viewModel } = useOwnProfile();
  const { friendCount, loading: friendsLoading, reload: reloadFriends } = useFriendConnections();
  const initials = getInitials(viewModel.displayName || user?.displayName || '');

  useFocusEffect(
    useCallback(() => {
      void reloadFriends({ background: true });
    }, [reloadFriends])
  );

  const openEditProfile = () => router.push('/edit-profile');
  const openFriends = () => router.push('/friends');
  const profileUserId =
    isFirebaseNativeAvailable && user?.uid ? user.uid : OWN_PROFILE_STATS_USER_ID;

  return (
    <UserProfilePage
      profile={viewModel}
      profileUserId={profileUserId}
      initials={initials}
      teachSectionTitle="I Teach"
      learnSectionTitle="I Want to Learn"
      hideEmptyTopicSections={false}
      showLessons
      interestsCardTitle="Interests"
      recentActivity={MOCK_OWN_PROFILE_ACTIVITY}
      identityNameAccessory={<ProfileEditLink onPress={openEditProfile} />}
      friendsEntry={
        friendsLoading ? undefined : (
          <ProfileFriendsEntry count={friendCount} onPress={openFriends} />
        )
      }
      headerEnd={
        <ProfileHeaderIconButton
          icon="settings"
          accessibilityLabel="Settings"
          variant="onGradient"
          onPress={() => router.push('/settings')}
        />
      }
    />
  );
}
