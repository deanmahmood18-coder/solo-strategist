export const runtime = "edge";

import { NextRequest } from "next/server";
import { streamText, embed } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { queryVectors, type PineconeMatch } from "@/lib/vector/pinecone";
import { postMortems } from "@/data/post-mortems";
import { trackRecordData } from "@/data/track-record";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Citation = {
  index: number;
  slug: string;
  title: string;
  sectionHeading?: string;
  url: string;
  score: number;
};

export type PortfolioItem = {
  ticker: string;
  shares: number;
};

type Quote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
};

// ─── Entity resolver — high-collision ticker registry ─────────────────────────

/**
 * Tickers that are known to have non-fundamental volatility risks due to
 * algorithmic confusion (e.g. name/ticker collisions with other securities).
 * Surfaces explicit warnings in the Conflict Alerts section.
 */
const HIGH_COLLISION_TICKERS: Record<string, string> = {
  SYM: "⚠️ TICKER RISK: $SYM (Symbotic Inc.) has documented algorithmic confusion risks — other securities share or have shared this ticker, creating non-fundamental volatility. Price swings may be driven by mis-routing, not fundamentals.",
};

// ─── Finnhub quote ────────────────────────────────────────────────────────────

/**
 * Fetches a real-time quote from Finnhub.
 * Returns null on any failure — audit degrades gracefully.
 * Mirrors fetchFinnhubQuote in app/api/agent/research/route.ts.
 */
async function fetchFinnhubQuote(ticker: string): Promise<Quote | null> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${apiKey}`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.c || data.c === 0) return null;
    return {
      symbol: ticker,
      price: data.c,
      change: data.d ?? 0,
      changePercent: data.dp ?? 0,
    };
  } catch {
    return null;
  }
}

// ─── Context assembly ─────────────────────────────────────────────────────────

function buildContextAndCitations(matches: PineconeMatch[]): {
  contextBlock: string;
  citations: Citation[];
} {
  const citations: Citation[] = matches.map((match, i) => ({
    index: i + 1,
    slug: match.metadata.slug,
    title: match.metadata.title,
    sectionHeading: match.metadata.sectionHeading || undefined,
    url: match.metadata.url,
    score: Math.round(match.score * 1000) / 1000,
  }));

  const contextBlock = matches
    .map((match, i) => {
      const heading = match.metadata.sectionHeading
        ? ` — Section: ${match.metadata.sectionHeading}`
        : "";
      return [
        `[${i + 1}] ${match.metadata.title}${heading}`,
        `Published: ${match.metadata.publishedAt} | URL: ${match.metadata.url}`,
        `Content:`,
        match.metadata.text ?? "(content unavailable)",
      ].join("\n");
    })
    .join("\n\n---\n\n");

  return { contextBlock, citations };
}

// ─── System prompt ────────────────────────────────────────────────────────────

function buildAuditSystemPrompt({
  portfolio,
  quotes,
  contextBlock,
  postMortemConflicts,
  trackRecordConflicts,
  trackRecordConvictions,
  collisionWarnings,
}: {
  portfolio: PortfolioItem[];
  quotes: Record<string, Quote>;
  contextBlock: string;
  postMortemConflicts: string;
  trackRecordConflicts: string;
  trackRecordConvictions: string;
  collisionWarnings: string;
}): string {
  const totalValue = portfolio.reduce((sum, item) => {
    const q = quotes[item.ticker];
    return sum + (q ? q.price * item.shares : 0);
  }, 0);

  const holdingsTable = portfolio
    .map((item) => {
      const q = quotes[item.ticker];
      if (!q) return `${item.ticker} | ${item.shares} shares | Price unavailable | Weight N/A`;
      const value = q.price * item.shares;
      const weight = totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : "N/A";
      return `${item.ticker} | ${item.shares} shares | $${q.price.toFixed(2)} | ${weight}% of portfolio`;
    })
    .join("\n");

  const marketSnapshot = portfolio
    .map((item) => {
      const q = quotes[item.ticker];
      if (!q) return `${item.ticker}: Price unavailable`;
      const sign = q.changePercent >= 0 ? "+" : "";
      return `${item.ticker}: $${q.price.toFixed(2)} (${sign}${q.changePercent.toFixed(2)}% today)`;
    })
    .join("\n");

  return `You are The Portfolio Auditor — a rigorous risk analyst for The Solo Strategist. Your role is to cross-reference a user's portfolio against the Solo Strategist's proprietary research corpus, post-mortems, and track record to surface conflicts, hidden correlations, and actionable hedges.

