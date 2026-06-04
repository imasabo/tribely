import {
  Platform,
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from 'react-native';

import { colors } from '@/constants/theme';

const FONT_SIZE = 16;
const FIELD_BORDER_WIDTH = 1.5;
const LINE_HEIGHT = 24;
export const FORM_FIELD_DEFAULT_HEIGHT = 52;
const SINGLE_LINE_HEIGHT = FORM_FIELD_DEFAULT_HEIGHT;
const HORIZONTAL_PADDING = 16;

const styles = StyleSheet.create({
  singleLine: {
    minHeight: SINGLE_LINE_HEIGHT,
    maxHeight: SINGLE_LINE_HEIGHT,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: Platform.select({ ios: 15, default: 13 }),
    paddingBottom: Platform.select({ ios: 15, default: 13 }),
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    color: colors.foreground,
    backgroundColor: colors.muted,
    borderRadius: 12,
    borderWidth: FIELD_BORDER_WIDTH,
    borderColor: 'transparent',
    overflow: 'visible',
  },
  multiline: {
    minHeight: 100,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    color: colors.foreground,
    backgroundColor: colors.muted,
    borderRadius: 12,
    borderWidth: FIELD_BORDER_WIDTH,
    borderColor: 'transparent',
    textAlignVertical: 'top',
  },
});

export interface FormTextFieldProps extends TextInputProps {
  variant?: 'singleLine' | 'multiline';
}

/**
 * Text field styled without NativeWind on TextInput — avoids descender clipping (g, j, y).
 * Single-line uses multiline on iOS for correct glyph metrics.
 */
export function FormTextField({
  variant = 'singleLine',
  style,
  placeholderTextColor = colors.mutedForeground,
  multiline: multilineProp,
  scrollEnabled: scrollEnabledProp,
  blurOnSubmit: blurOnSubmitProp,
  returnKeyType: returnKeyTypeProp,
  textAlignVertical: textAlignVerticalProp,
  ...props
}: FormTextFieldProps) {
  const isSingleLine = variant === 'singleLine';
  const baseStyle = isSingleLine ? styles.singleLine : styles.multiline;

  return (
    <TextInput
      placeholderTextColor={placeholderTextColor}
      includeFontPadding={Platform.OS === 'android' ? false : undefined}
      {...props}
      multiline={isSingleLine ? true : (multilineProp ?? true)}
      scrollEnabled={isSingleLine ? false : scrollEnabledProp}
      blurOnSubmit={isSingleLine ? true : blurOnSubmitProp}
      returnKeyType={isSingleLine ? (returnKeyTypeProp ?? 'done') : returnKeyTypeProp}
      textAlignVertical={textAlignVerticalProp ?? 'top'}
      style={[baseStyle, style as StyleProp<TextStyle>]}
    />
  );
}
