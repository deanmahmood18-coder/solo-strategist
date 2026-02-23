import type { Metadata } from "next";
import { AboutCIO } from "@/components/about-cio";

export const metadata: Metadata = {
  title: "Philosophy | The Solo Strategist",
  description: "Long-horizon investment philosophy, process architecture, and open-source research mission."
};

export default function PhilosophyPage() {
  return (
    <div className="container-shell py-14">
      <article className="reading-width space-y-8">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink/40 dark:text-slate-500">
            Framework & Conviction
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-midnight dark:text-slate-100 sm:text-5xl">
            Investment Philosophy
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink/60 dark:text-slate-400">
            The Solo Strategist exists to document durable ideas before consensus labels them obvious.
            We optimise for quality of process over frequency of opinion.
          </p>
          <div className="mt-6 h-px w-16 bg-midnight/20 dark:bg-champagne/30" />
        </header>

        <section>
          <h2 className="font-serif text-3xl text-midnight dark:text-champagne">Principle I: Secular Before Cyclical</h2>
          <p className="mt-3 text-ink/85 dark:text-slate-200">
            We prefer themes with multi-year drivers: infrastructure rebuilding, energy security, and digital operating
            leverage. Cyclical signals matter, but only as position-timing layers.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-midnight dark:text-champagne">Principle II: Valuation as Risk Control</h2>
          <p className="mt-3 text-ink/85 dark:text-slate-200">
            Valuation discipline is not an aesthetic preference. It is the mechanism that absorbs analytical error.
            Every thesis is sized with explicit downside assumptions and benchmark-relative opportunity cost.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl text-midnight dark:text-champagne">Principle III: Public Accountability</h2>
          <p className="mt-3 text-ink/85 dark:text-slate-200">
            Forecasts are timestamped and archived. We record thesis evolution, not only outcomes, because intellectual
            honesty compounds over cycles.
          </p>
        </section>

        {/* Open Source Research Mission */}
        <section className="mt-12 rounded-sm border border-champagne/20 bg-gradient-to-br from-champagne/[0.03] to-transparent p-6 dark:border-champagne/10 dark:from-champagne/[0.04]">
          <h2 className="font-serif text-3xl text-midnight dark:text-champagne">
            The Open Source Research Mission
          </h2>
          <div className="mt-1 h-px w-10 bg-champagne/40" />
          <div className="mt-4 space-y-4 text-ink/80 dark:text-slate-300">
            <p>
              The Solo Strategist provides institutional-grade research as a public ledger of intellectual
              capital. Our goal is to build a high-fidelity, transparent track record in the public domain.
            </p>
            <p>
              Every thesis is published with full methodology, explicit entry points, and measurable
              benchmarks. There are no paywalls, no selective disclosure, and no retroactive edits.
              The research published here is designed to give the retail investor access to the same
              analytical frameworks employed by institutional allocators.
            </p>
            <p className="text-sm italic text-ink/55 dark:text-slate-400">
              &ldquo;The Solo Strategist is a public ledger of intellectual capital. Research here will
              always be free - designed to provide the retail investor with a definitive institutional
              edge.&rdquo;
            </p>
          </div>
        </section>
      </article>

      {/* About the CIO */}
      <div className="mt-16 border-t border-midnight/8 pt-4 dark:border-slate-800">
        <AboutCIO />
      </div>
    </div>
  );
}
