import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LessonCard } from '@/components/lesson/LessonCard';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { LocationLink } from '@/components/ui/LocationLink';
import { ChooseCitySheet } from '@/features/discover/components/ChooseCitySheet';
import { useDiscoverLocationFeatures } from '@/features/discover/hooks/useDiscoverLocationFeatures';
import { DiscoverFilterButton } from '@/features/discover/components/DiscoverFilterButton';
import { DiscoverListControls } from '@/features/discover/components/DiscoverListControls';
import { DiscoverNoResultsCard } from '@/features/discover/components/DiscoverNoResultsCard';
import {
  getDiscoverNoResultsHint,
  hasDiscoverListFilters,
} from '@/features/discover/lib/discoverEmptyState';
import { useDiscoverLessons } from '@/features/discover/hooks/useDiscoverLessons';
import { useFilteredLessons } from '@/features/discover/hooks/useFilteredLessons';
import { colors } from '@/constants/theme';
import { useDiscoverFilters } from '@/providers/DiscoverFiltersProvider';
import { useDiscoverLocationContext } from '@/providers/DiscoverLocationProvider';

export function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { lessons: allLessons, loading, refreshing, error, refetch, retry } =
    useDiscoverLessons();
  const { resetAppliedSheetFilters, selectedCategory } = useDiscoverFilters();
  const {
    needsCityPicker,
    ensureLocation,
    selectCity,
    requestDeviceLocation,
    openCityPicker,
    closeCityPicker,
  } = useDiscoverLocationContext();

  useFocusEffect(
    useCallback(() => {
      void ensureLocation();
    }, [ensureLocation])
  );

  const displayedLessons = useFilteredLessons(allLessons);
  const {
    mode: locationMode,
    showLessonDistance,
    locationLabel,
    locationTooltip,
    activeFilterCount,
    fallbackCity,
  } = useDiscoverLocationFeatures();

  const noResultsContext = {
    locationMode,
    fallbackCity,
    distanceFilteringEnabled: showLessonDistance,
    selectedCategory,
    activeSheetFilterCount: activeFilterCount,
  };
  const noResultsHint = getDiscoverNoResultsHint(noResultsContext);
  const showClearAllFilters = hasDiscoverListFilters(noResultsContext);

  const openLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  const handleRefresh = useCallback(() => {
    void Promise.all([refetch(), ensureLocation()]);
  }, [ensureLocation, refetch]);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={colors.primary}
      colors={[colors.primary]}
    />
  );

  if (loading && allLessons.length === 0) {
    return <LoadingScreen message="Loading lessons…" />;
  }

  if (error && allLessons.length === 0) {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ flexGrow: 1 }}
        alwaysBounceVertical
        refreshControl={refreshControl}>
        <CenteredMessage message={error} actionLabel="Try again" onAction={retry} />
      </ScrollView>
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical
        refreshControl={refreshControl}>
        {error ? (
          <View className="mx-5 mb-3 flex-row items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
            <Text className="flex-1 text-sm text-muted-foreground">{error}</Text>
            <Pressable onPress={handleRefresh} className="ml-3 active:opacity-80">
              <Text className="text-sm font-semibold text-primary">Retry</Text>
            </Pressable>
          </View>
        ) : null}
        <View className="bg-background/95 px-5 pb-4" style={{ paddingTop: insets.top + 8 }}>
          <Text className="mb-4 text-[26px] font-bold tracking-tight text-foreground">
            Discover
          </Text>

          <View className="mb-3 flex-row gap-2">
            <Pressable
              onPress={() => router.push('/search')}
              className="flex-1 flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <Feather name="search" size={16} color={colors.mutedForeground} />
              <Text className="text-[15px] text-muted-foreground">
                Search any topic or teacher…
              </Text>
            </Pressable>
            <DiscoverFilterButton />
          </View>

        </View>

        <DiscoverListControls />

        <View className="mb-3 mt-1 flex-row items-center justify-between px-5">
          <Text className="text-sm text-muted-foreground">
            {displayedLessons.length} lesson{displayedLessons.length === 1 ? '' : 's'} found
          </Text>
          <InfoTooltip
            message={locationTooltip}
            actionLabel={locationMode === 'fallback' ? 'Change city' : undefined}
            onAction={locationMode === 'fallback' ? openCityPicker : undefined}>
            <LocationLink
              variant="sm"
              label={locationLabel}
              onPress={locationMode === 'fallback' ? openCityPicker : undefined}
            />
          </InfoTooltip>
        </View>

        <View className="gap-3 px-5">
          {displayedLessons.length === 0 ? (
            <DiscoverNoResultsCard
              hint={noResultsHint}
              onClear={
                locationMode === 'needs_city'
                  ? openCityPicker
                  : showClearAllFilters
                    ? resetAppliedSheetFilters
                    : undefined
              }
              clearLabel={locationMode === 'needs_city' ? 'Choose a city' : 'Clear all filters'}
            />
          ) : (
            displayedLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                showDistance={showLessonDistance}
                onPress={() => openLesson(lesson.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <ChooseCitySheet
        visible={needsCityPicker}
        onSelectCity={(city) => void selectCity(city)}
        onRequestLocation={() => void requestDeviceLocation()}
        onClose={closeCityPicker}
      />
    </>
  );
}
