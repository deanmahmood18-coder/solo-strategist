import Link from "next/link";

const navLinks = [
  { href: "/philosophy", label: "Philosophy" },
  { href: "/research", label: "Research" },
  { href: "/predictions", label: "Predictions" },
  { href: "/contact", label: "Contact" },
  { href: "/archive", label: "Archive" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-14">
      <div className="container-shell">
        {/* Mission callout */}
        <div className="mb-10 rounded-sm border border-champagne/10 bg-champagne/[0.02] px-5 py-4">
          <p className="max-w-3xl text-sm leading-7 text-slate-400">
            The Solo Strategist is a public ledger of intellectual capital. Research here will always
            be free - designed to provide the retail investor with a definitive institutional edge.
          </p>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="font-serif text-base tracking-wide text-champagne">
              The Solo Strategist
            </Link>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              Independent capital allocation research through secular thematics and value discipline.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-slate-500 transition hover:text-slate-300"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/archive/post-mortems"
              className="text-xs text-rose-500/50 transition hover:text-rose-400"
            >
              Transparency Audit
            </Link>
            <Link
              href="/philosophy#open-source-mission"
              className="text-xs text-champagne/50 transition hover:text-champagne"
            >
              Why this is free
            </Link>
          </nav>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6">
          <p className="max-w-3xl text-[11px] leading-6 text-slate-600">
            <strong className="font-medium text-slate-500">Important Disclaimer:</strong>{" "}
            Published research is for informational and educational purposes only and does not constitute
            investment advice, a personal recommendation, or a solicitation to buy or sell any security.
            The author may hold positions in securities discussed. Past performance is not indicative of
            future results. All investments involve risk, including the possible loss of principal. All
            views expressed are those of the author alone and do not represent the views of any affiliated
            organisation. Readers should conduct their own due diligence and consult a qualified financial
            adviser before making investment decisions.
          </p>
          <p className="mt-3 text-xs text-slate-700">
            &copy; 2026 The Solo Strategist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
