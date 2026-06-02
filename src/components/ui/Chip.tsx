import { Pressable, Text } from 'react-native';

interface ChipProps {
  label: string;
  emoji?: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, emoji, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2 flex-shrink-0 flex-row items-center gap-1.5 rounded-full border px-4 py-2 ${
        selected ? 'border-primary bg-primary' : 'border-border bg-card'
      }`}>
      {emoji ? <Text className="text-sm">{emoji}</Text> : null}
      <Text
        className={`text-[13px] font-medium ${selected ? 'text-primary-foreground' : 'text-foreground'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
