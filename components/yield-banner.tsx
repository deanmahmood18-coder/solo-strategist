"use client";

import { useEffect, useState } from "react";

type YieldData = {
  label: string;
  region: "US" | "UK";
  tenor: string;
  yield: number;
  change: number;
};

export function YieldBanner() {
  const [yields, setYields] = useState<YieldData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchYields() {
      try {
        const res = await fetch("/api/yields");
        const data: YieldData[] = await res.json();
        if (active && data.length > 0) {
          setYields(data);
          setLoaded(true);
        }
      } catch { /* silent */ }
    }

    fetchYields();
    const interval = setInterval(fetchYields, 1_800_000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  if (!loaded) {
    return <div className="h-8 border-b border-slate-800/50 bg-slate-950" />;
  }

  return (
    <div className="border-b border-slate-800/50 bg-slate-950">
      <div className="container-shell flex items-center justify-center gap-1 py-1.5 overflow-x-auto">
        <span className="mr-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          Yields
        </span>
        {yields.map((y, i) => (
          <span key={y.label} className="inline-flex items-center gap-1 whitespace-nowrap">
            {i > 0 && (
              <span className="mx-1.5 text-slate-800">|</span>
            )}
            <span className="text-[10px] font-medium text-slate-500">
              {y.label}:
            </span>
            <span className="text-[10px] tabular-nums text-slate-300">
              {y.yield.toFixed(2)}%
            </span>
            <span
              className={`text-[9px] tabular-nums ${
                y.change > 0
                  ? "text-emerald-500/70"
                  : y.change < 0
                    ? "text-rose-500/70"
                    : "text-slate-600"
              }`}
            >
              {y.change > 0 ? "+" : ""}{y.change.toFixed(2)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
