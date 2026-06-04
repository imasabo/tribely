import { discoverLessons, homeLessons } from '@/data/mock/lessons';
import type {
  ProfileReviewItem,
  ProfileStudentItem,
  ProfileTaughtItem,
} from '@/features/profile/types';
import { getInitials } from '@/lib/userDisplay';
import type { Lesson } from '@/types/domain';

export interface ProfileStatDetailBundle {
  taught: ProfileTaughtItem[];
  students: ProfileStudentItem[];
  reviews: ProfileReviewItem[];
}

const SESSION_LABELS = [
  'Last session · Jun 2, 2026',
  'Last session · May 28, 2026',
  'Last session · May 15, 2026',
  'Last session · May 3, 2026',
  'Last session · Apr 18, 2026',
];

const REVIEW_BODIES = [
  'Clear explanations and a welcoming vibe. I left with notes I will actually use.',
  'Well-paced session with time for questions. Would recommend to a friend.',
  'Great hands-on practice — the teacher checked in with everyone.',
  'Super practical. I appreciated the real-world examples.',
  'Fun and focused. Already signed up for another session.',
  'Patient teacher who adapts to different skill levels in the group.',
  'The slides were helpful and the neighborhood spot was easy to find.',
  'Left feeling confident about the basics. Five stars.',
];

const STUDENT_NAMES = [
  'Jordan Park',
  'Taylor Kim',
  'Marcus Lee',
  'Sam Rivera',
  'Alex Kim',
  'Riley Chen',
  'Priya Nair',
  'Noah Ellis',
  'Elena Cruz',
  'Carlos Vega',
];

function taughtFromLesson(lesson: Lesson, index: number): ProfileTaughtItem {
  const sessions = Math.max(1, Math.round(lesson.reviewCount / 3));
  return {
    id: `${lesson.teacherId}-taught-${lesson.id}`,
    title: lesson.title,
    category: lesson.category,
    categoryEmoji: lesson.categoryEmoji,
    completedAtLabel: SESSION_LABELS[index % SESSION_LABELS.length] ?? SESSION_LABELS[0],
    sessionCount: sessions,
    rating: lesson.rating,
  };
}

function studentsForTeacher(teacherId: string, lesson: Lesson, count: number): ProfileStudentItem[] {
  const capped = Math.min(count, STUDENT_NAMES.length);
  return Array.from({ length: capped }, (_, i) => {
    const name = STUDENT_NAMES[i];
    return {
      id: `${teacherId}-student-${i}`,
      displayName: name,
      initials: getInitials(name),
      lessonsCompleted: Math.max(1, (i % 4) + 1),
      lastLessonTitle: lesson.title,
      lastSeenLabel: i === 0 ? 'Active this week' : i < 3 ? 'Active this month' : 'Active May 2026',
    };
  });
}

function reviewsForTeacher(teacherId: string, lessons: Lesson[], count: number): ProfileReviewItem[] {
  const capped = Math.min(count, 8);
  return Array.from({ length: capped }, (_, i) => {
    const lesson = lessons[i % lessons.length];
    const authorName = STUDENT_NAMES[(i + 2) % STUDENT_NAMES.length];
    return {
      id: `${teacherId}-review-${i}`,
      authorName,
      authorInitials: getInitials(authorName),
      rating: i % 5 === 0 ? 4 : 5,
      body: REVIEW_BODIES[i % REVIEW_BODIES.length],
      lessonTitle: lesson.title,
      createdAtLabel: ['Jun 2, 2026', 'May 28, 2026', 'May 14, 2026', 'May 1, 2026', 'Apr 22, 2026'][
        i % 5
      ],
      context: 'as_teacher',
    };
  });
}

function bundleFromLessons(lessons: Lesson[]): ProfileStatDetailBundle {
  const primary = lessons[0];
  const reviewCap = Math.max(3, Math.min(8, primary.reviewCount));
  const studentCap = Math.max(3, Math.min(6, Math.round(primary.reviewCount / 2)));

  return {
    taught: lessons.map(taughtFromLesson),
    students: studentsForTeacher(primary.teacherId, primary, studentCap),
    reviews: reviewsForTeacher(primary.teacherId, lessons, reviewCap),
  };
}

