import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { BlastRadii, CasualtyDistancePoint, CasualtyReport } from '../../types';
import { calculateCasualtiesByDistance } from '../../lib/nuclearMath';

export interface CasualtiesByDistanceChartProps {
  radii: BlastRadii;
  casualtyReport: CasualtyReport;
  weaponType?: 'fission' | 'fusion' | 'dirty';
}

const CHART_HEIGHT_PX = 180;

// Formate les grands nombres sur l'axe Y de manière compacte pour rester lisible dans une colonne étroite
const formatCompactCasualtyCount = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) return '0';
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1).replace(/\.0$/, '')}k`;
  }
  return `${Math.round(value)}`;
};

interface ChartTooltipPayloadItem {
  payload?: CasualtyDistancePoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
}

// Infobulle Bunker Chic affichant le détail numérique exact par zone radiale
function CasualtyDistanceTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0 || !payload[0]?.payload) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="bg-zinc-950/95 border border-zinc-700/90 rounded-lg px-2.5 py-2 shadow-2xl text-[11px] backdrop-blur-md max-w-[215px]">
      <p className="font-semibold text-zinc-100 leading-tight">{point.zoneName}</p>
      <p className="font-mono text-[10px] text-zinc-400 mb-1.5">
        Distance : {point.rangeLabel}
      </p>
      <div className="space-y-1 font-mono tabular-nums">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-xs bg-red-500 shrink-0" />
            Mortalité
          </span>
          <span className="text-red-400 font-medium">
            {point.fatalities.toLocaleString('fr-FR')}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-xs bg-orange-500 shrink-0" />
            Graves
          </span>
          <span className="text-orange-400 font-medium">
            {point.graveInjures.toLocaleString('fr-FR')}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-xs bg-yellow-500 shrink-0" />
            Légers
          </span>
          <span className="text-yellow-400 font-medium">
            {point.lightInjures.toLocaleString('fr-FR')}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 pt-1 mt-1 border-t border-zinc-800 text-zinc-100 font-semibold">
          <span>Total zone</span>
          <span>{point.total.toLocaleString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );
}

export function CasualtiesByDistanceChart({
  radii,
  casualtyReport,
  weaponType = 'fission',
}: CasualtiesByDistanceChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);

  // Mesure la largeur réelle du conteneur pour éviter les avertissements Recharts (width/height = 0)
  // lorsque le tiroir mobile démarre replié (display: none).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const nextWidth = Math.floor(el.getBoundingClientRect().width);
      setChartWidth((prev) => (prev === nextWidth ? prev : nextWidth));
    };

    updateWidth();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateWidth();
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Recalcule la distribution radiale uniquement lorsque les rayons, le bilan ou le type d'arme changent
  const data = useMemo(
    () => calculateCasualtiesByDistance(radii, casualtyReport, weaponType),
    [radii, casualtyReport, weaponType]
  );

  const totalImpacted = useMemo(
    () => data.reduce((sum, item) => sum + item.total, 0),
    [data]
  );

  return (
    <figure
      className="bg-black/40 border border-zinc-800/80 rounded-lg p-3 space-y-2 min-w-0"
      aria-label="Comparaison des pertes humaines estimées selon la distance au point d'impact"
    >
      <figcaption className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-zinc-200 truncate">
          Pertes par distance
        </span>
        <span className="text-[10px] font-mono text-zinc-400 shrink-0">
          Rayon (km)
        </span>
      </figcaption>

      {totalImpacted <= 0 ? (
        <div className="h-[160px] flex items-center justify-center text-center px-3 rounded border border-zinc-800/60 bg-zinc-950/60">
          <p className="text-xs text-zinc-400">
            Aucune perte humaine estimée dans les couronnes calculées.
          </p>
        </div>
      ) : (
        <>
          <div ref={containerRef} className="w-full h-[180px] min-w-0">
            {chartWidth > 0 && (
              <BarChart
                width={chartWidth}
                height={CHART_HEIGHT_PX}
                data={data}
                margin={{ top: 8, right: 8, left: -10, bottom: 2 }}
                barCategoryGap="22%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  vertical={false}
                />
                <XAxis
                  dataKey="distanceLabel"
                  padding={{ left: 4, right: 4 }}
                  tick={{
                    fill: '#a1a1aa',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                  axisLine={{ stroke: '#3f3f46' }}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  tickFormatter={formatCompactCasualtyCount}
                  tick={{
                    fill: '#a1a1aa',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                  content={<CasualtyDistanceTooltip />}
                />
                <Bar
                  dataKey="fatalities"
                  name="Mortalité"
                  stackId="casualties"
                  fill="#ef4444"
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="graveInjures"
                  name="Blessés graves"
                  stackId="casualties"
                  fill="#f97316"
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="lightInjures"
                  name="Blessés légers"
                  stackId="casualties"
                  fill="#eab308"
                  radius={[3, 3, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            )}
          </div>

          <div
            className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-1 border-t border-zinc-800/70 text-[10px] font-mono text-zinc-300"
            aria-label="Légende du graphique des pertes"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-red-500 shrink-0" />
              Mortalité
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-orange-500 shrink-0" />
              Graves
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-yellow-500 shrink-0" />
              Légers
            </span>
          </div>
        </>
      )}
    </figure>
  );
}
