import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { useLesson } from '@/features/lessons/hooks/useLesson';
import { formatPriceDollars } from '@/mappers/lesson.mapper';

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

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="relative h-64">
          <LinearGradient
            colors={lesson.slidePreviewColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text className="text-5xl">{lesson.categoryEmoji}</Text>
            <View className="mt-2 rounded-full bg-white/20 px-4 py-1.5">
              <Text className="text-[13px] font-medium text-white">{lesson.category}</Text>
            </View>
          </LinearGradient>

          <View
            className="absolute left-4 right-4 flex-row justify-between"
            style={{ top: insets.top + 8 }}>
            <Pressable
              onPress={() => router.back()}
              className="h-9 w-9 items-center justify-center rounded-full bg-black/30">
              <Feather name="arrow-left" size={18} color="#fff" />
            </Pressable>
            <View className="flex-row gap-2">
              <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-black/30">
                <Feather name="heart" size={16} color="#fff" />
              </Pressable>
              <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-black/30">
                <Feather name="share-2" size={16} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="mb-3 flex-row gap-2">
            <View className="rounded-full bg-secondary px-2.5 py-1">
              <Text className="text-xs font-medium text-primary">
                {lesson.durationMinutes} min lesson
              </Text>
            </View>
            <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: colors.accentLight }}>
              <Text className="text-xs font-medium text-accent">
                {formatPriceDollars(lesson.priceCents)}
              </Text>
            </View>
          </View>

          <Text className="mb-4 text-[22px] font-bold leading-tight tracking-tight text-foreground">
            {lesson.title}
          </Text>

          <View className="mb-5 flex-row items-center gap-3">
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
            </View>
          </View>

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

          <Text className="mb-2 text-[17px] font-semibold text-foreground">Deck preview</Text>
          <Text className="mb-4 text-sm leading-5 text-muted-foreground">
            Preview the teacher&apos;s PowerPoint before requesting to join this lesson.
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                className="mr-3 h-[140px] w-56 overflow-hidden rounded-2xl"
                style={{ opacity: i === 0 ? 1 : 0.7 }}>
                <LinearGradient
                  colors={
                    i === 0
                      ? [lesson.slidePreviewColors[0], lesson.slidePreviewColors[1]]
                      : ['#374151', '#1F2937']
                  }
                  style={{ flex: 1, padding: 16, justifyContent: 'space-between' }}>
                  <View>
                    <Text className="text-xs text-white/50">SLIDE {i + 1}</Text>
                    <View className="mt-2 h-2.5 w-4/5 rounded-full bg-white/90" />
                    <View className="mt-1.5 h-1.5 w-3/5 rounded-full bg-white/50" />
                  </View>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
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
