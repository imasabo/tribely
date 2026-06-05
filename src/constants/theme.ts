import tokens from './tokens.js';

export const colors = tokens.colors;

/** Full-screen background used across auth, tabs, and modals (#FAF9F6). */
export const screenStyle = {
  flex: 1,
  backgroundColor: colors.background,
} as const;

/** Navigator card/scene background (no flex — safe for Stack `contentStyle`). */
export const stackContentStyle = {
  backgroundColor: colors.background,
} as const;

export type ThemeColors = typeof colors;
