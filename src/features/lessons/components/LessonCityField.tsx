import { Text, View } from 'react-native';

import { ProfileCityPicker } from '@/features/profile/components/ProfileCityPicker';

interface LessonCityFieldProps {
  value: string;
  onChange: (cityLabel: string) => void;
  error?: string;
}

export function LessonCityField({ value, onChange, error }: LessonCityFieldProps) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">City</Text>
      <Text className="text-xs text-muted-foreground">
        Where will this lesson take place? Used to show it in Discover.
      </Text>
      <ProfileCityPicker value={value} onChange={onChange} hint={error ? undefined : 'Required'} />
      {error ? <Text className="text-xs text-destructive">{error}</Text> : null}
    </View>
  );
}
