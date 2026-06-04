import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { saveBlockedUserIds } from '@/lib/blockedUsersStorage';
import { blockedUsersService } from '@/services/blockedUsers.service';
import { useAuth } from '@/providers/AuthProvider';
import type { BlockedUserListItem } from '@/types/blockedUser';

type BlockedUsersContextValue = {
  blockedUsers: BlockedUserListItem[];
  blockedUserIds: string[];
  loading: boolean;
  isBlocked: (userId: string) => boolean;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
};

const BlockedUsersContext = createContext<BlockedUsersContextValue | null>(null);

export function BlockedUsersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUserListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshResolved = useCallback(async (ids: string[]) => {
    const resolved = await blockedUsersService.resolveBlockedUsers(ids);
    setBlockedUsers(resolved);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user?.uid) {
        if (!cancelled) {
          setBlockedUserIds([]);
          setBlockedUsers([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const ids = await blockedUsersService.getBlockedUserIds(user.uid);
      const resolved = await blockedUsersService.resolveBlockedUsers(ids);

      if (!cancelled) {
        setBlockedUserIds(ids);
        setBlockedUsers(resolved);
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const persist = useCallback(
    async (nextIds: string[]) => {
      setBlockedUserIds(nextIds);
      await refreshResolved(nextIds);
      if (user?.uid) {
        await saveBlockedUserIds(user.uid, nextIds);
      }
    },
    [refreshResolved, user?.uid]
  );

  const blockUser = useCallback(
    async (userId: string) => {
      if (!userId || userId === user?.uid) return;
      if (blockedUserIds.includes(userId)) return;
      await persist([...blockedUserIds, userId]);
    },
    [blockedUserIds, persist, user?.uid]
  );

  const unblockUser = useCallback(
    async (userId: string) => {
      if (!blockedUserIds.includes(userId)) return;
      await persist(blockedUserIds.filter((id) => id !== userId));
    },
    [blockedUserIds, persist]
  );

  const isBlocked = useCallback(
    (userId: string) => blockedUserIds.includes(userId),
    [blockedUserIds]
  );

  const value = useMemo<BlockedUsersContextValue>(
    () => ({
      blockedUsers,
      blockedUserIds,
      loading,
      isBlocked,
      blockUser,
      unblockUser,
    }),
    [blockedUsers, blockedUserIds, loading, isBlocked, blockUser, unblockUser]
  );

  return (
    <BlockedUsersContext.Provider value={value}>{children}</BlockedUsersContext.Provider>
  );
}

export function useBlockedUsers() {
  const ctx = useContext(BlockedUsersContext);
  if (!ctx) {
    throw new Error('useBlockedUsers must be used within BlockedUsersProvider');
  }
  return ctx;
}
