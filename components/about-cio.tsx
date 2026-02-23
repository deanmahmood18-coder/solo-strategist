import Image from "next/image";
import { BarChart3, DollarSign, Globe, Linkedin, Mail, TrendingUp } from "lucide-react";

const expertise = [
  { name: "Macro", icon: <Globe className="h-5 w-5" /> },
  { name: "Equities", icon: <TrendingUp className="h-5 w-5" /> },
  { name: "Credit", icon: <DollarSign className="h-5 w-5" /> },
  { name: "Commodities", icon: <BarChart3 className="h-5 w-5" /> },
];

export function AboutCIO() {
  return (
    <section className="container-shell py-16">
      <div className="grid items-start gap-10 lg:grid-cols-[320px_1fr]">
        {/* Headshot */}
        <div className="mx-auto w-full max-w-[320px] lg:mx-0">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-slate-950">
            <Image
              src="/headshot.png"
              alt="Dean Mahmood - Chief Investment Officer"
              fill
              className="object-cover object-top brightness-[0.9] contrast-[1.05]"
              sizes="320px"
              priority
            />
            {/* Blend edges into dark background */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-slate-950/20" />
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 lg:justify-start">
            <a
              href="https://www.linkedin.com/in/dean-mahmood-847aa21b5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-champagne"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href="mailto:deanmahmood18@icloud.com"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-champagne"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          </div>
        </div>

        {/* Bio */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne/80">
            About the CIO
          </p>
          <h2 className="mt-2 font-serif text-3xl text-slate-100 sm:text-4xl">
            Dean Mahmood
          </h2>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            Chief Investment Officer
          </p>
          <div className="my-5 h-px w-12 bg-champagne/50" />

          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <p>
              Dean Mahmood is the founder and Chief Investment Officer of The Solo Strategist. His
              approach to capital allocation is defined by a synthesis of hard-science analytical rigor
              and strategic consulting frameworks. A double-honours graduate in Chemistry and Management
              from Imperial College London, Dean&apos;s methodology treats market themes as complex
              systems, requiring both molecular-level data scrutiny and high-level structural vision.
            </p>
            <p>
              His professional pedigree spans the financial services spectrum, with experience across
              Strategy Consulting, Investor Relations, and Capital Markets at firms including Macquarie
              Bank, Kearney, and H/Advisors Maitland. Currently an incoming Strategy &amp; Consulting
              Analyst at Accenture, Dean bridges the gap between institutional methodology and
              independent research.
            </p>
            <p>
              Outside of the markets, Dean serves as Head of Strategy for Love Mercy Hope, a regional
              charity that has secured over &pound;2m in donations since 2020. This commitment to social
              impact mirrors his mission for this platform: ensuring institutional-grade financial
              intelligence remains an open-source utility for the retail investor.
            </p>
            <p>
              A practitioner of discipline both on and off the tape, Dean is a BUCS Bronze medalist in
              Judo and a regular boxer, viewing the combat arts as the ultimate training ground for risk
              management and emotional composure. He is a lifelong supporter of Nottingham Forest FC.
            </p>
          </div>

          <div className="mt-8">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Areas of Expertise
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {expertise.map(({ name, icon }) => (
                <div
                  key={name}
                  className="flex items-center gap-2.5 rounded-sm border border-slate-700/50 bg-slate-800/30 px-3 py-2.5"
                >
                  <span className="text-champagne/50">{icon}</span>
                  <span className="text-xs font-medium text-slate-400">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
