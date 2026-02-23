"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PortfolioItem = {
  ticker: string;
  shares: number;
};

interface PortfolioInputProps {
  onSubmit: (portfolio: PortfolioItem[]) => void;
  disabled?: boolean;
}

// ─── Parsers ──────────────────────────────────────────────────────────────────

/**
 * Parses free-text portfolio input into PortfolioItem[].
 * Supports: "AMZN: 50", "$AMZN: 50", "AMZN 50", "$AMZN,50", one per line or comma-separated.
 */
const PARSER_RE = /\$?([A-Z]{1,5})[:\s,]+(\d+(?:\.\d+)?)/g;

function parsePortfolioText(text: string): PortfolioItem[] {
  const items: PortfolioItem[] = [];
  const seen = new Set<string>();
  const upper = text.toUpperCase();
  PARSER_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = PARSER_RE.exec(upper)) !== null) {
    const ticker = match[1];
    const shares = parseFloat(match[2]);
    if (!seen.has(ticker) && shares > 0) {
      items.push({ ticker, shares });
      seen.add(ticker);
    }
  }
  return items;
}

/**
 * Parses a CSV file with header row "ticker,shares" (or no header).
 * Skips rows where the first column is not a 1-5 letter ticker.
 */
function parseCSV(text: string): PortfolioItem[] {
  const lines = text.trim().split(/\r?\n/);
  const items: PortfolioItem[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const [rawTicker, rawShares] = line.split(",");
    if (!rawTicker || !rawShares) continue;
    const ticker = rawTicker.trim().replace(/^\$/, "").toUpperCase();
    if (!/^[A-Z]{1,5}$/.test(ticker)) continue; // skip header or invalid rows
    const shares = parseFloat(rawShares.trim());
    if (isNaN(shares) || shares <= 0) continue;
    if (!seen.has(ticker)) {
      items.push({ ticker, shares });
      seen.add(ticker);
    }
  }

  return items;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PortfolioInput({ onSubmit, disabled = false }: PortfolioInputProps) {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<PortfolioItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (value: string) => {
    setText(value);
    if (value.trim()) {
      const items = parsePortfolioText(value);
      setParsed(items);
      setError(null);
    } else {
      setParsed([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const items = parseCSV(content);
      if (items.length === 0) {
        setError("Could not parse CSV. Ensure format is: ticker,shares (one per row)");
        return;
      }
      const displayText = items.map((item) => `${item.ticker}: ${item.shares}`).join("\n");
      setText(displayText);
      setParsed(items);
      setError(null);
    };
    reader.readAsText(file);

    // Reset so the same file can be re-uploaded
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeHolding = (ticker: string) => {
    const next = parsed.filter((item) => item.ticker !== ticker);
    setParsed(next);
    setText(next.map((item) => `${item.ticker}: ${item.shares}`).join("\n"));
  };

  const handleSubmit = () => {
    if (parsed.length === 0) {
      setError("Enter at least one holding (e.g. AMZN: 50)");
      return;
    }
    setError(null);
    onSubmit(parsed);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Section header */}
      <div>
        <h2 className="font-serif text-xl text-champagne">Portfolio Input</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Enter tickers and share counts. The Auditor cross-references against Solo Strategist
          research, post-mortems, and live track record.
        </p>
      </div>

      {/* Free-text input */}
      <textarea
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        disabled={disabled}
        rows={8}
        placeholder={`Enter holdings, one per line:\n\nAMZN: 50\nGOOGL: 30\nGLD: 100\n\nor comma-separated: $AMZN: 50, $GOOGL: 30`}
        className="w-full resize-none rounded-sm border border-slate-700 bg-slate-900/50 px-4 py-3 font-mono text-sm leading-relaxed text-slate-200 placeholder:text-slate-700 transition-colors focus:border-champagne/30 focus:outline-none disabled:opacity-50"
      />

      {/* CSV upload */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-slate-700/60 px-3 py-1.5 text-xs text-slate-500 transition-colors hover:border-slate-600 hover:text-slate-400"
        >
          <Upload className="h-3 w-3" />
          Upload CSV (ticker,shares)
        </label>
      </div>

      {/* Parsed holdings chips */}
      {parsed.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
            Parsed Holdings — {parsed.length} position{parsed.length !== 1 ? "s" : ""}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {parsed.map((item) => (
              <span
                key={item.ticker}
                className="inline-flex items-center gap-1 rounded-sm border border-champagne/20 bg-champagne/5 px-2.5 py-1 text-xs text-champagne"
              >
                ${item.ticker} × {item.shares.toLocaleString()}
                <button
                  onClick={() => removeHolding(item.ticker)}
                  aria-label={`Remove ${item.ticker}`}
                  disabled={disabled}
                  className="ml-0.5 text-champagne/40 transition-colors hover:text-champagne/80 disabled:cursor-not-allowed"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && <p className="text-xs text-rose-400">{error}</p>}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={disabled || parsed.length === 0}
        className="w-full rounded-sm border border-champagne/30 bg-champagne/10 py-3 text-sm font-semibold text-champagne transition-colors hover:bg-champagne/20 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {disabled ? "Auditing…" : "Run Audit"}
      </button>

      {/* Example hint */}
      <p className="text-[10px] text-slate-700">
        Try: AMZN: 50 · GOOGL: 30 · GLD: 100
      </p>
    </div>
  );
}
