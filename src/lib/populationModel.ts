import { BlastRadii, CasualtyReport } from '../types';
import { CityData, CITIES_DATABASE } from './citiesData';
import {
  getWorldDemographicDataset,
  WorldDemographicDataset,
  WorldRegionEntry,
} from '../data/worldPopulation';
import { AutomaticGeoData, GLASSTONE_MODEL_LABEL } from './geoDataFetcher';
import { haversineKm } from './nuclearMath';

export interface StrikeFootprintInput {
  id: string;
  target: { lng: number; lat: number };
  radii: BlastRadii;
  effectiveYield: number;
  weaponType?: 'fission' | 'fusion' | 'dirty';
  tsunamiFloodRadiusM?: number;
}

export interface CombinedCasualtyInput {
  strikes: StrikeFootprintInput[];
  defaultWeaponType: 'fission' | 'fusion' | 'dirty';
  targetGeoData: AutomaticGeoData | null;
  worldDataset?: WorldDemographicDataset;
  cities?: CityData[];
}

const clamp01 = (v: number): number => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));

/**
 * Aire analytique exacte de l'intersection géométrique de deux disques (en km²)
 * séparés d'une distance géodésique `dKm`.
 */
export function circleOverlapAreaKm2(dKm: number, r1Km: number, r2Km: number): number {
  if (!Number.isFinite(dKm) || !Number.isFinite(r1Km) || !Number.isFinite(r2Km)) return 0;
  if (r1Km <= 0 || r2Km <= 0) return 0;
  if (dKm >= r1Km + r2Km) return 0;

  if (dKm <= Math.abs(r1Km - r2Km)) {
    const rMin = Math.min(r1Km, r2Km);
    return Math.PI * rMin * rMin;
  }

  const r1Sq = r1Km * r1Km;
  const r2Sq = r2Km * r2Km;
  const cosAlpha = Math.max(-1, Math.min(1, (dKm * dKm + r1Sq - r2Sq) / (2 * dKm * r1Km)));
  const cosBeta = Math.max(-1, Math.min(1, (dKm * dKm + r2Sq - r1Sq) / (2 * dKm * r2Km)));
  const alpha = Math.acos(cosAlpha);
  const beta = Math.acos(cosBeta);

  const heronsTerm = Math.max(
    0,
    (-dKm + r1Km + r2Km) *
      (dKm + r1Km - r2Km) *
      (dKm - r1Km + r2Km) *
      (dKm + r1Km + r2Km)
  );

  return Math.max(0, r1Sq * alpha + r2Sq * beta - 0.5 * Math.sqrt(heronsTerm));
}

