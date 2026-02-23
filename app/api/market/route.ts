export const runtime = "edge";

import { NextResponse } from "next/server";

type MarketQuote = {
  symbol: string;
  label: string;
  price: number;
  change: number;
  changePercent: number;
};

const INSTRUMENTS = [
  { finnhub: "SPY",   label: "S&P 500" },
  { finnhub: "EWU",   label: "FTSE 100" },
  { finnhub: "EWJ",   label: "Nikkei 225" },
  { finnhub: "GLD",   label: "Gold" },
  { finnhub: "BNO",   label: "Brent Crude" },
  { finnhub: "GOOGL", label: "Alphabet" },
  { finnhub: "AMZN",  label: "Amazon" },
];

const FALLBACK: MarketQuote[] = [
  { symbol: "SPY",   label: "S&P 500",    price: 6021.47, change: 23.18,  changePercent: 0.39 },
  { symbol: "EWU",   label: "FTSE 100",   price: 38.12,   change: -0.09,  changePercent: -0.24 },
  { symbol: "EWJ",   label: "Nikkei 225", price: 69.84,   change: 0.67,   changePercent: 0.97 },
  { symbol: "GLD",   label: "Gold",       price: 189.52,  change: 1.85,   changePercent: 0.99 },
  { symbol: "BNO",   label: "Brent Crude",price: 25.73,   change: -0.42,  changePercent: -1.61 },
  { symbol: "GOOGL", label: "Alphabet",   price: 199.36,  change: 1.22,   changePercent: 0.41 },
  { symbol: "AMZN",  label: "Amazon",     price: 198.79,  change: -0.54,  changePercent: -0.27 },
];

let cache: { data: MarketQuote[]; ts: number } | null = null;
const TTL = 60_000;

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json(cache.data);
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(FALLBACK);
  }

  try {
    const results = await Promise.allSettled(
      INSTRUMENTS.map(async (inst) => {
        const res = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${inst.finnhub}&token=${apiKey}`,
          { next: { revalidate: 60 } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Validate the response has real data (not zeros)
        if (!data.c || data.c === 0) throw new Error("No price data");

        return {
          symbol: inst.finnhub,
          label: inst.label,
          price: data.c,
          change: data.d ?? 0,
          changePercent: data.dp ?? 0,
        } as MarketQuote;
      })
    );

    const quotes = results
      .filter((r): r is PromiseFulfilledResult<MarketQuote> => r.status === "fulfilled")
      .map((r) => r.value);

    // If less than half succeeded, use fallback to avoid showing partial/broken data
    if (quotes.length < 3) {
      return NextResponse.json(FALLBACK);
    }

    cache = { data: quotes, ts: Date.now() };
    return NextResponse.json(quotes);
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
