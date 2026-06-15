import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { MapView } from './components/Map';
import { WEAPON_PRESETS, calculateBlastRadii, estimateClosestSeaDistanceKm, haversineKm, flightTimeMin, getSimulatedTimeSec, formatSimulatedTime, calculateTsunamiMetrics, calculateCasualtyReport } from './lib/nuclearMath';
import { WeaponConfig, LaunchParams, EnvironmentParams, PastStrike } from './types';
import { fetchAutomaticGeoData, DEFAULT_AUTOMATIC_GEO_DATA, AutomaticGeoData } from './lib/geoDataFetcher';
import { Play, Pause, RotateCcw, LayoutDashboard, Compass } from 'lucide-react';
import { LandingPage } from './components/LandingPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'simulator'>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [weapon, setWeapon] = useState<WeaponConfig>(WEAPON_PRESETS[2]); // Default: Fat Man
  const [customYield, setCustomYield] = useState<number>(100);
  const [target, setTarget] = useState<{ lng: number; lat: number } | null>({
    lng: 2.3522, // Paris (Demonstration)
    lat: 48.8566
  });
  
  const [pastStrikes, setPastStrikes] = useState<PastStrike[]>([]);
  const [multiStrikeMode, setMultiStrikeMode] = useState<boolean>(false);

  const [origin, setOrigin] = useState<{ lng: number; lat: number } | null>(null);
  const [selectionMode, setSelectionMode] = useState<'target' | 'origin'>('target');
  const [launchParams, setLaunchParams] = useState<LaunchParams>({
    altitudeKm: 1200,
    velocityMach: 19.6,
    vectorId: 'icbm',
    customSpeedKmh: 10000
  });

  const [environmentParams, setEnvironmentParams] = useState<EnvironmentParams>({
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

  // Detonation propagation animation state variables
  const [detonationTimeMs, setDetonationTimeMs] = useState<number>(10000); // 10000 means fully stabilized/completed
  const [isDetonationAnimating, setIsDetonationAnimating] = useState<boolean>(false);
  const [isDetonationPaused, setIsDetonationPaused] = useState<boolean>(false);
  const launchAnimRef = useRef<number | null>(null);

  // Controls for Propagation Chronology Controller HUD Drag & Drop and minimize/restore
  const [hudOffset, setHudOffset] = useState({ x: 0, y: 0 });
  const [isHudMinimized, setIsHudMinimized] = useState(false);
  const [hudMoving, setHudMoving] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posValX: number; posValY: number } | null>(null);

  // Mobile drawer state for Propagation Chronology
  const [isMobileHudOpen, setIsMobileHudOpen] = useState(false);

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
      setHudOffset({
        x: dragStartRef.current.posValX + dx,
        y: dragStartRef.current.posValY + dy
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
  };

  const triggerDetonation = () => {
    setDetonationTimeMs(0);
    setIsDetonationAnimating(true);
    setIsDetonationPaused(false);
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
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${target.lat}&lon=${target.lng}&zoom=11`,
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

        // Fetch our advanced automatic demographic and physical indicators
        try {
          const autoData = await fetchAutomaticGeoData(target.lat, target.lng, isWater, address);
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
            shoreDistanceKm: autoData.shoreDistanceKm ?? prev.shoreDistanceKm,
            beachSlopePct: autoData.beachSlopePct ?? prev.beachSlopePct
          }));
        } catch (err) {
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

  const [viewState, setViewState] = useState({
    longitude: 2.3522,
    latitude: 48.8566,
    zoom: 10,
    pitch: 45,
    bearing: 0
  });

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

  const startLaunchSequence = () => {
    if (!target) return;

    // S'assurer d'annuler tout vol ou animation balistique en arrière-plan
    if (launchAnimRef.current !== null) {
      cancelAnimationFrame(launchAnimRef.current);
      launchAnimRef.current = null;
    }

    // En mode instantané ou s'il n'y a pas d'origine, l'impact se produit immédiatement sans délai de trajectoire
    if (simulationMode === 'instant' || !origin) {
      setFlightProgress(1);
      triggerDetonation();
      return;
    }
    
    // Reset any previous sequence
    setFlightProgress(0.01);
    
    // Geodesic distance using Haversine formula
    const distKm = haversineKm(origin.lat, origin.lng, target.lat, target.lng);
    
    // Retrieve vehicle speed in km/h 
    let speedKmh = 24000;
    let maxRange = 13000;
    
    const vectorId = launchParams.vectorId || 'icbm';
    if (vectorId === 'icbm') {
      speedKmh = 24000;
      maxRange = 13000;
    } else if (vectorId === 'slbm') {
      speedKmh = 29000;
      maxRange = 12000;
    } else if (vectorId === 'bomber') {
      speedKmh = 1010;
      maxRange = 11000;
    } else if (vectorId === 'cruise') {
      speedKmh = 880;
      maxRange = 2500;
    } else if (vectorId === 'houthi') {
      speedKmh = 900;
      maxRange = 2000;
    } else if (vectorId === 'custom') {
      speedKmh = launchParams.customSpeedKmh || 10000;
      maxRange = 99999;
    }
    
    // Range capabilities verification
    if (distKm > maxRange) {
      alert(`⚠️ Portée insuffisante : Distance cible (${Math.round(distKm)} km) supérieure à la portée maximale du vecteur (${maxRange} km).`);
      setFlightProgress(0);
      return;
    }

    // Calculated flight time in minutes
    const fTime = flightTimeMin(distKm, speedKmh);
    
    // Map flight time to visual duration compressed between 4000ms & 6000ms
    // Short ranges/speeds are faster (~4000ms), long ranges are slower (~6000ms)
    const minTime = 5; // minutes
    const maxTime = 600; // minutes
    const ratio = Math.min(Math.max((fTime - minTime) / (maxTime - minTime), 0), 1);
    const durationMs = 4000 + ratio * 2000;
    
    const startTime = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = elapsed / durationMs;
      
      if (progress >= 1) {
        setFlightProgress(1); // Detonation triggers
        triggerDetonation(); // Start the dynamic detonation propagation animation
        launchAnimRef.current = null;
      } else {
        setFlightProgress(progress);
        launchAnimRef.current = requestAnimationFrame(animate);
      }
    };
    
    launchAnimRef.current = requestAnimationFrame(animate);
  };

  const effectiveYield = weapon.id === 'custom' ? customYield : weapon.yieldKt;
  
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

  // Play/Pause/Replay detonation animation loop that drives the map overlays
  useEffect(() => {
    if (!isDetonationAnimating || isDetonationPaused) return;

    let animId: number;
    let lastTime = performance.now();

    const frame = () => {
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;

      setDetonationTimeMs(prev => {
        const next = prev + dt;
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
  }, [isDetonationAnimating, isDetonationPaused]);

  // Automatically trigger detonation in instant mode when relevant inputs change to restart the animation
  useEffect(() => {
    if (simulationMode === 'instant' && target) {
      triggerDetonation();
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

  const isDetonated = simulationMode === 'instant' || flightProgress === 1;

  if (currentTab === 'landing') {
    return <LandingPage onLaunchSimulator={() => setCurrentTab('simulator')} />;
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
        setOrigin={setOrigin}
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
        setMultiStrikeMode={setMultiStrikeMode}
        pastStrikesCount={pastStrikes.length}
        onClearPastStrikes={() => setPastStrikes([])}
        casualtyReport={casualtyReport}
      />

      {/* Sidebar Toggle Handle for Desktop */}
      <button 
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-1/2 z-50 w-6 h-12 bg-zinc-900 border border-zinc-800 rounded-r-lg flex items-center justify-center transition-all duration-300 shadow-xl text-zinc-400 hover:text-white text-xs font-mono font-bold hidden md:flex -translate-y-1/2 cursor-pointer"
        style={{ left: isSidebarOpen ? '300px' : '0px' }}
        title={isSidebarOpen ? "Masquer le panneau latéral (Sidebar)" : "Afficher le panneau latéral (Sidebar)"}
      >
        {isSidebarOpen ? '◀' : '▶'}
      </button>

      <main className="relative flex-1 h-full z-0 overflow-hidden">
        {/* Floating tab selector to switch back to portal or review current mode */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-1.5 bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-805 text-zinc-100 font-mono text-[9px] uppercase font-bold tracking-widest py-1.5 px-3.5 rounded-lg shadow-xl cursor-pointer hover:border-red-500/50 transition-all duration-300 backdrop-blur-md"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-red-500" />
            Portail Présentation
          </button>
          <div className="bg-zinc-950/90 border border-zinc-805 text-zinc-400 font-mono text-[9px] uppercase font-bold tracking-widest py-1.5 px-3.5 rounded-lg shadow-xl flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            CONSOLE ACTIVE
          </div>
        </div>

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
          onMapClick={(lng, lat) => {
            cancelFlight();
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
        {target && isDetonated && detonationTimeMs < 80 && (
          <div 
            className="fixed inset-0 bg-white pointer-events-none z-50 transition-opacity duration-75"
            style={{ 
              opacity: detonationTimeMs < 40 
                ? detonationTimeMs / 40 
                : Math.max(0, 1 - (detonationTimeMs - 40) / 40)
            }}
          />
        )}

        {/* NC-77 TARGET PROPAGATION CHRONOLOGY CONTROLLER HUD */}
        {/* NC-77 TARGET PROPAGATION CHRONOLOGY CONTROLLER HUD (Desktop-Only Draggable & Minimizable) */}
        {target && isDetonated && (
          <div 
            className="hidden md:flex absolute bottom-28 left-[320px] z-20 w-[460px] bg-zinc-950/90 border border-zinc-800/80 p-3.5 px-4 rounded-xl shadow-2xl backdrop-blur-xl flex-col gap-2 transition-[opacity] duration-300"
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
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDetonationAnimating ? 'bg-red-400' : 'bg-green-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isDetonationAnimating ? 'bg-red-500' : 'bg-green-500'}`}></span>
                </span>
                SIMULATEUR DE PROPAGATION CHRONOLOGIQUE
              </div>
              <div className="flex items-center gap-2">
                <div className="font-mono text-xs font-bold text-red-400 bg-red-950/20 px-2 py-0.5 rounded border border-red-900/40 select-text">
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
                  className="p-1 px-1.5 rounded bg-zinc-900 border border-zinc-850 hover:border-zinc-700 font-mono text-xs text-zinc-400 hover:text-white transition-all w-6 h-6 flex items-center justify-center cursor-pointer"
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
                    onClick={() => {
                      if (detonationTimeMs >= 10000) {
                        setDetonationTimeMs(0);
                        setIsDetonationAnimating(true);
                        setIsDetonationPaused(false);
                      } else {
                        setIsDetonationPaused(!isDetonationPaused);
                        if (!isDetonationAnimating) {
                          setIsDetonationAnimating(true);
                        }
                      }
                    }}
                    className="p-1 px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors shrink-0 flex items-center justify-center border border-zinc-700/50 cursor-pointer"
                    style={{ width: '76px' }}
                  >
                    {detonationTimeMs >= 10000 ? (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Rejouer</span>
                    ) : isDetonationPaused ? (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Play</span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Pause</span>
                    )}
                  </button>

                  <div className="flex-1 flex items-center">
                    <input 
                      type="range" 
                      min="0" 
                      max="10000" 
                      value={Math.round(detonationTimeMs)} 
                      onChange={(e) => {
                        const newVal = parseInt(e.target.value);
                        setDetonationTimeMs(newVal);
                        setIsDetonationPaused(true);
                        if (!isDetonationAnimating) {
                          setIsDetonationAnimating(true);
                        }
                      }}
                      className="w-full h-1 bg-zinc-850 accent-red-500 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDetonationTimeMs(0);
                      setIsDetonationAnimating(true);
                      setIsDetonationPaused(false);
                    }}
                    className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors shrink-0 border border-zinc-700/50 flex items-center justify-center cursor-pointer"
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
                  
                  <div className="text-[11px] text-zinc-300 bg-zinc-950/80 border border-zinc-850 p-2.5 rounded-lg leading-relaxed font-sans shadow-inner">
                    {activePhysicalStatus.desc}
                  </div>

                  <div className="flex items-center justify-between text-[8px] text-zinc-500 font-mono">
                    <span>Vitesse d'animation compressée</span>
                    <span className="font-semibold text-zinc-400">
                      {detonationTimeMs < 10000 ? `${(detonationTimeMs / 1000).toFixed(2)}s / 10.00s` : "ÉQUILIBRE REJOINT"}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Mobile Propagation Toggle Trigger Button */}
        {target && isDetonated && (
          <button
            type="button"
            onClick={() => setIsMobileHudOpen(true)}
            className="fixed bottom-24 right-4 z-20 md:hidden bg-zinc-950/95 border border-zinc-800 hover:border-red-500 text-white font-bold p-3 px-3.5 rounded-2xl shadow-2xl flex items-center gap-2 text-[9px] font-mono tracking-widest active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            CHRONOLOGIE PROPAGATION
          </button>
        )}

        {/* Mobile Propagation Drawer Overlay/Bottom Sheet */}
        {target && isDetonated && isMobileHudOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center md:hidden">
            {/* Tap outside to close helper */}
            <div className="absolute inset-0" onClick={() => setIsMobileHudOpen(false)} />
            
            <div className="relative w-full max-h-[40vh] bg-zinc-950 border-t border-zinc-800 rounded-t-3xl p-5 flex flex-col gap-4 overflow-y-auto shadow-2xl z-10 font-sans">
              {/* Drawer Top Header with a beautiful center drag visual indicator */}
              <div className="flex flex-col gap-1 shrink-0">
                <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto" />
                <div className="flex items-center justify-between mt-1 pb-2 border-b border-zinc-900">
                  <div className="flex items-center gap-1.5 font-bold font-mono text-[9px] tracking-wider text-zinc-400">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDetonationAnimating ? 'bg-red-400' : 'bg-green-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isDetonationAnimating ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    </span>
                    SIMULATION DE PROPAGATION
                  </div>
                  <div className="font-mono text-xs font-bold text-red-400 bg-red-950/20 px-2 py-0.5 rounded border border-red-900/40">
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
                    className="p-1 px-2.5 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 text-xs rounded font-mono font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Timing Slider on Mobile */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (detonationTimeMs >= 10000) {
                      setDetonationTimeMs(0);
                      setIsDetonationAnimating(true);
                      setIsDetonationPaused(false);
                    } else {
                      setIsDetonationPaused(!isDetonationPaused);
                      if (!isDetonationAnimating) {
                        setIsDetonationAnimating(true);
                      }
                    }
                  }}
                  className="p-1.5 px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors shrink-0 text-[10px] font-mono font-bold cursor-pointer"
                >
                  {detonationTimeMs >= 10000 ? "REJOUER" : isDetonationPaused ? "PLAY" : "PAUSE"}
                </button>

                <div className="flex-1 flex items-center">
                  <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    value={Math.round(detonationTimeMs)} 
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value);
                      setDetonationTimeMs(newVal);
                      setIsDetonationPaused(true);
                      if (!isDetonationAnimating) {
                        setIsDetonationAnimating(true);
                      }
                    }}
                    className="w-full h-1 bg-zinc-850 accent-red-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDetonationTimeMs(0);
                    setIsDetonationAnimating(true);
                    setIsDetonationPaused(false);
                  }}
                  className="p-1.5 rounded bg-zinc-800 border border-zinc-755 text-zinc-400 hover:text-white transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Status information on Mobile */}
              <div className="flex flex-col gap-1.5 mt-1 overflow-y-auto">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-500 font-medium font-sans">Statut physique :</span>
                  <span className={`font-bold uppercase ${activePhysicalStatus.colorClass}`}>
                    {activePhysicalStatus.title}
                  </span>
                </div>
                
                <div className="text-[11px] text-zinc-300 bg-zinc-900/40 border border-zinc-900 p-2.5 rounded-lg leading-relaxed font-sans shrink-0">
                  {activePhysicalStatus.desc}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UI Overlay info */}
        {target && isDetonated && (
          <div className="absolute top-4 inset-x-4 md:inset-x-auto md:top-auto md:bottom-6 md:right-6 z-10 bg-zinc-950/80 backdrop-blur-lg border border-zinc-800/60 p-4 rounded-xl shadow-2xl pointer-events-none flex flex-col gap-3 md:w-max w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-red-500 tracking-wider">IMPACT CONFIRMÉ</span>
                <span className="text-xs text-zinc-400 font-medium">
                  {weapon.name} ({effectiveYield >= 1000 ? `${effectiveYield / 1000} Mt` : `${effectiveYield} kt`})
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-800/50 flex flex-col gap-1 text-[10px] font-mono text-zinc-500 uppercase">
              <div className="flex justify-between items-center gap-4">
                <span>Trg:</span>
                <span className="text-zinc-300">[{target.lat.toFixed(4)}°, {target.lng.toFixed(4)}°]</span>
              </div>
              {origin && (
                <div className="flex justify-between items-center gap-4">
                  <span>Org:</span>
                  <span className="text-zinc-300">[{origin.lat.toFixed(4)}°, {origin.lng.toFixed(4)}°]</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

