import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBlastRadii,
  calculateTsunamiMetrics,
  calculateCasualtyReport,
  calculateCasualtiesByDistance,
  calculateRichterScale,
  resolveVectorFlightProfile,
  calculateFalloutPlumeLengthKm,
  computeMultiStrikeTimings,
  evaluateBallisticClock,
  haversineKm,
  WEAPON_PRESETS,
} from './nuclearMath';
import { computeDetonationSoundProfile, soundEngine } from './soundEngine';

test('calculateBlastRadii clamps invalid or zero yields safely', () => {
  const zeroYield = calculateBlastRadii(0, 'surface');
  const negativeYield = calculateBlastRadii(-50, 'airburst');
  assert.ok(Number.isFinite(zeroYield.fireball) && zeroYield.fireball > 0);
  assert.ok(Number.isFinite(zeroYield.crater) && zeroYield.crater > 0);
  assert.ok(Number.isFinite(negativeYield.heavyBlast) && negativeYield.heavyBlast > 0);
});

test('calculateRichterScale guards against zero/negative yield', () => {
  const magZero = calculateRichterScale(0);
  assert.ok(Number.isFinite(magZero));
  const magNormal = calculateRichterScale(20);
  assert.ok(magNormal > 4 && magNormal < 7);
});

test('resolveVectorFlightProfile honors custom speed, range, altitude, and depressed multiplier', () => {
  const standard = resolveVectorFlightProfile({
    vectorId: 'icbm',
    altitudeKm: 950,
    velocityMach: 19.6,
    customSpeedKmh: 20000,
    customRangeKm: 9000,
    trajectoryType: 'standard',
  });
  assert.equal(standard.speedKmh, 20000);
  assert.equal(standard.maxRangeKm, 9000);
  assert.equal(standard.altitudeKm, 950);

  const depressed = resolveVectorFlightProfile({
    vectorId: 'icbm',
    altitudeKm: 420,
    velocityMach: 26.0,
    customSpeedKmh: 20000,
    customRangeKm: 9000,
    trajectoryType: 'depressed',
  });
  assert.equal(depressed.speedKmh, Math.round(20000 * 1.33));
});

test('calculateFalloutPlumeLengthKm matches consistent km scaling', () => {
  const length1 = calculateFalloutPlumeLengthKm(2000, 20);
  const length2 = calculateFalloutPlumeLengthKm(2000, 60);
  assert.ok(length1 > 0);
  assert.ok(length2 > length1);
});

test('dirty_bomb preset has consistent yieldValue and yieldKt', () => {
  const dirty = WEAPON_PRESETS.find((w) => w.id === 'dirty_bomb');
  assert.ok(dirty);
  assert.equal(dirty.yieldValue, dirty.yieldKt);
});

test('haversineKm computes Paris to London accurately (~343 km)', () => {
  const dist = haversineKm(48.8566, 2.3522, 51.5074, -0.1278);
  assert.ok(dist > 335 && dist < 355);
});

test('calculateTsunamiMetrics honors coastalDepthM and manningN parameters', () => {
  const smooth = calculateTsunamiMetrics(1000, 2000, 10, 2, 1.2, false, 8, 0.015);
  const rough = calculateTsunamiMetrics(1000, 2000, 10, 2, 1.2, false, 8, 0.090);
  assert.equal(smooth.isEligible, true);
  assert.ok(smooth.inundationDistanceM > rough.inundationDistanceM);
});

test('calculateCasualtyReport returns deterministic results without nearbyCityData', () => {
  const radii = calculateBlastRadii(20, 'airburst');
  const r1 = calculateCasualtyReport(48.8566, 2.3522, radii, 'fission', null);
  const r2 = calculateCasualtyReport(48.8566, 2.3522, radii, 'fission', null);
  assert.deepEqual(r1, r2);
});

