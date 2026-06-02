import { ScrollView } from 'react-native';

import { Chip } from '@/components/ui/Chip';

export interface ChipItem {
  id: string;
  label: string;
  emoji?: string;
}

interface HorizontalChipListProps {
  items: ChipItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function HorizontalChipList({
  items,
  selectedId,
  onSelect,
  className,
}: HorizontalChipListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={`mb-5 px-5 ${className ?? ''}`}
      contentContainerStyle={{ paddingRight: 20 }}>
      {items.map((item) => (
        <Chip
          key={item.id}
          label={item.label}
          emoji={item.emoji}
          selected={item.id === selectedId}
          onPress={onSelect ? () => onSelect(item.id) : undefined}
        />
      ))}
    </ScrollView>
  );
}
