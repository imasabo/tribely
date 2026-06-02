import { useLocalSearchParams } from 'expo-router';

import { ActivityCommentsScreen } from '@/features/activity/screens/ActivityCommentsScreen';

export default function ActivityCommentsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <ActivityCommentsScreen activityId={id} />;
}
