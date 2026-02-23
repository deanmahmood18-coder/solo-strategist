"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type ChartBlockProps<T extends Record<string, string | number>> = {
  title: string;
  data: T[];
  dataKey: keyof T;
  xKey: keyof T;
  benchmarkKey?: keyof T;
  metricNarrative: string;
};

export function ChartBlock<T extends Record<string, string | number>>({
  title,
  data,
  dataKey,
  xKey,
  benchmarkKey,
  metricNarrative
}: ChartBlockProps<T>) {
  return (
    <section className="rounded-sm border border-slate-700/60 bg-slate-900/80 p-5">
      <h3 className="mb-4 font-serif text-2xl text-champagne">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(148, 163, 184, 0.12)" />
            <XAxis
              dataKey={xKey as string}
              tick={{ fontSize: 11, fill: "rgba(148, 163, 184, 0.7)" }}
              stroke="rgba(148, 163, 184, 0.2)"
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "rgba(148, 163, 184, 0.7)" }}
              stroke="rgba(148, 163, 184, 0.2)"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 2,
                border: "1px solid rgba(148, 163, 184, 0.2)",
                backgroundColor: "#0f172a",
                color: "#e2e8f0",
                fontSize: 12,
              }}
              labelStyle={{ color: "#D4AF37", fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey={dataKey as string}
              stroke="#D4AF37"
              strokeWidth={2.8}
              dot={false}
              name="Solo Strategist"
            />
            {benchmarkKey ? (
              <Line
                type="monotone"
                dataKey={benchmarkKey as string}
                stroke="rgba(148, 163, 184, 0.5)"
                strokeWidth={1.8}
                strokeDasharray="6 3"
                dot={false}
                name="S&P 500"
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      {benchmarkKey && (
        <div className="mt-3 flex items-center gap-5 text-[10px] uppercase tracking-widest text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-4 bg-champagne" /> Solo Strategist
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-4 border-t border-dashed border-slate-500" /> S&P 500
          </span>
        </div>
      )}
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{metricNarrative}</p>
    </section>
  );
}