function buildTeacherBundles(): Record<string, ProfileStatDetailBundle> {
  const byTeacher = new Map<string, Lesson[]>();

  for (const lesson of [...homeLessons, ...discoverLessons]) {
    const list = byTeacher.get(lesson.teacherId) ?? [];
    list.push(lesson);
    byTeacher.set(lesson.teacherId, list);
  }

  const bundles: Record<string, ProfileStatDetailBundle> = {};
  for (const [, lessons] of byTeacher) {
    bundles[lessons[0].teacherId] = bundleFromLessons(lessons);
  }
  return bundles;
}

const alexTaught: ProfileTaughtItem[] = [
  {
    id: 'alex-taught-1',
    title: 'Python for Data Science',
    category: 'Programming',
    categoryEmoji: '🐍',
    completedAtLabel: 'Last session · May 28, 2026',
    sessionCount: 8,
    rating: 4.9,
  },
  {
    id: 'alex-taught-2',
    title: 'ML Basics Workshop',
    category: 'Tech',
    categoryEmoji: '🤖',
    completedAtLabel: 'Last session · May 12, 2026',
    sessionCount: 4,
    rating: 5.0,
  },
  {
    id: 'alex-taught-3',
    title: 'SQL for Analysts',
    category: 'Programming',
    categoryEmoji: '📊',
    completedAtLabel: 'Last session · Apr 30, 2026',
    sessionCount: 3,
    rating: 4.8,
  },
  {
    id: 'alex-taught-4',
    title: 'Pandas & Visualization Crash Course',
    category: 'Programming',
    categoryEmoji: '📈',
    completedAtLabel: 'Last session · Apr 12, 2026',
    sessionCount: 2,
    rating: 4.9,
  },
  {
    id: 'alex-taught-5',
    title: 'Intro to Feature Engineering',
    category: 'Tech',
    categoryEmoji: '⚙️',
    completedAtLabel: 'Last session · Mar 22, 2026',
    sessionCount: 2,
    rating: 5.0,
  },
];

const alexStudents: ProfileStudentItem[] = [
  {
    id: 'alex-student-1',
    displayName: 'Jordan Park',
    initials: 'JP',
    lessonsCompleted: 3,
    lastLessonTitle: 'Python for Data Science',
    lastSeenLabel: 'Active this week',
  },
  {
    id: 'alex-student-2',
    displayName: 'Taylor Kim',
    initials: 'TK',
    lessonsCompleted: 2,
    lastLessonTitle: 'ML Basics Workshop',
    lastSeenLabel: 'Active May 2026',
  },
  {
    id: 'alex-student-3',
    displayName: 'Marcus Lee',
    initials: 'ML',
    lessonsCompleted: 5,
    lastLessonTitle: 'SQL for Analysts',
    lastSeenLabel: 'Active this month',
  },
  {
    id: 'alex-student-4',
    displayName: 'Sam Rivera',
    initials: 'SR',
    lessonsCompleted: 4,
    lastLessonTitle: 'Pandas & Visualization Crash Course',
    lastSeenLabel: 'Active this week',
  },
  {
    id: 'alex-student-5',
    displayName: 'Riley Chen',
    initials: 'RC',
    lessonsCompleted: 1,
    lastLessonTitle: 'Intro to Feature Engineering',
    lastSeenLabel: 'Active Apr 2026',
  },
  {
    id: 'alex-student-6',
    displayName: 'Priya Nair',
    initials: 'PN',
    lessonsCompleted: 2,
    lastLessonTitle: 'Python for Data Science',
    lastSeenLabel: 'Active May 2026',
  },
];

