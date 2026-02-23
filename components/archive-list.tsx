"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { researchArticles } from "@/data/research";
import { formatDate } from "@/lib/utils";

export function ArchiveList() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const lowered = query.toLowerCase();
    return [...researchArticles]
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
      .filter(
        (item) =>
          item.title.toLowerCase().includes(lowered) ||
          item.category.toLowerCase().includes(lowered) ||
          item.summary.toLowerCase().includes(lowered)
      );
  }, [query]);

  return (
    <section className="space-y-6">
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Search archive</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by topic, category, or title"
          className="h-11 w-full rounded-sm border border-slate-600 bg-slate-900 px-3 text-sm"
        />
      </label>

      <ul className="space-y-3">
        {filtered.map((article) => (
          <li key={article.slug} className="rounded-sm border border-slate-700 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-champagne/55">{formatDate(article.publishedAt)}</p>
            <Link href={`/research/${article.slug}`} className="mt-2 block font-serif text-2xl text-slate-100 hover:underline">
              {article.title}
            </Link>
            <p className="mt-1 text-sm text-slate-300">{article.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
