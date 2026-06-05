import { Feather } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { SearchField } from '@/components/ui/SearchBar';
import { colors } from '@/constants/theme';
import { searchDiscoverCities, type DiscoverCity } from '@/data/discoverCities';

interface ChooseCitySheetProps {
  visible: boolean;
  onSelectCity: (city: DiscoverCity) => void;
  onRequestLocation: () => void;
  onClose: () => void;
}

export function ChooseCitySheet({
  visible,
  onSelectCity,
  onRequestLocation,
  onClose,
}: ChooseCitySheetProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (visible) setQuery('');
  }, [visible]);

  const handleSelectCity = (city: DiscoverCity) => {
    setQuery('');
    onSelectCity(city);
  };

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

          <Text className="mb-1 text-xl font-bold text-foreground">Where should we show lessons?</Text>
          <Text className="mb-4 text-sm leading-5 text-muted-foreground">
            Location access is off. Search for a city, or tap Use my location — if you previously
            tapped Don't Allow, we'll open Settings so you can turn location on.
          </Text>

          <Button
            title="Use my location"
            variant="outline"
            fullWidth
            onPress={onRequestLocation}
            icon={<Feather name="navigation" size={16} color={colors.primary} />}
            className="mb-4"
          />

          <SearchField
            placeholder="Search cities…"
            value={query}
            onChangeText={setQuery}
            containerClassName="mb-3"
          />

          <ScrollView className="max-h-72" keyboardShouldPersistTaps="handled">
            {filteredCities.map((city) => (
              <Pressable
                key={city.id}
                onPress={() => handleSelectCity(city)}
                className="flex-row items-center justify-between border-b border-border py-3.5 active:opacity-80">
                <View>
                  <Text className="text-base font-medium text-foreground">{city.name}</Text>
                  <Text className="text-sm text-muted-foreground">{city.region}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
              </Pressable>
            ))}
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
