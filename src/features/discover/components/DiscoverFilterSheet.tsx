import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/theme';
import {
  DEFAULT_DISCOVER_SHEET_FILTERS,
  DISCOVER_DISTANCE_OPTIONS,
  DISCOVER_DURATION_OPTIONS,
  DISCOVER_WHEN_OPTIONS,
  type DiscoverSheetFilters,
} from '@/features/discover/types';
import { toggleDuration } from '@/features/discover/lib/applyDiscoverFilters';
import type { LessonDurationMinutes } from '@/types/domain';

interface DiscoverFilterSheetProps {
  visible: boolean;
  draft: DiscoverSheetFilters;
  onChange: (filters: DiscoverSheetFilters) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-4 py-2.5 active:opacity-80 ${
        selected ? 'border-primary bg-secondary' : 'border-border bg-card'
      }`}>
      <Text
        className={`text-[13px] font-medium ${selected ? 'text-primary' : 'text-foreground'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text className="mb-3 text-sm font-semibold text-foreground">{title}</Text>;
}

export function DiscoverFilterSheet({
  visible,
  draft,
  onChange,
  onApply,
  onReset,
  onClose,
}: DiscoverFilterSheetProps) {
  const insets = useSafeAreaInsets();

  const setDistance = (distanceMiles: DiscoverSheetFilters['distanceMiles']) => {
    onChange({ ...draft, distanceMiles });
  };

  const setWhen = (when: DiscoverSheetFilters['when']) => {
    onChange({ ...draft, when });
  };

  const setDuration = (duration: LessonDurationMinutes) => {
    onChange({ ...draft, durations: toggleDuration(draft.durations, duration) });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} accessibilityLabel="Close filters" />

        <View
          className="rounded-t-3xl bg-background px-5 pt-3"
          style={{ paddingBottom: insets.bottom + 16 }}>
          <View className="mb-5 items-center">
            <View className="h-1 w-10 rounded-full bg-border" />
          </View>

          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-foreground">Filters</Text>
            <Pressable
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full bg-muted active:opacity-80">
              <Feather name="x" size={18} color={colors.foreground} />
            </Pressable>
          </View>

          <SectionTitle title="Distance" />
          <View className="mb-6 flex-row flex-wrap gap-2">
            {DISCOVER_DISTANCE_OPTIONS.map((miles) => (
              <FilterChip
                key={miles}
                label={`${miles} mi`}
                selected={draft.distanceMiles === miles}
                onPress={() => setDistance(miles)}
              />
            ))}
          </View>

          <SectionTitle title="When" />
          <View className="mb-6 flex-row flex-wrap gap-2">
            {DISCOVER_WHEN_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                selected={draft.when === opt.value}
                onPress={() => setWhen(opt.value)}
              />
            ))}
          </View>

          <SectionTitle title="Duration" />
          <View className="mb-8 flex-row flex-wrap gap-2">
            {DISCOVER_DURATION_OPTIONS.map((minutes) => (
              <FilterChip
                key={minutes}
                label={`${minutes} min`}
                selected={draft.durations.includes(minutes)}
                onPress={() => setDuration(minutes)}
              />
            ))}
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button title="Reset" variant="outline" fullWidth onPress={onReset} />
            </View>
            <View className="flex-1">
              <Button title="Apply" fullWidth onPress={onApply} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function cloneDefaultSheetFilters(): DiscoverSheetFilters {
  return {
    ...DEFAULT_DISCOVER_SHEET_FILTERS,
    durations: [...DEFAULT_DISCOVER_SHEET_FILTERS.durations],
  };
}
