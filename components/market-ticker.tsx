"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type Quote = {
  symbol: string;
  label: string;
  price: number;
  change: number;
  changePercent: number;
};

export function MarketTicker() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchQuotes() {
      try {
        const res = await fetch("/api/market");
        const data: Quote[] = await res.json();
        if (active) {
          setQuotes(data);
          setLoaded(true);
        }
      } catch {
        /* silent — ticker simply stays hidden until data loads */
      }
    }

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 60_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (!loaded) {
    return (
      <div className="h-9 border-b border-slate-800 bg-slate-950" />
    );
  }

  return (
    <div className="overflow-hidden border-b border-slate-800 bg-slate-950">
      <div className="flex animate-ticker-scroll whitespace-nowrap">
        {/* Duplicate for seamless loop */}
        {[0, 1].map((pass) => (
          <div key={pass} className="flex shrink-0 items-center gap-8 px-6 py-2">
            {quotes.map((q) => {
              const isPositive = q.change >= 0;
              return (
                <span key={`${pass}-${q.symbol}`} className="inline-flex items-center gap-2 text-xs">
                  <span className="font-medium text-slate-500">{q.label}</span>
                  <span className="tabular-nums text-slate-300">
                    {q.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`inline-flex items-center gap-0.5 tabular-nums ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {isPositive ? "+" : ""}{q.changePercent.toFixed(2)}%
                  </span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
