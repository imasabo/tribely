import { useLocalSearchParams } from 'expo-router';

import { TaughtLessonDetailScreen } from '@/features/profile/screens/TaughtLessonDetailScreen';

export default function TaughtLessonRoute() {
  const { lessonId, userId } = useLocalSearchParams<{
    lessonId: string;
    userId: string;
  }>();

  const resolvedLessonId =
    typeof lessonId === 'string' ? lessonId : Array.isArray(lessonId) ? lessonId[0] : '';
  const resolvedUserId =
    typeof userId === 'string' ? userId : Array.isArray(userId) ? userId[0] : '';

  if (!resolvedLessonId || !resolvedUserId) return null;

  return (
    <TaughtLessonDetailScreen lessonId={resolvedLessonId} profileUserId={resolvedUserId} />
  );
}