## Portfolio Holdings (Ticker | Shares | Live Price | Weight)
${holdingsTable}

## Live Market Snapshot
${marketSnapshot}

## Relevant Research (Cite as [N])
${contextBlock || "No relevant research found in corpus for these holdings."}

## Post-Mortem Conflicts
${postMortemConflicts || "No post-mortem conflicts detected for these holdings."}

## Track Record Cross-Reference
${trackRecordConflicts || "No track record conflicts detected."}

${trackRecordConvictions ? `## Active Convictions Supporting Holdings\n${trackRecordConvictions}` : ""}
${collisionWarnings ? `## ⚠️ Ticker Risk Warnings\n${collisionWarnings}` : ""}

---
## Ground Rules
1. **Citations are mandatory.** Every factual claim MUST be sourced from the research context above. Insert inline citations as [1], [2], [3] immediately after the claim.
2. **No fabrication.** If the corpus does not cover a topic, say so explicitly. Do not invent analysis for tickers with no research coverage.
3. **No invented numbers.** All quantitative data must trace back to a numbered source or the live data provided above.
4. **Citation links.** Do NOT list URLs — use only [N] inline. The interface renders citation cards automatically.
5. **Analytical tone.** Be direct and structured. Use prose, not bullet lists.

## FORMAT YOUR RESPONSE with exactly four ### sections:

### Portfolio Risk Summary
(2-3 sentences covering overall risk profile and key concentration risks based on live weights)

### ⚠️ Conflict Alerts
(Explicit callouts using [N] citations + post-mortem refs for any holding that conflicts with Solo Strategist research. Flag high-collision tickers. If no conflicts, state "No explicit conflicts detected — see Hidden Correlations below.")

### Hidden Correlations
(Sector concentration, non-obvious systemic risk, macro factor exposures that affect multiple holdings simultaneously. Identify cross-ticker dependencies not visible at the individual position level.)

### Actionable Pivots
(1-3 Solo Strategist-approved hedges or rebalancing suggestions, citation-backed where possible. Be specific about the hedge rationale.)

