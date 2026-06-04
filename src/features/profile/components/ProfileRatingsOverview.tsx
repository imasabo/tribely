import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { ProfileRatingBreakdown } from '@/features/profile/components/ProfileRatingBreakdown';
import type { ProfileReviewFilter } from '@/features/profile/lib/profileReviewSummary';
import type { ProfileReviewSummary } from '@/features/profile/lib/profileReviewSummary';

interface ProfileRatingsOverviewProps {
  summary: ProfileReviewSummary;
  onSelectFilter: (filter: ProfileReviewFilter) => void;
}

export function ProfileRatingsOverview({ summary, onSelectFilter }: ProfileRatingsOverviewProps) {
  const overallLabel =
    summary.overall != null ? summary.overall.toFixed(1) : '—';

  return (
    <View className="mb-4 gap-4">
      <View className="rounded-2xl border border-border bg-card px-4 py-4">
        <View className="flex-row items-center gap-2">
          <Feather name="star" size={22} color={colors.accent} />
          <Text className="text-[32px] font-bold text-foreground">{overallLabel}</Text>
        </View>
        <Text className="mt-2 text-sm leading-5 text-muted-foreground">
          Overall rating from lessons taught and attended — averaged across feedback as a
          teacher and as a learner.
        </Text>
      </View>

      <ProfileRatingBreakdown
        teaching={summary.teaching}
        learning={summary.learning}
        onPressTeaching={() => onSelectFilter('as_teacher')}
        onPressLearning={() => onSelectFilter('as_learner')}
      />

      <Text className="text-[15px] font-semibold text-foreground">Reviews</Text>
    </View>
  );
}
