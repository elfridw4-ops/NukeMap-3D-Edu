import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { NavigationControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, PolygonLayer, PointCloudLayer, PathLayer } from '@deck.gl/layers';
import { Sun, Moon, Globe } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { BlastRadii, EnvironmentParams, PastStrike } from '../types';
import { calculateTsunamiMetrics, haversineKm, flightTimeMin, TsunamiMetrics } from '../lib/nuclearMath';

interface MapViewProps {
  pastStrikes: PastStrike[];
  target: { lng: number; lat: number } | null;
  origin: { lng: number; lat: number } | null;
  radii: BlastRadii;
  environmentParams: EnvironmentParams;
  effectiveYield: number;
  onMapClick: (lng: number, lat: number) => void;
  viewState: any;
  setViewState: (vs: any) => void;
  simulationMode: 'instant' | 'ballistic';
  flightProgress: number;
  launchParams: any;
  targetDetails: {
    isWater: boolean;
    name?: string;
    country?: string;
    city?: string;
    detected: boolean;
    loading: boolean;
  };
  detonationTimeMs: number;
  isDetonationAnimating: boolean;
  isDetonationPaused: boolean;
  multiStrikeMode: boolean;
  tsunamiMetrics: TsunamiMetrics;
}

// Helper pour calculer une coordonnée de destination
function getDestination(lng: number, lat: number, distanceKm: number, bearingDeg: number) {
  const R = 6371; // Rayon de la Terre en km
  const d = distanceKm / R;
  const brng = bearingDeg * Math.PI / 180;
  const lat1 = lat * Math.PI / 180;
  const lon1 = lng * Math.PI / 180;

  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng));
  const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));

  return [(lon2 * 180) / Math.PI, (lat2 * 180) / Math.PI];
}

// Helper pour calculer les points d'un cercle pour les PathLayers de l'onde de choc
function getCirclePoints(clon: number, clat: number, radiusMeters: number, steps = 64) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i * 360) / steps;
    points.push(getDestination(clon, clat, radiusMeters / 1000, angle));
  }
  return points;
}

function calculateActiveDebris(
  targetAddress: { lng: number; lat: number },
  detonationTimeMs: number,
  fireballDebrisParticles: any[],
  fireballRadius: number
) {
  if (detonationTimeMs < 80 || detonationTimeMs > 1500) return [];
  const tProgress = (detonationTimeMs - 80) / 1420; 
  return fireballDebrisParticles.map(p => {
    const r = fireballRadius * p.speedFactor * tProgress;
    const latOffset = (r * Math.cos(p.angle)) / 111320;
    const lonOffset = (r * Math.sin(p.angle)) / (111320 * Math.cos(targetAddress.lat * Math.PI / 180));
    const alpha = Math.max(0, Math.floor((1 - tProgress) * 220));
    const color = p.randomSeed > 0.5 
      ? [254, 240, 138, alpha] 
      : [239, 68, 68, alpha];  
    return {
      position: [targetAddress.lng + lonOffset, targetAddress.lat + latOffset],
      color,
      size: p.size
    };
  });
}

function calculateActiveFalloutDebris(
  targetAddress: { lng: number; lat: number },
  detonationTimeMs: number,
  falloutDriftParticles: any[],
  heavyBlastRadius: number,
  environmentParams: EnvironmentParams
) {
  if (detonationTimeMs < 5000 || environmentParams.explosionType !== 'surface') return [];
  const deltaT = (detonationTimeMs - 5000) / 5000; 
  const falloutLengthKm = Math.max(0.1, Math.pow(heavyBlastRadius / 1000, 1.2) * (Math.max(1, environmentParams.windSpeed) / 10 + 1) * 3);
  const direction = environmentParams.windDirection;

  return falloutDriftParticles.map(p => {
    const elapsedDistanceFraction = p.distanceFraction + (deltaT * 0.4 * p.horizontalSpeedFactor);
    const currentDistKm = Math.min(1.0, elapsedDistanceFraction) * falloutLengthKm;
    const spread = (1 - Math.abs(elapsedDistanceFraction - 0.6)) * 25 * p.spreadFraction;
    const groundPos = getDestination(targetAddress.lng, targetAddress.lat, currentDistKm, direction + spread);
    const initialHeight = 3500 + Math.sin(p.distanceFraction * 13) * 1000;
    const z = Math.max(0, initialHeight - (deltaT * 4000 * p.fallSpeed));
    const groundImpact = z === 0;
    const alpha = groundImpact ? 60 : 180;
    return {
      position: [groundPos[0], groundPos[1], z],
      color: [110, 231, 183, alpha], 
      size: groundImpact ? 2 : 3
    };
  });
}

