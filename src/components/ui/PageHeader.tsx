import type { ReactNode } from 'react';
import { Text, View, type ViewProps } from 'react-native';

interface PageHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
}

export function PageHeader({ title, subtitle, trailing, className, ...props }: PageHeaderProps) {
  return (
    <View className={`flex-row items-center justify-between ${className ?? ''}`} {...props}>
      <View className="flex-1 pr-3">
        {subtitle ? <Text className="text-sm text-muted-foreground">{subtitle}</Text> : null}
        <Text className="text-[22px] font-bold tracking-tight text-foreground">{title}</Text>
      </View>
      {trailing ? <View className="flex-row items-center gap-2">{trailing}</View> : null}
    </View>
  );
}
