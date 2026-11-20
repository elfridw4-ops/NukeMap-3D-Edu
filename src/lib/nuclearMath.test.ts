import { describe, expect, it } from 'vitest';
import {
  calculateBlastRadii,
  calculateTsunamiMetrics,
  calculateCasualtyReport,
  calculateRichterScale,
  resolveVectorFlightProfile,
  calculateFalloutPlumeLengthKm,
  haversineKm,
  WEAPON_PRESETS,
} from './nuclearMath';

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
});
