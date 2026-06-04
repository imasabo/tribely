import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';

export function ProfileBlockedNotice() {
  return (
    <View className="flex-row items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2.5">
      <Feather name="slash" size={16} color={colors.mutedForeground} />
      <Text className="flex-1 text-sm text-muted-foreground">
        You blocked this person. They can't see your profile or contact you.
      </Text>
    </View>
  );
}
