import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { friendLessonActivity } from '@/data/mock/lessons';
import type { ActivityComment } from '@/types/domain';

type ActivityEngagementContextValue = {
  isLiked: (activityId: string) => boolean;
  toggleLike: (activityId: string) => void;
  getComments: (activityId: string) => ActivityComment[];
  addComment: (activityId: string, comment: ActivityComment) => void;
};

const ActivityEngagementContext = createContext<ActivityEngagementContextValue | null>(null);

function buildInitialLikes() {
  return Object.fromEntries(
    friendLessonActivity.map((activity) => [activity.id, activity.likedByMe ?? false])
  );
}

function buildInitialComments() {
  return Object.fromEntries(
    friendLessonActivity.map((activity) => [activity.id, activity.comments ?? []])
  );
}

export function ActivityEngagementProvider({ children }: { children: ReactNode }) {
  const [likes, setLikes] = useState<Record<string, boolean>>(buildInitialLikes);
  const [comments, setComments] = useState<Record<string, ActivityComment[]>>(buildInitialComments);

  const isLiked = useCallback((activityId: string) => likes[activityId] ?? false, [likes]);

  const toggleLike = useCallback((activityId: string) => {
    setLikes((prev) => ({ ...prev, [activityId]: !(prev[activityId] ?? false) }));
  }, []);

  const getComments = useCallback(
    (activityId: string) => comments[activityId] ?? [],
    [comments]
  );

  const addComment = useCallback((activityId: string, comment: ActivityComment) => {
    setComments((prev) => ({
      ...prev,
      [activityId]: [...(prev[activityId] ?? []), comment],
    }));
  }, []);

  const value = useMemo(
    () => ({ isLiked, toggleLike, getComments, addComment }),
    [isLiked, toggleLike, getComments, addComment]
  );

  return (
    <ActivityEngagementContext.Provider value={value}>{children}</ActivityEngagementContext.Provider>
  );
}

export function useActivityEngagement(activityId: string) {
  const ctx = useContext(ActivityEngagementContext);
  if (!ctx) {
    throw new Error('useActivityEngagement must be used within ActivityEngagementProvider');
  }

  return {
    liked: ctx.isLiked(activityId),
    comments: ctx.getComments(activityId),
    toggleLike: () => ctx.toggleLike(activityId),
    addComment: (comment: ActivityComment) => ctx.addComment(activityId, comment),
  };
}
