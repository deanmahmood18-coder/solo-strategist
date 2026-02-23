"use client";

import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

type SparklineProps = {
  symbol?: string;
  width?: number;
  height?: number;
};

type CandlePoint = { time: number; close: number };

export function SparklineChart({ symbol = "SPY", width = 120, height = 40 }: SparklineProps) {
  const [data, setData] = useState<CandlePoint[]>([]);

  useEffect(() => {
    let active = true;
    fetch(`/api/market/candles?symbol=${symbol}`)
      .then((r) => r.json())
      .then((d: CandlePoint[]) => {
        if (active) setData(d);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [symbol]);

  if (data.length < 2) {
    return <div style={{ width, height }} className="rounded bg-midnight/[0.03] dark:bg-slate-800/50" />;
  }

  const isUp = data[data.length - 1].close >= data[0].close;
  const strokeColor = isUp ? "#059669" : "#dc2626";

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="close"
            stroke={strokeColor}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
