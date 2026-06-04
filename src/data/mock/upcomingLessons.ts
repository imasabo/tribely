import type { UpcomingLessonsBundle } from '@/features/profile/types';

const alexUpcoming: UpcomingLessonsBundle = {
  teaching: [
    {
      id: 'upcoming-teach-1',
      lessonId: 'd1',
      role: 'teaching',
      title: 'Python for Data Science',
      category: 'Programming',
      categoryEmoji: '🐍',
      scheduledAtLabel: 'Today, 2:30 PM',
      locationName: 'Blue Bottle Coffee, SoMa',
      durationMinutes: 60,
      slidePreviewColors: ['#0F766E', '#134E4A', '#1F2937'],
      enrolledCount: 4,
      maxLearners: 6,
    },
    {
      id: 'upcoming-teach-2',
      lessonId: 'd10',
      role: 'teaching',
      title: 'ML Basics Workshop',
      category: 'Tech',
      categoryEmoji: '🤖',
      scheduledAtLabel: 'Tomorrow, 10:00 AM',
      locationName: 'WeWork, FiDi',
      durationMinutes: 60,
      slidePreviewColors: ['#7C3AED', '#4C1D95', '#1F2937'],
      enrolledCount: 2,
      maxLearners: 5,
    },
  ],
  attending: [
    {
      id: 'upcoming-attend-1',
      lessonId: '2',
      role: 'attending',
      title: 'Intro to Guitar: First Chords',
      teacherName: 'Marcus Rivera',
      teacherAvatar: 'MR',
      category: 'Music',
      categoryEmoji: '🎸',
      scheduledAtLabel: 'Today, 4:00 PM',
      locationName: 'Dolores Park',
      durationMinutes: 30,
      slidePreviewColors: ['#D97706', '#92400E', '#1F2937'],
    },
    {
      id: 'upcoming-attend-2',
      lessonId: '3',
      role: 'attending',
      title: 'Mindful Watercolor Painting',
      teacherName: 'Amara Osei',
      teacherAvatar: 'AO',
      category: 'Art',
      categoryEmoji: '🎨',
      scheduledAtLabel: 'Tomorrow, 10:00 AM',
      locationName: 'SF Public Library, Mission',
      durationMinutes: 60,
      slidePreviewColors: ['#7C3AED', '#4C1D95', '#1F2937'],
    },
  ],
};

export const mockUpcomingLessons: Record<string, UpcomingLessonsBundle> = {
  'dev-user-alex': alexUpcoming,
};
