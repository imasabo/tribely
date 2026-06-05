import { Pressable, Text, TextInput, View } from 'react-native';

import { colors } from '@/constants/theme';
import {
  LESSON_CATEGORY_NAME_CHAR_LIMIT,
  LESSON_CATEGORY_OPTIONS,
  LESSON_CATEGORY_OTHER_ID,
  LESSON_CUSTOM_EMOJI_OPTIONS,
} from '@/features/lessons/lib/lessonCategories';

interface LessonCategoryFieldProps {
  selectedCategoryId: string | null;
  customCategoryName: string;
  customCategoryEmoji: string | null;
  onSelectCategory: (categoryId: string) => void;
  onCustomNameChange: (name: string) => void;
  onCustomEmojiChange: (emoji: string) => void;
  categoryError?: string;
  customNameError?: string;
  customEmojiError?: string;
}

function CategoryChip({
  emoji,
  label,
  selected,
  onPress,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <View className="min-w-[47%] flex-1">
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        className={`flex-row items-center gap-2 rounded-xl border px-3 py-3 active:opacity-90 ${
          selected ? 'border-primary bg-secondary' : 'border-border bg-card'
        }`}>
        <Text className="text-lg">{emoji}</Text>
        <Text
          className={`flex-1 text-sm font-medium ${
            selected ? 'text-primary' : 'text-foreground'
          }`}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

export function LessonCategoryField({
  selectedCategoryId,
  customCategoryName,
  customCategoryEmoji,
  onSelectCategory,
  onCustomNameChange,
  onCustomEmojiChange,
  categoryError,
  customNameError,
  customEmojiError,
}: LessonCategoryFieldProps) {
  const isOther = selectedCategoryId === LESSON_CATEGORY_OTHER_ID;

  return (
    <View className="gap-3">
      <View className="gap-1.5">
        <Text className="text-sm font-medium text-foreground">Category</Text>
        <Text className="text-xs text-muted-foreground">
          What topic best describes your lesson?
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {LESSON_CATEGORY_OPTIONS.map((option) => (
          <CategoryChip
            key={option.id}
            emoji={option.emoji}
            label={option.label}
            selected={selectedCategoryId === option.id}
            onPress={() => onSelectCategory(option.id)}
          />
        ))}
      </View>

      {categoryError ? (
        <Text className="text-xs text-destructive">{categoryError}</Text>
      ) : null}

      {isOther ? (
        <View className="gap-4 rounded-2xl border border-border bg-card p-4">
          <View className="gap-1.5">
            <Text className="text-sm font-medium text-foreground">Category name</Text>
            <TextInput
              value={customCategoryName}
              onChangeText={onCustomNameChange}
              placeholder="e.g. Woodworking"
              placeholderTextColor={colors.mutedForeground}
              maxLength={LESSON_CATEGORY_NAME_CHAR_LIMIT}
              className={`rounded-xl bg-muted px-4 py-3.5 text-base text-foreground ${
                customNameError ? 'border border-destructive' : ''
              }`}
            />
            {customNameError ? (
              <Text className="text-xs text-destructive">{customNameError}</Text>
            ) : (
              <Text className="text-xs text-muted-foreground">
                Up to {LESSON_CATEGORY_NAME_CHAR_LIMIT} characters
              </Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Emoji</Text>
            <View className="flex-row flex-wrap gap-2">
              {LESSON_CUSTOM_EMOJI_OPTIONS.map((emoji) => {
                const selected = customCategoryEmoji === emoji;
                return (
                  <Pressable
                    key={emoji}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => onCustomEmojiChange(emoji)}
                    className={`h-11 w-11 items-center justify-center rounded-xl border active:opacity-90 ${
                      selected
                        ? 'border-primary bg-secondary'
                        : 'border-border bg-muted'
                    }`}>
                    <Text className="text-xl">{emoji}</Text>
                  </Pressable>
                );
              })}
            </View>
            {customEmojiError ? (
              <Text className="text-xs text-destructive">{customEmojiError}</Text>
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  );
}
