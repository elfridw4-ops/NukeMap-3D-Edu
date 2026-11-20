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
