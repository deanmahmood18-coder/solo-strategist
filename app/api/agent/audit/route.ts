export const runtime = "edge";

import { NextRequest } from "next/server";
import { streamText, embed } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { queryVectors, type PineconeMatch } from "@/lib/vector/pinecone";
import { postMortems } from "@/data/post-mortems";
import { trackRecordData, calculateReturn } from "@/data/track-record";
import { intelligenceFeed } from "@/data/intelligence-feed";
import { generateSummary } from "@/lib/news-summary";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Citation = {
  index: number;
  slug: string;
  title: string;
  sectionHeading?: string;
  url: string;
  score: number;
  /** Semantic relevance to the portfolio query — higher = more directly applicable. */
  reasoningRelevance: "direct" | "thematic" | "contextual";
  /** Which portfolio tickers this source is most relevant to. */
  relevantTickers: string[];
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
 * Tickers with documented non-fundamental volatility risks due to
 * algorithmic confusion (name/ticker collisions with other securities or protocols).
 * Structured for richer conflict analysis with collision type and catalyst timeline.
 */
const HIGH_COLLISION_TICKERS: Record<
  string,
  { warning: string; collisionType: string; catalysts: string[] }
> = {
  SYM: {
    warning:
      "⚠️ TICKER RISK: $SYM (Symbotic Inc.) has documented algorithmic confusion with Symbiotic Protocol (symbiotic.fi), a Paradigm-backed Ethereum staking protocol. NLP scrapers, retail search conflation, and momentum algo mis-routing create non-fundamental volatility.",
    collisionType: "crypto-equity crossover",
    catalysts: [
      "Symbiotic Token Generation Event (Q2 2026) — CRITICAL: expect 20-40% volume spike on NASDAQ SYM",
      "Symbiotic Airdrop Distribution (Q3 2026) — CRITICAL: retail attention surge",
      "Protocol TVL milestones may trigger correlated equity price moves",
    ],
  },
};

// ─── Thematic exposure engine ─────────────────────────────────────────────────

/**
 * Second-order risk taxonomy — maps tickers to thematic exposure vectors.
 * When multiple portfolio holdings share a thematic vector, the engine flags
 * systemic concentration risk that is invisible at the individual ticker level.
 *
 * This is the "Deep Thesis Synthesis" layer: instead of matching keywords,
 * we identify CROSS-HOLDING exposure to capex cycles, macro factors, and
 * structural dependencies documented in the research corpus.
 */
type ThematicExposure = {
  theme: string;
  weight: number; // 0–1 exposure intensity
  description: string;
};

const THEMATIC_MAP: Record<string, ThematicExposure[]> = {
  SYM: [
    { theme: "warehouse-automation-capex", weight: 1.0, description: "Pure-play warehouse automation; 100% revenue from MFC deployments" },
    { theme: "walmart-concentration", weight: 0.9, description: "Walmart accounts for overwhelming majority of revenue via 12-year MAA" },
    { theme: "robotics-ai-capex", weight: 0.8, description: "AI-enabled robotics systems; exposed to enterprise automation spend cycles" },
    { theme: "us-consumer-logistics", weight: 0.6, description: "Downstream exposure to US consumer spending via retailer logistics CapEx" },
  ],
  AMZN: [
    { theme: "warehouse-automation-capex", weight: 0.5, description: "Amazon is both customer and competitor in warehouse automation" },
    { theme: "cloud-infrastructure-capex", weight: 0.9, description: "AWS $244B backlog; 3.8GW secured power; dominant hyperscaler" },
    { theme: "us-consumer-logistics", weight: 0.7, description: "Retail segment directly exposed to US consumer spending cycle" },
    { theme: "ai-infrastructure", weight: 0.8, description: "Custom silicon (Trainium/Inferentia), Bedrock platform" },
    { theme: "power-generation-moat", weight: 0.6, description: "Nuclear/SMR power capacity as structural competitive advantage" },
    { theme: "satellite-connectivity", weight: 0.3, description: "Project Kuiper LEO constellation; $10B+ investment" },
  ],
  GOOGL: [
    { theme: "cloud-infrastructure-capex", weight: 0.7, description: "GCP growth trajectory; competing for same enterprise AI workloads as AWS" },
    { theme: "ai-infrastructure", weight: 0.9, description: "TPU custom silicon, Gemini models, AI-first product transformation" },
    { theme: "digital-advertising-cycle", weight: 0.8, description: "Search + YouTube ad revenue; cyclically exposed to ad spend" },
    { theme: "regulatory-antitrust", weight: 0.5, description: "DOJ antitrust remedies pending; structural overhang on Search monopoly" },
  ],
  GLD: [
    { theme: "gold-monetary-debasement", weight: 1.0, description: "Direct gold exposure; thesis anchored in central bank reserve diversification" },
    { theme: "real-rates-sensitivity", weight: 0.9, description: "Inversely correlated with real rates; benefits from dovish rate path" },
    { theme: "geopolitical-hedge", weight: 0.7, description: "Safe-haven bid during geopolitical risk events" },
    { theme: "usd-weakness", weight: 0.6, description: "Benefits from dollar depreciation" },
  ],
  SPY: [
    { theme: "us-equity-beta", weight: 1.0, description: "Broad US equity market exposure" },
    { theme: "us-consumer-logistics", weight: 0.3, description: "Indirect consumer exposure via index composition" },
    { theme: "digital-advertising-cycle", weight: 0.15, description: "Mega-cap tech ad revenue weight in index" },
  ],
  COPPER: [
    { theme: "industrial-metals-cycle", weight: 1.0, description: "Direct copper exposure; cyclically tied to China property + EV transition" },
    { theme: "china-demand-sensitivity", weight: 0.9, description: "25-30% of global copper demand from China property sector" },
  ],
};

/**
 * Detects second-order thematic overlaps across the portfolio.
 * Returns overlapping themes sorted by combined weight (highest concentration first).
 */
function detectThematicOverlaps(
  tickers: string[]
): { theme: string; tickers: string[]; combinedWeight: number; descriptions: string[] }[] {
  const themeMap = new Map<string, { tickers: string[]; totalWeight: number; descriptions: string[] }>();

  for (const ticker of tickers) {
    const exposures = THEMATIC_MAP[ticker];
    if (!exposures) continue;
    for (const exp of exposures) {
      const existing = themeMap.get(exp.theme);
      if (existing) {
        existing.tickers.push(ticker);
        existing.totalWeight += exp.weight;
        existing.descriptions.push(`${ticker}: ${exp.description}`);
      } else {
        themeMap.set(exp.theme, {
          tickers: [ticker],
          totalWeight: exp.weight,
          descriptions: [`${ticker}: ${exp.description}`],
        });
      }
    }
  }

  // Only return themes with 2+ tickers (actual overlaps)
  return [...themeMap.entries()]
    .filter(([, v]) => v.tickers.length >= 2)
    .map(([theme, v]) => ({
      theme,
      tickers: v.tickers,
      combinedWeight: Math.round(v.totalWeight * 100) / 100,
      descriptions: v.descriptions,
    }))
    .sort((a, b) => b.combinedWeight - a.combinedWeight);
}

// ─── Conviction scoring engine ────────────────────────────────────────────────

/**
 * Computes a per-holding conviction score based on track record status,
 * current return vs. benchmark, and thesis freshness.
 * Returns 0-100 where 100 = maximum Solo Strategist conviction.
 */
function computeConvictionScore(ticker: string): {
  score: number;
  basis: string;
  sourceType: "proprietary" | "general";
} {
  const trackItem = trackRecordData.find(
    (item) => item.ticker && item.ticker.toUpperCase() === ticker
  );

  if (!trackItem) {
    return { score: 0, basis: "No Solo Strategist coverage — conviction score unavailable", sourceType: "general" };
  }

  let score = 50; // Base score for covered tickers
  const reasons: string[] = [];

  // Thesis status adjustments
  if (trackItem.thesisStatus === "Playing Out") {
    score += 25;
    reasons.push("thesis actively playing out");
  } else if (trackItem.thesisStatus === "Broken - Exited") {
    score = 5;
    reasons.push("thesis BROKEN — Solo Strategist has exited this position");
  } else if (trackItem.thesisStatus === "Value Trap - Monitoring") {
    score = 20;
    reasons.push("flagged as value trap — under active monitoring");
  } else if (trackItem.thesisStatus === "Pending") {
    score += 10;
    reasons.push("thesis pending validation");
  }

  // Performance vs. benchmark
  const holdingReturn = calculateReturn(trackItem);
  const alpha = holdingReturn - trackItem.benchmarkReturn;
  if (alpha > 10) {
    score += 15;
    reasons.push(`generating ${alpha.toFixed(1)}% alpha vs. benchmark`);
  } else if (alpha > 0) {
    score += 5;
    reasons.push(`modest ${alpha.toFixed(1)}% alpha vs. benchmark`);
  } else if (alpha < -10) {
    score -= 15;
    reasons.push(`underperforming benchmark by ${Math.abs(alpha).toFixed(1)}%`);
  }

  // Status adjustments
  if (trackItem.status === "Correct") {
    score += 10;
    reasons.push("previous call validated as correct");
  } else if (trackItem.status === "Wrong") {
    score -= 20;
    reasons.push("previous call marked incorrect");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    basis: reasons.join("; "),
    sourceType: "proprietary",
  };
}

// ─── Macro signal aggregator ──────────────────────────────────────────────────

/**
 * Synthesises the current Intelligence Feed into a macro context block.
 * Groups signals by category and generates strategist-perspective summaries
 * to inform the Actionable Pivots section.
 */
function buildMacroContext(): string {
  const categories = new Map<string, string[]>();

  for (const item of intelligenceFeed) {
    const summary = generateSummary(item.category, item.source, item.title);
    const existing = categories.get(item.category) ?? [];
    existing.push(`• ${item.title} (${item.source}, ${item.publishedAt})\n  Implication: ${summary}`);
    categories.set(item.category, existing);
  }

  const sections: string[] = [];
  for (const [category, items] of categories) {
    const label = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    sections.push(`### ${label}\n${items.join("\n")}`);
  }

  return sections.join("\n\n");
}

// ─── Finnhub quote ────────────────────────────────────────────────────────────

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

// ─── Context assembly — enhanced with reasoning relevance ─────────────────────

/**
 * Enhanced context builder that scores each Pinecone match for "reasoning relevance"
 * based on how directly it relates to the portfolio tickers.
 */
function buildContextAndCitations(
  matches: PineconeMatch[],
  portfolioTickers: Set<string>
): {
  contextBlock: string;
  citations: Citation[];
} {
  const citations: Citation[] = matches.map((match, i) => {
    const text = (match.metadata.text ?? "").toUpperCase();
    const title = (match.metadata.title ?? "").toUpperCase();

    // Determine which portfolio tickers this source directly references
    const relevantTickers = [...portfolioTickers].filter(
      (t) => text.includes(t) || title.includes(t)
    );

    // Score reasoning relevance
    let reasoningRelevance: "direct" | "thematic" | "contextual";
    if (relevantTickers.length > 0 && match.score > 0.75) {
      reasoningRelevance = "direct";
    } else if (relevantTickers.length > 0 || match.score > 0.6) {
      reasoningRelevance = "thematic";
    } else {
      reasoningRelevance = "contextual";
    }

    return {
      index: i + 1,
      slug: match.metadata.slug,
      title: match.metadata.title,
      sectionHeading: match.metadata.sectionHeading || undefined,
      url: match.metadata.url,
      score: Math.round(match.score * 1000) / 1000,
      reasoningRelevance,
      relevantTickers,
    };
  });

  const contextBlock = matches
    .map((match, i) => {
      const citation = citations[i];
      const heading = match.metadata.sectionHeading
        ? ` — Section: ${match.metadata.sectionHeading}`
        : "";
      const relevanceTag = `[Relevance: ${citation.reasoningRelevance.toUpperCase()}${citation.relevantTickers.length > 0 ? ` — applies to: ${citation.relevantTickers.join(", ")}` : ""}]`;
      return [
        `[${i + 1}] ${match.metadata.title}${heading}`,
        relevanceTag,
        `Published: ${match.metadata.publishedAt} | URL: ${match.metadata.url}`,
        `Content:`,
        match.metadata.text ?? "(content unavailable)",
      ].join("\n");
    })
    .join("\n\n---\n\n");

  return { contextBlock, citations };
}

// ─── System prompt — v2: Deep Thesis Synthesis ────────────────────────────────

function buildAuditSystemPrompt({
  portfolio,
  quotes,
  contextBlock,
  postMortemConflicts,
  trackRecordConflicts,
  trackRecordConvictions,
  collisionWarnings,
  thematicOverlaps,
  convictionScores,
  macroContext,
}: {
  portfolio: PortfolioItem[];
  quotes: Record<string, Quote>;
  contextBlock: string;
  postMortemConflicts: string;
  trackRecordConflicts: string;
  trackRecordConvictions: string;
  collisionWarnings: string;
  thematicOverlaps: string;
  convictionScores: string;
  macroContext: string;
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
      return `${item.ticker} | ${item.shares} shares | $${q.price.toFixed(2)} | ${weight}%`;
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

  return `You are The Portfolio Auditor — a Senior Quantitative Risk Analyst operating within The Solo Strategist's institutional research framework. Your mandate is to apply second-order reasoning to cross-reference a user's portfolio against proprietary research, post-mortem audits, the live track record, and current macro signals.

You operate at a higher analytical standard than a basic screen. You must:
- Synthesise CROSS-HOLDING systemic risks, not just per-ticker checks
- Distinguish between "Proprietary Research" (cited as [N]) and "General Market Principles" (explicitly labelled as such)
- Weight your analysis by conviction scores and macro positioning, not just price moves
- Flag ticker collision risks with specific catalyst timelines

## PORTFOLIO HOLDINGS (Ticker | Shares | Live Price | Weight)
${holdingsTable}
Total Portfolio Value: $${totalValue > 0 ? totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A"}

## LIVE MARKET SNAPSHOT
${marketSnapshot}

## SOLO STRATEGIST CONVICTION SCORES (Proprietary)
${convictionScores || "No conviction data available for these holdings."}

## THEMATIC OVERLAP ANALYSIS (Second-Order Risk Engine)
${thematicOverlaps || "No cross-holding thematic overlaps detected."}

## RELEVANT RESEARCH — PROPRIETARY CORPUS (Cite as [N])
Each source is tagged with a Relevance level:
- DIRECT: Source explicitly covers a portfolio holding
- THEMATIC: Source covers a related sector/theme
- CONTEXTUAL: Source provides background macro or methodological context

${contextBlock || "No relevant research found in corpus for these holdings."}

## POST-MORTEM CONFLICTS (Proprietary — Broken Thesis Registry)
${postMortemConflicts || "No post-mortem conflicts detected."}
${postMortemConflicts ? `\nINSTRUCTION: If a user holds a ticker that appears in the Broken Thesis Registry above, this is a FRAMEWORK VIOLATION. The Solo Strategist has publicly documented why this thesis failed, what diverged from the original model, and what systemic lesson was extracted. Your Conflict Alert MUST explain:\n1. What the original thesis was and why it was published\n2. What specifically broke (the divergence)\n3. Why holding this position now contradicts the framework's own post-mortem conclusions\n4. Whether any conditions have changed since the exit that would justify re-entry (if not, state so explicitly)` : ""}

## TRACK RECORD CROSS-REFERENCE
${trackRecordConflicts || "No explicit track record conflicts."}
${trackRecordConvictions || ""}

${collisionWarnings ? `## ⚠️ TICKER COLLISION REGISTRY\n${collisionWarnings}` : ""}

## CURRENT MACRO SIGNALS (Intelligence Feed — for Actionable Pivots weighting)
${macroContext}

---

## ANALYTICAL FRAMEWORK

### Source Attribution Rules (Hallucination Prevention)
1. **[N] citations** = claim is sourced from the Proprietary Research Corpus above. MANDATORY for all specific numbers, valuations, backlog figures, and strategic conclusions.
2. **[Proprietary Track Record]** = claim derives from the conviction scores, track record status, or post-mortem data provided above.
3. **[General Market Principles]** = claim is based on widely-accepted financial principles (e.g., sector correlation, duration sensitivity) NOT found in the proprietary corpus. You MUST explicitly label these.
4. **[Macro Signal]** = claim is informed by the Intelligence Feed signals above.
5. If you cannot source a claim to ANY of the above four categories, DO NOT MAKE THE CLAIM. State: "Insufficient data in the Solo Strategist corpus to assess [topic]."

### Reasoning Depth Requirements
- For EACH holding: identify not just what it is, but what thematic vectors it sits on and how those vectors overlap with other holdings
- For CONFLICT ALERTS: do not merely flag — EXPLAIN the reasoning chain. Why does this conflict matter? What is the second-order consequence?
- For HIDDEN CORRELATIONS: go beyond sector labels. Identify shared capex cycles, customer concentration overlaps, macro factor betas, and regulatory exposure that create portfolio-level fragility
- For ACTIONABLE PIVOTS: weight suggestions by conviction score AND current macro signal direction. A hedge against a rate-sensitive position is more urgent when the Intelligence Feed shows hawkish central bank signals.

## OUTPUT FORMAT — exactly four ### sections:

### Portfolio Risk Summary
Open with a **Conviction Alignment Score: [X/100]** — computed as the portfolio-weighted average of individual conviction scores. Then provide 2-3 sentences covering overall risk profile, key concentration risks, and how well this portfolio aligns with the Solo Strategist's current positioning. Explicitly state what percentage of the portfolio has proprietary coverage vs. general market exposure.

### ⚠️ Conflict Alerts
For EACH conflict (Broken theses, post-mortem violations, ticker collision risks):
- State the conflict type (Framework Violation / Ticker Collision / Conviction Divergence)
- Explain the full reasoning chain using [N] citations and [Proprietary Track Record] tags
- For ticker collisions: cite specific upcoming catalyst dates and expected volatility magnitude
- If NO conflicts exist, state: "No explicit conflicts detected — see Hidden Correlations below for systemic risks."

### Hidden Correlations
Identify non-obvious overlaps using the Thematic Overlap Analysis provided above:
- Quantify the portfolio's exposure to each shared theme (e.g., "42% of portfolio value is exposed to warehouse-automation-capex via SYM + AMZN")
- Flag macro factor betas that affect multiple holdings (rate sensitivity, USD, China demand)
- Distinguish between [N]-sourced correlations (from research) and [General Market Principles] correlations

### Actionable Pivots
1-3 specific, conviction-weighted hedges:
- Each must cite its rationale from [N] sources, [Proprietary Track Record], or [Macro Signal]
- Weight urgency by conviction score: low-conviction holdings deserve tighter hedges
- Reference the macro signal direction when suggesting rate/commodity/FX hedges
- If the corpus provides insufficient data to recommend a specific hedge, state so explicitly rather than fabricating

Use prose, not bullet lists (except within Conflict Alerts where structured enumeration aids clarity). Stay under 1200 words.`;
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

  // Validate and normalise
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

  const portfolioTickers = new Set(validPortfolio.map((item) => item.ticker));

  // 1. Fetch live quotes for all tickers in parallel
  const quoteResults = await Promise.allSettled(
    validPortfolio.map((item) => fetchFinnhubQuote(item.ticker))
  );

  const quotes: Record<string, Quote> = {};
  quoteResults.forEach((result, i) => {
    if (result.status === "fulfilled" && result.value) {
      quotes[validPortfolio[i].ticker] = result.value;
    }
  });

  // 2. Build embedding query — enriched with thematic vocabulary
  const tickerString = validPortfolio.map((item) => item.ticker).join(" ");
  const themeVocab = validPortfolio
    .flatMap((item) => THEMATIC_MAP[item.ticker]?.map((t) => t.theme) ?? [])
    .filter((v, i, a) => a.indexOf(v) === i) // dedupe
    .join(" ")
    .replace(/-/g, " ");
  const queryString = `${tickerString} ${themeVocab} portfolio risk analysis sector conviction thesis valuation capex cycle correlation`;

  // 3. Embed query
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

  // 4. Query Pinecone for top 10 research chunks (increased from 8 for deeper coverage)
  let matches: PineconeMatch[] = [];
  try {
    matches = await queryVectors(queryEmbedding, 10);
  } catch {
    matches = [];
  }

  // 5. Enhanced context assembly with reasoning relevance scoring
  const { contextBlock, citations } = buildContextAndCitations(matches, portfolioTickers);

  // 6. Cross-reference local data

  // Post-mortem conflicts — enriched with full divergence chain
  const conflictingPostMortems = postMortems.filter((pm) =>
    portfolioTickers.has(pm.ticker.toUpperCase())
  );
  const postMortemConflicts = conflictingPostMortems
    .map(
      (pm) =>
        `🚨 FRAMEWORK VIOLATION: ${pm.ticker} — "${pm.title}" (Published: ${pm.datePublished}, Exited: ${pm.dateExited})\n` +
        `  Original Thesis: ${pm.originalThesis.summary}\n` +
        `  What Diverged: ${pm.divergence.summary}\n` +
        `  Divergence Details:\n${pm.divergence.details.map((d) => `    - ${d}`).join("\n")}\n` +
        `  Systemic Lesson: ${pm.lesson.summary}\n` +
        `  Process Changes: ${pm.lesson.details.map((d) => `    - ${d}`).join("\n")}\n` +
        `  Total Loss vs. Benchmark: ${pm.totalLossVsBenchmark}`
    )
    .join("\n\n");

  // Track record: Broken - Exited
  const brokenItems = trackRecordData.filter(
    (item) =>
      item.ticker &&
      portfolioTickers.has(item.ticker.toUpperCase()) &&
      item.thesisStatus === "Broken - Exited"
  );
  const trackRecordConflicts = brokenItems
    .map((item) => {
      const ret = calculateReturn(item);
      return (
        `🚨 BROKEN THESIS: ${item.ticker} — "${item.prediction}"\n` +
        `  Published: ${item.datePublished} | Entry: $${item.entryPrice} → Current: $${item.currentPrice}\n` +
        `  Holding Return: ${ret.toFixed(1)}% | Benchmark: ${item.benchmarkReturn}% | Alpha: ${(ret - item.benchmarkReturn).toFixed(1)}%`
      );
    })
    .join("\n\n");

  // Active convictions
  const convictionItems = trackRecordData.filter(
    (item) =>
      item.ticker &&
      portfolioTickers.has(item.ticker.toUpperCase()) &&
      item.thesisStatus === "Playing Out"
  );
  const trackRecordConvictions = convictionItems
    .map((item) => {
      const ret = calculateReturn(item);
      return (
        `✓ ACTIVE CONVICTION: ${item.ticker} — "${item.prediction}" | Playing Out\n` +
        `  Published: ${item.datePublished} | Return: ${ret.toFixed(1)}% | Alpha: ${(ret - item.benchmarkReturn).toFixed(1)}%`
      );
    })
    .join("\n");

  // Collision warnings — enriched with catalyst timeline
  const collisionWarnings = validPortfolio
    .map((item) => {
      const collision = HIGH_COLLISION_TICKERS[item.ticker];
      if (!collision) return null;
      return (
        `${collision.warning}\n` +
        `  Collision Type: ${collision.collisionType}\n` +
        `  Upcoming Catalysts:\n${collision.catalysts.map((c) => `    - ${c}`).join("\n")}`
      );
    })
    .filter(Boolean)
    .join("\n\n");

  // 7. Thematic overlap detection (second-order risk engine)
  const overlaps = detectThematicOverlaps([...portfolioTickers]);
  const thematicOverlaps = overlaps.length > 0
    ? overlaps
        .map(
          (o) =>
            `THEME: "${o.theme.replace(/-/g, " ")}" — Exposed tickers: ${o.tickers.join(", ")} (combined weight: ${o.combinedWeight})\n` +
            o.descriptions.map((d) => `  - ${d}`).join("\n")
        )
        .join("\n\n")
    : "";

  // 8. Conviction scores (per-holding)
  const scores = validPortfolio.map((item) => {
    const result = computeConvictionScore(item.ticker);
    return {
      ticker: item.ticker,
      ...result,
    };
  });
  const convictionScores = scores
    .map(
      (s) =>
        `${s.ticker}: ${s.score}/100 [${s.sourceType === "proprietary" ? "Proprietary" : "No Coverage"}] — ${s.basis}`
    )
    .join("\n");

  // 9. Macro context from Intelligence Feed
  const macroContext = buildMacroContext();

  // 10. Build system prompt
  const systemPrompt = buildAuditSystemPrompt({
    portfolio: validPortfolio,
    quotes,
    contextBlock,
    postMortemConflicts,
    trackRecordConflicts,
    trackRecordConvictions,
    collisionWarnings,
    thematicOverlaps,
    convictionScores,
    macroContext,
  });

  // 11. Stream the audit report — elevated temperature slightly for richer reasoning
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
            .join(", ")}. Apply deep thesis synthesis — identify second-order risks, thematic concentration, and conviction-weighted pivots. Cross-reference against Solo Strategist research and provide the structured risk report.`,
        },
      ],
      maxOutputTokens: 2500,
      temperature: 0.4,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: `Model unavailable: ${msg}` }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 12. Return stream with enhanced citation metadata in header
  return result.toTextStreamResponse({
    headers: {
      "X-Citations": JSON.stringify(citations),
    },
  });
}