const alexReviews: ProfileReviewItem[] = [
  {
    id: 'alex-review-1',
    authorName: 'Jordan Park',
    authorInitials: 'JP',
    rating: 5,
    body: 'Alex explained pandas workflows clearly and left time for questions. Would book again.',
    lessonTitle: 'Python for Data Science',
    createdAtLabel: 'May 28, 2026',
    context: 'as_teacher',
  },
  {
    id: 'alex-review-2',
    authorName: 'Taylor Kim',
    authorInitials: 'TK',
    rating: 5,
    body: 'Great pace for beginners — the ML intuition section was especially helpful.',
    lessonTitle: 'ML Basics Workshop',
    createdAtLabel: 'May 14, 2026',
    context: 'as_teacher',
  },
  {
    id: 'alex-review-3',
    authorName: 'Sam Rivera',
    authorInitials: 'SR',
    rating: 4,
    body: 'Solid SQL lesson. A few more join examples would make it perfect.',
    lessonTitle: 'SQL for Analysts',
    createdAtLabel: 'May 1, 2026',
    context: 'as_teacher',
  },
  {
    id: 'alex-review-4',
    authorName: 'Marcus Lee',
    authorInitials: 'ML',
    rating: 5,
    body: 'The visualization walkthrough finally made matplotlib click for me.',
    lessonTitle: 'Pandas & Visualization Crash Course',
    createdAtLabel: 'Apr 15, 2026',
    context: 'as_teacher',
  },
  {
    id: 'alex-review-5',
    authorName: 'Riley Chen',
    authorInitials: 'RC',
    rating: 5,
    body: 'Feature engineering felt approachable. Loved the small group format.',
    lessonTitle: 'Intro to Feature Engineering',
    createdAtLabel: 'Mar 24, 2026',
    context: 'as_teacher',
  },
  {
    id: 'alex-review-6',
    authorName: 'Priya Nair',
    authorInitials: 'PN',
    rating: 5,
    body: 'Clear, patient, and practical. Best data lesson I have taken in the neighborhood.',
    lessonTitle: 'Python for Data Science',
    createdAtLabel: 'May 20, 2026',
    context: 'as_teacher',
  },
  {
    id: 'alex-review-7',
    authorName: 'Sam Rivera',
    authorInitials: 'SR',
    rating: 5,
    body: 'Attentive learner in the watercolor session — great questions and respectful of materials.',
    lessonTitle: 'Watercolor Landscapes',
    createdAtLabel: 'May 18, 2026',
    context: 'as_learner',
  },
  {
    id: 'alex-review-8',
    authorName: 'Riley Chen',
    authorInitials: 'RC',
    rating: 5,
    body: 'Showed up prepared for sourdough basics and helped the group with timing tips.',
    lessonTitle: 'Sourdough Starter 101',
    createdAtLabel: 'Apr 30, 2026',
    context: 'as_learner',
  },
];

const rileyTaught: ProfileTaughtItem[] = [
  {
    id: 'riley-taught-1',
    title: 'Sourdough Starter 101',
    category: 'Cooking',
    categoryEmoji: '🍞',
    completedAtLabel: 'Last session · Jun 1, 2026',
    sessionCount: 12,
    rating: 5.0,
  },
  {
    id: 'riley-taught-2',
    title: 'Weekend Pastry Basics',
    category: 'Cooking',
    categoryEmoji: '🥐',
    completedAtLabel: 'Last session · May 20, 2026',
    sessionCount: 10,
    rating: 5.0,
  },
  {
    id: 'riley-taught-3',
    title: 'Croissant Lamination Lab',
    category: 'Cooking',
    categoryEmoji: '🥐',
    completedAtLabel: 'Last session · May 5, 2026',
    sessionCount: 6,
    rating: 5.0,
  },
  {
    id: 'riley-taught-4',
    title: 'Seasonal Fruit Tarts',
    category: 'Cooking',
    categoryEmoji: '🍓',
    completedAtLabel: 'Last session · Apr 14, 2026',
    sessionCount: 5,
    rating: 4.9,
  },
];

