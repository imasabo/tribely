import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { UserProfilePage } from '@/features/profile/components/UserProfilePage';
import { ProfileHeaderIconButton } from '@/features/profile/components/ProfileHeader';
import { MOCK_OWN_PROFILE_ACTIVITY } from '@/features/profile/lib/profileViewModel';
import { useOwnProfile } from '@/providers/OwnProfileProvider';
import { useAuth } from '@/providers/AuthProvider';
import { getInitials } from '@/lib/userDisplay';

export function ProfileScreen() {
  const { user } = useAuth();
  const { viewModel } = useOwnProfile();
  const initials = getInitials(viewModel.displayName || user?.displayName || '');

  const openEditProfile = () => router.push('/edit-profile');

  return (
    <UserProfilePage
      profile={viewModel}
      initials={initials}
      showEditBadge
      onEditPress={openEditProfile}
      teachSectionTitle="I Teach"
      learnSectionTitle="I Want to Learn"
      hideEmptyTopicSections={false}
      recentActivity={MOCK_OWN_PROFILE_ACTIVITY}
      headerEnd={
        <ProfileHeaderIconButton
          icon="settings"
          accessibilityLabel="Settings"
          variant="onGradient"
        />
      }
      avatarAccessory={
        <Pressable
          onPress={openEditProfile}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          className="rounded-xl border border-border px-4 py-2 active:opacity-80">
          <Text className="text-sm font-medium text-foreground">Edit Profile</Text>
        </Pressable>
      }
    />
  );
}
