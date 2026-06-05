import { View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';

interface DiscoverListMetaSkeletonProps {
  showCount?: boolean;
  showLocation?: boolean;
}

export function DiscoverListMetaSkeleton({
  showCount = true,
  showLocation = true,
}: DiscoverListMetaSkeletonProps) {
  return (
    <View className="mb-3 mt-1 flex-row items-center justify-between px-5">
      {showCount ? <Skeleton width={108} height={14} borderRadius={7} /> : <View />}
      {showLocation ? <Skeleton width={124} height={14} borderRadius={7} /> : <View />}
    </View>
  );
}
