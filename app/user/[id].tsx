import { useLocalSearchParams } from 'expo-router';

import { PublicProfileScreen } from '@/features/profile/screens/PublicProfileScreen';

export default function UserProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

  if (!userId) {
    return null;
  }

  return <PublicProfileScreen userId={userId} />;
}
