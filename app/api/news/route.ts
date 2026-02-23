export const runtime = "edge";

import { NextResponse } from "next/server";

type NewsItem = {
  id: string;
  time: string;
  source: string;
  title: string;
  category: string;
  url: string;
  publishedAt: string;
};

let cache: { data: NewsItem[]; ts: number } | null = null;
const TTL = 300_000; // 5 minutes

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

async function fetchFinnhubNews(apiKey: string): Promise<NewsItem[]> {
  const res = await fetch(
    `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`,
    { next: { revalidate: 300 } }
  );
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.slice(0, 12).map((item: {
    id: number;
    datetime: number;
    source: string;
    headline: string;
    category: string;
    url: string;
  }) => {
    const date = new Date(item.datetime * 1000);
    return {
      id: String(item.id),
      time: formatTime(date),
      source: item.source,
      title: item.headline,
      category: item.category,
      url: item.url,
      publishedAt: date.toISOString().split("T")[0],
    };
  });
}

async function fetchNewsDataIO(apiKey: string): Promise<NewsItem[]> {
  const res = await fetch(
    `https://newsdata.io/api/1/latest?apikey=${apiKey}&category=business&language=en&size=10`,
    { next: { revalidate: 300 } }
  );
  const data = await res.json();
  if (!data.results || !Array.isArray(data.results)) return [];

  return data.results.map((item: {
    article_id: string;
    pubDate: string;
    source_name: string;
    title: string;
    category: string[];
    link: string;
  }, i: number) => {
    const date = item.pubDate ? new Date(item.pubDate) : new Date();
    return {
      id: item.article_id || String(i),
      time: formatTime(date),
      source: item.source_name || "Wire",
      title: item.title,
      category: item.category?.[0] || "business",
      url: item.link || "",
      publishedAt: date.toISOString().split("T")[0],
    };
  });
}

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json(cache.data);
  }

  // Try NewsData.io first (better for curated business/finance news)
  const newsDataKey = process.env.NEWSDATA_API_KEY;
  if (newsDataKey) {
    try {
      const items = await fetchNewsDataIO(newsDataKey);
      if (items.length > 0) {
        cache = { data: items, ts: Date.now() };
        return NextResponse.json(items);
      }
    } catch { /* fall through */ }
  }

  // Fall back to Finnhub news (free, included with market data key)
  const finnhubKey = process.env.FINNHUB_API_KEY;
  if (finnhubKey) {
    try {
      const items = await fetchFinnhubNews(finnhubKey);
      if (items.length > 0) {
        cache = { data: items, ts: Date.now() };
        return NextResponse.json(items);
      }
    } catch { /* fall through */ }
  }

  // No API keys — return empty (component falls back to mock data)
  return NextResponse.json([]);
}
