export interface DiscoverCity {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
}

/** Launch cities — expand as Tribely opens new markets. */
export const DISCOVER_CITIES: DiscoverCity[] = [
  {
    id: 'sf',
    name: 'San Francisco',
    region: 'CA',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    id: 'oakland',
    name: 'Oakland',
    region: 'CA',
    latitude: 37.8044,
    longitude: -122.2712,
  },
  {
    id: 'berkeley',
    name: 'Berkeley',
    region: 'CA',
    latitude: 37.8715,
    longitude: -122.273,
  },
  {
    id: 'san-jose',
    name: 'San Jose',
    region: 'CA',
    latitude: 37.3382,
    longitude: -121.8863,
  },
  {
    id: 'la',
    name: 'Los Angeles',
    region: 'CA',
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    id: 'nyc',
    name: 'New York',
    region: 'NY',
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    id: 'chicago',
    name: 'Chicago',
    region: 'IL',
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    id: 'austin',
    name: 'Austin',
    region: 'TX',
    latitude: 30.2672,
    longitude: -97.7431,
  },
  {
    id: 'seattle',
    name: 'Seattle',
    region: 'WA',
    latitude: 47.6062,
    longitude: -122.3321,
  },
  {
    id: 'portland',
    name: 'Portland',
    region: 'OR',
    latitude: 45.5152,
    longitude: -122.6784,
  },
];

export function getDiscoverCityById(id: string): DiscoverCity | undefined {
  return DISCOVER_CITIES.find((city) => city.id === id);
}

export function formatDiscoverCityLabel(city: DiscoverCity): string {
  return `${city.name}, ${city.region}`;
}

export function findDiscoverCityByLabel(label: string): DiscoverCity | undefined {
  const normalized = label.trim().toLowerCase();
  if (!normalized) return undefined;
  return DISCOVER_CITIES.find(
    (city) => formatDiscoverCityLabel(city).toLowerCase() === normalized
  );
}

/** Returns matches only after the user types; empty query → no results (search-first UX). */
export function searchDiscoverCities(query: string): DiscoverCity[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return DISCOVER_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(normalized) ||
      city.region.toLowerCase().includes(normalized)
  );
}
