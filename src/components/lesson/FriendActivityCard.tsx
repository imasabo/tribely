import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/constants/theme';
import type { FriendLessonActivity } from '@/types/domain';

import { SlidePreview } from './SlidePreview';

interface FriendActivityCardProps {
  activity: FriendLessonActivity;
  onPress: () => void;
}

export function FriendActivityCard({ activity, onPress }: FriendActivityCardProps) {
  const { friendName, friendAvatar, completedAtLabel, lesson, ratingGiven, reviewSnippet } =
    activity;

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-2xl border border-border bg-card active:opacity-95">
      <View className="flex-row items-center gap-3 px-4 pt-4">
        <Avatar initials={friendAvatar} size="sm" />
        <View className="flex-1">
          <Text className="text-sm text-foreground">
            <Text className="font-semibold">{friendName}</Text>
            <Text className="text-muted-foreground"> completed a lesson</Text>
          </Text>
          <Text className="text-xs text-muted-foreground">{completedAtLabel}</Text>
        </View>
        {ratingGiven ? (
          <View className="flex-row items-center gap-0.5 rounded-full bg-accent/10 px-2 py-1">
            <Feather name="star" size={11} color={colors.accent} />
            <Text className="text-xs font-medium text-accent">{ratingGiven}</Text>
          </View>
        ) : null}
      </View>

      <View className="m-4 overflow-hidden rounded-xl border border-border bg-muted/30">
        <View className="h-28 p-2">
          <SlidePreview colors={lesson.slidePreviewColors} />
        </View>
        <View className="px-3 pb-3">
          <Text className="text-[11px] text-muted-foreground">
            {lesson.categoryEmoji} {lesson.category} · {lesson.durationMinutes} min
          </Text>
          <Text className="mt-0.5 text-sm font-semibold text-foreground">{lesson.title}</Text>
          <Text className="mt-0.5 text-xs text-muted-foreground">with {lesson.teacherName}</Text>
        </View>
      </View>

      {reviewSnippet ? (
        <Text className="px-4 pb-4 text-[13px] leading-relaxed text-muted-foreground">
          &ldquo;{reviewSnippet}&rdquo;
        </Text>
      ) : null}
    </Pressable>
  );
}
