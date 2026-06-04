import { useCallback, useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/constants/theme';

const FONT_SIZE = 16;
const LINE_HEIGHT = 24;
const FIELD_BORDER_WIDTH = 1.5;
const HORIZONTAL_PADDING = 16;
const VERTICAL_PADDING = 14;

export const GROWABLE_FIELD_DEFAULT_HEIGHT = 52;
const INPUT_VERTICAL_INSET = VERTICAL_PADDING * 2 + FIELD_BORDER_WIDTH * 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  measure: {
    position: 'absolute',
    top: VERTICAL_PADDING,
    left: HORIZONTAL_PADDING,
    right: HORIZONTAL_PADDING,
    opacity: 0,
    zIndex: -1,
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    color: colors.foreground,
  },
  input: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: VERTICAL_PADDING,
    paddingBottom: VERTICAL_PADDING,
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

export interface GrowableTextFieldProps extends TextInputProps {
  maxHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export function GrowableTextField({
  value = '',
  onChangeText,
  maxHeight = 104,
  style,
  containerStyle,
  placeholderTextColor = colors.mutedForeground,
  ...props
}: GrowableTextFieldProps) {
  const [height, setHeight] = useState(GROWABLE_FIELD_DEFAULT_HEIGHT);
  const text = typeof value === 'string' ? value : '';

  useEffect(() => {
    if (text.length === 0) {
      setHeight(GROWABLE_FIELD_DEFAULT_HEIGHT);
    }
  }, [text]);

  const clampHeight = useCallback(
    (contentHeight: number) => {
      const next = Math.ceil(contentHeight + INPUT_VERTICAL_INSET);
      setHeight(
        Math.min(maxHeight, Math.max(GROWABLE_FIELD_DEFAULT_HEIGHT, next))
      );
    },
    [maxHeight]
  );

  const handleMeasureLayout = useCallback(
    (event: LayoutChangeEvent) => {
      clampHeight(event.nativeEvent.layout.height);
    },
    [clampHeight]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Text key={text} style={styles.measure} onLayout={handleMeasureLayout}>
        {text.length > 0 ? text : ' '}
      </Text>
      <TextInput
        {...props}
        value={value}
        onChangeText={onChangeText}
        multiline
        scrollEnabled={height >= maxHeight}
        placeholderTextColor={placeholderTextColor}
        includeFontPadding={Platform.OS === 'android' ? false : undefined}
        style={[
          styles.input,
          { height, minHeight: GROWABLE_FIELD_DEFAULT_HEIGHT, maxHeight },
          style as StyleProp<TextStyle>,
        ]}
      />
    </View>
  );
}
