import React from 'react';
import { cn } from '../../lib/utils';

export interface ImpactGaugeProps {
  label: string;
  radius: number;
  colorClass: string;
  maxRadius: number;
}

export function ImpactGauge({ label, radius, colorClass, maxRadius }: ImpactGaugeProps) {
  const percent = maxRadius > 0 ? Math.min(100, Math.max(0, (radius / maxRadius) * 100)) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">{label}</span>
        <span className="text-xs font-mono text-zinc-200">{radius >= 1000 ? (radius/1000).toFixed(2) + ' km' : Math.round(radius) + ' m'}</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-950/80 rounded-full overflow-hidden border border-zinc-800">
        <div className={cn("h-full rounded-full transition-all duration-700 ease-out", colorClass)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
