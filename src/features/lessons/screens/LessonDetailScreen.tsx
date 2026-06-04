import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoogleSlidesEmbed } from '@/components/lesson/GoogleSlidesEmbed';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { useLesson } from '@/features/lessons/hooks/useLesson';
interface LessonDetailScreenProps {
  lessonId: string;
}

export function LessonDetailScreen({ lessonId }: LessonDetailScreenProps) {
  const { lesson, loading, error } = useLesson(lessonId);
  const insets = useSafeAreaInsets();

  if (loading) {
    return <LoadingScreen message="Loading lesson…" />;
  }

  if (error || !lesson) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center text-muted-foreground">{error ?? 'Lesson not found'}</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-primary">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const openFullScreenSlides = () => {
    router.push(`/lesson/${lessonId}/slides`);
  };

  const openTeacherProfile = () => {
    router.push(`/user/${lesson.teacherId}`);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="relative h-72">
          <GoogleSlidesEmbed shareUrl={lesson.googleSlidesUrl} className="h-full" />

          <View
            className="absolute left-4 right-4 flex-row justify-between"
            style={{ top: insets.top + 8 }}
            pointerEvents="box-none">
            <Pressable
              onPress={() => router.back()}
              className="h-9 w-9 items-center justify-center rounded-full bg-black/40">
              <Feather name="arrow-left" size={18} color="#fff" />
            </Pressable>
            <View className="flex-row gap-2">
              <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-black/40">
                <Feather name="heart" size={16} color="#fff" />
              </Pressable>
              <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-black/40">
                <Feather name="share-2" size={16} color="#fff" />
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={openFullScreenSlides}
            className="absolute bottom-3 right-3 flex-row items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 active:opacity-80">
            <Feather name="maximize-2" size={14} color="#fff" />
            <Text className="text-xs font-medium text-white">Full screen</Text>
          </Pressable>
        </View>

        <View className="px-5 pt-5">
          <View className="mb-3 self-start rounded-full bg-secondary px-2.5 py-1">
            <Text className="text-xs font-medium text-primary">
              {lesson.durationMinutes} min lesson
            </Text>
          </View>

          <Text className="mb-4 text-[22px] font-bold leading-tight tracking-tight text-foreground">
            {lesson.title}
          </Text>

          <Pressable
            onPress={openTeacherProfile}
            accessibilityRole="link"
            accessibilityLabel={`View ${lesson.teacherName}'s profile`}
            className="mb-5 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3 active:opacity-90">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
              <Text className="font-semibold text-white">{lesson.teacherAvatar}</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">{lesson.teacherName}</Text>
              <View className="flex-row items-center gap-1">
                <Feather name="star" size={12} color={colors.accent} />
                <Text className="text-sm text-muted-foreground">
                  {lesson.rating} · {lesson.reviewCount} reviews
                </Text>
              </View>
              <Text className="mt-0.5 text-xs text-muted-foreground">View profile</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </Pressable>

          <View className="mb-5 gap-3 rounded-2xl border border-border bg-card p-4">
            <View className="flex-row items-center gap-3">
              <Feather name="clock" size={16} color={colors.primary} />
              <Text className="text-sm text-foreground">{lesson.scheduledAtLabel}</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Feather name="map-pin" size={16} color={colors.primary} />
              <Text className="flex-1 text-sm text-foreground">{lesson.locationName}</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Feather name="navigation" size={16} color={colors.primary} />
              <Text className="text-sm text-foreground">{lesson.distanceLabel} away</Text>
            </View>
          </View>

          <Text className="mb-2 text-[17px] font-semibold text-foreground">Slide deck</Text>
          <Text className="mb-4 text-sm leading-5 text-muted-foreground">
            Swipe through the teacher&apos;s Google Slides before requesting to join. Tap the preview
            above for full screen.
          </Text>

          <Button title="Open slides full screen" variant="outline" fullWidth onPress={openFullScreenSlides} />
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/95 px-5 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}>
        <Button title="Request to Join" fullWidth onPress={() => router.back()} />
      </View>
    </View>
  );
}
