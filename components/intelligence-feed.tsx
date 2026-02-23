"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { intelligenceFeed, type IntelligenceItem } from "@/data/intelligence-feed";

export function IntelligenceFeed() {
  const [items, setItems] = useState<IntelligenceItem[]>(intelligenceFeed);

  useEffect(() => {
    let active = true;
    fetch("/api/news")
      .then((r) => r.json())
      .then((data: IntelligenceItem[]) => {
        if (active && data.length > 0) {
          setItems(data.slice(0, 10));
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <section className="container-shell py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Curated Wire
          </p>
          <h2 className="mt-1 font-serif text-3xl text-champagne">
            Global Intelligence
          </h2>
        </div>
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-champagne"
        >
          View Intelligence Ledger
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="divide-y divide-slate-700/60 rounded-sm border border-slate-700/60 bg-slate-900/80">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <span className="shrink-0 text-[11px] tabular-nums text-slate-600">
              {item.time}
            </span>
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-champagne/50">
              {item.source}
            </span>
            <p className="text-sm leading-relaxed text-slate-300">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