test('calculateCasualtiesByDistance preserves exact totals across 4 strictly ordered radial bands', () => {
  for (const [yieldKt, mode, type] of [
    [0.02, 'surface', 'fission'],
    [20, 'airburst', 'fission'],
    [50000, 'airburst', 'fusion'],
    [0.1, 'airburst', 'dirty'],
  ] as const) {
    const radii = calculateBlastRadii(yieldKt, mode);
    const report = calculateCasualtyReport(48.8566, 2.3522, radii, type, null);
    const points = calculateCasualtiesByDistance(radii, report, type);

    assert.equal(points.length, 4);
    for (let i = 1; i < points.length; i++) {
      assert.ok(points[i].maxRadiusKm > points[i - 1].maxRadiusKm);
    }

    const sumFatal = points.reduce((s, p) => s + p.fatalities, 0);
    const sumGrave = points.reduce((s, p) => s + p.graveInjures, 0);
    const sumLight = points.reduce((s, p) => s + p.lightInjures, 0);

    assert.equal(sumFatal, report.fatalities);
    assert.equal(sumGrave, report.graveInjures);
    assert.equal(sumLight, report.lightInjures);
  }
});

test('computeDetonationSoundProfile scales acoustic duration with yield and runs safely headless', () => {
  const small = computeDetonationSoundProfile(0.02, 'fission');
  const large = computeDetonationSoundProfile(50000, 'fusion');
  const dirty = computeDetonationSoundProfile(0.1, 'dirty');

  assert.ok(large.durationSec > small.durationSec);
  assert.ok(large.subFreqEndHz < small.subFreqEndHz);
  assert.ok(dirty.geigerClicks > large.geigerClicks);

  // Vérifie l'innocuité en environnement Node sans window.AudioContext
  assert.doesNotThrow(() => {
    soundEngine.playDetonation(20, 'fission', false);
    soundEngine.playMissileLaunch();
    soundEngine.playTargetLock('target');
    soundEngine.playGeigerBurst(4);
    soundEngine.playAlert();
    soundEngine.playUiClick();
  });
});

test('computeMultiStrikeTimings staggers impacts strictly by geodesic distance and evaluateBallisticClock tracks per-target state', () => {
  // Origine : Paris (48.8566, 2.3522)
  const origin = { lng: 2.3522, lat: 48.8566 };
  const strikes = [
    { id: 'near-london', target: { lng: -0.1278, lat: 51.5074 } },   // ~344 km
    { id: 'mid-moscow', target: { lng: 37.6173, lat: 55.7558 } },    // ~2486 km
    { id: 'far-nyc', target: { lng: -74.006, lat: 40.7128 } },       // ~5837 km
    { id: 'oob-tokyo', target: { lng: 139.6503, lat: 35.6762 } },    // ~9715 km (hors portée 7000 km)
  ];

  const schedule = computeMultiStrikeTimings(origin, strikes, 24000, 7000);
  assert.equal(schedule.inRangeCount, 3);

  const london = schedule.timings.find((t) => t.id === 'near-london')!;
  const moscow = schedule.timings.find((t) => t.id === 'mid-moscow')!;
  const nyc = schedule.timings.find((t) => t.id === 'far-nyc')!;
  const tokyo = schedule.timings.find((t) => t.id === 'oob-tokyo')!;

  assert.equal(tokyo.inRange, false);
  assert.ok(london.impactAtMs < moscow.impactAtMs);
  assert.ok(moscow.impactAtMs < nyc.impactAtMs);
  assert.ok(london.flightDurationMin < moscow.flightDurationMin);
  assert.ok(moscow.flightDurationMin < nyc.flightDurationMin);

  // Vérifie qu'à un instant intermédiaire, Londres a déjà détoné alors que Moscou et New York volent encore
  const midClock = moscow.impactAtMs - 150;
  const statesMid = evaluateBallisticClock(schedule.timings, midClock);
  assert.equal(statesMid['near-london'].progress, 1);
  assert.ok((statesMid['near-london'].detonationTimeMs ?? -1) > 0);
  assert.ok(statesMid['mid-moscow'].progress < 1);
  assert.equal(statesMid['mid-moscow'].detonationTimeMs, null);
  assert.ok(statesMid['far-nyc'].progress < statesMid['mid-moscow'].progress);
  assert.equal(statesMid['far-nyc'].detonationTimeMs, null);
  assert.equal(statesMid['oob-tokyo'].progress, 0);
  assert.equal(statesMid['oob-tokyo'].detonationTimeMs, null);
});

