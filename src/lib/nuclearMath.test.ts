import { describe, expect, it } from 'vitest';
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

describe('calculateBlastRadii', () => {
  it('returns non-zero radii for a realistic yield and airburst', () => {
    const result = calculateBlastRadii(20, 'airburst');

    expect(result.fireball).toBeGreaterThan(0);
    expect(result.heavyBlast).toBeGreaterThan(0);
    expect(result.thermal1st).toBeGreaterThan(result.thermal3rd);
  });

  it('safely clamps zero or negative yields without producing NaN/Infinity', () => {
    const zeroResult = calculateBlastRadii(0, 'surface');
    const negResult = calculateBlastRadii(-25, 'airburst');

    expect(Number.isFinite(zeroResult.fireball)).toBe(true);
    expect(zeroResult.fireball).toBeGreaterThan(0);
    expect(zeroResult.crater).toBeGreaterThan(0);
    expect(Number.isFinite(negResult.heavyBlast)).toBe(true);
    expect(negResult.heavyBlast).toBeGreaterThan(0);
  });
});

describe('calculateRichterScale & presets', () => {
  it('guards against zero or negative yield', () => {
    expect(Number.isFinite(calculateRichterScale(0))).toBe(true);
    expect(calculateRichterScale(20)).toBeGreaterThan(4);
  });

  it('keeps dirty_bomb preset yieldKt aligned with yieldValue', () => {
    const dirty = WEAPON_PRESETS.find((w) => w.id === 'dirty_bomb');
    expect(dirty).toBeDefined();
    expect(dirty?.yieldKt).toBe(dirty?.yieldValue);
  });
});

describe('resolveVectorFlightProfile & calculateFalloutPlumeLengthKm', () => {
  it('honors custom range, custom speed, and depressed trajectory speed boost', () => {
    const standard = resolveVectorFlightProfile({
      vectorId: 'icbm',
      altitudeKm: 1200,
      velocityMach: 19.6,
      customSpeedKmh: 20000,
      customRangeKm: 9000,
      trajectoryType: 'standard',
    });
    expect(standard.speedKmh).toBe(20000);
    expect(standard.maxRangeKm).toBe(9000);

    const depressed = resolveVectorFlightProfile({
      vectorId: 'icbm',
      altitudeKm: 420,
      velocityMach: 26.0,
      customSpeedKmh: 20000,
      customRangeKm: 9000,
      trajectoryType: 'depressed',
    });
    expect(depressed.speedKmh).toBe(Math.round(20000 * 1.33));
  });

  it('scales fallout plume length monotonically with wind speed', () => {
    const calm = calculateFalloutPlumeLengthKm(2000, 10);
    const windy = calculateFalloutPlumeLengthKm(2000, 70);
    expect(calm).toBeGreaterThan(0);
    expect(windy).toBeGreaterThan(calm);
  });
});

describe('calculateTsunamiMetrics & haversineKm', () => {
  it('marks a coastal strike above the threshold as eligible and respects manningN', () => {
    const smooth = calculateTsunamiMetrics(1000, 2000, 10, 2, 1.2, false, 8, 0.015);
    const rough = calculateTsunamiMetrics(1000, 2000, 10, 2, 1.2, false, 8, 0.09);

    expect(smooth.isEligible).toBe(true);
    expect(smooth.initialWaveHeightM).toBeGreaterThan(0);
    expect(smooth.depthProfile.length).toBeGreaterThan(0);
    expect(smooth.inundationDistanceM).toBeGreaterThan(rough.inundationDistanceM);
  });

  it('computes realistic Paris to London geodesic distance', () => {
    const dist = haversineKm(48.8566, 2.3522, 51.5074, -0.1278);
    expect(dist).toBeGreaterThan(335);
    expect(dist).toBeLessThan(355);
  });
});

