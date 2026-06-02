import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LessonCard } from '@/components/lesson/LessonCard';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Chip } from '@/components/ui/Chip';
import { homeCategories } from '@/data/mock/lessons';
import { colors } from '@/constants/theme';
import { useNearbyLessons } from '@/features/home/hooks/useNearbyLessons';

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { featured, nearby, loading, error } = useNearbyLessons();

  if (loading) {
    return <LoadingScreen message="Finding lessons near you…" />;
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
      <View
        className="z-10 bg-background/95 px-5 pb-4"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-muted-foreground">Good afternoon, Alex 👋</Text>
            <Text className="text-[22px] font-bold tracking-tight text-foreground">
              Nearby Lessons
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable className="relative h-9 w-9 items-center justify-center rounded-full bg-muted">
              <Feather name="bell" size={18} color={colors.foreground} />
              <View className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
            </Pressable>
            <View className="h-9 w-9 items-center justify-center rounded-full bg-primary">
              <Text className="text-[13px] font-semibold text-white">AK</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <Text className="text-[15px] text-muted-foreground">Search lessons or teachers…</Text>
        </View>
      </View>

      <Pressable className="flex-row items-center gap-1.5 px-5 py-3">
        <Feather name="map-pin" size={13} color={colors.primary} />
        <Text className="text-[13px] font-medium text-primary">San Francisco, CA</Text>
        <Feather name="chevron-right" size={13} color={colors.primary} />
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-5 px-5"
        contentContainerStyle={{ paddingRight: 20 }}>
        {homeCategories.map((cat, i) => (
          <Chip key={cat.label} label={cat.label} emoji={cat.emoji} selected={i === 0} />
        ))}
      </ScrollView>

      <View className="mb-6 px-5">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[17px] font-semibold text-foreground">Featured Today</Text>
          <Text className="text-sm text-primary">See all</Text>
        </View>
        {featured.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            variant="featured"
            onPress={() => router.push(`/lesson/${lesson.id}`)}
          />
        ))}
      </View>

      <View className="px-5">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[17px] font-semibold text-foreground">Lessons Near You</Text>
          <Text className="text-sm text-primary">See all</Text>
        </View>
        <View className="gap-3">
          {nearby.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onPress={() => router.push(`/lesson/${lesson.id}`)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
