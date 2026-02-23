"use client";

import { useEffect, useState } from "react";

type SectorTilt = {
  sector: string;
  weight: number;
  anchor: string;
};

const sectors: SectorTilt[] = [
  {
    sector: "Energy Midstream",
    weight: 2,
    anchor:
      "Structural re-rating driven by infrastructure harvesting and AI power demand.",
  },
  {
    sector: "AI Infrastructure",
    weight: 2,
    anchor:
      "The physical layer: Custom silicon and data center energy solutions.",
  },
  {
    sector: "Robotics",
    weight: 1,
    anchor:
      "Transitioning from warehouse automation to commercial robotaxi scaling, with a path to general humanoids.",
  },
  {
    sector: "Gold",
    weight: 1,
    anchor:
      "Long-term safe haven asset and defensive anchor amidst late-cycle volatility.",
  },
  {
    sector: "Silver",
    weight: 1,
    anchor:
      "Industrial proxy for electrification and solar manufacturing demand.",
  },
  {
    sector: "Space Technology",
    weight: 1,
    anchor:
      "LEO constellations as the new global backhaul for AWS/Cloud compute.",
  },
  {
    sector: "Industrials",
    weight: 1,
    anchor: "Alpha in grid modernization and specialized manufacturing.",
  },
  {
    sector: "Financials",
    weight: 0,
    anchor: "Monitoring NIM compression in a stabilizing rate environment.",
  },
  {
    sector: "Quantum Computing",
    weight: 0,
    anchor:
      "Long-horizon bull thesis; monitoring technical frontier for 10-year entry window.",
  },
  {
    sector: "Consumer Discretionary",
    weight: -2,
    anchor: "Duration risk and tightening household credit cycles.",
  },
];

function weightLabel(w: number): string {
  if (w >= 2) return "+2 OW";
  if (w === 1) return "+1";
  if (w === 0) return "0 N";
  if (w === -1) return "-1";
  return "-2 UW";
}

function tileColors(w: number) {
  if (w >= 2)
    return {
      bg: "bg-emerald-950/60",
      border: "border-emerald-700/50",
      badge: "bg-emerald-900/80 text-emerald-300",
      glow: "hover:shadow-[0_0_18px_-4px_rgba(16,185,129,0.25)]",
    };
  if (w === 1)
    return {
      bg: "bg-emerald-950/30",
      border: "border-emerald-800/30",
      badge: "bg-emerald-900/50 text-emerald-400",
      glow: "hover:shadow-[0_0_14px_-4px_rgba(16,185,129,0.15)]",
    };
  if (w === 0)
    return {
      bg: "bg-slate-900/60",
      border: "border-slate-700/50",
      badge: "bg-slate-800/80 text-slate-400",
      glow: "hover:shadow-[0_0_14px_-4px_rgba(148,163,184,0.12)]",
    };
  if (w === -1)
    return {
      bg: "bg-rose-950/30",
      border: "border-rose-800/30",
      badge: "bg-rose-900/50 text-rose-400",
      glow: "hover:shadow-[0_0_14px_-4px_rgba(244,63,94,0.15)]",
    };
  return {
    bg: "bg-rose-950/60",
    border: "border-rose-700/50",
    badge: "bg-rose-900/80 text-rose-300",
    glow: "hover:shadow-[0_0_18px_-4px_rgba(244,63,94,0.25)]",
  };
}

export function SectorHeatmap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const overweight = sectors.filter((s) => s.weight > 0);
  const neutral = sectors.filter((s) => s.weight === 0);
  const underweight = sectors.filter((s) => s.weight < 0);

  const renderTile = (s: SectorTilt, globalIdx: number) => {
    const c = tileColors(s.weight);
    return (
      <div
        key={s.sector}
        className={`group relative rounded-sm border p-4 transition-all duration-500 ${c.bg} ${c.border} ${c.glow}`}
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transitionDelay: `${globalIdx * 55}ms`,
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-200 leading-snug">
            {s.sector}
          </h3>
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums tracking-wide ${c.badge}`}
          >
            {weightLabel(s.weight)}
          </span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          {s.anchor}
        </p>
      </div>
    );
  };

  return (
    <section className="mb-12">
      <div className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Current Positioning
        </p>
        <h2 className="mt-1 font-serif text-2xl text-slate-100">
          Sector Conviction Heatmap
        </h2>
      </div>

      {/* Three-column conviction buckets */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-700/40 rounded-sm border border-slate-700/40 overflow-hidden">

        {/* ── Left column: Overweight ── */}
        <div>
          <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-950/25 border-b border-emerald-800/25">
            <span className="block h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-400">
                High Conviction
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Overweight · Long Bias
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-3">
            {overweight.map((s, i) => renderTile(s, i))}
          </div>
        </div>

        {/* ── Center column: Neutral ── */}
        <div>
          <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-800/30 border-b border-slate-700/30">
            <span className="block h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Neutral / Monitoring
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Watch List</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-3">
            {neutral.map((s, i) => renderTile(s, overweight.length + i))}
          </div>
        </div>

        {/* ── Right column: Underweight ── */}
        <div>
          <div className="flex items-center gap-2.5 px-4 py-3 bg-rose-950/25 border-b border-rose-800/25">
            <span className="block h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-rose-400">
                Underweight
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Avoid · Reduce</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-3">
            {underweight.map((s, i) =>
              renderTile(s, overweight.length + neutral.length + i)
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
