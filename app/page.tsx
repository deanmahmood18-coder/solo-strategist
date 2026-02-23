import Link from "next/link";

import { CategoryPreview } from "@/components/category-preview";
import { FadeIn } from "@/components/fade-in";
import { FeaturedInsight } from "@/components/featured-insight";
import { Hero } from "@/components/hero";
import { IntelligenceFeed } from "@/components/intelligence-feed";
import { MarketTicker } from "@/components/market-ticker";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { researchArticles } from "@/data/research";
import { calculateReturn, trackRecordData } from "@/data/track-record";

function computeStats() {
  const resolved = trackRecordData.filter((item) => item.status !== "Pending");
  const correct = trackRecordData.filter((item) => item.status === "Correct");

  const winRate =
    resolved.length > 0
      ? Math.round((correct.length / resolved.length) * 100)
      : 0;

  const avgOutperformance =
    correct.length > 0
      ? correct.reduce(
          (acc, item) => acc + (calculateReturn(item) - item.benchmarkReturn),
          0
        ) / correct.length
      : 0;

  return { winRate, avgOutperformance };
}

export default function HomePage() {
  const featured = researchArticles.slice(0, 2);
  const { winRate, avgOutperformance } = computeStats();

  return (
    <>
      <MarketTicker />
      <Hero />

      <FadeIn>
        <FeaturedInsight />
      </FadeIn>

      <FadeIn delay={100}>
        <CategoryPreview />
      </FadeIn>

      <FadeIn delay={100}>
        <section className="container-shell py-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Latest Publications
              </p>
              <h2 className="mt-1 font-serif text-3xl text-champagne">
                Featured Research
              </h2>
            </div>
            <Link
              href="/research"
              className="text-sm text-slate-200 underline-offset-4 hover:underline"
            >
              View all research
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((article) => (
              <article
                key={article.slug}
                className="rounded-sm border border-slate-700 bg-slate-900 p-6 shadow-paper transition-shadow hover:shadow-lg"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-champagne/60">
                  {article.researchType}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-slate-100">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {article.summary}
                </p>
                <Link
                  href={`/research/${article.slug}`}
                  className="mt-5 inline-block text-sm text-champagne hover:underline"
                >
                  Read article
                </Link>
              </article>
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={100}>
        <IntelligenceFeed />
      </FadeIn>

      <FadeIn>
        <section className="border-y border-slate-800 bg-slate-900/50 py-16">
          <div className="container-shell grid gap-10 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-champagne/55">
                Win Rate
              </p>
              <p className="mt-3 font-serif text-4xl text-slate-100">
                {winRate}%
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Resolved positions
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-champagne/55">
                Avg. Outperformance
              </p>
              <p className="mt-3 font-serif text-4xl text-slate-100">
                +{avgOutperformance.toFixed(1)} pts
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Correct calls vs. benchmark
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-champagne/55">
                Next Publication
              </p>
              <p className="mt-3 font-serif text-2xl text-slate-100">
                Quarterly Regime Note
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Scheduled for March 2026
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <NewsletterSignup />
      </FadeIn>
    </>
  );
}
