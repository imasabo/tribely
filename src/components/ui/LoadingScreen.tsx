import { ActivityIndicator, Text, View } from 'react-native';

import { colors, screenStyle } from '@/constants/theme';

export function LoadingScreen({ message = 'Loading…' }: { message?: string }) {
  return (
    <View style={[screenStyle, { alignItems: 'center', justifyContent: 'center' }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text className="mt-4 text-sm text-muted-foreground">{message}</Text>
    </View>
  );
}
