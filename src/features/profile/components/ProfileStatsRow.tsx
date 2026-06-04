import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { ProfileStatItem, ProfileStatKey } from '@/features/profile/types';

interface ProfileStatsRowProps {
  stats: ProfileStatItem[];
  className?: string;
  onStatPress?: (statKey: ProfileStatKey) => void;
}

export function ProfileStatsRow({ stats, className, onStatPress }: ProfileStatsRowProps) {
  return (
    <View className={`flex-row gap-2 ${className ?? ''}`}>
      {stats.map((stat) => {
        const isPressable = stat.statKey !== 'rating' && onStatPress != null;

        const content = (
          <>
            <Feather name={stat.icon} size={16} color={stat.color ?? colors.primary} />
            <Text className="text-[17px] font-bold text-foreground">{stat.value}</Text>
            <Text className="text-[10px] text-muted-foreground">{stat.label}</Text>
          </>
        );

        if (!isPressable) {
          return (
            <View
              key={stat.label}
              className="flex-1 items-center gap-1 rounded-2xl border border-border bg-card p-3">
              {content}
            </View>
          );
        }

        return (
          <Pressable
            key={stat.label}
            onPress={() => onStatPress(stat.statKey)}
            accessibilityRole="button"
            accessibilityLabel={`View ${stat.label.toLowerCase()}`}
            className="flex-1 items-center gap-1 rounded-2xl border border-border bg-card p-3 active:opacity-80">
            {content}
          </Pressable>
        );
      })}
    </View>
  );
}
