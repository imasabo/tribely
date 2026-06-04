export type UserReportReasonId =
  | 'spam'
  | 'harassment'
  | 'inappropriate'
  | 'impersonation'
  | 'other';

export interface UserReportReason {
  id: UserReportReasonId;
  label: string;
}

export const USER_REPORT_REASONS: UserReportReason[] = [
  { id: 'spam', label: 'Spam or misleading profile' },
  { id: 'harassment', label: 'Harassment or bullying' },
  { id: 'inappropriate', label: 'Inappropriate content' },
  { id: 'impersonation', label: 'Impersonation' },
  { id: 'other', label: 'Something else' },
];

export interface UserReportRecord {
  reportedUserId: string;
  reasonId: UserReportReasonId;
  details?: string;
  createdAt: number;
}