Cite every research-backed claim as [N]. Never fabricate numbers.`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: { portfolio?: PortfolioItem[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const portfolio = body.portfolio;
  if (!Array.isArray(portfolio) || portfolio.length === 0) {
    return new Response(JSON.stringify({ error: "portfolio array is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate and normalise portfolio items
  const validPortfolio: PortfolioItem[] = portfolio
    .filter(
      (item): item is PortfolioItem =>
        typeof item.ticker === "string" &&
        item.ticker.trim().length > 0 &&
        typeof item.shares === "number" &&
        item.shares > 0
    )
    .map((item) => ({ ticker: item.ticker.trim().toUpperCase(), shares: item.shares }));

  if (validPortfolio.length === 0) {
    return new Response(JSON.stringify({ error: "No valid portfolio items" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 1. Fetch live quotes for all tickers in parallel (edge-optimised batch)
  const quoteResults = await Promise.allSettled(
    validPortfolio.map((item) => fetchFinnhubQuote(item.ticker))
  );

  const quotes: Record<string, Quote> = {};
  quoteResults.forEach((result, i) => {
    if (result.status === "fulfilled" && result.value) {
      quotes[validPortfolio[i].ticker] = result.value;
    }
  });

  // 2. Build embedding query — tickers + portfolio risk vocabulary
  const tickerString = validPortfolio.map((item) => item.ticker).join(" ");
  const queryString = `${tickerString} portfolio risk analysis sector conviction investment thesis valuation`;

  // 3. Embed query + query Pinecone in parallel with fast-fail
  let queryEmbedding: number[];
  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: queryString,
      providerOptions: { openai: { dimensions: 1024 } },
    });
    queryEmbedding = embedding;
  } catch {
    return new Response(JSON.stringify({ error: "Embedding service unavailable" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 4. Query Pinecone for top 8 research chunks
  let matches: PineconeMatch[] = [];
  try {
    matches = await queryVectors(queryEmbedding, 8);
  } catch {
    // Degrade gracefully — audit proceeds without research context
    matches = [];
  }

  // 5. Cross-reference local data (no extra API calls)
  const portfolioTickers = new Set(validPortfolio.map((item) => item.ticker));

  // Post-mortem conflicts: any post-mortem whose ticker appears in the portfolio
  const conflictingPostMortems = postMortems.filter((pm) =>
    portfolioTickers.has(pm.ticker.toUpperCase())
  );
  const postMortemConflicts = conflictingPostMortems
    .map(
      (pm) =>
        `⚠️ ${pm.ticker} — "${pm.title}" (Exited ${pm.dateExited})\n` +
        `  Divergence: ${pm.divergence.summary}\n` +
        `  Lesson: ${pm.lesson.summary}`
    )
    .join("\n\n");

  // Track record: flag "Broken - Exited" as explicit conflicts
  const brokenItems = trackRecordData.filter(
    (item) =>
      item.ticker &&
      portfolioTickers.has(item.ticker.toUpperCase()) &&
      item.thesisStatus === "Broken - Exited"
  );
  const trackRecordConflicts = brokenItems
    .map(
      (item) =>
        `🚨 CONFLICT: ${item.ticker} — "${item.prediction}" thesis BROKEN & EXITED. ` +
        `Entry: $${item.entryPrice} → Exit: $${item.currentPrice}`
    )
    .join("\n");

  // Track record: note "Playing Out" as supporting convictions
  const convictionItems = trackRecordData.filter(
    (item) =>
      item.ticker &&
      portfolioTickers.has(item.ticker.toUpperCase()) &&
      item.thesisStatus === "Playing Out"
  );
  const trackRecordConvictions = convictionItems
    .map(
      (item) =>
        `✓ ${item.ticker} — "${item.prediction}" thesis Playing Out. Published: ${item.datePublished}`
    )
    .join("\n");

  // Entity resolver: flag known high-collision tickers
  const collisionWarnings = validPortfolio
    .map((item) => HIGH_COLLISION_TICKERS[item.ticker])
    .filter(Boolean)
    .join("\n\n");

  // 6. Build context block and citation metadata
  const { contextBlock, citations } = buildContextAndCitations(matches);

  // 7. Build audit system prompt
  const systemPrompt = buildAuditSystemPrompt({
    portfolio: validPortfolio,
    quotes,
    contextBlock,
    postMortemConflicts,
    trackRecordConflicts,
    trackRecordConvictions,
    collisionWarnings,
  });

  // 8. Stream the audit report
  let result;
  try {
    result = streamText({
      model: anthropic("claude-sonnet-4-6"),
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Audit my portfolio: ${validPortfolio
            .map((item) => `${item.ticker} (${item.shares} shares)`)
            .join(", ")}. Cross-reference against Solo Strategist research and provide the structured risk report.`,
        },
      ],
      maxOutputTokens: 2000,
      temperature: 0.3,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: `Model unavailable: ${msg}` }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 9. Return plain text stream with citations in custom header
  return result.toTextStreamResponse({
    headers: {
      "X-Citations": JSON.stringify(citations),
    },
  });
}
