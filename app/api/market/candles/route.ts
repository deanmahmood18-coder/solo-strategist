export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

type CandlePoint = { time: number; close: number };

const candleCache = new Map<string, { data: CandlePoint[]; ts: number }>();
const TTL = 300_000; // 5 minutes

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") ?? "SPY";

  const cached = candleCache.get(symbol);
  if (cached && Date.now() - cached.ts < TTL) {
    return NextResponse.json(cached.data);
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(generateMockCandles());
  }

  try {
    const to = Math.floor(Date.now() / 1000);
    const from = to - 7 * 24 * 60 * 60;
    const res = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=D&from=${from}&to=${to}&token=${apiKey}`
    );
    const data = await res.json();

    if (data.s !== "ok" || !data.c) {
      return NextResponse.json(generateMockCandles());
    }

    const candles: CandlePoint[] = data.t.map((t: number, i: number) => ({
      time: t,
      close: data.c[i],
    }));

    candleCache.set(symbol, { data: candles, ts: Date.now() });
    return NextResponse.json(candles);
  } catch {
    return NextResponse.json(generateMockCandles());
  }
}

function generateMockCandles(): CandlePoint[] {
  const now = Math.floor(Date.now() / 1000);
  const base = 100;
  return Array.from({ length: 7 }, (_, i) => ({
    time: now - (6 - i) * 86400,
    close: base + (Math.random() - 0.45) * 3 * (i + 1),
  }));
}
