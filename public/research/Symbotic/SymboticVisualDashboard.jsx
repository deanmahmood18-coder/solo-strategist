import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import * as recharts from "recharts";

const {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  ResponsiveContainer, ReferenceLine
} = recharts;

// ─── DESIGN TOKENS ─────────────────────────────────────────────
const T = {
  bg: "#0a0e17",
  bgCard: "#0f1520",
  bgCardHover: "#141c2b",
  border: "#1c2940",
  borderActive: "#2a6bff",
  text: "#c8d6e5",
  textMuted: "#5a6d85",
  textBright: "#e8f0fe",
  accent: "#2a6bff",
  accentGlow: "rgba(42,107,255,0.15)",
  green: "#00d68f",
  greenMuted: "rgba(0,214,143,0.12)",
  red: "#ff4757",
  redMuted: "rgba(255,71,87,0.12)",
  amber: "#ffc048",
  amberMuted: "rgba(255,192,72,0.12)",
  cyan: "#00d4ff",
  cyanMuted: "rgba(0,212,255,0.12)",
  magenta: "#c471ed",
  magentaMuted: "rgba(196,113,237,0.12)",
  gridLine: "#1a2235",
};

const font = `'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace`;
const fontSans = `'DM Sans', 'Segoe UI', system-ui, sans-serif`;

