import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeaponConfig, EnvironmentParams } from '../../types';
import { calculateTsunamiMetrics, estimateClosestSeaDistanceKm } from '../../lib/nuclearMath';
import { CustomSlider } from './CustomSlider';
import { Wind, Waves, AlertTriangle, MapPin, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EnvironmentSectionProps {
  weapon: WeaponConfig;
  customYield: number;
  target: { lng: number; lat: number } | null;
  environmentParams: EnvironmentParams;
  setEnvironmentParams: (params: EnvironmentParams) => void;
  targetDetails: {
    isWater: boolean;
    name?: string;
    country?: string;
    city?: string;
    detected: boolean;
    loading: boolean;
  };
  setSelectionMode: (mode: 'target' | 'origin') => void;
  onSearch: (lng: number, lat: number) => void;
}

export function EnvironmentSection({
  weapon,
  customYield,
  target,
  environmentParams,
  setEnvironmentParams,
  targetDetails,
  setSelectionMode,
  onSearch,
}: EnvironmentSectionProps) {
  const [openHelpKey, setOpenHelpKey] = useState<'windDir' | 'windSpeed' | 'manning' | null>(null);
  const effectiveYield = weapon.id === 'custom' ? customYield : weapon.yieldKt;

  // Passe coastalDepthM et manningN pour garantir une cohérence totale avec la carte et les calculs globaux
  const tsunami = calculateTsunamiMetrics(
    effectiveYield,
    environmentParams.oceanDepthM ?? 2000,
    environmentParams.shoreDistanceKm ?? 143,
    environmentParams.beachSlopePct ?? 2.0,
    environmentParams.terrainDamping ?? 1.5,
    targetDetails.isWater,
    environmentParams.coastalDepthM ?? 8,
    environmentParams.manningN ?? 0.050
  );

  const isMaritimeEligible = tsunami.isEligible;
  const points = tsunami.depthProfile;
  const svgW = 220;
  const svgH = 80;

  // Find max wave height for scaling
  const maxWH = Math.max(...points.map(p => p.waveHeightM), 1);
  const maxDepth = Math.max(...points.map(p => p.depthM), 100);

  const projectedPoints = points.map((p, idx) => {
    const x = (idx / (points.length - 1)) * svgW;
    const yCrest = 35 - (p.waveHeightM / maxWH) * 26;
    const yFloor = 38 + (p.depthM / maxDepth) * 35;
    return { x, yCrest, yFloor, ...p };
  });

  const crestPath = projectedPoints.map(p => `${p.x.toFixed(1)},${p.yCrest.toFixed(1)}`).join(' L ');
  const floorPath = projectedPoints.map(p => `${p.x.toFixed(1)},${p.yFloor.toFixed(1)}`).join(' L ');
  const waterPolygon = `M 0,35 L ${crestPath} L ${svgW},${projectedPoints[projectedPoints.length - 1].yFloor.toFixed(1)} L ${floorPath.split(' L ').reverse().join(' L ')} Z`;

  const toggleHelp = (key: 'windDir' | 'windSpeed' | 'manning') => {
    setOpenHelpKey(prev => (prev === key ? null : key));
  };

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
        <Wind className="w-4 h-4" />
        Environnement & Détonation
      </h2>
      <div className="space-y-3 p-3 bg-zinc-900/30 border border-zinc-800/60 rounded-lg backdrop-blur-sm">
        <div className="space-y-2">
          <span className="text-xs text-zinc-400 block">Type d'explosion</span>
          <div className="flex bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setEnvironmentParams({...environmentParams, explosionType: 'airburst'})}
              className={cn(
                "flex-1 min-h-11 py-2 text-xs font-medium rounded transition-colors cursor-pointer",
                environmentParams.explosionType === 'airburst' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Airburst
            </button>
            <button
              type="button"
              onClick={() => setEnvironmentParams({...environmentParams, explosionType: 'surface'})}
              className={cn(
                "flex-1 min-h-11 py-2 text-xs font-medium rounded transition-colors cursor-pointer",
                environmentParams.explosionType === 'surface' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Surface Burst
            </button>
          </div>
        </div>

        <AnimatePresence>
          {environmentParams.explosionType === 'surface' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-zinc-800/50 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-zinc-300 font-medium">Direction du vent (Degrés)</span>
                    <button
                      type="button"
                      onClick={() => toggleHelp('windDir')}
                      aria-expanded={openHelpKey === 'windDir'}
                      aria-label="Afficher l'aide sur la direction du vent"
                      className="text-zinc-400 hover:text-zinc-200 p-1 rounded cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {openHelpKey === 'windDir' && (
                    <div className="bg-zinc-900 text-zinc-300 text-[11px] p-2.5 rounded-lg border border-zinc-700/60 leading-snug">
                      Détermine l'azimut de dispersion du panache radioactif (fallout).
                    </div>
                  )}
                  <div className="flex gap-4 items-center">
                    <CustomSlider 
                      ariaLabel="Direction du vent en degrés"
                      min={0} max={360} 
                      value={environmentParams.windDirection} 
                      onChange={(v) => setEnvironmentParams({...environmentParams, windDirection: v})} 
                      colorClass="bg-zinc-500 shadow-[0_0_12px_rgba(161,161,170,0.6)]" 
                    />
                    <span className="text-xs font-mono tabular-nums w-10 text-right text-zinc-200">{environmentParams.windDirection}°</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-zinc-300 font-medium">Vitesse du vent (km/h)</span>
                    <button
                      type="button"
                      onClick={() => toggleHelp('windSpeed')}
                      aria-expanded={openHelpKey === 'windSpeed'}
                      aria-label="Afficher l'aide sur la vitesse du vent"
                      className="text-zinc-400 hover:text-zinc-200 p-1 rounded cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {openHelpKey === 'windSpeed' && (
                    <div className="bg-zinc-900 text-zinc-300 text-[11px] p-2.5 rounded-lg border border-zinc-700/60 leading-snug">
                      Détermine la longueur d'élongation du panache de retombées radioactives.
                    </div>
                  )}
                  <div className="flex gap-4 items-center">
                    <CustomSlider 
                      ariaLabel="Vitesse du vent en kilomètres par heure"
                      min={0} max={100} 
                      value={environmentParams.windSpeed} 
                      onChange={(v) => setEnvironmentParams({...environmentParams, windSpeed: v})} 
                      colorClass="bg-zinc-500 shadow-[0_0_12px_rgba(161,161,170,0.6)]" 
                    />
                    <span className="text-xs font-mono tabular-nums w-10 text-right text-zinc-200">{environmentParams.windSpeed}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-3 mt-3 border-t border-zinc-800/50 flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="text-xs text-zinc-200 font-medium block">Champignon 3D</span>
            <p className="text-[10px] text-zinc-400">Nuage de points volumétrique</p>
          </div>
          <button 
            type="button"
            aria-label="Activer ou désactiver le champignon 3D"
            aria-pressed={environmentParams.showMushroomCloud}
            onClick={() => setEnvironmentParams({...environmentParams, showMushroomCloud: !environmentParams.showMushroomCloud})}
            className={cn(
              "w-11 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 border border-zinc-700 cursor-pointer shrink-0",
              environmentParams.showMushroomCloud ? "bg-red-600 border-red-500" : "bg-zinc-800"
            )}
          >
            <span className={cn(
              "absolute top-0.5 left-0.5 w-4 h-4 bg-zinc-200 rounded-full transition-transform shadow-sm",
              environmentParams.showMushroomCloud ? "translate-x-5 bg-white" : "translate-x-0"
            )} />
          </button>
        </div>

        <div className="pt-3 mt-3 border-t border-zinc-800/50 flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="text-xs text-zinc-200 font-medium block">Impact Maritime</span>
            <p className="text-[10px] text-zinc-400">Rayon d'inondation côtière estimé</p>
          </div>
          <button 
            type="button"
            aria-label="Activer ou désactiver l'impact maritime"
            aria-pressed={environmentParams.maritimeImpact}
            onClick={() => setEnvironmentParams({...environmentParams, maritimeImpact: !environmentParams.maritimeImpact})}
            className={cn(
              "w-11 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 border border-zinc-700 cursor-pointer shrink-0",
              environmentParams.maritimeImpact ? "bg-blue-600 border-blue-500" : "bg-zinc-800"
            )}
          >
            <span className={cn(
              "absolute top-0.5 left-0.5 w-4 h-4 bg-zinc-200 rounded-full transition-transform shadow-sm",
              environmentParams.maritimeImpact ? "translate-x-5 bg-white" : "translate-x-0"
            )} />
          </button>
        </div>

        <AnimatePresence>
          {environmentParams.maritimeImpact && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 pt-3 border-t border-zinc-800/40 space-y-4 overflow-hidden"
            >
              {/* ZONE 1 : CONFIGURATION SCIENTIFIQUE DU RELIEF ET DE LA DISTANCE */}
              <div className="space-y-4 bg-zinc-950/60 p-3.5 border border-zinc-800 rounded-xl shadow-inner">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-1">
                  <Waves className="w-3.5 h-3.5 text-sky-500" />
                  Géophysique & Propagation
                </div>

                {/* Auto-distance (GPS) switch */}
                <div className="flex justify-between items-center bg-zinc-900/40 p-2.5 border border-zinc-800 rounded-lg">
                  <div className="space-y-0.5">
                    <span className="text-xs text-zinc-200 font-medium block">Distance auto (GPS)</span>
                    <p className="text-[10px] text-zinc-400 leading-none">Estime la mer la plus proche</p>
                  </div>
                  <button 
                    type="button"
                    aria-label="Activer ou désactiver l'estimation automatique de distance côtière"
                    aria-pressed={environmentParams.autoShoreDistance !== false}
                    onClick={() => setEnvironmentParams({
                      ...environmentParams, 
                      autoShoreDistance: environmentParams.autoShoreDistance === false ? true : false
                    })}
                    className={cn(
                      "w-11 h-6 rounded-full relative transition-colors focus:outline-none border border-zinc-700 shrink-0 cursor-pointer",
                      environmentParams.autoShoreDistance !== false ? "bg-sky-600 border-sky-500" : "bg-zinc-800"
                    )}
                    id="auto-distance-btn"
                  >
                    <span className={cn(
                      "absolute top-0.5 left-0.5 w-4 h-4 bg-zinc-200 rounded-full transition-transform shadow-sm",
                      environmentParams.autoShoreDistance !== false ? "translate-x-5 bg-white" : "translate-x-0"
                    )} />
                  </button>
                </div>

                {/* Geo-Anchor presentation (under GPS auto distance) */}
                {environmentParams.autoShoreDistance !== false && target && (
                  <div className="p-2.5 bg-sky-950/20 text-sky-300 rounded border border-sky-900/30 flex flex-col gap-1">
                    <span className="font-semibold uppercase tracking-wider text-[8px] text-zinc-400">Localement estimé :</span>
                    <span className="font-sans text-xs text-zinc-100 flex items-center gap-1 tabular-nums">
                      🌊 {targetDetails.isWater ? "Directement en eau libre (0 km)" : `${environmentParams.shoreDistanceKm?.toFixed(1)} km du rivage`}
                    </span>
                    {!targetDetails.isWater && (
                      <span className="text-[9px] text-zinc-400 font-mono italic leading-none mt-0.5">
                        Littoral de référence : {estimateClosestSeaDistanceKm(target.lat, target.lng).name}
                      </span>
                    )}
                  </div>
                )}

                {/* Shore distance slider (manual override) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-300 flex items-center gap-1.5">
                      Distance de la mer
                      {environmentParams.autoShoreDistance !== false && (
                        <span className="text-[8px] font-bold text-sky-400 px-1 bg-sky-950/40 border border-sky-800/40 rounded">GPS AUTO</span>
                      )}
                    </span>
                    <span className="font-mono tabular-nums text-zinc-200">{(environmentParams.shoreDistanceKm ?? 5).toFixed(1)} km</span>
                  </div>
                  <div className={cn("transition-all duration-200", environmentParams.autoShoreDistance !== false ? "opacity-35 pointer-events-none" : "opacity-100")}>
                    <CustomSlider 
                      ariaLabel="Distance de la mer en kilomètres"
                      min={0.5} max={1500} step={1}
                      value={environmentParams.shoreDistanceKm ?? 5}
                      onChange={(val) => setEnvironmentParams({...environmentParams, shoreDistanceKm: val})}
                      colorClass="bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]"
                    />
                  </div>
                </div>

                {/* Coefficient de Manning */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-300">Coeff. de Manning (n)</span>
                      <button
                        type="button"
                        onClick={() => toggleHelp('manning')}
                        aria-expanded={openHelpKey === 'manning'}
                        aria-label="Afficher l'aide sur le coefficient de Manning"
                        className="text-zinc-400 hover:text-zinc-200 p-0.5 rounded cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-mono tabular-nums text-zinc-200">{(environmentParams.manningN ?? 0.050).toFixed(3)}</span>
                  </div>
                  {openHelpKey === 'manning' && (
                    <div className="bg-zinc-900 text-zinc-300 text-[11px] p-2.5 rounded-lg border border-zinc-700/60 leading-snug">
                      Représente la rugosité du terrain : une valeur élevée (ville dense, forêt) amortit l'onde plus vite qu'une surface lisse.
                    </div>
                  )}
                  <CustomSlider 
                    ariaLabel="Coefficient de rugosité de Manning"
                    min={0.010} max={0.100} step={0.005}
                    value={environmentParams.manningN ?? 0.050}
                    onChange={(val) => setEnvironmentParams({...environmentParams, manningN: val})}
                    colorClass="bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.5)]"
                  />
                </div>
              </div>

              {/* VÉRIFICATION DE L'ÉLIGIBILITÉ ET AFFICHAGE DES ALÉAS */}
              {!isMaritimeEligible ? (
                <div className="space-y-3 bg-amber-950/20 border border-amber-900/40 p-3.5 rounded-lg">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    Onde amortie ou d'énergie insuffisante
                  </div>
                  
                  {effectiveYield < 20 ? (
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      La puissance de l'ogive (<span className="text-amber-400 font-mono tabular-nums font-medium">{effectiveYield} kt</span>) est inférieure au minimum d'excitation de <span className="font-mono text-zinc-100 font-medium">20 kt</span> requis pour libérer l'onde capable de lever une vague, même directement en mer.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        L'onde de choc s'est dissipée avant d'exciter la mer la plus proche (<span className="text-orange-400 font-mono tabular-nums font-semibold">{environmentParams.shoreDistanceKm?.toFixed(1)} km</span>, amortissement relief <span className="font-mono text-zinc-200 font-bold">x{environmentParams.terrainDamping?.toFixed(1)}</span>).
                      </p>
                      <div className="p-2.5 bg-black/40 border border-zinc-800 rounded font-mono tabular-nums text-[10px] space-y-0.5">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Énergie Source :</span>
                          <span className="text-zinc-200">{effectiveYield >= 1000 ? `${(effectiveYield/1000).toFixed(1)} Mt` : `${effectiveYield} kt`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400 font-semibold">Énergie transmise à la côte :</span>
                          <span className="text-amber-400 font-bold">{tsunami.effectiveCoastYield.toFixed(1)} kt</span>
                        </div>
                        <div className="flex justify-between text-[9px] text-zinc-400 mt-1 border-t border-zinc-800 pt-1">
                          <span>Seuil critique requis :</span>
                          <span>20.0 kt</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Augmentez la puissance ou téléportez la cible vers un littoral :
                      </p>
                      
                      <div className="space-y-2 pt-2.5 border-t border-zinc-800/50">
                        <h4 className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                          Cibles côtières stratégiques :
                        </h4>
                        <div className="flex flex-col gap-1.5 font-sans">
                          {[
                            { name: "Marseille (Mer Méditerranée - littoral)", lat: 43.2965, lng: 5.3698 },
                            { name: "Brest (Océan Atlantique - Rade)", lat: 48.3904, lng: -4.4861 },
                            { name: "San Francisco (Pacifique - littoral)", lat: 37.7749, lng: -122.4194 },
                            { name: "Fosse Abyssale de Tokyo", lat: 35.0116, lng: 139.9168 }
                          ].map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSelectionMode('target');
                                onSearch(preset.lng, preset.lat);
                              }}
                              className="w-full min-h-10 text-left text-[11px] font-sans px-2.5 py-2 bg-zinc-950/60 hover:bg-blue-950/30 border border-zinc-800 hover:border-blue-800/60 rounded transition-all duration-200 flex items-center justify-between text-zinc-300 hover:text-sky-300 group cursor-pointer"
                            >
                              <span>{preset.name}</span>
                              <span className="text-[9px] font-mono opacity-70 group-hover:opacity-100 transition-opacity text-sky-400 flex items-center gap-1 shrink-0">
                                Sélectionner ➔
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5 bg-blue-950/20 border border-blue-900/30 p-3 rounded-lg shadow-inner">
                  {/* Energy transmission metrics */}
                  {!targetDetails.isWater && (
                    <div className="p-2.5 bg-zinc-950/80 border border-sky-900/40 rounded flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-semibold">Énergie d'Onde Transmise au Littoral</span>
                      <div className="text-sm font-bold font-mono tabular-nums tracking-tight text-emerald-400 mt-0.5">
                        {tsunami.effectiveCoastYield >= 1000 ? `${(tsunami.effectiveCoastYield/1000).toFixed(2)} Mt` : `${tsunami.effectiveCoastYield.toFixed(1)} kt`}
                      </div>
                      <span className="text-[9px] text-zinc-300 mt-0.5 leading-tight tabular-nums">
                        Propagation terrestre sur {environmentParams.shoreDistanceKm?.toFixed(1)} km ({Math.round(tsunami.effectiveCoastYield * 100 / Math.max(0.01, effectiveYield))}% d'énergie conservée)
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-1.5 bg-zinc-950/60 rounded-md border border-zinc-800/60">
                      <div className="text-[8px] text-zinc-400 font-semibold uppercase tracking-wider">Vague Source</div>
                      <div className="text-xs font-mono tabular-nums font-bold text-sky-400 mt-0.5">{tsunami.initialWaveHeightM} m</div>
                    </div>
                    <div className="p-1.5 bg-zinc-950/60 rounded-md border border-zinc-800/60">
                      <div className="text-[8px] text-zinc-400 font-semibold uppercase tracking-wider">Vague Rivage</div>
                      <div className="text-xs font-mono tabular-nums font-bold text-cyan-400 mt-0.5">{tsunami.shoreWaveHeightM} m</div>
                    </div>
                    <div className="p-1.5 bg-zinc-950/60 rounded-md border border-zinc-800/60">
                      <div className="text-[8px] text-zinc-400 font-semibold uppercase tracking-wider">Déferlement (Run-up)</div>
                      <div className="text-xs font-mono tabular-nums font-bold text-blue-400 mt-0.5">{tsunami.runUpHeightM} m</div>
                    </div>
                    <div className="p-1.5 bg-zinc-950/60 rounded-md border border-zinc-800/60">
                      <div className="text-[8px] text-zinc-400 font-semibold uppercase tracking-wider">Inondation (Run-in)</div>
                      <div className="text-xs font-mono tabular-nums font-bold text-teal-400 mt-0.5 flex items-center justify-center">
                        {tsunami.inundationDistanceM >= 1000 ? `${(tsunami.inundationDistanceM/1000).toFixed(2)} km` : `${Math.round(tsunami.inundationDistanceM)} m`}
                      </div>
                    </div>
                  </div>

                  {/* Animated logarithmic profiles graph */}
                  <div className="relative mt-2 bg-zinc-950/80 border border-zinc-800/80 p-2.5 rounded flex flex-col items-center select-none">
                    <div className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                      Profil Logarithmique & Shoaling
                    </div>
                    <svg width={svgW} height={svgH} className="overflow-visible">
                      <line 
                        x1={0} y1={35} x2={svgW} y2={35} 
                        stroke="rgb(39, 39, 42)" 
                        strokeWidth="1" 
                        strokeDasharray="2 2"
                      />
                      
                      <path 
                        d={waterPolygon} 
                        fill="url(#tsunamiGradient)" 
                        opacity="0.25"
                      />
                      
                      <path 
                        d={`M 0,${projectedPoints[0].yCrest.toFixed(1)} L ${crestPath}`} 
                        fill="none" 
                        stroke="#38bdf8" 
                        strokeWidth="1.5"
                      />
                      
                      <path 
                        d={`M 0,${projectedPoints[0].yFloor.toFixed(1)} L ${floorPath}`} 
                        fill="none" 
                        stroke="#52525b" 
                        strokeWidth="1.2"
                        strokeDasharray="3 2"
                      />

                      <text x={4} y={15} fill="rgb(161, 161, 170)" fontSize="7" fontFamily="monospace">Blast ({maxDepth}m)</text>
                      <text x={svgW - 4} y={15} textAnchor="end" fill="rgb(161, 161, 170)" fontSize="7" fontFamily="monospace">Côte ({environmentParams.coastalDepthM ?? 8}m)</text>
                      
                      <text x={4} y={svgH - 3} fill="#38bdf8" fontSize="7.5" fontFamily="monospace">Wave: {projectedPoints[0].waveHeightM}m</text>
                      <text x={svgW - 4} y={svgH - 3} textAnchor="end" fill="#2dd4bf" fontSize="7.5" fontFamily="monospace">Run-up: {tsunami.runUpHeightM}m</text>

                      <defs>
                        <linearGradient id="tsunamiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0284c7" />
                          <stop offset="100%" stopColor="#0f766e" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
