import { EnvironmentParams } from '../types';
import {
  clampApogeeKm,
  computeVisualApogeeKm,
  getGeodesicDestination,
  getGeodesicCirclePolygon,
  clampVisualRadiusM,
  haversineKm,
} from './nuclearMath';

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function hash01(seed: number): number {
  const s = (Math.sin(seed) * 43758.5453123) % 1;
  return s < 0 ? s + 1 : s;
}

/**
 * Calcule le cap initial (azimut en degrés 0..360) entre deux points géographiques.
 */
export function computeGeodesicBearingDeg(
  fromLng: number,
  fromLat: number,
  toLng: number,
  toLat: number
): number {
  const lat1 = fromLat * DEG_TO_RAD;
  const lat2 = toLat * DEG_TO_RAD;
  const dLon = (toLng - fromLng) * DEG_TO_RAD;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const brng = Math.atan2(y, x) * RAD_TO_DEG;
  return (brng + 360) % 360;
}

/**
 * Interpole un point le long du grand cercle sphérique entre origine et cible (t in [0, 1]).
 */
export function interpolateGeodesicPoint(
  fromLng: number,
  fromLat: number,
  toLng: number,
  toLat: number,
  t: number
): [number, number] {
  const clampedT = Math.max(0, Math.min(1, t));
  if (clampedT <= 0) return [fromLng, fromLat];
  if (clampedT >= 1) return [toLng, toLat];

  const lat1 = fromLat * DEG_TO_RAD;
  const lon1 = fromLng * DEG_TO_RAD;
  const lat2 = toLat * DEG_TO_RAD;
  const lon2 = toLng * DEG_TO_RAD;

  const sinLat1 = Math.sin(lat1);
  const cosLat1 = Math.cos(lat1);
  const sinLat2 = Math.sin(lat2);
  const cosLat2 = Math.cos(lat2);

  const cosD = Math.max(-1, Math.min(1, sinLat1 * sinLat2 + cosLat1 * cosLat2 * Math.cos(lon2 - lon1)));
  const d = Math.acos(cosD);
  if (d < 1e-6) {
    return [
      fromLng + (toLng - fromLng) * clampedT,
      fromLat + (toLat - fromLat) * clampedT,
    ];
  }

  const sinD = Math.sin(d);
  const a = Math.sin((1 - clampedT) * d) / sinD;
  const b = Math.sin(clampedT * d) / sinD;

  const x = a * cosLat1 * Math.cos(lon1) + b * cosLat2 * Math.cos(lon2);
  const y = a * cosLat1 * Math.sin(lon1) + b * cosLat2 * Math.sin(lon2);
  const z = a * sinLat1 + b * sinLat2;

  const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * RAD_TO_DEG;
  const lon = Math.atan2(y, x) * RAD_TO_DEG;
  return [lon, Math.max(-85.05, Math.min(85.05, lat))];
}

export interface MushroomCloudPoint {
  position: [number, number, number];
  color: [number, number, number, number];
  normal: [number, number, number];
}

export interface ToroidalMushroomResult {
  /** Particules fines du cœur chaud et des volutes de bord */
  finePoints: MushroomCloudPoint[];
  /** Particules volumétriques du chapeau convectif et de la colonne */
  coarsePoints: MushroomCloudPoint[];
  /** Anneau de poussière d'aspiration au sol (base surge / pied) */
  baseSurgePoints: MushroomCloudPoint[];
}

/**
 * Génère un champignon atomique 3D multi-couches avec mouvement convectif toroïdal
 * (le tore du chapeau roule de l'intérieur chaud vers l'extérieur refroidi) et jupe d'aspiration au sol.
 */
