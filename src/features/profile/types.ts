import type { Feather } from '@expo/vector-icons';

export type ProfileStatIcon = 'star' | 'book-open' | 'users' | 'award';

export interface ProfileStatItem {
  label: string;
  value: string;
  icon: ProfileStatIcon;
  color?: string;
}

export interface ProfileActivityItem {
  title: string;
  subtitle: string;
  rating?: number;
}

/** Display model for the shared profile layout (self or another user). */
export interface ProfileViewModel {
  displayName: string;
  /** e.g. "San Francisco, CA · Joined March 2025" */
  metaLine: string;
  bio?: string;
  teachTopics: string[];
  learnTopics: string[];
  stats: ProfileStatItem[];
}

export type ProfileTopicVariant = 'teach' | 'learn';
