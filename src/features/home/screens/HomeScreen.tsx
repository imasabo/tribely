import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';

import { LessonSection } from '@/components/lesson/LessonSection';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { HorizontalChipList } from '@/components/ui/HorizontalChipList';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { LocationLink } from '@/components/ui/LocationLink';
import { homeCategories } from '@/data/mock/lessons';
import { HomeTopBar } from '@/features/home/components/HomeTopBar';
import { useNearbyLessons } from '@/features/home/hooks/useNearbyLessons';
import { getFirstName, getInitials, getTimeGreeting } from '@/lib/userDisplay';
import { useAuth } from '@/providers/AuthProvider';

export function HomeScreen() {
  const { user } = useAuth();
  const { featured, nearby, loading, error } = useNearbyLessons();
  const [selectedCategoryId, setSelectedCategoryId] = useState(homeCategories[0]?.label ?? '');

  const greeting = useMemo(
    () => getTimeGreeting(getFirstName(user?.displayName)),
    [user?.displayName]
  );
  const avatarInitials = useMemo(() => getInitials(user?.displayName, 'AK'), [user?.displayName]);

  const categoryItems = useMemo(
    () =>
      homeCategories.map((cat) => ({
        id: cat.label,
        label: cat.label,
        emoji: cat.emoji,
      })),
    []
  );

  const openLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  if (loading) {
    return <LoadingScreen message="Finding lessons near you…" />;
  }

  if (error) {
    return <CenteredMessage message={error} />;
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      <HomeTopBar
        greeting={greeting}
        title="Nearby Lessons"
        avatarInitials={avatarInitials}
        onSearchPress={() => router.push('/search')}
        onAvatarPress={() => router.push('/(tabs)/profile')}
      />

      <LocationLink label="San Francisco, CA" className="px-5 py-3" />

      <HorizontalChipList
        items={categoryItems}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      <LessonSection
        title="Featured Today"
        lessons={featured}
        variant="featured"
        onLessonPress={openLesson}
        className="mb-6 px-5"
      />

      <LessonSection
        title="Lessons Near You"
        lessons={nearby}
        onLessonPress={openLesson}
        className="px-5"
      />
    </ScrollView>
  );
}
