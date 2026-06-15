import React, { useState } from 'react';
import { WeaponConfig, LaunchParams, EnvironmentParams, BlastRadii } from '../types';
import { AlertTriangle, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { AutomaticGeoData } from '../lib/geoDataFetcher';

// Modular components
import { WeaponConfigSection } from './sidebar/WeaponConfigSection';
import { TargetConfigSection } from './sidebar/TargetConfigSection';
import { EnvironmentSection } from './sidebar/EnvironmentSection';
import { ImpactDashboardSection } from './sidebar/ImpactDashboardSection';

interface SidebarProps {
  weapon: WeaponConfig;
  setWeapon: (weapon: WeaponConfig) => void;
  customYield: number;
  setCustomYield: (val: number) => void;
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
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
  multiStrikeMode: boolean;
  setMultiStrikeMode: (mode: boolean) => void;
  pastStrikesCount: number;
  onClearPastStrikes: () => void;
  casualtyReport?: any;
}

export function Sidebar({
  weapon,
  setWeapon,
  customYield,
  setCustomYield,
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
  isSidebarOpen = true,
  setIsSidebarOpen,
  multiStrikeMode,
  setMultiStrikeMode,
  pastStrikesCount,
  onClearPastStrikes,
  casualtyReport
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex flex-col text-zinc-100 overflow-hidden hide-scrollbar transition-all duration-300 ease-in-out backdrop-blur-xl bg-zinc-950 shadow-2xl",
      // Desktop left panel layout: 300px fixed width, no rounded corners, fits full-screen height
      "md:relative md:top-0 md:left-0 md:w-[300px] md:h-screen md:max-h-screen md:rounded-none md:border-r md:border-t-0 md:border-b-0 md:border-l-0 md:border-zinc-800",
      !isSidebarOpen && "md:w-0 md:opacity-0 md:-translate-x-full md:pointer-events-none",
      // Mobile style: fixed bottom-sheet
      "fixed bottom-0 left-0 right-0 w-full rounded-t-3xl border-t border-zinc-800 z-30",
      isCollapsed ? "h-[75px] max-h-[75px]" : "h-[45vh] max-h-[45vh]"
    )}>
      {/* Mobile Drag Handle */}
      <div 
        className="w-full flex justify-center pt-3 pb-2 md:hidden cursor-pointer shrink-0" 
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="w-10 h-1.5 bg-zinc-700/80 rounded-full" />
      </div>

      <div 
        className="px-5 pb-4 md:py-5 md:px-5 border-b border-zinc-800/50 bg-zinc-900/30 flex justify-between items-center cursor-pointer md:cursor-default shrink-0"
        onClick={() => { if(window.innerWidth < 768) setIsCollapsed(!isCollapsed); }}
      >
        <div>
          <h1 className="text-xl font-bold font-sans tracking-tight mb-0.5 text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            NUKEMAP <span className="text-[10px] font-mono bg-zinc-800/80 text-zinc-400 px-2 py-0.5 rounded ml-1 border border-zinc-700 hidden sm:inline-block">EDU</span>
          </h1>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1 hidden md:block">
            Sys. Command // SIM-NC-01
          </p>
        </div>
        <button className="md:hidden text-zinc-400 hover:text-white p-2.5 rounded-full bg-zinc-800/50 transition-colors">
          <ChevronUp className={cn("w-5 h-5 transition-transform duration-300", isCollapsed ? "" : "rotate-180")} />
        </button>
      </div>

      <div className={cn(
        "p-5 flex-1 flex-col gap-6 overflow-y-auto hide-scrollbar",
        isCollapsed ? "hidden md:flex" : "flex"
      )}>
        
        {/* Weapon Arsenal */}
        <WeaponConfigSection 
          weapon={weapon}
          setWeapon={setWeapon}
          customYield={customYield}
          setCustomYield={setCustomYield}
        />

        {/* Targeting & Origin */}
        <TargetConfigSection 
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
          origin={origin}
          setOrigin={setOrigin}
          target={target}
          launchParams={launchParams}
          setLaunchParams={setLaunchParams}
          environmentParams={environmentParams}
          setEnvironmentParams={setEnvironmentParams}
          onSearch={onSearch}
          radii={radii}
          simulationMode={simulationMode}
          setSimulationMode={setSimulationMode}
          onLaunchMissile={onLaunchMissile}
          flightProgress={flightProgress}
          targetDetails={targetDetails}
          autoGeoData={autoGeoData}
          multiStrikeMode={multiStrikeMode}
          setMultiStrikeMode={setMultiStrikeMode}
          pastStrikesCount={pastStrikesCount}
          onClearPastStrikes={onClearPastStrikes}
          setWeapon={setWeapon}
        />

        {/* Environment & Volatility */}
        <EnvironmentSection 
          weapon={weapon}
          customYield={customYield}
          target={target}
          environmentParams={environmentParams}
          setEnvironmentParams={setEnvironmentParams}
          targetDetails={targetDetails}
          setSelectionMode={setSelectionMode}
          onSearch={onSearch}
        />

        {/* Blast Radii Stats Dashboard */}
        <ImpactDashboardSection 
          radii={radii}
          environmentParams={environmentParams}
          casualtyReport={casualtyReport}
        />

      </div>
    </div>
  );
}
