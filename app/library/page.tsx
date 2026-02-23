import type { Metadata } from "next";
import { BookOpen, FileText, Headphones, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Library | The Solo Strategist",
  description:
    "A curated information diet: the books, whitepapers, and dispatches that shape our capital allocation framework.",
};

/* ── Data ───────────────────────────────────────────────────── */

type LibraryItem = {
  title: string;
  author: string;
  snippet: string;
  href?: string;
  /** Short type label for the badge, e.g. "Book", "Whitepaper", "Newsletter" */
  typeLabel: string;
};

const books: LibraryItem[] = [
  {
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    typeLabel: "Book",
    snippet:
      "The foundational text on value discipline. Graham\u2019s concept of \u201Cmargin of safety\u201D remains the single most important principle in our allocation framework \u2014 every position we size begins with this filter.",
  },
  {
    title: "Antifragile",
    author: "Nassim Nicholas Taleb",
    typeLabel: "Book",
    snippet:
      "Taleb\u2019s thesis that certain systems gain from disorder underpins our barbell construction: pair deep-value convictions with asymmetric optionality, and let volatility work for you rather than against you.",
  },
];

const whitepapers: LibraryItem[] = [
  {
    title: "BIS Annual Economic Report",
    author: "Bank for International Settlements",
    typeLabel: "Whitepaper",
    snippet:
      "The central banker\u2019s central bank. Essential for understanding cross-border capital flows and macro-prudential policy shifts before they reach consensus.",
    href: "https://www.bis.org/publ/arpdf/ar2025e.htm",
  },
  {
    title: "World Economic Outlook",
    author: "International Monetary Fund",
    typeLabel: "Whitepaper",
    snippet:
      "The IMF\u2019s flagship publication. We use its GDP and inflation projections as a baseline to stress-test our own macro assumptions.",
    href: "https://www.imf.org/en/Publications/WEO",
  },
  {
    title: "Global Investment Outlook",
    author: "Goldman Sachs Global Investment Research",
    typeLabel: "Whitepaper",
    snippet:
      "Institutional-grade cross-asset research. Useful for identifying consensus positioning so we can determine where the crowd is over- or under-allocated.",
    href: "https://www.goldmansachs.com/insights/pages/gs-research/macro-outlook-2026/report.pdf",
  },
  {
    title: "Global Outlook",
    author: "J.P. Morgan Asset Management",
    typeLabel: "Whitepaper",
    snippet:
      "Long-term capital market assumptions that we compare against our own terminal value models to ensure intellectual honesty in our DCF work.",
    href: "https://am.jpmorgan.com/us/en/asset-management/institutional/insights/market-insights/market-outlook/",
  },
];

const pulse: LibraryItem[] = [
  {
    title: "Odd Lots",
    author: "Bloomberg",
    typeLabel: "Podcast",
    snippet:
      "Tracy Alloway and Joe Weisenthal consistently surface the non-obvious corners of markets \u2014 plumbing, structure, and flow mechanics that move price before narrative catches up.",
  },
  {
    title: "The Compound and Friends",
    author: "Ritholtz Wealth Management",
    typeLabel: "Podcast",
    snippet:
      "Josh Brown and Michael Batnick provide real-time practitioner perspective. Useful for calibrating sentiment and understanding what the advisory channel is seeing.",
  },
  {
    title: "Money Stuff",
    author: "Matt Levine, Bloomberg",
    typeLabel: "Newsletter",
    snippet:
      "The single best daily read in financial media. Levine\u2019s ability to distil complex corporate finance, M&A, and regulatory events into clear prose is unmatched.",
  },
  {
    title: "Grant\u2019s Interest Rate Observer",
    author: "James Grant",
    typeLabel: "Newsletter",
    snippet:
      "Contrarian credit analysis at its finest. Grant\u2019s long-form work on interest rate cycles and credit quality is an essential counterweight to consensus optimism.",
  },
];

/* ── Shelf theme tokens ─────────────────────────────────────── */

type ShelfTheme = {
  /** CSS gradient for the 16:9 thumbnail area */
  thumbGradient: string;
  /** Subtle SVG pattern drawn over the thumbnail */
  thumbPattern: "grid" | "circuit" | "wave";
  /** Badge background / text colours (Tailwind) */
  badgeBg: string;
  badgeText: string;
};

const shelfThemes: Record<"books" | "whitepapers" | "pulse", ShelfTheme> = {
  books: {
    thumbGradient: "from-[#0b1526] via-[#0d1f3c] to-[#091320]",
    thumbPattern: "grid",
    badgeBg: "bg-blue-900/70",
    badgeText: "text-blue-300",
  },
  whitepapers: {
    thumbGradient: "from-[#0b1a14] via-[#0d2218] to-[#090f0c]",
    thumbPattern: "circuit",
    badgeBg: "bg-emerald-900/70",
    badgeText: "text-emerald-300",
  },
  pulse: {
    thumbGradient: "from-[#1a1206] via-[#1c1508] to-[#0f0c04]",
    thumbPattern: "wave",
    badgeBg: "bg-amber-900/60",
    badgeText: "text-amber-300",
  },
};

