export interface Bathymetry {
  ocean_depth_h0_m: number;
  coastal_depth_hc_m: string;
  distance_to_shore_d_km: number;
  specific_note?: string;
  source?: string;
}

export interface Topography {
  coastal_slope_percent: number;
  average_altitude_m_asl: string;
  manning_coefficient_n: number;
  source?: string;
}

export interface AtmosphereValue {
  direction: string;
  direction_deg: number;
  speed_kmh: string;
  speed_kmh_avg: number;
  tropopause_summer_km: number;
  tropopause_winter_km: number;
  note?: string;
}

export interface CityData {
  id: number | string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  educational_justification: string;
  historical_context?: {
    weapon?: string;
    test_name?: string;
    yield_kt?: number;
    yield_mt?: number;
    date?: string;
    burst_type?: string;
    burst_altitude_m?: number;
    note?: string;
  };
  bathymetry: Bathymetry;
  topography: Topography;
  atmosphere: AtmosphereValue;
}

import rawCitiesData from '../data/cities.json';

const parseAvgOrMid = (obj: any): number => {
  if (!obj) return 0;
  if (typeof obj === 'number') return obj;
  if (obj.min !== undefined && obj.max !== undefined) return (obj.min + obj.max) / 2;
  return 0;
};

export const CITIES_DATABASE: CityData[] = rawCitiesData.cities.map((city: any, index: number) => {
  return {
    id: city.id || index + 1,
    name: city.name,
    country: city.country,
    latitude: city.coordinates.lat,
    longitude: city.coordinates.lon,
    educational_justification: city.category === 'historical' 
      ? `Cible historique: ${city.historical_event || ''}` 
      : `Scénario géopolitique (${city.category})`,
    historical_context: city.category === 'historical' ? {
      weapon: city.historical_event,
      yield_kt: 15
    } : undefined,
    bathymetry: {
      ocean_depth_h0_m: parseAvgOrMid(city.bathymetry?.h0_m),
      coastal_depth_hc_m: city.bathymetry?.hc_m ? `${city.bathymetry.hc_m.min}-${city.bathymetry.hc_m.max} m` : "5-10 m",
      distance_to_shore_d_km: parseAvgOrMid(city.bathymetry?.d_km),
      specific_note: city.bathymetry?.notes,
      source: city.bathymetry?.source
    },
    topography: {
      coastal_slope_percent: parseAvgOrMid(city.topography?.coastal_slope_pct),
      average_altitude_m_asl: city.topography?.altitude_m?.center ? `${city.topography.altitude_m.center} m` : "10 m",
      manning_coefficient_n: parseAvgOrMid(city.topography?.manning_n) || 0.04,
      source: city.topography?.terrain_type
    },
    atmosphere: {
      direction: city.atmosphere?.summer?.wind?.cardinal || city.atmosphere?.annual?.wind?.cardinal || "NW",
      direction_deg: city.atmosphere?.summer?.wind?.direction_deg || city.atmosphere?.annual?.wind?.direction_deg || 315,
      speed_kmh: city.atmosphere?.summer?.wind?.speed_kmh ? `${city.atmosphere.summer.wind.speed_kmh.min}-${city.atmosphere.summer.wind.speed_kmh.max} km/h` : "15-20 km/h",
      speed_kmh_avg: city.atmosphere?.summer?.wind?.speed_kmh ? parseAvgOrMid(city.atmosphere.summer.wind.speed_kmh) : 15,
      tropopause_summer_km: parseAvgOrMid(city.atmosphere?.summer?.tropopause_km) || 12,
      tropopause_winter_km: parseAvgOrMid(city.atmosphere?.winter?.tropopause_km) || 10,
      note: `Station IGRA: ${city.atmosphere?.igra_station || 'N/A'}`
    }
  };
});

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearbyCity(lat: number, lng: number, maxDistanceKm: number = 25): CityData | null {
  let closest: CityData | null = null;
  let minD = Infinity;
  for (const city of CITIES_DATABASE) {
    const d = getDistanceKm(lat, lng, city.latitude, city.longitude);
    if (d < minD && d <= maxDistanceKm) {
      minD = d;
      closest = city;
    }
  }
  return closest;
}

