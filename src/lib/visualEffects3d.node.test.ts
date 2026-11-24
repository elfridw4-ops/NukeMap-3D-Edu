import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeGeodesicBearingDeg,
  interpolateGeodesicPoint,
  generateToroidalMushroomPoints,
  generateWilsonCloudData,
  computeMissileCameraViewState,
} from './visualEffects3d';
import { EnvironmentParams } from '../types';

const baseEnv: EnvironmentParams = {
  explosionType: 'surface',
  windDirection: 90,
  windSpeed: 25,
  showMushroomCloud: true,
  maritimeImpact: true,
  oceanDepthM: 2000,
  shoreDistanceKm: 10,
  beachSlopePct: 2,
  terrainDamping: 1,
  tropopauseAltitudeKm: 11.5,
};

test('interpolateGeodesicPoint returns valid great-circle midpoints and endpoints', () => {
  const start = interpolateGeodesicPoint(-74.006, 40.7128, 2.3522, 48.8566, 0);
  const mid = interpolateGeodesicPoint(-74.006, 40.7128, 2.3522, 48.8566, 0.5);
  const end = interpolateGeodesicPoint(-74.006, 40.7128, 2.3522, 48.8566, 1);

  assert.equal(start[0], -74.006);
  assert.equal(end[0], 2.3522);
  // Grand cercle New York -> Paris monte plus au nord (~52°N) que la moyenne linéaire (~44.78°N)
  assert.ok(mid[1] > 49.0, `Expected great-circle arc latitude > 49N, got ${mid[1]}`);

  const brng = computeGeodesicBearingDeg(-74.006, 40.7128, 2.3522, 48.8566);
  assert.ok(brng > 35 && brng < 75, `Expected NE bearing ~54deg, got ${brng}`);
});

test('generateToroidalMushroomPoints generates graduated layers with animated convective roll', () => {
  const early = generateToroidalMushroomPoints({ lng: 2.3522, lat: 48.8566 }, baseEnv, 50000, 3200);
  const later = generateToroidalMushroomPoints({ lng: 2.3522, lat: 48.8566 }, baseEnv, 50000, 7200);

  assert.ok(early.finePoints.length > 200);
  assert.ok(early.coarsePoints.length > 500);
  assert.ok(early.baseSurgePoints.length === 450);

  // Le champignon s'élève et s'étale avec le temps
  const maxZEarly = Math.max(...early.coarsePoints.map((p) => p.position[2]));
  const maxZLater = Math.max(...later.coarsePoints.map((p) => p.position[2]));
  assert.ok(maxZLater > maxZEarly, `Expected mushroom height to rise (${maxZEarly} -> ${maxZLater})`);

  // Respect de la tropopause pour faible puissance (< 1000 kt)
  const small = generateToroidalMushroomPoints({ lng: 2.3522, lat: 48.8566 }, baseEnv, 20, 8000);
  const maxZSmall = Math.max(...small.coarsePoints.map((p) => p.position[2]));
  assert.ok(maxZSmall <= 20_000, `Small yield mushroom should respect tropopause ceiling, got ${maxZSmall}`);

  // Désactivé si showMushroomCloud = false
  const disabled = generateToroidalMushroomPoints(
    { lng: 2.3522, lat: 48.8566 },
    { ...baseEnv, showMushroomCloud: false },
    50000,
    5000
  );
  assert.equal(disabled.finePoints.length, 0);
  assert.equal(disabled.coarsePoints.length, 0);
});

test('generateWilsonCloudData produces condensation ring only during shockwave depression window', () => {
  const before = generateWilsonCloudData({ lng: 2.3522, lat: 48.8566 }, 1200, 5000, 1000, 300);
  const peak = generateWilsonCloudData({ lng: 2.3522, lat: 48.8566 }, 1200, 5000, 1000, 1800);
  const after = generateWilsonCloudData({ lng: 2.3522, lat: 48.8566 }, 1200, 5000, 1000, 5000);

  assert.equal(before.active, false);
  assert.equal(peak.active, true);
  assert.ok(peak.ringPolygon3D.length > 32);
  assert.ok(peak.haloPoints.length === 160);
  assert.ok(peak.ringPolygon3D[0][2] > 400);
  assert.equal(after.active, false);
});

test('computeMissileCameraViewState tracks boost, apogee, terminal dive, and post-impact', () => {
  const origin = { lng: -74.006, lat: 40.7128 };
  const target = { lng: 2.3522, lat: 48.8566 };

  const boost = computeMissileCameraViewState({ origin, target, progress: 0.08, apogeeKm: 1200 });
  const apogee = computeMissileCameraViewState({ origin, target, progress: 0.5, apogeeKm: 1200 });
  const terminal = computeMissileCameraViewState({ origin, target, progress: 0.94, apogeeKm: 1200 });
  const impact = computeMissileCameraViewState({ origin, target, progress: 1.0, apogeeKm: 1200, detonationTimeMs: 1500 });

  assert.ok(apogee.zoom < boost.zoom, `Expected apogee zoom (${apogee.zoom}) < boost zoom (${boost.zoom})`);
  assert.ok(terminal.zoom > apogee.zoom, `Expected terminal zoom (${terminal.zoom}) > apogee zoom (${apogee.zoom})`);
  assert.ok(apogee.pitch > terminal.pitch, `Expected apogee pitch (${apogee.pitch}) > terminal pitch (${terminal.pitch})`);
  assert.equal(impact.longitude, target.lng);
  assert.equal(impact.latitude, target.lat);
});
