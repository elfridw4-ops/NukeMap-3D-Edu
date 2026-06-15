import React from 'react';
import { BlastRadii, EnvironmentParams, CasualtyReport } from '../../types';
import { ImpactGauge } from './ImpactGauge';
import { AlertTriangle, Users, Building, Activity, Zap } from 'lucide-react';

export interface ImpactDashboardSectionProps {
  radii: BlastRadii;
  environmentParams: EnvironmentParams;
  casualtyReport?: CasualtyReport;
}

export function ImpactDashboardSection({
  radii,
  environmentParams,
  casualtyReport
}: ImpactDashboardSectionProps) {
  return (
    <section className="space-y-4 pt-2 border-t border-zinc-800/50">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2 flex-wrap">
        <AlertTriangle className="w-4 h-4" />
        Tableau des Impacts <span className="text-[10px] font-mono bg-zinc-800/80 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-normal">Cercles Concentriques</span>
      </h2>
      <div className="space-y-4 p-4 border border-zinc-800/50 bg-zinc-900/40 rounded-xl backdrop-blur-sm">
        <ImpactGauge 
          label="Boule de Feu (Vaporisation)" 
          radius={radii.fireball} 
          colorClass="bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]" 
          maxRadius={radii.thermal1st} 
        />
        {environmentParams.explosionType === 'surface' && radii.crater > 0 && (
          <ImpactGauge 
            label="Cratère de Détonation" 
            radius={radii.crater} 
            colorClass="bg-zinc-700 border border-black/40" 
            maxRadius={radii.thermal1st} 
          />
        )}
        <ImpactGauge 
          label="Surpression (20 psi - Ruine Totale) " 
          radius={radii.heavyBlast} 
          colorClass="bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
          maxRadius={radii.thermal1st} 
        />
        <ImpactGauge 
          label="Surpression (5 psi - Collapsus Moyen)" 
          radius={radii.moderateBlast} 
          colorClass="bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.5)]" 
          maxRadius={radii.thermal1st} 
        />
        <ImpactGauge 
          label="Surpression (1-2 psi - Dégâts Légers)" 
          radius={radii.lightBlast} 
          colorClass="bg-zinc-450" 
          maxRadius={radii.thermal1st} 
        />
        <ImpactGauge 
          label="Brûlures Thermiques (3ème degré)" 
          radius={radii.thermal3rd} 
          colorClass="bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" 
          maxRadius={radii.thermal1st} 
        />
        <ImpactGauge 
          label="Brûlures Thermiques (2ème degré)" 
          radius={radii.thermal2nd} 
          colorClass="bg-orange-400" 
          maxRadius={radii.thermal1st} 
        />
        <ImpactGauge 
          label="Brûlures Thermiques (1er degré)" 
          radius={radii.thermal1st} 
          colorClass="bg-yellow-300" 
          maxRadius={radii.thermal1st} 
        />
        {environmentParams.explosionType === 'surface' && (
           <ImpactGauge 
             label="Retombées (Longueur Plume)" 
             radius={radii.heavyBlast * ((Math.max(1, environmentParams.windSpeed) / 10) + 1) * 3} 
             colorClass="bg-rose-950 border border-red-900/40" 
             maxRadius={radii.heavyBlast * ((Math.max(1, environmentParams.windSpeed) / 10) + 1) * 3} 
           />
        )}
      </div>
      
      {casualtyReport && (
        <div className="mt-4 p-4 border border-red-900/40 bg-red-950/20 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Bilan Humain & Matériel (Estimatif)
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-black/40 border border-zinc-800 p-2 rounded">
               <span className="block text-zinc-500 mb-1">Population Base</span>
               <span className="font-mono text-zinc-300">{casualtyReport.populationTotal.toLocaleString()}</span>
            </div>
            <div className="bg-black/40 border border-zinc-800 p-2 rounded">
               <span className="block text-zinc-500 mb-1">Mortalité Immédiate</span>
               <span className="font-mono text-red-500">{casualtyReport.fatalities.toLocaleString()}</span>
            </div>
            <div className="bg-black/40 border border-zinc-800 p-2 rounded">
               <span className="block text-zinc-500 mb-1">Blessés Graves</span>
               <span className="font-mono text-orange-500">{casualtyReport.graveInjures.toLocaleString()}</span>
            </div>
            <div className="bg-black/40 border border-zinc-800 p-2 rounded">
               <span className="block text-zinc-500 mb-1">Exposés aux Radiations</span>
               <span className="font-mono text-yellow-500">{casualtyReport.radiationExposed.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-2 pt-2 border-t border-red-900/20">
            <h4 className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> Infrastructures Détruites</h4>
            <div className="flex justify-between text-xs text-zinc-300 bg-black/30 p-1.5 rounded">
               <span>Hôpitaux/Centres de soin</span>
               <span className="font-mono text-red-400">{casualtyReport.hospitalsAffected}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-300 bg-black/30 p-1.5 rounded">
               <span>Écoles/Unités d'éducation</span>
               <span className="font-mono text-red-400">{casualtyReport.schoolsAffected}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
