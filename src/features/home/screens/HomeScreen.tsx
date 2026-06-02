import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { FriendActivityCard } from '@/components/lesson/FriendActivityCard';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { HomeTopBar } from '@/features/home/components/HomeTopBar';
import { useFriendActivity } from '@/features/home/hooks/useFriendActivity';
import { getFirstName, getInitials, getTimeGreeting } from '@/lib/userDisplay';
import { useAuth } from '@/providers/AuthProvider';

export function HomeScreen() {
  const { user } = useAuth();
  const { activities, loading, error } = useFriendActivity();

  const greeting = useMemo(
    () => getTimeGreeting(getFirstName(user?.displayName)),
    [user?.displayName]
  );
  const avatarInitials = useMemo(() => getInitials(user?.displayName, 'AK'), [user?.displayName]);

  const openLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  if (loading) {
    return <LoadingScreen message="Loading your feed…" />;
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
        title="Friends"
        avatarInitials={avatarInitials}
        onSearchPress={() => router.push('/search')}
        onAvatarPress={() => router.push('/(tabs)/profile')}
      />

      <View className="px-5">
        <SectionHeader title="Recently Completed" className="mb-3" />
        <View className="gap-4">
          {activities.map((activity) => (
            <FriendActivityCard
              key={activity.id}
              activity={activity}
              onPress={() => openLesson(activity.lesson.id)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
