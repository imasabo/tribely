import { type ReactNode } from 'react';
import { Keyboard, Pressable, type StyleProp, type ViewStyle } from 'react-native';

interface DismissKeyboardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Dismisses the keyboard when the user taps outside focused inputs. */
export function DismissKeyboard({ children, style }: DismissKeyboardProps) {
  return (
    <Pressable
      style={[{ flex: 1 }, style]}
      onPress={Keyboard.dismiss}
      accessible={false}>
      {children}
    </Pressable>
  );
}