/* ── Thumbnail ──────────────────────────────────────────────── */

function Thumbnail({
  gradient,
  pattern,
  typeLabel,
  badgeBg,
  badgeText,
}: {
  gradient: string;
  pattern: ShelfTheme["thumbPattern"];
  typeLabel: string;
  badgeBg: string;
  badgeText: string;
}) {
  return (
    /* 16:9 ratio via padding-top trick */
    <div className="relative w-full overflow-hidden rounded-t-sm" style={{ paddingTop: "56.25%" }}>
      {/* Gradient base */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
      />

      {/* Overlay pattern — pure CSS, no images needed */}
      {pattern === "grid" && (
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#a3b8cc 1px, transparent 1px), linear-gradient(90deg, #a3b8cc 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      )}
      {pattern === "circuit" && (
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #6ee7b7 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      )}
      {pattern === "wave" && (
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #d4af37, #d4af37 1px, transparent 1px, transparent 12px)",
          }}
        />
      )}

      {/* 20% dark scrim — ensures text legibility when images are swapped in later */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Type badge — top-right corner */}
      <span
        className={`absolute right-3 top-3 rounded-[3px] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] ${badgeBg} ${badgeText}`}
      >
        {typeLabel}
      </span>
    </div>
  );
}

/* ── Library Card ───────────────────────────────────────────── */

function LibraryCard({
  item,
  shelf,
}: {
  item: LibraryItem;
  shelf: keyof typeof shelfThemes;
}) {
  const theme = shelfThemes[shelf];

  const cardClass =
    "group flex flex-col overflow-hidden rounded-sm border border-slate-700/60 bg-slate-900/80 transition-all duration-300 hover:border-champagne/30 hover:shadow-[0_0_32px_-8px_rgba(212,175,55,0.12)]";

  const content = (
    <>
      <Thumbnail
        gradient={theme.thumbGradient}
        pattern={theme.thumbPattern}
        typeLabel={item.typeLabel}
        badgeBg={theme.badgeBg}
        badgeText={theme.badgeText}
      />

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-sm font-semibold leading-snug text-slate-200 transition-colors group-hover:text-champagne">
          {item.title}
        </h3>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
          {item.author}
        </p>
        <p className="mt-3 flex-1 text-[12px] leading-relaxed text-slate-400">
          {item.snippet}
        </p>

        {item.href && (
          <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-medium text-champagne/60 transition-colors group-hover:text-champagne">
            Read source
            <ArrowUpRight className="h-3 w-3" />
          </span>
        )}
      </div>
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
      >
        {content}
      </a>
    );
  }

  return <div className={cardClass}>{content}</div>;
}

/* ── Shelf header ───────────────────────────────────────────── */

function ShelfHeader({
  icon: Icon,
  label,
  title,
}: {
  icon: typeof BookOpen;
  label: string;
  title: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-champagne/70" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {label}
        </p>
      </div>
      <h2 className="mt-1 font-serif text-2xl text-slate-100">{title}</h2>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

export default function LibraryPage() {
  return (
    <div className="container-shell py-14">
      <header className="mb-14">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Curated Information Diet
        </p>
        <h1 className="mt-2 font-serif text-4xl text-slate-100 sm:text-5xl">
          The Strategist&rsquo;s Library
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
          The books, whitepapers, and dispatches that shape our capital
          allocation framework. Quality over quantity &mdash; every entry here
          has earned its place through repeated practical value.
        </p>
        <div className="mt-6 h-px w-16 bg-champagne/30" />
      </header>

      {/* Shelf I — Books */}
      <section className="mb-14">
        <ShelfHeader icon={BookOpen} label="Shelf I" title="The Foundation" />
        <div className="grid gap-5 sm:grid-cols-2">
          {books.map((b) => (
            <LibraryCard key={b.title} item={b} shelf="books" />
          ))}
        </div>
      </section>

      {/* Shelf II — Whitepapers */}
      <section className="mb-14">
        <ShelfHeader icon={FileText} label="Shelf II" title="The Dispatches" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whitepapers.map((w) => (
            <LibraryCard key={w.title} item={w} shelf="whitepapers" />
          ))}
        </div>
      </section>

      {/* Shelf III — Podcasts & Newsletters */}
      <section>
        <ShelfHeader icon={Headphones} label="Shelf III" title="The Pulse" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pulse.map((p) => (
            <LibraryCard key={p.title} item={p} shelf="pulse" />
          ))}
        </div>
      </section>
    </div>
  );
}
