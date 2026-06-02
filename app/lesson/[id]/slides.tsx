import { useLocalSearchParams } from 'expo-router';

import { LessonSlidesScreen } from '@/features/lessons/screens/LessonSlidesScreen';

export default function LessonSlidesRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LessonSlidesScreen lessonId={id ?? ''} />;
}
