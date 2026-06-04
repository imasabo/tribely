import { useCallback, useEffect, useState } from 'react';

import type { PublicUserProfile } from '@/data/mock/users';
import { usersService } from '@/services/users.service';
import type { FriendConnectionStatus } from '@/types/social';

export function usePublicProfile(userId: string, viewerId: string | null | undefined) {
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<FriendConnectionStatus>('none');
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [loadedProfile, status] = await Promise.all([
        usersService.getPublicProfile(userId),
        usersService.getConnectionStatus(viewerId, userId),
      ]);

      if (!loadedProfile) {
        setProfile(null);
        setError('This profile could not be found.');
        return;
      }

      setProfile(loadedProfile);
      setConnectionStatus(status);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId, viewerId]);

  useEffect(() => {
    void load();
  }, [load]);

  const sendFriendRequest = useCallback(async () => {
    if (!viewerId || connectionStatus !== 'none') return;

    setRequesting(true);
    try {
      const status = await usersService.sendFriendRequest(viewerId, userId);
      setConnectionStatus(status);
    } finally {
      setRequesting(false);
    }
  }, [viewerId, userId, connectionStatus]);

  return {
    profile,
    connectionStatus,
    loading,
    requesting,
    error,
    reload: load,
    sendFriendRequest,
  };
}
