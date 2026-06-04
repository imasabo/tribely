import { colors } from '@/constants/theme';
import type { PublicUserProfile } from '@/data/mock/users';
import type { ProfileStatItem, ProfileViewModel } from '@/features/profile/types';

function defaultPublicStats(stats: PublicUserProfile['stats']): ProfileStatItem[] {
  return [
    {
      label: 'Rating',
      value: stats.rating.toFixed(1),
      icon: 'star',
      color: colors.accent,
      statKey: 'rating',
    },
    {
      label: 'Taught',
      value: String(stats.lessonsTaught),
      icon: 'book-open',
      color: colors.primary,
      statKey: 'taught',
    },
    {
      label: 'Students',
      value: String(stats.students),
      icon: 'users',
      color: '#7C3AED',
      statKey: 'students',
    },
    {
      label: 'Reviews',
      value: String(stats.reviews),
      icon: 'award',
      color: '#059669',
      statKey: 'reviews',
    },
  ];
}

export function publicProfileToViewModel(profile: PublicUserProfile): ProfileViewModel {
  const metaParts = [profile.city, profile.joinedAtLabel].filter(Boolean);

  return {
    username: profile.username,
    displayName: profile.displayName,
    metaLine: metaParts.join(' · '),
    bio: profile.bio,
    teachTopics: profile.teachTopics,
    learnTopics: profile.learnTopics,
    stats: defaultPublicStats(profile.stats),
  };
}

/** Phase 4: replace with useProfile() + Firestore */
export const MOCK_OWN_PROFILE_VIEW_MODEL: ProfileViewModel = {
  username: 'alexkim',
  displayName: 'Alex Kim',
  metaLine: 'San Francisco, CA · Joined March 2025',
  bio: 'ML engineer at a startup. I love making complex tech topics approachable.',
  teachTopics: ['Python', 'Data Science', 'ML Basics', 'SQL'],
  learnTopics: ['Guitar', 'Watercolor', 'Spanish', 'Bread Baking'],
  stats: [
    { label: 'Rating', value: '4.9', icon: 'star', color: colors.accent, statKey: 'rating' },
    { label: 'Taught', value: '12', icon: 'book-open', color: colors.primary, statKey: 'taught' },
    { label: 'Students', value: '34', icon: 'users', color: '#7C3AED', statKey: 'students' },
    { label: 'Reviews', value: '28', icon: 'award', color: '#059669', statKey: 'reviews' },
  ],
};

export const MOCK_OWN_PROFILE_ACTIVITY = [
  { title: 'Python for Data Science', subtitle: 'May 28, 2026 · Taught', rating: 5 },
  { title: 'Intro to Guitar Chords', subtitle: 'May 15, 2026 · Learned', rating: 5 },
];
