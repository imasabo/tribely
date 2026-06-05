import { lessonCatalogStore } from '@/data/lessonCatalogStore';
import { learnerRatingsStore } from '@/data/learnerRatingsStore';
import { mockProfileStatDetails } from '@/data/mock/profileStatDetails';
import { mockTeacherProfiles } from '@/data/mock/teacherProfiles';
import { mockPublicProfiles } from '@/data/mock/users';
import { isFirestoreAvailable } from '@/lib/firestore/client';
import { getPastSessions } from '@/lib/lessonSessions';
import { usersService } from '@/services/users.service';
import type {
  ProfileReviewItem,
  ProfileStatKey,
  ProfileStudentItem,
  ProfileTaughtItem,
} from '@/features/profile/types';

function resolveBundle(userId: string) {
  return mockProfileStatDetails[userId] ?? null;
}

async function displayNameFor(userId: string): Promise<string | null> {
  if (isFirestoreAvailable()) {
    const profile = await usersService.getProfile(userId);
    if (profile?.displayName) return profile.displayName;
  }
  const profile = mockPublicProfiles[userId] ?? mockTeacherProfiles[userId];
  return profile?.displayName ?? null;
}

function enrichTaughtItem(item: ProfileTaughtItem): ProfileTaughtItem {
  const lesson = lessonCatalogStore.getById(item.lessonId);
  if (!lesson) return item;

  const past = getPastSessions(lesson.sessions ?? []);
  const lastPast = past[past.length - 1];
  const lastLabel = lastPast?.scheduledAtLabel ?? lesson.scheduledAtLabel;
  const displayLast = lastLabel.includes('·')
    ? lastLabel.split('·').pop()?.trim() ?? lastLabel
    : lastLabel;

  return {
    ...item,
    title: lesson.title,
    sessionCount: lesson.sessions?.length ?? item.sessionCount,
    completedAtLabel: `Last session · ${displayLast}`,
  };
}

function mergeTaughtLists(userId: string, base: ProfileTaughtItem[]): ProfileTaughtItem[] {
  const extras = lessonCatalogStore.getExtraTaughtForTeacher(userId);
  const extraIds = new Set(extras.map((item) => item.lessonId));
  const merged = [...extras.map(enrichTaughtItem), ...base.filter((item) => !extraIds.has(item.lessonId))];
  return merged.map(enrichTaughtItem);
}

export const profileStatsService = {
  async getDisplayName(userId: string): Promise<string | null> {
    return displayNameFor(userId);
  },

  async getTaught(userId: string): Promise<ProfileTaughtItem[]> {
    const base = resolveBundle(userId)?.taught ?? [];
    return mergeTaughtLists(userId, base);
  },

  async findTaughtByLessonId(
    userId: string,
    lessonId: string
  ): Promise<ProfileTaughtItem | null> {
    const taught = await this.getTaught(userId);
    return taught.find((item) => item.lessonId === lessonId) ?? null;
  },

  async getStudents(userId: string): Promise<ProfileStudentItem[]> {
    return resolveBundle(userId)?.students ?? [];
  },

  async getReviews(userId: string): Promise<ProfileReviewItem[]> {
    const base = resolveBundle(userId)?.reviews ?? [];
    const fromTeachers = learnerRatingsStore.listReviewsForLearnerProfile(userId);
    const seen = new Set(fromTeachers.map((r) => r.id));
    const merged = [
      ...fromTeachers,
      ...base.filter((r) => !seen.has(r.id)),
    ];
    return merged;
  },

  titleForStat(statKey: ProfileStatKey): string {
    switch (statKey) {
      case 'taught':
        return 'Lessons taught';
      case 'students':
        return 'Students';
      case 'reviews':
        return 'Reviews';
      case 'rating':
        return 'Rating';
      default:
        return '';
    }
  },

  emptyMessageForStat(statKey: ProfileStatKey): string {
    switch (statKey) {
      case 'taught':
        return 'No lessons taught yet.';
      case 'students':
        return 'No students yet.';
      case 'reviews':
        return 'No reviews yet.';
      default:
        return 'Nothing to show yet.';
    }
  },
};
