import { useLocalSearchParams } from 'expo-router';

import { parseProfileReviewFilter } from '@/features/profile/lib/profileReviewSummary';
import {
  ProfileStatDetailScreen,
  type ProfileReviewsScreenSource,
} from '@/features/profile/screens/ProfileStatDetailScreen';

function parseReviewsSource(
  value: string | string[] | undefined
): ProfileReviewsScreenSource {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'rating' ? 'rating' : 'reviews';
}

export default function ProfileReviewsRoute() {
  const { id, filter, source } = useLocalSearchParams<{
    id: string;
    filter?: string;
    source?: string;
  }>();
  const userId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

  if (!userId) return null;

  return (
    <ProfileStatDetailScreen
      userId={userId}
      statKey="reviews"
      initialReviewFilter={parseProfileReviewFilter(filter)}
      reviewsSource={parseReviewsSource(source)}
    />
  );
}