function normalizeName(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const COUNTRY_NAME_ALIASES: Record<string, string> = {
  'united states': 'etats-unis',
  'usa': 'etats-unis',
  'united kingdom': 'royaume-uni',
  'uk': 'royaume-uni',
  'russia': 'russie',
  'russian federation': 'russie',
  'china': 'chine',
  'india': 'inde',
  'germany': 'allemagne',
  'spain': 'espagne',
  'italy': 'italie',
  'brazil': 'bresil',
  'south korea': 'coree du sud',
  'north korea': 'coree du nord',
  'dr congo': 'rd congo',
  'democratic republic of the congo': 'rd congo',
  'czech republic': 'tchequie',
  'czechia': 'tchequie',
  'netherlands': 'pays-bas',
  'switzerland': 'suisse',
  'belgium': 'belgique',
  'poland': 'pologne',
  'sweden': 'suede',
  'norway': 'norvege',
  'turkey': 'turquie',
  'egypt': 'egypte',
  'saudi arabia': 'arabie saoudite',
  'south africa': 'afrique du sud',
  'morocco': 'maroc',
  'algeria': 'algerie',
  'tunisia': 'tunisie',
  'ivory coast': 'cote d’ivoire',
  "cote d'ivoire": 'cote d’ivoire',
  'japan': 'japon',
  'indonesia': 'indonesie',
  'australia': 'australie',
  'new zealand': 'nouvelle-zelande',
  'mexico': 'mexique',
  'argentina': 'argentine',
  'colombia': 'colombie',
  'peru': 'perou',
  'chile': 'chili',
  'belarus': 'bielorussie',
  'austria': 'autriche',
  'greece': 'grece',
  'romania': 'roumanie',
  'hungary': 'hongrie',
  'finland': 'finlande',
  'denmark': 'danemark',
  'ireland': 'irlande',
  'croatia': 'croatie',
  'bulgaria': 'bulgarie',
  'serbia': 'serbie',
  'slovakia': 'slovaquie',
  'slovenia': 'slovenie',
  'lithuania': 'lituanie',
  'latvia': 'lettonie',
  'estonia': 'estonie',
  'iceland': 'islande',
};

function resolveCountryKey(name: string): string {
  const norm = normalizeName(name);
  return COUNTRY_NAME_ALIASES[norm] || norm;
}

/**
 * Calcule le bilan démographique multi-villes, multi-continents et planétaire
 * en mode frappe simple ou multi-frappes sans double comptage grâce au produit de survie.
 */
export function computeCombinedCasualtyReport({
  strikes,
  defaultWeaponType,
  targetGeoData,
  worldDataset = getWorldDemographicDataset(),
  cities = CITIES_DATABASE,
}: CombinedCasualtyInput): CasualtyReport {
  const physicsModel = GLASSTONE_MODEL_LABEL;

  if (!strikes || strikes.length === 0) {
    return {
      populationTotal: 0,
      populationDensity: 0,
      fatalities: 0,
      graveInjures: 0,
      lightInjures: 0,
      radiationExposed: 0,
      hospitalsAffected: 0,
      schoolsAffected: 0,
      airportsAffected: 0,
      roadsAffected: 0,
      affectedCitiesCount: 0,
      affectedCountriesCount: 0,
      affectedContinents: [],
      topAffectedCities: [],
      impactScale: 'Locale',
      isMultiStrike: false,
      strikeCount: 0,
      dataProvenance: targetGeoData?.provenance ?? {
        physicsModel,
        populationStatus: 'fallback',
        populationSource: worldDataset.sourceLabel,
        infrastructureStatus: 'fallback',
        infrastructureSource: 'Aucune cible active',
        weatherElevationSource: 'Paramètres par défaut',
      },
    };
  }

  // Pré-indexe les pays par code ISO2 et par nom normalisé pour retrouver leur continent et soustraire les villes déjà modélisées
  const regionByKey = new Map<string, WorldRegionEntry>();
  const regionByCode = new Map<string, WorldRegionEntry>();
  for (const reg of worldDataset.regions) {
    regionByCode.set(reg.code.toUpperCase(), reg);
    regionByKey.set(resolveCountryKey(reg.name), reg);
  }

  const cityPopByRegionCode = new Map<string, number>();
  const cityAreaByRegionCode = new Map<string, number>();

  interface SpatialUnit {
    id: string;
    name: string;
    continent: string;
    countryCode: string;
    lat: number;
    lng: number;
    pop: number;
    areaKm2: number;
    radiusKm: number;
    isCity: boolean;
  }

  const cityUnits: SpatialUnit[] = [];
  for (const city of cities) {
    if (!city.population || city.population <= 0) continue;
    const areaKm2 =
      city.areaKm2 && city.areaKm2 > 0
        ? city.areaKm2
        : Math.max(25, city.population / Math.max(1000, city.densityPerKm2 || 4000));
    const radiusKm = Math.sqrt(areaKm2 / Math.PI);
    const matchedReg =
      regionByCode.get(city.country.trim().toUpperCase()) ||
      regionByKey.get(resolveCountryKey(city.country));
    const countryCode = matchedReg?.code || city.country.trim().toUpperCase();
    const continent = matchedReg?.continent || inferContinentFromCoords(city.latitude, city.longitude);

    if (matchedReg) {
      cityPopByRegionCode.set(matchedReg.code, (cityPopByRegionCode.get(matchedReg.code) || 0) + city.population);
      cityAreaByRegionCode.set(matchedReg.code, (cityAreaByRegionCode.get(matchedReg.code) || 0) + areaKm2);
    }

    cityUnits.push({
      id: `city-${city.id}`,
      name: city.name,
      continent,
      countryCode,
      lat: city.latitude,
      lng: city.longitude,
      pop: city.population,
      areaKm2,
      radiusKm,
      isCity: true,
    });
  }

  // Ajoute une unité locale si la cible principale a une population API/locale hors des villes pré-indexées (>15 km)
  const primaryStrike = strikes.find((s) => s.id === 'current-target') || strikes[0];
  if (primaryStrike && targetGeoData && targetGeoData.population > 0 && targetGeoData.placeType !== 'water') {
    const matchedExistingCity = cityUnits.some(
      (c) => haversineKm(primaryStrike.target.lat, primaryStrike.target.lng, c.lat, c.lng) <= 15
    );
    if (!matchedExistingCity) {
      const localArea = Math.max(
        10,
        targetGeoData.population / Math.max(50, targetGeoData.densityValue || 1200)
      );
      const matchedReg =
        regionByCode.get((targetGeoData.countryName || '').trim().toUpperCase()) ||
        regionByKey.get(resolveCountryKey(targetGeoData.countryName || ''));
      const continent = matchedReg?.continent || inferContinentFromCoords(primaryStrike.target.lat, primaryStrike.target.lng);
      const countryCode = matchedReg?.code || resolveCountryKey(targetGeoData.countryName || 'local').toUpperCase();

      if (matchedReg) {
        cityPopByRegionCode.set(
          matchedReg.code,
          (cityPopByRegionCode.get(matchedReg.code) || 0) + targetGeoData.population
        );
        cityAreaByRegionCode.set(
          matchedReg.code,
          (cityAreaByRegionCode.get(matchedReg.code) || 0) + localArea
        );
      }

      cityUnits.push({
        id: 'local-target-city',
        name: targetGeoData.cityName || 'Zone Cible',
        continent,
        countryCode,
        lat: primaryStrike.target.lat,
        lng: primaryStrike.target.lng,
        pop: targetGeoData.population,
        areaKm2: localArea,
        radiusKm: Math.sqrt(localArea / Math.PI),
        isCity: true,
      });
    }
  }

  // Construit les unités nationales/rurales restantes (population totale - villes déjà modélisées pour éviter le double comptage)
  const regionUnits: SpatialUnit[] = worldDataset.regions.map((reg) => {
    const urbanPop = cityPopByRegionCode.get(reg.code) || 0;
    const urbanArea = cityAreaByRegionCode.get(reg.code) || 0;
    const remainingPop = Math.max(0, reg.population - urbanPop);
    const remainingArea = Math.max(100, reg.areaKm2 - Math.min(reg.areaKm2 * 0.6, urbanArea));
    return {
      id: `region-${reg.code}`,
      name: reg.name,
      continent: reg.continent,
      countryCode: reg.code,
      lat: reg.lat,
      lng: reg.lng,
      pop: remainingPop,
      areaKm2: remainingArea,
      radiusKm: Math.sqrt(remainingArea / Math.PI),
      isCity: false,
    };
  });

  const allUnits = [...cityUnits, ...regionUnits];

  // Prépare les paramètres géométriques de chaque frappe
  const strikeSpecs = strikes.map((s) => {
    const wType = s.weaponType || defaultWeaponType;
    const fatalKm = Math.max(s.radii.fireball, s.radii.heavyBlast) / 1000;
    const severeKm = Math.max(fatalKm, Math.max(s.radii.moderateBlast, s.radii.thermal3rd) / 1000);
    const lightKm = Math.max(severeKm, Math.max(s.radii.lightBlast, s.radii.thermal1st) / 1000);
    const tsunamiKm = s.tsunamiFloodRadiusM && s.tsunamiFloodRadiusM > 0 ? s.tsunamiFloodRadiusM / 1000 : 0;
    const falloutReachKm = Math.max(lightKm * 1.4, (s.radii.heavyBlast / 1000) * 4.5);
    return {
      ...s,
      wType,
      fatalKm,
      severeKm,
      lightKm,
      tsunamiKm,
      falloutReachKm,
      maxReachKm: Math.max(lightKm, tsunamiKm, falloutReachKm),
    };
  });

  const primaryCountryKey = targetGeoData?.countryName ? resolveCountryKey(targetGeoData.countryName) : '';
  const primaryCountryCode = primaryCountryKey ? regionByKey.get(primaryCountryKey)?.code : undefined;

  let totalFatalities = 0;
  let totalGrave = 0;
  let totalLight = 0;
  let totalRadiationExposed = 0;
  let totalExposedBasePop = 0;

  const affectedContinentsSet = new Set<string>();
  const affectedCountryCodesSet = new Set<string>();
  const affectedCityRanking: Array<{ name: string; casualties: number }> = [];
  let affectedCitiesCount = 0;

  // Mémorise la surface urbaine déjà couverte par chaque frappe et pays afin d'éviter le recouvrement urbain/rural
  const coveredCityLightByStrikeCountry = new Map<string, number>();
  for (const unit of cityUnits) {
    for (const s of strikeSpecs) {
      const dKm = haversineKm(s.target.lat, s.target.lng, unit.lat, unit.lng);
      if (dKm <= s.lightKm + unit.radiusKm) {
        const overlap = circleOverlapAreaKm2(dKm, s.lightKm, unit.radiusKm);
        const key = `${s.id}::${unit.countryCode}`;
        coveredCityLightByStrikeCountry.set(key, (coveredCityLightByStrikeCountry.get(key) || 0) + overlap);
      }
    }
  }

  for (const unit of allUnits) {
    if (unit.pop <= 0) continue;

    let survFatal = 1;
    let survGrave = 1;
    let survLight = 1;
    let maxRadFrac = 0;
    let maxExposedShare = 0;
    let touchedByBlastOrTsunami = false;

    for (const s of strikeSpecs) {
      const dKm = haversineKm(s.target.lat, s.target.lng, unit.lat, unit.lng);
      if (dKm > s.maxReachKm + unit.radiusKm) continue;

      const rawLightOverlapKm2 = circleOverlapAreaKm2(dKm, s.lightKm, unit.radiusKm);
      // Pour une unité nationale rurale, on soustrait la surface des villes déjà modélisées sous cette frappe
      const cityOverlapOffsetKm2 = !unit.isCity
        ? Math.min(rawLightOverlapKm2, coveredCityLightByStrikeCountry.get(`${s.id}::${unit.countryCode}`) || 0)
        : 0;
      const effectiveLightOverlapKm2 = Math.max(0, rawLightOverlapKm2 - cityOverlapOffsetKm2);
      const effectiveSevereOverlapKm2 = Math.max(
        0,
        circleOverlapAreaKm2(dKm, s.severeKm, unit.radiusKm) - Math.min(cityOverlapOffsetKm2, rawLightOverlapKm2)
      );
      const effectiveFatalOverlapKm2 = Math.max(
        0,
        circleOverlapAreaKm2(dKm, s.fatalKm, unit.radiusKm) - Math.min(cityOverlapOffsetKm2, rawLightOverlapKm2)
      );

      const fFatal = clamp01(effectiveFatalOverlapKm2 / unit.areaKm2);
      const fSevereTotal = clamp01(effectiveSevereOverlapKm2 / unit.areaKm2);
      const fLightTotal = clamp01(effectiveLightOverlapKm2 / unit.areaKm2);
      const fTsunami = s.tsunamiKm > 0
        ? clamp01(circleOverlapAreaKm2(dKm, s.tsunamiKm, unit.radiusKm) / unit.areaKm2)
        : 0;

      const fSevere = Math.max(0, fSevereTotal - fFatal);
      const fLight = Math.max(0, fLightTotal - fSevereTotal);
      const fRad = clamp01(
        Math.max(0, circleOverlapAreaKm2(dKm, s.falloutReachKm, unit.radiusKm) - cityOverlapOffsetKm2) /
          unit.areaKm2
      );

      if (fLightTotal > 0 || fTsunami > 0) {
        touchedByBlastOrTsunami = true;
        maxExposedShare = Math.max(maxExposedShare, fLightTotal, fTsunami);
      }

      let pFatal = 0;
      let pGrave = 0;
      let pLight = 0;

      if (s.wType === 'dirty') {
        pFatal = fFatal * 0.05;
        pGrave = fSevere * 0.15;
        pLight = fLight * 0.50;
      } else {
        pFatal = fFatal * 0.98 + fSevere * 0.22;
        pGrave = fSevere * 0.45 + fFatal * 0.02;
        pLight = fLight * 0.35 + fSevere * 0.15;
      }

      if (fTsunami > 0) {
        // Contribution littorale de l'inondation par tsunami (distincte de l'onde aérienne)
        pFatal = Math.max(pFatal, fTsunami * 0.12);
        pGrave = Math.max(pGrave, fTsunami * 0.18);
        pLight = Math.max(pLight, fTsunami * 0.28);
      }

      survFatal *= 1 - clamp01(pFatal);
      survGrave *= 1 - clamp01(pGrave);
      survLight *= 1 - clamp01(pLight);

      const radWeight = s.wType === 'dirty' ? 0.85 : 0.45;
      maxRadFrac = Math.max(maxRadFrac, clamp01(fRad * radWeight));
    }

    if (!touchedByBlastOrTsunami && maxRadFrac === 0) continue;

    const unitFatal = unit.pop * (1 - survFatal);
    const remAfterFatal = Math.max(0, unit.pop - unitFatal);
    const unitGrave = Math.min(remAfterFatal, unit.pop * (1 - survGrave));
    const remAfterGrave = Math.max(0, remAfterFatal - unitGrave);
    const unitLight = Math.min(remAfterGrave, unit.pop * (1 - survLight));
    const unitTotalCas = unitFatal + unitGrave + unitLight;

    totalFatalities += unitFatal;
    totalGrave += unitGrave;
    totalLight += unitLight;
    totalRadiationExposed += unit.pop * maxRadFrac;

    if (touchedByBlastOrTsunami) {
      // Pour une ville touchée significativement (>5%), on compte sa population urbaine ; pour une vaste région nationale, seule la fraction exposée
      const exposedPopContribution = unit.isCity
        ? (maxExposedShare >= 0.05 ? unit.pop : unit.pop * maxExposedShare)
        : unit.pop * maxExposedShare;
      totalExposedBasePop += exposedPopContribution;

      const significantUnitImpact = unit.isCity
        ? unitTotalCas >= 10
        : (unit.countryCode === primaryCountryCode && unitTotalCas >= 50) ||
          maxExposedShare >= 0.015 ||
          unitTotalCas >= 10_000;

      if (significantUnitImpact) {
        affectedContinentsSet.add(unit.continent);
        affectedCountryCodesSet.add(unit.countryCode);
      }
      if (unit.isCity && unitTotalCas >= 10) {
        affectedCitiesCount++;
        affectedCityRanking.push({ name: unit.name, casualties: Math.round(unitTotalCas) });
      }
    }
  }

  // Plafond absolu planétaire : les pertes combinées ne dépassent jamais la population mondiale totale
  const worldPopCap = worldDataset.totalWorldPopulation > 0
    ? worldDataset.totalWorldPopulation
    : 8_110_000_000;

  let fatalities = Math.min(worldPopCap, Math.round(totalFatalities));
  let graveInjures = Math.min(Math.max(0, worldPopCap - fatalities), Math.round(totalGrave));
  let lightInjures = Math.min(Math.max(0, worldPopCap - fatalities - graveInjures), Math.round(totalLight));
  const radiationExposed = Math.min(worldPopCap, Math.round(totalRadiationExposed));

  // Si l'explosion est maritime/isolée et n'atteint aucun habitant ni aucune côte
  if (totalExposedBasePop === 0 && targetGeoData?.placeType === 'water') {
    return {
      populationTotal: 0,
      populationDensity: 0,
      fatalities: 0,
      graveInjures: 0,
      lightInjures: 0,
      radiationExposed: 0,
      hospitalsAffected: 0,
      schoolsAffected: 0,
      airportsAffected: 0,
      roadsAffected: 0,
      affectedCitiesCount: 0,
      affectedCountriesCount: 0,
      affectedContinents: [],
      topAffectedCities: [],
      impactScale: 'Locale',
      isMultiStrike: strikes.length > 1,
      strikeCount: strikes.length,
      dataProvenance: targetGeoData.provenance,
    };
  }

  const populationTotal = Math.min(
    worldPopCap,
    Math.round(Math.max(totalExposedBasePop, targetGeoData?.population || 0))
  );

  // Estimation infrastructures proportionnelle à l'échelle (locale OSM + multi-villes pour grands rendements)
  const maxLightRadiusKm = Math.max(...strikeSpecs.map((s) => s.lightKm));
  const baseHospitals = targetGeoData?.hospitals ?? 4;
  const baseSchools = targetGeoData?.schools ?? 18;
  const scanAreaKm2 = Math.PI * 3 * 3;
  const severeAreaPrimary = Math.PI * (strikeSpecs[0]?.severeKm || 1) ** 2;
  const localDestructionRatio = Math.min(1, severeAreaPrimary / scanAreaKm2);

  const regionalInfraBoost = Math.max(0, affectedCitiesCount - 1);
  const hospitalsAffected = Math.round(
    (baseHospitals > 0 ? Math.ceil(baseHospitals * localDestructionRatio) : 0) +
      regionalInfraBoost * 18 +
      (fatalities / 250_000)
  );
  const schoolsAffected = Math.round(
    (baseSchools > 0 ? Math.ceil(baseSchools * localDestructionRatio) : 0) +
      regionalInfraBoost * 95 +
      (fatalities / 45_000)
  );
  const airportsAffected = Math.max(
    maxLightRadiusKm > 15 ? 2 : maxLightRadiusKm > 4 ? 1 : 0,
    affectedCitiesCount + Math.floor(affectedCountryCodesSet.size * 3)
  );
  const roadsAffected = Math.max(
    Math.round((targetGeoData?.densityValue || 1000) / 120 * Math.min(50, maxLightRadiusKm)),
    affectedCitiesCount * 120 + Math.round(maxLightRadiusKm * 2)
  );

  const affectedContinents = Array.from(affectedContinentsSet);
  const affectedCountriesCount = affectedCountryCodesSet.size;
  const totalCasualties = fatalities + graveInjures + lightInjures;

  let impactScale: CasualtyReport['impactScale'] = 'Locale';
  if (affectedContinents.length >= 4 || totalCasualties >= 500_000_000 || maxLightRadiusKm >= 4500) {
    impactScale = 'Planétaire';
  } else if (affectedContinents.length >= 2) {
    impactScale = 'Multi-Continentale';
  } else if (affectedCountriesCount >= 3 || maxLightRadiusKm >= 250) {
    impactScale = 'Continentale';
  } else if (affectedCitiesCount >= 2 || affectedCountriesCount >= 2 || maxLightRadiusKm >= 35) {
    impactScale = 'Régionale';
  }

  affectedCityRanking.sort((a, b) => b.casualties - a.casualties);
  const topAffectedCities = affectedCityRanking.slice(0, 5).map((c) => c.name);

  const baseProvenance = targetGeoData?.provenance ?? {
    physicsModel,
    populationStatus: 'verified-reference' as const,
    populationSource: worldDataset.sourceLabel,
    infrastructureStatus: 'fallback' as const,
    infrastructureSource: 'Modèle multi-échelles',
    weatherElevationSource: 'Paramètres par défaut',
  };

  const provenanceSourceSuffix =
    impactScale === 'Locale'
      ? baseProvenance.populationSource
      : `${baseProvenance.populationSource} + ${worldDataset.sourceLabel}`;

  return {
    populationTotal,
    populationDensity: targetGeoData?.densityValue ?? 2400,
    fatalities,
    graveInjures,
    lightInjures,
    radiationExposed,
    hospitalsAffected,
    schoolsAffected,
    airportsAffected,
    roadsAffected,
    affectedCitiesCount,
    affectedCountriesCount,
    affectedContinents,
    topAffectedCities,
    impactScale,
    isMultiStrike: strikes.length > 1,
    strikeCount: strikes.length,
    dataProvenance: {
      ...baseProvenance,
      populationSource: provenanceSourceSuffix,
    },
  };
}

function inferContinentFromCoords(lat: number, lng: number): string {
  if (lat > 34 && lng >= -25 && lng <= 60) return 'Europe';
  if (lat < 35 && lng >= -20 && lng <= 55) return 'Afrique';
  if (lng > 55 && lat > -12) return 'Asie';
  if (lng < -30 && lat >= 12) return 'Amérique du Nord';
  if (lng < -30 && lat < 12) return 'Amérique du Sud';
  return 'Océanie';
}
