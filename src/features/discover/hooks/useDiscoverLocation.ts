import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, Linking, type AppStateStatus } from 'react-native';

import type { DiscoverCity } from '@/data/discoverCities';
import { loadUserArea, saveUserArea, type SavedUserArea } from '@/lib/userAreaStorage';
import type { DiscoverLocationMode } from '@/features/discover/lib/discoverLocation';
import { useAuth } from '@/providers/AuthProvider';

export interface DiscoverLocationState {
  mode: DiscoverLocationMode;
  fallbackCity?: string;
  coords: { latitude: number; longitude: number } | null;
  needsCityPicker: boolean;
  ensureLocation: () => Promise<void>;
  selectCity: (city: DiscoverCity) => Promise<void>;
  requestDeviceLocation: () => Promise<void>;
  openCityPicker: () => void;
  closeCityPicker: () => void;
}

export function useDiscoverLocation(): DiscoverLocationState {
  const { user } = useAuth();
  const userId = user?.uid ?? null;
  const resolvingRef = useRef(false);
  const modeRef = useRef<DiscoverLocationMode>('idle');

  const [mode, setMode] = useState<DiscoverLocationMode>('idle');
  const [fallbackCity, setFallbackCity] = useState<string | undefined>();
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [needsCityPicker, setNeedsCityPicker] = useState(false);

  modeRef.current = mode;

  const applySavedArea = useCallback((area: SavedUserArea) => {
    setFallbackCity(area.city);
    setCoords({ latitude: area.latitude, longitude: area.longitude });
    setMode('fallback');
    setNeedsCityPicker(false);
  }, []);

  const applyDeviceCoords = useCallback((latitude: number, longitude: number) => {
    setCoords({ latitude, longitude });
    setFallbackCity(undefined);
    setMode('device');
    setNeedsCityPicker(false);
  }, []);

  const loadDeviceLocation = useCallback(async (): Promise<boolean> => {
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      await applyDeviceCoords(position.coords.latitude, position.coords.longitude);
      return true;
    } catch {
      return false;
    }
  }, [applyDeviceCoords]);

  const requireCityOrSaved = useCallback(async () => {
    const saved = await loadUserArea(userId);
    if (saved?.city) {
      applySavedArea(saved);
      return;
    }
    setMode('needs_city');
    setNeedsCityPicker(true);
    setCoords(null);
    setFallbackCity(undefined);
  }, [applySavedArea, userId]);

  const resolvePermission = useCallback(async () => {
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      await requireCityOrSaved();
      return;
    }

    const existing = await Location.getForegroundPermissionsAsync();

    if (existing.status === 'granted') {
      const ok = await loadDeviceLocation();
      if (!ok) await requireCityOrSaved();
      return;
    }

    if (existing.status === 'undetermined') {
      const requested = await Location.requestForegroundPermissionsAsync();
      if (requested.status === 'granted') {
        const ok = await loadDeviceLocation();
        if (!ok) await requireCityOrSaved();
        return;
      }
    }

    await requireCityOrSaved();
  }, [loadDeviceLocation, requireCityOrSaved]);

  const syncLocationWithPermissions = useCallback(async () => {
    if (resolvingRef.current) return;

    resolvingRef.current = true;
    try {
      await resolvePermission();
    } finally {
      resolvingRef.current = false;
    }
  }, [resolvePermission]);

  const ensureLocation = useCallback(async () => {
    if (resolvingRef.current) return;

    resolvingRef.current = true;
    const isInitialResolve = modeRef.current === 'idle';
    if (isInitialResolve) {
      setMode('loading');
      setNeedsCityPicker(false);
    }

    try {
      await resolvePermission();
    } finally {
      resolvingRef.current = false;
    }
  }, [resolvePermission]);

  /** Re-check after user changes location permission in system Settings. */
  useEffect(() => {
    const onAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        void syncLocationWithPermissions();
      }
    };

    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, [syncLocationWithPermissions]);

  const promptOpenSettings = useCallback(() => {
    Alert.alert(
      'Turn on location',
      'Tribely needs location access to show lessons near you. iOS cannot ask again after you tap Don’t Allow — open Settings to enable location.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
            void Linking.openSettings();
          },
        },
      ]
    );
  }, []);

  const requestDeviceLocation = useCallback(async () => {
    setMode('loading');

    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      setMode('needs_city');
      setNeedsCityPicker(true);
      Alert.alert(
        'Location services off',
        'Turn on Location Services in your device settings to use your current position.'
      );
      return;
    }

    const existing = await Location.getForegroundPermissionsAsync();

    if (existing.status === 'granted') {
      const ok = await loadDeviceLocation();
      if (!ok) {
        setMode('needs_city');
        setNeedsCityPicker(true);
        Alert.alert(
          'Could not get location',
          'We could not read your position. Try again or pick a city below.'
        );
      }
      return;
    }

    if (existing.status === 'undetermined') {
      const requested = await Location.requestForegroundPermissionsAsync();
      if (requested.status === 'granted') {
        const ok = await loadDeviceLocation();
        if (!ok) {
          setMode('needs_city');
          setNeedsCityPicker(true);
          Alert.alert(
            'Could not get location',
            'We could not read your position. Try again or pick a city below.'
          );
        }
        return;
      }
      setMode('needs_city');
      setNeedsCityPicker(true);
      return;
    }

    // denied — iOS will not show the system dialog again; send user to Settings
    setMode('needs_city');
    setNeedsCityPicker(true);
    promptOpenSettings();
  }, [loadDeviceLocation, promptOpenSettings]);

  const selectCity = useCallback(
    async (city: DiscoverCity) => {
      const area: SavedUserArea = {
        city: `${city.name}, ${city.region}`,
        latitude: city.latitude,
        longitude: city.longitude,
      };
      await saveUserArea(userId, area);
      applySavedArea(area);
    },
    [applySavedArea, userId]
  );

  const openCityPicker = useCallback(() => {
    setMode('needs_city');
    setNeedsCityPicker(true);
  }, []);

  const closeCityPicker = useCallback(async () => {
    setNeedsCityPicker(false);
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      setMode('device');
      return;
    }
    if (fallbackCity) {
      setMode('fallback');
    } else {
      setMode('needs_city');
    }
  }, [fallbackCity]);

  return {
    mode,
    fallbackCity,
    coords,
    needsCityPicker,
    ensureLocation,
    selectCity,
    requestDeviceLocation,
    openCityPicker,
    closeCityPicker,
  };
}
