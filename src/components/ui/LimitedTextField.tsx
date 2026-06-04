import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/constants/theme';

interface LimitedTextFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  maxLength: number;
  multiline?: boolean;
}

export function LimitedTextField({
  label,
  value,
  onChangeText,
  maxLength,
  multiline = false,
  placeholder,
  ...textInputProps
}: LimitedTextFieldProps) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={`rounded-xl bg-muted px-4 text-base text-foreground ${
          multiline ? 'min-h-[100px] py-3.5' : 'py-3.5'
        }`}
        {...textInputProps}
      />
      {value.length > 0 ? (
        <Text className="text-right text-xs text-muted-foreground">
          {value.length}/{maxLength}
        </Text>
      ) : null}
    </View>
  );
}
