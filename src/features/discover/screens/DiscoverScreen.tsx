import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SlidePreview } from '@/components/lesson/SlidePreview';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { discoverFilters, discoverSortOptions } from '@/data/mock/lessons';
import { useDiscoverLessons } from '@/features/discover/hooks/useDiscoverLessons';
import { formatPriceDollars } from '@/mappers/lesson.mapper';

export function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { lessons, loading, error } = useDiscoverLessons();

  if (loading) {
    return <LoadingScreen message="Loading lessons…" />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center text-muted-foreground">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      <View className="bg-background/95 px-5 pb-4" style={{ paddingTop: insets.top + 8 }}>
        <Text className="mb-4 text-[26px] font-bold tracking-tight text-foreground">Discover</Text>

        <View className="mb-3 flex-row gap-2">
          <View className="flex-1 flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <Feather name="search" size={16} color={colors.mutedForeground} />
            <Text className="text-[15px] text-muted-foreground">Search any topic or teacher…</Text>
          </View>
          <Pressable className="h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-sm">
            <Feather name="sliders" size={17} color="#fff" />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-1">
          {discoverSortOptions.map((opt, i) => (
            <Pressable
              key={opt}
              className={`mr-2 rounded-full border px-3.5 py-1.5 ${i === 0 ? 'border-primary bg-secondary' : 'border-border bg-card'}`}>
              <Text
                className={`text-xs ${i === 0 ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                {opt}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4 px-5"
        contentContainerStyle={{ paddingRight: 20 }}>
        {discoverFilters.map((f, i) => (
          <Pressable
            key={f}
            className={`mr-2 rounded-full border px-4 py-2 ${i === 0 ? 'border-primary bg-primary' : 'border-border bg-card'}`}>
            <Text
              className={`text-[13px] font-medium ${i === 0 ? 'text-white' : 'text-foreground'}`}>
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View className="mb-3 flex-row items-center justify-between px-5">
        <Text className="text-sm text-muted-foreground">{lessons.length} lessons found</Text>
        <Text className="text-sm text-muted-foreground">within 2 miles</Text>
      </View>

      <View className="gap-3 px-5">
        {lessons.map((lesson) => (
          <Pressable
            key={lesson.id}
            onPress={() => router.push(`/lesson/${lesson.id}`)}
            className="flex-row overflow-hidden rounded-2xl border border-border bg-card p-3 active:opacity-95">
            <View className="mr-3 h-16 w-16 flex-shrink-0">
              <SlidePreview colors={lesson.slidePreviewColors} />
            </View>
            <View className="flex-1 justify-center">
              <Text className="text-[11px] text-muted-foreground">
                {lesson.categoryEmoji} {lesson.category} · {lesson.durationMinutes} min
              </Text>
              <Text className="text-sm font-semibold text-foreground" numberOfLines={2}>
                {lesson.title}
              </Text>
              <Text className="mt-0.5 text-xs text-muted-foreground">{lesson.teacherName}</Text>
              <View className="mt-2 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center gap-1">
                    <Feather name="clock" size={10} color={colors.mutedForeground} />
                    <Text className="text-[11px] text-muted-foreground">{lesson.scheduledAtLabel}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Feather name="map-pin" size={10} color={colors.mutedForeground} />
                    <Text className="text-[11px] text-muted-foreground">{lesson.distanceLabel}</Text>
                  </View>
                </View>
                <Text className="text-sm font-semibold text-primary">
                  {formatPriceDollars(lesson.priceCents)}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
