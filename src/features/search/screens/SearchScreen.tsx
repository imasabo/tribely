import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LessonCard } from '@/components/lesson/LessonCard';
import { SearchField } from '@/components/ui/SearchBar';
import { colors } from '@/constants/theme';
import { DiscoverFilterButton } from '@/features/discover/components/DiscoverFilterButton';
import { DiscoverListControls } from '@/features/discover/components/DiscoverListControls';
import { DiscoverNoResultsCard } from '@/features/discover/components/DiscoverNoResultsCard';
import {
  getDiscoverNoResultsHint,
  hasDiscoverListFilters,
} from '@/features/discover/lib/discoverEmptyState';
import { DiscoverCategoryChips } from '@/features/discover/components/DiscoverCategoryChips';
import {
  applyDiscoverCategoryFilter,
  applyDiscoverSheetFilters,
  sortDiscoverLessons,
} from '@/features/discover/lib/applyDiscoverFilters';
import { useDiscoverLocationFeatures } from '@/features/discover/hooks/useDiscoverLocationFeatures';
import { canFilterLessonsByDistance } from '@/features/discover/lib/discoverLocation';
import { useLessonSearch } from '@/features/search/hooks/useLessonSearch';
import { useDiscoverFilters } from '@/providers/DiscoverFiltersProvider';
import { useDiscoverLocationContext } from '@/providers/DiscoverLocationProvider';

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const { results, loading } = useLessonSearch(query);
  const { appliedSheetFilters, selectedSort, selectedCategory, resetAppliedSheetFilters } =
    useDiscoverFilters();
  const { mode: locationMode } = useDiscoverLocationContext();
  const {
    showLessonDistance,
    locationLabel,
    activeFilterCount,
    distanceFilteringEnabled,
    fallbackCity,
  } = useDiscoverLocationFeatures();

  const trimmedQuery = query.trim();
  const filterByDistance = canFilterLessonsByDistance(locationMode);

  const displayedResults = useMemo(() => {
    const filtered = applyDiscoverSheetFilters(
      applyDiscoverCategoryFilter(results, selectedCategory),
      appliedSheetFilters,
      { filterByDistance }
    );
    return sortDiscoverLessons(filtered, selectedSort);
  }, [results, appliedSheetFilters, selectedSort, selectedCategory, filterByDistance]);

  const noResultsContext = {
    locationMode,
    fallbackCity,
    distanceFilteringEnabled,
    selectedCategory,
    activeSheetFilterCount: activeFilterCount,
    searchQuery: trimmedQuery || undefined,
    searchResultCount: results.length,
  };
  const filteredEmptyHint = getDiscoverNoResultsHint(noResultsContext);
  const showClearAllFilters = hasDiscoverListFilters(noResultsContext);

  return (
    <>
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-3 flex-row items-center gap-2 px-5">
          <Pressable
            onPress={() => router.back()}
            className="h-9 w-9 items-center justify-center rounded-full bg-muted active:opacity-80">
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
          <DiscoverFilterButton />
        </View>

        <DiscoverListControls className="mb-2" />

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
          ) : displayedResults.length === 0 ? (
            <DiscoverNoResultsCard
              title="No lessons match your filters"
              hint={filteredEmptyHint}
              onClear={showClearAllFilters ? resetAppliedSheetFilters : undefined}
            />
          ) : (
            <View className="gap-3">
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="text-sm text-muted-foreground">
                  {displayedResults.length} lesson{displayedResults.length === 1 ? '' : 's'}
                  {displayedResults.length !== results.length
                    ? ` of ${results.length}`
                    : ''}
                </Text>
                <Text className="text-sm text-muted-foreground">{locationLabel}</Text>
              </View>
              {displayedResults.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  showDistance={showLessonDistance}
                  onPress={() => router.push(`/lesson/${lesson.id}`)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}