import {
  SIMULATION_CEILINGS,
  clampYieldKt,
  clampSpeedKmh,
  clampApogeeKm,
  computeBallisticImpactCoupling,
  computeVisualApogeeKm,
  getGeodesicCirclePolygon,
} from './nuclearMath';
import { computeCombinedCasualtyReport } from './populationModel';
import { searchOfflineLocations, resolveOfflineGeoData } from './geoDataFetcher';
import { getWorldDemographicDataset } from '../data/worldPopulation';

test('computeCombinedCasualtyReport scales across multiple countries/continents and entire planet without exceeding world population', () => {
  const worldDataset = getWorldDemographicDataset();

  // 1,500,000 kt (1.5 Gt) sur Paris dépasse la population locale parisienne et touche plusieurs pays d'Europe
  const gigatonRadii = calculateBlastRadii(1_500_000, 'airburst');
  const regionalReport = computeCombinedCasualtyReport({
    strikes: [{ id: 'current-target', target: { lat: 48.8566, lng: 2.3522 }, radii: gigatonRadii, effectiveYield: 1_500_000 }],
    defaultWeaponType: 'fusion',
    targetGeoData: null,
    worldDataset,
  });
  assert.ok(regionalReport.fatalities > 2_500_000, `Expected multi-million fatalities, got ${regionalReport.fatalities}`);
  assert.ok((regionalReport.affectedCountriesCount ?? 0) >= 2);
  assert.ok(regionalReport.impactScale === 'Continentale' || regionalReport.impactScale === 'Multi-Continentale');

  // 1.5e12 kt (exagération maximale) couvre la planète sans jamais dépasser la population mondiale
  const planetaryRadii = calculateBlastRadii(1.5e12, 'airburst');
  const planetaryReport = computeCombinedCasualtyReport({
    strikes: [{ id: 'current-target', target: { lat: 48.8566, lng: 2.3522 }, radii: planetaryRadii, effectiveYield: 1.5e12 }],
    defaultWeaponType: 'fusion',
    targetGeoData: null,
    worldDataset,
  });
  assert.equal(planetaryReport.impactScale, 'Planétaire');
  assert.ok((planetaryReport.affectedContinents?.length ?? 0) >= 4);
  assert.ok(planetaryReport.fatalities > 1_000_000_000);
  const totalAffected = planetaryReport.fatalities + planetaryReport.graveInjures + planetaryReport.lightInjures;
  assert.ok(totalAffected <= worldDataset.totalWorldPopulation);
});

test('computeCombinedCasualtyReport handles multi-strike overlap without double-counting and counts coastal tsunami impacts', () => {
  const worldDataset = getWorldDemographicDataset();
  const r20kt = calculateBlastRadii(20, 'airburst');

  const singleParis = computeCombinedCasualtyReport({
    strikes: [{ id: 's1', target: { lat: 48.8566, lng: 2.3522 }, radii: r20kt, effectiveYield: 20 }],
    defaultWeaponType: 'fission',
    targetGeoData: null,
    worldDataset,
  });

  const doubleParisSameSpot = computeCombinedCasualtyReport({
    strikes: [
      { id: 's1', target: { lat: 48.8566, lng: 2.3522 }, radii: r20kt, effectiveYield: 20 },
      { id: 's2', target: { lat: 48.8566, lng: 2.3522 }, radii: r20kt, effectiveYield: 20 },
    ],
    defaultWeaponType: 'fission',
    targetGeoData: null,
    worldDataset,
  });
  // Double frappe au même endroit : ne doit pas dépasser la population totale de la ville (~2.16M)
  assert.ok(doubleParisSameSpot.fatalities <= 2_200_000);
  assert.ok(doubleParisSameSpot.fatalities >= singleParis.fatalities);
  assert.equal(doubleParisSameSpot.isMultiStrike, true);
  assert.equal(doubleParisSameSpot.strikeCount, 2);

  // Frappe maritime côtière au large de Tokyo avec rayon d'inondation tsunami
  const oceanOffTokyo = computeCombinedCasualtyReport({
    strikes: [{
      id: 'tsunami-hit',
      target: { lat: 35.4, lng: 140.4 },
      radii: calculateBlastRadii(5000, 'surface'),
      effectiveYield: 5000,
      tsunamiFloodRadiusM: 65_000,
    }],
    defaultWeaponType: 'fusion',
    targetGeoData: null,
    worldDataset,
  });
  assert.ok(oceanOffTokyo.fatalities + oceanOffTokyo.graveInjures + oceanOffTokyo.lightInjures > 0);
});

