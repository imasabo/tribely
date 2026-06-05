import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback } from 'react';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ProfileEditLink } from '@/features/profile/components/ProfileEditLink';
import { ProfileFriendsEntry } from '@/features/profile/components/ProfileFriendsEntry';
import { UserProfilePage } from '@/features/profile/components/UserProfilePage';
import { ProfileHeaderIconButton } from '@/features/profile/components/ProfileHeader';
import { useFriendConnections } from '@/providers/FriendConnectionsProvider';
import { useOwnProfile } from '@/providers/OwnProfileProvider';
import { useAuth } from '@/providers/AuthProvider';
import { getInitials } from '@/lib/userDisplay';

export function ProfileScreen() {
  const { user, refreshProfile } = useAuth();
  const { viewModel, loading } = useOwnProfile();
  const { friendCount, loading: friendsLoading, reload: reloadFriends } = useFriendConnections();
  const initials = getInitials(viewModel.displayName || user?.displayName || '');

  useFocusEffect(
    useCallback(() => {
      void refreshProfile();
      void reloadFriends({ background: true });
    }, [refreshProfile, reloadFriends])
  );

  if (!user?.uid) {
    return <LoadingScreen message="Loading profile…" />;
  }

  if (loading) {
    return <LoadingScreen message="Loading profile…" />;
  }

  const openEditProfile = () => router.push('/edit-profile');
  const openFriends = () => router.push('/friends');

  return (
    <UserProfilePage
      profile={viewModel}
      profileUserId={user.uid}
      initials={initials}
      teachSectionTitle="I Teach"
      learnSectionTitle="I Want to Learn"
      hideEmptyTopicSections={false}
      showLessons
      interestsCardTitle="Interests"
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
