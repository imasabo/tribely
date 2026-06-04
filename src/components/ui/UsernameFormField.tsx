import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
  View,
} from 'react-native';

import { colors } from '@/constants/theme';

import { FORM_FIELD_DEFAULT_HEIGHT } from './FormTextField';

const FONT_SIZE = 16;

export interface UsernameFormFieldProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export function UsernameFormField({
  containerStyle,
  style,
  placeholder = 'username',
  placeholderTextColor = colors.mutedForeground,
  autoCapitalize = 'none',
  autoCorrect = false,
  ...props
}: UsernameFormFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.prefixSlot}>
        <Text style={styles.prefix}>@</Text>
      </View>
      <TextInput
        {...props}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        multiline={false}
        scrollEnabled={false}
        blurOnSubmit
        returnKeyType="done"
        textAlignVertical="center"
        includeFontPadding={false}
        style={[styles.input, style as StyleProp<TextStyle>]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: FORM_FIELD_DEFAULT_HEIGHT,
    backgroundColor: colors.muted,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'visible',
  },
  prefixSlot: {
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 2,
  },
  prefix: {
    fontSize: FONT_SIZE,
    color: colors.mutedForeground,
    transform: [{ translateY: Platform.select({ ios: 2, android: 0.5, default: 0 }) }],
  },
  input: {
    flex: 1,
    height: FORM_FIELD_DEFAULT_HEIGHT,
    paddingRight: 16,
    paddingLeft: 0,
    paddingVertical: 0,
    margin: 0,
    fontSize: FONT_SIZE,
    color: colors.foreground,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
  },
});
