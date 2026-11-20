import test from 'node:test';
import assert from 'node:assert/strict';
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