function calculateShockwaveBands(
  targetAddress: { lng: number; lat: number },
  detonationTimeMs: number,
  blastProgress: number,
  currentBlastWaveRadius: number,
  currentPsi: number = 1
) {
  if (detonationTimeMs < 800 || detonationTimeMs > 4000) return [];
  const baseOpacity = Math.max(0, Math.floor((1 - blastProgress) * 160));
  
  // Changement de couleur du front selon la pression PSI actuelle
  let frontR = 150, frontG = 150, frontB = 150; // gris <5psi
  if (currentPsi > 50) { frontR = 255; frontG = 255; frontB = 255; }
  else if (currentPsi >= 20) { frontR = 255; frontG = 50; frontB = 50; }
  else if (currentPsi >= 5) { frontR = 255; frontG = 150; frontB = 50; }

  const bands = [];
  
  // 1. Un effet de distorsion atmosphérique visible : un anneau translucide 
  // qui s'élargit avec un gradient d'opacité décroissant vers l'extérieur
  for (let i = 1; i <= 5; i++) {
    const scale = 1.0 + (i * 0.01);
    const distOpacity = Math.floor(baseOpacity * 0.3 * (1 - i / 5));
    if (distOpacity > 0) {
      bands.push({
        path: getCirclePoints(targetAddress.lng, targetAddress.lat, currentBlastWaveRadius * scale, 72), 
        color: [255, 255, 255, distOpacity], 
        width: 10 - i // diminishing line width
      });
    }
  }

  // Front principal
  bands.push({ 
    path: getCirclePoints(targetAddress.lng, targetAddress.lat, currentBlastWaveRadius, 72), 
    color: [frontR, frontG, frontB, baseOpacity], 
    width: 4.5 
  });

  // 2. Une traînée d'onde secondaire (réverbération) : 2 anneaux concentriques 
  // légèrement en retard sur le front principal
  bands.push({ 
    path: getCirclePoints(targetAddress.lng, targetAddress.lat, currentBlastWaveRadius * 0.95, 72), 
    color: [frontR, frontG, frontB, Math.floor(baseOpacity * 0.6)], 
    width: 3 
  });
  bands.push({ 
    path: getCirclePoints(targetAddress.lng, targetAddress.lat, currentBlastWaveRadius * 0.90, 72), 
    color: [frontR, frontG, frontB, Math.floor(baseOpacity * 0.3)], 
    width: 1.5 
  });

  return bands;
}

