import { Text, View } from 'react-native';

import { FormTextField } from '@/components/ui/FormTextField';
import { charLimitOutlineStyle } from '@/features/profile/lib/profileFieldStyles';
import { PROFILE_BIO_CHAR_LIMIT, bioFieldHint } from '@/features/profile/lib/profileLimits';

interface ProfileBioFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  optional?: boolean;
}

export function ProfileBioField({
  value,
  onChangeText,
  optional = false,
}: ProfileBioFieldProps) {
  const hint = bioFieldHint(value.length, optional);
  const atLimit = value.length >= PROFILE_BIO_CHAR_LIMIT;

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">Bio</Text>
      <FormTextField
        variant="multiline"
        value={value}
        onChangeText={onChangeText}
        placeholder="A short intro"
        maxLength={PROFILE_BIO_CHAR_LIMIT}
        style={charLimitOutlineStyle(value.length, PROFILE_BIO_CHAR_LIMIT)}
      />
      {hint ? (
        <Text
          className={`text-xs ${atLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
