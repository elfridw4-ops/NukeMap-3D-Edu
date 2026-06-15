import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LaunchParams, EnvironmentParams, BlastRadii, WeaponConfig, DeliveryType } from '../../types';
import { WEAPON_PRESETS, haversineKm, flightTimeMin } from '../../lib/nuclearMath';
import { CITIES_DATABASE, findNearbyCity } from '../../lib/citiesData';
import { AutomaticGeoData } from '../../lib/geoDataFetcher';
import { VECTORS } from './constants';
import {
  Navigation, Crosshair, MapPin, Rocket, Search, Sparkles, ChevronUp, ChevronDown,
  ShieldAlert, Building2, School, AlertTriangle
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TargetConfigSectionProps {
  selectionMode: 'target' | 'origin';
  setSelectionMode: (mode: 'target' | 'origin') => void;
  origin: { lng: number; lat: number } | null;
  setOrigin: (origin: { lng: number; lat: number } | null) => void;
  target: { lng: number; lat: number } | null;
  launchParams: LaunchParams;
  setLaunchParams: (params: LaunchParams) => void;
  environmentParams: EnvironmentParams;
  setEnvironmentParams: (params: EnvironmentParams) => void;
  onSearch: (lng: number, lat: number) => void;
  radii: BlastRadii;
  simulationMode: 'instant' | 'ballistic';
  setSimulationMode: (mode: 'instant' | 'ballistic') => void;
  onLaunchMissile: () => void;
  flightProgress: number;
  targetDetails: {
    isWater: boolean;
    name?: string;
    country?: string;
    city?: string;
    detected: boolean;
    loading: boolean;
  };
  autoGeoData: AutomaticGeoData;
  multiStrikeMode: boolean;
  setMultiStrikeMode: (mode: boolean) => void;
  pastStrikesCount: number;
  onClearPastStrikes: () => void;
  setWeapon: (weapon: WeaponConfig) => void;
}

export function TargetConfigSection({
  selectionMode,
  setSelectionMode,
  origin,
  setOrigin,
  target,
  launchParams,
  setLaunchParams,
  environmentParams,
  setEnvironmentParams,
  onSearch,
  radii,
  simulationMode,
  setSimulationMode,
  onLaunchMissile,
  flightProgress,
  targetDetails,
  autoGeoData,
  multiStrikeMode,
  setMultiStrikeMode,
  pastStrikesCount,
  onClearPastStrikes,
  setWeapon
}: TargetConfigSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isTargetAnalysisExpanded, setIsTargetAnalysisExpanded] = useState(false);

  const nearbyCity = target ? findNearbyCity(target.lat, target.lng, 25) : null;
  const sidebarDistanceKm = origin && target 
    ? haversineKm(origin.lat, origin.lng, target.lat, target.lng) 
    : 0;
  const sidebarSelectedVec = VECTORS.find(v => v.id === (launchParams.vectorId || 'icbm')) || VECTORS[0];
  const buttonOutOfRange = sidebarDistanceKm > sidebarSelectedVec.rangeKm;

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        onSearch(lng, lat);
        setSearchQuery('');
      } else {
        setSearchError("Lieu introuvable");
      }
    } catch(e) {
      console.error("Geocoding failed:", e);
      setSearchError("Recherche indisponible (CORS/Régulation)");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
        <Navigation className="w-4 h-4" />
        Ciblage & Origine
      </h2>
      
      <div className="flex bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-1 backdrop-blur-sm mt-3">
        <button
          onClick={() => setSimulationMode('instant')}
          className={cn(
            "flex-1 py-1.5 text-xs font-medium rounded transition-colors flex items-center justify-center gap-2",
            simulationMode === 'instant' 
              ? "bg-zinc-800 text-white shadow-sm" 
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          Mode Instantané
        </button>
        <button
          onClick={() => setSimulationMode('ballistic')}
          className={cn(
            "flex-1 py-1.5 text-xs font-medium rounded transition-colors flex items-center justify-center gap-2",
            simulationMode === 'ballistic' 
              ? "bg-zinc-800 text-white shadow-sm" 
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          Mode Balistique
        </button>
      </div>

      <div className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-800/60 rounded-lg">
        <div className="space-y-0.5">
          <div className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
            Frappe Multiple
            <span className="text-[9px] font-mono bg-sky-950 text-sky-400 px-1.5 py-0.5 rounded border border-sky-900">POINTEUR LIBRE</span>
          </div>
          <p className="text-[10px] text-zinc-500">Permet d'ajouter plusieurs détonations sur la carte.</p>
        </div>
        <div className="flex items-center gap-3">
          {pastStrikesCount > 0 && (
            <button 
              onClick={onClearPastStrikes}
              className="text-[10px] text-red-400 hover:text-red-300 underline underline-offset-2"
            >
              Effacer ({pastStrikesCount})
            </button>
          )}
          <button 
            type="button"
            onClick={() => setMultiStrikeMode(!multiStrikeMode)}
            className={cn(
              "w-9 h-5 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-sky-900",
              multiStrikeMode ? "bg-sky-600 border border-sky-500" : "bg-zinc-800 border border-zinc-700"
            )}
          >
            <span className={cn(
              "absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-zinc-200 rounded-full transition-transform",
              multiStrikeMode ? "translate-x-4 bg-white" : "translate-x-0"
            )} />
          </button>
        </div>
      </div>

      {/* TRAJECTOIRE & LANCEMENT */}
      <AnimatePresence>
        {simulationMode === 'ballistic' && (
          <motion.div 
            key="ballistic-section"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-4 overflow-hidden pt-2"
          >
            <div>
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                <Rocket className="w-4 h-4 text-red-500 animate-pulse" />
                Trajectoire & Lancement
              </h2>
              
              <div className="space-y-4 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg backdrop-blur-sm">
                
                {/* VECTEUR DE LIVRAISON SELECTOR */}
                <div className="space-y-2">
                  <label className="text-xs text-white font-bold tracking-wide flex items-center gap-1.5">
                    🚀 Vecteur de livraison
                  </label>
                  
                  {/* Desktop Dropdown Input */}
                  <div className="hidden md:block relative animate-fadeIn">
                    <select 
                      style={{ border: "1px solid #ff4444", zIndex: 9999 }}
                      className="w-full appearance-none bg-zinc-950 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all text-zinc-200 relative"
                      value={launchParams.vectorId || 'icbm'}
                      onChange={(e) => {
                        const vecId = e.target.value as DeliveryType;
                        const vec = VECTORS.find(v => v.id === vecId)!;
                        setLaunchParams({
                          ...launchParams,
                          vectorId: vecId,
                          altitudeKm: vec.altitudeKm || (vecId === 'cruise' ? 0.1 : 120),
                          velocityMach: vec.speedKmh ? parseFloat((vec.speedKmh / 1225).toFixed(2)) : 8.0,
                          customSpeedKmh: vec.speedKmh || 10000,
                          customRangeKm: vec.rangeKm || 13000,
                          trajectoryType: vecId === 'cruise' ? 'cruise' : 'standard'
                        });
                      }}
                    >
                      {VECTORS.map((v) => (
                        <option key={v.id} value={v.id} className="bg-zinc-900 text-zinc-200">
                          {v.name} ({v.example})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-zinc-500">
                      <ChevronUp className="w-4 h-4 rotate-180" />
                    </div>
                  </div>

                  {/* Mobile Visual Radio Buttons */}
                  <div className="md:hidden grid grid-cols-2 gap-2 animate-fadeIn">
                    {VECTORS.map((v) => {
                      const isSelected = (launchParams.vectorId || 'icbm') === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            const vecId = v.id as DeliveryType;
                            setLaunchParams({
                              ...launchParams,
                              vectorId: vecId,
                              altitudeKm: v.altitudeKm || (vecId === 'cruise' ? 0.1 : 120),
                              velocityMach: v.speedKmh ? parseFloat((v.speedKmh / 1225).toFixed(2)) : 8.0,
                              customSpeedKmh: v.speedKmh || 10000,
                              customRangeKm: v.rangeKm || 13000,
                              trajectoryType: vecId === 'cruise' ? 'cruise' : 'standard'
                            });
                          }}
                          className={cn(
                            "flex flex-col items-start p-2 rounded-lg border text-left transition-all relative overflow-hidden cursor-pointer",
                            isSelected 
                              ? "bg-red-500/10 border-red-500 shadow-md text-white" 
                              : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          )}
                        >
                          <div className="flex items-center gap-1.5 w-full mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wide truncate">{v.name}</span>
                          </div>
                          <span className="text-[8px] text-zinc-500 truncate">{v.example}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DYNAMIC CALCULATIONS RESULT PANEL */}
                {(() => {
                  const distanceKm = origin && target 
                    ? haversineKm(origin.lat, origin.lng, target.lat, target.lng) 
                    : 0;

                  const selectedVec = VECTORS.find(v => v.id === (launchParams.vectorId || 'icbm')) || VECTORS[0];
                  const activeRange = launchParams.customRangeKm !== undefined ? launchParams.customRangeKm : selectedVec.rangeKm;
                  
                  let activeSpeed = launchParams.customSpeedKmh !== undefined ? launchParams.customSpeedKmh : (selectedVec.speedKmh || 24000);
                  if (launchParams.trajectoryType === 'depressed') {
                    activeSpeed = activeSpeed * 1.33;
                  }

                  const isOutOfRange = distanceKm > activeRange;
                  const flightDurationMin = distanceKm > 0 ? flightTimeMin(distanceKm, activeSpeed) : 0;

                  const formatDuration = (totalMins: number) => {
                    if (totalMins <= 0) return "0 min 00 sec";
                    const mins = Math.floor(totalMins);
                    const secs = Math.round((totalMins % 1) * 60);
                    return `${mins} min ${secs.toString().padStart(2, '0')} sec`;
                  };

                  const formatCountdownText = (totalSecs: number) => {
                    if (totalSecs <= 0) return "00:00";
                    const hours = Math.floor(totalSecs / 3600);
                    const minutes = Math.floor((totalSecs % 3600) / 60);
                    const seconds = Math.floor(totalSecs % 60);
                    if (hours > 0) {
                      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    }
                    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                  };

                  const remainingTotalSec = flightDurationMin * 60 * (1 - flightProgress);
                  const countdownText = formatCountdownText(remainingTotalSec);

                  const activePhaseIndex = flightProgress < 0.15 ? 0 : (flightProgress < 0.85 ? 1 : 2);
                  const activePhaseName = selectedVec.phases[activePhaseIndex];

                  const simulatedAlt = flightProgress > 0 && flightProgress < 1
                    ? Math.round(4 * (launchParams.altitudeKm !== undefined ? launchParams.altitudeKm : (selectedVec.altitudeKm || 1200)) * flightProgress * (1 - flightProgress))
                    : 0;

                  return (
                    <div className="space-y-3.5 mt-2 animate-fadeIn">
                      
                      {/* CHARACTERISTICS CUSTOMIZATION PANEL */}
                      <div className="p-3 bg-zinc-950/60 border border-zinc-900/60 rounded-xl space-y-3">
                        <div className="flex items-center justify-between border-b border-zinc-900/40 pb-1.5">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                            Ajustement du Vecteur (Accès Physique)
                          </span>
                          <span className="text-[9px] text-zinc-500 font-mono">
                            Mach {(activeSpeed / 1225).toFixed(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Vitesse (km/h)</label>
                            <input 
                              type="number" 
                              min="100"
                              max="150000"
                              className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2 font-mono text-[11px] text-zinc-200 outline-none focus:ring-1 focus:ring-red-500 shadow-inner"
                              value={launchParams.customSpeedKmh !== undefined ? launchParams.customSpeedKmh : (selectedVec.speedKmh || 24000)}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setLaunchParams({
                                  ...launchParams,
                                  customSpeedKmh: val,
                                  velocityMach: parseFloat((val / 1225).toFixed(2))
                                });
                              }}
                              placeholder="Ex: 24000"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Apogée (Altitude, km)</label>
                            <input 
                              type="number" 
                              min="0"
                              max="5000"
                              className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2 font-mono text-[11px] text-zinc-200 outline-none focus:ring-1 focus:ring-red-500 shadow-inner"
                              value={launchParams.altitudeKm !== undefined ? launchParams.altitudeKm : (selectedVec.altitudeKm || 1200)}
                              onChange={(e) => {
                                setLaunchParams({
                                  ...launchParams,
                                  altitudeKm: parseInt(e.target.value) || 0
                                });
                              }}
                              placeholder="Ex: 1200"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Portée Max (km)</label>
                            <input 
                              type="number" 
                              min="10"
                              max="150000"
                              className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2 font-mono text-[11px] text-zinc-200 outline-none focus:ring-1 focus:ring-red-500 shadow-inner"
                              value={launchParams.customRangeKm !== undefined ? launchParams.customRangeKm : selectedVec.rangeKm}
                              onChange={(e) => {
                                setLaunchParams({
                                  ...launchParams,
                                  customRangeKm: parseInt(e.target.value) || 0
                                });
                              }}
                              placeholder="Ex: 13000"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Profil Trajectoire</label>
                            <select 
                              className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-1.5 text-[10px] text-zinc-200 outline-none focus:ring-1 focus:ring-red-500"
                              value={launchParams.trajectoryType || 'standard'}
                              onChange={(e) => {
                                const type = e.target.value as 'standard' | 'depressed' | 'cruise';
                                let alt = launchParams.altitudeKm !== undefined ? launchParams.altitudeKm : (selectedVec.altitudeKm || 1200);
                                if (type === 'depressed') {
                                  alt = Math.round((selectedVec.altitudeKm || 1200) * 0.35);
                                } else if (type === 'cruise') {
                                  alt = selectedVec.id === 'bomber' ? 15 : (selectedVec.id === 'cruise' ? 0.1 : 5);
                                } else if (type === 'standard') {
                                  alt = selectedVec.altitudeKm || 1200;
                                }
                                setLaunchParams({
                                  ...launchParams,
                                  trajectoryType: type,
                                  altitudeKm: alt
                                });
                              }}
                            >
                              <option value="standard" className="bg-zinc-950 text-zinc-200">Standard Balistique</option>
                              <option value="depressed" className="bg-zinc-950 text-zinc-200">Basse / Tendue (Depressed)</option>
                              <option value="cruise" className="bg-zinc-950 text-zinc-200">De Croisière</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Calculation card */}
                      <div className="p-3 bg-zinc-950/80 border border-zinc-900/80 rounded-lg space-y-2.5 font-mono text-[11px] leading-relaxed shadow-inner">
                        <div className="flex justify-between items-center text-zinc-500 border-b border-zinc-900/50 pb-1">
                          <span className="uppercase text-[9px] font-bold tracking-wider">Planification</span>
                          <span className="uppercase text-[9px] font-bold tracking-wider">État</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Distance :</span>
                          <span className="text-zinc-200 font-semibold">{distanceKm > 0 ? `${Math.round(distanceKm).toLocaleString()} km` : "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Temps de vol :</span>
                          <span className="text-blue-400 font-semibold">{distanceKm > 0 ? formatDuration(flightDurationMin) : "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-400">
                          <span className="text-zinc-500">Vecteur :</span>
                          <span className="text-zinc-200 text-right text-[10px] truncate max-w-[130px]">{selectedVec.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Portée Max :</span>
                          <span className={cn("font-bold flex items-center gap-1", isOutOfRange ? "text-red-500" : "text-emerald-500")}>
                            {activeRange >= 90000 ? "Illimitée" : `${activeRange.toLocaleString()} km`}
                            <span>{isOutOfRange ? "❌" : "✅"}</span>
                          </span>
                        </div>
                        
                        {isOutOfRange && (
                          <div className="p-2 bg-red-950/20 border border-red-900/40 text-red-400 text-[10px] rounded-md mt-1 leading-normal font-sans">
                            <strong>⚠️ Hors de portée !</strong> Distance supérieure à la limite opérationnelle du vecteur.
                          </div>
                        )}

                        {distanceKm > 0 && flightDurationMin < 10 && (
                          <div className="p-2 bg-red-950/40 border border-red-500/30 text-red-400 text-[10px] rounded-md font-sans animate-pulse flex items-center justify-center gap-1.5 leading-normal">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span className="font-bold tracking-wide">⚠️ FENÊTRE DE RÉACTION CRITIQUE (&lt; 10 min)</span>
                          </div>
                        )}
                      </div>

                      {/* Vol en temps réel HUD */}
                      {flightProgress > 0 && flightProgress < 1 && (
                        <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg space-y-3 font-sans shadow-inner animate-pulse">
                          <div className="flex justify-between items-center text-xs border-b border-red-900/20 pb-1.5">
                            <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-1">
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                              VOL ACTIF
                            </span>
                            <span className="font-mono text-red-300 font-bold">{countdownText} restant</span>
                          </div>

                          {/* 3-phase progression display */}
                          <div className="relative h-6 bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden flex items-center p-0.5 shadow-inner">
                            <div className="absolute top-0 bottom-0 left-0" style={{ width: '15%', backgroundColor: 'rgba(239, 68, 68, 0.15)' }} />
                            <div className="absolute top-0 bottom-0 left-[15%]" style={{ width: '70%', backgroundColor: 'rgba(59, 130, 246, 0.1)' }} />
                            <div className="absolute top-0 bottom-0 left-[85%]" style={{ width: '15%', backgroundColor: 'rgba(249, 115, 22, 0.15)' }} />
                            
                            <div 
                              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-red-600/60 via-blue-500/40 to-orange-500/60 transition-all duration-75"
                              style={{ width: `${flightProgress * 100}%` }}
                            />
                            
                            <div 
                              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-75"
                              style={{ left: `${flightProgress * 100}%` }}
                            >
                              <Rocket className="w-3.5 h-3.5 text-orange-400 rotate-45 filter drop-shadow-[0_0_4px_rgba(251,146,60,0.8)]" />
                            </div>

                            <div className="absolute inset-0 flex justify-between px-3 text-[7.5px] font-mono select-none items-center pointer-events-none text-zinc-500">
                              <span className={cn("text-red-400 font-bold", flightProgress < 0.15 && "animate-pulse")}>BOOST</span>
                              <span className={cn("text-blue-400 font-semibold", flightProgress >= 0.15 && flightProgress < 0.85 && "animate-pulse")}>MIDCOURSE</span>
                              <span className={cn("text-orange-400 font-bold", flightProgress >= 0.85 && "animate-pulse")}>TERMINALE</span>
                            </div>
                          </div>

                          {flightDurationMin < 10 && (
                            <div className="p-2 bg-red-950/60 border border-red-500/40 text-red-400 text-[10px] rounded-md text-center font-sans font-bold flex items-center justify-center gap-1.5 animate-pulse leading-normal">
                              <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              <span>⚠️ FENÊTRE DE RÉACTION CRITIQUE : INTERCEPTION IMPROBABLE</span>
                            </div>
                          )}

                          {/* Detailed status specs */}
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-red-900/20 pt-2 text-zinc-400 leading-normal">
                            <div>
                              <span className="text-zinc-500">Altitude :</span>{" "}
                              <span className="text-zinc-300 font-semibold">{simulatedAlt.toLocaleString()} km</span>
                            </div>
                            <div>
                              <span className="text-zinc-500">Vitesse :</span>{" "}
                              <span className="text-zinc-300 font-semibold">{Math.round(activeSpeed).toLocaleString()} km/h</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-zinc-500">Séquence active :</span>{" "}
                              <span className="text-red-300 font-semibold uppercase">{activePhaseName}</span>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })()}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-1 backdrop-blur-sm">
        <button
          onClick={() => setSelectionMode('target')}
          className={cn(
            "flex-1 py-1.5 text-xs font-medium rounded transition-colors flex items-center justify-center gap-2",
            selectionMode === 'target' 
              ? "bg-zinc-800 text-white shadow-sm" 
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Crosshair className="w-3.5 h-3.5" />
          Cible
        </button>
        <button
          onClick={() => setSelectionMode('origin')}
          className={cn(
            "flex-1 py-1.5 text-xs font-medium rounded transition-colors flex items-center justify-center gap-2",
            selectionMode === 'origin' 
              ? "bg-blue-900/50 text-blue-400 shadow-sm border border-blue-800/50" 
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <MapPin className="w-3.5 h-3.5" />
          Origine
        </button>
      </div>

      {/* Sélection de cible historique / stratégique */}
      <div className="space-y-2 mt-3">
        <label className="text-xs text-zinc-400 font-medium tracking-wide">Cibles historiques & stratégiques (Base Edu)</label>
        <div className="relative">
          <select 
            className="w-full appearance-none bg-zinc-950 border border-zinc-800/80 rounded-lg p-2.5 pl-3 pr-10 text-xs outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all shadow-inner text-zinc-200"
            value={nearbyCity?.id || ""}
            onChange={(e) => {
              const cityIdStr = e.target.value;
              if (cityIdStr) {
                const city = CITIES_DATABASE.find(c => String(c.id) === String(cityIdStr));
                if (city) {
                  onSearch(city.longitude, city.latitude);
                  
                  // Helpers for parsing
                  const parseAvg = (str: string, def: number) => {
                    const m = str.match(/\d+/g);
                    if (!m) return def;
                    if (m.length > 1) return (parseInt(m[0]) + parseInt(m[1])) / 2;
                    return parseInt(m[0]);
                  };
                  const parseDir = (str: string, def: number) => {
                    const lw = str.toLowerCase();
                    if (lw.includes('nw')) return 315;
                    if (lw.includes('sw')) return 225;
                    if (lw.includes('ne')) return 45;
                    if (lw.includes('se')) return 135;
                    if (lw.includes('w')) return 270;
                    if (lw.includes('e')) return 90;
                    if (lw.includes('s')) return 180;
                    if (lw.includes('n')) return 0;
                    return def;
                  };

                  setEnvironmentParams({
                    ...environmentParams,
                    oceanDepthM: city.bathymetry.ocean_depth_h0_m,
                    coastalDepthM: parseAvg(city.bathymetry.coastal_depth_hc_m, 8),
                    shoreDistanceKm: city.bathymetry.distance_to_shore_d_km,
                    beachSlopePct: city.topography.coastal_slope_percent,
                    manningN: city.topography.manning_coefficient_n,
                    tropopauseAltitudeKm: (city.atmosphere.tropopause_summer_km + city.atmosphere.tropopause_winter_km) / 2,
                    windSpeed: parseAvg(city.atmosphere.speed_kmh, 15),
                    windDirection: parseDir(city.atmosphere.direction, 270),
                  });
                  if (city.historical_context?.weapon) {
                    const wMatch = WEAPON_PRESETS.find(w => w.name.toLowerCase().includes(city.historical_context!.weapon!.toLowerCase()) || w.id === city.historical_context!.weapon!.toLowerCase());
                    if (wMatch) setWeapon(wMatch);
                  }
                }
              }
            }}
          >
            <option value="" className="text-zinc-500 bg-zinc-900">-- Sélectionner une ville de référence --</option>
            {CITIES_DATABASE.map(c => (
              <option key={c.id} value={c.id} className="bg-zinc-900 text-zinc-200">
                {c.name} ({c.country}) — {c.educational_justification.split(' — ')[1] || c.educational_justification}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-zinc-500">
            <ChevronUp className="w-4 h-4 rotate-180" />
          </div>
        </div>
      </div>

      <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg space-y-3 backdrop-blur-sm">
        <p className="text-xs text-zinc-500 leading-relaxed font-sans">
          Faites glisser la carte et cliquez n'importe où pour définir le point {selectionMode === 'target' ? "d'impact" : "d'origine"}. 
          {selectionMode === 'target' ? " Les zones de destruction seront instantanément calculées." : " Ce point servira de base de lancement."}
        </p>

        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Rechercher un lieu..."
              className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs outline-none focus:border-zinc-500 transition-colors"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (searchError) setSearchError(null);
              }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button 
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300 px-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 border border-zinc-700/50"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
          {searchError && (
            <div className="text-[10px] text-red-500 font-mono flex items-center gap-1 mt-0.5 animate-pulse pl-1">
              <span>⚠️</span> {searchError}
            </div>
          )}
        </div>
      </div>
      
      {origin && target && (
        <div className="p-3 bg-zinc-900/30 border border-zinc-700/50 rounded-lg mt-3 flex justify-between items-center shadow-inner backdrop-blur-sm">
          <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Distance estimée</span>
          <span className="text-sm text-blue-400 font-mono font-bold tracking-tight">
            {Math.round(Math.sqrt((target.lng - origin.lng) ** 2 + (target.lat - origin.lat) ** 2) * 111.32)} <span className="text-xs text-blue-500/70">KM</span>
          </span>
        </div>
      )}

      <AnimatePresence>
        {target && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              {simulationMode === 'ballistic' ? (
                origin ? (
                  <button
                    type="button"
                    onClick={onLaunchMissile}
                    disabled={(flightProgress > 0 && flightProgress < 1) || buttonOutOfRange}
                    className="w-full relative overflow-hidden group bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold tracking-widest uppercase text-sm py-3 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:shadow-none transition-all cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                       <Rocket className={cn("w-4 h-4", flightProgress > 0 && flightProgress < 1 ? "animate-pulse" : "")} />
                       {flightProgress > 0 && flightProgress < 1 ? "Séquence en cours..." : buttonOutOfRange ? "Cible hors de portée !" : "Lancer la Séquence"}
                    </span>
                    {flightProgress > 0 && flightProgress < 1 && (
                      <div className="absolute left-0 bottom-0 h-1 bg-red-400" style={{ width: `${flightProgress * 100}%` }} />
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onLaunchMissile}
                    className="w-full relative overflow-hidden group bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-widest uppercase text-sm py-3 rounded-lg shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                       <Sparkles className="w-4 h-4" />
                       Déclencher l'impact directement
                    </span>
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={onLaunchMissile}
                  className="w-full relative overflow-hidden group bg-red-600 hover:bg-red-500 text-white font-bold tracking-widest uppercase text-sm py-3 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all cursor-pointer"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                     <Sparkles className="w-4 h-4" />
                     Déclencher l'Impact Immédiat
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fiche Scientifique de la cible identifiée */}
      <AnimatePresence>
        {target && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl space-y-3.5 shadow-2xl text-xs text-zinc-350 backdrop-blur-md mt-4"
          >
            <div 
              className="flex items-center justify-between pb-1.5 border-b border-zinc-800/60 cursor-pointer select-none group"
              onClick={() => setIsTargetAnalysisExpanded(!isTargetAnalysisExpanded)}
            >
              <div className="flex items-center gap-1.5 font-bold text-red-400 uppercase tracking-widest text-[9.5px]">
                <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" />
                Analyse de Cible Intégrée
                <span className="text-[8px] text-zinc-500 font-normal normal-case ml-1 group-hover:text-zinc-300 transition-colors flex items-center gap-0.5">
                  ({isTargetAnalysisExpanded ? "cliquer pour masquer" : "cliquer pour déplier"})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-mono font-bold bg-zinc-800/60 p-0.5 px-1.5 rounded border border-zinc-700/60 text-zinc-400">
                  [{target.lat.toFixed(4)}°, {target.lng.toFixed(4)}°]
                </span>
                {isTargetAnalysisExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-400 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 transition-transform duration-200" />
                )}
              </div>
            </div>

            <div className="space-y-1 text-zinc-300">
              <div className="font-sans text-xs font-bold text-zinc-100 flex items-center justify-between gap-1.5">
                <span className="truncate">📍 {autoGeoData.cityName || "Zone d'Impact"}, {autoGeoData.countryName || "Eaux"}</span>
                <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-zinc-850 text-zinc-400 border border-zinc-800 capitalize shrink-0 leading-none">
                  {autoGeoData.placeType}
                </span>
              </div>
              {nearbyCity && (
                <p className="text-[10px] text-emerald-400 leading-normal italic pl-1.5 border-l-2 border-emerald-500/80 mt-1.5 bg-emerald-950/10 py-1 pr-1 font-sans">
                  Cible de Référence Historique : "{nearbyCity.educational_justification}"
                </p>
              )}
            </div>

            {isTargetAnalysisExpanded ? (
              autoGeoData.loading ? (
                <div className="py-6 flex flex-col items-center justify-center gap-2 text-center text-[10px] text-zinc-400">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-700 border-t-red-500 animate-spin" />
                  <span className="font-mono uppercase tracking-wider text-zinc-500 animate-pulse">Sondage satellite & calcul de propagation...</span>
                </div>
              ) : (
                <div className="space-y-3">
                
                  {/* Démographie */}
                  <div className="p-2.5 bg-zinc-900/40 border border-zinc-800/60 rounded flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] text-zinc-400 font-bold uppercase tracking-wider block">👥 Analyse Démographique</span>
                      <span className="text-[7.5px] font-mono text-zinc-500">[{autoGeoData.populationSource}]</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-[9.5px] text-zinc-400">
                      <div>Population Locale :</div>
                      <div className="text-right font-medium text-white">
                        {autoGeoData.population > 0 ? `${autoGeoData.population.toLocaleString('fr-FR')} hab.` : "Inhabitée"}
                      </div>
                      <div>Densité Estimée :</div>
                      <div className="text-right font-medium text-white">
                        {autoGeoData.densityValue > 0 ? `${autoGeoData.densityValue} hab/km²` : "0 hab/km²"}
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-zinc-900 flex justify-between items-center text-[9px]">
                      <span className="text-zinc-500">Classification densité :</span>
                      <span className={cn(
                        "font-semibold uppercase tracking-wider text-[8px]",
                        autoGeoData.densityValue > 6000 ? "text-red-400" : autoGeoData.densityValue > 1000 ? "text-amber-400" : "text-green-400"
                      )}>{autoGeoData.densityLevel}</span>
                    </div>
                  </div>

                  {/* Topographie */}
                  <div className="p-2.5 bg-zinc-900/40 border border-zinc-800/60 rounded flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] text-zinc-400 font-bold uppercase tracking-wider block">⛰️ Topographie & Relief</span>
                      <span className="text-[7.5px] font-mono text-zinc-500">[Open-Meteo DEM]</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-[9.5px] text-zinc-400">
                      <div>Altitude Épicentre :</div>
                      <div className="text-right font-medium text-white">{autoGeoData.elevationM} m asl</div>
                      <div>Type de Relief :</div>
                      <div className={cn(
                        "text-right font-semibold",
                        autoGeoData.reliefType.includes('Accidenté') ? "text-red-400" : autoGeoData.reliefType.includes('Vallonné') ? "text-amber-400" : "text-zinc-300"
                      )}>{autoGeoData.reliefType}</div>
                    </div>

                    {/* Sparkline chart of local relief */}
                    {autoGeoData.elevationProfile && autoGeoData.elevationProfile.length > 0 && (
                      <div className="pt-2 border-t border-zinc-900 shrink-0">
                        <span className="text-[7.5px] text-zinc-500 block text-center uppercase tracking-wider font-mono mb-1.5">Profil de Relief Local (Rayon 2km)</span>
                        <div className="h-8 w-full flex items-end justify-between px-1 gap-1 pt-1.5">
                          {autoGeoData.elevationProfile.map((pt, i) => {
                            const minEl = autoGeoData.elevationMin;
                            const maxEl = autoGeoData.elevationMax;
                            const delta = maxEl - minEl || 10;
                            const pct = Math.max(0.1, (pt.elevationM - minEl) / delta);
                            const h = Math.round(pct * 18);

                            return (
                              <div key={i} className="flex-1 flex flex-col items-center">
                                <div className="w-full bg-zinc-850 rounded-sm h-5 flex items-end overflow-hidden border border-zinc-800/50">
                                  <div 
                                    className={cn(
                                      "w-full transition-all duration-300",
                                      pt.direction.includes('Centre') ? "bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" : "bg-zinc-600"
                                    )}
                                    style={{ height: `${h}px` }}
                                  />
                                </div>
                                <span className="text-[6px] font-mono text-zinc-500 uppercase mt-0.5 tracking-tighter truncate max-w-[28px]">
                                  {pt.direction.split(' ')[0]}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Équipements de Crise */}
                  {!targetDetails.isWater && (
                    <div className="p-2.5 bg-zinc-900/40 border border-zinc-800/60 rounded flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[8.5px] text-zinc-400 font-bold uppercase tracking-wider block">🏢 Équipements de Crise (Rayon 3km)</span>
                        <span className="text-[7.5px] font-mono text-zinc-500">
                          {autoGeoData.infrastructureDetected ? "OSM Scanner v3" : "Estimations Statistiques"}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                        <div className="bg-zinc-950/45 border border-zinc-850 p-2 rounded flex flex-col items-center justify-center text-center">
                          <Building2 className={cn("w-3.5 h-3.5 mb-1", autoGeoData.hospitals > 0 ? "text-red-400" : "text-zinc-600")} />
                          <span className="font-mono text-xs font-bold text-white">{autoGeoData.hospitals}</span>
                          <span className="text-[7.5px] text-zinc-500 leading-tight mt-0.5">Hôpitaux / Cliniques</span>
                        </div>

                        <div className="bg-zinc-950/45 border border-zinc-850 p-2 rounded flex flex-col items-center justify-center text-center">
                          <School className={cn("w-3.5 h-3.5 mb-1", autoGeoData.schools > 0 ? "text-amber-400" : "text-zinc-600")} />
                          <span className="font-mono text-xs font-bold text-white">{autoGeoData.schools}</span>
                          <span className="text-[7.5px] text-zinc-500 leading-tight mt-0.5">Écoles / Univs</span>
                        </div>

                        <div className="bg-zinc-950/45 border border-zinc-850 p-2 rounded flex flex-col items-center justify-center text-center">
                          <Building2 className={cn("w-3.5 h-3.5 mb-1", autoGeoData.industrialZones > 0 ? "text-purple-400" : "text-zinc-600")} />
                          <span className="font-mono text-xs font-bold text-white">{autoGeoData.industrialZones}</span>
                          <span className="text-[7.5px] text-zinc-500 leading-tight mt-0.5">Zones Ind.</span>
                        </div>
                      </div>

                      <div className="text-[8px] text-zinc-500 leading-normal font-sans pt-1 flex items-start gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                        <span>
                          Installations menacées directement par l'onde de choc lourde (20 psi) ou le rayonnement thermique (3ème degré).
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Données d'atmosphère spécifiques (Cibles historiques) */}
                  {nearbyCity && (
                    <div className="pt-2 border-t border-zinc-900 text-[9px] text-zinc-400 space-y-1.5 bg-emerald-950/5 p-2 rounded border border-emerald-900/10">
                      <span className="font-bold uppercase tracking-wider text-[7.5px] text-emerald-400 block flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                        Calibrage de Référence Historique supplémentaire
                      </span>
                      
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-[9px] text-zinc-400">
                        <div>Pente Côtière :</div>
                        <div className="text-right text-zinc-200">{nearbyCity.topography.coastal_slope_percent}%</div>
                        <div>Manning littoral (n) :</div>
                        <div className="text-right text-zinc-200">{nearbyCity.topography.manning_coefficient_n}</div>
                        <div>Axe Troposphère :</div>
                        <div className="text-right text-zinc-200">{nearbyCity.atmosphere.tropopause_winter_km}/{nearbyCity.atmosphere.tropopause_summer_km} km</div>
                      </div>
                      
                      {nearbyCity.historical_context && nearbyCity.historical_context.weapon && (
                        <div className="text-[8.5px] font-sans text-emerald-400/80 border-t border-emerald-950/20 pt-1 leading-normal italic">
                          Écorché historique : {nearbyCity.historical_context.weapon} (~{nearbyCity.historical_context.yield_kt} kt), {nearbyCity.historical_context.date}.
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )
            ) : (
              <div className="text-[10.5px] text-zinc-400 bg-zinc-900/10 border border-zinc-800/40 rounded-lg p-2.5 text-center leading-normal font-sans shadow-inner">
                <div className="font-semibold text-zinc-300 mb-1">🛰️ Analyse d'Impact Détaillée disponible</div>
                Combinez la topographie locale, la démographie en temps réel et les bilans météo en <button type="button" onClick={() => setIsTargetAnalysisExpanded(true)} className="text-red-400 font-bold underline hover:text-red-300 pointer-events-auto">dépliant l'analyse satellite</button>.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
