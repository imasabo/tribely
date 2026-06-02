import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LessonCard } from '@/components/lesson/LessonCard';
import { SearchField } from '@/components/ui/SearchBar';
import { colors } from '@/constants/theme';
import { useLessonSearch } from '@/features/search/hooks/useLessonSearch';

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const { results, loading } = useLessonSearch(query);
  const trimmedQuery = query.trim();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top + 8 }}>
      <View className="mb-4 flex-row items-center gap-3 px-5">
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-muted">
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <SearchField
          className="flex-1"
          containerClassName="flex-1"
          placeholder="Search lessons or teachers…"
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {!trimmedQuery ? (
          <Text className="text-center text-[15px] text-muted-foreground">
            Search by lesson title, teacher, category, or location
          </Text>
        ) : loading ? (
          <View className="mt-8 items-center">
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : results.length === 0 ? (
          <Text className="text-center text-[15px] text-muted-foreground">
            No lessons found for &ldquo;{trimmedQuery}&rdquo;
          </Text>
        ) : (
          <View className="gap-3">
            <Text className="mb-1 text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? 'lesson' : 'lessons'} found
            </Text>
            {results.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onPress={() => router.push(`/lesson/${lesson.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
