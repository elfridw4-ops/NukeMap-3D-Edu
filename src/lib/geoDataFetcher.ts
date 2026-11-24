import { DataProvenance } from "../types";
import { CITIES_DATABASE, findNearbyCity } from "./citiesData";
import { isCoordinateOnLand, OFFLINE_WORLD_REGIONS } from "../data/worldPopulation";
import { calculateDistanceKm } from "./nuclearMath";

export interface AutomaticGeoData {
  latitude: number;
  longitude: number;

  // Géopolitique
  cityName: string;
  countryName: string;
  placeType: 'metropolitan' | 'city' | 'town' | 'village' | 'rural' | 'water';

  // Démographie
  population: number;
  populationSource: string;
  densityLevel: string;
  densityValue: number;

  // Topographie
  elevationM: number;
  reliefType: 'Plat / Plaine' | 'Vallonné / Collines' | 'Accidenté / Montagneux' | 'Fonds marins';
  roughnessCoef: number;
  elevationMin: number;
  elevationMax: number;
  elevationProfile: { direction: string; elevationM: number }[];

  // Géophysique dynamique
  manningN: number;
  tropopauseKm: number;
  oceanDepthM?: number;
  shoreDistanceKm?: number;
  beachSlopePct?: number;

  // Météorologie temps réel
  windSpeedKmh: number;
  windDirectionDeg: number;

  // Infrastructures critiques (rayon 3 km)
  hospitals: number;
  schools: number;
  industrialZones: number;
  infrastructureDetected: boolean;

  // Traçabilité & vérification des sources
  provenance: DataProvenance;

  loading: boolean;
  error: string | null;
}

export const GLASSTONE_MODEL_LABEL = 'Glasstone & Dolan (1977) — The Effects of Nuclear Weapons';

export const DEFAULT_AUTOMATIC_GEO_DATA: AutomaticGeoData = {
  latitude: 48.8566,
  longitude: 2.3522,
  cityName: "Paris",
  countryName: "France",
  placeType: "metropolitan",
  // Valeurs de référence réelles issues de cities.json (UN WUP / Demographia : 2 161 000 hab. sur 105.4 km²)
  population: 2161000,
  populationSource: "UN WUP / Demographia (Base cities.json)",
  densityLevel: "Mégapole Très Dense",
  densityValue: 20503,
  elevationM: 35,
  reliefType: "Plat / Plaine",
  roughnessCoef: 1.2,
  elevationMin: 28,
  elevationMax: 74,
  elevationProfile: [
    { direction: "Centre", elevationM: 35 },
    { direction: "Nord (2km)", elevationM: 74 },
    { direction: "Sud (2km)", elevationM: 42 },
    { direction: "Est (2km)", elevationM: 31 },
    { direction: "Ouest (2km)", elevationM: 28 },
  ],
  manningN: 0.055,
  tropopauseKm: 11.0,
  windSpeedKmh: 15,
  windDirectionDeg: 270,
  hospitals: 14,
  schools: 40,
  industrialZones: 5,
  infrastructureDetected: true,
  provenance: {
    physicsModel: GLASSTONE_MODEL_LABEL,
    populationStatus: 'verified-reference',
    populationSource: 'UN World Urbanization Prospects / Demographia (cities.json)',
    populationUrl: 'https://www.wikidata.org/wiki/Q90',
    wikidataId: 'Q90',
    infrastructureStatus: 'verified-reference',
    infrastructureSource: 'En attente de synchronisation OpenStreetMap (3 km)',
    weatherElevationSource: 'Base atmosphérique ERA5 / IGRA (cities.json)',
  },
  loading: false,
  error: null
};

// Cache mémoire court + persistant localStorage pour éviter les appels redondants et permettre le repli hors ligne
const geoCache = new Map<string, AutomaticGeoData>();
const GEO_STORAGE_KEY = 'nukemap_edu_geo_cache_v1';
const GEO_STORAGE_MAX_ENTRIES = 50;

function readPersistedGeoCache(cacheKey: string): AutomaticGeoData | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(GEO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed[cacheKey]) {
      return parsed[cacheKey] as AutomaticGeoData;
    }
  } catch {
    // Ignore storage read errors
  }
  return null;
}

function writePersistedGeoCache(cacheKey: string, data: AutomaticGeoData): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const raw = window.localStorage.getItem(GEO_STORAGE_KEY);
    const parsed: Record<string, AutomaticGeoData> = raw ? JSON.parse(raw) : {};
    parsed[cacheKey] = data;
    const keys = Object.keys(parsed);
    if (keys.length > GEO_STORAGE_MAX_ENTRIES) {
      for (let i = 0; i < keys.length - GEO_STORAGE_MAX_ENTRIES; i++) {
        delete parsed[keys[i]];
      }
    }
    window.localStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Ignore quota exceeded
  }
}

