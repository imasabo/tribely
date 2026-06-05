import type { PublicUserProfile } from '@/data/mock/users';
import type { ProfileStatItem, ProfileViewModel } from '@/features/profile/types';
import { isValidUsername, usernameFromDisplayName } from '@/lib/username';
import {
  EMPTY_USER_PROFILE_STATS,
  type UserProfile,
  type UserProfileStats,
} from '@/types/userProfile';

export function buildProfileMetaLine(city?: string, joinedAtLabel?: string): string {
  return [city, joinedAtLabel].filter(Boolean).join(' · ');
}

export function statsToProfileStatItems(stats: UserProfileStats): ProfileStatItem[] {
  return [
    {
      label: 'Rating',
      value: stats.rating > 0 ? stats.rating.toFixed(1) : '—',
      icon: 'star',
      statKey: 'rating',
    },
    {
      label: 'Taught',
      value: String(stats.lessonsTaught),
      icon: 'book-open',
      statKey: 'taught',
    },
    {
      label: 'Students',
      value: String(stats.students),
      icon: 'users',
      statKey: 'students',
    },
    {
      label: 'Reviews',
      value: String(stats.reviews),
      icon: 'award',
      statKey: 'reviews',
    },
  ];
}

function resolveUsername(profile: UserProfile): string {
  if (profile.username && isValidUsername(profile.username)) {
    return profile.username;
  }
  return usernameFromDisplayName(profile.displayName);
}

export function userProfileToViewModel(profile: UserProfile): ProfileViewModel {
  return {
    username: resolveUsername(profile),
    displayName: profile.displayName,
    metaLine: buildProfileMetaLine(profile.city, profile.joinedAtLabel),
    bio: profile.bio || undefined,
    teachTopics: profile.teachTopics ?? [],
    learnTopics: profile.learnTopics ?? [],
    stats: statsToProfileStatItems(profile.stats ?? EMPTY_USER_PROFILE_STATS),
  };
}

function defaultPublicStats(stats: PublicUserProfile['stats']): ProfileStatItem[] {
  return statsToProfileStatItems(stats);
}

export function publicProfileToViewModel(profile: PublicUserProfile): ProfileViewModel {
  return {
    username: profile.username,
    displayName: profile.displayName,
    metaLine: buildProfileMetaLine(profile.city, profile.joinedAtLabel),
    bio: profile.bio,
    teachTopics: profile.teachTopics,
    learnTopics: profile.learnTopics,
    stats: defaultPublicStats(profile.stats),
  };
}

export function emptyOwnProfileViewModel(displayName = ''): ProfileViewModel {
  return {
    username: '',
    displayName,
    metaLine: '',
    bio: undefined,
    teachTopics: [],
    learnTopics: [],
    stats: statsToProfileStatItems(EMPTY_USER_PROFILE_STATS),
  };
}
