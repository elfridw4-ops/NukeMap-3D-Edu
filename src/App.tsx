import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { MapView } from './components/Map';
import {
  WEAPON_PRESETS,
  calculateBlastRadii,
  estimateClosestSeaDistanceKm,
  haversineKm,
  getSimulatedTimeSec,
  calculateTsunamiMetrics,
  calculateCasualtyReport,
  resolveVectorFlightProfile,
  computeMultiStrikeTimings,
  evaluateBallisticClock,
  ComputedStrikeTiming,
} from './lib/nuclearMath';
import { WeaponConfig, LaunchParams, EnvironmentParams, PastStrike, StrikeBallisticStatus } from './types';
import { fetchAutomaticGeoData, DEFAULT_AUTOMATIC_GEO_DATA, AutomaticGeoData } from './lib/geoDataFetcher';
import { RotateCcw } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { usePersistedState } from './lib/hooks';
import { PWAController } from './components/PWAController';
import { soundEngine } from './lib/soundEngine';
import { updateRuntimeSeoMetadata } from './lib/seo';

export default function App() {
  const [currentTab, setCurrentTab] = usePersistedState<'landing' | 'simulator'>('currentTab', 'landing');
  const [isSidebarOpen, setIsSidebarOpen] = usePersistedState('isSidebarOpen', true);
  const [weapon, setWeapon] = usePersistedState<WeaponConfig>('weapon', WEAPON_PRESETS[2]); // Default: Fat Man
  const [customYield, setCustomYield] = usePersistedState<number>('customYield', 100);
  const [target, setTarget] = usePersistedState<{ lng: number; lat: number } | null>('target', {
    lng: 2.3522, // Paris (Demonstration)
    lat: 48.8566
  });
  
  const [pastStrikes, setPastStrikes] = usePersistedState<PastStrike[]>('pastStrikes', []);
  const [multiStrikeMode, setMultiStrikeMode] = usePersistedState<boolean>('multiStrikeMode', false);

  const [origin, setOrigin] = usePersistedState<{ lng: number; lat: number } | null>('origin', null);
  const [selectionMode, setSelectionMode] = usePersistedState<'target' | 'origin'>('selectionMode', 'target');
  const [launchParams, setLaunchParams] = usePersistedState<LaunchParams>('launchParams', {
    altitudeKm: 1200,
    velocityMach: 19.6,
    vectorId: 'icbm',
    customSpeedKmh: 10000
  });

  const [environmentParams, setEnvironmentParams] = usePersistedState<EnvironmentParams>('environmentParams', {
    explosionType: 'airburst',
    windDirection: 90, // East default
    windSpeed: 20, // km/h
    showMushroomCloud: true,
    maritimeImpact: true,
    oceanDepthM: 2000,
    shoreDistanceKm: 143, // Paris default estimated
    beachSlopePct: 2.0,
    terrainDamping: 1.2, // Match Paris default roughness
    autoShoreDistance: true
  });

  const [simulationMode, setSimulationMode] = useState<'instant' | 'ballistic'>('instant');
  const [flightProgress, setFlightProgress] = useState<number>(0);
  // Message d'erreur balistique en ligne (remplace window.alert interdit en iframe)
  const [ballisticError, setBallisticError] = useState<string | null>(null);

  // Detonation propagation animation state variables
  const [detonationTimeMs, setDetonationTimeMs] = useState<number>(10000); // 10000 means fully stabilized/completed
  const [isDetonationAnimating, setIsDetonationAnimating] = useState<boolean>(false);
  const [isDetonationPaused, setIsDetonationPaused] = useState<boolean>(false);
  const launchAnimRef = useRef<number | null>(null);

  // État d'horloge unifiée pour les salves balistiques multi-cibles échelonnées selon la distance
  const [launchedTimings, setLaunchedTimings] = useState<ComputedStrikeTiming[]>([]);
  const [ballisticClockMs, setBallisticClockMs] = useState<number>(0);
  const [isBallisticRunning, setIsBallisticRunning] = useState<boolean>(false);
  const [isBallisticPaused, setIsBallisticPaused] = useState<boolean>(false);
  const ballisticClockRef = useRef<number>(0);
  const triggeredImpactsRef = useRef<Set<string>>(new Set());
  const triggeredGeigerRef = useRef<Set<string>>(new Set());
  const strikeAudioMetaRef = useRef<Record<string, { effectiveYield: number; isWater: boolean }>>({});

  // Controls for Propagation Chronology Controller HUD Drag & Drop and minimize/restore
  const [hudOffset, setHudOffset] = useState({ x: 0, y: 0 });
  const [isHudMinimized, setIsHudMinimized] = useState(false);
  const [hudMoving, setHudMoving] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posValX: number; posValY: number } | null>(null);

  // Mobile drawer state for Propagation Chronology
  const [isMobileHudOpen, setIsMobileHudOpen] = useState(false);
  // Conserve l'état du bottom sheet afin de positionner les actions flottantes au-dessus du panneau.
  const [isMobileSidebarCollapsed, setIsMobileSidebarCollapsed] = useState(false);

  // État persistant d'activation des effets sonores (Web Audio API)
  const [soundEnabled, setSoundEnabled] = usePersistedState<boolean>('soundEnabled', true);
  const hasMountedDetonationRef = useRef<boolean>(false);
  const runHasSoundRef = useRef<boolean>(false);
  const geigerPlayedForRunRef = useRef<boolean>(false);

  useEffect(() => {
    soundEngine.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Déverrouille AudioContext dès le premier geste utilisateur (phase capture avant les clics UI)
  useEffect(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    const handleGesture = () => {
      soundEngine.unlockFromGesture();
    };
    window.addEventListener('pointerdown', handleGesture, { passive: true, capture: true, once: true });
    window.addEventListener('keydown', handleGesture, { passive: true, capture: true, once: true });
    return () => {
      window.removeEventListener('pointerdown', handleGesture, { capture: true });
      window.removeEventListener('keydown', handleGesture, { capture: true });
    };
  }, [soundEnabled]);

  // Permet d'accéder directement au simulateur via ?autostart=1 sans passer par le portail
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        setCurrentTab('simulator');
      }
    }
  }, [setCurrentTab]);

  // Réinitialise l'erreur de portée dès qu'un paramètre balistique ou géométrique change
  useEffect(() => {
    setBallisticError(null);
  }, [target?.lat, target?.lng, origin?.lat, origin?.lng, launchParams.vectorId, launchParams.customRangeKm, simulationMode]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only handle left mouse button
    if (e.button !== 0) return;
    setHudMoving(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posValX: hudOffset.x,
      posValY: hudOffset.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!hudMoving || !dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      // Borne le déplacement du HUD dans les limites visibles du viewport
      const maxX = Math.max(0, window.innerWidth - 520);
      const minY = -Math.max(120, window.innerHeight - 360);
      const clampedX = Math.max(-240, Math.min(maxX, dragStartRef.current.posValX + dx));
      const clampedY = Math.max(minY, Math.min(90, dragStartRef.current.posValY + dy));
      setHudOffset({
        x: clampedX,
        y: clampedY
      });
    };

    const handleMouseUp = () => {
      setHudMoving(false);
    };

    if (hudMoving) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [hudMoving]);

  const cancelFlight = () => {
    if (launchAnimRef.current !== null) {
      cancelAnimationFrame(launchAnimRef.current);
      launchAnimRef.current = null;
    }
    setFlightProgress(0);
    setLaunchedTimings([]);
    setBallisticClockMs(0);
    ballisticClockRef.current = 0;
    setIsBallisticRunning(false);
    setIsBallisticPaused(false);
    triggeredImpactsRef.current.clear();
    triggeredGeigerRef.current.clear();
  };

  const triggerDetonation = (withSound: boolean = false) => {
    setDetonationTimeMs(0);
    setIsDetonationAnimating(true);
    setIsDetonationPaused(false);
    geigerPlayedForRunRef.current = false;
    runHasSoundRef.current = withSound;
    if (withSound) {
      const currentYield = weapon.id === 'custom' ? customYield : weapon.yieldKt;
      soundEngine.playDetonation(currentYield, weapon.weaponType, targetDetails.isWater);
    }
  };

  const [autoGeoData, setAutoGeoData] = useState<AutomaticGeoData>(DEFAULT_AUTOMATIC_GEO_DATA);

  const [targetDetails, setTargetDetails] = useState<{
    isWater: boolean;
    name?: string;
    country?: string;
    city?: string;
    detected: boolean;
    loading: boolean;
  }>({
    isWater: false,
    name: undefined,
    country: "France",
    city: "Paris",
    detected: true,
    loading: false
  });

  useEffect(() => {
    if (!target) return;

    const controller = new AbortController();
    const { signal } = controller;

    setTargetDetails(prev => ({ ...prev, loading: true }));
    setAutoGeoData(prev => ({ ...prev, loading: true, error: null }));

    const checkWater = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${target.lat}&lon=${target.lng}&zoom=10&extratags=1&namedetails=1`,
          {
            signal,
            headers: {
              'Accept': 'application/json'
            }
          }
        );
        if (!response.ok) throw new Error("HTTP error");
        const data = await response.json();

        let isWater = false;
        let address: any = {};
        let name = undefined;
        let country = "Inconnu";
        let city = "Zone Cible";

        if (data.error === "Unable to geocode") {
          isWater = true;
          name = "Océan / Haute Mer";
          setTargetDetails({
            isWater: true,
            name: "Océan / Haute Mer",
            detected: true,
            loading: false
          });
        } else {
          address = (data.address || {}) as any;
          const displayName = (data.display_name || "").toLowerCase();

          const waterKeys = ["ocean", "sea", "bay", "gulf", "strait", "lake", "river", "reservoir", "canal", "basin", "harbour", "waterway", "water_body", "lagoon", "fjord"];
          const hasWaterKey = waterKeys.some(key => key in address);
          const hasWaterInName = waterKeys.some(word => displayName.includes(word));

          // En l'absence de pays ou de région détectée, et si des mots caractérisant l'eau apparaissent, c'est de l'eau
          isWater = hasWaterKey || hasWaterInName || (!address.country && !address.city && !address.village);
          name = address.ocean || address.sea || address.bay || address.gulf || address.water || address.lake || address.river || data.name || (isWater ? "Zone Littorale / Aquatique" : undefined);
          country = address.country || "Inconnu";
          city = address.city || address.town || address.village || address.hamlet || address.suburb || "Zone Cible";

          setTargetDetails({
            isWater: !!isWater,
            name,
            country,
            city,
            detected: true,
            loading: false
          });
        }

        // Enrichissement automatique avec la réponse Nominatim complète (extratags.wikidata & recensement)
        try {
          const autoData = await fetchAutomaticGeoData(target.lat, target.lng, isWater, data, signal);
          setAutoGeoData(autoData);

          // Update environment params: match real physical terrain roughness automatically!
          setEnvironmentParams(prev => ({
            ...prev,
            terrainDamping: !isWater && autoData.roughnessCoef ? autoData.roughnessCoef : prev.terrainDamping,
            manningN: autoData.manningN,
            tropopauseAltitudeKm: autoData.tropopauseKm,
            windSpeed: autoData.windSpeedKmh,
            windDirection: autoData.windDirectionDeg,
            oceanDepthM: autoData.oceanDepthM ?? prev.oceanDepthM,
            shoreDistanceKm: prev.autoShoreDistance === false ? prev.shoreDistanceKm : (autoData.shoreDistanceKm ?? prev.shoreDistanceKm),
            beachSlopePct: autoData.beachSlopePct ?? prev.beachSlopePct
          }));
        } catch (err: any) {
          if (err?.name === 'AbortError') return;
          console.error("Failed to automatically enrich geodata:", err);
          setAutoGeoData(prev => ({ ...prev, loading: false, error: "Erreur topo/démographique" }));
        }

      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.warn("Failed to check water status:", error);
        setTargetDetails(prev => ({
          ...prev,
          detected: false,
          loading: false
        }));
        setAutoGeoData(prev => ({ ...prev, loading: false }));
      }
    };

    const timeoutId = setTimeout(() => {
      checkWater();
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [target?.lat, target?.lng]);

  useEffect(() => {
    if (!target) return;
    if (environmentParams.autoShoreDistance !== false) {
      const estimation = estimateClosestSeaDistanceKm(target.lat, target.lng);
      setEnvironmentParams(prev => ({
        ...prev,
        shoreDistanceKm: targetDetails.isWater ? 0 : (autoGeoData?.shoreDistanceKm ?? estimation.distanceKm)
      }));
    }
  }, [target?.lat, target?.lng, targetDetails.isWater, environmentParams.autoShoreDistance, autoGeoData?.shoreDistanceKm]);

  const [viewState, setViewState] = usePersistedState('viewState', {
    longitude: 2.3522,
    latitude: 48.8566,
    zoom: 10,
    pitch: 45,
    bearing: 0
  });

  // Nettoie tout état de caméra hérité contenant des champs internes DeckGL (width/maxBounds)
  useEffect(() => {
    const raw = viewState as any;
    if (raw && ('width' in raw || 'maxBounds' in raw || !Number.isFinite(raw.longitude) || !Number.isFinite(raw.latitude))) {
      setViewState({
        longitude: Number.isFinite(raw.longitude) && Math.abs(raw.longitude) < 179.5 ? raw.longitude : 2.3522,
        latitude: Number.isFinite(raw.latitude) ? raw.latitude : 48.8566,
        zoom: Number.isFinite(raw.zoom) ? raw.zoom : 10,
        pitch: Number.isFinite(raw.pitch) ? raw.pitch : 45,
        bearing: Number.isFinite(raw.bearing) ? raw.bearing : 0
      });
    }
  }, []);

  const handleSearchSelect = (lng: number, lat: number) => {
    setViewState(prev => ({
      ...prev,
      longitude: lng,
      latitude: lat,
      zoom: 10,
      transitionDuration: 1000
    }));
    cancelFlight();
    if (selectionMode === 'target') {
      setTarget({ lng, lat });
    } else {
      setOrigin({ lng, lat });
    }
  };

  const effectiveYield = weapon.id === 'custom' ? customYield : weapon.yieldKt;

  // Liste dédupliquée des cibles actives (alignée à 100 % avec les IDs de Map.tsx)
  const activeStrikeTargets = useMemo(() => {
    const list: Array<{ id: string; target: { lng: number; lat: number }; effectiveYield: number }> = [];
    if (target) {
      list.push({ id: 'current-target', target, effectiveYield });
    }
    if (multiStrikeMode && pastStrikes.length > 0) {
      pastStrikes.forEach((strike) => {
        if (!list.some((s) => s.target.lng === strike.target.lng && s.target.lat === strike.target.lat)) {
          list.push({ id: strike.id, target: strike.target, effectiveYield: strike.effectiveYield });
        }
      });
    }
    return list;
  }, [target, effectiveYield, multiStrikeMode, pastStrikes]);

  // États individuels (progress 0..1 & âge de détonation) calculés à chaque instant de l'horloge balistique
  const strikeBallisticStates = useMemo<Record<string, StrikeBallisticStatus> | undefined>(() => {
    if (simulationMode !== 'ballistic' || launchedTimings.length === 0) {
      return undefined;
    }
    return evaluateBallisticClock(launchedTimings, ballisticClockMs);
  }, [simulationMode, launchedTimings, ballisticClockMs]);

  const { minImpactAtMs, maxImpactAtMs, hasAnyBallisticImpact } = useMemo(() => {
    const active = launchedTimings.filter((t) => t.inRange);
    if (active.length === 0) {
      return { minImpactAtMs: 0, maxImpactAtMs: 0, hasAnyBallisticImpact: false };
    }
    const minMs = Math.min(...active.map((t) => t.impactAtMs));
    const maxMs = Math.max(...active.map((t) => t.impactAtMs));
    return {
      minImpactAtMs: minMs,
      maxImpactAtMs: maxMs,
      hasAnyBallisticImpact: ballisticClockMs >= minMs,
    };
  }, [launchedTimings, ballisticClockMs]);

  // Aperçu temps réel de la fenêtre de tir et du nombre d'impacts en cours pour la barre latérale
  const multiStrikeFlightSummary = useMemo(() => {
    if (simulationMode !== 'ballistic' || !origin || activeStrikeTargets.length === 0) {
      return undefined;
    }
    const profile = resolveVectorFlightProfile(launchParams);
    const computed = computeMultiStrikeTimings(origin, activeStrikeTargets, profile.speedKmh, profile.maxRangeKm);
    const inRangeDurations = computed.timings.filter((t) => t.inRange).map((t) => t.flightDurationMin);
    const minFlightMin = inRangeDurations.length > 0 ? Math.min(...inRangeDurations) : 0;
    const maxFlightMin = inRangeDurations.length > 0 ? Math.max(...inRangeDurations) : 0;
    const impactedCount = strikeBallisticStates
      ? Object.values<StrikeBallisticStatus>(strikeBallisticStates).filter((s) => s.inRange && s.detonationTimeMs !== null).length
      : 0;
    return {
      totalCount: computed.timings.length,
      inRangeCount: computed.inRangeCount,
      minFlightMin,
      maxFlightMin,
      impactedCount,
    };
  }, [simulationMode, origin, activeStrikeTargets, launchParams, strikeBallisticStates]);

  const startLaunchSequence = () => {
    if (!target || activeStrikeTargets.length === 0) return;
    setBallisticError(null);

    if (launchAnimRef.current !== null) {
      cancelAnimationFrame(launchAnimRef.current);
      launchAnimRef.current = null;
    }

    // En mode instantané ou sans origine définie, la détonation reste immédiate
    if (simulationMode === 'instant' || !origin) {
      setLaunchedTimings([]);
      setFlightProgress(1);
      triggerDetonation(true);
      return;
    }

    // Profil balistique canonique partagé entre la sidebar, la trajectoire 3D et le lancement
    const profile = resolveVectorFlightProfile(launchParams);
    const schedule = computeMultiStrikeTimings(origin, activeStrikeTargets, profile.speedKmh, profile.maxRangeKm);

    if (schedule.inRangeCount === 0) {
      soundEngine.playAlert();
      const nearestDist = Math.min(...schedule.timings.map((t) => t.distanceKm));
      setBallisticError(`Portée insuffisante : ${Math.round(nearestDist).toLocaleString('fr-FR')} km requis pour ${profile.maxRangeKm.toLocaleString('fr-FR')} km max.`);
      setFlightProgress(0);
      setLaunchedTimings([]);
      setIsBallisticRunning(false);
      return;
    }

    if (schedule.inRangeCount < schedule.timings.length) {
      const skipped = schedule.timings.length - schedule.inRangeCount;
      setBallisticError(`${skipped} cible(s) hors de portée max (${profile.maxRangeKm.toLocaleString('fr-FR')} km) exclue(s) du tir.`);
    }

    // Mémorise la puissance et la nature eau/terre de chaque ogive pour le déclenchement sonore échelonné
    const audioMeta: Record<string, { effectiveYield: number; isWater: boolean }> = {};
    activeStrikeTargets.forEach((s) => {
      audioMeta[s.id] = {
        effectiveYield: s.effectiveYield,
        isWater: s.id === 'current-target' ? targetDetails.isWater : false,
      };
    });
    strikeAudioMetaRef.current = audioMeta;

    triggeredImpactsRef.current.clear();
    triggeredGeigerRef.current.clear();
    ballisticClockRef.current = 0;

    setLaunchedTimings(schedule.timings);
    setBallisticClockMs(0);
    setFlightProgress(0.01);
    setDetonationTimeMs(0);
    setIsDetonationAnimating(false);
    setIsDetonationPaused(false);
    setIsBallisticPaused(false);
    setIsBallisticRunning(true);

    soundEngine.playMissileLaunch();
  };
  
  const radii = useMemo(() => calculateBlastRadii(effectiveYield, environmentParams.explosionType, environmentParams.manningN), [effectiveYield, environmentParams.explosionType, environmentParams.manningN]);

  const tsunamiMetrics = useMemo(() => {
    return calculateTsunamiMetrics(
      effectiveYield,
      environmentParams.oceanDepthM ?? 2000,
      environmentParams.shoreDistanceKm ?? 5,
      environmentParams.beachSlopePct ?? 2.0,
      environmentParams.terrainDamping ?? 1.5,
      targetDetails.isWater,
      environmentParams.coastalDepthM ?? 8,
      environmentParams.manningN ?? 0.050
    );
  }, [effectiveYield, environmentParams, targetDetails.isWater]);

  const casualtyReport = useMemo(() => {
    if (!target) return undefined;
    return calculateCasualtyReport(
      target.lat,
      target.lng,
      radii,
      weapon.weaponType as any,
      autoGeoData
    );
  }, [target, radii, weapon.weaponType, autoGeoData]);

  // Horloge unifiée de vol + détonations échelonnées en mode balistique
  useEffect(() => {
    if (simulationMode !== 'ballistic' || !isBallisticRunning || isBallisticPaused || launchedTimings.length === 0) {
      return;
    }

    const activeTimings = launchedTimings.filter((t) => t.inRange);
    if (activeTimings.length === 0) {
      setIsBallisticRunning(false);
      return;
    }

    const firstImpact = Math.min(...activeTimings.map((t) => t.impactAtMs));
    const lastImpact = Math.max(...activeTimings.map((t) => t.impactAtMs));
    const totalEndMs = lastImpact + 10000;

    let animId: number;
    let lastTime = performance.now();

    const step = () => {
      const now = performance.now();
      const dt = Math.min(100, Math.max(0, now - lastTime));
      lastTime = now;

      const nextClock = Math.min(totalEndMs, ballisticClockRef.current + dt);
      ballisticClockRef.current = nextClock;

      // Déclenche individuellement le son et les retombées Geiger de chaque ogive au moment réel de son impact
      for (const item of activeTimings) {
        if (nextClock >= item.impactAtMs && !triggeredImpactsRef.current.has(item.id)) {
          triggeredImpactsRef.current.add(item.id);
          const meta = strikeAudioMetaRef.current[item.id];
          soundEngine.playDetonation(meta?.effectiveYield ?? effectiveYield, weapon.weaponType, meta?.isWater ?? false);
        }
        if (
          environmentParams.explosionType === 'surface' &&
          nextClock >= item.impactAtMs + 5000 &&
          !triggeredGeigerRef.current.has(item.id)
        ) {
          triggeredGeigerRef.current.add(item.id);
          soundEngine.playGeigerBurst(6);
        }
      }

      setBallisticClockMs(nextClock);
      setFlightProgress(lastImpact > 0 ? Math.min(1, nextClock / lastImpact) : 1);
      setDetonationTimeMs(nextClock >= firstImpact ? Math.min(10000, nextClock - firstImpact) : 0);

      if (nextClock >= totalEndMs) {
        setIsBallisticRunning(false);
        return;
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [simulationMode, isBallisticRunning, isBallisticPaused, launchedTimings, effectiveYield, weapon.weaponType, environmentParams.explosionType]);

  // Play/Pause/Replay detonation animation loop that drives the map overlays in instant / fallback mode
  useEffect(() => {
    if (simulationMode === 'ballistic' && launchedTimings.length > 0) return;
    if (!isDetonationAnimating || isDetonationPaused) return;

    let animId: number;
    let lastTime = performance.now();

    const frame = () => {
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;

      setDetonationTimeMs(prev => {
        const next = prev + dt;
        if (
          next >= 5000 &&
          !geigerPlayedForRunRef.current &&
          runHasSoundRef.current &&
          environmentParams.explosionType === 'surface'
        ) {
          geigerPlayedForRunRef.current = true;
          soundEngine.playGeigerBurst(7);
        }
        if (next >= 10000) {
          setIsDetonationAnimating(false);
          return 10000;
        }
        return next;
      });

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [simulationMode, launchedTimings.length, isDetonationAnimating, isDetonationPaused, environmentParams.explosionType]);

  // Automatically trigger detonation in instant mode when relevant inputs change to restart the animation
  useEffect(() => {
    if (simulationMode === 'instant' && target) {
      const shouldPlayAudio = hasMountedDetonationRef.current;
      hasMountedDetonationRef.current = true;
      triggerDetonation(shouldPlayAudio);
    } else {
      hasMountedDetonationRef.current = true;
    }
  }, [target?.lat, target?.lng, weapon.id, customYield, environmentParams.explosionType, simulationMode]);

  // Calculation of the simulated real elapsed time T under physical scaling
  const simulatedTimeSec = useMemo(() => {
    return getSimulatedTimeSec(detonationTimeMs, effectiveYield);
  }, [detonationTimeMs, effectiveYield]);

  // Get active physical event description based on exact Glasstone & Dolan yield scaling
  const activePhysicalStatus = useMemo(() => {
    const scaleFactor = Math.pow(effectiveYield / 50000, 1 / 3);
    const t = detonationTimeMs;

    if (t < 80) {
      return {
        title: "⚡ Éclair Gamma & Thermique",
        desc: `Flash ultraviolet et gamma instantané (vitesse de la lumière). Impulsion X de haute énergie brûlant la rétine jusqu'à ${Math.round(220 * scaleFactor)} km.`,
        colorClass: "text-white"
      };
    }
    if (t < 800) {
      return {
        title: "🔥 Lobe Plasmatique & Boule de feu",
        desc: `Dôme de plasma thermo-ionisé en extension ultra-rapide. Taille maximale atteinte : ~${(3.5 * scaleFactor).toFixed(2)} km de rayon. Température interne de plusieurs millions de degrés (vaporisation du sol).`,
        colorClass: "text-orange-400 animate-pulse"
      };
    }
    if (t < 1400) {
      return {
        title: "💨 Souffle Dévastateur (Zone Initiale)",
        desc: `Onde de choc barométrique supersonique se propageant au-delà du dôme plasmatique. Balayage intensif de la zone critique (~${Math.round(12 * scaleFactor)} km, surpression critique de 20 psi).`,
        colorClass: "text-red-400"
      };
    }
    if (t < 2000) {
      return {
        title: "💨 Frange Barométrique Moyenne",
        desc: `Onde de surpression destructrice traversant l'anneau des ${Math.round(26 * scaleFactor)} km (surpression de 5 psi, effondrement des structures résidentielles).`,
        colorClass: "text-amber-500"
      };
    }
    if (t < 3000) {
      return {
        title: "💨 Onde Barométrique Périphérique",
        desc: `Onde de surpression de faible intensité balayant la frange des ${Math.round(77 * scaleFactor)} km (décélération graduelle vers la vitesse du son standard de 340 m/s).`,
        colorClass: "text-yellow-400"
      };
    }
    if (t < 5000) {
      return {
        title: "☁️ Ascension Convective & Dépression",
        desc: `Vide thermique de post-explosion agissant comme cheminée convective géante. Début d'aspiration des poussières et des débris brûlés pour former la tige du champignon.`,
        colorClass: "text-indigo-400"
      };
    }
    if (t < 8000) {
      return {
        title: "☁️ Stabilisation du Champignon",
        desc: `Le panache radioactif surchauffé atteint la stratosphère (~${Math.round(67 * scaleFactor)} km d'altitude de référence) et commence son évasement horizontal complet.`,
        colorClass: "text-zinc-300"
      };
    }
    return {
      title: "☣️ Dispersion des Retombées (Fallout)",
      desc: `Refroidissement des radioisotopes et retombées ionisantes locales emportées par les vents dominants de moyenne altitude, formant la plume de contamination active.`,
      colorClass: "text-emerald-400"
    };
  }, [detonationTimeMs, effectiveYield]);

  const isBallisticSalvoMode = simulationMode === 'ballistic' && launchedTimings.length > 0;
  const hudDurationMs = isBallisticSalvoMode
    ? Math.max(10000, (maxImpactAtMs - minImpactAtMs) + 10000)
    : 10000;
  const hudTimeMs = isBallisticSalvoMode
    ? Math.max(0, Math.min(hudDurationMs, ballisticClockMs - minImpactAtMs))
    : detonationTimeMs;
  const isHudCompleted = hudTimeMs >= hudDurationMs;
  const isHudPlaying = isBallisticSalvoMode ? (isBallisticRunning && !isBallisticPaused) : isDetonationAnimating;
  const isHudPaused = isBallisticSalvoMode ? isBallisticPaused : isDetonationPaused;

  const replayHudSequence = () => {
    if (isBallisticSalvoMode) {
      triggeredImpactsRef.current.clear();
      triggeredGeigerRef.current.clear();
      ballisticClockRef.current = 0;
      setBallisticClockMs(0);
      setFlightProgress(0.01);
      setDetonationTimeMs(0);
      setIsBallisticPaused(false);
      setIsBallisticRunning(true);
      soundEngine.playMissileLaunch();
    } else {
      triggerDetonation(true);
    }
  };

  const toggleHudPlayPause = () => {
    if (isHudCompleted) {
      replayHudSequence();
      return;
    }
    soundEngine.playUiClick();
    if (isBallisticSalvoMode) {
      setIsBallisticPaused((prev) => !prev);
      if (!isBallisticRunning) {
        setIsBallisticRunning(true);
      }
    } else {
      setIsDetonationPaused((prev) => !prev);
      if (!isDetonationAnimating) {
        setIsDetonationAnimating(true);
      }
    }
  };

  const scrubHudTimeline = (newVal: number) => {
    if (isBallisticSalvoMode) {
      const newClock = minImpactAtMs + newVal;
      ballisticClockRef.current = newClock;
      setBallisticClockMs(newClock);
      setFlightProgress(maxImpactAtMs > 0 ? Math.min(1, newClock / maxImpactAtMs) : 1);
      setDetonationTimeMs(Math.min(10000, newVal));
      setIsBallisticPaused(true);
      if (!isBallisticRunning && newClock < maxImpactAtMs + 10000) {
        setIsBallisticRunning(true);
      }
    } else {
      setDetonationTimeMs(newVal);
      setIsDetonationPaused(true);
      if (!isDetonationAnimating) {
        setIsDetonationAnimating(true);
      }
    }
  };

  // Si on est en mode balistique, on reset le vol lorsqu'on bascule
  const handleModeSwitch = (mode: 'instant' | 'ballistic') => {
    setSimulationMode(mode);
    cancelFlight();
    if (mode === 'instant') {
      setSelectionMode('target');
      setDetonationTimeMs(0);
      setIsDetonationAnimating(true);
      setIsDetonationPaused(false);
    } else {
      setDetonationTimeMs(10000); // Start as completed in ballistic until launch finishes
    }
  };

  const isDetonated = simulationMode === 'instant' || (isBallisticSalvoMode ? hasAnyBallisticImpact : flightProgress === 1);

  // Calcule l'opacité maximale du flash gamma en tenant compte des impacts échelonnés
  const gammaFlashOpacity = useMemo(() => {
    if (!target) return 0;
    if (simulationMode === 'ballistic' && strikeBallisticStates) {
      let maxOpacity = 0;
      for (const st of Object.values<StrikeBallisticStatus>(strikeBallisticStates)) {
        if (st.inRange && st.detonationTimeMs !== null && st.detonationTimeMs < 80) {
          const op = st.detonationTimeMs < 40
            ? st.detonationTimeMs / 40
            : Math.max(0, 1 - (st.detonationTimeMs - 40) / 40);
          if (op > maxOpacity) maxOpacity = op;
        }
      }
      return maxOpacity;
    }
    if (isDetonated && detonationTimeMs < 80) {
      return detonationTimeMs < 40
        ? detonationTimeMs / 40
        : Math.max(0, 1 - (detonationTimeMs - 40) / 40);
    }
    return 0;
  }, [target, simulationMode, strikeBallisticStates, isDetonated, detonationTimeMs]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setEnabled(next);
    if (next) {
      soundEngine.playUiClick();
    }
  };

  if (currentTab === 'landing') {
    return <LandingPage onLaunchSimulator={() => {
      soundEngine.playUiClick();
      setCurrentTab('simulator');
    }} />;
  }

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden font-sans text-zinc-100 flex flex-col md:flex-row">
      <Sidebar 
        weapon={weapon}
        setWeapon={setWeapon}
        customYield={customYield}
        setCustomYield={setCustomYield}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        origin={origin}
        setOrigin={(nextOrigin) => {
          cancelFlight();
          setOrigin(nextOrigin);
        }}
        target={target}
        launchParams={launchParams}
        setLaunchParams={setLaunchParams}
        environmentParams={environmentParams}
        setEnvironmentParams={setEnvironmentParams}
        onSearch={handleSearchSelect}
        radii={radii}
        simulationMode={simulationMode}
        setSimulationMode={handleModeSwitch}
        onLaunchMissile={startLaunchSequence}
        flightProgress={flightProgress}
        targetDetails={targetDetails}
        autoGeoData={autoGeoData}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        multiStrikeMode={multiStrikeMode}
        setMultiStrikeMode={(nextMode) => {
          cancelFlight();
          setMultiStrikeMode(nextMode);
        }}
        pastStrikesCount={pastStrikes.length}
        onClearPastStrikes={() => {
          cancelFlight();
          setPastStrikes([]);
        }}
        casualtyReport={casualtyReport}
        onMobileCollapsedChange={setIsMobileSidebarCollapsed}
        ballisticError={ballisticError}
        onClearBallisticError={() => setBallisticError(null)}
        multiStrikeFlightSummary={multiStrikeFlightSummary}
      />

      {/* Sidebar Toggle Handle for Desktop */}
      <button 
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Masquer le panneau latéral" : "Afficher le panneau latéral"}
        className="fixed top-1/2 z-50 w-6 h-12 bg-zinc-900 border border-zinc-800 rounded-r-lg flex items-center justify-center transition-all duration-300 shadow-xl text-zinc-400 hover:text-white text-xs font-mono font-bold hidden md:flex -translate-y-1/2 cursor-pointer"
        style={{ left: isSidebarOpen ? '300px' : '0px' }}
        title={isSidebarOpen ? "Masquer le panneau latéral (Sidebar)" : "Afficher le panneau latéral (Sidebar)"}
      >
        {isSidebarOpen ? '◀' : '▶'}
      </button>

      <main className="relative flex-1 h-full z-0 overflow-hidden">
        <MapView 
          multiStrikeMode={multiStrikeMode}
          target={target} 
          origin={origin}
          radii={radii}
          environmentParams={environmentParams}
          effectiveYield={effectiveYield}
          tsunamiMetrics={tsunamiMetrics}
          viewState={viewState}
          setViewState={setViewState}
          simulationMode={simulationMode}
          flightProgress={flightProgress}
          launchParams={launchParams}
          targetDetails={targetDetails}
          detonationTimeMs={detonationTimeMs}
          isDetonationAnimating={isDetonationAnimating}
          isDetonationPaused={isDetonationPaused}
          pastStrikes={pastStrikes}
          strikeBallisticStates={strikeBallisticStates}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onReturnToPortal={() => setCurrentTab('landing')}
          onMapClick={(lng, lat) => {
            cancelFlight();
            soundEngine.playTargetLock(selectionMode);
            if (selectionMode === 'target') {
              if (multiStrikeMode && target) {
                setPastStrikes(prev => [...prev, {
                  id: Math.random().toString(36).substring(7),
                  target: { ...target },
                  radii: { ...radii },
                  effectiveYield: effectiveYield
                }]);
              }
              setTarget({ lng, lat });
            } else {
              setOrigin({ lng, lat });
            }
          }} 
        />
        
        {/* FLASH GAMMA INTEGRATED SCREEN-SPACE ANIMATED FLASH */}
        {gammaFlashOpacity > 0 && (
          <div 
            className="fixed inset-0 bg-white pointer-events-none z-50 transition-opacity duration-75"
            style={{ opacity: gammaFlashOpacity }}
          />
        )}

        {/* NC-77 TARGET PROPAGATION CHRONOLOGY CONTROLLER HUD (Desktop-Only Draggable & Minimizable) */}
        {target && isDetonated && (
          <div 
            className={`hidden md:flex absolute bottom-28 ${isSidebarOpen ? 'left-[320px]' : 'left-4'} z-20 w-[460px] max-w-[calc(100vw-2rem)] bg-zinc-950/90 border border-zinc-800/80 p-3.5 px-4 rounded-xl shadow-2xl backdrop-blur-xl flex-col gap-2 transition-[opacity,left] duration-300`}
            style={{
              transform: `translate(${hudOffset.x}px, ${hudOffset.y}px)`,
              userSelect: hudMoving ? 'none' : 'auto'
            }}
          >
            <div 
              className="flex items-center justify-between gap-4 border-b border-zinc-800/60 pb-2 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              title="Cliquer et glisser pour déplacer"
            >
              <div className="flex items-center gap-1.5 font-bold font-mono text-[9px] tracking-widest text-zinc-400">
                <span className={`inline-flex rounded-full h-2 w-2 ${isHudPlaying ? 'bg-red-500' : 'bg-emerald-500'}`} />
                SIMULATEUR DE PROPAGATION CHRONOLOGIQUE
              </div>
              <div className="flex items-center gap-2">
                <div className="font-mono tabular-nums text-xs font-bold text-red-400 bg-red-950/20 px-2 py-0.5 rounded border border-red-900/40 select-text">
                  T+{simulatedTimeSec < 60 
                    ? `${simulatedTimeSec.toFixed(2)}s` 
                    : simulatedTimeSec < 3600 
                      ? `${Math.floor(simulatedTimeSec / 60)}m ${(simulatedTimeSec % 60).toFixed(0)}s` 
                      : `${Math.floor(simulatedTimeSec / 3600)}h ${Math.floor((simulatedTimeSec % 3600) / 60)}m`
                  }
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsHudMinimized(!isHudMinimized);
                  }}
                  aria-label={isHudMinimized ? "Restaurer le contrôleur de propagation" : "Réduire le contrôleur de propagation"}
                  className="p-1 px-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 font-mono text-xs text-zinc-400 hover:text-white transition-all w-7 h-7 flex items-center justify-center cursor-pointer"
                  title={isHudMinimized ? "Restaurer" : "Réduire"}
                >
                  {isHudMinimized ? '□' : '—'}
                </button>
              </div>
            </div>

            {!isHudMinimized && (
              <>
                {/* Timing Control Slider and Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleHudPlayPause}
                    className="p-1.5 px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors shrink-0 flex items-center justify-center border border-zinc-700/50 cursor-pointer"
                    style={{ width: '76px' }}
                  >
                    {isHudCompleted ? (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Rejouer</span>
                    ) : isHudPaused ? (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Play</span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Pause</span>
                    )}
                  </button>

                  <div className="flex-1 flex items-center">
                    <input 
                      type="range" 
                      min="0" 
                      max={Math.round(hudDurationMs)} 
                      aria-label="Chronologie de la détonation"
                      value={Math.round(hudTimeMs)} 
                      onChange={(e) => scrubHudTimeline(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-zinc-800 accent-red-500 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={replayHudSequence}
                    aria-label="Recommencer la détonation"
                    className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors shrink-0 border border-zinc-700/50 flex items-center justify-center cursor-pointer"
                    title="Recommencer la détonation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Simulated Phase Badge */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-400">Statut physique :</span>
                    <span className={`font-bold uppercase ${activePhysicalStatus.colorClass}`}>
                      {activePhysicalStatus.title}
                    </span>
                  </div>
                  
                  <div className="text-[11px] text-zinc-300 bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-lg leading-relaxed font-sans shadow-inner">
                    {activePhysicalStatus.desc}
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-zinc-400 font-mono tabular-nums">
                    <span>Vitesse d'animation compressée</span>
                    <span className="font-semibold text-zinc-300">
                      {!isHudCompleted ? `${(hudTimeMs / 1000).toFixed(2)}s / ${(hudDurationMs / 1000).toFixed(2)}s` : "ÉQUILIBRE REJOINT"}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Mobile Docked Action & Compact Telemetry Bar directly above the bottom sheet */}
        {target && isDetonated && (
          <div
            className={`fixed ${isMobileSidebarCollapsed ? 'bottom-[6.25rem]' : 'bottom-[calc(55dvh+0.75rem)]'} inset-x-3 z-20 flex items-end justify-between gap-2 pointer-events-none md:hidden transition-all duration-300`}
          >
            {/* Compact Impact Telemetry Pill-Free Card (left) */}
            <div className="bg-zinc-950/90 backdrop-blur-md border border-zinc-800 px-3 py-2 rounded-xl shadow-xl min-w-0 max-w-[calc(100%-11.5rem)] flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span className="text-[10px] font-bold text-red-400 tracking-wider uppercase truncate">
                  {weapon.name} ({effectiveYield >= 1000 ? `${effectiveYield / 1000} Mt` : `${effectiveYield} kt`})
                </span>
              </div>
              <span className="text-[10px] font-mono tabular-nums text-zinc-300 truncate">
                {target.lat.toFixed(3)}°, {target.lng.toFixed(3)}°
              </span>
            </div>

            {/* Mobile Propagation Toggle Trigger Button (right) */}
            <button
              type="button"
              onClick={() => setIsMobileHudOpen(true)}
              aria-label="Ouvrir le contrôleur de chronologie de propagation"
              className="pointer-events-auto min-h-11 bg-zinc-950/95 border border-zinc-800 hover:border-red-500 text-white font-bold px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-[10px] font-mono tracking-wider uppercase active:scale-95 transition-all cursor-pointer backdrop-blur-md shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>Chronologie</span>
            </button>
          </div>
        )}

        {/* Mobile Propagation Drawer Overlay/Bottom Sheet */}
        {target && isDetonated && isMobileHudOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center md:hidden">
            {/* Tap outside to close helper */}
            <div className="absolute inset-0" onClick={() => setIsMobileHudOpen(false)} />
            
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Contrôleur de simulation de propagation"
              className="relative w-full max-h-[45dvh] bg-zinc-950 border-t border-zinc-800 rounded-t-2xl p-5 flex flex-col gap-4 overflow-y-auto shadow-2xl z-10 font-sans"
            >
              <div className="flex flex-col gap-1 shrink-0">
                <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto" />
                <div className="flex items-center justify-between mt-1 pb-2 border-b border-zinc-900 gap-2">
                  <div className="flex items-center gap-1.5 font-bold font-mono text-[10px] tracking-wider text-zinc-300">
                    <span className={`inline-flex rounded-full h-2 w-2 ${isHudPlaying ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    PROPAGATION
                  </div>
                  <div className="font-mono tabular-nums text-xs font-bold text-red-400 bg-red-950/20 px-2 py-0.5 rounded border border-red-900/40">
                    T+{simulatedTimeSec < 60 
                      ? `${simulatedTimeSec.toFixed(2)}s` 
                      : simulatedTimeSec < 3600 
                        ? `${Math.floor(simulatedTimeSec / 60)}m ${(simulatedTimeSec % 60).toFixed(0)}s` 
                        : `${Math.floor(simulatedTimeSec / 3600)}h ${Math.floor((simulatedTimeSec % 3600) / 60)}m`
                    }
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsMobileHudOpen(false)}
                    aria-label="Fermer la chronologie"
                    className="min-h-11 min-w-11 text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 text-xs rounded-lg font-mono font-bold cursor-pointer flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Timing Slider on Mobile */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={toggleHudPlayPause}
                  className="min-h-11 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors shrink-0 text-[10px] font-mono font-bold cursor-pointer"
                >
                  {isHudCompleted ? "REJOUER" : isHudPaused ? "PLAY" : "PAUSE"}
                </button>

                <div className="flex-1 flex items-center">
                  <input 
                    type="range" 
                    min="0" 
                    max={Math.round(hudDurationMs)} 
                    aria-label="Curseur temporel de détonation"
                    value={Math.round(hudTimeMs)} 
                    onChange={(e) => scrubHudTimeline(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-zinc-800 accent-red-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={replayHudSequence}
                  aria-label="Recommencer la détonation"
                  className="min-h-11 min-w-11 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Status information on Mobile */}
              <div className="flex flex-col gap-1.5 mt-1 overflow-y-auto">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-400 font-medium font-sans">Statut physique :</span>
                  <span className={`font-bold uppercase ${activePhysicalStatus.colorClass}`}>
                    {activePhysicalStatus.title}
                  </span>
                </div>
                
                <div className="text-[11px] text-zinc-300 bg-zinc-900/50 border border-zinc-800 p-2.5 rounded-lg leading-relaxed font-sans shrink-0">
                  {activePhysicalStatus.desc}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop UI Overlay info */}
        {target && isDetonated && (
          <div className="hidden md:flex absolute bottom-10 right-4 z-10 bg-zinc-950/85 backdrop-blur-lg border border-zinc-800/80 p-4 rounded-xl shadow-2xl pointer-events-none flex-col gap-3 w-max">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-red-500 tracking-wider">IMPACT CONFIRMÉ</span>
                <span className="text-xs text-zinc-300 font-medium tabular-nums">
                  {weapon.name} ({effectiveYield >= 1000 ? `${effectiveYield / 1000} Mt` : `${effectiveYield} kt`})
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-800/60 flex flex-col gap-1 text-[10px] font-mono tabular-nums text-zinc-400 uppercase">
              <div className="flex justify-between items-center gap-4">
                <span>Trg:</span>
                <span className="text-zinc-200">[{target.lat.toFixed(4)}°, {target.lng.toFixed(4)}°]</span>
              </div>
              {origin && (
                <div className="flex justify-between items-center gap-4">
                  <span>Org:</span>
                  <span className="text-zinc-200">[{origin.lat.toFixed(4)}°, {origin.lng.toFixed(4)}°]</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <PWAController />
    </div>
  );
}

