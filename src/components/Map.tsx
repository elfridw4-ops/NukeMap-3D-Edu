import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Map from 'react-map-gl/maplibre';
import * as maplibregl from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

// Configure MapLibre worker URL directly via official API using Vite-bundled local worker
if (typeof window !== 'undefined' && typeof maplibregl.setWorkerUrl === 'function') {
  maplibregl.setWorkerUrl(maplibreWorkerUrl);
}

import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, PolygonLayer, PointCloudLayer, PathLayer } from 'deck.gl';
import { Sun, Moon, Globe, Sliders, Check, RotateCcw, Key, X, AlertCircle, LayoutDashboard, Volume2, VolumeX } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { BlastRadii, EnvironmentParams, PastStrike, StrikeBallisticStatus } from '../types';
import {
  TsunamiMetrics,
  resolveVectorFlightProfile,
  calculateFalloutPlumeLengthKm,
  getGeodesicDestination,
  getGeodesicCirclePolygon,
  clampVisualRadiusM,
  computeVisualApogeeKm,
  computeBallisticImpactCoupling,
  calculateTsunamiMetrics,
  estimateClosestSeaDistanceKm,
  haversineKm,
} from '../lib/nuclearMath';
import { WORLD_LANDMASS_POLYGONS, isCoordinateOnLand } from '../data/worldPopulation';
import { soundEngine } from '../lib/soundEngine';

// Calcule la couleur, pulsation et rayon de la boule de feu pour une détonation donnée
function getFireballVisuals(detTimeMs: number, fireballRadius: number) {
  const progress = Math.max(0, Math.min(1, (detTimeMs - 80) / 720));
  const pulsation = (detTimeMs >= 600 && detTimeMs <= 800)
    ? 1.0 + 0.04 * Math.sin((detTimeMs - 600) * 0.05)
    : 1.0;

  let color: [number, number, number, number] = [255, 255, 255, 180];
  if (progress > 0) {
    let rColor = 255;
    let gColor = 255;
    let bColor = 255;

    if (progress < 0.3) {
      const p = progress / 0.3;
      gColor = Math.floor(255 - 15 * p);
      bColor = Math.floor(255 - 117 * p);
    } else if (progress < 0.7) {
      const p = (progress - 0.3) / 0.4;
      rColor = Math.floor(254 - 5 * p);
      gColor = Math.floor(240 - 125 * p);
      bColor = Math.floor(138 - 116 * p);
    } else {
      const p = (progress - 0.7) / 0.3;
      rColor = Math.floor(249 - 64 * p);
      gColor = Math.floor(115 - 87 * p);
      bColor = Math.floor(22 + 6 * p);
    }
    color = [rColor, gColor, bColor, 180 + Math.floor(Math.sin(detTimeMs * 0.1) * 15)];
  }

  return {
    progress,
    pulsation,
    currentRadius: fireballRadius * progress * pulsation,
    color,
  };
}

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
  onReturnToPortal?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  strikeBallisticStates?: Record<string, StrikeBallisticStatus>;
}

// Helper pour obtenir uniquement la frontière d'un cercle géodésique pour les PathLayers (sans segment de fermeture polaire)
function getGeodesicRingPath(clon: number, clat: number, radiusMeters: number, steps = 72): [number, number][] {
  const safeR = clampVisualRadiusM(radiusMeters);
  if (safeR <= 0) return [];
  const angularRad = safeR / (6371 * 1000);
  const latRad = (Math.max(-89.999, Math.min(89.999, clat)) * Math.PI) / 180;
  const enclosesPole = latRad + angularRad > Math.PI / 2 - 1e-4 || latRad - angularRad < -Math.PI / 2 + 1e-4;
  const poly = getGeodesicCirclePolygon(clon, clat, safeR, steps);
  if (enclosesPole && poly.length > 3) {
    // Exclut les 3 derniers points artificiels de fermeture du cap polaire pour PathLayer
    return poly.slice(0, poly.length - 3);
  }
  return poly;
}