export function generateToroidalMushroomPoints(
  targetAddress: { lng: number; lat: number },
  environmentParams: EnvironmentParams,
  effectiveYield: number,
  detonationTimeMs: number
): ToroidalMushroomResult {
  if (!environmentParams.showMushroomCloud || effectiveYield <= 0 || detonationTimeMs < 1800) {
    return { finePoints: [], coarsePoints: [], baseSurgePoints: [] };
  }

  const rawHeight = 3000 * Math.pow(effectiveYield, 0.25);
  const tropopauseM = (environmentParams.tropopauseAltitudeKm || 11.5) * 1000;

  let height = Math.min(140_000, rawHeight);
  let capRadius = Math.min(220_000, 600 * Math.pow(effectiveYield, 0.3));

  if (effectiveYield < 1000 && rawHeight > tropopauseM * 0.8) {
    height = Math.min(height, tropopauseM);
    if (height === tropopauseM) {
      capRadius = Math.min(220_000, capRadius * 1.4);
    }
  }

  const stalkRadius = Math.min(55_000, 150 * Math.pow(effectiveYield, 0.3));
  const stalkHeight = height * 0.68;
  const capThickness = height * 0.32;

  const riseProgress = Math.min(1, (detonationTimeMs - 1800) / 5600);
  const timeSec = Math.max(0, (detonationTimeMs - 1800) / 1000);
  const driftBias = Math.min(1, Math.max(0, (detonationTimeMs - 4500) / 5500));
  const windKm = Math.min(80, (environmentParams.windSpeed || 20) * 0.35 * driftBias);
  const windDirRad = ((environmentParams.windDirection || 90) * Math.PI) / 180;
  const windDriftX = Math.sin(windDirRad) * windKm * 1000;
  const windDriftY = Math.cos(windDirRad) * windKm * 1000;

  const finePoints: MushroomCloudPoint[] = [];
  const coarsePoints: MushroomCloudPoint[] = [];
  const baseSurgePoints: MushroomCloudPoint[] = [];

  // 1. Chapeau convectif toroïdal (1800 particules)
  const capCount = 1800;
  const majorR = Math.max(stalkRadius * 1.35, capRadius * (0.42 + 0.58 * Math.pow(riseProgress, 1.15)));
  const minorR = Math.max(capThickness * 0.42, capRadius * 0.38 * Math.pow(riseProgress, 0.85));
  const capCenterZ = stalkHeight * riseProgress + capThickness * 0.35 * riseProgress;
  const toroidalSpinRad = timeSec * 1.15;

  for (let i = 0; i < capCount; i++) {
    const u = hash01(i * 12.9898 + 78.233);
    const v = hash01(i * 4.1414 + 11.854);
    const w = hash01(i * 9.5123 + 47.902);
    const s = hash01(i * 3.7381 + 99.284);

    // Angle azimutal + roulement convectif toroïdal (du cœur montant vers l'extérieur retombant)
    const phi = u * Math.PI * 2 + Math.sin(timeSec * 0.7 + v * 6) * 0.08;
    const poloidalAngle = v * Math.PI * 2 + toroidalSpinRad;
    const radialFill = 0.35 + 0.65 * Math.sqrt(w);

    // Le tore aplati horizontalement sous la tropopause
    const ringRadius = majorR * 0.55 + Math.cos(poloidalAngle) * minorR * radialFill * 0.95;
    const zLocal = Math.sin(poloidalAngle) * (capThickness * 0.52) * radialFill;
    const z = Math.max(stalkHeight * riseProgress * 0.72, capCenterZ + zLocal);

    // Chaleur interne maximale sur le côté intérieur montant du tore (cos(poloidalAngle) < 0 ou bas)
    const heatNorm = Math.max(0, Math.min(1, 0.5 - 0.5 * Math.sin(poloidalAngle) - 0.25 * Math.cos(poloidalAngle)));
    const cooling = Math.max(0.2, 1 - Math.max(0, (detonationTimeMs - 5500) / 7000));
    const thermal = heatNorm * cooling;

    let color: [number, number, number, number];
    const alpha = Math.floor((145 + s * 85) * Math.min(1, riseProgress * 1.35));
    if (thermal > 0.52) {
      color = [255, Math.floor(110 + s * 105), Math.floor(35 + s * 40), alpha];
    } else if (thermal > 0.28) {
      color = [235, Math.floor(130 + s * 65), Math.floor(85 + s * 45), alpha];
    } else {
      const shade = Math.floor(155 + s * 85);
      color = [shade, shade, Math.min(255, shade + 6), alpha];
    }

    const dx = ringRadius * Math.cos(phi) + windDriftX * (z / Math.max(1, height));
    const dy = ringRadius * Math.sin(phi) + windDriftY * (z / Math.max(1, height));
    const offsetDistKm = Math.hypot(dx, dy) / 1000;
    const bearingDeg = (Math.atan2(dx, dy) * RAD_TO_DEG + 360) % 360;
    const pos = offsetDistKm > 0
      ? getGeodesicDestination(targetAddress.lng, targetAddress.lat, offsetDistKm, bearingDeg)
      : [targetAddress.lng, targetAddress.lat];

    const pt: MushroomCloudPoint = {
      position: [pos[0], Math.max(-85, Math.min(85, pos[1])), z],
      color,
      normal: [0, 0, 1],
    };

    if (thermal > 0.45 || s > 0.65) {
      finePoints.push(pt);
    } else {
      coarsePoints.push(pt);
    }
  }

  // 2. Tige convective hélicoïdale ascendante (750 particules)
  const stalkCount = 750;
  for (let i = 0; i < stalkCount; i++) {
    const u = hash01(i * 19.31 + 5.17);
    const v = hash01(i * 7.73 + 81.42);
    const w = hash01(i * 15.09 + 29.88);

    const zFrac = (u + timeSec * 0.14) % 1;
    const z = zFrac * stalkHeight * riseProgress;
    const neckTaper = 1 - 0.35 * Math.sin(zFrac * Math.PI);
    const r = stalkRadius * neckTaper * Math.sqrt(w) * Math.min(1, riseProgress * 1.25);
    const theta = v * Math.PI * 2 + zFrac * 3.8 + timeSec * 0.55;

    const dx = r * Math.cos(theta) + windDriftX * (z / Math.max(1, height)) * 0.5;
    const dy = r * Math.sin(theta) + windDriftY * (z / Math.max(1, height)) * 0.5;
    const offsetDistKm = Math.hypot(dx, dy) / 1000;
    const bearingDeg = (Math.atan2(dx, dy) * RAD_TO_DEG + 360) % 360;
    const pos = offsetDistKm > 0
      ? getGeodesicDestination(targetAddress.lng, targetAddress.lat, offsetDistKm, bearingDeg)
      : [targetAddress.lng, targetAddress.lat];

    const isCoreIncandescent = w < 0.28 && detonationTimeMs < 7500;
    const shade = Math.floor(90 + v * 75);
    const alpha = Math.floor((110 + w * 70) * Math.min(1, riseProgress * 1.3));
    const pt: MushroomCloudPoint = {
      position: [pos[0], Math.max(-85, Math.min(85, pos[1])), z],
      color: isCoreIncandescent
        ? [255, Math.floor(135 + u * 65), 45, alpha]
        : [shade, shade - 4, shade - 8, alpha],
      normal: [0, 0, 1],
    };

    if (isCoreIncandescent) {
      finePoints.push(pt);
    } else {
      coarsePoints.push(pt);
    }
  }

  // 3. Jupe d'aspiration / Base surge au sol (450 particules)
  const baseCount = 450;
  const isSurface = environmentParams.explosionType === 'surface';
  const baseOuterR = Math.max(stalkRadius * 1.8, capRadius * (isSurface ? 1.15 : 0.78)) * Math.pow(riseProgress, 0.7);
  for (let i = 0; i < baseCount; i++) {
    const u = hash01(i * 23.17 + 14.9);
    const v = hash01(i * 11.43 + 63.1);
    const w = hash01(i * 5.87 + 91.2);

    const radialProg = (u + timeSec * 0.09) % 1;
    const r = stalkRadius * 0.8 + radialProg * baseOuterR;
    const theta = v * Math.PI * 2;
    const z = (0.015 + 0.075 * Math.sin(radialProg * Math.PI) * w) * height * riseProgress;

    const dx = r * Math.cos(theta);
    const dy = r * Math.sin(theta);
    const offsetDistKm = Math.hypot(dx, dy) / 1000;
    const bearingDeg = (Math.atan2(dx, dy) * RAD_TO_DEG + 360) % 360;
    const pos = offsetDistKm > 0
      ? getGeodesicDestination(targetAddress.lng, targetAddress.lat, offsetDistKm, bearingDeg)
      : [targetAddress.lng, targetAddress.lat];

    const tone = isSurface ? Math.floor(95 + w * 55) : Math.floor(135 + w * 60);
    const alpha = Math.floor((1 - radialProg * 0.55) * (isSurface ? 150 : 105) * Math.min(1, riseProgress * 1.4));
    baseSurgePoints.push({
      position: [pos[0], Math.max(-85, Math.min(85, pos[1])), z],
      color: [tone + 8, tone, tone - 8, Math.max(20, alpha)],
      normal: [0, 0, 1],
    });
  }

  return { finePoints, coarsePoints, baseSurgePoints };
}

