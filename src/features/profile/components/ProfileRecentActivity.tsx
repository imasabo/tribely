import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { ProfileActivityItem } from '@/features/profile/types';

interface ProfileRecentActivityProps {
  title?: string;
  items: ProfileActivityItem[];
}

export function ProfileRecentActivity({
  title = 'Recent Activity',
  items,
}: ProfileRecentActivityProps) {
  if (items.length === 0) return null;

  return (
    <View>
      <Text className="mb-3 text-[17px] font-semibold text-foreground">{title}</Text>
      {items.map((item) => (
        <View
          key={`${item.title}-${item.subtitle}`}
          className="mb-2 flex-row items-center justify-between rounded-2xl border border-border bg-card p-4">
          <View className="flex-1 pr-2">
            <Text className="text-sm font-semibold text-foreground">{item.title}</Text>
            <Text className="text-xs text-muted-foreground">{item.subtitle}</Text>
          </View>
          {item.rating != null ? (
            <View className="flex-row items-center gap-1">
              <Feather name="star" size={12} color={colors.accent} />
              <Text className="text-sm text-muted-foreground">{item.rating}</Text>
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}
