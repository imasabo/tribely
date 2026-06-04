import { useLocalSearchParams } from 'expo-router';

import { LessonChatScreen } from '@/features/lessons/screens/LessonChatScreen';

export default function LessonChatRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
  return <LessonChatScreen lessonId={lessonId} />;
}