test('ballistic speed & apogee coupling increases impact Mach/kinetic yield and obeys ceilings', () => {
  assert.equal(clampYieldKt(1e20), SIMULATION_CEILINGS.MAX_YIELD_KT);
  assert.equal(clampSpeedKmh(9_999_999), SIMULATION_CEILINGS.MAX_SPEED_KMH);
  assert.equal(clampApogeeKm(5_002_000_000), SIMULATION_CEILINGS.MAX_APOGEE_KM);
  assert.ok(computeVisualApogeeKm(50_000) <= SIMULATION_CEILINGS.MAX_VISUAL_APOGEE_KM);

  const slowLow = computeBallisticImpactCoupling({
    baseYieldKt: 20,
    speedKmh: 900,
    apogeeKm: 1,
    vectorId: 'cruise',
    explosionType: 'surface',
    surfaceDistKm: 500,
  });
  const fastHigh = computeBallisticImpactCoupling({
    baseYieldKt: 20,
    speedKmh: 400_000,
    apogeeKm: 15_000,
    vectorId: 'icbm',
    explosionType: 'surface',
    surfaceDistKm: 5000,
  });

  assert.ok(fastHigh.impactVelocityMach > slowLow.impactVelocityMach);
  assert.ok(fastHigh.kineticYieldKt > slowLow.kineticYieldKt);
  assert.ok(fastHigh.plasmaIntensity > slowLow.plasmaIntensity);
  assert.ok(fastHigh.craterMultiplier > slowLow.craterMultiplier);
  assert.ok(fastHigh.seismicBoostMag > slowLow.seismicBoostMag);

  // Durée visuelle adaptative selon vitesse et apogée dans [1.2s, 12s]
  const origin = { lng: 2.3522, lat: 48.8566 };
  const target = [{ id: 'nyc', target: { lng: -74.006, lat: 40.7128 } }];
  const fastSchedule = computeMultiStrikeTimings(origin, target, 450_000, 99_999, 100);
  const slowSchedule = computeMultiStrikeTimings(origin, target, 900, 99_999, 50_000);
  assert.ok(fastSchedule.visualDurationMs < slowSchedule.visualDurationMs);
  assert.ok(fastSchedule.visualDurationMs >= SIMULATION_CEILINGS.MIN_VISUAL_FLIGHT_MS);
  assert.ok(slowSchedule.visualDurationMs <= SIMULATION_CEILINGS.MAX_VISUAL_FLIGHT_MS);
});

test('getGeodesicCirclePolygon prevents Mercator polar inflation at 88.657N (0.jpg-4.jpg root cause)', () => {
  const highLatPoly = getGeodesicCirclePolygon(-10.737, 88.657, 620_000, 72);
  assert.ok(highLatPoly.length > 10);
  // Rayon 620 km (~5.57°) depuis 88.657°N ne doit JAMAIS descendre sous ~82°N (contrairement au bug Mercator qui recouvrait l'Europe à 48°N)
  const minLat = Math.min(...highLatPoly.map((p) => p[1]));
  assert.ok(minLat > 82, `Expected Arctic circle to stay north of 82N, got minLat=${minLat}`);
});

test('offline search and offline geo resolver identify cities, countries and open oceans without network', () => {
  const parisHits = searchOfflineLocations('Paris');
  assert.ok(parisHits.length > 0);
  assert.equal(parisHits[0].name, 'Paris');

  const tokyoGeo = resolveOfflineGeoData(35.6762, 139.6503);
  assert.equal(tokyoGeo.isWater, false);
  assert.ok(tokyoGeo.autoGeoData.population > 1_000_000);

  const atlanticGeo = resolveOfflineGeoData(28.0, -45.0);
  assert.equal(atlanticGeo.isWater, true);
  assert.equal(atlanticGeo.autoGeoData.population, 0);
});

