import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { Lesson } from '@/types/domain';

import { SlidePreview } from './SlidePreview';

interface LessonCardProps {
  lesson: Lesson;
  variant?: 'featured' | 'compact';
  onPress: () => void;
}

export function LessonCard({ lesson, variant = 'compact', onPress }: LessonCardProps) {
  if (variant === 'featured') {
    return (
      <Pressable
        onPress={onPress}
        className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm active:opacity-95">
        <View className="h-40 p-3">
          <SlidePreview colors={lesson.slidePreviewColors} />
        </View>
        <View className="px-4 pb-4">
          <View className="mb-2 flex-row gap-2">
            <View className="rounded-full bg-secondary px-2.5 py-1">
              <Text className="text-xs font-medium text-primary">
                {lesson.categoryEmoji} {lesson.category}
              </Text>
            </View>
            <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: colors.accentLight }}>
              <Text className="text-xs font-medium text-accent">{lesson.durationMinutes} min</Text>
            </View>
          </View>
          <Text className="mb-2 text-base font-semibold text-foreground">{lesson.title}</Text>
          <View className="flex-row items-center gap-3">
            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Text className="text-[10px] font-semibold text-white">{lesson.teacherAvatar}</Text>
            </View>
            <Text className="text-[13px] text-muted-foreground">{lesson.teacherName}</Text>
            <View className="flex-row items-center gap-1">
              <Feather name="star" size={12} color={colors.accent} />
              <Text className="text-[13px] font-medium text-foreground">{lesson.rating}</Text>
              <Text className="text-[13px] text-muted-foreground">({lesson.reviewCount})</Text>
            </View>
          </View>
          <View className="mt-3 flex-row gap-3 border-t border-border pt-3">
            <View className="flex-row items-center gap-1">
              <Feather name="clock" size={12} color={colors.mutedForeground} />
              <Text className="text-xs text-muted-foreground">{lesson.scheduledAtLabel}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Feather name="map-pin" size={12} color={colors.mutedForeground} />
              <Text className="text-xs text-muted-foreground">{lesson.distanceLabel}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className="flex-row overflow-hidden rounded-2xl border border-border bg-card active:opacity-95">
      <View className="h-20 w-20 flex-shrink-0 p-2">
        <SlidePreview colors={lesson.slidePreviewColors} />
      </View>
      <View className="flex-1 p-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-2">
            <Text className="mb-0.5 text-[11px] text-muted-foreground">
              {lesson.categoryEmoji} {lesson.category} · {lesson.durationMinutes} min
            </Text>
            <Text className="text-sm font-semibold leading-tight text-foreground">{lesson.title}</Text>
            <Text className="mt-1 text-xs text-muted-foreground">{lesson.teacherName}</Text>
          </View>
          <View className="flex-row items-center gap-0.5">
            <Feather name="star" size={10} color={colors.accent} />
            <Text className="text-[11px] text-muted-foreground">{lesson.rating}</Text>
          </View>
        </View>
        <View className="mt-2 flex-row gap-2">
          <View className="flex-row items-center gap-1">
            <Feather name="clock" size={10} color={colors.mutedForeground} />
            <Text className="text-[11px] text-muted-foreground">{lesson.scheduledAtLabel}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Feather name="map-pin" size={10} color={colors.mutedForeground} />
            <Text className="text-[11px] text-muted-foreground">{lesson.distanceLabel}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
