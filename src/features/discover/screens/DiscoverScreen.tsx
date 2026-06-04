import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoogleSlidesCardPreview } from '@/components/lesson/GoogleSlidesCardPreview';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { LocationLink } from '@/components/ui/LocationLink';
import { ChooseCitySheet } from '@/features/discover/components/ChooseCitySheet';
import { useDiscoverLocationFeatures } from '@/features/discover/hooks/useDiscoverLocationFeatures';
import { DiscoverFilterButton } from '@/features/discover/components/DiscoverFilterButton';
import { DiscoverSortChips } from '@/features/discover/components/DiscoverSortChips';
import { useDiscoverLessons } from '@/features/discover/hooks/useDiscoverLessons';
import { useFilteredLessons } from '@/features/discover/hooks/useFilteredLessons';
import { colors } from '@/constants/theme';
import { discoverFilters } from '@/data/mock/lessons';
import { useDiscoverFilters } from '@/providers/DiscoverFiltersProvider';
import { useDiscoverLocationContext } from '@/providers/DiscoverLocationProvider';

export function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { lessons: allLessons, loading, refreshing, error, refetch, retry } =
    useDiscoverLessons();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { resetAppliedSheetFilters } = useDiscoverFilters();
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

  const displayedLessons = useFilteredLessons(allLessons, { category: selectedCategory });
  const {
    mode: locationMode,
    showLessonDistance,
    locationLabel,
    locationTooltip,
  } = useDiscoverLocationFeatures();

  const openLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  if (loading && allLessons.length === 0) {
    return <LoadingScreen message="Loading lessons…" />;
  }

  if (error && allLessons.length === 0) {
    return (
      <CenteredMessage message={error} actionLabel="Try again" onAction={retry} />
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }>
        {error ? (
          <View className="mx-5 mb-3 flex-row items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
            <Text className="flex-1 text-sm text-muted-foreground">{error}</Text>
            <Pressable onPress={refetch} className="ml-3 active:opacity-80">
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

          <DiscoverSortChips />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4 px-5"
          contentContainerStyle={{ paddingRight: 20 }}>
          {discoverFilters.map((f) => (
            <Pressable
              key={f}
              onPress={() => setSelectedCategory(f)}
              className={`mr-2 rounded-full border px-4 py-2 ${
                selectedCategory === f
                  ? 'border-primary bg-primary'
                  : 'border-border bg-card'
              }`}>
              <Text
                className={`text-[13px] font-medium ${
                  selectedCategory === f ? 'text-white' : 'text-foreground'
                }`}>
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="mb-3 flex-row items-center justify-between px-5">
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
            <View className="items-center rounded-2xl border border-dashed border-border bg-card px-6 py-10">
              <Feather name="sliders" size={28} color={colors.mutedForeground} />
              <Text className="mt-3 text-center text-base font-semibold text-foreground">
                No lessons match
              </Text>
              <Text className="mt-1 text-center text-sm text-muted-foreground">
                Try adjusting filters or choosing a different category.
              </Text>
              <Pressable
                onPress={() => {
                  resetAppliedSheetFilters();
                  setSelectedCategory('All');
                }}
                className="mt-4 active:opacity-80">
                <Text className="text-sm font-semibold text-primary">Clear filters</Text>
              </Pressable>
            </View>
          ) : (
            displayedLessons.map((lesson) => (
              <Pressable
                key={lesson.id}
                onPress={() => openLesson(lesson.id)}
                className="flex-row overflow-hidden rounded-2xl border border-border bg-card p-3 active:opacity-95">
                <View className="mr-3 h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                  <GoogleSlidesCardPreview
                    variant="compact"
                    colors={lesson.slidePreviewColors}
                  />
                </View>
                <View className="flex-1 justify-center">
                  <Text className="text-[11px] text-muted-foreground">
                    {lesson.categoryEmoji} {lesson.category} · {lesson.durationMinutes} min
                  </Text>
                  <Text className="text-sm font-semibold text-foreground" numberOfLines={2}>
                    {lesson.title}
                  </Text>
                  <Text className="mt-0.5 text-xs text-muted-foreground">{lesson.teacherName}</Text>
                  <View className="mt-2 flex-row items-center gap-2">
                    <View className="flex-row items-center gap-1">
                      <Feather name="clock" size={10} color={colors.mutedForeground} />
                      <Text className="text-[11px] text-muted-foreground">
                        {lesson.scheduledAtLabel}
                      </Text>
                    </View>
                    {showLessonDistance ? (
                      <View className="flex-row items-center gap-1">
                        <Feather name="map-pin" size={10} color={colors.mutedForeground} />
                        <Text className="text-[11px] text-muted-foreground">
                          {lesson.distanceLabel}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Pressable>
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
