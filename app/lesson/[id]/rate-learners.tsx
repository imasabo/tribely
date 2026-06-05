import { useLocalSearchParams } from 'expo-router';

import { RateLearnersScreen } from '@/features/lessons/screens/RateLearnersScreen';

export default function RateLearnersRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
  if (!lessonId) return null;
  return <RateLearnersScreen lessonId={lessonId} />;
}