function calculateMushroomCloud(
  targetAddress: { lng: number; lat: number },
  environmentParams: EnvironmentParams,
  effectiveYield: number,
  detonationTimeMs: number
) {
  if (!environmentParams.showMushroomCloud || effectiveYield <= 0 || detonationTimeMs < 2000) return [];

  const numPoints = 2500; 
  const points = [];
  
  const rawHeight = 3000 * Math.pow(effectiveYield, 0.25);
  const tropopauseM = (environmentParams.tropopauseAltitudeKm || 11.5) * 1000;
  
  let height = rawHeight;
  let capRadius = 600 * Math.pow(effectiveYield, 0.3);
  
  if (effectiveYield < 1000 && rawHeight > tropopauseM * 0.8) {
    height = Math.min(rawHeight, tropopauseM);
    if (height === tropopauseM) {
      capRadius *= 1.4;
    }
  }
  
  const stalkRadius = 150 * Math.pow(effectiveYield, 0.3);
  const stalkHeight = height * 0.7;

  const mushroomProgress = Math.min(1, (detonationTimeMs - 2000) / 6000);
  const swayDistance = Math.sin((detonationTimeMs / 1000) * 2.0) * (stalkRadius * 0.35) * mushroomProgress;

  for (let i = 0; i < numPoints; i++) {
    const r1 = (Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1;
    const r1p = r1 < 0 ? r1 + 1 : r1;
    const r2 = (Math.sin(i * 4.1414 + 11.854) * 23145.1235) % 1;
    const r2p = r2 < 0 ? r2 + 1 : r2;
    const r3 = (Math.sin(i * 9.5123 + 47.902) * 63984.7121) % 1;
    const r3p = r3 < 0 ? r3 + 1 : r3;
    const r4 = (Math.sin(i * 3.7381 + 99.284) * 81231.5432) % 1;
    const r4p = r4 < 0 ? r4 + 1 : r4;

    const part = r1p;
    let z = 0, r = 0, theta = r2p * Math.PI * 2;
    let color: [number, number, number, number] = [200, 200, 200, 255];

    if (part > 0.4) {
      const zOffset = (r3p * 2 - 1) * (height * 0.15);
      z = (stalkHeight * mushroomProgress) + (height * 0.15) + (zOffset * mushroomProgress);
      z = Math.max(z, stalkHeight * mushroomProgress);
      r = capRadius * Math.pow(mushroomProgress, 1.4) * Math.sqrt(r4p);
      const isBottom = z < (stalkHeight * mushroomProgress) + (height * 0.15);
      if (isBottom) {
        color = [255, Math.floor(100 + r3p * 100), 50, Math.floor((120 + r4p * 70) * mushroomProgress)];
      } else {
        const shade = 140 + Math.floor(r3p * 110);
        color = [shade, shade, shade, Math.floor((140 + r4p * 80) * mushroomProgress)];
      }
    } else if (part > 0.05) {
      z = r3p * (stalkHeight * mushroomProgress);
      const zNorm = z / (stalkHeight * Math.max(0.01, mushroomProgress));
      const currentRadius = stalkRadius * Math.min(1, mushroomProgress * 1.2) * (1 - 0.3 * Math.sin(zNorm * Math.PI));
      r = currentRadius * Math.sqrt(r4p);
      const shade = 95 + Math.floor(r2p * 85);
      color = [shade, shade, shade, Math.floor((120 + r1p * 60) * mushroomProgress)];
    } else {
      z = r3p * (height * 0.08) * mushroomProgress;
      r = (stalkRadius * 1.5) + r4p * (capRadius * 1.1) * Math.pow(mushroomProgress, 0.8);
      const shade = 110 + Math.floor(r2p * 70);
      color = [shade, shade, shade, Math.floor((80 + r1p * 60) * mushroomProgress)];
    }

    const dx = r * Math.cos(theta) + swayDistance * (z / height);
    const dy = r * Math.sin(theta);
    const latOffset = dy / 111320;
    const lonOffset = dx / (111320 * Math.cos(targetAddress.lat * Math.PI / 180));

    points.push({
      position: [targetAddress.lng + lonOffset, targetAddress.lat + latOffset, z],
      color,
      normal: [0, 0, 1]
    });
  }
  return points;
}

const falloutDriftParticles = (() => {
  const particles = [];
  const numFallout = 120;
  for (let i = 0; i < numFallout; i++) {
    const distanceFraction = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const distanceFractionP = distanceFraction < 0 ? distanceFraction + 1 : distanceFraction;
    const spreadFraction = (Math.cos(i * 4.1414) * 23145.1235) % 1;
    const fallSpeed = 0.5 + ((Math.sin(i * 9.5123) * 63984.7121) % 1) * 1.5;
    const horizontalSpeedFactor = 0.8 + ((Math.cos(i * 3.7381) * 81231.5432) % 1) * 0.4;

    particles.push({ 
      distanceFraction: distanceFractionP, 
      spreadFraction, 
      fallSpeed: Math.abs(fallSpeed), 
      horizontalSpeedFactor: Math.abs(horizontalSpeedFactor) 
    });
  }
  return particles;
})();

type MapMode = 'night' | 'day' | 'satellite';

const MAP_STYLES: Record<MapMode, any> = {
  night: {
    version: 8,
    sources: {
      'carto-dark': {
        type: 'raster',
        tiles: [
          "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
        ],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap contributors, &copy; CARTO'
      }
    },
    layers: [
      {
        id: 'carto-dark-layer',
        type: 'raster',
        source: 'carto-dark',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  },
  day: {
    version: 8,
    sources: {
      'carto-light': {
        type: 'raster',
        tiles: [
          "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
          "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
          "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
          "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
        ],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap contributors, &copy; CARTO'
      }
    },
    layers: [
      {
        id: 'carto-light-layer',
        type: 'raster',
        source: 'carto-light',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  },
  satellite: {
    version: 8,
    sources: {
      'esri-satellite': {
        type: 'raster',
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        ],
        tileSize: 256,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }
    },
    layers: [
      {
        id: 'satellite-raster-layer',
        type: 'raster',
        source: 'esri-satellite',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  }
};

export function MapView({ pastStrikes, target, origin, radii, environmentParams, effectiveYield, onMapClick, viewState, setViewState, simulationMode, flightProgress, launchParams, targetDetails, detonationTimeMs, isDetonationAnimating, isDetonationPaused, multiStrikeMode, tsunamiMetrics }: MapViewProps) {
  
  const [mapMode, setMapMode] = useState<MapMode>(() => {
    const saved = localStorage.getItem('nukemap_map_mode');
    return (saved as MapMode) || 'night';
  });

  useEffect(() => {
    localStorage.setItem('nukemap_map_mode', mapMode);
  }, [mapMode]);

  // 1. Fireball Progress & Color Calculations (80ms to 800ms)
  const fireballProgress = Math.max(0, Math.min(1, (detonationTimeMs - 80) / 720));
  
  // Fireball pulsation at the end of the phase (600ms - 800ms)
  let fireballPulsation = 1.0;
  if (detonationTimeMs >= 600 && detonationTimeMs <= 800) {
    fireballPulsation = 1.0 + 0.04 * Math.sin((detonationTimeMs - 600) * 0.05);
  }
  const currentFireballRadius = radii.fireball * fireballProgress * fireballPulsation;

  // Fireball Dynamic RGB Color Interpolation
  const fireballColor = useMemo(() => {
    if (fireballProgress <= 0) return [255, 255, 255, 180] as [number, number, number, number];
    let rColor = 255;
    let gColor = 255;
    let bColor = 255;

    if (fireballProgress < 0.3) {
      const p = fireballProgress / 0.3;
      rColor = 255;
      gColor = Math.floor(255 - 15 * p);
      bColor = Math.floor(255 - 117 * p);
    } else if (fireballProgress < 0.7) {
      const p = (fireballProgress - 0.3) / 0.4;
      rColor = Math.floor(254 - 5 * p);
      gColor = Math.floor(240 - 125 * p);
      bColor = Math.floor(138 - 116 * p);
    } else {
      const p = (fireballProgress - 0.7) / 0.3;
      rColor = Math.floor(249 - 64 * p);
      gColor = Math.floor(115 - 87 * p);
      bColor = Math.floor(22 + 6 * p);
    }
    return [rColor, gColor, bColor, 180 + Math.floor(Math.sin(detonationTimeMs * 0.1) * 15)] as [number, number, number, number];
  }, [fireballProgress, detonationTimeMs]);

  // 2. Shockwave (Onde de Souffle) Wavefront Propagation (800ms to 3000ms)
  const blastProgress = Math.max(0, Math.min(1, (detonationTimeMs - 800) / 2200));
  const currentBlastWaveRadius = blastProgress * radii.lightBlast;

  // 3. Thermal Radiation Heat Wavefront Propagation (1200ms to 5000ms)
  const thermalProgress = Math.max(0, Math.min(1, (detonationTimeMs - 1200) / 3800));
  const currentThermalWaveRadius = thermalProgress * radii.thermal1st;

  // Calculate dynamic PSI at the wavefront
  const currentPsi = useMemo(() => {
    if (!currentBlastWaveRadius || currentBlastWaveRadius <= 0) return 0;
    
    if (currentBlastWaveRadius <= radii.fireball) return 200;
    
    if (currentBlastWaveRadius <= radii.heavyBlast) {
      const p = (currentBlastWaveRadius - radii.fireball) / (radii.heavyBlast - radii.fireball);
      return 200 - p * (200 - 20);
    }
    
    if (currentBlastWaveRadius <= radii.moderateBlast) {
      const p = (currentBlastWaveRadius - radii.heavyBlast) / (radii.moderateBlast - radii.heavyBlast);
      return 20 - p * (20 - 5);
    }
    
    if (currentBlastWaveRadius <= radii.lightBlast) {
      const p = (currentBlastWaveRadius - radii.moderateBlast) / (radii.lightBlast - radii.moderateBlast);
      return 5 - p * (5 - 1);
    }
    
    return 0;
  }, [currentBlastWaveRadius, radii]);

  // Memoized Fireball Flying Debris Particles (random seed arrays)
  const fireballDebrisParticles = useMemo(() => {
    const particles = [];
    const numDebris = 60;
    for (let i = 0; i < numDebris; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speedFactor = 0.5 + Math.random() * 2.5; 
      const size = 2 + Math.random() * 5;
      const randomSeed = Math.random();
      particles.push({ angle, speedFactor, size, randomSeed });
    }
    return particles;
  }, []);

  const activeStrikes = useMemo(() => {
    if (multiStrikeMode) {
      const list: Array<{ id: string; target: { lng: number; lat: number }; radii: BlastRadii; effectiveYield: number }> = [];
      if (target) {
        list.push({
          id: 'current-target',
          target: target,
          radii: radii,
          effectiveYield: effectiveYield
        });
      }
      pastStrikes.forEach(strike => {
        if (!list.some(s => s.target.lng === strike.target.lng && s.target.lat === strike.target.lat)) {
          list.push({
            id: strike.id,
            target: strike.target,
            radii: strike.radii,
            effectiveYield: strike.effectiveYield
          });
        }
      });
      return list;
    } else {
      return target ? [{
        id: 'current-target',
        target: target,
        radii: radii,
        effectiveYield: effectiveYield
      }] : [];
    }
  }, [multiStrikeMode, target, radii, effectiveYield, pastStrikes]);

  const layers = useMemo(() => {
    const activeLayers: any[] = [];
    
    // Render past strikes only when not in multi-strike mode (they are static footprints in single-shot mode)
    if (!multiStrikeMode && pastStrikes && pastStrikes.length > 0) {
      pastStrikes.forEach(strike => {
        const pos = [strike.target.lng, strike.target.lat];
        activeLayers.push(
          // 1. Fireball
          new ScatterplotLayer({
            id: `past-fireball-${strike.id}`,
            data: [{ position: pos }],
            getPosition: (d: any) => d.position,
            getFillColor: [249, 115, 22, 60], 
            getRadius: () => strike.radii.fireball,
            pickable: false,
            parameters: { depthTest: false }
          }),
          // 2. Heavy blast (20 psi)
          new ScatterplotLayer({
            id: `past-heavy-blast-${strike.id}`,
            data: [{ position: pos }],
            getPosition: (d: any) => d.position,
            getFillColor: [239, 68, 68, 15], 
            stroked: true,
            getLineColor: [239, 68, 68, 100],
            lineWidthMinPixels: 1,
            getRadius: () => strike.radii.heavyBlast,
            pickable: false,
            parameters: { depthTest: false }
          }),
          // 3. Moderate blast (5 psi)
          new ScatterplotLayer({
            id: `past-moderate-blast-${strike.id}`,
            data: [{ position: pos }],
            getPosition: (d: any) => d.position,
            getFillColor: [217, 119, 6, 12],
            stroked: true,
            getLineColor: [217, 119, 6, 80],
            lineWidthMinPixels: 1,
            getRadius: () => strike.radii.moderateBlast,
            pickable: false,
            parameters: { depthTest: false }
          }),
          // 4. Thermal burns 1st degree (Outer radius)
          new ScatterplotLayer({
            id: `past-thermal-${strike.id}`,
            data: [{ position: pos }],
            getPosition: (d: any) => d.position,
            getFillColor: [234, 179, 8, 4],
            stroked: true,
            getLineColor: [234, 179, 8, 50],
            lineWidthMinPixels: 1,
            getRadius: () => strike.radii.thermal1st,
            pickable: false,
            parameters: { depthTest: false }
          }),
          // 5. Strike Center point
          new ScatterplotLayer({
            id: `past-center-${strike.id}`,
            data: [{ position: pos }],
            getPosition: (d: any) => d.position,
            getFillColor: [255, 255, 255, 200],
            getRadius: () => 100,
            radiusMinPixels: 3,
            stroked: true,
            getLineColor: [0, 0, 0, 255],
            lineWidthMinPixels: 1.5,
            pickable: false,
            parameters: { depthTest: false }
          })
        );
      });
    }
    
    const isDetonated = simulationMode === 'instant' || flightProgress === 1;

    // Generate ballistic trajectories for all active strikes simultaneously if in ballistic mode
    if (simulationMode === 'ballistic' && origin && activeStrikes.length > 0) {
      const vectorId = launchParams.vectorId || 'icbm';
      let altitudeKm = 1200;
      let vectorColorHex = "#ef4444";
      if (vectorId === 'icbm') { altitudeKm = 1200; vectorColorHex = "#ef4444"; }
      else if (vectorId === 'slbm') { altitudeKm = 1300; vectorColorHex = "#f97316"; }
      else if (vectorId === 'bomber') { altitudeKm = 15; vectorColorHex = "#6366f1"; }
      else if (vectorId === 'cruise') { altitudeKm = 0.1; vectorColorHex = "#8b5cf6"; }
      else if (vectorId === 'houthi') { altitudeKm = 12; vectorColorHex = "#ec4899"; }
      else if (vectorId === 'custom') { altitudeKm = launchParams.altitudeKm || 100; vectorColorHex = "#22c55e"; }

      const vr = parseInt(vectorColorHex.slice(1, 3), 16);
      const vg = parseInt(vectorColorHex.slice(3, 5), 16);
      const vb = parseInt(vectorColorHex.slice(5, 7), 16);
      const vectorRgb: [number, number, number] = [vr, vg, vb];
      const maxAlt = altitudeKm * 1000;

      activeStrikes.forEach(strike => {
        const strId = strike.id;
        const targetCoord = strike.target;

        // Predicted trajectory dotted arc
        const arcSteps = 60;
        const dashSegments = [];
        for (let i = 0; i < arcSteps; i += 2) {
          const t1 = i / arcSteps;
          const t2 = (i + 1) / arcSteps;
          const pt1 = [
            origin.lng + (targetCoord.lng - origin.lng) * t1,
            origin.lat + (targetCoord.lat - origin.lat) * t1,
            4 * maxAlt * t1 * (1 - t1)
          ];
          const pt2 = [
            origin.lng + (targetCoord.lng - origin.lng) * t2,
            origin.lat + (targetCoord.lat - origin.lat) * t2,
            4 * maxAlt * t2 * (1 - t2)
          ];
          dashSegments.push({ path: [pt1, pt2] });
        }

        activeLayers.push(
          new PathLayer({
            id: `missile-predicted-trajectory-${strId}`,
            data: dashSegments,
            getPath: (d: any) => d.path,
            getColor: [...vectorRgb, 120] as any,
            getWidth: 2.5,
            widthUnits: 'pixels',
            pickable: false,
            parameters: { depthTest: true }
          })
        );

        // Flight trail and vehicle visual if flying
        if (flightProgress > 0 && flightProgress < 1) {
          const p = flightProgress;
          const currentLng = origin.lng + (targetCoord.lng - origin.lng) * p;
          const currentLat = origin.lat + (targetCoord.lat - origin.lat) * p;
          const currentAlt = 4 * maxAlt * p * (1 - p);

          let activeColor: [number, number, number] = [239, 68, 68];
          if (p < 0.15) { activeColor = [239, 68, 68]; }
          else if (p >= 0.15 && p < 0.85) { activeColor = [255, 255, 255]; }
          else { activeColor = [249, 115, 22]; }

          const trailArcPoints = [];
          const trailArcSteps = Math.ceil(p * 45);
          if (trailArcSteps >= 2) {
            for (let i = 0; i <= trailArcSteps; i++) {
              const t = (i / trailArcSteps) * p;
              const tLng = origin.lng + (targetCoord.lng - origin.lng) * t;
              const tLat = origin.lat + (targetCoord.lat - origin.lat) * t;
              const tAlt = 4 * maxAlt * t * (1 - t);
              trailArcPoints.push([tLng, tLat, tAlt]);
            }
          }

          if (trailArcPoints.length >= 2) {
            activeLayers.push(
              new PathLayer({
                id: `missile-trail-curve-${strId}`,
                data: [{ path: trailArcPoints }],
                getPath: (d: any) => d.path,
                getColor: [...vectorRgb, 200] as any,
                getWidth: 3.5,
                widthUnits: 'pixels',
                pickable: false,
                parameters: { depthTest: true }
              })
            );
          }

          const particleList = [];
          particleList.push({
            position: [currentLng, currentLat, currentAlt],
            color: [...activeColor, 255],
            size: 650
          });

          // Plumes
          if (p < 0.15) {
            for (let k = 1; k <= 5; k++) {
              const tp = Math.max(0, p - k * 0.008);
              const tLng = origin.lng + (targetCoord.lng - origin.lng) * tp;
              const tLat = origin.lat + (targetCoord.lat - origin.lat) * tp;
              const tAlt = 4 * maxAlt * tp * (1 - tp);
              particleList.push({
                position: [tLng, tLat, tAlt],
                color: [239, 68, 68, Math.max(0, 255 - k * 45)],
                size: 550 - k * 80
              });
            }
          } else if (p >= 0.85) {
            for (let k = 1; k <= 4; k++) {
              const tp = Math.max(0, p - k * 0.005);
              const tLng = origin.lng + (targetCoord.lng - origin.lng) * tp;
              const tLat = origin.lat + (targetCoord.lat - origin.lat) * tp;
              const tAlt = 4 * maxAlt * tp * (1 - tp);
              particleList.push({
                position: [tLng, tLat, tAlt],
                color: [249, 115, 22, Math.max(0, 220 - k * 50)],
                size: 450 - k * 60
              });
            }
          }

          activeLayers.push(
            new ScatterplotLayer({
              id: `missile-vehicle-plume-${strId}`,
              data: particleList,
              getPosition: (d: any) => d.position,
              getFillColor: (d: any) => d.color,
              getRadius: (d: any) => d.size,
              radiusMinPixels: 5,
              stroked: true,
              getLineColor: [255, 255, 255, 255],
              lineWidthMinPixels: 1,
              pickable: false,
              parameters: { depthTest: true }
            })
          );
        }
      });
    }

    // Now, render simultaneous explosion logic for ALL active strikes
    activeStrikes.forEach(strike => {
      const strId = strike.id;
      const targetCoord = strike.target;
      const strikeRadii = strike.radii;
      const strikeYield = strike.effectiveYield;
      const centerPoint = [targetCoord.lng, targetCoord.lat];

      // Plume de retombées radioactives (Fallout)
      if (isDetonated && environmentParams?.explosionType === 'surface' && detonationTimeMs >= 5000) {
        const currentFalloutProgress = Math.max(0, Math.min(1, (detonationTimeMs - 5000) / 5000));
        const falloutLengthKm = Math.max(0.1, Math.pow(strikeRadii.heavyBlast / 1000, 1.2) * (Math.max(1, environmentParams.windSpeed) / 10 + 1) * 3) * currentFalloutProgress;
        const direction = environmentParams.windDirection;
        const numPoints = 30;
        const polygon = [];
        
        polygon.push(centerPoint); // Point de départ = cible
        
        // Bord gauche
        for(let i=1; i<=numPoints; i++) {
          const fraction = i / numPoints;
          const dist = fraction * falloutLengthKm;
          const spread = (1 - Math.abs(fraction - 0.6)) * 25; // 25 degrés max de dispersion
          polygon.push(getDestination(targetCoord.lng, targetCoord.lat, dist, direction - spread));
        }
        
        // Bord droit (retour vers la cible)
        for(let i=numPoints-1; i>=1; i--) {
          const fraction = i / numPoints;
          const dist = fraction * falloutLengthKm;
          const spread = (1 - Math.abs(fraction - 0.6)) * 25;
          polygon.push(getDestination(targetCoord.lng, targetCoord.lat, dist, direction + spread));
        }

        // Generate dashed border segments for the fallout zone pointillé boundary
        const falloutDashSegments = [];
        const numFalloutSegments = polygon.length;
        for (let i = 0; i < numFalloutSegments - 1; i++) {
          if (i % 2 === 0) { // Keep only alternating dash lines
            falloutDashSegments.push({ path: [polygon[i], polygon[i + 1]] });
          }
        }

        activeLayers.push(
          new PolygonLayer({
            id: `fallout-layer-${strId}`,
            data: [{ contour: polygon }],
            getPolygon: (d: any) => d.contour,
            getFillColor: [110, 231, 183, Math.floor(40 * currentFalloutProgress)], // Light radioactive green
            getLineColor: [16, 185, 129, Math.floor(100 * currentFalloutProgress)],
            getLineWidth: 1,
            lineWidthUnits: 'pixels',
            pickable: false,
            parameters: { depthTest: false }
          }),
          new PathLayer({
            id: `fallout-dashed-contour-layer-${strId}`,
            data: falloutDashSegments,
            getPath: (d: any) => d.path,
            getColor: [52, 211, 153, Math.floor(180 * currentFalloutProgress)], 
            getWidth: 2.5,
            widthUnits: 'pixels',
            pickable: false,
            parameters: { depthTest: false }
          })
        );
      }

      // Render actual falling environmental fallout particles adrift in 3D for each strike
      const strikeFalloutDebrisData = calculateActiveFalloutDebris(targetCoord, detonationTimeMs, falloutDriftParticles, strikeRadii.heavyBlast, environmentParams);
      if (isDetonated && strikeFalloutDebrisData.length > 0) {
        activeLayers.push(
          new PointCloudLayer({
            id: `fallout-descending-particles-${strId}`,
            data: strikeFalloutDebrisData,
            getPosition: (d: any) => d.position,
            getColor: (d: any) => d.color,
            pointSize: 2.5,
            sizeUnits: 'pixels',
            pickable: false,
            parameters: { depthTest: true }
          })
        );
      }

      if (isDetonated) {
        // Thermal Radiation Waves appear on timeline (1200ms -> 5000ms)
        const curThermalWaveRadius = thermalProgress * strikeRadii.thermal1st;
        if (curThermalWaveRadius > 0) {
          activeLayers.push(
            new ScatterplotLayer({
              id: `thermal-1st-layer-${strId}`,
              data: [{ position: centerPoint }],
              getPosition: (d: any) => d.position,
              getFillColor: [253, 224, 71, Math.floor(35 * thermalProgress)], 
              getRadius: () => Math.min(strikeRadii.thermal1st, curThermalWaveRadius),
              stroked: true,
              getLineColor: [253, 224, 71, Math.floor(100 * thermalProgress)],
              getLineWidth: 1,
              lineWidthUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: false }
            }),
            new ScatterplotLayer({
              id: `thermal-2nd-layer-${strId}`,
              data: [{ position: centerPoint }],
              getPosition: (d: any) => d.position,
              getFillColor: [251, 146, 60, Math.floor(40 * thermalProgress)], 
              getRadius: () => Math.min(strikeRadii.thermal2nd, curThermalWaveRadius),
              stroked: true,
              getLineColor: [251, 146, 60, Math.floor(120 * thermalProgress)],
              getLineWidth: 1,
              lineWidthUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: false }
            }),
            new ScatterplotLayer({
              id: `thermal-3rd-layer-${strId}`,
              data: [{ position: centerPoint }],
              getPosition: (d: any) => d.position,
              getFillColor: [249, 115, 22, Math.floor(45 * thermalProgress)], 
              getRadius: () => Math.min(strikeRadii.thermal3rd, curThermalWaveRadius),
              stroked: true,
              getLineColor: [249, 115, 22, Math.floor(150 * thermalProgress)],
              getLineWidth: 1.5,
              lineWidthUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: false }
            })
          );
        }

        // Pressure Blast Waves
        const curBlastWaveRadius = blastProgress * strikeRadii.lightBlast;
        if (curBlastWaveRadius > 0) {
          activeLayers.push(
            new ScatterplotLayer({
              id: `light-blast-layer-${strId}`,
              data: [{ position: centerPoint }],
              getPosition: (d: any) => d.position,
              getFillColor: [156, 163, 175, 40], 
              getRadius: () => Math.min(strikeRadii.lightBlast, curBlastWaveRadius),
              stroked: true,
              getLineColor: [156, 163, 175, 120],
              getLineWidth: 1,
              lineWidthUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: false }
            }),
            new ScatterplotLayer({
              id: `moderate-blast-layer-${strId}`,
              data: [{ position: centerPoint }],
              getPosition: (d: any) => d.position,
              getFillColor: [107, 114, 128, 70], 
              getRadius: () => Math.min(strikeRadii.moderateBlast, curBlastWaveRadius),
              stroked: true,
              getLineColor: [75, 85, 99, 180],
              getLineWidth: 1.5,
              lineWidthUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: false }
            }),
            new ScatterplotLayer({
              id: `heavy-blast-layer-${strId}`,
              data: [{ position: centerPoint }],
              getPosition: (d: any) => d.position,
              getFillColor: [239, 68, 68, 80], 
              getRadius: () => Math.min(strikeRadii.heavyBlast, curBlastWaveRadius),
              stroked: true,
              getLineColor: [185, 28, 28, 180],
              getLineWidth: 2,
              lineWidthUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: false }
            })
          );
        }

        // Concentric pressure wave line bands
        let currentPsi = 1;
        if (curBlastWaveRadius > 0) {
           if (curBlastWaveRadius <= strikeRadii.heavyBlast * 0.65) currentPsi = 55;
           else if (curBlastWaveRadius <= strikeRadii.heavyBlast) currentPsi = 25;
           else if (curBlastWaveRadius <= strikeRadii.moderateBlast) currentPsi = 10;
           else currentPsi = 2;
        }

        const strikeShockwaveBands = calculateShockwaveBands(targetCoord, detonationTimeMs, blastProgress, curBlastWaveRadius, currentPsi);
        if (strikeShockwaveBands.length > 0) {
          activeLayers.push(
            ...strikeShockwaveBands.map((band, idx) => 
              new PathLayer({
                id: `shockwave-pressure-band-${idx}-${strId}`,
                data: [{ path: band.path }],
                getPath: (d: any) => d.path,
                getColor: band.color as any,
                getWidth: band.width,
                widthUnits: 'pixels',
                pickable: false,
                parameters: { depthTest: false }
              })
            )
          );
        }

        // Fireball Gas Dome
        const curFireballRadius = strikeRadii.fireball * fireballProgress * fireballPulsation;
        if (detonationTimeMs >= 80 && curFireballRadius > 0) {
          activeLayers.push(
            new ScatterplotLayer({
              id: `fireball-layer-${strId}`,
              data: [{ position: centerPoint }],
              getPosition: (d: any) => d.position,
              getFillColor: fireballColor,
              getRadius: () => curFireballRadius,
              stroked: true,
              getLineColor: [234, 179, 8, Math.floor(220 * fireballProgress)],
              getLineWidth: 2,
              lineWidthUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: false }
            })
          );
        }

        // Fireball Debris Scattering
        const strikeDebrisData = calculateActiveDebris(targetCoord, detonationTimeMs, fireballDebrisParticles, strikeRadii.fireball);
        if (strikeDebrisData.length > 0) {
          activeLayers.push(
            new ScatterplotLayer({
              id: `fireball-projected-debris-${strId}`,
              data: strikeDebrisData,
              getPosition: (d: any) => d.position,
              getFillColor: (d: any) => d.color,
              getRadius: (d: any) => d.size,
              radiusMinPixels: 1.5,
              radiusMaxPixels: 6,
              stroked: false,
              pickable: false,
              parameters: { depthTest: false }
            })
          );
        }

        // Surface Crater
        if (environmentParams.explosionType === 'surface' && strikeRadii.crater > 0 && detonationTimeMs >= 80) {
          const craterProgress = Math.max(0, Math.min(1, (detonationTimeMs - 80) / 720));
          const currentCraterRadius = strikeRadii.crater * craterProgress;
          if (currentCraterRadius > 0) {
            activeLayers.push(
              new ScatterplotLayer({
                id: `crater-layer-${strId}`,
                data: [{ position: centerPoint }],
                getPosition: (d: any) => d.position,
                getFillColor: [25, 25, 25, 215], 
                getRadius: () => currentCraterRadius,
                stroked: true,
                getLineColor: [0, 0, 0, 240],
                getLineWidth: 3,
                lineWidthUnits: 'pixels',
                pickable: false,
                parameters: { depthTest: false }
              })
            );
          }
        }

        // Mushroom Cloud point-cloud (GPU-instanced particles)
        const strikeMushroomCloudData = calculateMushroomCloud(targetCoord, environmentParams, strikeYield, detonationTimeMs);
        if (environmentParams?.showMushroomCloud && strikeMushroomCloudData.length > 0) {
          activeLayers.push(
            new PointCloudLayer({
              id: `mushroom-cloud-layer-${strId}`,
              data: strikeMushroomCloudData,
              getPosition: (d: any) => d.position,
              getNormal: (d: any) => d.normal,
              getColor: (d: any) => d.color,
              pointSize: 3,
              sizeUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: true } 
            })
          );
        }

        // Maritime flood & tsunami progress waves
        if (environmentParams?.maritimeImpact && tsunamiMetrics?.isEligible && detonationTimeMs >= 2000) {
          const oceanDepthM = environmentParams.oceanDepthM ?? 2000;
          const shoreDistanceKm = environmentParams.shoreDistanceKm ?? 5;
          const coastalFloodingRadius = tsunamiMetrics.recommendedFloodRadiusM;
          const maritimeProgress = Math.max(0, Math.min(1, (detonationTimeMs - 2000) / 4000));
          const currentFloodRadius = coastalFloodingRadius * maritimeProgress;

          if (currentFloodRadius > 0) {
            const dashSegments = [];
            const numSegPoints = 180;
            for (let i = 0; i < numSegPoints; i += 2) {
              const p1 = getDestination(targetCoord.lng, targetCoord.lat, currentFloodRadius / 1000, i * 2);
              const p2 = getDestination(targetCoord.lng, targetCoord.lat, currentFloodRadius / 1000, (i + 1) * 2);
              dashSegments.push({ path: [p1, p2] });
            }

            activeLayers.push(
              new ScatterplotLayer({
                id: `maritime-flood-area-${strId}`,
                data: [{ position: centerPoint }],
                getPosition: (d: any) => d.position,
                getFillColor: [56, 189, 248, Math.floor(35 * maritimeProgress)], 
                getRadius: () => currentFloodRadius,
                stroked: false,
                pickable: false,
                parameters: { depthTest: false }
              }),
              new PathLayer({
                id: `maritime-flood-border-${strId}`,
                data: dashSegments,
                getPath: (d: any) => d.path,
                getColor: [14, 165, 233, Math.floor(220 * maritimeProgress)], 
                getWidth: 2.5,
                widthUnits: 'pixels',
                pickable: false,
                parameters: { depthTest: false }
              })
            );
          }

          // Anneaux de vagues concentriques animés (Seulement si sur l'eau)
          if (targetDetails?.isWater) {
             const numRings = 4;
             for (let i = 0; i < numRings; i++) {
                const timeActiveMs = Math.max(0, (detonationTimeMs - 2000) - i * 600);
                if (timeActiveMs <= 0) continue;
                
                // Vitesse proportionnelle à sqrt(profondeur) * 9.8
                const waveSpeedDeep = Math.sqrt(oceanDepthM * 9.8);
                // Vitesse visuelle (accélérée par rapport au temps de détonation)
                const simulatedSeconds = (timeActiveMs / 1000) * 15; 
                let radM = waveSpeedDeep * simulatedSeconds;
                
                // Effet de shoaling: la vague ralentit à l'approche de la côte
                const shoreDistM = shoreDistanceKm * 1000;
                if (radM > shoreDistM * 0.6) {
                    const excess = radM - shoreDistM * 0.6;
                    // Ralentissement brutal en eau peu profonde
                    radM = shoreDistM * 0.6 + excess * 0.25; 
                }

                // Opacité décroissante avec le temps et l'expansion
                const opacityProgress = Math.min(1, timeActiveMs / 6000);
                const ringOpacity = Math.max(0, Math.floor(255 * (1 - opacityProgress) * (1 - i/numRings)));
                
                if (ringOpacity > 0 && radM > 0) {
                     activeLayers.push(
                        new ScatterplotLayer({
                          id: `tsunami-ring-${strId}-${i}`,
                          data: [{ position: centerPoint }],
                          getPosition: (d: any) => d.position,
                          getFillColor: [0, 0, 0, 0], // transparent
                          getRadius: () => radM,
                          stroked: true,
                          getLineColor: [125, 211, 252, ringOpacity],
                          lineWidthMinPixels: Math.max(1, 3 - i),
                          pickable: false,
                          parameters: { depthTest: false }
                        })
                     );
                }
             }
          }
        }
      }

      // Permanent center targets (even before detonation)
      activeLayers.push(
        new ScatterplotLayer({
          id: `target-center-${strId}`,
          data: [{ position: centerPoint }],
          getPosition: (d: any) => d.position,
          getFillColor: isDetonated ? [255, 255, 255, 255] : [239, 68, 68, 255],
          getRadius: () => 100, 
          radiusMinPixels: 4,
          stroked: true,
          getLineColor: isDetonated ? [0, 0, 0, 255] : [255, 255, 255, 255],
          lineWidthMinPixels: 2,
          pickable: false,
          parameters: { depthTest: false }
        })
      );
    });

    if (origin) {
      activeLayers.push(
        new ScatterplotLayer({
          id: 'origin-center',
          data: [{ position: [origin.lng, origin.lat] }],
          getPosition: (d: any) => d.position,
          getFillColor: [59, 130, 246, 255], 
          getRadius: () => 100,
          radiusMinPixels: 4,
          stroked: true,
          getLineColor: [255, 255, 255, 255],
          lineWidthMinPixels: 2,
          pickable: false,
          parameters: { depthTest: false }
        })
      );
    }

    return activeLayers;
  }, [
    multiStrikeMode,
    activeStrikes,
    pastStrikes,
    origin,
    simulationMode,
    launchParams,
    flightProgress,
    detonationTimeMs,
    environmentParams,
    radii,
    effectiveYield,
    targetDetails,
    fireballProgress,
    fireballPulsation,
    fireballColor,
    blastProgress,
    thermalProgress,
    fireballDebrisParticles
  ]);

  return (
    <div className="w-full h-full relative cursor-crosshair">
      {/* Shockwave PSI Status Bar */}
      <AnimatePresence>
        {currentBlastWaveRadius > 0 && currentPsi > 0 && currentBlastWaveRadius < radii.lightBlast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
          >
            <div className="bg-black/80 backdrop-blur-md border border-zinc-700/50 rounded-full px-4 py-1.5 flex items-center gap-3 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
               <span className="text-zinc-300 text-xs font-medium tracking-wide uppercase">Front de l'onde</span>
               <div className="h-4 w-[1px] bg-zinc-700" />
               <span className="text-red-400 font-mono font-bold">{currentPsi.toFixed(1)} psi</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
        onClick={(info) => {
          if (info.coordinate) {
            onMapClick(info.coordinate[0], info.coordinate[1]);
          }
        }}
        getCursor={() => 'crosshair'}
      >
        <Map
          mapLib={maplibregl as any}
          mapStyle={MAP_STYLES[mapMode]}
          reuseMaps
          attributionControl={true}
        >
          <div className="absolute top-4 right-4 z-10 pointer-events-auto">
            <NavigationControl visualizePitch={true} />
          </div>
        </Map>
      </DeckGL>

      <div className="absolute top-4 flex w-full pointer-events-none z-[100] px-4 items-start justify-end gap-3">
        <div className="pointer-events-auto flex items-center bg-zinc-900 border border-zinc-700/50 rounded-md shadow-xl overflow-hidden mr-10 relative">
          <button 
            onClick={() => setMapMode('night')}
            className={`p-2 transition-colors duration-200 ${mapMode === 'night' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
            title="Mode Nuit"
          >
            <Moon className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-zinc-800" />
          <button 
            onClick={() => setMapMode('day')}
            className={`p-2 transition-colors duration-200 ${mapMode === 'day' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
            title="Mode Jour"
          >
            <Sun className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-zinc-800" />
          <button 
            onClick={() => setMapMode('satellite')}
            className={`p-2 transition-colors duration-200 ${mapMode === 'satellite' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
            title="Mode Satellite"
          >
            <Globe className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
