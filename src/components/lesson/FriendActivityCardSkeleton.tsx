import { View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';

export function FriendActivityCardSkeleton() {
  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-card">
      <View className="flex-row items-center gap-3 px-4 pt-4">
        <Skeleton width={24} height={24} borderRadius={12} />
        <View className="flex-1">
          <Skeleton width="68%" height={14} borderRadius={7} />
          <Skeleton width="42%" height={10} borderRadius={5} className="mt-1" />
        </View>
        <Skeleton width={36} height={22} borderRadius={11} />
      </View>

      <View className="m-4 overflow-hidden rounded-xl border border-border bg-muted/30">
        <Skeleton width="100%" height={112} borderRadius={0} />
        <View className="px-3 pb-3 pt-2">
          <Skeleton width="52%" height={10} borderRadius={5} />
          <Skeleton width="84%" height={14} borderRadius={7} className="mt-1.5" />
          <Skeleton width="48%" height={10} borderRadius={5} className="mt-1.5" />
        </View>
      </View>

      <Skeleton width="88%" height={12} borderRadius={6} className="mx-4 mb-1" />

      <View className="mt-1 flex-row items-center gap-5 px-4 pb-3">
        <Skeleton width={16} height={16} borderRadius={8} />
        <Skeleton width={16} height={16} borderRadius={8} />
      </View>
    </View>
  );
}

export function FriendActivityCardSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <View className="gap-4">
      {Array.from({ length: count }, (_, index) => (
        <FriendActivityCardSkeleton key={`activity-skeleton-${index}`} />
      ))}
    </View>
  );
}
