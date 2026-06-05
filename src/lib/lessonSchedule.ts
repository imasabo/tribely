/** Format for mock labels and session storage, e.g. "Jun 15, 2026 · 2:30 PM". */
export function formatScheduledAtLabel(date: Date): string {
  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${datePart} · ${timePart}`;
}

export function formatScheduleDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatScheduleTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function combineDateAndTime(date: Date, time: Date): Date {
  const combined = new Date(date);
  combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return combined;
}

export function defaultSessionDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(14, 0, 0, 0);
  return d;
}

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isScheduleInPast(date: Date, time: Date, now = new Date()): boolean {
  return combineDateAndTime(date, time).getTime() < now.getTime();
}

/** If the selected day is today, bump time forward to the next valid minute. */
export function clampTimeForSelectedDate(date: Date, time: Date, now = new Date()): Date {
  if (!isSameCalendarDay(date, now)) {
    return time;
  }

  const combined = combineDateAndTime(date, time);
  if (combined.getTime() >= now.getTime()) {
    return time;
  }

  const clamped = new Date(now);
  clamped.setSeconds(0, 0);
  return clamped;
}