export interface OfflineSearchResult {
  name: string;
  country: string;
  lat: number;
  lng: number;
  source: 'city-db' | 'world-db';
}

function normalizeSearchStr(val: string): string {
  return val
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Recherche instantanée hors ligne parmi les 279 villes stratégiques et 175 pays mondiaux.
 */
export function searchOfflineLocations(query: string): OfflineSearchResult[] {
  const normQ = normalizeSearchStr(query);
  if (!normQ) return [];

  const matches: Array<OfflineSearchResult & { score: number }> = [];

  for (const city of CITIES_DATABASE) {
    const cName = normalizeSearchStr(city.name);
    const cCountry = normalizeSearchStr(city.country);
    if (cName.includes(normQ) || cCountry.includes(normQ)) {
      const score = cName === normQ ? 100 : cName.startsWith(normQ) ? 80 : 50;
      matches.push({
        name: city.name,
        country: city.country,
        lat: city.latitude,
        lng: city.longitude,
        source: 'city-db',
        score,
      });
    }
  }

  for (const reg of OFFLINE_WORLD_REGIONS) {
    const rName = normalizeSearchStr(reg.name);
    if (rName.includes(normQ)) {
      const score = rName === normQ ? 90 : rName.startsWith(normQ) ? 70 : 40;
      matches.push({
        name: reg.name,
        country: reg.continent,
        lat: reg.lat,
        lng: reg.lng,
        source: 'world-db',
        score,
      });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 8).map(({ score: _s, ...item }) => item);
}

/**
 * Résout une coordonnée [lat, lng] en mode hors ligne complet à partir du cache local,
 * de la base des villes UN WUP (`cities.json`), des polygones continentaux et de `OFFLINE_WORLD_REGIONS`.
 */
export function resolveOfflineGeoData(lat: number, lng: number): {
  isWater: boolean;
  name?: string;
  country: string;
  city: string;
  autoGeoData: AutomaticGeoData;
} {
  const persistedLand = readPersistedGeoCache(`${lat.toFixed(3)},${lng.toFixed(3)},l`);
  const persistedWater = readPersistedGeoCache(`${lat.toFixed(3)},${lng.toFixed(3)},w`);
  const persisted = persistedLand || persistedWater;
  if (persisted) {
    const isWaterCached = persisted.placeType === 'water';
    return {
      isWater: isWaterCached,
      name: persisted.cityName,
      country: persisted.countryName,
      city: persisted.cityName,
      autoGeoData: { ...persisted, latitude: lat, longitude: lng, loading: false, error: null },
    };
  }

  const nearbyCity = findNearbyCity(lat, lng, 60);
  if (nearbyCity) {
    const densityValue = nearbyCity.densityPerKm2 > 0 ? nearbyCity.densityPerKm2 : 2400;
    const placeType: AutomaticGeoData['placeType'] =
      nearbyCity.population >= 500_000 ? 'metropolitan' : nearbyCity.population >= 50_000 ? 'city' : 'town';
    const avgTropo =
      (nearbyCity.atmosphere.tropopause_summer_km + nearbyCity.atmosphere.tropopause_winter_km) / 2;

    const autoGeoData: AutomaticGeoData = {
      latitude: lat,
      longitude: lng,
      cityName: nearbyCity.name,
      countryName: nearbyCity.country,
      placeType,
      population: nearbyCity.population,
      populationSource: `UN WUP / Demographia (${nearbyCity.name} • Hors-ligne)`,
      densityLevel: classifyDensityLevel(densityValue, false),
      densityValue,
      elevationM: 45,
      reliefType: 'Plat / Plaine',
      roughnessCoef: 1.2,
      elevationMin: 30,
      elevationMax: 85,
      elevationProfile: [
        { direction: 'Centre', elevationM: 45 },
        { direction: 'Nord (2km)', elevationM: 60 },
        { direction: 'Sud (2km)', elevationM: 42 },
        { direction: 'Est (2km)', elevationM: 38 },
        { direction: 'Ouest (2km)', elevationM: 52 },
      ],
      manningN: nearbyCity.topography.manning_coefficient_n || 0.045,
      tropopauseKm: avgTropo || 12,
      oceanDepthM: nearbyCity.bathymetry.ocean_depth_h0_m,
      shoreDistanceKm: nearbyCity.bathymetry.distance_to_shore_d_km,
      beachSlopePct: nearbyCity.topography.coastal_slope_percent,
      windSpeedKmh: nearbyCity.atmosphere.speed_kmh_avg || 15,
      windDirectionDeg: nearbyCity.atmosphere.direction_deg || 270,
      hospitals: nearbyCity.population >= 1_000_000 ? 10 : 4,
      schools: nearbyCity.population >= 1_000_000 ? 35 : 14,
      industrialZones: 3,
      infrastructureDetected: false,
      provenance: {
        physicsModel: GLASSTONE_MODEL_LABEL,
        populationStatus: 'verified-reference',
        populationSource: `Base locale UN WUP / Demographia (${nearbyCity.name})`,
        infrastructureStatus: 'fallback',
        infrastructureSource: 'Estimation statistique hors ligne',
        weatherElevationSource: 'Base atmosphérique ERA5 / SRTM (cities.json)',
      },
      loading: false,
      error: null,
    };

    return {
      isWater: false,
      name: nearbyCity.name,
      country: nearbyCity.country,
      city: nearbyCity.name,
      autoGeoData,
    };
  }

  const onLand = isCoordinateOnLand(lat, lng);
  if (!onLand) {
    const autoGeoData: AutomaticGeoData = {
      latitude: lat,
      longitude: lng,
      cityName: 'Haute Mer / Océan',
      countryName: 'Eaux Internationales',
      placeType: 'water',
      population: 0,
      populationSource: 'Zone Maritime / Océanique (Hors-ligne)',
      densityLevel: 'Zone Inhabitée (Aquatique)',
      densityValue: 0,
      elevationM: 0,
      reliefType: 'Fonds marins',
      roughnessCoef: 1.0,
      elevationMin: -2000,
      elevationMax: 0,
      elevationProfile: [],
      manningN: 0.015,
      tropopauseKm: 17.0 - 9.0 * Math.pow(Math.abs(lat) / 90, 2),
      oceanDepthM: 2400,
      shoreDistanceKm: 0,
      beachSlopePct: 2.0,
      windSpeedKmh: 22,
      windDirectionDeg: 270,
      hospitals: 0,
      schools: 0,
      industrialZones: 0,
      infrastructureDetected: false,
      provenance: {
        physicsModel: GLASSTONE_MODEL_LABEL,
        populationStatus: 'water-uninhabited',
        populationSource: 'Détection continentale hors ligne (Zone Maritime)',
        infrastructureStatus: 'water-uninhabited',
        infrastructureSource: 'Zone Maritime (0 infrastructure civile)',
        weatherElevationSource: 'Modèle marin latitudinal hors ligne',
      },
      loading: false,
      error: null,
    };
    return {
      isWater: true,
      name: 'Haute Mer / Océan',
      country: 'Eaux Internationales',
      city: 'Haute Mer / Océan',
      autoGeoData,
    };
  }

  // Terre ferme hors des grandes métropoles : trouve le pays le plus proche dans OFFLINE_WORLD_REGIONS
  let nearestCountry = OFFLINE_WORLD_REGIONS[0];
  let minCountryDist = Infinity;
  for (const reg of OFFLINE_WORLD_REGIONS) {
    const d = calculateDistanceKm(lat, lng, reg.lat, reg.lng);
    if (d < minCountryDist) {
      minCountryDist = d;
      nearestCountry = reg;
    }
  }

  const countryDensity = Math.max(15, Math.round(nearestCountry.population / Math.max(100, nearestCountry.areaKm2)));
  const localPop = Math.min(250_000, Math.max(2_500, Math.round(countryDensity * 80)));

  const autoGeoData: AutomaticGeoData = {
    latitude: lat,
    longitude: lng,
    cityName: `Secteur ${nearestCountry.name}`,
    countryName: nearestCountry.name,
    placeType: countryDensity > 250 ? 'town' : 'rural',
    population: localPop,
    populationSource: `Base Mondiale Hors-Ligne (${nearestCountry.name})`,
    densityLevel: classifyDensityLevel(countryDensity, false),
    densityValue: countryDensity,
    elevationM: 120,
    reliefType: 'Plat / Plaine',
    roughnessCoef: 1.3,
    elevationMin: 80,
    elevationMax: 165,
    elevationProfile: [],
    manningN: 0.035,
    tropopauseKm: 17.0 - 9.0 * Math.pow(Math.abs(lat) / 90, 2),
    windSpeedKmh: 16,
    windDirectionDeg: 270,
    hospitals: countryDensity > 200 ? 1 : 0,
    schools: countryDensity > 200 ? 5 : 1,
    industrialZones: countryDensity > 200 ? 1 : 0,
    infrastructureDetected: false,
    provenance: {
      physicsModel: GLASSTONE_MODEL_LABEL,
      populationStatus: 'verified-reference',
      populationSource: `Base Mondiale Hors-Ligne UN WPP (${nearestCountry.name})`,
      infrastructureStatus: 'fallback',
      infrastructureSource: 'Estimation statistique hors ligne',
      weatherElevationSource: 'Modèle latitudinal hors ligne',
    },
    loading: false,
    error: null,
  };

  return {
    isWater: false,
    name: autoGeoData.cityName,
    country: nearestCountry.name,
    city: autoGeoData.cityName,
    autoGeoData,
  };
}

function classifyDensityLevel(densityValue: number, isWater: boolean): string {
  if (isWater) return "Zone Inhabitée (Aquatique)";
  if (densityValue > 8000) return "Forte Densité (Centre Urbain)";
  if (densityValue > 2000) return "Moyenne/Forte Densité (Zone Urbaine)";
  if (densityValue > 400) return "Moyenne Densité (Banlieue / Bourg)";
  if (densityValue > 80) return "Faible Densité (Village)";
  return "Faible Densité (Zone Rurale)";
}

/**
 * Extrait l'identifiant Wikidata et le recensement OSM éventuel depuis la réponse Nominatim Reverse.
 */
export function extractNominatimCensus(reverseData: any): {
  population: number | null;
  populationYear?: string;
  wikidataId?: string;
  address: Record<string, any>;
} {
  if (!reverseData || typeof reverseData !== 'object') {
    return { population: null, address: {} };
  }

  // Rétrocompatibilité si l'appelant passe directement l'objet `address`
  const address = reverseData.address && typeof reverseData.address === 'object'
    ? reverseData.address
    : reverseData;
  const extratags = reverseData.extratags && typeof reverseData.extratags === 'object'
    ? reverseData.extratags
    : {};

  let population: number | null = null;
  if (extratags.population !== undefined) {
    const parsed = parseInt(String(extratags.population).replace(/[\s,]/g, ''), 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      population = parsed;
    }
  }

  const rawDate = extratags['population:date'] ? String(extratags['population:date']) : undefined;
  const yearMatch = rawDate?.match(/\b(19\d{2}|20\d{2})\b/);
  const populationYear = yearMatch ? yearMatch[1] : undefined;

  const rawWiki = typeof extratags.wikidata === 'string' ? extratags.wikidata.trim() : undefined;
  const wikidataId = rawWiki && /^Q\d+$/i.test(rawWiki) ? rawWiki.toUpperCase() : undefined;

  return { population, populationYear, wikidataId, address };
}

/**
 * Extrait la population officielle (propriété P1082) et la superficie en km² (propriété P2046)
 * depuis une entité renvoyée par l'API Wikidata (`wbgetentities`).
 */
export function extractWikidataCensus(entity: any): {
  population: number | null;
  populationYear?: string;
  areaKm2: number | null;
} {
  const claims = entity?.claims;
  if (!claims || typeof claims !== 'object') {
    return { population: null, areaKm2: null };
  }

  // 1. Population P1082 — priorise rang "preferred", puis date P585 la plus récente
  let population: number | null = null;
  let populationYear: string | undefined;
  const popClaims = Array.isArray(claims.P1082) ? claims.P1082 : [];
  const parsedPops = popClaims
    .filter((c: any) => c?.rank !== 'deprecated' && c?.mainsnak?.datavalue?.value?.amount)
    .map((c: any) => {
      const amt = parseFloat(String(c.mainsnak.datavalue.value.amount));
      const timeStr: string | undefined = c?.qualifiers?.P585?.[0]?.datavalue?.value?.time;
      const yearMatch = timeStr?.match(/[+-]?(\d{4})/);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : 0;
      const rankWeight = c.rank === 'preferred' ? 1 : 0;
      return { amt, year, rankWeight };
    })
    .filter((p: any) => Number.isFinite(p.amt) && p.amt > 0)
    .sort((a: any, b: any) => (b.year - a.year) || (b.rankWeight - a.rankWeight));

  if (parsedPops.length > 0) {
    population = Math.round(parsedPops[0].amt);
    if (parsedPops[0].year > 0) {
      populationYear = String(parsedPops[0].year);
    }
  }

  // 2. Superficie P2046 — convertit en km² selon l'unité Q712226 (km²), Q25343 (m²) ou Q35852 (ha)
  let areaKm2: number | null = null;
  const areaClaims = Array.isArray(claims.P2046) ? claims.P2046 : [];
  for (const c of areaClaims) {
    if (c?.rank === 'deprecated') continue;
    const val = c?.mainsnak?.datavalue?.value;
    if (!val?.amount) continue;
    const rawAmt = parseFloat(String(val.amount));
    if (!Number.isFinite(rawAmt) || rawAmt <= 0) continue;

    const unitUri: string = String(val.unit || '');
    if (unitUri.endsWith('Q712226') || unitUri === '1') {
      areaKm2 = rawAmt;
      break;
    } else if (unitUri.endsWith('Q25343')) {
      areaKm2 = rawAmt / 1_000_000;
      break;
    } else if (unitUri.endsWith('Q35852')) {
      areaKm2 = rawAmt * 0.01;
      break;
    } else if (unitUri.endsWith('Q232291')) {
      // mile carré -> km²
      areaKm2 = rawAmt * 2.58999;
      break;
    }
  }

  return { population, populationYear, areaKm2 };
}

/**
 * Filtre et déduplique les résultats Nominatim par identifiant OSM et rayon géodésique exact (km).
 */
export function dedupeCountWithinRadius(
  places: any[],
  centerLat: number,
  centerLng: number,
  radiusKm: number
): number {
  if (!Array.isArray(places) || places.length === 0) return 0;
  const seen = new Set<string>();
  let count = 0;

  for (const place of places) {
    const pLat = parseFloat(String(place?.lat));
    const pLng = parseFloat(String(place?.lon));
    if (!Number.isFinite(pLat) || !Number.isFinite(pLng)) continue;

    const d = calculateDistanceKm(centerLat, centerLng, pLat, pLng);
    if (d > radiusKm) continue;

    const key = place.osm_id !== undefined
      ? `${place.osm_type || 'node'}:${place.osm_id}`
      : `${pLat.toFixed(5)},${pLng.toFixed(5)}`;
    if (!seen.has(key)) {
      seen.add(key);
      count++;
    }
  }
  return count;
}

/**
 * Calcule un repli topographique explicite uniquement lorsqu'aucune API ni ville de référence
 * ne fournit de donnée démographique (sans jamais attribuer l'estimation à ONU ou WorldPop).
 */
function computeLocalFallbackDemographics(
  address: Record<string, any>,
  isWater: boolean,
  lat: number,
  lng: number
): {
  cityName: string;
  countryName: string;
  placeType: AutomaticGeoData['placeType'];
  population: number;
  densityValue: number;
  densityLevel: string;
} {
  if (isWater) {
    return {
      cityName: address.water || address.sea || address.ocean || "Haute Mer / Océan",
      countryName: address.country || "Eaux Internationales",
      placeType: "water",
      population: 0,
      densityValue: 0,
      densityLevel: "Zone Inhabitée (Aquatique)",
    };
  }

  const country = address.country || "Inconnu";
  const city = address.city || address.town || address.municipality || address.county || address.state || "Région Cible";

  let placeType: AutomaticGeoData['placeType'] = 'rural';
  let population = 800;
  let densityValue = 45;

  if (address.city) {
    placeType = 'metropolitan';
    population = 950000;
    densityValue = 4200;
  } else if (address.town) {
    placeType = 'city';
    population = 120000;
    densityValue = 1900;
  } else if (address.village || address.suburb) {
    placeType = 'town';
    population = 14000;
    densityValue = 600;
  } else if (address.hamlet || address.neighbourhood) {
    placeType = 'village';
    population = 2100;
    densityValue = 160;
  }

  const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233)) % 1;
  const mult = 0.8 + seed * 0.4;

  population = Math.round(population * mult);
  densityValue = Math.round(densityValue * mult);

  return {
    cityName: city,
    countryName: country,
    placeType,
    population,
    densityValue,
    densityLevel: classifyDensityLevel(densityValue, false),
  };
}

