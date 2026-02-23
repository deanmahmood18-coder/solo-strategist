"use client";

import Link from "next/link";
import { FileSearch, BookOpen } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Citation = {
  index: number;
  slug: string;
  title: string;
  sectionHeading?: string;
  url: string;
  score: number;
};

interface AuditReportProps {
  text: string;
  citations: Citation[];
  status: "idle" | "loading" | "streaming" | "done";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Three-dot pulsing indicator shown while streaming. */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-champagne/40"
          style={{ animationDelay: `${i * 180}ms` }}
        />
      ))}
    </div>
  );
}

/**
 * Splits text on [N] citation markers and returns React nodes.
 * Each citation becomes a clickable champagne badge with a smart hover tooltip
 * showing the source title and section (Contextual Deep-Linking improvement).
 */
function renderWithCitations(text: string, citations: Citation[]): React.ReactNode[] {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      const idx = parseInt(match[1], 10);
      const citation = citations.find((c) => c.index === idx);
      if (citation) {
        const tooltip = citation.sectionHeading
          ? `${citation.title} — ${citation.sectionHeading}`
          : citation.title;
        return (
          <Link
            key={i}
            href={`/research/${citation.slug}`}
            title={tooltip}
            className="inline-flex items-center rounded-sm border border-champagne/40 bg-champagne/10 px-1 py-0 text-[10px] font-semibold leading-5 text-champagne no-underline transition-colors hover:bg-champagne/20 align-baseline"
          >
            [{idx}]
          </Link>
        );
      }
    }
    return <span key={i}>{part}</span>;
  });
}

/**
 * Parses streaming text into rendered React nodes.
 * ### headings get a champagne accent line; body text runs through renderWithCitations.
 */
function renderReport(text: string, citations: Citation[]): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let buffer: string[] = [];
  let key = 0;

  const flushBuffer = () => {
    const content = buffer.join(" ").trim();
    if (content) {
      nodes.push(
        <p key={key++} className="text-sm leading-7 text-slate-300">
          {renderWithCitations(content, citations)}
        </p>
      );
    }
    buffer = [];
  };

  for (const line of lines) {
    if (line.startsWith("### ")) {
      flushBuffer();
      const heading = line.slice(4);
      nodes.push(
        <div key={key++} className="mt-7 first:mt-0">
          <div className="mb-2.5 h-px bg-gradient-to-r from-champagne/25 to-transparent" />
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne">
            {heading}
          </h3>
        </div>
      );
    } else if (line.trim() === "") {
      if (buffer.length > 0) flushBuffer();
    } else {
      buffer.push(line);
    }
  }
  flushBuffer();

  return nodes;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AuditReport({ text, citations, status }: AuditReportProps) {
  // Empty state — no audit run yet
  if (status === "idle") {
    return (
      <div className="flex h-full min-h-[480px] flex-col items-center justify-center gap-4 rounded-sm border border-slate-800 bg-slate-900/30 p-10">
        <FileSearch className="h-10 w-10 text-slate-700" />
        <div className="text-center">
          <p className="text-sm text-slate-500">No audit run yet</p>
          <p className="mt-1 text-xs text-slate-700">
            Enter your portfolio holdings on the left and click Run Audit.
          </p>
        </div>
      </div>
    );
  }

  // Loading state — before streaming begins
  if (status === "loading") {
    return (
      <div className="flex h-full min-h-[480px] flex-col items-center justify-center gap-3 rounded-sm border border-slate-800 bg-slate-900/30 p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne/60">
          Portfolio Auditor
        </p>
        <p className="text-xs text-slate-500">
          Fetching live prices &amp; querying research corpus…
        </p>
        <TypingIndicator />
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-slate-800 bg-slate-900/30 p-6 md:p-8">
      {/* Report header */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne/70">
            Portfolio Auditor
          </p>
          <p className="mt-0.5 text-[10px] text-slate-600">
            Grounded in Solo Strategist research ·{" "}
            {citations.length} source{citations.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div>
          {status === "streaming" && <TypingIndicator />}
          {status === "done" && (
            <span className="rounded-sm border border-emerald-800/40 bg-emerald-950/20 px-2 py-0.5 text-[10px] text-emerald-500">
              Complete
            </span>
          )}
        </div>
      </div>

      {/* Report body */}
      <div className="space-y-3">{renderReport(text, citations)}</div>

      {/* Source cards — shown once streaming is complete */}
      {citations.length > 0 && status === "done" && (
        <div className="mt-8 border-t border-slate-800 pt-6">
          <p className="mb-2.5 text-[10px] font-medium uppercase tracking-[0.13em] text-slate-700">
            Sources
          </p>
          <div className="flex flex-wrap gap-1.5">
            {citations.map((c) => (
              <Link
                key={c.index}
                href={`/research/${c.slug}`}
                title={c.sectionHeading ? `${c.title} — ${c.sectionHeading}` : c.title}
                className="inline-flex items-center gap-1.5 rounded-sm border border-slate-700/80 bg-slate-900 px-2.5 py-1.5 text-[10px] text-slate-400 no-underline transition-colors hover:border-slate-600 hover:text-slate-300"
              >
                <BookOpen className="h-2.5 w-2.5 shrink-0 text-champagne/40" />
                <span>
                  <span className="text-champagne/60">[{c.index}]</span>{" "}
                  {c.title}
                  {c.sectionHeading && (
                    <span className="ml-1 text-slate-600">— {c.sectionHeading}</span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
