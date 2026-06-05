import { Text, View } from 'react-native';

import { ProfileCityPicker } from '@/features/profile/components/ProfileCityPicker';

interface ProfileCityFieldProps {
  value: string;
  onChange: (cityLabel: string) => void;
}

export function ProfileCityField({ value, onChange }: ProfileCityFieldProps) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">City</Text>
      <ProfileCityPicker value={value} onChange={onChange} hint="Optional" />
    </View>
  );
}
