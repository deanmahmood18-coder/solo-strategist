// Node.js runtime required: Pinecone client uses node:stream internally.
// The AI SDK streamText + embed calls are fully compatible with Node.js runtime.

import { NextRequest } from "next/server";
import { streamText, embed } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { queryVectors, type PineconeMatch } from "@/lib/vector/pinecone";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Citation = {
  index: number;
  slug: string;
  title: string;
  sectionHeading?: string;
  url: string;
  score: number;
};

// ─── Ticker detection ─────────────────────────────────────────────────────────

/**
 * Common uppercase abbreviations that are not stock tickers.
 * Filtered out before passing to Finnhub to avoid wasted API calls.
 */
const TICKER_BLOCKLIST = new Set([
  "I", "A", "AI", "IT", "US", "UK", "EU", "THE", "AT", "IN", "OR",
  "AND", "ETF", "IPO", "FCF", "DCF", "YOY", "EPS", "PE", "TTM",
  "CEO", "CFO", "CIO", "COO", "ROI", "ROE", "ROA", "EBIT", "EBITDA",
  "YTD", "MFC", "AWS", "LEO", "SMR", "TVL", "FCC", "GAAP", "SEC",
]);

function extractTickers(message: string): string[] {
  const matches = message.match(/\b[A-Z]{1,5}\b/g) ?? [];
  return [...new Set(matches)].filter((t) => !TICKER_BLOCKLIST.has(t));
}

// ─── Finnhub quote ────────────────────────────────────────────────────────────

type Quote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
};

/**
 * Fetches a real-time quote from Finnhub. Returns null on any failure
 * so the agent degrades gracefully when live data is unavailable.
 * Mirrors the pattern in app/api/market/candles/route.ts.
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
    // data.c === 0 means Finnhub has no data for this symbol
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
        : "";  // empty string sentinel = non-section chunk
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

function buildSystemPrompt(contextBlock: string): string {
  return `You are the Solo Strategist Research Companion — a rigorous investment research assistant with access to a proprietary corpus of equity analysis, macro outlook reports, credit monitoring notes, and commodities research.

## Ground Rules

1. **Citations are mandatory.** Every factual claim, valuation figure, price target, financial metric, or analytical conclusion MUST be sourced from the research context below. Insert inline citations as [1], [2], [3] immediately after the claim, matching the numbered sources.

2. **No fabrication.** If the context does not contain sufficient information to answer the question, say: "The research corpus does not currently cover this topic. I can only speak to what is in the published reports."

3. **No invented numbers.** Never generate price targets, DCF values, backlog figures, revenue growth rates, or any quantitative data. All numbers must trace back to a numbered source.

4. **Analytical tone.** Respond with the precision of a professional investment memorandum. Be direct and structured. Use prose, not bullet lists unless enumeration is explicitly requested. Stay under 600 words.

5. **Scope boundary.** You are limited to the research documents provided. Do not draw on general training knowledge about companies to fill gaps. When appropriate, note that research represents the author's view as of the published date.

6. **Citation links.** Do NOT list URLs in your response — use only [N] inline. The interface renders citation cards automatically.

## Available Research Sources

${contextBlock || "No relevant sources were found for this query. Inform the user the corpus does not cover this topic."}`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Parse body — supports both direct { message } and useChat { messages: UIMessage[] } formats
  let rawBody: Record<string, unknown>;
  try {
    rawBody = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let userText = "";

  if (Array.isArray(rawBody.messages)) {
    // v6 useChat format: messages are UIMessage objects with a `parts` array
    type Part = { type: string; text?: string };
    type UIMsgRaw = { role: string; parts?: Part[] };
    const msgs = rawBody.messages as UIMsgRaw[];
    const lastUser = [...msgs].reverse().find((m) => m.role === "user");
    userText = (lastUser?.parts ?? [])
      .filter((p): p is Part & { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("");
  } else if (typeof rawBody.message === "string") {
    // Legacy direct format: { message: string }
    userText = rawBody.message;
  }

  if (!userText || userText.trim().length === 0) {
    return new Response(JSON.stringify({ error: "message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const trimmed = userText.trim().slice(0, 2000);

  // 2. Embed the query
  let queryEmbedding: number[];
  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: trimmed,
      providerOptions: { openai: { dimensions: 1024 } },
    });
    queryEmbedding = embedding;
  } catch {
    return new Response(
      JSON.stringify({ error: "Embedding service unavailable" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // 3. Parallel: vector search + optional live price fetch
  const tickers = extractTickers(trimmed);
  const primaryTicker = tickers[0] ?? null;

  const [matchesResult, quoteResult] = await Promise.allSettled([
    queryVectors(queryEmbedding, 5),
    primaryTicker ? fetchFinnhubQuote(primaryTicker) : Promise.resolve(null),
  ]);

  const matches = matchesResult.status === "fulfilled" ? matchesResult.value : [];
  const quote = quoteResult.status === "fulfilled" ? quoteResult.value : null;

  // 4. Build context block and citation metadata
  const { contextBlock, citations } = buildContextAndCitations(matches);

  // 5. Append live price to the user message (not the system prompt)
  //    Labelled as live data so the model understands it supersedes any stale
  //    price figures that may appear in the research documents.
  const priceContext = quote
    ? `\n\n[Live market data] ${quote.symbol} is trading at $${quote.price.toFixed(2)} (${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}% today). Use this as the current price; it supersedes any price figures in the research documents.`
    : "";

  // 6. Stream the response
  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: buildSystemPrompt(contextBlock),
    messages: [{ role: "user", content: trimmed + priceContext }],
    maxOutputTokens: 1200,
    temperature: 0.3,
  });

  // 7. Return a plain text stream with citations in a custom header.
  //    toTextStreamResponse() is consumed by TextStreamChatTransport on the client.
  return result.toTextStreamResponse({
    headers: {
      "X-Citations": JSON.stringify(citations),
      ...(primaryTicker ? { "X-Query-Ticker": primaryTicker } : {}),
    },
  });
}
