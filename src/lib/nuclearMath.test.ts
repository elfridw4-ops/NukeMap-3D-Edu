import { describe, expect, it } from 'vitest';
import { calculateBlastRadii, calculateTsunamiMetrics, calculateCasualtyReport } from './nuclearMath';

describe('calculateBlastRadii', () => {
  it('returns non-zero radii for a realistic yield and airburst', () => {
    const result = calculateBlastRadii(20, 'airburst');

    expect(result.fireball).toBeGreaterThan(0);
    expect(result.heavyBlast).toBeGreaterThan(0);
    expect(result.thermal1st).toBeGreaterThan(result.thermal3rd);
  });
});

describe('calculateTsunamiMetrics', () => {
  it('marks a coastal strike above the threshold as eligible', () => {
    const result = calculateTsunamiMetrics(1000, 2000, 10, 2, 1.2, false, 8, 0.05);

    expect(result.isEligible).toBe(true);
    expect(result.initialWaveHeightM).toBeGreaterThan(0);
    expect(result.depthProfile.length).toBeGreaterThan(0);
  });
});

describe('calculateCasualtyReport', () => {
  it('produces a consistent casualty report for a target city', () => {
    const radii = calculateBlastRadii(20, 'airburst');
    const report = calculateCasualtyReport(48.8566, 2.3522, radii, 'fission', null);

    expect(report.populationTotal).toBeGreaterThan(0);
    expect(report.fatalities).toBeGreaterThanOrEqual(0);
    expect(report.hospitalsAffected).toBeGreaterThanOrEqual(0);
  });
});
