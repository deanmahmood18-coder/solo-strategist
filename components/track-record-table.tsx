"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";

import { calculateReturn, trackRecordData, type TrackRecordItem, type ThesisStatus } from "@/data/track-record";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type SortKey =
  | "prediction"
  | "datePublished"
  | "entryPrice"
  | "currentPrice"
  | "return"
  | "benchmarkReturn"
  | "status"
  | "thesisStatus";

const thesisColors: Record<ThesisStatus, string> = {
  "Playing Out": "bg-emerald-900/30 text-emerald-200",
  "Broken - Exited": "bg-rose-900/30 text-rose-200",
  "Value Trap - Monitoring": "bg-amber-900/30 text-amber-200",
  "Pending": "bg-slate-800/50 text-slate-400",
};

type MarketQuote = {
  symbol: string;
  price: number;
};

export function TrackRecordTable() {
  const [statusFilter, setStatusFilter] = useState<"All" | TrackRecordItem["status"]>("All");
  const [sortKey, setSortKey] = useState<SortKey>("datePublished");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});

  useEffect(() => {
    let active = true;

    async function fetchPrices() {
      try {
        const res = await fetch("/api/market");
        const data: MarketQuote[] = await res.json();
        if (!active) return;
        const prices: Record<string, number> = {};
        for (const q of data) {
          if (q.symbol === "GOOGL" || q.symbol === "AMZN") {
            prices[q.symbol] = q.price;
          }
        }
        if (Object.keys(prices).length > 0) {
          setLivePrices(prices);
        }
      } catch { /* use static fallback */ }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 300_000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const data = useMemo(() => {
    if (Object.keys(livePrices).length === 0) return trackRecordData;
    return trackRecordData.map((item) => {
      if (item.ticker && livePrices[item.ticker]) {
        return { ...item, currentPrice: livePrices[item.ticker] };
      }
      return item;
    });
  }, [livePrices]);

  const rows = useMemo(() => {
    const filtered =
      statusFilter === "All"
        ? data
        : data.filter((item) => item.status === statusFilter);

    const sorted = [...filtered].sort((a, b) => {
      const returnA = calculateReturn(a);
      const returnB = calculateReturn(b);

      const values: Record<SortKey, string | number> = {
        prediction: a.prediction,
        datePublished: new Date(a.datePublished).getTime(),
        entryPrice: a.entryPrice,
        currentPrice: a.currentPrice,
        return: returnA,
        benchmarkReturn: a.benchmarkReturn,
        status: a.status,
        thesisStatus: a.thesisStatus,
      };

      const compareValues: Record<SortKey, string | number> = {
        prediction: b.prediction,
        datePublished: new Date(b.datePublished).getTime(),
        entryPrice: b.entryPrice,
        currentPrice: b.currentPrice,
        return: returnB,
        benchmarkReturn: b.benchmarkReturn,
        status: b.status,
        thesisStatus: b.thesisStatus,
      };

      const left = values[sortKey];
      const right = compareValues[sortKey];
      const order = sortDirection === "asc" ? 1 : -1;

      if (typeof left === "string" && typeof right === "string") {
        return left.localeCompare(right) * order;
      }

      return ((left as number) - (right as number)) * order;
    });

    return sorted;
  }, [sortDirection, sortKey, statusFilter, data]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  }

  const columns: [SortKey, string][] = [
    ["prediction", "Prediction"],
    ["datePublished", "Date"],
    ["entryPrice", "Entry"],
    ["currentPrice", "Current"],
    ["return", "Return"],
    ["benchmarkReturn", "Benchmark"],
    ["thesisStatus", "Thesis Status"],
    ["status", "Outcome"],
  ];

  return (
    <section className="rounded-sm border border-slate-700/60 bg-slate-900/80 p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif text-2xl text-champagne">Track Record</h3>
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="statusFilter" className="text-xs uppercase tracking-wider text-slate-500">
            Filter
          </label>
          <select
            id="statusFilter"
            className="rounded-sm border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs text-slate-300"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "All" | TrackRecordItem["status"])}
          >
            <option value="All">All</option>
            <option value="Correct">Correct</option>
            <option value="Wrong">Wrong</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[960px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-[10px] uppercase tracking-[0.12em] text-slate-400">
              {columns.map(([key, label]) => (
                <th key={key} className="px-3 py-3 font-medium">
                  <Button
                    variant="subtle"
                    size="sm"
                    className="h-auto p-0 text-[10px] uppercase tracking-[0.12em]"
                    onClick={() => handleSort(key)}
                  >
                    {label}
                    <ArrowDownUp className="ml-1.5 h-3 w-3" />
                  </Button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => {
              const rowReturn = calculateReturn(item);
              return (
                <tr key={`${item.prediction}-${item.datePublished}`} className="border-b border-slate-800/60">
                  <td className="px-3 py-3.5 font-medium text-slate-100">{item.prediction}</td>
                  <td className="px-3 py-3.5 text-xs text-slate-400">{formatDate(item.datePublished)}</td>
                  <td className="px-3 py-3.5 tabular-nums text-slate-300">${item.entryPrice.toFixed(2)}</td>
                  <td className="px-3 py-3.5 tabular-nums text-slate-300">${item.currentPrice.toFixed(2)}</td>
                  <td
                    className={`px-3 py-3.5 tabular-nums font-medium ${
                      rowReturn >= 0 ? "text-emerald-300" : "text-rose-300"
                    }`}
                  >
                    {rowReturn >= 0 ? "+" : ""}{rowReturn.toFixed(1)}%
                  </td>
                  <td className="px-3 py-3.5 tabular-nums text-slate-400">{item.benchmarkReturn.toFixed(1)}%</td>
                  <td className="px-3 py-3.5">
                    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${thesisColors[item.thesisStatus]}`}>
                      {item.thesisStatus}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        item.status === "Correct"
                          ? "bg-emerald-900/30 text-emerald-200"
                          : item.status === "Wrong"
                            ? "bg-rose-900/30 text-rose-200"
                            : "bg-slate-800/50 text-slate-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