const rileyStudents: ProfileStudentItem[] = [
  {
    id: 'riley-student-1',
    displayName: 'Alex Kim',
    initials: 'AK',
    lessonsCompleted: 2,
    lastLessonTitle: 'Sourdough Starter 101',
    lastSeenLabel: 'Active this week',
  },
  {
    id: 'riley-student-2',
    displayName: 'Sam Rivera',
    initials: 'SR',
    lessonsCompleted: 4,
    lastLessonTitle: 'Weekend Pastry Basics',
    lastSeenLabel: 'Active May 2026',
  },
  {
    id: 'riley-student-3',
    displayName: 'Marcus Lee',
    initials: 'ML',
    lessonsCompleted: 3,
    lastLessonTitle: 'Croissant Lamination Lab',
    lastSeenLabel: 'Active this month',
  },
  {
    id: 'riley-student-4',
    displayName: 'Taylor Kim',
    initials: 'TK',
    lessonsCompleted: 1,
    lastLessonTitle: 'Seasonal Fruit Tarts',
    lastSeenLabel: 'Active Apr 2026',
  },
  {
    id: 'riley-student-5',
    displayName: 'Jordan Park',
    initials: 'JP',
    lessonsCompleted: 2,
    lastLessonTitle: 'Sourdough Starter 101',
    lastSeenLabel: 'Active May 2026',
  },
];

const rileyReviews: ProfileReviewItem[] = [
  {
    id: 'riley-review-1',
    authorName: 'Alex Kim',
    authorInitials: 'AK',
    rating: 5,
    body: 'Best sourdough walkthrough I have had — clear timing and troubleshooting tips.',
    lessonTitle: 'Sourdough Starter 101',
    createdAtLabel: 'Jun 1, 2026',
    context: 'as_teacher',
  },
  {
    id: 'riley-review-2',
    authorName: 'Marcus Lee',
    authorInitials: 'ML',
    rating: 5,
    body: 'Riley is patient and organized. Left with croissants I was proud of.',
    lessonTitle: 'Weekend Pastry Basics',
    createdAtLabel: 'May 22, 2026',
    context: 'as_teacher',
  },
  {
    id: 'riley-review-3',
    authorName: 'Sam Rivera',
    authorInitials: 'SR',
    rating: 5,
    body: 'Lamination finally made sense. Small class size was perfect.',
    lessonTitle: 'Croissant Lamination Lab',
    createdAtLabel: 'May 8, 2026',
    context: 'as_teacher',
  },
  {
    id: 'riley-review-4',
    authorName: 'Taylor Kim',
    authorInitials: 'TK',
    rating: 5,
    body: 'Beautiful tarts and very clear steps. Great for beginners.',
    lessonTitle: 'Seasonal Fruit Tarts',
    createdAtLabel: 'Apr 16, 2026',
    context: 'as_teacher',
  },
  {
    id: 'riley-review-5',
    authorName: 'Jordan Park',
    authorInitials: 'JP',
    rating: 5,
    body: 'Warm, encouraging teacher. My starter is still alive!',
    lessonTitle: 'Sourdough Starter 101',
    createdAtLabel: 'May 30, 2026',
    context: 'as_teacher',
  },
];

const marcusTaught: ProfileTaughtItem[] = [
  {
    id: 'marcus-taught-1',
    title: 'Figma for Product Teams',
    category: 'Design',
    categoryEmoji: '🎨',
    completedAtLabel: 'Last session · May 18, 2026',
    sessionCount: 6,
    rating: 4.8,
  },
  {
    id: 'marcus-taught-2',
    title: 'UI Critique Workshop',
    category: 'Design',
    categoryEmoji: '✏️',
    completedAtLabel: 'Last session · May 2, 2026',
    sessionCount: 3,
    rating: 4.9,
  },
];

const marcusStudents: ProfileStudentItem[] = [
  {
    id: 'marcus-student-1',
    displayName: 'Taylor Kim',
    initials: 'TK',
    lessonsCompleted: 2,
    lastLessonTitle: 'Figma for Product Teams',
    lastSeenLabel: 'Active May 2026',
  },
  {
    id: 'marcus-student-2',
    displayName: 'Jordan Park',
    initials: 'JP',
    lessonsCompleted: 3,
    lastLessonTitle: 'UI Critique Workshop',
    lastSeenLabel: 'Active this month',
  },
  {
    id: 'marcus-student-3',
    displayName: 'Alex Kim',
    initials: 'AK',
    lessonsCompleted: 1,
    lastLessonTitle: 'Figma for Product Teams',
    lastSeenLabel: 'Active Apr 2026',
  },
  {
    id: 'marcus-student-4',
    displayName: 'Sam Rivera',
    initials: 'SR',
    lessonsCompleted: 2,
    lastLessonTitle: 'UI Critique Workshop',
    lastSeenLabel: 'Active May 2026',
  },
];

