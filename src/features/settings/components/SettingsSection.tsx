import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  footer?: string;
}

export function SettingsSection({ title, children, footer }: SettingsSectionProps) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-[15px] font-semibold text-foreground">{title}</Text>
      <View className="overflow-hidden rounded-2xl border border-border bg-card">{children}</View>
      {footer ? (
        <Text className="mt-2 px-1 text-xs leading-5 text-muted-foreground">{footer}</Text>
      ) : null}
    </View>
  );
}

export function SettingsDivider() {
  return <View className="mx-4 h-px bg-border" />;
}
