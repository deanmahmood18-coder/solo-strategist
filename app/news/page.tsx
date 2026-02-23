"use client";

import { useEffect, useState } from "react";
import { NewsCard } from "@/components/news-card";
import { intelligenceFeed } from "@/data/intelligence-feed";
import { generateSummary } from "@/lib/news-summary";

type NewsItem = {
  id: string;
  time: string;
  source: string;
  title: string;
  category: string;
  url?: string;
  publishedAt: string;
};

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>(
    intelligenceFeed.map((item) => ({ ...item, url: undefined }))
  );

  useEffect(() => {
    let active = true;

    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        const data: NewsItem[] = await res.json();
        if (active && data.length > 0) {
          setItems(data);
        }
      } catch { /* use fallback */ }
    }

    fetchNews();
    const interval = setInterval(fetchNews, 300_000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  return (
    <div className="container-shell py-14">
      <header className="mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Real-Time Analysis
        </p>
        <h1 className="mt-2 font-serif text-4xl text-slate-100 sm:text-5xl">
          Intelligence Ledger
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
          A curated feed of macro and equity intelligence, distilled through our
          capital allocation framework. Each entry includes a strategist&rsquo;s
          assessment of why it matters.
        </p>
        <div className="mt-6 h-px w-16 bg-champagne/30" />
      </header>

      <div className="grid gap-4">
        {items.map((item) => (
          <NewsCard
            key={item.id}
            time={item.time}
            source={item.source}
            title={item.title}
            summary={generateSummary(item.category, item.source, item.title)}
            url={item.url}
            category={item.category}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="py-20 text-center text-sm text-slate-500">
          No intelligence available. Check back shortly.
        </div>
      )}
    </div>
  );
}
