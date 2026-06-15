import React from 'react';
import { cn } from '../../lib/utils';

export interface CustomSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  colorClass: string;
}

export function CustomSlider({ min, max, step = 1, value, onChange, colorClass }: CustomSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="relative w-full h-1.5 bg-zinc-950 rounded-full border border-zinc-800/80 overflow-visible group flex items-center">
      <div 
        className={cn("absolute left-0 h-full rounded-full pointer-events-none", colorClass)} 
        style={{ width: `${percentage}%` }}
      />
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div 
        className="absolute w-3.5 h-3.5 bg-zinc-200 rounded-full border-2 border-zinc-900 pointer-events-none shadow-sm transition-transform duration-100 ease-out group-active:scale-125 group-hover:bg-white z-20"
        style={{ left: `calc(${percentage}% - 7px)` }}
      />
    </div>
  );
}
