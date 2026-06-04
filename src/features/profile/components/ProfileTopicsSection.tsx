import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { ProfileTopicVariant } from '@/features/profile/types';

interface ProfileTopicsSectionProps {
  title: string;
  topics: string[];
  variant: ProfileTopicVariant;
  showAddChip?: boolean;
}

export function ProfileTopicsSection({
  title,
  topics,
  variant,
  showAddChip = false,
}: ProfileTopicsSectionProps) {
  if (topics.length === 0 && !showAddChip) return null;

  const isTeach = variant === 'teach';

  return (
    <View>
      <Text className="mb-3 text-[17px] font-semibold text-foreground">{title}</Text>
      <View className="flex-row flex-wrap gap-2">
        {topics.map((topic) => (
          <View
            key={topic}
            className={`rounded-full px-3.5 py-1.5 ${isTeach ? 'bg-secondary' : ''}`}
            style={isTeach ? undefined : { backgroundColor: colors.accentLight }}>
            <Text
              className={`text-[13px] font-medium ${isTeach ? 'text-primary' : 'text-accent'}`}>
              {topic}
            </Text>
          </View>
        ))}
        {showAddChip ? (
          <View className="rounded-full border border-dashed border-border px-3.5 py-1.5">
            <Text className="text-[13px] text-muted-foreground">+ Add</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
