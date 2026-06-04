import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { friendsService } from '@/services/friends.service';
import { useAuth } from '@/providers/AuthProvider';
import type { FriendListItem } from '@/types/friendList';

type FriendConnectionsContextValue = {
  friends: FriendListItem[];
  friendCount: number;
  loading: boolean;
  reload: () => Promise<void>;
};

const FriendConnectionsContext = createContext<FriendConnectionsContextValue | null>(null);

export function FriendConnectionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [friends, setFriends] = useState<FriendListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  const reload = useCallback(
    async (options?: ReloadOptions) => {
      if (!user?.uid) {
        setFriends([]);
        setLoading(false);
        hasLoadedRef.current = true;
        return;
      }

      const background = options?.background ?? false;
      if (!background && !hasLoadedRef.current) {
        setLoading(true);
      }

      const ids = await friendsService.getFriendIds(user.uid);
      const resolved = await friendsService.resolveFriends(ids);
      setFriends(resolved);
      setLoading(false);
      hasLoadedRef.current = true;
    },
    [user?.uid]
  );

  useEffect(() => {
    hasLoadedRef.current = false;
    void reload();
  }, [reload]);

  const value = useMemo<FriendConnectionsContextValue>(
    () => ({
      friends,
      friendCount: friends.length,
      loading,
      reload,
    }),
    [friends, loading, reload]
  );

  return (
    <FriendConnectionsContext.Provider value={value}>{children}</FriendConnectionsContext.Provider>
  );
}

export function useFriendConnections() {
  const ctx = useContext(FriendConnectionsContext);
  if (!ctx) {
    throw new Error('useFriendConnections must be used within FriendConnectionsProvider');
  }
  return ctx;
}
