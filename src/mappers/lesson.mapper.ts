import type { LessonDoc } from '@/types/firestore';
import type { Lesson } from '@/types/domain';

/** Map Firestore lesson + optional teacher denormalization → UI model (Phase 2) */
export function lessonFromFirestore(
  id: string,
  doc: LessonDoc,
  teacher?: { displayName: string; photoURL?: string }
): Lesson {
  return {
    id,
    teacherId: doc.teacherId,
    title: doc.title,
    teacherName: teacher?.displayName ?? 'Teacher',
    teacherAvatar: teacher?.displayName?.slice(0, 2).toUpperCase() ?? 'TR',
    category: doc.category,
    categoryEmoji: doc.categoryEmoji,
    distanceLabel: '—',
    durationMinutes: doc.durationMinutes,
    rating: 0,
    reviewCount: 0,
    scheduledAtLabel: doc.scheduledAt.toDate().toLocaleString(),
    locationName: doc.location.name,
    featured: doc.featured,
    slidePreviewColors: ['#0F766E', '#134E4A', '#1F2937'],
    priceCents: doc.priceCents,
  };
}

export function formatPriceDollars(priceCents?: number): string {
  if (priceCents == null || priceCents === 0) return 'Free';
  return `$${Math.round(priceCents / 100)}`;
}
