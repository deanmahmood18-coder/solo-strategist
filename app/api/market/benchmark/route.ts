export const runtime = "edge";

import { NextResponse } from "next/server";

type BenchmarkPoint = {
  month: string;
  sp500: number;
};

const FALLBACK: BenchmarkPoint[] = [
  { month: "Mar 25", sp500: 100.0 },
  { month: "Apr",    sp500: 99.1  },
  { month: "May",    sp500: 105.4 },
  { month: "Jun",    sp500: 110.8 },
  { month: "Jul",    sp500: 113.3 },
  { month: "Aug",    sp500: 115.1 },
  { month: "Sep",    sp500: 119.6 },
  { month: "Oct",    sp500: 121.1 },
  { month: "Nov",    sp500: 121.2 },
  { month: "Dec",    sp500: 123.0 },
  { month: "Jan 26", sp500: 124.7 },
  { month: "Feb",    sp500: 124.3 },
];

let cache: { data: BenchmarkPoint[]; ts: number } | null = null;
const TTL = 3_600_000; // 1 hour

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json(cache.data);
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(FALLBACK);
  }

  try {
    // Fetch SPY monthly candles from March 2025 to now
    const from = Math.floor(new Date("2025-03-01").getTime() / 1000);
    const to = Math.floor(Date.now() / 1000);

    const res = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=SPY&resolution=M&from=${from}&to=${to}&token=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.s !== "ok" || !data.c || data.c.length < 2) {
      return NextResponse.json(FALLBACK);
    }

    const basePrice = data.c[0];
    const points: BenchmarkPoint[] = data.c.map((close: number, i: number) => {
      const ts = data.t[i] * 1000;
      const date = new Date(ts);
      const monthIdx = date.getMonth();
      const year = date.getFullYear();

      let label = MONTH_LABELS[monthIdx];
      // Add year suffix for clarity on first month and January
      if (i === 0 || monthIdx === 0) {
        label = `${label} ${String(year).slice(2)}`;
      }

      return {
        month: label,
        sp500: Math.round((close / basePrice) * 100 * 10) / 10,
      };
    });

    cache = { data: points, ts: Date.now() };
    return NextResponse.json(points);
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