export interface WilsonCloudLayerData {
  active: boolean;
  ringPolygon3D: [number, number, number][];
  outerRingPath3D: [number, number, number][];
  fillColor: [number, number, number, number];
  lineColor: [number, number, number, number];
  haloPoints: MushroomCloudPoint[];
}

/**
 * Modélise le nuage de condensation atmosphérique (Nuage de Wilson) formé brièvement
 * dans la zone de dépression derrière l'onde de choc (T+750 ms -> T+3800 ms).
 */
export function generateWilsonCloudData(
  targetAddress: { lng: number; lat: number },
  fireballRadiusM: number,
  moderateBlastRadiusM: number,
  effectiveYield: number,
  detonationTimeMs: number
): WilsonCloudLayerData {
  const empty: WilsonCloudLayerData = {
    active: false,
    ringPolygon3D: [],
    outerRingPath3D: [],
    fillColor: [255, 255, 255, 0],
    lineColor: [255, 255, 255, 0],
    haloPoints: [],
  };

  if (effectiveYield <= 0 || detonationTimeMs < 750 || detonationTimeMs > 3800) {
    return empty;
  }

  const progress = (detonationTimeMs - 750) / 3050; // 0 -> 1
  // Enveloppe rapide puis dissipation douce
  const envelope = progress < 0.25
    ? progress / 0.25
    : Math.max(0, 1 - (progress - 0.25) / 0.75);

  if (envelope <= 0.02) return empty;

  const minR = Math.max(400, fireballRadiusM * 1.15);
  const maxR = Math.max(minR * 1.8, moderateBlastRadiusM * 1.25);
  const currentRadiusM = clampVisualRadiusM(minR + (maxR - minR) * Math.pow(progress, 0.78));

  const rawHeight = 3000 * Math.pow(effectiveYield, 0.25);
  const cloudZ = Math.min(28_000, Math.max(450, rawHeight * (0.24 + 0.16 * progress)));

  const poly2d = getGeodesicCirclePolygon(targetAddress.lng, targetAddress.lat, currentRadiusM, 64);
  const ringPolygon3D: [number, number, number][] = poly2d.map(([lng, lat]) => [lng, lat, cloudZ]);
  const outerRingPath3D = ringPolygon3D.slice(0, Math.max(0, ringPolygon3D.length - 1));

  // Particules vaporeuses autour de la collerette du nuage de Wilson
  const haloPoints: MushroomCloudPoint[] = [];
  const haloCount = 160;
  for (let i = 0; i < haloCount; i++) {
    const u = hash01(i * 17.13 + 3.41);
    const v = hash01(i * 8.91 + 55.12);
    const radialJitter = currentRadiusM * (0.86 + u * 0.22);
    const bearingDeg = v * 360;
    const pos = getGeodesicDestination(targetAddress.lng, targetAddress.lat, radialJitter / 1000, bearingDeg);
    const zJitter = cloudZ * (0.88 + u * 0.24);
    haloPoints.push({
      position: [pos[0], Math.max(-85, Math.min(85, pos[1])), zJitter],
      color: [241, 245, 249, Math.floor(135 * envelope)],
      normal: [0, 0, 1],
    });
  }

  return {
    active: true,
    ringPolygon3D,
    outerRingPath3D,
    fillColor: [248, 250, 252, Math.floor(72 * envelope)],
    lineColor: [255, 255, 255, Math.floor(175 * envelope)],
    haloPoints,
  };
}

