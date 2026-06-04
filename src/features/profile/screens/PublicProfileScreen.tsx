import { router } from 'expo-router';
import { View } from 'react-native';

import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ProfileHeaderIconButton } from '@/features/profile/components/ProfileHeader';
import { UserProfilePage } from '@/features/profile/components/UserProfilePage';
import { usePublicProfile } from '@/features/profile/hooks/usePublicProfile';
import { publicProfileToViewModel } from '@/features/profile/lib/profileViewModel';
import { useAuth } from '@/providers/AuthProvider';

interface PublicProfileScreenProps {
  userId: string;
}

export function PublicProfileScreen({ userId }: PublicProfileScreenProps) {
  const { user } = useAuth();
  const { profile, connectionStatus, loading, requesting, error, sendFriendRequest } =
    usePublicProfile(userId, user?.uid);

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
      friendConnection={{
        status: connectionStatus,
        requesting,
        onSendFriendRequest: () => void sendFriendRequest(),
      }}
      hideEmptyTopicSections
    />
  );
}
