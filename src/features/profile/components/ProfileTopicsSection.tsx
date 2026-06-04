import { Text, View } from 'react-native';

import type { ProfileTopicVariant } from '@/features/profile/types';

interface ProfileTopicsSectionProps {
  title: string;
  topics: string[];
  variant: ProfileTopicVariant;
}

export function ProfileTopicsSection({
  title,
  topics,
  variant,
}: ProfileTopicsSectionProps) {
  if (topics.length === 0) return null;

  const chipClass = variant === 'teach' ? 'bg-secondary' : 'bg-muted';
  const labelClass =
    variant === 'teach' ? 'text-primary' : 'text-foreground';

  return (
    <View>
      <Text className="mb-3 text-[17px] font-semibold text-foreground">{title}</Text>
      <View className="flex-row flex-wrap gap-2">
        {topics.map((topic) => (
          <View key={topic} className={`rounded-full px-3.5 py-1.5 ${chipClass}`}>
            <Text className={`text-[13px] font-medium ${labelClass}`}>{topic}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