export interface MissileCameraInput {
  origin: { lng: number; lat: number };
  target: { lng: number; lat: number };
  progress: number; // 0..1
  apogeeKm: number;
  detonationTimeMs?: number | null;
}

export interface MissileCameraState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

/**
 * Calcule les paramètres de la « Caméra Missile » embarquée suivant la tête du vecteur
 * le long du grand cercle balistique, de la phase Boost à l'Apogée puis la Rentrée terminale.
 */
export function computeMissileCameraViewState(input: MissileCameraInput): MissileCameraState {
  const { origin, target, progress, apogeeKm, detonationTimeMs } = input;
  const p = Math.max(0, Math.min(1, progress));
  const visualApogeeKm = computeVisualApogeeKm(clampApogeeKm(apogeeKm));
  const totalDistKm = Math.max(10, haversineKm(origin.lat, origin.lng, target.lat, target.lng));

  // Position courante de l'ogive + léger décalage arrière pour voir la flèche devant la caméra
  const cameraP = p >= 1 ? 1 : Math.max(0, p - 0.035);
  const [camLng, camLat] = interpolateGeodesicPoint(origin.lng, origin.lat, target.lng, target.lat, cameraP);
  const bearing = computeGeodesicBearingDeg(camLng, camLat, target.lng, target.lat);

  // Altitude instantanée le long de l'arc parabolique
  const currentAltKm = 4 * visualApogeeKm * p * (1 - p);
  const baseCruiseZoom = totalDistKm > 8000 ? 3.8 : totalDistKm > 2500 ? 4.8 : 6.0;

  if (p >= 1) {
    // Phase post-impact : recentrage sur l'explosion et élévation progressive pour voir le champignon
    const postProg = Math.min(1, Math.max(0, (detonationTimeMs ?? 0) / 5000));
    return {
      longitude: target.lng,
      latitude: target.lat,
      zoom: 8.6 - postProg * 1.1,
      pitch: 66 - postProg * 8,
      bearing,
    };
  }

  // Zoom adaptatif : dézoome à haute altitude (apogée), resserre en phase terminale
  const altZoomPenalty = Math.log10(1 + currentAltKm / 120) * 1.45;
  const terminalZoomIn = p > 0.72 ? ((p - 0.72) / 0.28) * 2.4 : 0;
  const zoom = Math.max(2.3, Math.min(9.5, baseCruiseZoom - altZoomPenalty + terminalZoomIn));

  // Inclinaison (pitch) : 56° en boost -> 68° à l'apogée -> 52° en plongée terminale
  let pitch = 58;
  if (p < 0.25) {
    pitch = 54 + (p / 0.25) * 12;
  } else if (p < 0.72) {
    pitch = 66 + Math.sin(((p - 0.25) / 0.47) * Math.PI) * 5;
  } else {
    pitch = 66 - ((p - 0.72) / 0.28) * 14;
  }

  return {
    longitude: camLng,
    latitude: camLat,
    zoom,
    pitch: Math.max(35, Math.min(76, pitch)),
    bearing,
  };
}

export interface GroundObserverInput {
  target: { lng: number; lat: number };
  lightBlastM: number;
  fireballM: number;
  effectiveYield: number;
  bearingFromTargetDeg?: number;
  standoffMultiplier?: number;
}

export interface GroundObserverResult {
  viewState: MissileCameraState;
  observerLng: number;
  observerLat: number;
  standoffKm: number;
  shockwaveArrivalSec: number;
  estimatedPsi: number;
}

/**
 * Place un observateur au sol à distance de sécurité en périphérie de l'onde de choc
 * et oriente la caméra à ras du sol (pitch 78°-83°) vers le point zéro.
 */
