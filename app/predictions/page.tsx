import type { Metadata } from "next";
import {
  TrendingDown,
  Activity,
  PieChart,
  BarChart3,
  Target,
  Gauge,
} from "lucide-react";

import { BenchmarkChart } from "@/components/benchmark-chart";
import { ChartBlock } from "@/components/chart-block";
import { SectorHeatmap } from "@/components/sector-heatmap";
import { TrackRecordTable } from "@/components/track-record-table";
import { hitRateSeries, riskStats } from "@/data/predictions";

export const metadata: Metadata = {
  title: "Forecast Dashboard | The Solo Strategist",
  description:
    "Forecast dashboard with transparent track record and benchmark comparison.",
};

const metricGroups = [
  {
    groupLabel: "Risk Profile",
    accentClass: "text-rose-400",
    headerBg: "bg-rose-950/25",
    headerBorder: "border-rose-900/30",
    metrics: [
      {
        label: "Max Drawdown",
        value: `${riskStats.maxDrawdown}%`,
        sub: "Peak-to-trough decline",
        icon: TrendingDown,
        color: "text-rose-400",
      },
      {
        label: "Beta",
        value: riskStats.beta.toString(),
        sub: "Market sensitivity",
        icon: Gauge,
        color: "text-blue-400",
      },
    ],
  },
  {
    groupLabel: "Efficiency",
    accentClass: "text-champagne",
    headerBg: "bg-amber-950/20",
    headerBorder: "border-amber-900/20",
    metrics: [
      {
        label: "Sharpe Ratio",
        value: riskStats.sharpeRatio.toString(),
        sub: "Risk-adjusted return",
        icon: Activity,
        color: "text-champagne",
      },
      {
        label: "Sortino Ratio",
        value: riskStats.sortinoRatio.toString(),
        sub: "Downside risk-adjusted",
        icon: Target,
        color: "text-emerald-400",
      },
    ],
  },
  {
    groupLabel: "Active Management",
    accentClass: "text-slate-400",
    headerBg: "bg-slate-800/40",
    headerBorder: "border-slate-700/40",
    metrics: [
      {
        label: "Active Share",
        value: `${riskStats.activeShare}%`,
        sub: "Deviation from benchmark",
        icon: PieChart,
        color: "text-slate-300",
      },
      {
        label: "Information Ratio",
        value: riskStats.informationRatio.toString(),
        sub: "Alpha per unit tracking error",
        icon: BarChart3,
        color: "text-amber-400",
      },
    ],
  },
];

export default function PredictionsPage() {
  return (
    <div className="container-shell py-14">
      <header className="mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Performance & Accountability
        </p>
        <h1 className="mt-2 font-serif text-4xl text-slate-100 sm:text-5xl">
          Forecast Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
          A transparent log of published forecasts, benchmark-relative outcomes,
          and live thesis status. Every call is timestamped and tracked - no
          retroactive edits.
        </p>
        <div className="mt-6 h-px w-16 bg-champagne/30" />
      </header>

      <SectorHeatmap />

      {/* ─── Section Break: Positioning → Performance ─────────── */}
      <div className="my-10 flex items-center gap-4">
        <div className="h-[2px] w-6 rounded-full bg-champagne/40 shrink-0" />
        <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent" />
        <p className="shrink-0 px-2 text-[9px] font-bold uppercase tracking-[0.28em] text-slate-500">
          Risk &amp; Performance Ratios
        </p>
        <div className="h-px flex-1 bg-gradient-to-l from-slate-700 to-transparent" />
        <div className="h-[2px] w-6 rounded-full bg-champagne/40 shrink-0" />
      </div>

      {/* ─── Metric Pairs ──────────────────────────────────────── */}
      <div className="mb-12 grid gap-4 grid-cols-1 md:grid-cols-3">
        {metricGroups.map((group) => (
          <div
            key={group.groupLabel}
            className="overflow-hidden rounded-sm border border-slate-700/60 bg-slate-900/80"
          >
            {/* Group header */}
            <div
              className={`px-5 py-3 border-b ${group.headerBg} ${group.headerBorder}`}
            >
              <p
                className={`text-[9px] font-bold uppercase tracking-[0.24em] ${group.accentClass}`}
              >
                {group.groupLabel}
              </p>
            </div>

            {/* Metric rows */}
            <div className="divide-y divide-slate-800/60">
              {group.metrics.map(({ label, value, sub, icon: Icon, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 px-5 py-5"
                >
                  {/* Label block */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300 truncate">
                        {label}
                      </p>
                    </div>
                    <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                      {sub}
                    </p>
                  </div>

                  {/* Primary number */}
                  <p
                    className={`shrink-0 font-serif text-[2rem] leading-none tabular-nums ${color}`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Charts ────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BenchmarkChart />
        <ChartBlock
          title="Quarterly Hit Rate"
          data={hitRateSeries}
          xKey="quarter"
          dataKey="hitRate"
          metricNarrative="Signal calibration improved by 10 points over the trailing four-quarter window, reflecting iterative refinement of sector timing and entry discipline."
        />
      </div>

      <div className="mt-8">
        <TrackRecordTable />
      </div>
    </div>
  );
}
