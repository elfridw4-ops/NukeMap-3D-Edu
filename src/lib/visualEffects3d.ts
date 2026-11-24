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
