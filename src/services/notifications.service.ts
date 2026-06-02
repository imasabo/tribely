import { mockNotifications } from '@/data/mock/notifications';
import type { AppNotification } from '@/types/domain';

/**
 * Notifications data access layer.
 * Phase 2: swap implementations to use Firestore / FCM.
 */
export const notificationsService = {
  async list(): Promise<AppNotification[]> {
    return mockNotifications;
  },
};
