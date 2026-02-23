import { ExternalLink } from "lucide-react";

type NewsCardProps = {
  time: string;
  source: string;
  title: string;
  summary: string;
  url?: string;
  category: string;
};

const categoryColors: Record<string, string> = {
  "central-banks": "text-blue-400/80",
  "global-trade": "text-amber-400/80",
  "geopolitics": "text-rose-400/80",
  "markets": "text-emerald-400/80",
  "business": "text-champagne/60",
};

export function NewsCard({ time, source, title, summary, url, category }: NewsCardProps) {
  return (
    <article className="group rounded-sm border border-slate-800/60 bg-slate-900/50 p-5 transition-all hover:border-slate-700/80 hover:shadow-[0_0_20px_rgba(212,175,55,0.04)]">
      <div className="flex items-baseline gap-3">
        <span className="shrink-0 text-[11px] tabular-nums text-slate-600">
          {time}
        </span>
        <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] ${categoryColors[category] ?? "text-slate-500"}`}>
          {source}
        </span>
      </div>

      <h3 className="mt-2.5 text-sm font-medium leading-relaxed text-slate-200">
        {title}
      </h3>

      <div className="mt-3 border-l-2 border-champagne/20 pl-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-champagne/40">
          Strategist&rsquo;s Summary
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
          {summary}
        </p>
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-slate-500 transition hover:text-champagne"
        >
          Primary Source
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </article>
  );
}