describe('calculateCasualtyReport', () => {
  it('produces a consistent deterministic casualty report for a target city', () => {
    const radii = calculateBlastRadii(20, 'airburst');
    const r1 = calculateCasualtyReport(48.8566, 2.3522, radii, 'fission', null);
    const r2 = calculateCasualtyReport(48.8566, 2.3522, radii, 'fission', null);

    expect(r1.populationTotal).toBeGreaterThan(0);
    expect(r1.fatalities).toBeGreaterThanOrEqual(0);
    expect(r1.hospitalsAffected).toBeGreaterThanOrEqual(0);
    expect(r1).toEqual(r2);
  });

  it('splits casualties across 4 strictly increasing distance bands matching report totals', () => {
    const radii = calculateBlastRadii(475, 'airburst');
    const report = calculateCasualtyReport(48.8566, 2.3522, radii, 'fusion', null);
    const points = calculateCasualtiesByDistance(radii, report, 'fusion');

    expect(points).toHaveLength(4);
    expect(points[1].maxRadiusKm).toBeGreaterThan(points[0].maxRadiusKm);
    expect(points[2].maxRadiusKm).toBeGreaterThan(points[1].maxRadiusKm);
    expect(points[3].maxRadiusKm).toBeGreaterThan(points[2].maxRadiusKm);

    expect(points.reduce((acc, p) => acc + p.fatalities, 0)).toBe(report.fatalities);
    expect(points.reduce((acc, p) => acc + p.graveInjures, 0)).toBe(report.graveInjures);
    expect(points.reduce((acc, p) => acc + p.lightInjures, 0)).toBe(report.lightInjures);
    expect(points[0].fatalities).toBeGreaterThan(points[3].fatalities);
  });

  it('handles dirty bomb profiles and zero casualties safely', () => {
    const radii = calculateBlastRadii(0.1, 'airburst');
    const dirtyReport = calculateCasualtyReport(48.8566, 2.3522, radii, 'dirty', null);
    const dirtyPoints = calculateCasualtiesByDistance(radii, dirtyReport, 'dirty');
    expect(dirtyPoints.reduce((acc, p) => acc + p.lightInjures, 0)).toBe(dirtyReport.lightInjures);

    const emptyPoints = calculateCasualtiesByDistance(radii, { ...dirtyReport, fatalities: 0, graveInjures: 0, lightInjures: 0 }, 'fission');
    expect(emptyPoints.every((p) => p.total === 0)).toBe(true);
  });
});

describe('soundEngine & acoustic yield scaling', () => {
  it('scales detonation rumble duration and cutoff frequencies by yield and weapon type', () => {
    const tactical = computeDetonationSoundProfile(0.02, 'fission');
    const strategic = computeDetonationSoundProfile(50000, 'fusion');
    const dirty = computeDetonationSoundProfile(0.1, 'dirty');

    expect(strategic.durationSec).toBeGreaterThan(tactical.durationSec);
    expect(strategic.noiseFilterHz).toBeLessThan(tactical.noiseFilterHz);
    expect(dirty.geigerClicks).toBeGreaterThan(strategic.geigerClicks);
  });

  it('tracks mute toggle state and handles missing AudioContext cleanly', () => {
    soundEngine.setEnabled(false);
    expect(soundEngine.isEnabled()).toBe(false);
    expect(() => soundEngine.playDetonation(20, 'fission')).not.toThrow();

    soundEngine.setEnabled(true);
    expect(soundEngine.isEnabled()).toBe(true);
  });
});

