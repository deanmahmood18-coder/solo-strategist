"use client";

import { useMemo, useState } from "react";

import { researchArticles, researchCategories } from "@/data/research";
import { ResearchCard } from "@/components/research-card";

const tabs = researchCategories;

export function ResearchGrid() {
  const [active, setActive] = useState<(typeof tabs)[number]>("All");

  const articles = useMemo(
    () =>
      active === "All"
        ? researchArticles
        : researchArticles.filter((a) => a.category === active),
    [active]
  );

  return (
    <>
      <nav className="mb-10 border-b border-slate-700/60">
        <ul className="flex gap-0">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                type="button"
                onClick={() => setActive(tab)}
                className={`relative px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                  active === tab
                    ? "text-champagne"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab}
                {active === tab && (
                  <span className="absolute inset-x-0 -bottom-px h-[2px] bg-champagne" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mb-6 text-xs uppercase tracking-widest text-slate-500">
        {articles.length} {articles.length === 1 ? "report" : "reports"}
      </p>

      <div className="flex flex-col gap-5">
        {articles.map((article) => (
          <ResearchCard
            key={article.slug}
            title={article.title}
            date={article.publishedAt}
            categoryLabel={article.category}
            researchType={article.researchType}
            summary={article.summary}
            pdfUrl={article.pdfUrl}
            thumbnail={article.thumbnail}
            slug={article.slug}
            category={article.category}
          />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-serif text-xl text-slate-600">
            No reports published yet in this category.
          </p>
        </div>
      )}
    </>
  );
}