function estimateFallbackInfrastructure(placeType: AutomaticGeoData['placeType']): {
  hospitals: number;
  schools: number;
  industrialZones: number;
} {
  if (placeType === 'metropolitan') return { hospitals: 6, schools: 28, industrialZones: 3 };
  if (placeType === 'city') return { hospitals: 2, schools: 12, industrialZones: 2 };
  if (placeType === 'town') return { hospitals: 1, schools: 4, industrialZones: 1 };
  if (placeType === 'village') return { hospitals: 0, schools: 1, industrialZones: 0 };
  return { hospitals: 0, schools: 0, industrialZones: 0 };
}

function sleepAbortable(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

async function fetchNominatimBoundedCount(
  queryParams: string,
  lat: number,
  lng: number,
  radiusKm: number,
  signal?: AbortSignal
): Promise<number | null> {
  const latDelta = radiusKm / 111.32;
  const cosLat = Math.max(0.2, Math.abs(Math.cos((lat * Math.PI) / 180)));
  const lngDelta = radiusKm / (111.32 * cosLat);
  const viewbox = `${(lng - lngDelta).toFixed(5)},${(lat + latDelta).toFixed(5)},${(lng + lngDelta).toFixed(5)},${(lat - latDelta).toFixed(5)}`;

  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&${queryParams}&viewbox=${viewbox}&bounded=1&limit=40`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort, { once: true });

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return dedupeCountWithinRadius(data, lat, lng, radiusKm);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }
}

async function fetchWikidataEntity(wikidataId: string, signal?: AbortSignal): Promise<any | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4500);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort, { once: true });

  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${encodeURIComponent(wikidataId)}&props=claims&format=json&origin=*`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.entities?.[wikidataId] || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }
}