describe('multi-strike distance-proportional ballistic timings', () => {
  it('assigns earlier impact timestamps to closer targets and maintains staggered progression', () => {
    const origin = { lng: 2.3522, lat: 48.8566 };
    const strikes = [
      { id: 'near', target: { lng: -0.1278, lat: 51.5074 } },
      { id: 'mid', target: { lng: 37.6173, lat: 55.7558 } },
      { id: 'far', target: { lng: -74.006, lat: 40.7128 } },
      { id: 'oob', target: { lng: 139.6503, lat: 35.6762 } },
    ];

    const schedule = computeMultiStrikeTimings(origin, strikes, 24000, 7000);
    expect(schedule.inRangeCount).toBe(3);

    const byId = Object.fromEntries(schedule.timings.map((t) => [t.id, t]));
    expect(byId.near.impactAtMs).toBeLessThan(byId.mid.impactAtMs);
    expect(byId.mid.impactAtMs).toBeLessThan(byId.far.impactAtMs);
    expect(byId.oob.inRange).toBe(false);

    const midStates = evaluateBallisticClock(schedule.timings, byId.near.impactAtMs + 250);
    expect(midStates.near.progress).toBe(1);
    expect(midStates.near.detonationTimeMs).toBe(250);
    expect(midStates.far.progress).toBeLessThan(midStates.mid.progress);
    expect(midStates.far.detonationTimeMs).toBeNull();
    expect(midStates.oob.progress).toBe(0);
  });
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

describe('planetary casualties, multi-strike de-biasing, kinetic coupling & geodesic polar accuracy', () => {
  it('computes multi-continent and planetary casualties bounded by world population', () => {
    const worldDataset = getWorldDemographicDataset();
    const planetaryRadii = calculateBlastRadii(1.5e12, 'airburst');
    const report = computeCombinedCasualtyReport({
      strikes: [{ id: 'current-target', target: { lat: 48.8566, lng: 2.3522 }, radii: planetaryRadii, effectiveYield: 1.5e12 }],
      defaultWeaponType: 'fusion',
      targetGeoData: null,
      worldDataset,
    });

    expect(report.impactScale).toBe('Planétaire');
    expect((report.affectedContinents ?? []).length).toBeGreaterThanOrEqual(4);
    expect(report.fatalities).toBeGreaterThan(1_000_000_000);
    expect(report.fatalities + report.graveInjures + report.lightInjures).toBeLessThanOrEqual(worldDataset.totalWorldPopulation);
  });

  it('couples speed and apogee into kinetic yield, Mach, visual duration and honors ceilings', () => {
    expect(clampYieldKt(1e20)).toBe(SIMULATION_CEILINGS.MAX_YIELD_KT);
    expect(clampSpeedKmh(9_999_999)).toBe(SIMULATION_CEILINGS.MAX_SPEED_KMH);
    expect(clampApogeeKm(5_002_000_000)).toBe(SIMULATION_CEILINGS.MAX_APOGEE_KM);
    expect(computeVisualApogeeKm(50_000)).toBeLessThanOrEqual(SIMULATION_CEILINGS.MAX_VISUAL_APOGEE_KM);

    const fastHigh = computeBallisticImpactCoupling({
      baseYieldKt: 20,
      speedKmh: 400_000,
      apogeeKm: 15_000,
      vectorId: 'icbm',
      explosionType: 'surface',
      surfaceDistKm: 5000,
    });
    const slowLow = computeBallisticImpactCoupling({
      baseYieldKt: 20,
      speedKmh: 900,
      apogeeKm: 1,
      vectorId: 'cruise',
      explosionType: 'surface',
      surfaceDistKm: 500,
    });

    expect(fastHigh.impactVelocityMach).toBeGreaterThan(slowLow.impactVelocityMach);
    expect(fastHigh.kineticYieldKt).toBeGreaterThan(slowLow.kineticYieldKt);
    expect(fastHigh.craterMultiplier).toBeGreaterThan(slowLow.craterMultiplier);

    const origin = { lng: 2.3522, lat: 48.8566 };
    const strikes = [{ id: 'nyc', target: { lng: -74.006, lat: 40.7128 } }];
    const fastTiming = computeMultiStrikeTimings(origin, strikes, 450_000, 99_999, 100);
    const slowTiming = computeMultiStrikeTimings(origin, strikes, 900, 99_999, 50_000);
    expect(fastTiming.visualDurationMs).toBeLessThan(slowTiming.visualDurationMs);
    expect(fastTiming.visualDurationMs).toBeGreaterThanOrEqual(SIMULATION_CEILINGS.MIN_VISUAL_FLIGHT_MS);
    expect(slowTiming.visualDurationMs).toBeLessThanOrEqual(SIMULATION_CEILINGS.MAX_VISUAL_FLIGHT_MS);
  });

  it('keeps Arctic 620 km geodesic circles north of 82N without Mercator polar blowup', () => {
    const poly = getGeodesicCirclePolygon(-10.737, 88.657, 620_000, 72);
    expect(poly.length).toBeGreaterThan(10);
    const minLat = Math.min(...poly.map((p) => p[1]));
    expect(minLat).toBeGreaterThan(82);
  });

  it('resolves offline locations and ocean coordinates deterministically', () => {
    expect(searchOfflineLocations('Paris')[0]?.name).toBe('Paris');
    expect(resolveOfflineGeoData(35.6762, 139.6503).isWater).toBe(false);
    expect(resolveOfflineGeoData(28.0, -45.0).isWater).toBe(true);
  });
});

