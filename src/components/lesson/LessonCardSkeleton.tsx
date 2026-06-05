import { View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';

interface LessonCardSkeletonProps {
  showDistance?: boolean;
}

export function LessonCardSkeleton({ showDistance = true }: LessonCardSkeletonProps) {
  return (
    <View className="flex-row overflow-hidden rounded-2xl border border-border bg-card p-3">
      <Skeleton width={64} height={64} borderRadius={12} className="mr-3 flex-shrink-0" />
      <View className="flex-1 justify-center">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-2">
            <Skeleton width="55%" height={10} borderRadius={5} className="mb-1.5" />
            <Skeleton width="92%" height={14} borderRadius={6} className="mb-1" />
            <Skeleton width="72%" height={14} borderRadius={6} />
            <Skeleton width="40%" height={10} borderRadius={5} className="mt-1.5" />
          </View>
          <Skeleton width={28} height={10} borderRadius={5} />
        </View>
        <View className="mt-2 flex-row gap-3">
          <Skeleton width={88} height={10} borderRadius={5} />
          {showDistance ? <Skeleton width={56} height={10} borderRadius={5} /> : null}
        </View>
      </View>
    </View>
  );
}

export function LessonCardSkeletonList({
  count = 5,
  showDistance = true,
}: {
  count?: number;
  showDistance?: boolean;
}) {
  return (
    <View className="gap-3">
      {Array.from({ length: count }, (_, index) => (
        <LessonCardSkeleton key={`lesson-skeleton-${index}`} showDistance={showDistance} />
      ))}
    </View>
  );
}
