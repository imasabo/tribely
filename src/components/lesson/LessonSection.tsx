import { View } from 'react-native';

import { LessonCard } from '@/components/lesson/LessonCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Lesson } from '@/types/domain';

interface LessonSectionProps {
  title: string;
  lessons: Lesson[];
  actionLabel?: string;
  onActionPress?: () => void;
  variant?: 'featured' | 'compact';
  onLessonPress: (lessonId: string) => void;
  className?: string;
}

export function LessonSection({
  title,
  lessons,
  actionLabel = 'See all',
  onActionPress,
  variant = 'compact',
  onLessonPress,
  className,
}: LessonSectionProps) {
  return (
    <View className={className}>
      <SectionHeader title={title} actionLabel={actionLabel} onActionPress={onActionPress} />
      <View className={variant === 'compact' ? 'gap-3' : undefined}>
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            variant={variant}
            onPress={() => onLessonPress(lesson.id)}
          />
        ))}
      </View>
    </View>
  );
}
