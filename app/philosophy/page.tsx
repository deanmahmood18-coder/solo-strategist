import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { AboutCIO } from "@/components/about-cio";

export const metadata: Metadata = {
  title: "Philosophy | The Solo Strategist",
  description: "Long-horizon investment philosophy, process architecture, and open-source research mission."
};

export default function PhilosophyPage() {
  return (
    <div className="container-shell py-14">
      {/* ── Hero header ── */}
      <FadeIn>
        <header className="reading-width">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-champagne/70">
            Framework &amp; Conviction
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-slate-100 sm:text-5xl">
            Investment Philosophy
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            Capital markets reward those who think in decades and act in moments.
            The Solo Strategist exists to document durable ideas before consensus
            labels them obvious — optimising for quality of process over frequency
            of opinion.
          </p>
          <div className="mt-8 h-px w-16 bg-champagne/30" />
        </header>
      </FadeIn>

      {/* ── Principles ── */}
      <article className="reading-width mt-16 space-y-14">
        <FadeIn>
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne/50">
              Principle I
            </p>
            <h2 className="mt-2 font-serif text-2xl text-slate-100 sm:text-3xl">
              Secular Before Cyclical
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <p>
                The most asymmetric returns emerge from structural shifts that
                compound over years — infrastructure rebuilding, energy security,
                the repricing of digital operating leverage. These are the themes
                we pursue.
              </p>
              <p>
                Cyclical signals are not ignored; they inform position timing and
                sizing. But the thesis itself must rest on multi-year drivers
                whose trajectory does not depend on a single quarter&rsquo;s data.
                We seek durability first and entry price second.
              </p>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne/50">
              Principle II
            </p>
            <h2 className="mt-2 font-serif text-2xl text-slate-100 sm:text-3xl">
              Valuation as Risk Control
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <p>
                Valuation discipline is not an aesthetic preference — it is the
                mechanism that absorbs analytical error. Every thesis carries a
                probability distribution, and the margin of safety is what
                prevents a wrong assumption from becoming a permanent loss.
              </p>
              <p>
                Each position is sized with explicit downside assumptions,
                benchmark-relative opportunity cost, and a defined exit
                framework. We do not hold convictions without prices attached to
                them.
              </p>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne/50">
              Principle III
            </p>
            <h2 className="mt-2 font-serif text-2xl text-slate-100 sm:text-3xl">
              Public Accountability
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <p>
                Every forecast is timestamped, archived, and measured against its
                benchmark. We record thesis evolution — not only outcomes —
                because intellectual honesty compounds over cycles just as
                capital does.
              </p>
              <p>
                When a thesis fails, we publish the post-mortem with the same
                rigour we applied to the original conviction. Selective
                disclosure is the antithesis of credible research.
              </p>
            </div>
          </section>
        </FadeIn>
      </article>

      {/* ── Open-Source Mission ── */}
      <FadeIn>
        <div className="reading-width mt-20">
          <div className="rounded-sm border border-slate-700/50 bg-gradient-to-br from-champagne/[0.03] to-transparent p-8 sm:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne/60">
              Our Mission
            </p>
            <h2 className="mt-2 font-serif text-2xl text-slate-100 sm:text-3xl">
              Open-Source Research
            </h2>
            <div className="mt-1.5 h-px w-10 bg-champagne/40" />
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
              <p>
                The Solo Strategist provides institutional-grade research as a
                public ledger of intellectual capital. Every thesis is published
                with full methodology, explicit entry points, and measurable
                benchmarks.
              </p>
              <p>
                There are no paywalls, no selective disclosure, and no
                retroactive edits. The analytical frameworks employed by
                institutional allocators should not be gated behind a terminal
                subscription — they should be freely available to any investor
                willing to do the work.
              </p>
              <p className="border-l-2 border-champagne/30 pl-4 text-sm italic text-slate-400">
                Research here will always be free — designed to give the retail
                investor a definitive institutional edge.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── About the CIO ── */}
      <FadeIn>
        <div className="mt-20 border-t border-slate-800 pt-4">
          <AboutCIO />
        </div>
      </FadeIn>
    </div>
  );
}