export function computeGroundObserverViewState(input: GroundObserverInput): GroundObserverResult {
  const { target, lightBlastM, fireballM, effectiveYield, bearingFromTargetDeg = 215, standoffMultiplier = 1.15 } = input;
  const blastKm = Math.max(0.5, lightBlastM / 1000);
  const fireballKm = Math.max(0.1, fireballM / 1000);

  // Distance d'observation : en bordure du souffle modéré/léger pour un cadrage immersif au ras du sol
  const rawStandoffKm = Math.max(fireballKm * 3.8, Math.min(blastKm * 0.95, 52), 3.5);
  const standoffKm = Math.max(3.5, Math.min(180, rawStandoffKm * standoffMultiplier));

  const [observerLng, observerLat] = getGeodesicDestination(
    target.lng,
    target.lat,
    standoffKm,
    bearingFromTargetDeg
  );

  // Regard depuis l'observateur vers le point zéro ; cadrage proche du point zéro pour remplir l'horizon
  const lookPoint = interpolateGeodesicPoint(observerLng, observerLat, target.lng, target.lat, 0.80);
  const bearing = computeGeodesicBearingDeg(observerLng, observerLat, target.lng, target.lat);

  const zoom = Math.max(7.2, Math.min(13.8, 13.7 - Math.log2(Math.max(1, standoffKm)) * 0.78));
  const pitch = Math.max(75, Math.min(79, 79 - Math.min(3.5, Math.log10(1 + effectiveYield / 100) * 0.85)));

  // Temps d'arrivée estimé du front de choc (~340 m/s moyen au-delà de la zone critique)
  const shockwaveArrivalSec = Number(((standoffKm * 1000) / 365).toFixed(1));
  const ratio = standoffKm / Math.max(0.2, blastKm);
  const estimatedPsi = Number(Math.max(0.2, Math.min(25, 1.5 / Math.pow(ratio, 1.45))).toFixed(2));

  return {
    viewState: {
      longitude: lookPoint[0],
      latitude: Math.max(-85, Math.min(85, lookPoint[1])),
      zoom,
      pitch,
      bearing,
    },
    observerLng,
    observerLat: Math.max(-85, Math.min(85, observerLat)),
    standoffKm: Number(standoffKm.toFixed(1)),
    shockwaveArrivalSec,
    estimatedPsi,
  };
}

export interface OrbitalCameraInput {
  target: { lng: number; lat: number } | null;
  origin: { lng: number; lat: number } | null;
  lightBlastM: number;
}

/**
 * Calcule le cadrage orbital initial pour la vue Globe 3D (_GlobeView).
 */
export function computeOrbitalCameraViewState(input: OrbitalCameraInput): MissileCameraState {
  const { target, origin, lightBlastM } = input;
  const anchor = target ?? { lng: 2.3522, lat: 48.8566 };

  if (origin && target) {
    const mid = interpolateGeodesicPoint(origin.lng, origin.lat, target.lng, target.lat, 0.5);
    const distKm = haversineKm(origin.lat, origin.lng, target.lat, target.lng);
    const zoom = distKm > 9000 ? 1.15 : distKm > 4000 ? 1.65 : distKm > 1200 ? 2.25 : 2.9;
    return {
      longitude: mid[0],
      latitude: mid[1],
      zoom,
      pitch: 0,
      bearing: 0,
    };
  }

  const blastKm = Math.max(1, lightBlastM / 1000);
  const zoom = blastKm > 1500 ? 1.3 : blastKm > 300 ? 2.2 : blastKm > 80 ? 3.2 : 3.9;
  return {
    longitude: anchor.lng,
    latitude: anchor.lat,
    zoom,
    pitch: 0,
    bearing: 0,
  };
}

export interface TsunamiWaveMeshGeometry {
  attributes: {
    POSITION: { value: Float32Array; size: 3 };
    NORMAL: { value: Float32Array; size: 3 };
    COLOR_0: { value: Float32Array; size: 3 };
  };
  indices: { value: Uint16Array | Uint32Array; size: 1 };
}

export interface TsunamiWaveMeshStats {
  vertexCount: number;
  triangleCount: number;
  maxElevationM: number;
  minRadiusM: number;
  maxRadiusM: number;
  crestRadiiM: number[];
}

export interface TsunamiWaveData3D {
  active: boolean;
  mesh: TsunamiWaveMeshGeometry | null;
  stats: TsunamiWaveMeshStats;
  foamPoints: MushroomCloudPoint[];
  opacity: number;
}

/**
 * Évalue le profil vertical (en mètres) et le facteur de crête normalisé [0..1]
 * d'un train de vagues tsunami asymétriques (front raide déferlant + creux arrière)
 * en coordonnées polaires locales (r en mètres, theta en radians).
 */