function calculateActiveDebris(
  targetAddress: { lng: number; lat: number },
  detonationTimeMs: number,
  fireballDebrisParticles: any[],
  fireballRadius: number,
  plasmaIntensity: number = 0
) {
  if (detonationTimeMs < 80 || detonationTimeMs > 1500) return [];
  const tProgress = (detonationTimeMs - 80) / 1420;
  const kineticBoost = 1 + Math.max(0, plasmaIntensity) * 0.75;
  const cappedFireballM = Math.min(clampVisualRadiusM(fireballRadius), 2_500_000);
  return fireballDebrisParticles.map(p => {
    const rKm = (cappedFireballM * p.speedFactor * kineticBoost * tProgress) / 1000;
    const bearingDeg = (p.angle * 180) / Math.PI;
    const pos = getGeodesicDestination(targetAddress.lng, targetAddress.lat, rKm, bearingDeg);
    const alpha = Math.max(0, Math.floor((1 - tProgress) * 220));
    const color = plasmaIntensity > 0.4 && p.randomSeed > 0.72
      ? [125, 211, 252, alpha]
      : p.randomSeed > 0.5
        ? [254, 240, 138, alpha]
        : [239, 68, 68, alpha];
    return {
      position: pos,
      color,
      size: p.size * (1 + plasmaIntensity * 0.25)
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
  const falloutLengthKm = Math.min(8000, calculateFalloutPlumeLengthKm(heavyBlastRadius, environmentParams.windSpeed));
  const direction = environmentParams.windDirection;

  return falloutDriftParticles.map(p => {
    const elapsedDistanceFraction = p.distanceFraction + (deltaT * 0.4 * p.horizontalSpeedFactor);
    const currentDistKm = Math.min(1.0, elapsedDistanceFraction) * falloutLengthKm;
    const spread = (1 - Math.abs(elapsedDistanceFraction - 0.6)) * 25 * p.spreadFraction;
    const groundPos = getGeodesicDestination(targetAddress.lng, targetAddress.lat, currentDistKm, direction + spread);
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
        path: getGeodesicRingPath(targetAddress.lng, targetAddress.lat, currentBlastWaveRadius * scale, 72), 
        color: [255, 255, 255, distOpacity], 
        width: 10 - i // diminishing line width
      });
    }
  }

  // Front principal
  bands.push({ 
    path: getGeodesicRingPath(targetAddress.lng, targetAddress.lat, currentBlastWaveRadius, 72), 
    color: [frontR, frontG, frontB, baseOpacity], 
    width: 4.5 
  });

  // 2. Une traînée d'onde secondaire (réverbération) : 2 anneaux concentriques 
  // légèrement en retard sur le front principal
  bands.push({ 
    path: getGeodesicRingPath(targetAddress.lng, targetAddress.lat, currentBlastWaveRadius * 0.95, 72), 
    color: [frontR, frontG, frontB, Math.floor(baseOpacity * 0.6)], 
    width: 3 
  });
  bands.push({ 
    path: getGeodesicRingPath(targetAddress.lng, targetAddress.lat, currentBlastWaveRadius * 0.90, 72), 
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
  
  let height = Math.min(140_000, rawHeight);
  let capRadius = Math.min(220_000, 600 * Math.pow(effectiveYield, 0.3));
  
  if (effectiveYield < 1000 && rawHeight > tropopauseM * 0.8) {
    height = Math.min(height, tropopauseM);
    if (height === tropopauseM) {
      capRadius = Math.min(220_000, capRadius * 1.4);
    }
  }
  
  const stalkRadius = Math.min(55_000, 150 * Math.pow(effectiveYield, 0.3));
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

    const dx = r * Math.cos(theta) + swayDistance * (z / Math.max(1, height));
    const dy = r * Math.sin(theta);
    const offsetDistKm = Math.hypot(dx, dy) / 1000;
    const bearingDeg = (Math.atan2(dx, dy) * 180) / Math.PI;
    const pos = offsetDistKm > 0
      ? getGeodesicDestination(targetAddress.lng, targetAddress.lat, offsetDistKm, bearingDeg)
      : [targetAddress.lng, targetAddress.lat];

    points.push({
      position: [pos[0], Math.max(-85, Math.min(85, pos[1])), z],
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
type MapProvider = 'mapbox' | 'free';

// Styles vectoriels officiels Mapbox (utilisés lorsque le mode Mapbox et un token sont configurés)
const MAPBOX_STYLES: Record<MapMode, string> = {
  night: 'mapbox://styles/mapbox/dark-v11',
  day: 'mapbox://styles/mapbox/light-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12'
};

// Styles vectoriels libres (OpenFreeMap Dark/Positron) et satellite raster libre (ESRI World Imagery) sans clé API requise
const FREE_MAP_STYLES: Record<MapMode, any> = {
  night: 'https://tiles.openfreemap.org/styles/dark',
  day: 'https://tiles.openfreemap.org/styles/positron',
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

/**
 * Traducteur d'URL Mapbox vers les endpoints HTTP officiels pour MapLibre GL.
 * Rôle : Permet de convertir les URI propriétaires 'mapbox://' en requêtes HTTPS sécurisées
 * avec injection transparente du jeton d'accès Mapbox (access_token).
 *
 * @param url URL de la ressource demandée par MapLibre GL
 * @param resourceType Type de ressource (Style, Source, SpriteJSON, SpriteImage, Glyphs, Tile)
 * @param token Jeton d'accès public Mapbox (pk.eyJ...)
 */
export function transformMapboxUrl(url: string, resourceType: string, token: string): { url: string } {
  // En l'absence de token ou si l'URL n'est pas Mapbox, retourner l'URL sans modification
  if (!token || !token.trim()) {
    return { url };
  }

  const cleanToken = token.trim();

  // Résolution des protocoles propriétaires mapbox://
  if (url.startsWith('mapbox://')) {
    // 1. Feuilles de styles Mapbox (ex: mapbox://styles/mapbox/dark-v11)
    if (url.startsWith('mapbox://styles/')) {
      const stylePath = url.replace('mapbox://styles/', '');
      return {
        url: `https://api.mapbox.com/styles/v1/${stylePath}?access_token=${cleanToken}`
      };
    }

    // 2. Sprites d'icônes et symboles (ex: mapbox://sprites/mapbox/dark-v11@2x.json)
    if (url.startsWith('mapbox://sprites/')) {
      const spritePath = url.replace('mapbox://sprites/', '');
      const match = spritePath.match(/^([^\/]+)\/([^\/@]+)(@[0-9]+x)?(\.(?:json|png))?$/);
      if (match) {
        const [, user, styleId, scale, ext] = match;
        const scaleStr = scale || '';
        const extStr = ext || '';
        return {
          url: `https://api.mapbox.com/styles/v1/${user}/${styleId}/sprite${scaleStr}${extStr}?access_token=${cleanToken}`
        };
      }
      return {
        url: `https://api.mapbox.com/styles/v1/${spritePath}?access_token=${cleanToken}`
      };
    }

    // 3. Glyphes / Polices vectorielles PBF (ex: mapbox://fonts/mapbox/{fontstack}/{range}.pbf)
    if (url.startsWith('mapbox://fonts/')) {
      const fontPath = url.replace('mapbox://fonts/', '');
      return {
        url: `https://api.mapbox.com/fonts/v1/${fontPath}?access_token=${cleanToken}`
      };
    }

    // 4. Tuiles et sources de données vectorielles (ex: mapbox://mapbox.mapbox-streets-v8)
    const sourcePath = url.replace('mapbox://', '');
    return {
      url: `https://api.mapbox.com/v4/${sourcePath}.json?secure&access_token=${cleanToken}`
    };
  }

  // Traitement des requêtes directes vers api.mapbox.com n'ayant pas encore de token
  if (url.includes('api.mapbox.com') && !url.includes('access_token=')) {
    const separator = url.includes('?') ? '&' : '?';
    return {
      url: `${url}${separator}access_token=${cleanToken}`
    };
  }

  return { url };
}

export function MapView({ pastStrikes, target, origin, radii, environmentParams, effectiveYield, onMapClick, viewState, setViewState, simulationMode, flightProgress, launchParams, targetDetails, detonationTimeMs, isDetonationAnimating, isDetonationPaused, multiStrikeMode, tsunamiMetrics, onReturnToPortal, soundEnabled, onToggleSound, strikeBallisticStates }: MapViewProps) {
  
  // Mode de rendu visuel de la carte (Nuit, Jour, Satellite)
  const [mapMode, setMapMode] = useState<MapMode>(() => {
    const saved = localStorage.getItem('nukemap_map_mode');
    return (saved as MapMode) || 'night';
  });

  // Fournisseur cartographique actif : 'free' (CARTO/ESRI) par défaut pour garantir une compatibilité native MapLibre, 'mapbox' uniquement sur choix explicite
  const [mapProvider, setMapProvider] = useState<MapProvider>(() => {
    const saved = localStorage.getItem('nukemap_map_provider');
    if (saved === 'mapbox' || saved === 'free') return saved;
    return 'free';
  });

  // Jeton Mapbox : vérifie d'abord le stockage local de l'utilisateur puis la variable d'environnement
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem('nukemap_mapbox_token') || import.meta.env.VITE_MAPBOX_TOKEN || '';
  });

  // URL de style personnalisé Mapbox optionnelle (ex: mapbox://styles/user/style-id)
  const [customStyleUrl, setCustomStyleUrl] = useState<string>(() => {
    return localStorage.getItem('nukemap_mapbox_custom_style') || '';
  });

  // États du panneau de réglages cartographiques
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState(mapboxToken);
  const [customStyleInput, setCustomStyleInput] = useState(customStyleUrl);
  const [providerInput, setProviderInput] = useState<MapProvider>(mapProvider);
  const [configFeedback, setConfigFeedback] = useState<string | null>(null);
  const [mapErrorMsg, setMapErrorMsg] = useState<string | null>(null);
  const [hasTileError, setHasTileError] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onOnline = () => {
      setIsOffline(false);
      setHasTileError(false);
      setMapErrorMsg(null);
    };
    const onOffline = () => {
      setIsOffline(true);
    };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // Synchronisation de l'affichage du mode jour/nuit/satellite dans le localStorage
  useEffect(() => {
    localStorage.setItem('nukemap_map_mode', mapMode);
  }, [mapMode]);

  // Ouverture du panneau de configuration avec rafraîchissement des champs
  const handleOpenConfig = () => {
    setTokenInput(mapboxToken);
    setCustomStyleInput(customStyleUrl);
    setProviderInput(mapProvider);
    setConfigFeedback(null);
    setIsConfigOpen(true);
  };

  // Sauvegarde des paramètres et application instantanée
  const handleSaveConfig = () => {
    const trimmedToken = tokenInput.trim();
    const trimmedStyle = customStyleInput.trim();

    setMapboxToken(trimmedToken);
    setCustomStyleUrl(trimmedStyle);
    setMapProvider(providerInput);

    if (trimmedToken) {
      localStorage.setItem('nukemap_mapbox_token', trimmedToken);
    } else {
      localStorage.removeItem('nukemap_mapbox_token');
    }

    if (trimmedStyle) {
      localStorage.setItem('nukemap_mapbox_custom_style', trimmedStyle);
    } else {
      localStorage.removeItem('nukemap_mapbox_custom_style');
    }

    localStorage.setItem('nukemap_map_provider', providerInput);
    setConfigFeedback('Configuration cartographique enregistrée avec succès.');
    setTimeout(() => {
      setIsConfigOpen(false);
      setConfigFeedback(null);
    }, 1000);
  };

  // Réinitialisation vers le fournisseur gratuit (OpenFreeMap & ESRI)
  const handleResetToFree = () => {
    setTokenInput('');
    setCustomStyleInput('');
    setProviderInput('free');
    setMapboxToken('');
    setCustomStyleUrl('');
    setMapProvider('free');
    localStorage.removeItem('nukemap_mapbox_token');
    localStorage.removeItem('nukemap_mapbox_custom_style');
    localStorage.setItem('nukemap_map_provider', 'free');
    setConfigFeedback('Fonds libres rétablis (aucun token actif).');
    setTimeout(() => {
      setIsConfigOpen(false);
      setConfigFeedback(null);
    }, 1000);
  };

  // Calcul dynamique du style cartographique actif
  const activeMapStyle = useMemo(() => {
    if (mapProvider === 'mapbox' && mapboxToken.trim()) {
      if (customStyleUrl.trim()) {
        return customStyleUrl.trim();
      }
      return MAPBOX_STYLES[mapMode];
    }
    return FREE_MAP_STYLES[mapMode];
  }, [mapProvider, mapboxToken, customStyleUrl, mapMode]);

  // Callback de transformation d'URL pour injecter le token Mapbox dans MapLibre
  const transformRequestCallback = useMemo(() => {
    if (mapProvider !== 'mapbox' || !mapboxToken.trim()) {
      return undefined;
    }
    return (url: string, resourceType: any) => transformMapboxUrl(url, resourceType, mapboxToken);
  }, [mapProvider, mapboxToken]);

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

  // Calculate dynamic PSI at the wavefront (tracks active wavefront across staggered strikes in ballistic mode)
  const currentPsi = useMemo(() => {
    const evalPsi = (blastR: number, strikeR: BlastRadii): number => {
      if (!blastR || blastR <= 0 || blastR >= strikeR.lightBlast) return 0;
      if (blastR <= strikeR.fireball) return 200;
      if (blastR <= strikeR.heavyBlast) {
        const p = (blastR - strikeR.fireball) / Math.max(1, strikeR.heavyBlast - strikeR.fireball);
        return 200 - p * (200 - 20);
      }
      if (blastR <= strikeR.moderateBlast) {
        const p = (blastR - strikeR.heavyBlast) / Math.max(1, strikeR.moderateBlast - strikeR.heavyBlast);
        return 20 - p * (20 - 5);
      }
      const p = (blastR - strikeR.moderateBlast) / Math.max(1, strikeR.lightBlast - strikeR.moderateBlast);
      return 5 - p * (5 - 1);
    };

    if (simulationMode === 'ballistic' && strikeBallisticStates) {
      let maxActivePsi = 0;
      const entries = Object.values(strikeBallisticStates);
      for (const st of entries) {
        if (!st.inRange || st.detonationTimeMs === null) continue;
        const bp = Math.max(0, Math.min(1, (st.detonationTimeMs - 800) / 2200));
        const br = bp * radii.lightBlast;
        const psi = evalPsi(br, radii);
        if (psi > maxActivePsi) maxActivePsi = psi;
      }
      return maxActivePsi;
    }

    return evalPsi(currentBlastWaveRadius, radii);
  }, [simulationMode, strikeBallisticStates, currentBlastWaveRadius, radii]);

  // Deterministic Fireball Flying Debris Particles (consistent across renders/reloads)
  const fireballDebrisParticles = useMemo(() => {
    const particles = [];
    const numDebris = 60;
    for (let i = 0; i < numDebris; i++) {
      const r1 = Math.abs(Math.sin(i * 12.9898 + 1.23) * 43758.5453) % 1;
      const r2 = Math.abs(Math.sin(i * 78.233 + 4.56) * 23145.1235) % 1;
      const r3 = Math.abs(Math.sin(i * 45.164 + 7.89) * 63984.7121) % 1;
      const r4 = Math.abs(Math.sin(i * 93.989 + 2.34) * 81231.5432) % 1;
      const angle = r1 * Math.PI * 2;
      const speedFactor = 0.5 + r2 * 2.5;
      const size = 2 + r3 * 5;
      const randomSeed = r4;
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

    // Fond cartographique vectoriel hors ligne (océan + masses continentales + graticule)
    // Visible uniquement hors connexion ou en cas d'échec de chargement des tuiles réseau
    if (isOffline || hasTileError) {
      const graticulePaths: Array<{ path: [number, number][] }> = [];
      for (let lat = -60; lat <= 60; lat += 30) {
        const line: [number, number][] = [];
        for (let lon = -180; lon <= 180; lon += 15) line.push([lon, lat]);
        graticulePaths.push({ path: line });
      }
      for (let lon = -150; lon <= 180; lon += 30) {
        graticulePaths.push({ path: [[lon, -82], [lon, 82]] });
      }

      // Grille tactique locale adaptative lorsque la carte est zoomée hors ligne
      if (viewState.zoom >= 3.5) {
        const step = viewState.zoom >= 9 ? 0.25 : viewState.zoom >= 6 ? 1 : 5;
        const span = viewState.zoom >= 9 ? 2.5 : viewState.zoom >= 6 ? 10 : 35;
        const minLat = Math.max(-82, Math.floor((viewState.latitude - span) / step) * step);
        const maxLat = Math.min(82, Math.ceil((viewState.latitude + span) / step) * step);
        const minLon = Math.max(-180, Math.floor((viewState.longitude - span) / step) * step);
        const maxLon = Math.min(180, Math.ceil((viewState.longitude + span) / step) * step);
        for (let lat = minLat; lat <= maxLat + 1e-6; lat += step) {
          graticulePaths.push({ path: [[minLon, lat], [maxLon, lat]] });
        }
        for (let lon = minLon; lon <= maxLon + 1e-6; lon += step) {
          graticulePaths.push({ path: [[lon, minLat], [lon, maxLat]] });
        }
      }

      activeLayers.push(
        new PolygonLayer({
          id: 'offline-world-ocean-backdrop',
          data: [{ contour: [[-180, -85.05], [180, -85.05], [180, 85.05], [-180, 85.05], [-180, -85.05]] }],
          getPolygon: (d: any) => d.contour,
          getFillColor: mapMode === 'day' ? [203, 224, 240, 235] : [9, 17, 30, 245],
          stroked: false,
          pickable: false,
          parameters: { depthTest: false },
        }),
        new PolygonLayer({
          id: 'offline-world-landmasses',
          data: WORLD_LANDMASS_POLYGONS,
          getPolygon: (d: any) => d.ring,
          getFillColor: mapMode === 'day' ? [229, 231, 235, 250] : [33, 46, 66, 245],
          stroked: true,
          getLineColor: mapMode === 'day' ? [100, 116, 139, 200] : [94, 118, 148, 225],
          getLineWidth: 1.5,
          lineWidthUnits: 'pixels',
          pickable: false,
          parameters: { depthTest: false },
        }),
        new PathLayer({
          id: 'offline-world-graticule',
          data: graticulePaths,
          getPath: (d: any) => d.path,
          getColor: mapMode === 'day' ? [148, 163, 184, 75] : [71, 85, 105, 95],
          getWidth: 1,
          widthUnits: 'pixels',
          pickable: false,
          parameters: { depthTest: false },
        })
      );
    }

    // Render past strikes only when not in multi-strike mode (they are static geodesic footprints in single-shot mode)
    if (!multiStrikeMode && pastStrikes && pastStrikes.length > 0) {
      pastStrikes.forEach(strike => {
        const pos = [strike.target.lng, strike.target.lat];
        const pastFireballPoly = getGeodesicCirclePolygon(strike.target.lng, strike.target.lat, strike.radii.fireball, 64);
        const pastHeavyPoly = getGeodesicCirclePolygon(strike.target.lng, strike.target.lat, strike.radii.heavyBlast, 64);
        const pastModPoly = getGeodesicCirclePolygon(strike.target.lng, strike.target.lat, strike.radii.moderateBlast, 64);
        const pastThermalPoly = getGeodesicCirclePolygon(strike.target.lng, strike.target.lat, strike.radii.thermal1st, 72);

        activeLayers.push(
          new PolygonLayer({
            id: `past-thermal-${strike.id}`,
            data: [{ contour: pastThermalPoly }],
            getPolygon: (d: any) => d.contour,
            getFillColor: [234, 179, 8, 12],
            stroked: true,
            getLineColor: [234, 179, 8, 80],
            getLineWidth: 1,
            lineWidthUnits: 'pixels',
            pickable: false,
            parameters: { depthTest: false }
          }),
          new PolygonLayer({
            id: `past-moderate-blast-${strike.id}`,
            data: [{ contour: pastModPoly }],
            getPolygon: (d: any) => d.contour,
            getFillColor: [217, 119, 6, 18],
            stroked: true,
            getLineColor: [217, 119, 6, 110],
            getLineWidth: 1,
            lineWidthUnits: 'pixels',
            pickable: false,
            parameters: { depthTest: false }
          }),
          new PolygonLayer({
            id: `past-heavy-blast-${strike.id}`,
            data: [{ contour: pastHeavyPoly }],
            getPolygon: (d: any) => d.contour,
            getFillColor: [239, 68, 68, 25],
            stroked: true,
            getLineColor: [239, 68, 68, 130],
            getLineWidth: 1,
            lineWidthUnits: 'pixels',
            pickable: false,
            parameters: { depthTest: false }
          }),
          new PolygonLayer({
            id: `past-fireball-${strike.id}`,
            data: [{ contour: pastFireballPoly }],
            getPolygon: (d: any) => d.contour,
            getFillColor: [249, 115, 22, 65],
            stroked: false,
            pickable: false,
            parameters: { depthTest: false }
          }),
          new ScatterplotLayer({
            id: `past-center-${strike.id}`,
            data: [{ position: pos }],
            getPosition: (d: any) => d.position,
            getFillColor: [255, 255, 255, 215],
            getRadius: 4,
            radiusUnits: 'pixels',
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
    const profile = resolveVectorFlightProfile(launchParams);

    // Generate ballistic trajectories for all active strikes simultaneously if in ballistic mode
    if (simulationMode === 'ballistic' && origin && activeStrikes.length > 0) {
      const altitudeKm = profile.altitudeKm;
      const visualApogeeKm = computeVisualApogeeKm(altitudeKm);
      const vectorColorHex = profile.colorHex;

      const vr = parseInt(vectorColorHex.slice(1, 3), 16);
      const vg = parseInt(vectorColorHex.slice(3, 5), 16);
      const vb = parseInt(vectorColorHex.slice(5, 7), 16);
      const vectorRgb: [number, number, number] = [vr, vg, vb];
      const maxAlt = visualApogeeKm * 1000;

      activeStrikes.forEach(strike => {
        const strId = strike.id;
        const targetCoord = strike.target;
        const distKm = haversineKm(origin.lat, origin.lng, targetCoord.lat, targetCoord.lng);
        const strikeCoupling = computeBallisticImpactCoupling({
          baseYieldKt: strike.effectiveYield,
          speedKmh: profile.speedKmh,
          apogeeKm: altitudeKm,
          vectorId: profile.vectorId,
          explosionType: environmentParams.explosionType,
          surfaceDistKm: distKm,
        });

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
            getColor: (strikeBallisticStates?.[strId] && !strikeBallisticStates[strId].inRange)
              ? [161, 161, 170, 70]
              : ([...vectorRgb, 120] as any),
            getWidth: 2.5,
            widthUnits: 'pixels',
            pickable: false,
            parameters: { depthTest: true }
          })
        );

        // Progression individuelle par distance réelle : chaque ogive suit son propre avancement p
        const strikeFlightState = strikeBallisticStates?.[strId];
        const p = strikeFlightState ? strikeFlightState.progress : flightProgress;

        // Flight trail and vehicle visual if flying
        if (p > 0 && p < 1) {
          const currentLng = origin.lng + (targetCoord.lng - origin.lng) * p;
          const currentLat = origin.lat + (targetCoord.lat - origin.lat) * p;
          const currentAlt = 4 * maxAlt * p * (1 - p);

          let activeColor: [number, number, number] = [239, 68, 68];
          if (p < 0.15) { activeColor = [239, 68, 68]; }
          else if (p >= 0.15 && p < 0.68) { activeColor = [255, 255, 255]; }
          else {
            // Phase de rentrée atmosphérique : intensité plasma proportionnelle à vitesse & apogée
            activeColor = strikeCoupling.plasmaIntensity > 0.35 ? [125, 211, 252] : [249, 115, 22];
          }

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
                getColor: (p >= 0.68 && strikeCoupling.plasmaIntensity > 0.2
                  ? [56, 189, 248, 225]
                  : [...vectorRgb, 200]) as any,
                getWidth: 3.5 + strikeCoupling.plasmaIntensity * 2.5,
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
            size: 6 + strikeCoupling.plasmaIntensity * 5
          });

          // Plumes boost & sillage plasma de rentrée hypersonique
          if (p < 0.15) {
            for (let k = 1; k <= 5; k++) {
              const tp = Math.max(0, p - k * 0.008);
              const tLng = origin.lng + (targetCoord.lng - origin.lng) * tp;
              const tLat = origin.lat + (targetCoord.lat - origin.lat) * tp;
              const tAlt = 4 * maxAlt * tp * (1 - tp);
              particleList.push({
                position: [tLng, tLat, tAlt],
                color: [239, 68, 68, Math.max(0, 255 - k * 45)],
                size: Math.max(2, 6 - k * 0.8)
              });
            }
          } else if (p >= 0.68) {
            const wakeCount = 4 + Math.round(strikeCoupling.plasmaIntensity * 5);
            for (let k = 1; k <= wakeCount; k++) {
              const tp = Math.max(0, p - k * (0.005 + strikeCoupling.plasmaIntensity * 0.004));
              const tLng = origin.lng + (targetCoord.lng - origin.lng) * tp;
              const tLat = origin.lat + (targetCoord.lat - origin.lat) * tp;
              const tAlt = 4 * maxAlt * tp * (1 - tp);
              const plasmaAlpha = Math.max(0, Math.floor((225 + strikeCoupling.plasmaIntensity * 30) - k * 25));
              particleList.push({
                position: [tLng, tLat, tAlt],
                color: strikeCoupling.plasmaIntensity > 0.35
                  ? [56, 189, 248, plasmaAlpha]
                  : [249, 115, 22, plasmaAlpha],
                size: Math.max(2, 5 + strikeCoupling.plasmaIntensity * 4 - k * 0.5)
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
              radiusUnits: 'pixels',
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

    // Now, render independent explosion timelines for ALL active strikes
    activeStrikes.forEach(strike => {
      const strId = strike.id;
      const targetCoord = strike.target;
      const strikeRadii = strike.radii;
      const strikeYield = strike.effectiveYield;
      const centerPoint = [targetCoord.lng, targetCoord.lat];

      const strikeBallisticState = simulationMode === 'ballistic' ? strikeBallisticStates?.[strId] : undefined;
      const strikeIsDetonated = simulationMode === 'instant'
        ? true
        : (strikeBallisticState ? strikeBallisticState.detonationTimeMs !== null : isDetonated);
      const strikeDetonationMs = simulationMode === 'instant'
        ? detonationTimeMs
        : (strikeBallisticState ? (strikeBallisticState.detonationTimeMs ?? 0) : detonationTimeMs);

      const strikeBlastProgress = Math.max(0, Math.min(1, (strikeDetonationMs - 800) / 2200));
      const strikeThermalProgress = Math.max(0, Math.min(1, (strikeDetonationMs - 1200) / 3800));
      const strikeFireball = getFireballVisuals(strikeDetonationMs, strikeRadii.fireball);

      const strikePlasmaIntensity = simulationMode === 'ballistic' && origin
        ? computeBallisticImpactCoupling({
            baseYieldKt: strikeYield,
            speedKmh: profile.speedKmh,
            apogeeKm: profile.altitudeKm,
            vectorId: profile.vectorId,
            explosionType: environmentParams.explosionType,
            surfaceDistKm: haversineKm(origin.lat, origin.lng, targetCoord.lat, targetCoord.lng),
          }).plasmaIntensity
        : 0;

      // Plume de retombées radioactives (Fallout)
      if (strikeIsDetonated && environmentParams?.explosionType === 'surface' && strikeDetonationMs >= 5000) {
        const currentFalloutProgress = Math.max(0, Math.min(1, (strikeDetonationMs - 5000) / 5000));
        const falloutLengthKm = Math.min(8000, calculateFalloutPlumeLengthKm(strikeRadii.heavyBlast, environmentParams.windSpeed) * currentFalloutProgress);
        const direction = environmentParams.windDirection;
        const numPoints = 30;
        const polygon = [];
        
        polygon.push(centerPoint); // Point de départ = cible
        
        // Bord gauche
        for(let i=1; i<=numPoints; i++) {
          const fraction = i / numPoints;
          const dist = fraction * falloutLengthKm;
          const spread = (1 - Math.abs(fraction - 0.6)) * 25; // 25 degrés max de dispersion
          polygon.push(getGeodesicDestination(targetCoord.lng, targetCoord.lat, dist, direction - spread));
        }
        
        // Bord droit (retour vers la cible)
        for(let i=numPoints-1; i>=1; i--) {
          const fraction = i / numPoints;
          const dist = fraction * falloutLengthKm;
          const spread = (1 - Math.abs(fraction - 0.6)) * 25;
          polygon.push(getGeodesicDestination(targetCoord.lng, targetCoord.lat, dist, direction + spread));
        }

        // Generate dashed border segments for the fallout zone pointillé boundary
        const falloutDashSegments = [];
        const numFalloutSegments = polygon.length;
        for (let i = 0; i < numFalloutSegments - 1; i++) {
          if (i % 2 === 0) {
            falloutDashSegments.push({ path: [polygon[i], polygon[i + 1]] });
          }
        }

        activeLayers.push(
          new PolygonLayer({
            id: `fallout-layer-${strId}`,
            data: [{ contour: polygon }],
            getPolygon: (d: any) => d.contour,
            getFillColor: [110, 231, 183, Math.floor(40 * currentFalloutProgress)],
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
      const strikeFalloutDebrisData = calculateActiveFalloutDebris(targetCoord, strikeDetonationMs, falloutDriftParticles, strikeRadii.heavyBlast, environmentParams);
      if (strikeIsDetonated && strikeFalloutDebrisData.length > 0) {
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

      if (strikeIsDetonated) {
        // Anneau d'impact cinétique hypersonique (T+0..750ms lorsque le vecteur arrive à Mach élevé)
        if (strikePlasmaIntensity > 0.12 && strikeDetonationMs < 750) {
          const kinProg = strikeDetonationMs / 750;
          const kinR = clampVisualRadiusM(Math.max(strikeRadii.fireball * 1.4, 2500) * (0.2 + kinProg * 1.5));
          const kinRingPath = getGeodesicRingPath(targetCoord.lng, targetCoord.lat, kinR, 64);
          if (kinRingPath.length > 2) {
            activeLayers.push(
              new PathLayer({
                id: `kinetic-impact-ring-${strId}`,
                data: [{ path: kinRingPath }],
                getPath: (d: any) => d.path,
                getColor: [125, 211, 252, Math.floor(240 * (1 - kinProg) * strikePlasmaIntensity)],
                getWidth: 4 + strikePlasmaIntensity * 4,
                widthUnits: 'pixels',
                pickable: false,
                parameters: { depthTest: false },
              })
            );
          }
        }

        // Thermal Radiation Waves appear on timeline (1200ms -> 5000ms) — Polygones géodésiques exacts (sans distorsion polaire)
        const curThermalWaveRadius = strikeThermalProgress * strikeRadii.thermal1st;
        if (curThermalWaveRadius > 0) {
          const r1stPoly = getGeodesicCirclePolygon(
            targetCoord.lng,
            targetCoord.lat,
            Math.min(strikeRadii.thermal1st, curThermalWaveRadius),
            72
          );
          const r2ndPoly = getGeodesicCirclePolygon(
            targetCoord.lng,
            targetCoord.lat,
            Math.min(strikeRadii.thermal2nd, curThermalWaveRadius),
            72
          );
          const r3rdPoly = getGeodesicCirclePolygon(
            targetCoord.lng,
            targetCoord.lat,
            Math.min(strikeRadii.thermal3rd, curThermalWaveRadius),
            72
          );

          activeLayers.push(
            new PolygonLayer({
              id: `thermal-1st-layer-${strId}`,
              data: [{ contour: r1stPoly }],
              getPolygon: (d: any) => d.contour,
              getFillColor: [253, 224, 71, Math.floor(35 * strikeThermalProgress)],
              stroked: true,
              getLineColor: [253, 224, 71, Math.floor(110 * strikeThermalProgress)],
              getLineWidth: 1,
              lineWidthUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: false }
            }),
            new PolygonLayer({
              id: `thermal-2nd-layer-${strId}`,
              data: [{ contour: r2ndPoly }],
              getPolygon: (d: any) => d.contour,
              getFillColor: [251, 146, 60, Math.floor(40 * strikeThermalProgress)],
              stroked: true,
              getLineColor: [251, 146, 60, Math.floor(125 * strikeThermalProgress)],
              getLineWidth: 1,
              lineWidthUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: false }
            }),
            new PolygonLayer({
              id: `thermal-3rd-layer-${strId}`,
              data: [{ contour: r3rdPoly }],
              getPolygon: (d: any) => d.contour,
              getFillColor: [249, 115, 22, Math.floor(45 * strikeThermalProgress)],
              stroked: true,
              getLineColor: [249, 115, 22, Math.floor(150 * strikeThermalProgress)],
              getLineWidth: 1.5,
              lineWidthUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: false }
            })
          );
        }

        // Pressure Blast Waves — Polygones géodésiques exacts
        const curBlastWaveRadius = strikeBlastProgress * strikeRadii.lightBlast;
        if (curBlastWaveRadius > 0) {
          const lightPoly = getGeodesicCirclePolygon(
            targetCoord.lng,
            targetCoord.lat,
            Math.min(strikeRadii.lightBlast, curBlastWaveRadius),
            72
          );
          const modPoly = getGeodesicCirclePolygon(
            targetCoord.lng,
            targetCoord.lat,
            Math.min(strikeRadii.moderateBlast, curBlastWaveRadius),
            72
          );
          const heavyPoly = getGeodesicCirclePolygon(
            targetCoord.lng,
            targetCoord.lat,
            Math.min(strikeRadii.heavyBlast, curBlastWaveRadius),
            72
          );

          activeLayers.push(
            new PolygonLayer({
              id: `light-blast-layer-${strId}`,
              data: [{ contour: lightPoly }],
              getPolygon: (d: any) => d.contour,
              getFillColor: [156, 163, 175, 40],
              stroked: true,
              getLineColor: [156, 163, 175, 120],
              getLineWidth: 1,
              lineWidthUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: false }
            }),
            new PolygonLayer({
              id: `moderate-blast-layer-${strId}`,
              data: [{ contour: modPoly }],
              getPolygon: (d: any) => d.contour,
              getFillColor: [107, 114, 128, 70],
              stroked: true,
              getLineColor: [75, 85, 99, 180],
              getLineWidth: 1.5,
              lineWidthUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: false }
            }),
            new PolygonLayer({
              id: `heavy-blast-layer-${strId}`,
              data: [{ contour: heavyPoly }],
              getPolygon: (d: any) => d.contour,
              getFillColor: [239, 68, 68, 80],
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
        let strikeCurrentPsi = 1;
        if (curBlastWaveRadius > 0) {
           if (curBlastWaveRadius <= strikeRadii.heavyBlast * 0.65) strikeCurrentPsi = 55;
           else if (curBlastWaveRadius <= strikeRadii.heavyBlast) strikeCurrentPsi = 25;
           else if (curBlastWaveRadius <= strikeRadii.moderateBlast) strikeCurrentPsi = 10;
           else strikeCurrentPsi = 2;
        }

        const strikeShockwaveBands = calculateShockwaveBands(targetCoord, strikeDetonationMs, strikeBlastProgress, curBlastWaveRadius, strikeCurrentPsi);
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

        // Fireball Gas Dome (Polygone géodésique exact)
        const curFireballRadius = strikeFireball.currentRadius;
        if (strikeDetonationMs >= 80 && curFireballRadius > 0) {
          const fbPoly = getGeodesicCirclePolygon(targetCoord.lng, targetCoord.lat, curFireballRadius, 64);
          activeLayers.push(
            new PolygonLayer({
              id: `fireball-layer-${strId}`,
              data: [{ contour: fbPoly }],
              getPolygon: (d: any) => d.contour,
              getFillColor: strikeFireball.color,
              stroked: true,
              getLineColor: [234, 179, 8, Math.floor(220 * strikeFireball.progress)],
              getLineWidth: 2,
              lineWidthUnits: 'pixels',
              pickable: false,
              parameters: { depthTest: false }
            })
          );
        }

        // Fireball Debris Scattering (géodésique, immunisé contre cos(lat) polaire)
        const strikeDebrisData = calculateActiveDebris(
          targetCoord,
          strikeDetonationMs,
          fireballDebrisParticles,
          strikeRadii.fireball,
          strikePlasmaIntensity
        );
        if (strikeDebrisData.length > 0) {
          activeLayers.push(
            new ScatterplotLayer({
              id: `fireball-projected-debris-${strId}`,
              data: strikeDebrisData,
              getPosition: (d: any) => d.position,
              getFillColor: (d: any) => d.color,
              getRadius: (d: any) => d.size,
              radiusUnits: 'pixels',
              radiusMinPixels: 1.5,
              radiusMaxPixels: 6,
              stroked: false,
              pickable: false,
              parameters: { depthTest: false }
            })
          );
        }

        // Surface Crater (Polygone géodésique exact)
        if (environmentParams.explosionType === 'surface' && strikeRadii.crater > 0 && strikeDetonationMs >= 80) {
          const craterProgress = Math.max(0, Math.min(1, (strikeDetonationMs - 80) / 720));
          const currentCraterRadius = strikeRadii.crater * craterProgress;
          if (currentCraterRadius > 0) {
            const craterPoly = getGeodesicCirclePolygon(targetCoord.lng, targetCoord.lat, currentCraterRadius, 56);
            activeLayers.push(
              new PolygonLayer({
                id: `crater-layer-${strId}`,
                data: [{ contour: craterPoly }],
                getPolygon: (d: any) => d.contour,
                getFillColor: [25, 25, 25, 215],
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

        // Mushroom Cloud point-cloud (géodésique + plafond visuel)
        const strikeMushroomCloudData = calculateMushroomCloud(targetCoord, environmentParams, strikeYield, strikeDetonationMs);
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

        // Maritime flood & tsunami progress waves — évalués individuellement par cible !
        const strikeIsWater = strId === 'current-target'
          ? Boolean(targetDetails?.isWater)
          : !isCoordinateOnLand(targetCoord.lat, targetCoord.lng);
        const strikeShoreKm = strId === 'current-target'
          ? (environmentParams.shoreDistanceKm ?? 5)
          : (strikeIsWater ? 0 : estimateClosestSeaDistanceKm(targetCoord.lat, targetCoord.lng).distanceKm);
        const strikeTsunami = strId === 'current-target'
          ? tsunamiMetrics
          : calculateTsunamiMetrics(
              strikeYield,
              environmentParams.oceanDepthM ?? 2000,
              strikeShoreKm,
              environmentParams.beachSlopePct ?? 2.0,
              environmentParams.terrainDamping ?? 1.5,
              strikeIsWater,
              environmentParams.coastalDepthM ?? 8,
              environmentParams.manningN ?? 0.050
            );

        if (environmentParams?.maritimeImpact && strikeTsunami?.isEligible && strikeDetonationMs >= 2000) {
          const oceanDepthM = environmentParams.oceanDepthM ?? 2000;
          const coastalFloodingRadius = strikeTsunami.recommendedFloodRadiusM;
          const maritimeProgress = Math.max(0, Math.min(1, (strikeDetonationMs - 2000) / 4000));
          const currentFloodRadius = coastalFloodingRadius * maritimeProgress;

          if (currentFloodRadius > 0) {
            const floodPoly = getGeodesicCirclePolygon(targetCoord.lng, targetCoord.lat, currentFloodRadius, 72);
            const floodRingPts = getGeodesicRingPath(targetCoord.lng, targetCoord.lat, currentFloodRadius, 90);
            const dashSegments = [];
            for (let i = 0; i < floodRingPts.length - 1; i += 2) {
              dashSegments.push({ path: [floodRingPts[i], floodRingPts[i + 1]] });
            }

            activeLayers.push(
              new PolygonLayer({
                id: `maritime-flood-area-${strId}`,
                data: [{ contour: floodPoly }],
                getPolygon: (d: any) => d.contour,
                getFillColor: [56, 189, 248, Math.floor(35 * maritimeProgress)],
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
          if (strikeIsWater) {
             const numRings = 4;
             for (let i = 0; i < numRings; i++) {
                const timeActiveMs = Math.max(0, (strikeDetonationMs - 2000) - i * 600);
                if (timeActiveMs <= 0) continue;
                
                const waveSpeedDeep = Math.sqrt(oceanDepthM * 9.8);
                const simulatedSeconds = (timeActiveMs / 1000) * 15; 
                let radM = waveSpeedDeep * simulatedSeconds;
                
                const shoreDistM = strikeShoreKm * 1000;
                if (radM > shoreDistM * 0.6) {
                    const excess = radM - shoreDistM * 0.6;
                    radM = shoreDistM * 0.6 + excess * 0.25; 
                }

                const opacityProgress = Math.min(1, timeActiveMs / 6000);
                const ringOpacity = Math.max(0, Math.floor(255 * (1 - opacityProgress) * (1 - i/numRings)));
                
                if (ringOpacity > 0 && radM > 0) {
                     const ringPath = getGeodesicRingPath(targetCoord.lng, targetCoord.lat, radM, 64);
                     if (ringPath.length > 2) {
                       activeLayers.push(
                          new PathLayer({
                            id: `tsunami-ring-${strId}-${i}`,
                            data: [{ path: ringPath }],
                            getPath: (d: any) => d.path,
                            getColor: [125, 211, 252, ringOpacity],
                            getWidth: Math.max(1, 3 - i),
                            widthUnits: 'pixels',
                            pickable: false,
                            parameters: { depthTest: false }
                          })
                       );
                     }
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
          getFillColor: strikeIsDetonated ? [255, 255, 255, 255] : [239, 68, 68, 255],
          getRadius: 5,
          radiusUnits: 'pixels',
          stroked: true,
          getLineColor: strikeIsDetonated ? [0, 0, 0, 255] : [255, 255, 255, 255],
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
          getRadius: 5,
          radiusUnits: 'pixels',
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
    tsunamiMetrics,
    fireballProgress,
    fireballPulsation,
    fireballColor,
    blastProgress,
    thermalProgress,
    fireballDebrisParticles,
    strikeBallisticStates,
    isOffline,
    hasTileError,
    mapMode
  ]);

  return (
    <div className="w-full h-full relative cursor-crosshair touch-none" data-testid="map-viewport">
      {/* Shockwave PSI Status Bar */}
      <AnimatePresence>
        {currentPsi > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-[4.75rem] left-1/2 -translate-x-1/2 z-[90] pointer-events-none"
          >
            <div className="bg-zinc-950/90 backdrop-blur-md border border-zinc-800 rounded-lg px-3.5 py-1.5 flex items-center gap-2.5 shadow-xl whitespace-nowrap">
               <span className="text-zinc-400 text-[11px] font-medium tracking-wide uppercase">Front de l'onde</span>
               <div className="h-3.5 w-[1px] bg-zinc-800" />
               <span className="text-red-400 font-mono tabular-nums text-xs font-bold">{currentPsi.toFixed(1)} psi</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeckGL
        viewState={{
          longitude: Number.isFinite(viewState?.longitude) ? viewState.longitude : 2.3522,
          latitude: Number.isFinite(viewState?.latitude) ? viewState.latitude : 48.8566,
          zoom: Number.isFinite(viewState?.zoom) ? viewState.zoom : 10,
          pitch: Number.isFinite(viewState?.pitch) ? viewState.pitch : 45,
          bearing: Number.isFinite(viewState?.bearing) ? viewState.bearing : 0,
          ...(viewState?.transitionDuration ? { transitionDuration: viewState.transitionDuration } : {})
        }}
        onViewStateChange={({ viewState: rawNextVs, interactionState }) => {
          const isUserOrTransition = Boolean(
            interactionState?.isDragging ||
            interactionState?.isPanning ||
            interactionState?.isZooming ||
            interactionState?.isRotating ||
            interactionState?.inTransition
          );
          if (!isUserOrTransition) return;
          const nextVs = rawNextVs as {
            longitude?: number;
            latitude?: number;
            zoom?: number;
            pitch?: number;
            bearing?: number;
          };
          if (
            nextVs &&
            Number.isFinite(nextVs.longitude) &&
            Number.isFinite(nextVs.latitude) &&
            Number.isFinite(nextVs.zoom)
          ) {
            setViewState({
              longitude: nextVs.longitude,
              latitude: nextVs.latitude,
              zoom: nextVs.zoom,
              pitch: Number.isFinite(nextVs.pitch) ? nextVs.pitch : 45,
              bearing: Number.isFinite(nextVs.bearing) ? nextVs.bearing : 0
            });
          }
        }}
        controller={{
          dragPan: true,
          touchZoom: true,
          touchRotate: false,
          scrollZoom: true,
          doubleClickZoom: true,
          keyboard: true
        }}
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
          mapStyle={activeMapStyle}
          transformRequest={transformRequestCallback}
          reuseMaps
          attributionControl={true}
          onLoad={() => {
            setMapErrorMsg(null);
            setHasTileError(false);
          }}
          onError={(e) => {
            const msg = (e as any)?.error?.message || '';
            console.warn('[MapLibre Info] Notification du moteur cartographique:', e);
            if (mapProvider === 'mapbox') {
              // Bascule automatiquement sur OpenFreeMap/ESRI si le style Mapbox est incompatible ou refusé
              setMapProvider('free');
              localStorage.setItem('nukemap_map_provider', 'free');
              setMapErrorMsg("Style Mapbox indisponible ou incompatible — bascule automatique sur fonds OpenFreeMap/ESRI.");
              return;
            }
            if (msg && !msg.toLowerCase().includes('abort')) {
              setHasTileError(true);
              if (typeof navigator !== 'undefined' && !navigator.onLine) {
                setMapErrorMsg(null);
              } else {
                setMapErrorMsg("Tuiles réseau indisponibles — bascule sur fond vectoriel continental hors-ligne.");
              }
            }
          }}
        />
      </DeckGL>

      {/* Unified Top Bar: zero overlap across mobile & desktop */}
      <div className="absolute top-3 inset-x-3 md:top-4 md:left-4 md:right-4 flex items-center justify-between gap-2 pointer-events-none z-[100]">
        <div className="pointer-events-auto flex items-center gap-2 min-w-0">
          {onReturnToPortal && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playUiClick();
                onReturnToPortal();
              }}
              aria-label="Retourner au portail de présentation"
              className="min-h-11 flex items-center gap-2 bg-zinc-950/95 hover:bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-[11px] uppercase font-bold tracking-wider px-3.5 rounded-lg shadow-xl cursor-pointer hover:border-red-500/60 transition-colors backdrop-blur-md whitespace-nowrap shrink-0"
            >
              <LayoutDashboard className="w-4 h-4 text-red-500 shrink-0" />
              <span className="sm:hidden">Portail</span>
              <span className="hidden sm:inline">Portail Présentation</span>
            </button>
          )}
        </div>

        <div className="pointer-events-auto flex items-center bg-zinc-950/95 border border-zinc-800 rounded-lg shadow-xl overflow-hidden shrink-0 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              soundEngine.playUiClick();
              setMapMode('night');
            }}
            aria-label="Mode Nuit"
            aria-pressed={mapMode === 'night'}
            className={`min-h-11 min-w-11 flex items-center justify-center transition-colors duration-200 cursor-pointer ${mapMode === 'night' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}
            title="Mode Nuit"
          >
            <Moon className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-5 bg-zinc-800" />
          <button
            type="button"
            onClick={() => {
              soundEngine.playUiClick();
              setMapMode('day');
            }}
            aria-label="Mode Jour"
            aria-pressed={mapMode === 'day'}
            className={`min-h-11 min-w-11 flex items-center justify-center transition-colors duration-200 cursor-pointer ${mapMode === 'day' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}
            title="Mode Jour"
          >
            <Sun className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-5 bg-zinc-800" />
          <button
            type="button"
            onClick={() => {
              soundEngine.playUiClick();
              setMapMode('satellite');
            }}
            aria-label="Mode Satellite"
            aria-pressed={mapMode === 'satellite'}
            className={`min-h-11 min-w-11 flex items-center justify-center transition-colors duration-200 cursor-pointer ${mapMode === 'satellite' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}
            title="Mode Satellite"
          >
            <Globe className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-5 bg-zinc-800" />
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? "Désactiver les effets sonores" : "Activer les effets sonores"}
            aria-pressed={soundEnabled}
            className={`min-h-11 min-w-11 flex items-center justify-center transition-colors duration-200 cursor-pointer ${soundEnabled ? 'bg-zinc-800/80 text-emerald-400 hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
            title={soundEnabled ? "Effets sonores activés" : "Effets sonores coupés"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="w-[1px] h-5 bg-zinc-800" />
          <button
            type="button"
            onClick={() => {
              soundEngine.playUiClick();
              handleOpenConfig();
            }}
            aria-label="Configuration Cartographie et Mapbox"
            aria-expanded={isConfigOpen}
            className={`min-h-11 min-w-11 flex items-center justify-center transition-colors duration-200 relative cursor-pointer ${isConfigOpen || mapProvider === 'mapbox' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}
            title="Configuration Cartographie & Mapbox"
          >
            <Sliders className="w-4 h-4" />
            {mapProvider === 'mapbox' && mapboxToken.trim() && (
              <span className="sr-only">Mapbox actif</span>
            )}
          </button>
        </div>
      </div>

      {/* Mode hors-ligne ou alerte tuiles discrète (non bloquante) */}
      {(isOffline || mapErrorMsg) && (
        <div
          role={isOffline ? 'status' : 'alert'}
          className={`absolute top-[4.75rem] left-3 right-3 md:left-4 md:right-auto md:max-w-md z-[95] px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2 shadow-xl backdrop-blur-md border ${
            isOffline
              ? 'bg-zinc-900/90 border-sky-700/60 text-sky-200'
              : 'bg-amber-950/90 border-amber-800/70 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className={`w-4 h-4 shrink-0 ${isOffline ? 'text-sky-400' : 'text-amber-400'}`} />
            <span className="truncate">
              {isOffline
                ? 'Mode hors-ligne actif — fond vectoriel continental & calcul complet disponibles.'
                : mapErrorMsg}
            </span>
          </div>
          {mapErrorMsg && (
            <button
              type="button"
              onClick={() => setMapErrorMsg(null)}
              aria-label="Fermer la notification cartographique"
              className="min-h-8 min-w-8 flex items-center justify-center text-zinc-300 hover:text-white shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Modal interactif de configuration Cartographie & Mapbox */}
      <AnimatePresence>
        {isConfigOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="map-config-title"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* En-tête du panneau modal */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/90">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 id="map-config-title" className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Configuration Cartographie</h3>
                    <p className="text-xs text-zinc-400">Sélection du fournisseur et des styles vectoriels</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConfigOpen(false)}
                  aria-label="Fermer la configuration cartographique"
                  className="min-h-11 min-w-11 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contenu paramétrable */}
              <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Sélecteur de fournisseur */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Fournisseur de Fond de Carte</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setProviderInput('free')}
                      className={`p-3 rounded-lg border text-left transition-all ${providerInput === 'free' ? 'border-blue-500/60 bg-blue-500/10 text-white shadow-sm' : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Fonds Libres (Gratuit)</span>
                        {providerInput === 'free' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-zinc-400">OpenFreeMap &amp; ESRI, sans clé API, zéro frais.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProviderInput('mapbox')}
                      className={`p-3 rounded-lg border text-left transition-all ${providerInput === 'mapbox' ? 'border-blue-500/60 bg-blue-500/10 text-white shadow-sm' : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Mapbox HD Vectoriel</span>
                        {providerInput === 'mapbox' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-zinc-400">Styles vectoriels Dark v11, Streets, Satellite.</p>
                    </button>
                  </div>
                </div>

                {/* Paramétrage spécifique Mapbox */}
                {providerInput === 'mapbox' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3.5 pt-1"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-blue-400" />
                          Mapbox Access Token (public)
                        </label>
                        {mapboxToken && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-700/50 text-emerald-400 font-mono">
                            Token actif
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        placeholder="pk.eyJ1..."
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
                      />
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Vous pouvez aussi le renseigner de façon permanente via <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">VITE_MAPBOX_TOKEN</code> dans votre fichier <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">.env</code>.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1.5">
                        Style Mapbox personnalisé (optionnel)
                      </label>
                      <input
                        type="text"
                        value={customStyleInput}
                        onChange={(e) => setCustomStyleInput(e.target.value)}
                        placeholder="mapbox://styles/username/style-id"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
                      />
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Laissez vide pour utiliser les styles officiels Mapbox (Dark v11 en Nuit, Light v11 en Jour, Satellite Streets en Satellite).
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Message d'état et feedback */}
                {configFeedback && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>{configFeedback}</span>
                  </div>
                )}
              </div>

              {/* Pied de panneau avec actions de sauvegarde */}
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-zinc-800 bg-zinc-900/60">
                <button
                  type="button"
                  onClick={handleResetToFree}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Réinitialiser
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConfigOpen(false)}
                    className="px-3.5 py-1.5 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Appliquer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
