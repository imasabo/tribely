import { loadUserReports, saveUserReports } from '@/lib/userReportsStorage';
import type { UserReportReasonId, UserReportRecord } from '@/types/userReport';

/**
 * User reports data access.
 * Phase 2: Firestore reports collection + moderation queue.
 */
export const userReportsService = {
  async hasReported(
    reporterId: string | null | undefined,
    reportedUserId: string
  ): Promise<boolean> {
    const reports = await loadUserReports(reporterId);
    return reports.some((r) => r.reportedUserId === reportedUserId);
  },

  async submitReport(
    reporterId: string,
    reportedUserId: string,
    reasonId: UserReportReasonId,
    details?: string
  ): Promise<UserReportRecord> {
    const existing = await loadUserReports(reporterId);
    const record: UserReportRecord = {
      reportedUserId,
      reasonId,
      details: details?.trim() || undefined,
      createdAt: Date.now(),
    };

    const withoutDuplicate = existing.filter((r) => r.reportedUserId !== reportedUserId);
    await saveUserReports(reporterId, [...withoutDuplicate, record]);
    return record;
  },
};
