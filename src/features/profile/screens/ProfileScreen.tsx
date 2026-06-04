import { Text, View } from 'react-native';

import { UserProfilePage } from '@/features/profile/components/UserProfilePage';
import { ProfileHeaderIconButton } from '@/features/profile/components/ProfileHeader';
import {
  MOCK_OWN_PROFILE_ACTIVITY,
  MOCK_OWN_PROFILE_VIEW_MODEL,
} from '@/features/profile/lib/profileViewModel';

export function ProfileScreen() {
  return (
    <UserProfilePage
      profile={MOCK_OWN_PROFILE_VIEW_MODEL}
      initials="AK"
      showEditBadge
      teachSectionTitle="I Teach"
      learnSectionTitle="I Want to Learn"
      showAddTeachChip
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
        <View className="rounded-xl border border-border px-4 py-2">
          <Text className="text-sm font-medium text-foreground">Edit Profile</Text>
        </View>
      }
    />
  );
}
