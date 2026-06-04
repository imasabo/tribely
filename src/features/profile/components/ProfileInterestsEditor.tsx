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

const TOPIC_INPUT_MAX_HEIGHT = 104;

interface ProfileInterestsEditorProps {
  teachTitle?: string;
  learnTitle?: string;
  teachTopics: string[];
  learnTopics: string[];
  onTeachTopicsChange: (topics: string[]) => void;
  onLearnTopicsChange: (topics: string[]) => void;
  sectionTitle?: string;
}

function normalizeTopic(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

interface TopicsEditBlockProps {
  title: string;
  topics: string[];
  onChange: (topics: string[]) => void;
}

function TopicsEditBlock({ title, topics, onChange }: TopicsEditBlockProps) {
  const [draft, setDraft] = useState('');

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

  const canAdd = normalizeTopic(draft).length > 0;

  return (
    <View className="px-4 py-3.5">
      <Text className="mb-2 text-xs font-medium text-muted-foreground">{title}</Text>

      {topics.length > 0 ? (
        <View className="mb-3 gap-2">
          {topics.map((topic) => (
            <View key={topic} className="flex-row items-center justify-between gap-3">
              <Text className="flex-1 text-[15px] leading-6 text-foreground">{topic}</Text>
              <Pressable
                onPress={() => removeTopic(topic)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${topic}`}
                hitSlop={8}
                className="h-7 w-7 items-center justify-center rounded-full active:opacity-70">
                <Feather name="x" size={16} color={colors.mutedForeground} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text className="mb-3 text-[15px] text-muted-foreground">None yet</Text>
      )}

      <View className="flex-row items-start gap-2">
        <GrowableTextField
          value={draft}
          onChangeText={setDraft}
          placeholder="Add a topic"
          maxLength={PROFILE_TOPIC_CHAR_LIMIT}
          maxHeight={TOPIC_INPUT_MAX_HEIGHT}
          onSubmitEditing={addTopic}
          returnKeyType="done"
          style={charLimitOutlineStyle(draft.length, PROFILE_TOPIC_CHAR_LIMIT)}
        />
        <Pressable
          onPress={addTopic}
          disabled={!canAdd}
          accessibilityRole="button"
          accessibilityLabel="Add topic"
          style={{ height: GROWABLE_FIELD_DEFAULT_HEIGHT }}
          className="shrink-0 items-center justify-center rounded-xl border border-border bg-card px-3 active:opacity-80 disabled:opacity-40">
          <Feather
            name="plus"
            size={20}
            color={canAdd ? colors.primary : colors.mutedForeground}
          />
        </Pressable>
      </View>
    </View>
  );
}

export function ProfileInterestsEditor({
  teachTitle = 'I Teach',
  learnTitle = 'I Want to Learn',
  teachTopics,
  learnTopics,
  onTeachTopicsChange,
  onLearnTopicsChange,
  sectionTitle = 'Interests',
}: ProfileInterestsEditorProps) {
  return (
    <View>
      <Text className="mb-3 text-[15px] font-semibold text-foreground">{sectionTitle}</Text>
      <View className="overflow-hidden rounded-2xl border border-border bg-card">
        <TopicsEditBlock
          title={teachTitle}
          topics={teachTopics}
          onChange={onTeachTopicsChange}
        />
        <View className="mx-4 h-px bg-border" />
        <TopicsEditBlock
          title={learnTitle}
          topics={learnTopics}
          onChange={onLearnTopicsChange}
        />
      </View>
    </View>
  );
}
