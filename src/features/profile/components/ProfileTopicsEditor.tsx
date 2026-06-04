import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  GROWABLE_FIELD_DEFAULT_HEIGHT,
  GrowableTextField,
} from '@/components/ui/GrowableTextField';
import { colors } from '@/constants/theme';
import { charLimitOutlineStyle } from '@/features/profile/lib/profileFieldStyles';
import { PROFILE_TOPIC_CHAR_LIMIT } from '@/features/profile/lib/profileLimits';
import type { ProfileTopicVariant } from '@/features/profile/types';

const TOPIC_INPUT_MAX_HEIGHT = 104;

interface ProfileTopicsEditorProps {
  title: string;
  topics: string[];
  variant: ProfileTopicVariant;
  onChange: (topics: string[]) => void;
}

function normalizeTopic(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function ProfileTopicsEditor({
  title,
  topics,
  variant,
  onChange,
}: ProfileTopicsEditorProps) {
  const [draft, setDraft] = useState('');
  const isTeach = variant === 'teach';
  const chipClass = isTeach ? 'bg-secondary' : 'bg-muted';
  const labelClass = isTeach ? 'text-primary' : 'text-foreground';

  const addTopic = () => {
    const next = normalizeTopic(draft);
    if (!next) return;

    const exists = topics.some((t) => t.toLowerCase() === next.toLowerCase());
    if (exists) {
      setDraft('');
      return;
    }

    onChange([...topics, next]);
    setDraft('');
  };

  const removeTopic = (topic: string) => {
    onChange(topics.filter((t) => t !== topic));
  };

  return (
    <View>
      <Text className="mb-3 text-[17px] font-semibold text-foreground">{title}</Text>
      {topics.length > 0 ? (
        <View className="mb-3 flex-row flex-wrap gap-2">
          {topics.map((topic) => (
            <View
              key={topic}
              className={`flex-row items-center gap-1 rounded-full py-1.5 pl-3.5 pr-2 ${chipClass}`}>
              <Text className={`text-[13px] font-medium ${labelClass}`}>{topic}</Text>
              <Pressable
                onPress={() => removeTopic(topic)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${topic}`}
                hitSlop={8}
                className="h-5 w-5 items-center justify-center rounded-full active:opacity-70">
                <Feather
                  name="x"
                  size={14}
                  color={isTeach ? colors.primary : colors.mutedForeground}
                />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
      <View className="flex-row items-start gap-2">
        <GrowableTextField
          value={draft}
          onChangeText={setDraft}
          placeholder="Add a topic"
          maxLength={PROFILE_TOPIC_CHAR_LIMIT}
          maxHeight={TOPIC_INPUT_MAX_HEIGHT}
          style={charLimitOutlineStyle(draft.length, PROFILE_TOPIC_CHAR_LIMIT)}
        />
        <Pressable
          onPress={addTopic}
          disabled={!normalizeTopic(draft)}
          accessibilityRole="button"
          accessibilityLabel="Add topic"
          style={{ height: GROWABLE_FIELD_DEFAULT_HEIGHT }}
          className="shrink-0 items-center justify-center rounded-xl bg-primary px-4 active:opacity-80 disabled:opacity-40">
          <Text className="text-sm font-semibold text-primary-foreground">Add</Text>
        </Pressable>
      </View>
    </View>
  );
}
