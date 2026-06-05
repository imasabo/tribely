import { useLocalSearchParams } from 'expo-router';

import { CompleteLessonScreen } from '@/features/lessons/screens/CompleteLessonScreen';

export default function CompleteLessonRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
  if (!lessonId) return null;
  return <CompleteLessonScreen lessonId={lessonId} />;
}
