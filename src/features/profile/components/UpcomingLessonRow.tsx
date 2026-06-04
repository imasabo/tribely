import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { GoogleSlidesCardPreview } from '@/components/lesson/GoogleSlidesCardPreview';
import { colors } from '@/constants/theme';
import type { UpcomingLessonItem } from '@/features/profile/types';

interface UpcomingLessonRowProps {
  item: UpcomingLessonItem;
  onPress: () => void;
}

export function UpcomingLessonRow({ item, onPress }: UpcomingLessonRowProps) {
  const isTeaching = item.role === 'teaching';

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
        <Text className="text-[11px] text-muted-foreground">
          {item.categoryEmoji} {item.category} · {item.durationMinutes} min
        </Text>
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
            <Feather name="clock" size={10} color={colors.mutedForeground} />
            <Text className="text-[11px] text-muted-foreground">{item.scheduledAtLabel}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Feather name="map-pin" size={10} color={colors.mutedForeground} />
            <Text className="text-[11px] text-muted-foreground" numberOfLines={1}>
              {item.locationName}
            </Text>
          </View>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}
