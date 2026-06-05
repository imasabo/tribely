import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { FriendActivityCard } from '@/components/lesson/FriendActivityCard';
import { FriendActivityCardSkeletonList } from '@/components/lesson/FriendActivityCardSkeleton';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import { HomeTopBar } from '@/features/home/components/HomeTopBar';
import { useFriendActivity } from '@/features/home/hooks/useFriendActivity';
import { getInitials } from '@/lib/userDisplay';
import { useAuth } from '@/providers/AuthProvider';

const ACTIVITY_SKELETON_COUNT = 4;

export function HomeScreen() {
  const { user } = useAuth();
  const { activities, loading, error, refetch, retry } = useFriendActivity();

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch])
  );

  const avatarInitials = useMemo(() => getInitials(user?.displayName, 'AK'), [user?.displayName]);

  const isFeedLoading = loading && activities.length === 0;

  const openLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  const openProfile = (friendId: string) => {
    router.push(`/user/${friendId}`);
  };

  return (
    <View className="flex-1 bg-background">
      <HomeTopBar
        avatarInitials={avatarInitials}
        onNotificationsPress={() => router.push('/notifications')}
        onAvatarPress={() => router.push('/(tabs)/profile')}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}>
        <View className="gap-4 px-5">
          {isFeedLoading ? (
            <FriendActivityCardSkeletonList count={ACTIVITY_SKELETON_COUNT} />
          ) : error && activities.length === 0 ? (
            <CenteredMessage message={error} actionLabel="Try again" onAction={retry} />
          ) : (
            activities.map((activity) => (
              <FriendActivityCard
                key={activity.id}
                activity={activity}
                onLessonPress={() => openLesson(activity.lesson.id)}
                onProfilePress={() => openProfile(activity.friendId)}
                onCommentPress={() => router.push(`/activity/${activity.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
