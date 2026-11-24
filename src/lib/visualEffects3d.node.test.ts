import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeGeodesicBearingDeg,
  interpolateGeodesicPoint,
  generateToroidalMushroomPoints,
  generateWilsonCloudData,
  computeMissileCameraViewState,
  computeGroundObserverViewState,
  computeOrbitalCameraViewState,
  generate3DTsunamiWaveData,
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

test('computeGroundObserverViewState places low-angle observer looking toward ground zero', () => {
  const small = computeGroundObserverViewState({
    target: { lng: 2.3522, lat: 48.8566 },
    lightBlastM: 4330,
    fireballM: 730,
    effectiveYield: 20,
  });
  const tsar = computeGroundObserverViewState({
    target: { lng: 2.3522, lat: 48.8566 },
    lightBlastM: 60000,
    fireballM: 4600,
    effectiveYield: 50000,
  });

  assert.ok(small.viewState.pitch >= 77 && small.viewState.pitch <= 83);
  assert.ok(tsar.standoffKm > small.standoffKm, 'Larger yield should place observer farther out');
  assert.ok(tsar.shockwaveArrivalSec > small.shockwaveArrivalSec);
  assert.ok(Number.isFinite(small.observerLng) && Number.isFinite(small.observerLat));
});

test('computeOrbitalCameraViewState frames single targets and transatlantic corridors', () => {
  const single = computeOrbitalCameraViewState({
    target: { lng: 139.65, lat: 35.68 },
    origin: null,
    lightBlastM: 25000,
  });
  const corridor = computeOrbitalCameraViewState({
    target: { lng: 139.65, lat: 35.68 },
    origin: { lng: 2.3522, lat: 48.8566 },
    lightBlastM: 25000,
  });

  assert.equal(single.pitch, 0);
  assert.ok(corridor.zoom < single.zoom, 'Long ballistic corridor should zoom out further in orbit');
  assert.ok(corridor.zoom >= 1.0 && corridor.zoom <= 3.5);
});

test('generate3DTsunamiWaveData builds continuous 3D wave surface mesh with valid normals and foam', () => {
  const early = generate3DTsunamiWaveData({
    target: { lng: 139.91, lat: 35.01 },
    isWater: true,
    isEligible: true,
    shoreDistanceKm: 35,
    oceanDepthM: 2200,
    initialWaveHeightM: 28,
    shoreWaveHeightM: 42,
    runUpHeightM: 64,
    floodRadiusM: 18000,
    detonationTimeMs: 3200,
  });
  const later = generate3DTsunamiWaveData({
    target: { lng: 139.91, lat: 35.01 },
    isWater: true,
    isEligible: true,
    shoreDistanceKm: 35,
    oceanDepthM: 2200,
    initialWaveHeightM: 28,
    shoreWaveHeightM: 42,
    runUpHeightM: 64,
    floodRadiusM: 18000,
    detonationTimeMs: 6500,
  });

  assert.equal(early.active, true);
  assert.ok(early.mesh !== null);
  assert.ok(early.stats.vertexCount > 2000);
  assert.ok(early.stats.triangleCount > 3000);
  assert.ok(early.stats.maxElevationM >= 200);
  assert.ok(early.stats.crestRadiiM.length >= 2);
  assert.ok(early.foamPoints.length >= 220);

  const pos = early.mesh!.attributes.POSITION.value;
  const nrm = early.mesh!.attributes.NORMAL.value;
  const col = early.mesh!.attributes.COLOR_0.value;
  const idx = early.mesh!.indices.value;

  assert.equal(pos.length, early.stats.vertexCount * 3);
  assert.equal(nrm.length, early.stats.vertexCount * 3);
  assert.equal(col.length, early.stats.vertexCount * 3);
  assert.equal(idx.length, early.stats.triangleCount * 3);

  // Vérifie que tous les indices sont dans les bornes et que les normales pointent vers le haut
  for (let i = 0; i < idx.length; i += 47) {
    assert.ok(idx[i] < early.stats.vertexCount, `Index out of bounds: ${idx[i]}`);
  }
  for (let v = 0; v < early.stats.vertexCount; v += 19) {
    const nx = nrm[v * 3];
    const ny = nrm[v * 3 + 1];
    const nz = nrm[v * 3 + 2];
    const normLen = Math.hypot(nx, ny, nz);
    assert.ok(Math.abs(normLen - 1) < 1e-3, `Normal should be unit length, got ${normLen}`);
    assert.ok(nz > 0, `Normal Z should point upward, got ${nz}`);
  }

  // Les vagues avancent radialement avec le temps
  assert.ok(
    later.stats.crestRadiiM[0] > early.stats.crestRadiiM[0],
    `Expected leading wave radius to advance (${early.stats.crestRadiiM[0]} -> ${later.stats.crestRadiiM[0]})`
  );

  // Séparation des crêtes (la 1re vague devance la 2e)
  assert.ok(
    later.stats.crestRadiiM[0] > later.stats.crestRadiiM[1],
    'Leading crest must stay ahead of trailing crest'
  );

  // En haute mer (shoreDistanceKm = 0), le train d'onde se propage librement au-delà de 15 km
  const openOcean = generate3DTsunamiWaveData({
    target: { lng: -120.9375, lat: -0.7031 },
    isWater: true,
    isEligible: true,
    shoreDistanceKm: 0,
    oceanDepthM: 4000,
    initialWaveHeightM: 65,
    shoreWaveHeightM: 80,
    runUpHeightM: 90,
    floodRadiusM: 25000,
    detonationTimeMs: 4800,
  });
  assert.equal(openOcean.active, true);
  assert.ok(
    openOcean.stats.crestRadiiM[0] > 10_000,
    `Expected open-ocean leading crest > 10km, got ${openOcean.stats.crestRadiiM[0]}`
  );

  const ineligible = generate3DTsunamiWaveData({
    target: { lng: 2.3522, lat: 48.8566 },
    isWater: false,
    isEligible: false,
    shoreDistanceKm: 188,
    oceanDepthM: 2000,
    initialWaveHeightM: 0,
    shoreWaveHeightM: 0,
    runUpHeightM: 0,
    floodRadiusM: 0,
    detonationTimeMs: 5000,
  });
  assert.equal(ineligible.active, false);
  assert.equal(ineligible.mesh, null);
});

