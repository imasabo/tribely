import * as SecureStore from 'expo-secure-store';

import type { UserReportRecord } from '@/types/userReport';

const KEY_PREFIX = 'tribely.user_reports';

function storageKey(reporterId: string): string {
  return `${KEY_PREFIX}.${reporterId}`;
}

export async function loadUserReports(
  reporterId: string | null | undefined
): Promise<UserReportRecord[]> {
  if (!reporterId) return [];

  try {
    const raw = await SecureStore.getItemAsync(storageKey(reporterId));
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is UserReportRecord =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as UserReportRecord).reportedUserId === 'string' &&
        typeof (item as UserReportRecord).reasonId === 'string' &&
        typeof (item as UserReportRecord).createdAt === 'number'
    );
  } catch {
    return [];
  }
}

export async function saveUserReports(
  reporterId: string,
  reports: UserReportRecord[]
): Promise<void> {
  await SecureStore.setItemAsync(storageKey(reporterId), JSON.stringify(reports));
}
