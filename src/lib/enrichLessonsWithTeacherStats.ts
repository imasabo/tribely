import type { Lesson } from '@/types/domain';
import { usersService } from '@/services/users.service';

export async function enrichLessonsWithTeacherStats(lessons: Lesson[]): Promise<Lesson[]> {
  if (lessons.length === 0) return lessons;

  const teacherIds = [...new Set(lessons.map((lesson) => lesson.teacherId))];
  const profiles = await usersService.getProfilesByIds(teacherIds);

  if (profiles.size === 0) return lessons;

  return lessons.map((lesson) => {
    const profile = profiles.get(lesson.teacherId);
    if (!profile) return lesson;

    return {
      ...lesson,
      rating: profile.stats.rating,
      reviewCount: profile.stats.reviews,
    };
  });
}