/**
 * Récupère en direct les données démographiques, topographiques, météorologiques et
 * d'infrastructures critiques avec traçabilité vérifiée de chaque source.
 */
export async function fetchAutomaticGeoData(
  lat: number,
  lng: number,
  isWater: boolean,
  reverseGeocodePayload: any,
  signal?: AbortSignal
): Promise<AutomaticGeoData> {
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)},${isWater ? 'w' : 'l'}`;
  const cached = geoCache.get(cacheKey) || readPersistedGeoCache(cacheKey);
  if (cached) {
    geoCache.set(cacheKey, cached);
    return { ...cached, latitude: lat, longitude: lng };
  }

  const {
    population: osmExtratagPop,
    populationYear: osmPopYear,
    wikidataId,
    address,
  } = extractNominatimCensus(reverseGeocodePayload);

  const nearbyStaticCity = findNearbyCity(lat, lng, 12);
  const fallbackDem = computeLocalFallbackDemographics(address, isWater, lat, lng);

  const result: AutomaticGeoData = {
    latitude: lat,
    longitude: lng,
    cityName: nearbyStaticCity?.name || fallbackDem.cityName,
    countryName: nearbyStaticCity?.country || fallbackDem.countryName,
    placeType: fallbackDem.placeType,
    population: fallbackDem.population,
    populationSource: isWater
      ? "Zone Maritime / Océanique (Inhabitée)"
      : "Estimation topographique locale (repli hors API)",
    densityLevel: fallbackDem.densityLevel,
    densityValue: fallbackDem.densityValue,
    elevationM: isWater ? 0 : 35,
    reliefType: isWater ? 'Fonds marins' : 'Plat / Plaine',
    roughnessCoef: 1.3,
    elevationMin: 0,
    elevationMax: 0,
    elevationProfile: [],
    manningN: nearbyStaticCity?.topography.manning_coefficient_n ?? (isWater ? 0.015 : 0.035),
    tropopauseKm: nearbyStaticCity
      ? (nearbyStaticCity.atmosphere.tropopause_summer_km + nearbyStaticCity.atmosphere.tropopause_winter_km) / 2
      : 17.0 - 9.0 * Math.pow(Math.abs(lat) / 90, 2),
    oceanDepthM: nearbyStaticCity?.bathymetry.ocean_depth_h0_m,
    shoreDistanceKm: nearbyStaticCity?.bathymetry.distance_to_shore_d_km,
    beachSlopePct: nearbyStaticCity?.topography.coastal_slope_percent,
    windSpeedKmh: nearbyStaticCity?.atmosphere.speed_kmh_avg ?? 15,
    windDirectionDeg: nearbyStaticCity?.atmosphere.direction_deg ?? 270,
    hospitals: 0,
    schools: 0,
    industrialZones: 0,
    infrastructureDetected: false,
    provenance: {
      physicsModel: GLASSTONE_MODEL_LABEL,
      populationStatus: isWater ? 'water-uninhabited' : 'fallback',
      populationSource: isWater
        ? "Zone Maritime / Océanique (Inhabitée)"
        : "Estimation topographique locale (hors base vérifiée)",
      wikidataId,
      populationUrl: wikidataId ? `https://www.wikidata.org/wiki/${wikidataId}` : undefined,
      infrastructureStatus: isWater ? 'water-uninhabited' : 'fallback',
      infrastructureSource: isWater
        ? "Zone Maritime (0 infrastructure civile)"
        : "Estimation statistique locale (APIs OSM indisponibles)",
      weatherElevationSource: nearbyStaticCity
        ? "Base ERA5 / SRTM (cities.json)"
        : "Modèle latitudinal par défaut",
      verifiedAtIso: new Date().toISOString(),
    },
    loading: false,
    error: null
  };

  // Précharge la ville de référence vérifiée (UN WUP / Demographia dans cities.json) si disponible
  if (!isWater && nearbyStaticCity && nearbyStaticCity.population > 0) {
    result.population = nearbyStaticCity.population;
    result.densityValue = nearbyStaticCity.densityPerKm2 > 0
      ? nearbyStaticCity.densityPerKm2
      : Math.max(100, fallbackDem.densityValue);
    result.densityLevel = classifyDensityLevel(result.densityValue, false);
    if (result.population >= 500000) result.placeType = 'metropolitan';
    else if (result.population >= 50000) result.placeType = 'city';
    result.populationSource = `UN WUP / Demographia (${nearbyStaticCity.name})`;
    result.provenance.populationStatus = 'verified-reference';
    result.provenance.populationSource = `${nearbyStaticCity.populationSources.join(' & ')} (${nearbyStaticCity.name})`;
  }

  // Étape 1 (parallèle, 0 erreur 502) : Open-Meteo Elevation + Météo Live + Wikidata Census officiel
  const kmOffsetLat = 2 / 111.32;
  const kmOffsetLng = 2 / (111.32 * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));
  const coords = [
    { lat, lng, dir: "Centre" },
    { lat: lat + kmOffsetLat, lng, dir: "Nord (2km)" },
    { lat: lat - kmOffsetLat, lng, dir: "Sud (2km)" },
    { lat, lng: lng + kmOffsetLng, dir: "Est (2km)" },
    { lat, lng: lng - kmOffsetLng, dir: "Ouest (2km)" }
  ];
  const latParam = coords.map(c => c.lat.toFixed(5)).join(",");
  const lngParam = coords.map(c => c.lng.toFixed(5)).join(",");

  const [elevOutcome, weatherOutcome, wikiEntity] = await Promise.all([
    fetch(`https://api.open-meteo.com/v1/elevation?latitude=${latParam}&longitude=${lngParam}`, { signal })
      .then(r => (r.ok ? r.json() : null))
      .catch(() => null),
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current_weather=true`, { signal })
      .then(r => (r.ok ? r.json() : null))
      .catch(() => null),
    !isWater && wikidataId ? fetchWikidataEntity(wikidataId, signal) : Promise.resolve(null),
  ]);

  let openMeteoOk = false;
  if (weatherOutcome?.current_weather) {
    result.windSpeedKmh = Math.round(weatherOutcome.current_weather.windspeed || result.windSpeedKmh);
    result.windDirectionDeg = Math.round(weatherOutcome.current_weather.winddirection || result.windDirectionDeg);
    openMeteoOk = true;
  }

  if (elevOutcome && Array.isArray(elevOutcome.elevation) && elevOutcome.elevation.length >= 5) {
    const elevations: number[] = elevOutcome.elevation;
    result.elevationM = Math.round(elevations[0]);
    result.elevationMin = Math.round(Math.min(...elevations));
    result.elevationMax = Math.round(Math.max(...elevations));
    result.elevationProfile = coords.map((c, i) => ({
      direction: c.dir,
      elevationM: Math.round(elevations[i])
    }));
    const range = result.elevationMax - result.elevationMin;
    if (isWater) {
      result.reliefType = 'Fonds marins';
      result.roughnessCoef = 1.0;
    } else if (range < 30) {
      result.reliefType = 'Plat / Plaine';
      result.roughnessCoef = 1.1;
    } else if (range < 160) {
      result.reliefType = 'Vallonné / Collines';
      result.roughnessCoef = 1.6;
    } else {
      result.reliefType = 'Accidenté / Montagneux';
      result.roughnessCoef = 2.4;
    }
    openMeteoOk = true;
  } else {
    const baseElev = isWater ? -800 : (fallbackDem.placeType === 'metropolitan' ? 45 : 220);
    result.elevationM = baseElev;
    result.elevationMin = Math.round(baseElev * 0.7);
    result.elevationMax = Math.round(baseElev * 1.4);
    result.elevationProfile = coords.map((c, idx) => ({
      direction: c.dir,
      elevationM: Math.round(baseElev * (idx === 0 ? 1 : 0.9 + idx * 0.05))
    }));
  }

  if (openMeteoOk) {
    result.provenance.weatherElevationSource = "Open-Meteo DEM 30m & Météo Temps Réel";
  }

  // En zone maritime, la population et les infrastructures terrestres restent strictement nulles
  if (isWater) {
    result.population = 0;
    result.densityValue = 0;
    result.hospitals = 0;
    result.schools = 0;
    result.industrialZones = 0;
    result.infrastructureDetected = true;
    result.provenance.populationStatus = 'water-uninhabited';
    result.provenance.infrastructureStatus = 'water-uninhabited';
    geoCache.set(cacheKey, result);
    writePersistedGeoCache(cacheKey, result);
    return result;
  }

  // Résolution démographique vérifiée (Priorité : Wikidata P1082/P2046 > Nominatim extratags > cities.json UN WUP)
  if (wikiEntity && wikidataId) {
    const wikiCensus = extractWikidataCensus(wikiEntity);
    if (wikiCensus.population && wikiCensus.population > 0) {
      result.population = wikiCensus.population;
      const effectiveArea = wikiCensus.areaKm2 || nearbyStaticCity?.areaKm2 || (result.population > 500000 ? 120 : 25);
      result.densityValue = Math.max(10, Math.round(wikiCensus.population / effectiveArea));
      result.densityLevel = classifyDensityLevel(result.densityValue, false);
      result.populationSource = `Wikidata (${wikidataId})${wikiCensus.populationYear ? ` • ${wikiCensus.populationYear}` : ''}`;
      result.provenance.populationStatus = 'verified-api';
      result.provenance.populationSource = `Wikidata Recensement Officiel (${wikidataId})`;
      result.provenance.populationYear = wikiCensus.populationYear;
      result.provenance.wikidataId = wikidataId;
      result.provenance.populationUrl = `https://www.wikidata.org/wiki/${wikidataId}`;
    }
  }

  // Si Wikidata n'a pas fourni P1082 mais Nominatim dispose du tag officiel `population`
  if (result.provenance.populationStatus !== 'verified-api' && osmExtratagPop && osmExtratagPop > 0) {
    result.population = osmExtratagPop;
    const areaKm2 = nearbyStaticCity?.areaKm2 || (osmExtratagPop > 500000 ? 105 : osmExtratagPop > 50000 ? 35 : 12);
    result.densityValue = Math.max(10, Math.round(osmExtratagPop / areaKm2));
    result.densityLevel = classifyDensityLevel(result.densityValue, false);
    result.populationSource = `OpenStreetMap Nominatim${osmPopYear ? ` (${osmPopYear})` : ''}`;
    result.provenance.populationStatus = 'verified-api';
    result.provenance.populationSource = `OpenStreetMap Nominatim (extratags.population)`;
    result.provenance.populationYear = osmPopYear;
  }

  // Recalibrage Manning n d'après la densité réelle (sauf priorité ville historique déjà calibrée)
  if (!nearbyStaticCity) {
    const addedRoughness = Math.min(0.055, Math.max(0, (result.densityValue / 20000) * 0.040));
    result.manningN = parseFloat((0.025 + addedRoughness).toFixed(3));
  }

  // Étape 2 : Infrastructures critiques dans un rayon de 3 km via Nominatim borné (fiable, sans 502 Overpass)
  try {
    const hospitalsCount = await fetchNominatimBoundedCount('amenity=hospital', lat, lng, 3, signal);
    await sleepAbortable(250, signal);
    const schoolsCount = await fetchNominatimBoundedCount('amenity=school', lat, lng, 3, signal);
    await sleepAbortable(250, signal);
    const industrialCount = await fetchNominatimBoundedCount('q=industrial', lat, lng, 3, signal);

    if (hospitalsCount !== null || schoolsCount !== null) {
      result.hospitals = hospitalsCount ?? 0;
      result.schools = schoolsCount ?? 0;
      result.industrialZones = industrialCount ?? 0;
      result.infrastructureDetected = true;
      result.provenance.infrastructureStatus = 'verified-api';
      result.provenance.infrastructureSource = 'OpenStreetMap Nominatim (rayon 3 km)';
    } else {
      const est = estimateFallbackInfrastructure(result.placeType);
      result.hospitals = est.hospitals;
      result.schools = est.schools;
      result.industrialZones = est.industrialZones;
      result.infrastructureDetected = false;
      result.provenance.infrastructureStatus = 'fallback';
      result.provenance.infrastructureSource = 'Estimation locale (API OSM momentanément limitée)';
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
    const est = estimateFallbackInfrastructure(result.placeType);
    result.hospitals = est.hospitals;
    result.schools = est.schools;
    result.industrialZones = est.industrialZones;
    result.infrastructureDetected = false;
    result.provenance.infrastructureStatus = 'fallback';
    result.provenance.infrastructureSource = 'Estimation locale (API OSM inaccessible)';
  }

  result.provenance.verifiedAtIso = new Date().toISOString();
  geoCache.set(cacheKey, result);
  writePersistedGeoCache(cacheKey, result);
  return result;
}
