"use client";

import { useEffect, useState } from "react";
import { ChartBlock } from "@/components/chart-block";
import { forecastPerformance } from "@/data/predictions";

type BenchmarkPoint = {
  month: string;
  sp500: number;
};

type MergedPoint = {
  month: string;
  strategist: number;
  sp500: number;
};

export function BenchmarkChart() {
  const [data, setData] = useState<MergedPoint[]>(forecastPerformance);

  useEffect(() => {
    let active = true;

    async function fetchBenchmark() {
      try {
        const res = await fetch("/api/market/benchmark");
        const benchmark: BenchmarkPoint[] = await res.json();
        if (!active || benchmark.length === 0) return;

        // Merge live S&P 500 data with strategist performance
        const merged: MergedPoint[] = forecastPerformance.map((fp, i) => ({
          month: fp.month,
          strategist: fp.strategist,
          sp500: benchmark[i]?.sp500 ?? fp.sp500,
        }));

        setData(merged);
      } catch { /* use fallback */ }
    }

    fetchBenchmark();
    return () => { active = false; };
  }, []);

  return (
    <ChartBlock
      title="Model Portfolio vs S&P 500"
      data={data}
      xKey="month"
      dataKey="strategist"
      benchmarkKey="sp500"
      metricNarrative="The Solo Strategist model portfolio has outperformed the S&P 500 by 12 points since inception (March 2025), generating a 35% total return against the benchmark's 23.1%."
    />
  );
}
