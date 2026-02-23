import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { researchArticles } from "@/data/research";

export function FeaturedInsight() {
  const article =
    researchArticles.find((a) => a.slug === "amazon-infrastructure-harvesting-cycle") ??
    researchArticles[0];
  if (!article) return null;

  const teaser = article.summary.split(".").slice(0, 2).join(".") + ".";

  return (
    <section className="relative overflow-hidden border-y border-slate-800 bg-slate-900/50 py-16 md:py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-midnight/30 via-transparent to-champagne/[0.04]" />

      <div className="container-shell relative grid items-center gap-10 lg:grid-cols-[1fr_380px]">
        {/* Text column */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne/80">
            Top of Mind
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-slate-100 sm:text-4xl">
            {article.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
            {teaser}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {article.takeaways.slice(0, 1).map((t) => (
              <p key={t} className="text-sm italic text-slate-500">
                &ldquo;{t}&rdquo;
              </p>
            ))}
          </div>
          <Button asChild size="lg" className="mt-8">
            <Link href={`/research/${article.slug}`}>Access Research</Link>
          </Button>
        </div>

        {/* Visual column — real thumbnail or report mockup */}
        <div className="mx-auto hidden w-full max-w-[320px] lg:block">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900">
            {article.thumbnail ? (
              <>
                {/* Header bar */}
                <div className="border-b border-slate-700 bg-slate-800/50 px-5 py-4">
                  <div className="h-1.5 w-14 rounded-full bg-champagne/40" />
                  <p className="mt-2.5 font-serif text-[11px] leading-snug text-slate-300">
                    {article.title}
                  </p>
                  <p className="mt-1 text-[9px] uppercase tracking-widest text-slate-500">
                    {article.researchType}
                  </p>
                </div>
                {/* Thumbnail image */}
                <div className="p-4">
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    width={280}
                    height={160}
                    className="w-full rounded-sm border border-slate-700"
                  />
                </div>
                {/* Faux body lines */}
                <div className="px-5 pb-4">
                  <div className="space-y-1.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 rounded-full bg-slate-700/50"
                        style={{ width: `${80 + Math.sin(i) * 15}%` }}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-6">
                <svg viewBox="0 0 200 80" className="w-full opacity-30" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    points="0,60 30,52 60,55 90,40 120,35 150,28 180,22 200,18"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
