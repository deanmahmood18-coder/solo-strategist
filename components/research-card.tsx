"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, ArrowUpRight, BarChart3, TrendingUp, DollarSign, Globe } from "lucide-react";

import type { ResearchArticle } from "@/data/research";

function CategoryIcon({ category }: { category: ResearchArticle["category"] }) {
  const cls = "h-8 w-8 text-champagne/30";
  switch (category) {
    case "Macro":       return <Globe className={cls} />;
    case "Equities":    return <TrendingUp className={cls} />;
    case "Credit":      return <DollarSign className={cls} />;
    case "Commodities": return <BarChart3 className={cls} />;
  }
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
] as const;

function formatPublishedDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

type ResearchCardProps = {
  title: string;
  date: string;
  categoryLabel: string;
  researchType: string;
  summary: string;
  pdfUrl?: string;
  thumbnail?: string;
  slug: string;
  category: ResearchArticle["category"];
};

export function ResearchCard({
  title,
  date,
  categoryLabel,
  researchType,
  summary,
  pdfUrl,
  thumbnail,
  slug,
  category,
}: ResearchCardProps) {
  return (
    <article className="group relative flex gap-0 sm:gap-6 rounded-sm border border-slate-700/60 bg-slate-900/80 p-5 sm:p-7 transition-shadow hover:shadow-paper">
      {/* Thumbnail */}
      <div className="hidden sm:flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br from-champagne/[0.04] to-champagne/[0.08]">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            width={112}
            height={112}
            className="h-full w-full object-cover"
          />
        ) : (
          <CategoryIcon category={category} />
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-block rounded-[2px] bg-champagne/10 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.18em] text-champagne/80">
            {researchType}
          </span>
          <span className="text-xs text-slate-500">
            {formatPublishedDate(date)}
          </span>
          <span className="text-xs text-slate-500">
            &middot;&ensp;{categoryLabel}
          </span>
        </div>

        <h3 className="mt-3 font-serif text-xl leading-snug text-slate-100 group-hover:text-champagne sm:text-[22px]">
          {title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">
          {summary}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <Link
            href={`/research/${slug}`}
            className="inline-flex items-center gap-1.5 rounded-sm bg-champagne px-4 py-2 text-xs font-medium uppercase tracking-widest text-slate-900 transition-colors hover:bg-champagne/90"
          >
            Read Report
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-champagne"
            >
              <FileText className="h-4 w-4" />
              PDF
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
