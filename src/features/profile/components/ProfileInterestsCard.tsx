import { Text, View } from 'react-native';

interface ProfileInterestsCardProps {
  teachTitle: string;
  learnTitle: string;
  teachTopics: string[];
  learnTopics: string[];
  /** When true, show teach/learn blocks even if empty (own profile). */
  showEmptySections?: boolean;
  /** Optional section heading above the card, e.g. "Interests". */
  sectionTitle?: string;
}

function TopicsLine({ topics, showEmpty }: { topics: string[]; showEmpty: boolean }) {
  if (topics.length > 0) {
    return (
      <Text className="text-[15px] leading-6 text-foreground">{topics.join(' · ')}</Text>
    );
  }

  if (showEmpty) {
    return <Text className="text-[15px] text-muted-foreground">None yet</Text>;
  }

  return null;
}

function InterestBlock({
  title,
  topics,
  showWhenEmpty,
}: {
  title: string;
  topics: string[];
  showWhenEmpty: boolean;
}) {
  const line = <TopicsLine topics={topics} showEmpty={showWhenEmpty} />;
  if (line == null) return null;

  return (
    <View className="px-4 py-3.5">
      <Text className="mb-1.5 text-xs font-medium text-muted-foreground">{title}</Text>
      {line}
    </View>
  );
}

export function ProfileInterestsCard({
  teachTitle,
  learnTitle,
  teachTopics,
  learnTopics,
  showEmptySections = false,
  sectionTitle,
}: ProfileInterestsCardProps) {
  const showTeach = teachTopics.length > 0 || showEmptySections;
  const showLearn = learnTopics.length > 0 || showEmptySections;

  if (!showTeach && !showLearn) return null;

  return (
    <View>
      {sectionTitle ? (
        <Text className="mb-3 text-[15px] font-semibold text-foreground">{sectionTitle}</Text>
      ) : null}
      <View className="overflow-hidden rounded-2xl border border-border bg-card">
      {showTeach ? (
        <InterestBlock
          title={teachTitle}
          topics={teachTopics}
          showWhenEmpty={showEmptySections}
        />
      ) : null}
      {showTeach && showLearn ? <View className="mx-4 h-px bg-border" /> : null}
      {showLearn ? (
        <InterestBlock
          title={learnTitle}
          topics={learnTopics}
          showWhenEmpty={showEmptySections}
        />
      ) : null}
      </View>
    </View>
  );
}
