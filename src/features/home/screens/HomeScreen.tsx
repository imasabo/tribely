import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { FriendActivityCard } from '@/components/lesson/FriendActivityCard';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { HomeTopBar } from '@/features/home/components/HomeTopBar';
import { useFriendActivity } from '@/features/home/hooks/useFriendActivity';
import { getInitials } from '@/lib/userDisplay';
import { useAuth } from '@/providers/AuthProvider';

export function HomeScreen() {
  const { user } = useAuth();
  const { activities, loading, error } = useFriendActivity();

  const avatarInitials = useMemo(() => getInitials(user?.displayName, 'AK'), [user?.displayName]);

  const openLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  const openProfile = (friendId: string) => {
    router.push(`/user/${friendId}`);
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
        avatarInitials={avatarInitials}
        onNotificationsPress={() => router.push('/notifications')}
        onAvatarPress={() => router.push('/(tabs)/profile')}
      />

      <View className="gap-4 px-5">
        {activities.map((activity) => (
          <FriendActivityCard
            key={activity.id}
            activity={activity}
            onLessonPress={() => openLesson(activity.lesson.id)}
            onProfilePress={() => openProfile(activity.friendId)}
            onCommentPress={() => router.push(`/activity/${activity.id}`)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
