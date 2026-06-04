import { useLocalSearchParams } from 'expo-router';

import { ProfileStatDetailScreen } from '@/features/profile/screens/ProfileStatDetailScreen';

export default function ProfileTaughtRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

  if (!userId) return null;

  return <ProfileStatDetailScreen userId={userId} statKey="taught" />;
}
