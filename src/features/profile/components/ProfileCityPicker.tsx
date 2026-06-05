import { Feather } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { SearchField } from '@/components/ui/SearchBar';
import { colors } from '@/constants/theme';
import {
  formatDiscoverCityLabel,
  searchDiscoverCities,
  type DiscoverCity,
} from '@/data/discoverCities';

interface ProfileCityPickerProps {
  value: string;
  onChange: (cityLabel: string) => void;
  hint?: string;
}

function CityPickerSheet({
  visible,
  selectedLabel,
  onSelect,
  onClear,
  onClose,
}: {
  visible: boolean;
  selectedLabel: string;
  onSelect: (city: DiscoverCity) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (visible) setQuery('');
  }, [visible]);

  const filteredCities = useMemo(() => searchDiscoverCities(query), [query]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      accessibilityLabel="Close city picker"
      sheetClassName="max-h-[85%] px-5 pt-3"
      sheetStyle={{ paddingBottom: insets.bottom + 16 }}>
      <View className="mb-5 items-center">
        <View className="h-1 w-10 rounded-full bg-border" />
      </View>

      <Text className="mb-1 text-xl font-bold text-foreground">Choose a city</Text>
      <Text className="mb-4 text-sm leading-5 text-muted-foreground">
        Optional — helps others find lessons near you.
      </Text>

      <SearchField
        placeholder="Search cities…"
        value={query}
        onChangeText={setQuery}
        containerClassName="mb-3"
      />

      <ScrollView className="max-h-72" keyboardShouldPersistTaps="handled">
        {query.trim() ? (
          <Pressable
            onPress={() => {
              onClear();
              onClose();
            }}
            className="flex-row items-center justify-between border-b border-border py-3.5 active:opacity-80">
            <Text className="text-base text-muted-foreground">No city</Text>
            {!selectedLabel ? (
              <Feather name="check" size={18} color={colors.primary} />
            ) : null}
          </Pressable>
        ) : null}

        {filteredCities.map((city) => {
          const label = formatDiscoverCityLabel(city);
          const selected = selectedLabel === label;
          return (
            <Pressable
              key={city.id}
              onPress={() => {
                onSelect(city);
                onClose();
              }}
              className="flex-row items-center justify-between border-b border-border py-3.5 active:opacity-80">
              <View>
                <Text className="text-base font-medium text-foreground">{city.name}</Text>
                <Text className="text-sm text-muted-foreground">{city.region}</Text>
              </View>
              {selected ? (
                <Feather name="check" size={18} color={colors.primary} />
              ) : (
                <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
              )}
            </Pressable>
          );
        })}

        {filteredCities.length === 0 ? (
          <Text className="py-6 text-center text-sm text-muted-foreground">
            {query.trim()
              ? 'No cities match your search.'
              : 'Start typing to search for a city.'}
          </Text>
        ) : null}
      </ScrollView>
    </BottomSheet>
  );
}

export function ProfileCityPicker({
  value,
  onChange,
  hint = 'Optional',
}: ProfileCityPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <View className="gap-1.5">
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={value ? `City: ${value}` : 'Select a city'}
        className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 active:opacity-90">
        <Feather name="map-pin" size={18} color={colors.primary} />
        <Text
          className={`flex-1 text-base ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
          {value || 'Select a city'}
        </Text>
        <Feather name="chevron-down" size={18} color={colors.mutedForeground} />
      </Pressable>

      {value ? (
        <Pressable
          onPress={() => onChange('')}
          accessibilityRole="button"
          accessibilityLabel="Clear city"
          className="self-start active:opacity-70">
          <Text className="text-sm font-medium text-primary">Clear city</Text>
        </Pressable>
      ) : null}

      {hint ? <Text className="text-xs text-muted-foreground">{hint}</Text> : null}

      <CityPickerSheet
        visible={open}
        selectedLabel={value}
        onSelect={(city) => onChange(formatDiscoverCityLabel(city))}
        onClear={() => onChange('')}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}
