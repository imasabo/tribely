import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoogleSlidesEmbed } from '@/components/lesson/GoogleSlidesEmbed';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useLesson } from '@/features/lessons/hooks/useLesson';

interface LessonSlidesScreenProps {
  lessonId: string;
}

export function LessonSlidesScreen({ lessonId }: LessonSlidesScreenProps) {
  const { lesson, loading, error } = useLesson(lessonId);
  const insets = useSafeAreaInsets();

  if (loading) {
    return <LoadingScreen message="Loading slides…" />;
  }

  if (error || !lesson) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="text-center text-white/80">{error ?? 'Lesson not found'}</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-primary">Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <GoogleSlidesEmbed shareUrl={lesson.googleSlidesUrl} className="flex-1" />

      <View
        className="absolute left-0 right-0 flex-row items-center justify-between px-4"
        style={{ top: insets.top + 8 }}>
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-black/50">
          <Feather name="x" size={20} color="#fff" />
        </Pressable>
        <Text className="max-w-[60%] text-center text-sm font-medium text-white" numberOfLines={1}>
          {lesson.title}
        </Text>
        <View className="w-10" />
      </View>
    </View>
  );
}