function evaluateTsunamiSurfaceHeight(
  r: number,
  theta: number,
  rMinM: number,
  rMaxM: number,
  crests: Array<{
    radiusM: number;
    widthFrontM: number;
    widthBackM: number;
    amplitudeM: number;
    phaseOffset: number;
    swellAmp: number;
  }>,
  phaseSec: number
): { heightM: number; crestFactor: number; boreSteepness: number } {
  let height = 0;
  let maxCrestNorm = 0;
  let boreSteepness = 0;

  for (let w = 0; w < crests.length; w++) {
    const c = crests[w];
    // Modulation azimutale organique (houle croisée + réfraction de crête)
    const radialWobble =
      1 +
      0.028 * Math.sin(theta * 3 + phaseSec * 0.55 + c.phaseOffset) +
      0.015 * Math.cos(theta * 5 - phaseSec * 0.8 - c.phaseOffset);
    const rCenter = c.radiusM * radialWobble;
    const ampMod =
      c.amplitudeM *
      (0.84 +
        0.11 * Math.sin(theta * 4 + phaseSec * 0.9 + c.phaseOffset) +
        0.05 * Math.cos(theta * 7 - phaseSec * 1.25));

    const dr = r - rCenter;
    if (dr >= 0) {
      // Face avant raide (front d'onde déferlant)
      const xi = dr / Math.max(40, c.widthFrontM);
      if (xi < 3.4) {
        const crestVal = Math.exp(-xi * xi * 1.35);
        height += ampMod * crestVal;
        const norm = crestVal * (1 - w * 0.14);
        if (norm > maxCrestNorm) maxCrestNorm = norm;
        if (xi < 1.35) {
          boreSteepness = Math.max(boreSteepness, crestVal * (1 - xi * 0.45));
        }
      }
    } else {
      // Versant arrière allongé puis creux de dépression (trough)
      const xi = -dr / Math.max(60, c.widthBackM);
      if (xi < 3.6) {
        const backSlope = Math.exp(-xi * xi * 0.85);
        // Légère dépression derrière la crête (sans passer sous le niveau de la mer)
        const troughDip = 0.24 * Math.exp(-Math.pow((xi - 1.35) / 0.65, 2));
        height += ampMod * (backSlope - troughDip);
        const norm = Math.max(0, backSlope * (1 - w * 0.14));
        if (norm > maxCrestNorm) maxCrestNorm = norm;
      }
    }
  }

  // Adoucissement des bords interne/externe pour raccorder la vague à z=0 sans marche verticale
  const span = Math.max(100, rMaxM - rMinM);
  const edgeIn = Math.max(0, Math.min(1, (r - rMinM) / (span * 0.08)));
  const edgeOut = Math.max(0, Math.min(1, (rMaxM - r) / (span * 0.06)));
  const smoothIn = edgeIn * edgeIn * (3 - 2 * edgeIn);
  const smoothOut = edgeOut * edgeOut * (3 - 2 * edgeOut);
  const edgeMask = smoothIn * smoothOut;

  // Hauteur nulle dans les creux plats pour que seules les crêtes sculptées émergent de l'océan
  const finalHeight = Math.max(0, height) * edgeMask;

  return {
    heightM: finalHeight,
    crestFactor: Math.max(0, Math.min(1, maxCrestNorm * edgeMask)),
    boreSteepness: Math.max(0, Math.min(1, boreSteepness * edgeMask)),
  };
}

/**
 * Génère un maillage 3D continu de vagues tsunami (géométrie indexée POSITION / NORMAL / COLOR_0
 * pour SimpleMeshLayer + particules d'embruns sur les crêtes déferlantes), reflétant la célérité
 * en eau profonde, la dispersion des vagues et l'amplification côtière (loi de Green).
 */
