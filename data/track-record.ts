export type ThesisStatus =
  | "Playing Out"
  | "Broken - Exited"
  | "Value Trap - Monitoring"
  | "Pending";

export type TrackRecordItem = {
  prediction: string;
  ticker?: string;
  datePublished: string;
  entryPrice: number;
  currentPrice: number;
  benchmarkReturn: number;
  status: "Correct" | "Wrong" | "Pending";
  thesisStatus: ThesisStatus;
};

export const trackRecordData: TrackRecordItem[] = [
  {
    prediction: "Symbotic - The Automation Backbone of Commerce",
    ticker: "SYM",
    datePublished: "2026-02-17",
    entryPrice: 55.0,
    currentPrice: 55.81,
    benchmarkReturn: 2.1,
    status: "Pending",
    thesisStatus: "Pending",
  },
  {
    prediction: "Amazon - Infrastructure Harvesting Cycle",
    ticker: "AMZN",
    datePublished: "2026-02-16",
    entryPrice: 197.0,
    currentPrice: 214.2,
    benchmarkReturn: 2.1,
    status: "Pending",
    thesisStatus: "Playing Out",
  },
  {
    prediction: "Alphabet - The Compounding Intelligence Engine",
    ticker: "GOOGL",
    datePublished: "2026-02-16",
    entryPrice: 296.0,
    currentPrice: 306.0,
    benchmarkReturn: 2.1,
    status: "Pending",
    thesisStatus: "Playing Out",
  },
  {
    prediction: "Gold - The $6,100 Thesis",
    ticker: "XAU",
    datePublished: "2026-02-19",
    entryPrice: 4704.05,
    currentPrice: 4704.05,
    benchmarkReturn: 0,
    status: "Pending",
    thesisStatus: "Pending",
  },
  {
    prediction: "North American Midstream Re-Rating",
    datePublished: "2025-05-22",
    entryPrice: 44.2,
    currentPrice: 63.5,
    benchmarkReturn: 14.4,
    status: "Correct",
    thesisStatus: "Playing Out",
  },
  {
    prediction: "Payment Infrastructure Margin Expansion",
    datePublished: "2025-07-10",
    entryPrice: 88.9,
    currentPrice: 95.1,
    benchmarkReturn: 9.1,
    status: "Pending",
    thesisStatus: "Playing Out",
  },
  {
    prediction: "Industrial Copper Demand Overshoot",
    datePublished: "2024-11-30",
    entryPrice: 31.7,
    currentPrice: 26.8,
    benchmarkReturn: 18.2,
    status: "Wrong",
    thesisStatus: "Broken - Exited",
  },
  {
    prediction: "European Grid Modernisation Basket",
    datePublished: "2025-03-14",
    entryPrice: 52.4,
    currentPrice: 71.3,
    benchmarkReturn: 12.5,
    status: "Correct",
    thesisStatus: "Playing Out",
  },
  {
    prediction: "Selective HY Credit Compression",
    datePublished: "2025-09-05",
    entryPrice: 67.5,
    currentPrice: 73.7,
    benchmarkReturn: 8.6,
    status: "Pending",
    thesisStatus: "Pending",
  },
];

export function calculateReturn(item: TrackRecordItem) {
  return ((item.currentPrice - item.entryPrice) / item.entryPrice) * 100;
}
