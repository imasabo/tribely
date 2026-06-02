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
  isCommentLiked: (activityId: string, commentId: string) => boolean;
  toggleCommentLike: (activityId: string, commentId: string) => void;
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
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});

  const commentLikeKey = (activityId: string, commentId: string) => `${activityId}:${commentId}`;

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

  const isCommentLiked = useCallback(
    (activityId: string, commentId: string) =>
      commentLikes[commentLikeKey(activityId, commentId)] ?? false,
    [commentLikes]
  );

  const toggleCommentLike = useCallback((activityId: string, commentId: string) => {
    const key = commentLikeKey(activityId, commentId);
    setCommentLikes((prev) => ({ ...prev, [key]: !(prev[key] ?? false) }));
  }, []);

  const value = useMemo(
    () => ({
      isLiked,
      toggleLike,
      getComments,
      addComment,
      isCommentLiked,
      toggleCommentLike,
    }),
    [isLiked, toggleLike, getComments, addComment, isCommentLiked, toggleCommentLike]
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
    isCommentLiked: (commentId: string) => ctx.isCommentLiked(activityId, commentId),
    toggleCommentLike: (commentId: string) => ctx.toggleCommentLike(activityId, commentId),
  };
}
