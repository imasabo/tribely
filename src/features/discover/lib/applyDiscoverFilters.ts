import type { DiscoverSheetFilters, DiscoverSortOption } from '@/features/discover/types';
import type { Lesson, LessonDurationMinutes } from '@/types/domain';

const CATEGORY_ALIASES: Record<string, string[]> = {
  Tech: ['Tech', 'Programming'],
  Music: ['Music'],
  Art: ['Art'],
  Language: ['Language'],
  Fitness: ['Fitness'],
  Finance: ['Finance'],
  Dance: ['Dance'],
  Cooking: ['Cooking', 'Food'],
  Photography: ['Photography'],
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/** Parse mock `distanceLabel` values like "0.4 mi" or "1.2 mi". */
export function parseDistanceMiles(distanceLabel: string): number {
  const match = distanceLabel.match(/([\d.]+)\s*mi/i);
  return match ? parseFloat(match[1]) : Infinity;
}

/** Best-effort schedule parsing for mock `scheduledAtLabel` strings. */
export function parseScheduledDate(scheduledAtLabel: string, now = new Date()): Date | null {
  const lower = scheduledAtLabel.toLowerCase();

  if (lower.includes('today')) {
    return startOfDay(now);
  }

  if (lower.includes('tomorrow')) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return startOfDay(d);
  }

  if (lower.includes('yesterday')) {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    return startOfDay(d);
  }

  const monthMatch = scheduledAtLabel.match(
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})\b/i
  );
  if (monthMatch) {
    const monthNames = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];
    const monthIndex = monthNames.indexOf(monthMatch[1].slice(0, 3).toLowerCase());
    const day = parseInt(monthMatch[2], 10);
    if (monthIndex >= 0) {
      const d = new Date(now.getFullYear(), monthIndex, day);
      if (d < startOfDay(now)) {
        d.setFullYear(d.getFullYear() + 1);
      }
      return startOfDay(d);
    }
  }

  return null;
}

function matchesWhenFilter(scheduledAtLabel: string, when: DiscoverSheetFilters['when']): boolean {
  if (when === 'any') return true;

  const lower = scheduledAtLabel.toLowerCase();
  const now = new Date();

  if (when === 'today') {
    return lower.includes('today');
  }

  if (when === 'this_week') {
    if (lower.includes('today') || lower.includes('tomorrow')) return true;
    const parsed = parseScheduledDate(scheduledAtLabel, now);
    if (!parsed) return false;
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return parsed >= startOfDay(now) && parsed <= endOfDay(weekEnd);
  }

  if (when === 'weekend') {
    if (/\b(sat|sun|saturday|sunday|weekend)\b/i.test(scheduledAtLabel)) return true;
    const parsed = parseScheduledDate(scheduledAtLabel, now);
    if (!parsed) return false;
    const day = parsed.getDay();
    return day === 0 || day === 6;
  }

  return true;
}

function matchesCategoryFilter(lesson: Lesson, category: string): boolean {
  if (category === 'All') return true;
  const aliases = CATEGORY_ALIASES[category] ?? [category];
  return aliases.some(
    (alias) => lesson.category.toLowerCase() === alias.toLowerCase()
  );
}

export function applyDiscoverSheetFilters(
  lessons: Lesson[],
  filters: DiscoverSheetFilters,
  options?: { filterByDistance?: boolean }
): Lesson[] {
  const filterByDistance = options?.filterByDistance ?? true;
  return lessons.filter((lesson) => {
    if (
      filterByDistance &&
      parseDistanceMiles(lesson.distanceLabel) > filters.distanceMiles
    ) {
      return false;
    }
    if (!filters.durations.includes(lesson.durationMinutes)) return false;
    if (!matchesWhenFilter(lesson.scheduledAtLabel, filters.when)) return false;
    return true;
  });
}

export function applyDiscoverCategoryFilter(lessons: Lesson[], category: string): Lesson[] {
  return lessons.filter((lesson) => matchesCategoryFilter(lesson, category));
}

function soonestRank(scheduledAtLabel: string, now = new Date()): number {
  const lower = scheduledAtLabel.toLowerCase();
  if (lower.includes('today')) return 0;
  if (lower.includes('tomorrow')) return 1;
  const parsed = parseScheduledDate(scheduledAtLabel, now);
  if (!parsed) return 999;
  return 2 + Math.floor((parsed.getTime() - startOfDay(now).getTime()) / 86400000);
}

export function sortDiscoverLessons(
  lessons: Lesson[],
  sort: DiscoverSortOption
): Lesson[] {
  const sorted = [...lessons];

  switch (sort) {
    case 'Nearest':
      sorted.sort(
        (a, b) =>
          parseDistanceMiles(a.distanceLabel) - parseDistanceMiles(b.distanceLabel)
      );
      break;
    case 'Rating':
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case 'Soonest':
      sorted.sort((a, b) => soonestRank(a.scheduledAtLabel) - soonestRank(b.scheduledAtLabel));
      break;
    case 'Duration':
      sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
      break;
    case 'New':
      sorted.sort((a, b) => b.id.localeCompare(a.id));
      break;
    default:
      break;
  }

  return sorted;
}

export function toggleDuration(
  durations: LessonDurationMinutes[],
  value: LessonDurationMinutes
): LessonDurationMinutes[] {
  if (durations.includes(value)) {
    if (durations.length === 1) return durations;
    return durations.filter((d) => d !== value);
  }
  return [...durations, value].sort((a, b) => a - b);
}
