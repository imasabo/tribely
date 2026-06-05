import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { GoogleSlidesCardPreview } from '@/components/lesson/GoogleSlidesCardPreview';
import { colors } from '@/constants/theme';
import type { UserLessonItem } from '@/features/profile/types';

interface UserLessonRowProps {
  item: UserLessonItem;
  onPress: () => void;
  /** Show Taught / Learned badge (Completed tab). */
  showRoleBadge?: boolean;
}

export function UserLessonRow({ item, onPress, showRoleBadge = false }: UserLessonRowProps) {
  const isTeaching = item.role === 'teaching';
  const isCompleted = Boolean(item.completedAtLabel);
  const roleBadgeLabel = isTeaching ? 'Taught' : 'Learned';
  const showShareExperience =
    item.canShareExperience && !item.hasSharedExperience && item.role === 'attending';
  const showRateLearners =
    item.role === 'teaching' && item.canRateLearners && (item.learnersToRateCount ?? 0) > 0;

  const openShareExperience = () => {
    router.push(`/lesson/${item.lessonId}/complete`);
  };

  const openRateLearners = () => {
    router.push(`/lesson/${item.lessonId}/rate-learners`);
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.title}`}
      className="flex-row overflow-hidden rounded-2xl border border-border bg-card p-3 active:opacity-95">
      <View className="mr-3 h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
        <GoogleSlidesCardPreview variant="compact" colors={item.slidePreviewColors} />
      </View>
      <View className="flex-1 justify-center">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="text-[11px] text-muted-foreground">
            {item.categoryEmoji} {item.category} · {item.durationMinutes} min
          </Text>
          {showRoleBadge && isCompleted ? (
            <View
              className={`rounded-full px-2 py-0.5 ${
                isTeaching ? 'bg-primary/10' : 'bg-accent/15'
              }`}>
              <Text
                className={`text-[10px] font-semibold ${
                  isTeaching ? 'text-primary' : 'text-accent'
                }`}>
                {roleBadgeLabel}
              </Text>
            </View>
          ) : null}
        </View>
        <Text className="mt-0.5 text-sm font-semibold leading-tight text-foreground" numberOfLines={2}>
          {item.title}
        </Text>
        {isTeaching ? (
          <Text className="mt-1 text-xs text-muted-foreground">
            {item.enrolledCount ?? 0}/{item.maxLearners ?? 0} enrolled
          </Text>
        ) : (
          <Text className="mt-1 text-xs text-muted-foreground">
            with {item.teacherName}
          </Text>
        )}
        <View className="mt-2 flex-row flex-wrap gap-3">
          <View className="flex-row items-center gap-1">
            <Feather
              name={isCompleted ? 'check-circle' : 'clock'}
              size={10}
              color={isCompleted ? colors.primary : colors.mutedForeground}
            />
            <Text className="text-[11px] text-muted-foreground">
              {isCompleted ? `Completed · ${item.completedAtLabel}` : item.scheduledAtLabel}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Feather name="map-pin" size={10} color={colors.mutedForeground} />
            <Text className="text-[11px] text-muted-foreground" numberOfLines={1}>
              {item.locationName}
            </Text>
          </View>
        </View>
        {showRateLearners ? (
          <Pressable
            onPress={(e) => {
              e?.stopPropagation?.();
              openRateLearners();
            }}
            accessibilityRole="button"
            accessibilityLabel={`Rate learners for ${item.title}`}
            className="mt-3 self-start rounded-full bg-primary px-3 py-1.5 active:opacity-90">
            <Text className="text-xs font-semibold text-white">
              Rate learners ({item.learnersToRateCount})
            </Text>
          </Pressable>
        ) : showShareExperience ? (
          <Pressable
            onPress={(e) => {
              e?.stopPropagation?.();
              openShareExperience();
            }}
            accessibilityRole="button"
            accessibilityLabel={`Share your experience for ${item.title}`}
            className="mt-3 self-start rounded-full bg-primary px-3 py-1.5 active:opacity-90">
            <Text className="text-xs font-semibold text-white">Share your experience</Text>
          </Pressable>
        ) : item.hasSharedExperience && item.role === 'attending' && isCompleted ? (
          <Text className="mt-2 text-xs text-muted-foreground">Experience shared on feed</Text>
        ) : null}
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}
