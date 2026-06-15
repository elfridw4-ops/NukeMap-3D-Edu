import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeaponConfig } from '../../types';
import { WEAPON_PRESETS } from '../../lib/nuclearMath';
import { ShieldAlert, ChevronUp } from 'lucide-react';

export interface WeaponConfigSectionProps {
  weapon: WeaponConfig;
  setWeapon: (weapon: WeaponConfig) => void;
  customYield: number;
  setCustomYield: (val: number) => void;
}

export function WeaponConfigSection({
  weapon,
  setWeapon,
  customYield,
  setCustomYield,
}: WeaponConfigSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
        <ShieldAlert className="w-4 h-4" />
        Choix de l'arsenal
      </h2>
      
      <div className="space-y-2">
        <label className="text-xs text-zinc-400 font-medium tracking-wide">Préréglage historique</label>
        <div className="relative">
          <select 
            className="w-full appearance-none bg-zinc-950 border border-zinc-800/80 rounded-lg p-2.5 pl-3 pr-10 text-xs outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all shadow-inner text-zinc-200"
            value={weapon.id}
            onChange={(e) => {
              const selected = WEAPON_PRESETS.find(w => w.id === e.target.value);
              if (selected) setWeapon(selected);
            }}
          >
            {WEAPON_PRESETS.map((w) => (
              <option key={w.id} value={w.id} className="bg-zinc-900 border-none">
                {w.name} ({w.yieldKt >= 1000 ? `${w.yieldKt/1000} Mt` : `${w.yieldKt} kt`})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-zinc-500">
            <ChevronUp className="w-4 h-4 rotate-180" />
          </div>
        </div>
        <p className="text-[10px] text-zinc-500 font-mono mt-1 px-1">{weapon.description}</p>
      </div>

      <AnimatePresence>
        {weapon.id === 'custom' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-3 mt-2 border-t border-zinc-800/50">
              <label className="text-xs text-zinc-400 font-medium tracking-wide">Puissance personnalisée (kt)</label>
              <input 
                type="number" 
                min="0.01"
                step="10"
                className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all font-mono shadow-inner text-zinc-200"
                value={customYield}
                onChange={(e) => setCustomYield(Number(e.target.value) || 0)}
              />
              <p className="text-[10px] text-zinc-500 px-1">
                1000 kt = 1 Mégatonne (Mt)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
