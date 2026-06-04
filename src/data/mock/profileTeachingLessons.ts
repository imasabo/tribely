import { MOCK_GOOGLE_SLIDES_URL } from '@/lib/googleSlides';
import type { Lesson } from '@/types/domain';

import { discoverLessons, homeLessons } from '@/data/mock/lessons';

function teachingLesson(
  partial: Omit<Lesson, 'googleSlidesUrl' | 'distanceLabel' | 'reviewCount' | 'rating'> & {
    googleSlidesUrl?: string;
    distanceLabel?: string;
    reviewCount?: number;
    rating?: number;
  }
): Lesson {
  return {
    googleSlidesUrl: partial.googleSlidesUrl ?? MOCK_GOOGLE_SLIDES_URL,
    distanceLabel: partial.distanceLabel ?? '0.5 mi',
    reviewCount: partial.reviewCount ?? 12,
    rating: partial.rating ?? 4.9,
    scheduledAtLabel: partial.scheduledAtLabel,
    ...partial,
  };
}

/** Lessons referenced from profile “taught” stats (not all appear on Discover). */
export const profileTeachingLessons: Lesson[] = [
  teachingLesson({
    id: 'alex-l1',
    teacherId: 'dev-user-alex',
    teacherName: 'Alex Kim',
    teacherAvatar: 'AK',
    title: 'Python for Data Science',
    category: 'Programming',
    categoryEmoji: '🐍',
    durationMinutes: 60,
    scheduledAtLabel: 'May 28, 2026 · 2:30 PM',
    locationName: 'Blue Bottle Coffee, SoMa',
    reviewCount: 34,
    rating: 4.9,
  }),
  teachingLesson({
    id: 'alex-l2',
    teacherId: 'dev-user-alex',
    teacherName: 'Alex Kim',
    teacherAvatar: 'AK',
    title: 'ML Basics Workshop',
    category: 'Tech',
    categoryEmoji: '🤖',
    durationMinutes: 60,
    scheduledAtLabel: 'May 12, 2026 · 6:00 PM',
    locationName: 'WeWork, FiDi',
    reviewCount: 14,
    rating: 5.0,
  }),
  teachingLesson({
    id: 'alex-l3',
    teacherId: 'dev-user-alex',
    teacherName: 'Alex Kim',
    teacherAvatar: 'AK',
    title: 'SQL for Analysts',
    category: 'Programming',
    categoryEmoji: '📊',
    durationMinutes: 45,
    scheduledAtLabel: 'Apr 30, 2026 · 5:00 PM',
    locationName: 'SF Public Library, Mission',
    reviewCount: 12,
    rating: 4.8,
  }),
  teachingLesson({
    id: 'alex-l4',
    teacherId: 'dev-user-alex',
    teacherName: 'Alex Kim',
    teacherAvatar: 'AK',
    title: 'Pandas & Visualization Crash Course',
    category: 'Programming',
    categoryEmoji: '📈',
    durationMinutes: 60,
    scheduledAtLabel: 'Apr 12, 2026 · 10:00 AM',
    locationName: 'Community Space, Hayes Valley',
    reviewCount: 9,
    rating: 4.9,
  }),
  /** Mock: taught once, then a new session was scheduled with updated details (see public lesson page). */
  teachingLesson({
    id: 'alex-l5',
    teacherId: 'dev-user-alex',
    teacherName: 'Alex Kim',
    teacherAvatar: 'AK',
    title: 'Intro to Feature Engineering',
    category: 'Tech',
    categoryEmoji: '⚙️',
    durationMinutes: 45,
    scheduledAtLabel: 'Tomorrow, 2:00 PM',
    locationName: 'WeWork, SoMa',
    description:
      'Hands-on feature engineering for tabular ML — refreshed slides and a new SoMa location for the next session.',
    reviewCount: 8,
    rating: 5.0,
    maxLearners: 8,
    enrolledCount: 3,
    sessions: [
      { id: 'alex-l5-s1', scheduledAtLabel: 'Mar 22, 2026 · 3:00 PM' },
      { id: 'alex-l5-s2', scheduledAtLabel: 'Tomorrow, 2:00 PM' },
    ],
  }),
  teachingLesson({
    id: 'riley-l1',
    teacherId: 'friend-riley',
    teacherName: 'Riley Chen',
    teacherAvatar: 'RC',
    title: 'Sourdough Starter 101',
    category: 'Cooking',
    categoryEmoji: '🍞',
    durationMinutes: 60,
    scheduledAtLabel: 'Jun 1, 2026 · 11:00 AM',
    locationName: 'Mission Kitchen Studio',
    reviewCount: 47,
    rating: 5.0,
  }),
  teachingLesson({
    id: 'riley-l2',
    teacherId: 'friend-riley',
    teacherName: 'Riley Chen',
    teacherAvatar: 'RC',
    title: 'Weekend Pastry Basics',
    category: 'Cooking',
    categoryEmoji: '🥐',
    durationMinutes: 60,
    scheduledAtLabel: 'May 20, 2026 · 9:00 AM',
    locationName: 'Mission Kitchen Studio',
    reviewCount: 32,
    rating: 5.0,
  }),
  teachingLesson({
    id: 'riley-l3',
    teacherId: 'friend-riley',
    teacherName: 'Riley Chen',
    teacherAvatar: 'RC',
    title: 'Croissant Lamination Lab',
    category: 'Cooking',
    categoryEmoji: '🥐',
    durationMinutes: 60,
    scheduledAtLabel: 'May 5, 2026 · 2:00 PM',
    locationName: 'Mission Kitchen Studio',
    reviewCount: 28,
    rating: 5.0,
  }),
  teachingLesson({
    id: 'riley-l4',
    teacherId: 'friend-riley',
    teacherName: 'Riley Chen',
    teacherAvatar: 'RC',
    title: 'Seasonal Fruit Tarts',
    category: 'Cooking',
    categoryEmoji: '🍓',
    durationMinutes: 45,
    scheduledAtLabel: 'Apr 14, 2026 · 10:30 AM',
    locationName: 'Mission Kitchen Studio',
    reviewCount: 22,
    rating: 4.9,
  }),
  teachingLesson({
    id: 'marcus-l1',
    teacherId: 'friend-marcus',
    teacherName: 'Marcus Lee',
    teacherAvatar: 'ML',
    title: 'Figma for Product Teams',
    category: 'Design',
    categoryEmoji: '🎨',
    durationMinutes: 60,
    scheduledAtLabel: 'May 18, 2026 · 4:00 PM',
    locationName: 'WeWork, SoMa',
    reviewCount: 18,
    rating: 4.8,
  }),
  teachingLesson({
    id: 'marcus-l2',
    teacherId: 'friend-marcus',
    teacherName: 'Marcus Lee',
    teacherAvatar: 'ML',
    title: 'UI Critique Workshop',
    category: 'Design',
    categoryEmoji: '✏️',
    durationMinutes: 45,
    scheduledAtLabel: 'May 2, 2026 · 6:30 PM',
    locationName: 'Design Hub, FiDi',
    reviewCount: 9,
    rating: 4.9,
  }),
  teachingLesson({
    id: 'sam-l1',
    teacherId: 'friend-sam',
    teacherName: 'Sam Rivera',
    teacherAvatar: 'SR',
    title: 'Watercolor Landscapes',
    category: 'Art',
    categoryEmoji: '🎨',
    durationMinutes: 60,
    scheduledAtLabel: 'May 25, 2026 · 10:00 AM',
    locationName: 'Dolores Park',
    reviewCount: 41,
    rating: 4.9,
  }),
  teachingLesson({
    id: 'sam-l2',
    teacherId: 'friend-sam',
    teacherName: 'Sam Rivera',
    teacherAvatar: 'SR',
    title: 'Urban Sketching Walk',
    category: 'Art',
    categoryEmoji: '✏️',
    durationMinutes: 45,
    scheduledAtLabel: 'May 10, 2026 · 9:00 AM',
    locationName: 'Embarcadero Waterfront',
    reviewCount: 24,
    rating: 4.8,
  }),
  teachingLesson({
    id: 'sam-l3',
    teacherId: 'friend-sam',
    teacherName: 'Sam Rivera',
    teacherAvatar: 'SR',
    title: 'Drawing Faces from Life',
    category: 'Art',
    categoryEmoji: '🖌️',
    durationMinutes: 60,
    scheduledAtLabel: 'Apr 20, 2026 · 2:00 PM',
    locationName: 'Community Art Room, Mission',
    reviewCount: 19,
    rating: 4.9,
  }),
];

export function allCatalogLessons(): Lesson[] {
  const seen = new Set<string>();
  const merged: Lesson[] = [];

  for (const lesson of [...homeLessons, ...discoverLessons, ...profileTeachingLessons]) {
    if (seen.has(lesson.id)) continue;
    seen.add(lesson.id);
    merged.push(lesson);
  }

  return merged;
}
