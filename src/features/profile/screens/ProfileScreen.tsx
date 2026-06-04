import { router } from 'expo-router';

import { ProfileEditLink } from '@/features/profile/components/ProfileEditLink';
import { UserProfilePage } from '@/features/profile/components/UserProfilePage';
import { ProfileHeaderIconButton } from '@/features/profile/components/ProfileHeader';
import { OWN_PROFILE_STATS_USER_ID } from '@/features/profile/lib/ownProfileStats';
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
      profileUserId={OWN_PROFILE_STATS_USER_ID}
      initials={initials}
      teachSectionTitle="I Teach"
      learnSectionTitle="I Want to Learn"
      hideEmptyTopicSections={false}
      showUpcomingLessons
      interestsCardTitle="Interests"
      recentActivity={MOCK_OWN_PROFILE_ACTIVITY}
      identityNameAccessory={<ProfileEditLink onPress={openEditProfile} />}
      headerEnd={
        <ProfileHeaderIconButton
          icon="settings"
          accessibilityLabel="Settings"
          variant="onGradient"
        />
      }
    />
  );
}
