import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { ProfileReviewFilter } from '@/features/profile/lib/profileReviewSummary';
import type { ProfileReviewRatingSlice } from '@/features/profile/lib/profileReviewSummary';

interface ProfileRatingBreakdownProps {
  teaching: ProfileReviewRatingSlice;
  learning: ProfileReviewRatingSlice;
  onPressTeaching?: () => void;
  onPressLearning?: () => void;
}

function RatingSlice({
  label,
  icon,
  slice,
  onPress,
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  slice: ProfileReviewRatingSlice;
  onPress?: () => void;
}) {
  const hasRatings = slice.count > 0 && slice.average != null;
  const valueLabel = hasRatings ? slice.average!.toFixed(1) : '—';
  const countLabel =
    slice.count === 0
      ? 'No ratings yet'
      : slice.count === 1
        ? '1 rating'
        : `${slice.count} ratings`;

  const content = (
    <>
      <View className="flex-row items-center gap-1.5">
        <Feather name={icon} size={14} color={colors.primary} />
        <Text className="text-xs font-medium text-muted-foreground">{label}</Text>
      </View>
      <View className="mt-1.5 flex-row items-end gap-1">
        <Feather name="star" size={14} color={colors.accent} />
        <Text className="text-xl font-bold text-foreground">{valueLabel}</Text>
      </View>
      <Text className="mt-0.5 text-[11px] text-muted-foreground">{countLabel}</Text>
    </>
  );

  if (!onPress) {
    return <View className="flex-1 px-4 py-3">{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${valueLabel}, ${countLabel}`}
      className="flex-1 px-4 py-3 active:opacity-80">
      {content}
    </Pressable>
  );
}

export function ProfileRatingBreakdown({
  teaching,
  learning,
  onPressTeaching,
  onPressLearning,
}: ProfileRatingBreakdownProps) {
  if (teaching.count === 0 && learning.count === 0) {
    return null;
  }

  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-card">
      <View className="flex-row">
        <RatingSlice
          label="Teaching"
          icon="book-open"
          slice={teaching}
          onPress={onPressTeaching}
        />
        <View className="w-px self-stretch bg-border" />
        <RatingSlice
          label="Learning"
          icon="user"
          slice={learning}
          onPress={onPressLearning}
        />
      </View>
    </View>
  );
}
