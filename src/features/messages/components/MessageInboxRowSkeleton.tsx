import { View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';

export function MessageInboxRowSkeleton() {
  return (
    <View className="flex-row items-center gap-3 border-b border-border bg-card py-4 pl-3 pr-5">
      <View className="w-3 items-center justify-center self-stretch">
        <Skeleton width={10} height={10} borderRadius={5} />
      </View>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View className="min-w-0 flex-1 shrink">
        <View className="min-w-0 flex-row items-center gap-2">
          <Skeleton width="72%" height={16} borderRadius={8} className="min-w-0 flex-1 shrink" />
          <Skeleton width={36} height={11} borderRadius={5} />
        </View>
        <Skeleton width="58%" height={10} borderRadius={5} className="mt-1" />
        <Skeleton width="92%" height={14} borderRadius={7} className="mt-1.5" />
        <Skeleton width="76%" height={14} borderRadius={7} className="mt-1" />
      </View>
      <Skeleton width={18} height={18} borderRadius={4} />
    </View>
  );
}

export function MessageInboxRowSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }, (_, index) => (
        <MessageInboxRowSkeleton key={`inbox-skeleton-${index}`} />
      ))}
    </View>
  );
}
