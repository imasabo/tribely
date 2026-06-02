import { Pressable, Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
  className,
}: SectionHeaderProps) {
  return (
    <View className={`mb-3 flex-row items-center justify-between ${className ?? ''}`}>
      <Text className="text-[17px] font-semibold text-foreground">{title}</Text>
      {actionLabel ? (
        onActionPress ? (
          <Pressable onPress={onActionPress} hitSlop={8}>
            <Text className="text-sm text-primary">{actionLabel}</Text>
          </Pressable>
        ) : (
          <Text className="text-sm text-primary">{actionLabel}</Text>
        )
      ) : null}
    </View>
  );
}
