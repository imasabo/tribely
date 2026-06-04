import { router } from 'expo-router';
import { View } from 'react-native';

import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ProfileBlockedNotice } from '@/features/profile/components/ProfileBlockedNotice';
import { ProfileHeaderIconButton } from '@/features/profile/components/ProfileHeader';
import { UserProfilePage } from '@/features/profile/components/UserProfilePage';
import { usePublicProfile } from '@/features/profile/hooks/usePublicProfile';
import { showProfileUserMenu } from '@/features/profile/lib/profileUserMenu';
import { publicProfileToViewModel } from '@/features/profile/lib/profileViewModel';
import { useBlockedUsers } from '@/providers/BlockedUsersProvider';
import { useAuth } from '@/providers/AuthProvider';

interface PublicProfileScreenProps {
  userId: string;
}

export function PublicProfileScreen({ userId }: PublicProfileScreenProps) {
  const { user } = useAuth();
  const { isBlocked, blockUser, unblockUser } = useBlockedUsers();
  const { profile, connectionStatus, loading, requesting, error, sendFriendRequest } =
    usePublicProfile(userId, user?.uid);

  const blocked = isBlocked(userId);

  const handleProfileMenu = () => {
    if (!profile) return;

    showProfileUserMenu({
      userId,
      displayName: profile.displayName,
      blocked,
      onBlock: () => void blockUser(userId),
      onUnblock: () => void unblockUser(userId),
    });
  };

  if (loading) {
    return <LoadingScreen message="Loading profile…" />;
  }

  if (error || !profile) {
    return (
      <View className="flex-1 bg-background">
        <CenteredMessage
          message={error ?? 'Profile not found'}
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  return (
    <UserProfilePage
      profile={publicProfileToViewModel(profile)}
      profileUserId={userId}
      headerStart={
        <ProfileHeaderIconButton
          icon="arrow-left"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          variant="onGradient"
        />
      }
      headerEnd={
        <ProfileHeaderIconButton
          icon="more-horizontal"
          accessibilityLabel="Profile options"
          onPress={handleProfileMenu}
          variant="onGradient"
        />
      }
      friendConnection={
        blocked
          ? undefined
          : {
              status: connectionStatus,
              requesting,
              onSendFriendRequest: () => void sendFriendRequest(),
            }
      }
      identityAction={blocked ? <ProfileBlockedNotice /> : undefined}
      hideEmptyTopicSections
    />
  );
}
