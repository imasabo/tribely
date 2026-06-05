import { parseScheduledDate } from '@/features/discover/lib/applyDiscoverFilters';
import type { Lesson, LessonSession } from '@/types/domain';

/** Parse mock schedule labels including "Jun 15, 2026 · 2:30 PM". */
export function parseSessionDate(scheduledAtLabel: string, now = new Date()): Date | null {
  const monthYearTime = scheduledAtLabel.match(
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})\s*·?\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i
  );
  if (monthYearTime) {
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
    const monthIndex = monthNames.indexOf(monthYearTime[1].slice(0, 3).toLowerCase());
    const day = parseInt(monthYearTime[2], 10);
    const year = parseInt(monthYearTime[3], 10);
    let hour = parseInt(monthYearTime[4], 10);
    const minute = parseInt(monthYearTime[5], 10);
    const meridiem = monthYearTime[6].toUpperCase();
    if (meridiem === 'PM' && hour < 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
    if (monthIndex >= 0) {
      return new Date(year, monthIndex, day, hour, minute);
    }
  }

  const parsed = parseScheduledDate(scheduledAtLabel, now);
  if (!parsed) return null;

  const timeMatch = scheduledAtLabel.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const minute = parseInt(timeMatch[2], 10);
    const meridiem = timeMatch[3].toUpperCase();
    if (meridiem === 'PM' && hour < 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
    parsed.setHours(hour, minute, 0, 0);
  }

  return parsed;
}

export function isSessionUpcoming(session: LessonSession, now = new Date()): boolean {
  const parsed = parseSessionDate(session.scheduledAtLabel, now);
  if (!parsed) {
    const lower = session.scheduledAtLabel.toLowerCase();
    if (lower.includes('today') || lower.includes('tomorrow')) return true;
    if (lower.includes('yesterday')) return false;
    return false;
  }
  return parsed.getTime() >= now.getTime();
}

/** Session used for completion eligibility (next upcoming, or latest past). */
export function getCompletionSession(lesson: Lesson, now = new Date()): LessonSession {
  const sessions = lesson.sessions ?? [];
  if (sessions.length === 0) {
    return { id: `${lesson.id}-s1`, scheduledAtLabel: lesson.scheduledAtLabel };
  }
  const upcoming = getUpcomingSessions(sessions, now);
  if (upcoming[0]) return upcoming[0];
  const past = getPastSessions(sessions, now);
  return past[past.length - 1] ?? sessions[sessions.length - 1];
}

export function getSessionEndDate(
  session: LessonSession,
  durationMinutes: number,
  now = new Date()
): Date | null {
  const start = parseSessionDate(session.scheduledAtLabel, now);
  if (!start) return null;
  return new Date(start.getTime() + durationMinutes * 60 * 1000);
}

export function isSessionEnded(
  session: LessonSession,
  durationMinutes: number,
  now = new Date()
): boolean {
  const end = getSessionEndDate(session, durationMinutes, now);
  if (!end) return false;
  return end.getTime() <= now.getTime();
}

/** Learners may post a completion only after the relevant session start + duration. */
export function canShareLessonCompletion(lesson: Lesson, now = new Date()): boolean {
  const session = getCompletionSession(lesson, now);
  return isSessionEnded(session, lesson.durationMinutes, now);
}

function formatClockTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const minutePart = minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : '';
  return `${hour12}${minutePart} ${meridiem}`;
}

/** Short label for when a session finished (Completed tab). */
export function formatSessionCompletedLabel(
  session: LessonSession,
  now = new Date()
): string {
  const lower = session.scheduledAtLabel.toLowerCase();
  if (lower.includes('yesterday')) return 'Yesterday';
  if (lower.includes('today')) return 'Today';
  const dateMatch = session.scheduledAtLabel.match(
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i
  );
  if (dateMatch) return dateMatch[0].replace(/\s+,/, ',');
  return session.scheduledAtLabel.split('·')[0]?.trim() ?? session.scheduledAtLabel;
}

/** Human-readable unlock time for the completion flow. */
export function lessonCompletionUnlockLabel(lesson: Lesson, now = new Date()): string | null {
  const session = getCompletionSession(lesson, now);
  const end = getSessionEndDate(session, lesson.durationMinutes, now);
  if (!end || end.getTime() <= now.getTime()) return null;

  const start = parseSessionDate(session.scheduledAtLabel, now);
  const dayPrefix =
    start && start.toDateString() === now.toDateString()
      ? 'Today'
      : start &&
          start.toDateString() ===
            new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toDateString()
        ? 'Tomorrow'
        : null;

  const timeLabel = formatClockTime(end);
  return dayPrefix ? `${dayPrefix}, ${timeLabel}` : timeLabel;
}

function sortSessionsByDate(sessions: LessonSession[], now = new Date()): LessonSession[] {
  return [...sessions].sort((a, b) => {
    const da = parseSessionDate(a.scheduledAtLabel, now)?.getTime() ?? 0;
    const db = parseSessionDate(b.scheduledAtLabel, now)?.getTime() ?? 0;
    return da - db;
  });
}

export function getUpcomingSessions(
  sessions: LessonSession[],
  now = new Date()
): LessonSession[] {
  return sortSessionsByDate(
    sessions.filter((s) => isSessionUpcoming(s, now)),
    now
  );
}

export function getPastSessions(sessions: LessonSession[], now = new Date()): LessonSession[] {
  return sortSessionsByDate(
    sessions.filter((s) => !isSessionUpcoming(s, now)),
    now
  );
}

export function hasUpcomingSessions(lesson: Lesson, now = new Date()): boolean {
  return getUpcomingSessions(lesson.sessions ?? [], now).length > 0;
}

export function sessionCountFor(lesson: Lesson): number {
  return Math.max(1, lesson.sessions?.length ?? 1);
}

/** Card / list label: next upcoming session, or most recent past session. */
export function primaryScheduledAtLabel(lesson: Lesson, now = new Date()): string {
  const sessions = lesson.sessions ?? [];
  const upcoming = getUpcomingSessions(sessions, now);
  if (upcoming[0]) return upcoming[0].scheduledAtLabel;
  const past = getPastSessions(sessions, now);
  return past[past.length - 1]?.scheduledAtLabel ?? lesson.scheduledAtLabel;
}

export function syncLessonScheduleFields(lesson: Lesson, now = new Date()): Lesson {
  return {
    ...lesson,
    scheduledAtLabel: primaryScheduledAtLabel(lesson, now),
  };
}

export function createInitialSessions(
  lessonId: string,
  scheduledAtLabel: string,
  count = 1
): LessonSession[] {
  if (count <= 1) {
    return [{ id: `${lessonId}-s1`, scheduledAtLabel }];
  }

  return Array.from({ length: count }, (_, index) => {
    const isLast = index === count - 1;
    return {
      id: `${lessonId}-s${index + 1}`,
      scheduledAtLabel: isLast
        ? scheduledAtLabel
        : `Past session · ${index + 1} of ${count}`,
    };
  });
}

export function newSessionId(lessonId: string): string {
  return `${lessonId}-session-${Date.now()}`;
}