// ─── GLOBAL STYLES ─────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${T.bg}; }
    ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(18px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 ${T.accentGlow}; }
      50% { box-shadow: 0 0 20px 4px ${T.accentGlow}; }
    }
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    @keyframes drawLine {
      from { stroke-dashoffset: 1000; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes tickerScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `}</style>
);

// ─── SMALL COMPONENTS ──────────────────────────────────────────
const Badge = ({ children, color = T.accent, bg }) => (
  <span style={{
    display: "inline-block", padding: "2px 8px", borderRadius: 3,
    fontSize: 10, fontFamily: font, fontWeight: 600, letterSpacing: 1,
    color, background: bg || `${color}18`, textTransform: "uppercase",
    border: `1px solid ${color}30`,
  }}>{children}</span>
);

const SectionHeader = ({ number, title, subtitle }) => (
  <div style={{
    display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20,
    borderBottom: `1px solid ${T.border}`, paddingBottom: 12,
  }}>
    <span style={{
      fontFamily: font, fontSize: 11, color: T.accent, fontWeight: 700,
      letterSpacing: 2, opacity: 0.7,
    }}>{number}</span>
    <span style={{
      fontFamily: fontSans, fontSize: 20, fontWeight: 700, color: T.textBright,
      letterSpacing: -0.5,
    }}>{title}</span>
    {subtitle && <span style={{
      fontFamily: font, fontSize: 11, color: T.textMuted, marginLeft: "auto",
    }}>{subtitle}</span>}
  </div>
);

const Card = ({ children, delay = 0, style = {} }) => (
  <div style={{
    background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 6,
    padding: 28, position: "relative", overflow: "hidden",
    animation: `fadeSlideUp 0.6s ease ${delay}s both`,
    ...style,
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 1,
      background: `linear-gradient(90deg, transparent, ${T.accent}40, transparent)`,
    }} />
    {children}
  </div>
);

const Ticker = () => {
  const items = [
    { sym: "SYM", val: "55.81", chg: "+1.56%", up: true },
    { sym: "EBITDA", val: "$67M", chg: "+274% YoY", up: true },
    { sym: "BACKLOG", val: "$22.3B", chg: "-0.9% QoQ", up: false },
    { sym: "CASH", val: "$1.8B", chg: "+46% QoQ", up: true },
    { sym: "DCF/SH", val: "$20", chg: "Base Case", up: false },
    { sym: "EV/REV", val: "13.8x", chg: "vs 3.9x ROK", up: false },
    { sym: "GM%", val: "23.4%", chg: "+570bps", up: true },
    { sym: "SYMBIOTIC TVL", val: "$1.5B", chg: "Peak", up: true },
  ];
  const doubled = [...items, ...items];
  return (
    <div style={{
      width: "100%", overflow: "hidden", background: "#060a12",
      borderBottom: `1px solid ${T.border}`, padding: "6px 0",
    }}>
      <div style={{
        display: "flex", gap: 36, whiteSpace: "nowrap",
        animation: "tickerScroll 30s linear infinite",
        width: "max-content",
      }}>
        {doubled.map((t, i) => (
          <span key={i} style={{
            fontFamily: font, fontSize: 11, display: "inline-flex", gap: 6,
            alignItems: "center",
          }}>
            <span style={{ color: T.accent, fontWeight: 700 }}>{t.sym}</span>
            <span style={{ color: T.textBright }}>{t.val}</span>
            <span style={{ color: t.up ? T.green : T.red, fontSize: 10 }}>{t.chg}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// CHART 1: SYM DUALITY VENN DIAGRAM
// ═══════════════════════════════════════════════════════════════
const VennDiagram = () => {
  const svgRef = useRef();
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const w = 620, h = 360;
    svg.attr("viewBox", `0 0 ${w} ${h}`);

    const defs = svg.append("defs");

    // Glow filter
    const glow = defs.append("filter").attr("id", "glow");
    glow.append("feGaussianBlur").attr("stdDeviation", "6").attr("result", "blur");
    glow.append("feMerge").selectAll("feMergeNode")
      .data(["blur", "SourceGraphic"]).enter()
      .append("feMergeNode").attr("in", d => d);

    // Gradients
    const leftGrad = defs.append("radialGradient").attr("id", "leftGrad");
    leftGrad.append("stop").attr("offset", "0%").attr("stop-color", T.accent).attr("stop-opacity", 0.25);
    leftGrad.append("stop").attr("offset", "100%").attr("stop-color", T.accent).attr("stop-opacity", 0.03);
    const rightGrad = defs.append("radialGradient").attr("id", "rightGrad");
    rightGrad.append("stop").attr("offset", "0%").attr("stop-color", T.magenta).attr("stop-opacity", 0.25);
    rightGrad.append("stop").attr("offset", "100%").attr("stop-color", T.magenta).attr("stop-opacity", 0.03);

    // Grid
    for (let x = 0; x <= w; x += 40) {
      svg.append("line").attr("x1", x).attr("y1", 0).attr("x2", x).attr("y2", h)
        .attr("stroke", T.gridLine).attr("stroke-width", 0.3);
    }
    for (let y = 0; y <= h; y += 40) {
      svg.append("line").attr("x1", 0).attr("y1", y).attr("x2", w).attr("y2", y)
        .attr("stroke", T.gridLine).attr("stroke-width", 0.3);
    }

    const cx1 = 230, cx2 = 390, cy = 180, r = 140;

    // Left circle - Physical/AI
    svg.append("circle").attr("cx", cx1).attr("cy", cy).attr("r", r)
      .attr("fill", "url(#leftGrad)").attr("stroke", T.accent)
      .attr("stroke-width", 1.5).attr("stroke-dasharray", "4,3").attr("opacity", 0.9);

    // Right circle - Digital/Restaking
    svg.append("circle").attr("cx", cx2).attr("cy", cy).attr("r", r)
      .attr("fill", "url(#rightGrad)").attr("stroke", T.magenta)
      .attr("stroke-width", 1.5).attr("stroke-dasharray", "4,3").attr("opacity", 0.9);

    // Overlap highlight
    svg.append("ellipse").attr("cx", (cx1 + cx2) / 2).attr("cy", cy)
      .attr("rx", 55).attr("ry", 90)
      .attr("fill", "rgba(255,192,72,0.08)").attr("stroke", T.amber)
      .attr("stroke-width", 1).attr("stroke-dasharray", "2,4")
      .attr("filter", "url(#glow)");

    // Left labels
    const leftItems = [
      { text: "NASDAQ: SYM", y: -50, bold: true },
      { text: "AI-Powered Robotics", y: -25 },
      { text: "$22.3B Backlog", y: 0 },
      { text: "$2.25B Revenue", y: 25 },
      { text: "Walmart Anchor", y: 50 },
    ];
    leftItems.forEach(item => {
      svg.append("text").attr("x", cx1 - 60).attr("y", cy + item.y)
        .attr("text-anchor", "middle").attr("fill", item.bold ? T.accent : T.text)
        .attr("font-size", item.bold ? 12 : 10).attr("font-family", font)
        .attr("font-weight", item.bold ? 700 : 400).text(item.text);
    });

    // Right labels
    const rightItems = [
      { text: "SYMBIOTIC.FI", y: -50, bold: true },
      { text: "Universal Staking", y: -25 },
      { text: "~$1.5B Peak TVL", y: 0 },
      { text: "50 Networks", y: 25 },
      { text: "Paradigm-Backed", y: 50 },
    ];
    rightItems.forEach(item => {
      svg.append("text").attr("x", cx2 + 60).attr("y", cy + item.y)
        .attr("text-anchor", "middle").attr("fill", item.bold ? T.magenta : T.text)
        .attr("font-size", item.bold ? 12 : 10).attr("font-family", font)
        .attr("font-weight", item.bold ? 700 : 400).text(item.text);
    });

    // Center collision zone
    const centerX = (cx1 + cx2) / 2;
    svg.append("text").attr("x", centerX).attr("y", cy - 35)
      .attr("text-anchor", "middle").attr("fill", T.amber)
      .attr("font-size", 9).attr("font-family", font).attr("font-weight", 600)
      .attr("letter-spacing", 3).text("TICKER COLLISION");
    svg.append("text").attr("x", centerX).attr("y", cy - 8)
      .attr("text-anchor", "middle").attr("fill", T.amber)
      .attr("font-size", 28).attr("font-family", font).attr("font-weight", 700)
      .attr("filter", "url(#glow)").text("SYM");
    svg.append("text").attr("x", centerX).attr("y", cy + 18)
      .attr("text-anchor", "middle").attr("fill", T.textMuted)
      .attr("font-size", 9).attr("font-family", font).text("Algo Confusion");
    svg.append("text").attr("x", centerX).attr("y", cy + 33)
      .attr("text-anchor", "middle").attr("fill", T.textMuted)
      .attr("font-size", 9).attr("font-family", font).text("Retail Misrouting");
    svg.append("text").attr("x", centerX).attr("y", cy + 48)
      .attr("text-anchor", "middle").attr("fill", T.textMuted)
      .attr("font-size", 9).attr("font-family", font).text("Volatility Premium");

    // Zone labels
    svg.append("text").attr("x", 55).attr("y", 25)
      .attr("fill", T.accent).attr("font-size", 9).attr("font-family", font)
      .attr("font-weight", 600).attr("letter-spacing", 2).text("PHYSICAL LAYER");
    svg.append("text").attr("x", w - 55).attr("y", 25)
      .attr("text-anchor", "end").attr("fill", T.magenta)
      .attr("font-size", 9).attr("font-family", font)
      .attr("font-weight", 600).attr("letter-spacing", 2).text("DIGITAL LAYER");

  }, []);

  return (
    <Card delay={0.1}>
      <SectionHeader number="01" title="The SYM Duality" subtitle="COLLISION MAP" />
      <svg ref={svgRef} style={{ width: "100%", height: "auto" }} />
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════
// CHART 2: BACKLOG vs MARKET CAP WATERFALL
// ═══════════════════════════════════════════════════════════════
const WaterfallChart = () => {
  const data = [
    { name: "Backlog", value: 22.3, fill: T.accent, label: "$22.3B" },
    { name: "Priced In\n(Market Cap)", value: 33.0, fill: T.amber, label: "$33.0B" },
    { name: "Gap\n(Premium)", value: 33.0 - 22.3, fill: T.red, label: "$10.7B" },
    { name: "DCF EV\n(Base)", value: 10.1, fill: T.green, label: "$10.1B" },
    { name: "DCF EV\n(Bull)", value: 16.5, fill: T.cyan, label: "$16.5B" },
  ];

  return (
    <Card delay={0.2}>
      <SectionHeader number="02" title="Backlog vs. Market Cap" subtitle="VALUE BRIDGE" />
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <Badge color={T.accent}>Contracted Backlog: $22.3B</Badge>
        <Badge color={T.amber}>Market Pricing: $33B</Badge>
        <Badge color={T.red}>Implied Premium: $10.7B</Badge>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barSize={52}>
          <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} vertical={false} />
          <XAxis
            dataKey="name" tick={{ fill: T.textMuted, fontSize: 10, fontFamily: font }}
            axisLine={{ stroke: T.border }} tickLine={false}
          />
          <YAxis
            tick={{ fill: T.textMuted, fontSize: 10, fontFamily: font }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `$${v}B`}
            domain={[0, 38]}
          />
          <ReferenceLine y={22.3} stroke={T.accent} strokeDasharray="6 4" strokeWidth={1} />
          <Tooltip
            contentStyle={{
              background: T.bgCard, border: `1px solid ${T.border}`,
              borderRadius: 4, fontFamily: font, fontSize: 11, color: T.text,
            }}
            formatter={(v) => [`$${v.toFixed(1)}B`, "Value"]}
          />
          <Bar dataKey="value" radius={[3, 3, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{
        fontFamily: font, fontSize: 10, color: T.textMuted, marginTop: 8,
        padding: "8px 12px", background: T.bg, borderRadius: 4,
        borderLeft: `2px solid ${T.red}`,
      }}>
        The market assigns $33B in value to a company with $10.1B in DCF-derived enterprise value.
        The $22.9B gap implies the market is pricing in near-perfect execution on the entire
        backlog plus significant option value on MFC rollout and international expansion.
      </div>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════
// CHART 3: VETOSLASHER FLOWCHART
// ═══════════════════════════════════════════════════════════════
const VetoSlasherFlow = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const w = 620, h = 400;
    svg.attr("viewBox", `0 0 ${w} ${h}`);

    // Grid background
    for (let x = 0; x <= w; x += 30) {
      svg.append("line").attr("x1", x).attr("y1", 0).attr("x2", x).attr("y2", h)
        .attr("stroke", T.gridLine).attr("stroke-width", 0.2);
    }
    for (let y = 0; y <= h; y += 30) {
      svg.append("line").attr("x1", 0).attr("y1", y).attr("x2", w).attr("y2", y)
        .attr("stroke", T.gridLine).attr("stroke-width", 0.2);
    }

    const defs = svg.append("defs");
    const glow = defs.append("filter").attr("id", "boxGlow");
    glow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
    glow.append("feMerge").selectAll("feMergeNode")
      .data(["blur", "SourceGraphic"]).enter()
      .append("feMergeNode").attr("in", d => d);

    // Arrow marker
    defs.append("marker").attr("id", "arrowhead").attr("viewBox", "0 0 10 6")
      .attr("refX", 10).attr("refY", 3).attr("markerWidth", 8).attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path").attr("d", "M0,0 L10,3 L0,6 Z").attr("fill", T.accent);
    defs.append("marker").attr("id", "arrowGreen").attr("viewBox", "0 0 10 6")
      .attr("refX", 10).attr("refY", 3).attr("markerWidth", 8).attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path").attr("d", "M0,0 L10,3 L0,6 Z").attr("fill", T.green);
    defs.append("marker").attr("id", "arrowRed").attr("viewBox", "0 0 10 6")
      .attr("refX", 10).attr("refY", 3).attr("markerWidth", 8).attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path").attr("d", "M0,0 L10,3 L0,6 Z").attr("fill", T.red);

    const nodes = [
      { id: "collateral", x: 60, y: 60, w: 120, h: 50, label: "COLLATERAL", sub: "ERC-20 Deposit", color: T.cyan },
      { id: "vault", x: 250, y: 60, w: 120, h: 50, label: "VAULT", sub: "Delegation Layer", color: T.accent },
      { id: "operator", x: 440, y: 60, w: 120, h: 50, label: "OPERATOR", sub: "Node Runner", color: T.magenta },
      { id: "network", x: 250, y: 170, w: 120, h: 50, label: "NETWORK", sub: "Security Consumer", color: T.amber },
      { id: "misconduct", x: 250, y: 270, w: 140, h: 44, label: "MISCONDUCT?", sub: "Slash Request", color: T.red },
      { id: "resolver", x: 100, y: 340, w: 120, h: 44, label: "RESOLVER", sub: "Veto Arbiter", color: T.green },
      { id: "slashed", x: 440, y: 310, w: 110, h: 36, label: "SLASHED", sub: "", color: T.red },
      { id: "vetoed", x: 100, y: 270, w: 90, h: 36, label: "VETOED", sub: "", color: T.green },
    ];

    // Draw connections
    const connections = [
      { from: "collateral", to: "vault", marker: "arrowhead" },
      { from: "vault", to: "operator", marker: "arrowhead" },
      { from: "operator", to: "network", marker: "arrowhead", path: "curve" },
      { from: "network", to: "misconduct", marker: "arrowRed" },
      { from: "misconduct", to: "resolver", marker: "arrowGreen", label: "VETO PERIOD" },
      { from: "misconduct", to: "slashed", marker: "arrowRed", label: "NO VETO" },
      { from: "resolver", to: "vetoed", marker: "arrowGreen", label: "FUNDS SAFE" },
    ];

    const getNode = id => nodes.find(n => n.id === id);

    connections.forEach(c => {
      const from = getNode(c.from);
      const to = getNode(c.to);
      let x1, y1, x2, y2;

      if (c.from === "operator" && c.to === "network") {
        x1 = from.x + from.w / 2; y1 = from.y + from.h;
        x2 = to.x + to.w / 2; y2 = to.y;
        svg.append("path")
          .attr("d", `M${x1},${y1} C${x1},${y1 + 40} ${x2},${y2 - 40} ${x2},${y2}`)
          .attr("fill", "none").attr("stroke", T.accent).attr("stroke-width", 1.2)
          .attr("stroke-dasharray", "4,3").attr("marker-end", `url(#${c.marker})`);
      } else if (c.from === "misconduct" && c.to === "resolver") {
        x1 = from.x; y1 = from.y + from.h / 2 + 10;
        x2 = to.x + to.w; y2 = to.y;
        svg.append("path")
          .attr("d", `M${x1},${y1} C${x1 - 30},${y1 + 30} ${x2 + 20},${y2 - 20} ${x2},${y2}`)
          .attr("fill", "none").attr("stroke", T.green).attr("stroke-width", 1.2)
          .attr("stroke-dasharray", "4,3").attr("marker-end", `url(#${c.marker})`);
        if (c.label) {
          svg.append("text").attr("x", x1 - 40).attr("y", y1 + 25)
            .attr("fill", T.green).attr("font-size", 8).attr("font-family", font)
            .attr("font-weight", 600).attr("letter-spacing", 1).text(c.label);
        }
      } else if (c.from === "misconduct" && c.to === "slashed") {
        x1 = from.x + from.w; y1 = from.y + from.h / 2;
        x2 = to.x; y2 = to.y + to.h / 2;
        svg.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2)
          .attr("stroke", T.red).attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "6,3").attr("marker-end", `url(#${c.marker})`);
        if (c.label) {
          svg.append("text").attr("x", (x1 + x2) / 2).attr("y", y1 - 8)
            .attr("text-anchor", "middle").attr("fill", T.red)
            .attr("font-size", 8).attr("font-family", font).attr("font-weight", 600)
            .attr("letter-spacing", 1).text(c.label);
        }
      } else if (c.from === "resolver" && c.to === "vetoed") {
        x1 = to.x + to.w / 2; y1 = from.y;
        x2 = to.x + to.w / 2; y2 = to.y + to.h;
        svg.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2)
          .attr("stroke", T.green).attr("stroke-width", 1.2).attr("marker-end", `url(#${c.marker})`);
        if (c.label) {
          svg.append("text").attr("x", x1 + 54).attr("y", (y1 + y2) / 2 + 3)
            .attr("fill", T.green).attr("font-size", 8).attr("font-family", font)
            .attr("font-weight", 600).attr("letter-spacing", 1).text(c.label);
        }
      } else {
        x1 = from.x + from.w; y1 = from.y + from.h / 2;
        x2 = to.x; y2 = to.y + to.h / 2;
        if (c.from === "network") {
          x1 = from.x + from.w / 2; y1 = from.y + from.h;
          x2 = to.x + to.w / 2; y2 = to.y;
        }
        svg.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2)
          .attr("stroke", c.marker === "arrowRed" ? T.red : T.accent).attr("stroke-width", 1.2)
          .attr("stroke-dasharray", "4,3").attr("marker-end", `url(#${c.marker})`);
      }
    });

    // Draw nodes
    nodes.forEach(n => {
      const g = svg.append("g");
      g.append("rect")
        .attr("x", n.x).attr("y", n.y).attr("width", n.w).attr("height", n.h)
        .attr("rx", 4).attr("fill", `${n.color}10`)
        .attr("stroke", n.color).attr("stroke-width", 1);
      g.append("text").attr("x", n.x + n.w / 2).attr("y", n.y + (n.sub ? n.h / 2 - 4 : n.h / 2 + 4))
        .attr("text-anchor", "middle").attr("fill", n.color)
        .attr("font-size", 10).attr("font-family", font).attr("font-weight", 700)
        .attr("letter-spacing", 1.5).text(n.label);
      if (n.sub) {
        g.append("text").attr("x", n.x + n.w / 2).attr("y", n.y + n.h / 2 + 12)
          .attr("text-anchor", "middle").attr("fill", T.textMuted)
          .attr("font-size", 8).attr("font-family", font).text(n.sub);
      }
    });

    // Trust premium annotation
    svg.append("rect").attr("x", 350).attr("y", 348).attr("width", 230).attr("height", 44)
      .attr("rx", 4).attr("fill", T.greenMuted).attr("stroke", T.green).attr("stroke-width", 0.5);
    svg.append("text").attr("x", 365).attr("y", 364)
      .attr("fill", T.green).attr("font-size", 9).attr("font-family", font).attr("font-weight", 600)
      .text("TRUST PREMIUM");
    svg.append("text").attr("x", 365).attr("y", 381)
      .attr("fill", T.textMuted).attr("font-size", 8).attr("font-family", font)
      .text("Veto window = institutional comfort");

  }, []);

  return (
    <Card delay={0.3}>
      <SectionHeader number="03" title="VetoSlasher Mechanism" subtitle="SYMBIOTIC PROTOCOL" />
      <svg ref={svgRef} style={{ width: "100%", height: "auto" }} />
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════
// CHART 4: TICKER CONFUSION CATALYST TIMELINE
// ═══════════════════════════════════════════════════════════════
const CatalystTimeline = () => {
  const events = [
    { month: "Q1", date: "Jan\u2013Mar", label: "Symbiotic Core Mainnet\nExpansion to 50+ Networks", impact: "MEDIUM", color: T.magenta, vol: "+8\u201312%", side: "crypto" },
    { month: "Q1", date: "Feb 4", label: "Symbotic Q1 FY2026\nEarnings Release", impact: "HIGH", color: T.accent, vol: "\u00B15\u201310%", side: "equity" },
    { month: "Q2", date: "Apr\u2013Jun", label: "Symbiotic Token\nGeneration Event (TGE)", impact: "CRITICAL", color: T.red, vol: "+15\u201325%", side: "crypto" },
    { month: "Q2", date: "May 12", label: "Symbotic Q2 FY2026\nEarnings + MFC Update", impact: "HIGH", color: T.accent, vol: "\u00B18\u201315%", side: "equity" },
    { month: "Q3", date: "Jul\u2013Sep", label: "Walmart MFC Prototype\nInstallation Begins", impact: "HIGH", color: T.green, vol: "+10\u201320%", side: "equity" },
    { month: "Q3", date: "Aug", label: "Symbiotic Airdrop\nDistribution", impact: "CRITICAL", color: T.red, vol: "+12\u201318%", side: "crypto" },
    { month: "Q4", date: "Oct\u2013Dec", label: "GreenBox First\n3rd-Party Customer", impact: "MEDIUM", color: T.amber, vol: "+5\u201310%", side: "equity" },
    { month: "Q4", date: "Nov", label: "Symbotic FY2026\nAnnual Results", impact: "HIGH", color: T.accent, vol: "\u00B110\u201315%", side: "equity" },
  ];

  return (
    <Card delay={0.4}>
      <SectionHeader number="04" title="2026 Catalyst Timeline" subtitle="VOLATILITY MAP" />
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <Badge color={T.accent}>Equity Catalyst</Badge>
        <Badge color={T.magenta}>Crypto Catalyst</Badge>
        <Badge color={T.red}>Collision Risk: CRITICAL</Badge>
      </div>
      <div style={{ position: "relative", padding: "0 0 0 40px" }}>
        {/* Vertical timeline line */}
        <div style={{
          position: "absolute", left: 16, top: 0, bottom: 0, width: 2,
          background: `linear-gradient(180deg, ${T.accent}, ${T.magenta})`,
          borderRadius: 1,
        }} />
        {events.map((e, i) => (
          <div key={i} style={{
            display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start",
            animation: `fadeSlideUp 0.4s ease ${0.5 + i * 0.08}s both`,
          }}>
            {/* Timeline dot */}
            <div style={{
              position: "absolute", left: 9, marginTop: 8,
              width: 16, height: 16, borderRadius: "50%",
              background: e.impact === "CRITICAL" ? T.red : e.side === "crypto" ? T.magenta : T.accent,
              border: `2px solid ${T.bg}`,
              boxShadow: e.impact === "CRITICAL" ? `0 0 12px ${T.red}60` : "none",
              animation: e.impact === "CRITICAL" ? "blink 2s infinite" : "none",
            }} />
            <div style={{
              flex: 1, background: `${e.color}08`, border: `1px solid ${e.color}25`,
              borderRadius: 4, padding: "10px 14px",
              borderLeft: `3px solid ${e.color}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontFamily: font, fontSize: 9, color: e.color, fontWeight: 700, letterSpacing: 2 }}>
                  {e.month} \u2014 {e.date}
                </span>
                <span style={{
                  fontFamily: font, fontSize: 8, padding: "1px 6px", borderRadius: 2,
                  background: e.impact === "CRITICAL" ? T.redMuted : e.impact === "HIGH" ? T.amberMuted : T.cyanMuted,
                  color: e.impact === "CRITICAL" ? T.red : e.impact === "HIGH" ? T.amber : T.cyan,
                  fontWeight: 600, letterSpacing: 1,
                }}>{e.impact}</span>
              </div>
              <div style={{ fontFamily: fontSans, fontSize: 12, color: T.textBright, whiteSpace: "pre-line", lineHeight: 1.4 }}>
                {e.label}
              </div>
              <div style={{ fontFamily: font, fontSize: 10, color: T.textMuted, marginTop: 4 }}>
                Est. SYM Vol: <span style={{ color: e.color, fontWeight: 600 }}>{e.vol}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════
// CHART 5: VALUATION SENSITIVITY HEATMAP
// ═══════════════════════════════════════════════════════════════
const SensitivityHeatmap = () => {
  const waccValues = [9.5, 10.0, 10.5, 11.0, 11.5];
  const tgrValues = [2.0, 2.5, 3.0, 3.5, 4.0];
  const data = [
    [22, 20, 18, 17, 15],
    [24, 22, 20, 18, 16],
    [27, 24, 20, 19, 17],
    [30, 27, 24, 21, 19],
    [35, 31, 27, 24, 21],
  ];

  const currentPrice = 55;
  const getColor = (val) => {
    const ratio = val / currentPrice;
    if (ratio >= 0.6) return { bg: T.greenMuted, text: T.green, border: `${T.green}40` };
    if (ratio >= 0.45) return { bg: T.amberMuted, text: T.amber, border: `${T.amber}40` };
    return { bg: T.redMuted, text: T.red, border: `${T.red}40` };
  };

  const getIntensity = (val) => {
    const pct = (val - 15) / (35 - 15);
    return Math.round(pct * 100);
  };

  return (
    <Card delay={0.5}>
      <SectionHeader number="05" title="DCF Sensitivity Heatmap" subtitle="INTRINSIC VALUE / SHARE" />
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <Badge color={T.green} bg={T.greenMuted}>&gt;60% of Price = Closer</Badge>
        <Badge color={T.amber} bg={T.amberMuted}>45\u201360% = Deep Discount</Badge>
        <Badge color={T.red} bg={T.redMuted}>&lt;45% = Extreme Overval.</Badge>
        <span style={{ fontFamily: font, fontSize: 10, color: T.textMuted, marginLeft: "auto" }}>
          Current: <span style={{ color: T.textBright }}>$55.81</span>
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%", borderCollapse: "collapse", fontFamily: font,
          minWidth: 500,
        }}>
          <thead>
            <tr>
              <th style={{
                padding: "8px 12px", textAlign: "left", fontSize: 9, color: T.textMuted,
                borderBottom: `1px solid ${T.border}`, fontWeight: 600, letterSpacing: 1,
              }}>WACC →<br/>TGR ↓</th>
              {waccValues.map(w => (
                <th key={w} style={{
                  padding: "8px 12px", textAlign: "center", fontSize: 11, fontWeight: 700,
                  color: w === 10.5 ? T.accent : T.text,
                  borderBottom: `1px solid ${T.border}`,
                  background: w === 10.5 ? T.accentGlow : "transparent",
                }}>{w}%</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tgrValues.map((tgr, ri) => (
              <tr key={tgr}>
                <td style={{
                  padding: "8px 12px", fontSize: 11, fontWeight: 700,
                  color: tgr === 3.0 ? T.accent : T.text,
                  borderBottom: `1px solid ${T.border}08`,
                  background: tgr === 3.0 ? T.accentGlow : "transparent",
                }}>
                  {tgr}%{tgr === 3.0 ? " ★" : ""}
                </td>
                {data[ri].map((val, ci) => {
                  const c = getColor(val);
                  const isBase = ri === 2 && ci === 2;
                  return (
                    <td key={ci} style={{
                      padding: "10px 12px", textAlign: "center", fontSize: 16, fontWeight: 700,
                      color: c.text, background: c.bg,
                      borderBottom: `1px solid ${T.border}08`,
                      border: isBase ? `2px solid ${T.accent}` : `1px solid ${c.border}`,
                      borderRadius: isBase ? 4 : 0,
                      position: "relative",
                    }}>
                      ${val}
                      {isBase && (
                        <div style={{
                          position: "absolute", top: -1, right: -1,
                          fontSize: 7, color: T.bg, background: T.accent,
                          padding: "1px 4px", borderRadius: "0 3px 0 3px",
                          fontWeight: 700, letterSpacing: 1,
                        }}>BASE</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: 16, padding: "10px 14px", background: T.bg, borderRadius: 4,
        borderLeft: `2px solid ${T.amber}`, fontFamily: font, fontSize: 10,
        color: T.textMuted, lineHeight: 1.6,
      }}>
        <span style={{ color: T.amber, fontWeight: 700 }}>KEY INSIGHT:</span> Even at the most bullish
        parameters (9.5% WACC / 4.0% TGR), intrinsic value reaches only $35 — a 37% discount
        to market. The base case ($20) implies ~64% overvaluation relative to normalised DCF.
        The market is pricing option value on MFC rollout + international scaling + GreenBox traction.
      </div>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
export default function SymboticDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: "ALL", icon: "◉" },
    { label: "VENN", icon: "⊕" },
    { label: "WATERFALL", icon: "▮" },
    { label: "FLOW", icon: "⇶" },
    { label: "TIMELINE", icon: "⏱" },
    { label: "HEATMAP", icon: "▦" },
  ];

  const charts = [
    <VennDiagram key="v" />,
    <WaterfallChart key="w" />,
    <VetoSlasherFlow key="f" />,
    <CatalystTimeline key="t" />,
    <SensitivityHeatmap key="h" />,
  ];

  return (
    <div style={{
      minHeight: "100vh", background: T.bg, color: T.text, fontFamily: font,
      position: "relative",
    }}>
      <GlobalStyle />

      {/* Scanline effect */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
        zIndex: 999, opacity: 0.015,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
      }} />

      {/* Header */}
      <div style={{
        background: "#060a12", borderBottom: `1px solid ${T.border}`,
        padding: "16px 24px", display: "flex", justifyContent: "space-between",
        alignItems: "center", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 4, background: T.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: font, fontSize: 14, fontWeight: 800, color: "#fff",
          }}>S</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.textBright, letterSpacing: 1 }}>
              SYMBOTIC INTELLIGENCE TERMINAL
            </div>
            <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: 2, marginTop: 2 }}>
              SOLO STRATEGIST • DUAL-HORIZON RESEARCH • FEB 17 2026
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: T.green, animation: "blink 2s infinite" }}>●</span>
          <span style={{ fontSize: 9, color: T.textMuted, letterSpacing: 1 }}>LIVE DATA</span>
        </div>
      </div>

      <Ticker />

      {/* Tab Navigation */}
      <div style={{
        display: "flex", gap: 0, padding: "0 24px",
        background: "#060a12", borderBottom: `1px solid ${T.border}`,
        overflowX: "auto",
      }}>
        {tabs.map((tab, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            padding: "10px 18px", border: "none", cursor: "pointer",
            background: activeTab === i ? T.bgCard : "transparent",
            color: activeTab === i ? T.accent : T.textMuted,
            fontFamily: font, fontSize: 10, fontWeight: 600, letterSpacing: 1.5,
            borderBottom: activeTab === i ? `2px solid ${T.accent}` : "2px solid transparent",
            transition: "all 0.2s ease", whiteSpace: "nowrap",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 12 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div style={{ padding: 24, maxWidth: 780, margin: "0 auto" }}>
        {activeTab === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {charts.map(c => c)}
          </div>
        ) : (
          charts[activeTab - 1]
        )}

        {/* Footer */}
        <div style={{
          marginTop: 32, padding: "16px 0", borderTop: `1px solid ${T.border}`,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 8, color: T.textMuted, letterSpacing: 2, lineHeight: 1.8 }}>
            SOLO STRATEGIST RESEARCH TERMINAL • DATA AS OF FEB 17 2026<br />
            SOURCES: SEC 10-K/10-Q FILINGS • DEFILLAMA • CHAINWIRE • COMPANY PRESS RELEASES<br />
            NOT INVESTMENT ADVICE • FOR INFORMATIONAL PURPOSES ONLY
          </div>
        </div>
      </div>
    </div>
  );
}
