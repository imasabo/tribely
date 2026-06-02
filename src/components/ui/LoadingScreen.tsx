import { ActivityIndicator, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

export function LoadingScreen({ message = 'Loading…' }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text className="mt-4 text-sm text-muted-foreground">{message}</Text>
    </View>
  );
}
