type Category = "central-banks" | "global-trade" | "geopolitics" | "markets" | "business" | string;

const templates: Record<string, (source: string, title: string) => string> = {
  "central-banks": (source, title) => {
    const dovish = /cut|ease|inject|liquidity|accommodat|steady|hold|patience/i.test(title);
    const stance = dovish ? "dovish" : "hawkish";
    const duration = dovish ? "long-duration" : "short-duration";
    return `This signals ${stance} positioning from ${source}, with direct implications for rate-sensitive duration exposure. Capital allocation consideration: ${duration} fixed income and rate-proxy equities may require tactical adjustment.`;
  },
  "global-trade": (source, _title) => {
    return `Trade policy recalibration flagged by ${source} introduces supply-chain repricing risk across exposed sectors. Strategist view: monitor second-order effects on input costs, margin compression, and regional equity beta.`;
  },
  "geopolitics": (_source, _title) => {
    return `Geopolitical risk premium is shifting - this development warrants close monitoring for contagion into commodity pricing and sovereign credit spreads. Portfolio implication: reassess tail-risk hedges and geographic concentration in affected corridors.`;
  },
  "markets": (source, title) => {
    const bullish = /surge|rally|gain|record|extend|compliance|cut/i.test(title);
    const tone = bullish ? "constructive" : "defensive";
    return `Market-moving signal from ${source} suggests a ${tone} near-term posture for affected asset classes. Capital allocation impact: review sector tilts and benchmark-relative positioning for tactical opportunities.`;
  },
};

export function generateSummary(category: Category, source: string, title: string): string {
  const generator = templates[category] ?? templates["markets"];
  return generator(source, title);
}
