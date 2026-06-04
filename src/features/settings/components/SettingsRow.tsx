import { Feather } from '@expo/vector-icons';
import { Pressable, Switch, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

interface SettingsRowBaseProps {
  label: string;
  subtitle?: string;
  icon?: keyof typeof Feather.glyphMap;
}

interface SettingsNavRowProps extends SettingsRowBaseProps {
  onPress: () => void;
  showChevron?: boolean;
}

export function SettingsNavRow({
  label,
  subtitle,
  icon,
  onPress,
  showChevron = true,
}: SettingsNavRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-row items-center gap-3 px-4 py-3.5 active:opacity-80">
      {icon ? (
        <View className="h-9 w-9 items-center justify-center rounded-full bg-muted">
          <Feather name={icon} size={16} color={colors.primary} />
        </View>
      ) : null}
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-medium text-foreground">{label}</Text>
        {subtitle ? (
          <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {showChevron ? (
        <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
      ) : null}
    </Pressable>
  );
}

interface SettingsToggleRowProps extends SettingsRowBaseProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function SettingsToggleRow({
  label,
  subtitle,
  value,
  onValueChange,
}: SettingsToggleRowProps) {
  return (
    <View className="flex-row items-center gap-3 px-4 py-3.5">
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-medium text-foreground">{label}</Text>
        {subtitle ? (
          <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.muted, true: colors.primary }}
        thumbColor="#FFFFFF"
        accessibilityLabel={label}
      />
    </View>
  );
}

interface SettingsValueRowProps extends SettingsRowBaseProps {
  value: string;
}

export function SettingsValueRow({ label, subtitle, value }: SettingsValueRowProps) {
  return (
    <View className="flex-row items-center gap-3 px-4 py-3.5">
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-medium text-foreground">{label}</Text>
        {subtitle ? (
          <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Text className="text-sm text-muted-foreground">{value}</Text>
    </View>
  );
}
