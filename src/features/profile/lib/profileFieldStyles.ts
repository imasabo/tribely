import type { StyleProp, ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';

/** Border width is always reserved on FormTextField; only color changes at the limit. */
export function charLimitOutlineStyle(count: number, limit: number): StyleProp<ViewStyle> {
  return {
    borderColor: count >= limit ? colors.destructive : 'transparent',
  };
}