const marcusReviews: ProfileReviewItem[] = [
  {
    id: 'marcus-review-1',
    authorName: 'Taylor Kim',
    authorInitials: 'TK',
    rating: 5,
    body: 'Marcus made auto-layout click for me. Very practical examples.',
    lessonTitle: 'Figma for Product Teams',
    createdAtLabel: 'May 19, 2026',
    context: 'as_teacher',
  },
  {
    id: 'marcus-review-2',
    authorName: 'Jordan Park',
    authorInitials: 'JP',
    rating: 5,
    body: 'Constructive critique format — left with a clearer portfolio story.',
    lessonTitle: 'UI Critique Workshop',
    createdAtLabel: 'May 4, 2026',
    context: 'as_teacher',
  },
  {
    id: 'marcus-review-3',
    authorName: 'Alex Kim',
    authorInitials: 'AK',
    rating: 4,
    body: 'Great session. Would love one more week on design systems.',
    lessonTitle: 'Figma for Product Teams',
    createdAtLabel: 'Apr 28, 2026',
    context: 'as_teacher',
  },
];

const samTaught: ProfileTaughtItem[] = [
  {
    id: 'sam-taught-1',
    title: 'Watercolor Landscapes',
    category: 'Art',
    categoryEmoji: '🎨',
    completedAtLabel: 'Last session · May 25, 2026',
    sessionCount: 14,
    rating: 4.9,
  },
  {
    id: 'sam-taught-2',
    title: 'Urban Sketching Walk',
    category: 'Art',
    categoryEmoji: '✏️',
    completedAtLabel: 'Last session · May 10, 2026',
    sessionCount: 8,
    rating: 4.8,
  },
  {
    id: 'sam-taught-3',
    title: 'Drawing Faces from Life',
    category: 'Art',
    categoryEmoji: '🖌️',
    completedAtLabel: 'Last session · Apr 20, 2026',
    sessionCount: 5,
    rating: 4.9,
  },
];

const samStudents: ProfileStudentItem[] = [
  {
    id: 'sam-student-1',
    displayName: 'Jordan Park',
    initials: 'JP',
    lessonsCompleted: 2,
    lastLessonTitle: 'Watercolor Landscapes',
    lastSeenLabel: 'Active this month',
  },
  {
    id: 'sam-student-2',
    displayName: 'Taylor Kim',
    initials: 'TK',
    lessonsCompleted: 1,
    lastLessonTitle: 'Urban Sketching Walk',
    lastSeenLabel: 'Active May 2026',
  },
  {
    id: 'sam-student-3',
    displayName: 'Marcus Lee',
    initials: 'ML',
    lessonsCompleted: 3,
    lastLessonTitle: 'Drawing Faces from Life',
    lastSeenLabel: 'Active this week',
  },
  {
    id: 'sam-student-4',
    displayName: 'Alex Kim',
    initials: 'AK',
    lessonsCompleted: 1,
    lastLessonTitle: 'Watercolor Landscapes',
    lastSeenLabel: 'Active Apr 2026',
  },
];

const samReviews: ProfileReviewItem[] = [
  {
    id: 'sam-review-1',
    authorName: 'Jordan Park',
    authorInitials: 'JP',
    rating: 5,
    body: 'Sam gave thoughtful feedback on color mixing. Loved the park session.',
    lessonTitle: 'Watercolor Landscapes',
    createdAtLabel: 'May 26, 2026',
    context: 'as_teacher',
  },
  {
    id: 'sam-review-2',
    authorName: 'Taylor Kim',
    authorInitials: 'TK',
    rating: 5,
    body: 'Relaxed sketching walk with helpful demos. Perfect Sunday morning.',
    lessonTitle: 'Urban Sketching Walk',
    createdAtLabel: 'May 12, 2026',
    context: 'as_teacher',
  },
  {
    id: 'sam-review-3',
    authorName: 'Marcus Lee',
    authorInitials: 'ML',
    rating: 5,
    body: 'Portrait proportions finally clicked. Sam is encouraging and precise.',
    lessonTitle: 'Drawing Faces from Life',
    createdAtLabel: 'Apr 22, 2026',
    context: 'as_teacher',
  },
  {
    id: 'sam-review-4',
    authorName: 'Alex Kim',
    authorInitials: 'AK',
    rating: 4,
    body: 'Beautiful lesson — wish we had ten more minutes for drying tips.',
    lessonTitle: 'Watercolor Landscapes',
    createdAtLabel: 'May 18, 2026',
    context: 'as_teacher',
  },
];

