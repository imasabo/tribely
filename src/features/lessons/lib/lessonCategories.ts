export const LESSON_CATEGORY_OTHER_ID = 'other';

export const LESSON_CATEGORY_NAME_CHAR_LIMIT = 30;

export type LessonCategoryOption = {
  id: string;
  label: string;
  emoji: string;
};

/** Preset categories aligned with Discover filters. */
export const LESSON_CATEGORY_OPTIONS: LessonCategoryOption[] = [
  { id: 'tech', label: 'Tech', emoji: '💻' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'language', label: 'Language', emoji: '🌍' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'finance', label: 'Finance', emoji: '📊' },
  { id: 'dance', label: 'Dance', emoji: '💃' },
  { id: 'cooking', label: 'Cooking', emoji: '🍳' },
  { id: 'photography', label: 'Photography', emoji: '📷' },
  { id: LESSON_CATEGORY_OTHER_ID, label: 'Other', emoji: '✨' },
];

export const LESSON_CUSTOM_EMOJI_OPTIONS = [
  '📚',
  '🎯',
  '🔬',
  '🧘',
  '🎭',
  '🎸',
  '🍞',
  '💼',
  '🌱',
  '🎮',
  '📝',
  '🏃',
  '🎤',
  '🧠',
  '✈️',
  '🛠️',
  '💡',
  '🎓',
  '🔧',
  '🌟',
  '🐍',
  '🤖',
  '📷',
  '☕',
];

export function findCategoryOptionByLabel(label: string): LessonCategoryOption | undefined {
  const normalized = label.trim().toLowerCase();
  return LESSON_CATEGORY_OPTIONS.find(
    (option) =>
      option.id !== LESSON_CATEGORY_OTHER_ID &&
      option.label.toLowerCase() === normalized
  );
}

export function resolveLessonCategory(input: {
  selectedCategoryId: string | null;
  customCategoryName: string;
  customCategoryEmoji: string | null;
}): { category: string; categoryEmoji: string } | null {
  if (!input.selectedCategoryId) return null;

  if (input.selectedCategoryId === LESSON_CATEGORY_OTHER_ID) {
    const name = input.customCategoryName.trim();
    const emoji = input.customCategoryEmoji?.trim();
    if (!name || !emoji) return null;
    return { category: name, categoryEmoji: emoji };
  }

  const option = LESSON_CATEGORY_OPTIONS.find(
    (entry) => entry.id === input.selectedCategoryId
  );
  if (!option || option.id === LESSON_CATEGORY_OTHER_ID) return null;
  return { category: option.label, categoryEmoji: option.emoji };
}

export function validateLessonCategorySelection(input: {
  selectedCategoryId: string | null;
  customCategoryName: string;
  customCategoryEmoji: string | null;
}): {
  categoryError: string | null;
  customNameError: string | null;
  customEmojiError: string | null;
} {
  if (!input.selectedCategoryId) {
    return {
      categoryError: 'Choose a category.',
      customNameError: null,
      customEmojiError: null,
    };
  }

  if (input.selectedCategoryId !== LESSON_CATEGORY_OTHER_ID) {
    return {
      categoryError: null,
      customNameError: null,
      customEmojiError: null,
    };
  }

  const name = input.customCategoryName.trim();
  let customNameError: string | null = null;
  if (!name) {
    customNameError = 'Enter a category name.';
  } else if (name.length > LESSON_CATEGORY_NAME_CHAR_LIMIT) {
    customNameError = `Category must be at most ${LESSON_CATEGORY_NAME_CHAR_LIMIT} characters.`;
  }

  const customEmojiError = input.customCategoryEmoji?.trim()
    ? null
    : 'Pick an emoji for your category.';

  return {
    categoryError: null,
    customNameError,
    customEmojiError,
  };
}

export function categorySelectionFromLesson(
  category: string,
  categoryEmoji: string
): {
  selectedCategoryId: string;
  customCategoryName: string;
  customCategoryEmoji: string | null;
} {
  const preset = findCategoryOptionByLabel(category);
  if (preset) {
    return {
      selectedCategoryId: preset.id,
      customCategoryName: '',
      customCategoryEmoji: null,
    };
  }

  return {
    selectedCategoryId: LESSON_CATEGORY_OTHER_ID,
    customCategoryName: category,
    customCategoryEmoji: categoryEmoji,
  };
}
