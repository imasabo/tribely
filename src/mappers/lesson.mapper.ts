import { formatScheduledAtLabel } from '@/lib/lessonSchedule';
import { getInitials } from '@/lib/userDisplay';
import type { LessonDoc } from '@/types/firestore';
import type { Lesson } from '@/types/domain';

/** Map Firestore lesson → UI model */
export function lessonFromFirestore(id: string, doc: LessonDoc): Lesson {
  const scheduledAt = doc.scheduledAt.toDate();
  const scheduledAtLabel = formatScheduledAtLabel(scheduledAt);
  const teacherName = doc.teacherDisplayName?.trim() || 'Teacher';

  return {
    id,
    teacherId: doc.teacherId,
    title: doc.title,
    teacherName,
    teacherAvatar: getInitials(teacherName),
    category: doc.category,
    categoryEmoji: doc.categoryEmoji,
    distanceLabel: '—',
    durationMinutes: doc.durationMinutes,
    rating: 0,
    reviewCount: 0,
    sessions: [{ id: `${id}-session-1`, scheduledAtLabel }],
    scheduledAtLabel,
    locationName: doc.location.name,
    city: doc.city,
    cityId: doc.cityId,
    description: doc.description,
    featured: doc.featured,
    googleSlidesUrl: doc.googleSlidesUrl?.trim() || undefined,
    slidePreviewColors: ['#0F766E', '#134E4A', '#1F2937'],
    maxLearners: doc.maxLearners,
    enrolledCount: 0,
  };
}