export function generate3DTsunamiWaveData(input: {
  target: { lng: number; lat: number };
  isWater: boolean;
  isEligible: boolean;
  shoreDistanceKm: number;
  oceanDepthM: number;
  initialWaveHeightM: number;
  shoreWaveHeightM: number;
  runUpHeightM: number;
  floodRadiusM: number;
  detonationTimeMs: number;
}): TsunamiWaveData3D {
  const {
    target,
    isWater,
    isEligible,
    shoreDistanceKm,
    oceanDepthM,
    initialWaveHeightM,
    shoreWaveHeightM,
    runUpHeightM,
    floodRadiusM,
    detonationTimeMs,
  } = input;

  const emptyStats: TsunamiWaveMeshStats = {
    vertexCount: 0,
    triangleCount: 0,
    maxElevationM: 0,
    minRadiusM: 0,
    maxRadiusM: 0,
    crestRadiiM: [],
  };

  if (!isEligible || detonationTimeMs < 1800) {
    return { active: false, mesh: null, stats: emptyStats, foamPoints: [], opacity: 0 };
  }

  const numWaveFronts = 4;
  const safeDepth = Math.max(50, oceanDepthM || 2000);
  const waveSpeedDeep = Math.sqrt(safeDepth * 9.81); // m/s
  const hasNearbyCoast = shoreDistanceKm >= 3;
  const shoreDistM = hasNearbyCoast ? shoreDistanceKm * 1000 : 120_000;

  // Hauteur visuelle 3D proportionnelle à la physique réelle avec profil hydrodynamique élancé
  const refWaveM = Math.max(2, isWater ? initialWaveHeightM : shoreWaveHeightM, runUpHeightM * 0.65);
  const visualHeightBaseM = Math.min(8_500, Math.max(220, refWaveM * 28));

  const crests: Array<{
    radiusM: number;
    widthFrontM: number;
    widthBackM: number;
    amplitudeM: number;
    phaseOffset: number;
    swellAmp: number;
  }> = [];

  const maxCapM = Math.max(22_000, floodRadiusM * 2.2, hasNearbyCoast ? shoreDistM * 1.15 : 85_000);

  for (let w = 0; w < numWaveFronts; w++) {
    const timeActiveMs = detonationTimeMs - 1800 - w * 560;
    if (timeActiveMs <= 0) continue;

    // Dispersion physique : la vague de tête est plus rapide que les crêtes suivantes
    const dispersiveFactor = 1 - w * 0.14;
    const simSec = (timeActiveMs / 1000) * 18;
    let centerRadM = isWater
      ? Math.max(900, waveSpeedDeep * dispersiveFactor * simSec)
      : Math.max(900, shoreDistM * 0.25 + waveSpeedDeep * dispersiveFactor * simSec * 0.65);

    if (isWater && hasNearbyCoast && centerRadM > shoreDistM * 0.65) {
      const excess = centerRadM - shoreDistM * 0.65;
      centerRadM = shoreDistM * 0.65 + excess * 0.42;
    }

    centerRadM = clampVisualRadiusM(Math.min(maxCapM, centerRadM));
    if (centerRadM < 300) continue;

    // Garantie d'espacement minimal pour bien distinguer chaque train de crêtes
    if (crests.length > 0) {
      const prevR = crests[crests.length - 1].radiusM;
      const minGapM = Math.max(450, prevR * 0.16);
      if (prevR - centerRadM < minGapM) {
        centerRadM = Math.max(260, prevR - minGapM);
      }
    }

    // Loi de Green : amplification verticale à l'approche des hauts-fonds côtiers
    const shoalingProgress = hasNearbyCoast
      ? Math.min(1, centerRadM / Math.max(1000, shoreDistM))
      : Math.min(0.45, centerRadM / 80_000);
    const shoalingBoost =
      1 +
      shoalingProgress *
        Math.min(1.8, Math.max(0.25, shoreWaveHeightM / Math.max(1, initialWaveHeightM) - 0.5));
    const decay = 1 - w * 0.19;
    const amplitudeM = Math.max(140, visualHeightBaseM * shoalingBoost * decay);

    const widthBase = Math.max(360, Math.min(7_500, centerRadM * (0.062 - w * 0.006)));
    crests.push({
      radiusM: centerRadM,
      widthFrontM: widthBase * 0.65,
      widthBackM: widthBase * 1.55,
      amplitudeM,
      phaseOffset: w * 1.15,
      swellAmp: decay,
    });
  }

  if (crests.length === 0) {
    return { active: false, mesh: null, stats: emptyStats, foamPoints: [], opacity: 0 };
  }

  const leadCrest = crests[0];
  const tailCrest = crests[crests.length - 1];
  const rMaxM = leadCrest.radiusM + leadCrest.widthFrontM * 2.1;
  const rMinM = Math.max(140, tailCrest.radiusM - tailCrest.widthBackM * 2.1);

  const numSectors = 80;
  const numRings = 68;
  const cols = numSectors + 1;
  const vertexCount = numRings * cols;
  const maxTriangleCount = (numRings - 1) * numSectors * 2;

  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);
  const rawIndices = new Uint16Array(maxTriangleCount * 3);

  const heightGrid = new Float32Array(vertexCount);
  const radiusByRing = new Float32Array(numRings);
  const phaseSec = (detonationTimeMs - 1800) / 1000;
  let maxElevationM = 0;

  // 1. Calcul des positions (x East, y North, z Up en mètres) et couleurs hydrodynamiques
  for (let rIdx = 0; rIdx < numRings; rIdx++) {
    const rFrac = rIdx / (numRings - 1);
    const r = rMinM + rFrac * (rMaxM - rMinM);
    radiusByRing[rIdx] = r;

    for (let sIdx = 0; sIdx < cols; sIdx++) {
      const sWrap = sIdx % numSectors;
      const theta = (sWrap / numSectors) * Math.PI * 2;
      const idx = rIdx * cols + sIdx;

      const { heightM, crestFactor, boreSteepness } = evaluateTsunamiSurfaceHeight(
        r,
        theta,
        rMinM,
        rMaxM,
        crests,
        phaseSec
      );

      heightGrid[idx] = heightM;
      if (heightM > maxElevationM) maxElevationM = heightM;

      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      positions[idx * 3] = r * cosT;
      positions[idx * 3 + 1] = r * sinT;
      positions[idx * 3 + 2] = heightM;

      // Gradient hydrodynamique : base océan bleu-sarcelle -> flanc turquoise -> lèvre d'écume blanche
      const foamMix = Math.max(0, Math.min(1, (crestFactor - 0.64) / 0.32 + boreSteepness * 0.22));
      let cr: number;
      let cg: number;
      let cb: number;
      if (crestFactor < 0.25) {
        const t = crestFactor / 0.25;
        cr = 0.03 + t * 0.04;
        cg = 0.22 + t * 0.22;
        cb = 0.45 + t * 0.27;
      } else if (crestFactor < 0.68) {
        const t = (crestFactor - 0.25) / 0.43;
        cr = 0.07 + t * 0.16;
        cg = 0.44 + t * 0.34;
        cb = 0.72 + t * 0.23;
      } else {
        const t = (crestFactor - 0.68) / 0.32;
        cr = 0.23 + t * 0.67;
        cg = 0.78 + t * 0.19;
        cb = 0.95 + t * 0.05;
      }
      cr = cr * (1 - foamMix * 0.55) + 0.94 * (foamMix * 0.55);
      cg = cg * (1 - foamMix * 0.55) + 0.98 * (foamMix * 0.55);
      cb = cb * (1 - foamMix * 0.55) + 1.0 * (foamMix * 0.55);

      colors[idx * 3] = Math.min(1, cr);
      colors[idx * 3 + 1] = Math.min(1, cg);
      colors[idx * 3 + 2] = Math.min(1, cb);
    }
  }

  // 2. Normales 3D analytiques par différences finies centrées (lissage continu des crêtes)
  const dTheta = (Math.PI * 2) / numSectors;
  for (let rIdx = 0; rIdx < numRings; rIdx++) {
    const rPrev = Math.max(0, rIdx - 1);
    const rNext = Math.min(numRings - 1, rIdx + 1);
    const dr = Math.max(1, radiusByRing[rNext] - radiusByRing[rPrev]);
    const r = radiusByRing[rIdx];
    const dsDist = Math.max(1, r * 2 * dTheta);

    for (let sIdx = 0; sIdx < cols; sIdx++) {
      const sWrap = sIdx % numSectors;
      const sPrev = (sWrap - 1 + numSectors) % numSectors;
      const sNext = (sWrap + 1) % numSectors;
      const theta = (sWrap / numSectors) * Math.PI * 2;

      const hRPrev = heightGrid[rPrev * cols + sWrap];
      const hRNext = heightGrid[rNext * cols + sWrap];
      const dhdr = (hRNext - hRPrev) / dr;

      const hSPrev = heightGrid[rIdx * cols + sPrev];
      const hSNext = heightGrid[rIdx * cols + sNext];
      const dhdtheta = (hSNext - hSPrev) / dsDist;

      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      const nx = -dhdr * cosT + dhdtheta * sinT;
      const ny = -dhdr * sinT - dhdtheta * cosT;
      const nz = 1.0;
      const len = Math.hypot(nx, ny, nz) || 1;

      const idx = rIdx * cols + sIdx;
      normals[idx * 3] = nx / len;
      normals[idx * 3 + 1] = ny / len;
      normals[idx * 3 + 2] = nz / len;
    }
  }

  // 3. Indexation sélective des triangles : exclut les creux plats (< 3% du max) pour éviter tout disque opaque
  const heightCutoffM = Math.max(12, maxElevationM * 0.03);
  let ptr = 0;
  for (let rIdx = 0; rIdx < numRings - 1; rIdx++) {
    for (let sIdx = 0; sIdx < numSectors; sIdx++) {
      const i00 = rIdx * cols + sIdx;
      const i10 = (rIdx + 1) * cols + sIdx;
      const i11 = (rIdx + 1) * cols + (sIdx + 1);
      const i01 = rIdx * cols + (sIdx + 1);

      const h00 = heightGrid[i00];
      const h10 = heightGrid[i10];
      const h11 = heightGrid[i11];
      const h01 = heightGrid[i01];

      if (Math.max(h00, h10, h11) > heightCutoffM) {
        rawIndices[ptr++] = i00;
        rawIndices[ptr++] = i10;
        rawIndices[ptr++] = i11;
      }
      if (Math.max(h00, h11, h01) > heightCutoffM) {
        rawIndices[ptr++] = i00;
        rawIndices[ptr++] = i11;
        rawIndices[ptr++] = i01;
      }
    }
  }
  const indices = rawIndices.subarray(0, ptr);
  const triangleCount = Math.floor(ptr / 3);

  // 4. Embruns fins serrés sur la lèvre supérieure des 2 crêtes de tête
  const foamPoints: MushroomCloudPoint[] = [];
  const leadOpacity = Math.max(0.28, 1 - (Math.max(0, detonationTimeMs - 1800) / 9500) * 0.65);

  for (let w = 0; w < Math.min(2, crests.length); w++) {
    const c = crests[w];
    const sprayCount = w === 0 ? 240 : 120;
    for (let k = 0; k < sprayCount; k++) {
      const u = hash01(w * 313 + k * 17.91 + 5.1);
      const v = hash01(w * 197 + k * 7.37 + 23.4);
      const j = hash01(w * 89 + k * 31.17 + 9.8);

      const theta = u * Math.PI * 2;
      const radialOffset = (v - 0.15) * c.widthFrontM * 0.45;
      const rSample = Math.max(
        150,
        c.radiusM * (1 + 0.028 * Math.sin(theta * 3 + phaseSec * 0.55 + c.phaseOffset)) + radialOffset
      );

      const surf = evaluateTsunamiSurfaceHeight(rSample, theta, rMinM, rMaxM, crests, phaseSec);
      const bearingDeg = ((Math.atan2(Math.cos(theta), Math.sin(theta)) * RAD_TO_DEG) + 360) % 360;
      const pos = getGeodesicDestination(target.lng, target.lat, rSample / 1000, bearingDeg);
      const zSpray = surf.heightM * (0.98 + 0.08 * j);

      foamPoints.push({
        position: [pos[0], Math.max(-85, Math.min(85, pos[1])), zSpray],
        color: [230 + Math.floor(j * 25), 245 + Math.floor(j * 10), 255, Math.max(65, Math.floor(175 * leadOpacity))],
        normal: [0, 0, 1],
      });
    }
  }

  return {
    active: triangleCount > 0,
    mesh: {
      attributes: {
        POSITION: { value: positions, size: 3 },
        NORMAL: { value: normals, size: 3 },
        COLOR_0: { value: colors, size: 3 },
      },
      indices: { value: indices, size: 1 },
    },
    stats: {
      vertexCount,
      triangleCount,
      maxElevationM,
      minRadiusM: rMinM,
      maxRadiusM: rMaxM,
      crestRadiiM: crests.map((c) => c.radiusM),
    },
    foamPoints,
    opacity: Math.max(0.32, Math.min(0.84, leadOpacity * 0.84)),
  };
}