/** Learners rated by their teachers after attending sessions */
const jordanReviews: ProfileReviewItem[] = [
  {
    id: 'jordan-review-1',
    authorName: 'Sarah Chen',
    authorInitials: 'SC',
    rating: 5,
    body: 'Jordan asked great questions and helped the group stay engaged.',
    lessonTitle: 'Python for Data Science Fundamentals',
    createdAtLabel: 'May 25, 2026',
    context: 'as_learner',
  },
  {
    id: 'jordan-review-2',
    authorName: 'Amara Osei',
    authorInitials: 'AO',
    rating: 4,
    body: 'Positive energy in class. Would pair well with any beginner group.',
    lessonTitle: 'Mindful Watercolor Painting',
    createdAtLabel: 'May 10, 2026',
    context: 'as_learner',
  },
  {
    id: 'jordan-review-3',
    authorName: 'Carlos Vega',
    authorInitials: 'CV',
    rating: 5,
    body: 'Prepared and on time. Conversational Spanish practice was fun.',
    lessonTitle: 'Spanish Conversation Practice',
    createdAtLabel: 'Apr 28, 2026',
    context: 'as_learner',
  },
];

const taylorReviews: ProfileReviewItem[] = [
  {
    id: 'taylor-review-1',
    authorName: 'Marcus Lee',
    authorInitials: 'ML',
    rating: 5,
    body: 'Taylor brought thoughtful questions to the Figma session.',
    lessonTitle: 'Figma for Product Teams',
    createdAtLabel: 'May 19, 2026',
    context: 'as_learner',
  },
  {
    id: 'taylor-review-2',
    authorName: 'Alex Kim',
    authorInitials: 'AK',
    rating: 4,
    body: 'Dedicated learner — stayed after to review the notebook examples.',
    lessonTitle: 'ML Basics Workshop',
    createdAtLabel: 'May 14, 2026',
    context: 'as_learner',
  },
  {
    id: 'taylor-review-3',
    authorName: 'Elena Morales',
    authorInitials: 'EM',
    rating: 5,
    body: 'Quick learner on lead sheets. Great duet partner for practice.',
    lessonTitle: 'Piano: Reading Lead Sheets',
    createdAtLabel: 'Apr 30, 2026',
    context: 'as_learner',
  },
];

const emptyBundle: ProfileStatDetailBundle = {
  taught: [],
  students: [],
  reviews: [],
};

/** Hand-tuned bundles override auto-generated teacher lesson data. */
const curatedBundles: Record<string, ProfileStatDetailBundle> = {
  'dev-user-alex': {
    taught: alexTaught,
    students: alexStudents,
    reviews: alexReviews,
  },
  'friend-marcus': {
    taught: marcusTaught,
    students: marcusStudents,
    reviews: marcusReviews,
  },
  'friend-jordan': {
    ...emptyBundle,
    reviews: jordanReviews,
  },
  'friend-sam': {
    taught: samTaught,
    students: samStudents,
    reviews: samReviews,
  },
  'friend-taylor': {
    ...emptyBundle,
    reviews: taylorReviews,
  },
  'friend-riley': {
    taught: rileyTaught,
    students: rileyStudents,
    reviews: rileyReviews,
  },
};

export const mockProfileStatDetails: Record<string, ProfileStatDetailBundle> = {
  ...buildTeacherBundles(),
  ...curatedBundles,
};
