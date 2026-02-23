"use client";

import { useState } from "react";
import { PortfolioInput, type PortfolioItem } from "@/components/portfolio-input";
import { AuditReport, type Citation } from "@/components/audit-report";

// ─── Hook ─────────────────────────────────────────────────────────────────────

type AuditStatus = "idle" | "loading" | "streaming" | "done";

function useAudit() {
  const [status, setStatus] = useState<AuditStatus>("idle");
  const [text, setText] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function runAudit(portfolio: PortfolioItem[]) {
    setStatus("loading");
    setText("");
    setCitations([]);
    setError(null);

    let res: Response;
    try {
      res = await fetch("/api/agent/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio }),
      });
    } catch {
      setError("Network error — check your connection and try again.");
      setStatus("idle");
      return;
    }

    if (!res.ok) {
      setError("Audit failed — please try again.");
      setStatus("idle");
      return;
    }

    // Read citations from response header before consuming the body stream
    const citationsHeader = res.headers.get("X-Citations");
    if (citationsHeader) {
      try {
        setCitations(JSON.parse(citationsHeader) as Citation[]);
      } catch {
        setCitations([]);
      }
    }

    setStatus("streaming");

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      setText((prev) => prev + decoder.decode(value, { stream: true }));
    }

    setStatus("done");
  }

  return { status, text, citations, error, runAudit };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AuditorPage() {
  const { status, text, citations, error, runAudit } = useAudit();
  const isRunning = status === "loading" || status === "streaming";

  return (
    <main className="container-shell py-12 md:py-16">
      {/* Page header */}
      <div className="mb-10">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne/50">
          Solo Strategist
        </p>
        <h1 className="font-serif text-3xl text-slate-100 md:text-4xl">Portfolio Auditor</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
          Enter your holdings and the Auditor will cross-reference them against our research
          corpus, post-mortems, and live track record — then stream a structured risk report with
          source citations.
        </p>
      </div>

      {/* Global error banner */}
      {error && (
        <div className="mb-6 rounded-sm border border-rose-900/40 bg-rose-950/20 px-4 py-3 text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* Two-column layout: input left, report right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
        {/* Left — Portfolio Input */}
        <div className="rounded-sm border border-slate-800 bg-slate-900/40 p-6">
          <PortfolioInput onSubmit={runAudit} disabled={isRunning} />
        </div>

        {/* Right — Audit Report */}
        <div>
          <AuditReport text={text} citations={citations} status={status} />
        </div>
      </div>
    </main>
  );
}
