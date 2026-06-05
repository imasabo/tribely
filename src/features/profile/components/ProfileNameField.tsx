import { Text, View } from 'react-native';

import { FormTextField } from '@/components/ui/FormTextField';
import { charLimitOutlineStyle } from '@/features/profile/lib/profileFieldStyles';
import {
  PROFILE_NAME_CHAR_LIMIT,
  displayNameFieldHint,
} from '@/features/profile/lib/profileLimits';

interface ProfileNameFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string | null;
  onBlur?: () => void;
  autoFocus?: boolean;
  /** Show length guidance when there is no validation error (e.g. onboarding). */
  showRangeHint?: boolean;
}

export function ProfileNameField({
  value,
  onChangeText,
  error = null,
  onBlur,
  autoFocus,
  showRangeHint = false,
}: ProfileNameFieldProps) {
  const atLimit = value.length >= PROFILE_NAME_CHAR_LIMIT;
  const hint = error
    ? error
    : atLimit
      ? `${PROFILE_NAME_CHAR_LIMIT} character limit reached.`
      : showRangeHint
        ? displayNameFieldHint(value.length, null)
        : null;
  const hintIsError = !!error || atLimit;

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">Name</Text>
      <FormTextField
        variant="multiline"
        value={value}
        onChangeText={onChangeText}
        placeholder="Your name"
        maxLength={PROFILE_NAME_CHAR_LIMIT}
        scrollEnabled={false}
        autoFocus={autoFocus}
        onBlur={onBlur}
        style={[
          { minHeight: 52, maxHeight: 80 },
          charLimitOutlineStyle(value.length, PROFILE_NAME_CHAR_LIMIT),
        ]}
      />
      {hint ? (
        <Text
          className={`text-xs ${hintIsError ? 'text-destructive' : 'text-muted-foreground'}`}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
