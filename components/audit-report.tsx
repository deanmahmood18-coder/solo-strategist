"use client";

import Link from "next/link";
import { FileSearch, Shield, Zap, BarChart3 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Citation = {
  index: number;
  slug: string;
  title: string;
  sectionHeading?: string;
  url: string;
  score: number;
  /** Semantic relevance to the portfolio query. */
  reasoningRelevance?: "direct" | "thematic" | "contextual";
  /** Which portfolio tickers this source is most relevant to. */
  relevantTickers?: string[];
};

interface AuditReportProps {
  text: string;
  citations: Citation[];
  status: "idle" | "loading" | "streaming" | "done";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

/** Colour coding for reasoning relevance badges. */
const RELEVANCE_STYLES: Record<string, string> = {
  direct: "border-emerald-700/50 bg-emerald-950/30 text-emerald-400",
  thematic: "border-champagne/30 bg-champagne/5 text-champagne/70",
  contextual: "border-slate-700/50 bg-slate-900/50 text-slate-500",
};

const RELEVANCE_ICONS: Record<string, typeof Shield> = {
  direct: Shield,
  thematic: Zap,
  contextual: BarChart3,
};

/**
 * Splits text on [N] citation markers and returns React nodes.
 * Citation badges are colour-coded by reasoning relevance and show
 * smart hover tooltips with source title, section, and relevance.
 */
function renderWithCitations(text: string, citations: Citation[]): React.ReactNode[] {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      const idx = parseInt(match[1], 10);
      const citation = citations.find((c) => c.index === idx);
      if (citation) {
        const relevance = citation.reasoningRelevance ?? "contextual";
        const tooltipParts = [citation.title];
        if (citation.sectionHeading) tooltipParts.push(`Section: ${citation.sectionHeading}`);
        tooltipParts.push(`Relevance: ${relevance.toUpperCase()}`);
        if (citation.relevantTickers?.length) {
          tooltipParts.push(`Applies to: ${citation.relevantTickers.join(", ")}`);
        }
        const tooltip = tooltipParts.join(" | ");

        return (
          <Link
            key={i}
            href={`/research/${citation.slug}`}
            title={tooltip}
            className={`inline-flex items-center rounded-sm border px-1 py-0 text-[10px] font-semibold leading-5 no-underline transition-colors hover:opacity-80 align-baseline ${RELEVANCE_STYLES[relevance]}`}
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
 * Detects and renders the Conviction Alignment Score as a visual gauge.
 */
function ConvictionGauge({ score }: { score: number }) {
  let colour: string;
  let label: string;
  if (score >= 75) {
    colour = "text-emerald-400 border-emerald-700/50 bg-emerald-950/20";
    label = "High Alignment";
  } else if (score >= 50) {
    colour = "text-champagne border-champagne/30 bg-champagne/5";
    label = "Moderate Alignment";
  } else if (score >= 25) {
    colour = "text-amber-400 border-amber-700/50 bg-amber-950/20";
    label = "Low Alignment";
  } else {
    colour = "text-rose-400 border-rose-700/50 bg-rose-950/20";
    label = "Misaligned";
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 ${colour}`}>
      <span className="text-lg font-bold">{score}</span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider">/100</p>
        <p className="text-[9px] opacity-70">{label}</p>
      </div>
    </div>
  );
}

/**
 * Parses streaming text into rendered React nodes.
 * ### headings get champagne accent lines; body runs through renderWithCitations.
 * Special handling for "Conviction Alignment Score: X/100" pattern.
 */
function renderReport(text: string, citations: Citation[]): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let buffer: string[] = [];
  let key = 0;

  const flushBuffer = () => {
    const content = buffer.join(" ").trim();
    if (content) {
      // Check for Conviction Alignment Score pattern
      const scoreMatch = content.match(/\*\*Conviction Alignment Score:\s*(\d+)\/100\*\*/);
      if (scoreMatch) {
        const score = parseInt(scoreMatch[1], 10);
        // Render the gauge, then the rest of the paragraph
        const before = content.slice(0, scoreMatch.index).trim();
        const after = content.slice((scoreMatch.index ?? 0) + scoreMatch[0].length).trim();

        if (before) {
          nodes.push(
            <p key={key++} className="text-sm leading-7 text-slate-300">
              {renderWithCitations(before, citations)}
            </p>
          );
        }
        nodes.push(
          <div key={key++} className="my-3">
            <ConvictionGauge score={score} />
          </div>
        );
        if (after) {
          nodes.push(
            <p key={key++} className="text-sm leading-7 text-slate-300">
              {renderWithCitations(after, citations)}
            </p>
          );
        }
      } else {
        nodes.push(
          <p key={key++} className="text-sm leading-7 text-slate-300">
            {renderWithCitations(content, citations)}
          </p>
        );
      }
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
  // Empty state
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

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex h-full min-h-[480px] flex-col items-center justify-center gap-3 rounded-sm border border-slate-800 bg-slate-900/30 p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne/60">
          Portfolio Auditor v2
        </p>
        <p className="text-xs text-slate-500">
          Fetching live prices · Embedding query · Querying research corpus · Computing conviction scores…
        </p>
        <TypingIndicator />
      </div>
    );
  }

  // Count relevance distribution
  const directCount = citations.filter((c) => c.reasoningRelevance === "direct").length;
  const thematicCount = citations.filter((c) => c.reasoningRelevance === "thematic").length;
  const contextualCount = citations.filter((c) => c.reasoningRelevance === "contextual").length;

  return (
    <div className="rounded-sm border border-slate-800 bg-slate-900/30 p-6 md:p-8">
      {/* Report header */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne/70">
            Portfolio Auditor
          </p>
          <p className="mt-0.5 text-[10px] text-slate-600">
            Deep thesis synthesis · {citations.length} source{citations.length !== 1 ? "s" : ""}
            {directCount > 0 && (
              <span className="ml-1.5 text-emerald-500/60">{directCount} direct</span>
            )}
            {thematicCount > 0 && (
              <span className="ml-1.5 text-champagne/40">{thematicCount} thematic</span>
            )}
            {contextualCount > 0 && (
              <span className="ml-1.5 text-slate-600">{contextualCount} contextual</span>
            )}
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

      {/* Source cards — shown once streaming is complete, grouped by relevance */}
      {citations.length > 0 && status === "done" && (
        <div className="mt-8 border-t border-slate-800 pt-6">
          <p className="mb-2.5 text-[10px] font-medium uppercase tracking-[0.13em] text-slate-700">
            Sources
          </p>
          <div className="flex flex-wrap gap-1.5">
            {citations
              .sort((a, b) => {
                const order = { direct: 0, thematic: 1, contextual: 2 };
                return (order[a.reasoningRelevance ?? "contextual"] ?? 2) -
                  (order[b.reasoningRelevance ?? "contextual"] ?? 2);
              })
              .map((c) => {
                const relevance = c.reasoningRelevance ?? "contextual";
                const RelevanceIcon = RELEVANCE_ICONS[relevance] ?? BarChart3;
                const tooltipParts = [c.title];
                if (c.sectionHeading) tooltipParts.push(c.sectionHeading);
                tooltipParts.push(`${relevance} relevance`);
                if (c.relevantTickers?.length) tooltipParts.push(`tickers: ${c.relevantTickers.join(", ")}`);

                return (
                  <Link
                    key={c.index}
                    href={`/research/${c.slug}`}
                    title={tooltipParts.join(" — ")}
                    className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-[10px] no-underline transition-colors hover:opacity-80 ${RELEVANCE_STYLES[relevance]}`}
                  >
                    <RelevanceIcon className="h-2.5 w-2.5 shrink-0 opacity-60" />
                    <span>
                      <span className="opacity-60">[{c.index}]</span>{" "}
                      {c.title}
                      {c.sectionHeading && (
                        <span className="ml-1 opacity-50">— {c.sectionHeading}</span>
                      )}
                    </span>
                    {c.relevantTickers && c.relevantTickers.length > 0 && (
                      <span className="ml-1 opacity-40">
                        ({c.relevantTickers.join(", ")})
                      </span>
                    )}
                  </Link>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
