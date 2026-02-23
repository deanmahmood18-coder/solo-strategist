export const runtime = "edge";

import { NextResponse } from "next/server";

export type YieldData = {
  label: string;
  region: "US" | "UK";
  tenor: string;
  yield: number;
  change: number;
};

const FALLBACK: YieldData[] = [
  { label: "US 2Y",  region: "US", tenor: "2Y",  yield: 4.27, change: -0.02 },
  { label: "US 10Y", region: "US", tenor: "10Y", yield: 4.47, change: 0.03 },
  { label: "US 30Y", region: "US", tenor: "30Y", yield: 4.68, change: 0.01 },
  { label: "UK 2Y",  region: "UK", tenor: "2Y",  yield: 4.18, change: -0.01 },
  { label: "UK 10Y", region: "UK", tenor: "10Y", yield: 4.52, change: 0.02 },
  { label: "UK 30Y", region: "UK", tenor: "30Y", yield: 5.00, change: -0.03 },
];

let cache: { data: YieldData[]; ts: number } | null = null;
const TTL = 1_800_000; // 30 minutes

function getCurrentYear(): number {
  return new Date().getFullYear();
}

function getCurrentMonth(): string {
  return String(new Date().getMonth() + 1).padStart(2, "0");
}

async function fetchTreasuryYields(): Promise<YieldData[]> {
  const year = getCurrentYear();
  const month = getCurrentMonth();

  // Treasury.gov CSV endpoint for daily rates
  const url = `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/all/${year}${month}?type=daily_treasury_yield_curve&field_tdr_date_value_month=${year}${month}&page&_format=csv`;

  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`Treasury API HTTP ${res.status}`);

  const text = await res.text();
  const lines = text.trim().split("\n");
  if (lines.length < 2) throw new Error("No data rows");

  // Parse CSV header to find column indices
  const header = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  const col2Y = header.findIndex((h) => h === "2 Yr");
  const col10Y = header.findIndex((h) => h === "10 Yr");
  const col30Y = header.findIndex((h) => h === "30 Yr");

  if (col2Y === -1 || col10Y === -1 || col30Y === -1) {
    throw new Error("Column headers not found");
  }

  // Most recent row is the last line
  const latestRow = lines[lines.length - 1].split(",").map((v) => v.trim().replace(/"/g, ""));
  const y2 = parseFloat(latestRow[col2Y]);
  const y10 = parseFloat(latestRow[col10Y]);
  const y30 = parseFloat(latestRow[col30Y]);

  if (isNaN(y2) || isNaN(y10) || isNaN(y30)) {
    throw new Error("Failed to parse yields");
  }

  // Previous day for change calculation
  let prevY2 = y2, prevY10 = y10, prevY30 = y30;
  if (lines.length >= 3) {
    const prevRow = lines[lines.length - 2].split(",").map((v) => v.trim().replace(/"/g, ""));
    prevY2 = parseFloat(prevRow[col2Y]) || y2;
    prevY10 = parseFloat(prevRow[col10Y]) || y10;
    prevY30 = parseFloat(prevRow[col30Y]) || y30;
  }

  return [
    { label: "US 2Y",  region: "US", tenor: "2Y",  yield: y2,  change: round(y2 - prevY2) },
    { label: "US 10Y", region: "US", tenor: "10Y", yield: y10, change: round(y10 - prevY10) },
    { label: "US 30Y", region: "US", tenor: "30Y", yield: y30, change: round(y30 - prevY30) },
  ];
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const usYields = await fetchTreasuryYields();

    // UK Gilts: hardcoded with note for future BoE API integration
    const ukYields: YieldData[] = [
      { label: "UK 2Y",  region: "UK", tenor: "2Y",  yield: 4.18, change: -0.01 },
      { label: "UK 10Y", region: "UK", tenor: "10Y", yield: 4.52, change: 0.02 },
      { label: "UK 30Y", region: "UK", tenor: "30Y", yield: 5.00, change: -0.03 },
    ];

    const combined = [...usYields, ...ukYields];
    cache = { data: combined, ts: Date.now() };
    return NextResponse.json(combined);
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
