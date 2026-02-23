"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// ─── DESIGN TOKENS (aligned with site dark theme) ────────────────
const T = {
  bg: "#0a0e17",
  bgCard: "#0f1520",
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
  gridLine: "#1a2235",
};

const font = `'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace`;
const fontSans = `'DM Sans', 'Segoe UI', system-ui, sans-serif`;

// ─── SMALL COMPONENTS ──────────────────────────────────────────
function Badge({
  children,
  color = T.accent,
  bg,
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 3,
        fontSize: 10,
        fontFamily: font,
        fontWeight: 600,
        letterSpacing: 1,
        color,
        background: bg || `${color}18`,
        textTransform: "uppercase",
        border: `1px solid ${color}30`,
      }}
    >
      {children}
    </span>
  );
}

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        marginBottom: 20,
        borderBottom: `1px solid ${T.border}`,
        paddingBottom: 12,
      }}
    >
      <span
        style={{
          fontFamily: font,
          fontSize: 11,
          color: T.accent,
          fontWeight: 700,
          letterSpacing: 2,
          opacity: 0.7,
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontFamily: fontSans,
          fontSize: 20,
          fontWeight: 700,
          color: T.textBright,
          letterSpacing: -0.5,
        }}
      >
        {title}
      </span>
      {subtitle && (
        <span
          style={{
            fontFamily: font,
            fontSize: 11,
            color: T.textMuted,
            marginLeft: "auto",
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}

function Card({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 6,
        padding: 28,
        position: "relative",
        overflow: "hidden",
        animation: `fadeSlideUp 0.6s ease ${delay}s both`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${T.accent}40, transparent)`,
        }}
      />
      {children}
    </div>
  );
}

function Ticker() {
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
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        background: "#060a12",
        borderBottom: `1px solid ${T.border}`,
        padding: "6px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 36,
          whiteSpace: "nowrap",
          animation: "tickerScroll 30s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((t, i) => (
          <span
            key={i}
            style={{
              fontFamily: font,
              fontSize: 11,
              display: "inline-flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <span style={{ color: T.accent, fontWeight: 700 }}>{t.sym}</span>
            <span style={{ color: T.textBright }}>{t.val}</span>
            <span style={{ color: t.up ? T.green : T.red, fontSize: 10 }}>
              {t.chg}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHART 1: SYM DUALITY VENN DIAGRAM (static SVG)
// ═══════════════════════════════════════════════════════════════
function VennDiagram() {
  const w = 620,
    h = 360;
  const cx1 = 230,
    cx2 = 390,
    cy = 180,
    r = 140;
  const centerX = (cx1 + cx2) / 2;

  const leftItems = [
    { text: "NASDAQ: SYM", y: -50, bold: true },
    { text: "AI-Powered Robotics", y: -25 },
    { text: "$22.3B Backlog", y: 0 },
    { text: "$2.25B Revenue", y: 25 },
    { text: "Walmart Anchor", y: 50 },
  ];

  const rightItems = [
    { text: "SYMBIOTIC.FI", y: -50, bold: true },
    { text: "Universal Staking", y: -25 },
    { text: "~$1.5B Peak TVL", y: 0 },
    { text: "50 Networks", y: 25 },
    { text: "Paradigm-Backed", y: 50 },
  ];

  return (
    <Card delay={0.1}>
      <SectionHeader number="01" title="The SYM Duality" subtitle="COLLISION MAP" />
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="leftGrad">
            <stop offset="0%" stopColor={T.accent} stopOpacity={0.25} />
            <stop offset="100%" stopColor={T.accent} stopOpacity={0.03} />
          </radialGradient>
          <radialGradient id="rightGrad">
            <stop offset="0%" stopColor={T.magenta} stopOpacity={0.25} />
            <stop offset="100%" stopColor={T.magenta} stopOpacity={0.03} />
          </radialGradient>
        </defs>

        {/* Grid */}
        {Array.from({ length: Math.floor(w / 40) + 1 }, (_, i) => i * 40).map(
          (x) => (
            <line
              key={`vx${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={h}
              stroke={T.gridLine}
              strokeWidth={0.3}
            />
          )
        )}
        {Array.from({ length: Math.floor(h / 40) + 1 }, (_, i) => i * 40).map(
          (y) => (
            <line
              key={`vy${y}`}
              x1={0}
              y1={y}
              x2={w}
              y2={y}
              stroke={T.gridLine}
              strokeWidth={0.3}
            />
          )
        )}

        {/* Left circle */}
        <circle
          cx={cx1}
          cy={cy}
          r={r}
          fill="url(#leftGrad)"
          stroke={T.accent}
          strokeWidth={1.5}
          strokeDasharray="4,3"
          opacity={0.9}
        />
        {/* Right circle */}
        <circle
          cx={cx2}
          cy={cy}
          r={r}
          fill="url(#rightGrad)"
          stroke={T.magenta}
          strokeWidth={1.5}
          strokeDasharray="4,3"
          opacity={0.9}
        />
        {/* Overlap */}
        <ellipse
          cx={centerX}
          cy={cy}
          rx={55}
          ry={90}
          fill="rgba(255,192,72,0.08)"
          stroke={T.amber}
          strokeWidth={1}
          strokeDasharray="2,4"
          filter="url(#glow)"
        />

        {/* Left labels */}
        {leftItems.map((item) => (
          <text
            key={item.text}
            x={cx1 - 60}
            y={cy + item.y}
            textAnchor="middle"
            fill={item.bold ? T.accent : T.text}
            fontSize={item.bold ? 12 : 10}
            fontFamily={font}
            fontWeight={item.bold ? 700 : 400}
          >
            {item.text}
          </text>
        ))}

        {/* Right labels */}
        {rightItems.map((item) => (
          <text
            key={item.text}
            x={cx2 + 60}
            y={cy + item.y}
            textAnchor="middle"
            fill={item.bold ? T.magenta : T.text}
            fontSize={item.bold ? 12 : 10}
            fontFamily={font}
            fontWeight={item.bold ? 700 : 400}
          >
            {item.text}
          </text>
        ))}

        {/* Center collision zone */}
        <text
          x={centerX}
          y={cy - 35}
          textAnchor="middle"
          fill={T.amber}
          fontSize={9}
          fontFamily={font}
          fontWeight={600}
          letterSpacing={3}
        >
          TICKER COLLISION
        </text>
        <text
          x={centerX}
          y={cy - 8}
          textAnchor="middle"
          fill={T.amber}
          fontSize={28}
          fontFamily={font}
          fontWeight={700}
          filter="url(#glow)"
        >
          SYM
        </text>
        <text
          x={centerX}
          y={cy + 18}
          textAnchor="middle"
          fill={T.textMuted}
          fontSize={9}
          fontFamily={font}
        >
          Algo Confusion
        </text>
        <text
          x={centerX}
          y={cy + 33}
          textAnchor="middle"
          fill={T.textMuted}
          fontSize={9}
          fontFamily={font}
        >
          Retail Misrouting
        </text>
        <text
          x={centerX}
          y={cy + 48}
          textAnchor="middle"
          fill={T.textMuted}
          fontSize={9}
          fontFamily={font}
        >
          Volatility Premium
        </text>

        {/* Zone labels */}
        <text
          x={55}
          y={25}
          fill={T.accent}
          fontSize={9}
          fontFamily={font}
          fontWeight={600}
          letterSpacing={2}
        >
          PHYSICAL LAYER
        </text>
        <text
          x={w - 55}
          y={25}
          textAnchor="end"
          fill={T.magenta}
          fontSize={9}
          fontFamily={font}
          fontWeight={600}
          letterSpacing={2}
        >
          DIGITAL LAYER
        </text>
      </svg>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHART 2: BACKLOG vs MARKET CAP WATERFALL
// ═══════════════════════════════════════════════════════════════
function WaterfallChart() {
  const data = [
    { name: "Backlog", value: 22.3, fill: T.accent, label: "$22.3B" },
    {
      name: "Priced In\n(Market Cap)",
      value: 33.0,
      fill: T.amber,
      label: "$33.0B",
    },
    {
      name: "Gap\n(Premium)",
      value: 33.0 - 22.3,
      fill: T.red,
      label: "$10.7B",
    },
    {
      name: "DCF EV\n(Base)",
      value: 10.1,
      fill: T.green,
      label: "$10.1B",
    },
    {
      name: "DCF EV\n(Bull)",
      value: 16.5,
      fill: T.cyan,
      label: "$16.5B",
    },
  ];

  return (
    <Card delay={0.2}>
      <SectionHeader
        number="02"
        title="Backlog vs. Market Cap"
        subtitle="VALUE BRIDGE"
      />
      <div
        style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}
      >
        <Badge color={T.accent}>Contracted Backlog: $22.3B</Badge>
        <Badge color={T.amber}>Market Pricing: $33B</Badge>
        <Badge color={T.red}>Implied Premium: $10.7B</Badge>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barSize={52}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={T.gridLine}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{
              fill: T.textMuted,
              fontSize: 10,
              fontFamily: font,
            }}
            axisLine={{ stroke: T.border }}
            tickLine={false}
          />
          <YAxis
            tick={{
              fill: T.textMuted,
              fontSize: 10,
              fontFamily: font,
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}B`}
            domain={[0, 38]}
          />
          <ReferenceLine
            y={22.3}
            stroke={T.accent}
            strokeDasharray="6 4"
            strokeWidth={1}
          />
          <Tooltip
            contentStyle={{
              background: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: 4,
              fontFamily: font,
              fontSize: 11,
              color: T.text,
            }}
            formatter={(v: number) => [`$${v.toFixed(1)}B`, "Value"]}
          />
          <Bar dataKey="value" radius={[3, 3, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div
        style={{
          fontFamily: font,
          fontSize: 10,
          color: T.textMuted,
          marginTop: 8,
          padding: "8px 12px",
          background: T.bg,
          borderRadius: 4,
          borderLeft: `2px solid ${T.red}`,
        }}
      >
        The market assigns $33B in value to a company with $10.1B in
        DCF-derived enterprise value. The $22.9B gap implies the market is
        pricing in near-perfect execution on the entire backlog plus significant
        option value on MFC rollout and international expansion.
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHART 3: VETOSLASHER FLOWCHART (static SVG)
// ═══════════════════════════════════════════════════════════════
function VetoSlasherFlow() {
  const w = 620,
    h = 400;

  return (
    <Card delay={0.3}>
      <SectionHeader
        number="03"
        title="VetoSlasher Mechanism"
        subtitle="SYMBIOTIC PROTOCOL"
      />
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }}>
        <defs>
          <filter id="boxGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker
            id="arrowhead"
            viewBox="0 0 10 6"
            refX={10}
            refY={3}
            markerWidth={8}
            markerHeight={6}
            orient="auto"
          >
            <path d="M0,0 L10,3 L0,6 Z" fill={T.accent} />
          </marker>
          <marker
            id="arrowGreen"
            viewBox="0 0 10 6"
            refX={10}
            refY={3}
            markerWidth={8}
            markerHeight={6}
            orient="auto"
          >
            <path d="M0,0 L10,3 L0,6 Z" fill={T.green} />
          </marker>
          <marker
            id="arrowRed"
            viewBox="0 0 10 6"
            refX={10}
            refY={3}
            markerWidth={8}
            markerHeight={6}
            orient="auto"
          >
            <path d="M0,0 L10,3 L0,6 Z" fill={T.red} />
          </marker>
        </defs>

        {/* Grid */}
        {Array.from({ length: Math.floor(w / 30) + 1 }, (_, i) => i * 30).map(
          (x) => (
            <line
              key={`fx${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={h}
              stroke={T.gridLine}
              strokeWidth={0.2}
            />
          )
        )}
        {Array.from({ length: Math.floor(h / 30) + 1 }, (_, i) => i * 30).map(
          (y) => (
            <line
              key={`fy${y}`}
              x1={0}
              y1={y}
              x2={w}
              y2={y}
              stroke={T.gridLine}
              strokeWidth={0.2}
            />
          )
        )}

        {/* Connections */}
        {/* collateral -> vault */}
        <line x1={180} y1={85} x2={250} y2={85} stroke={T.accent} strokeWidth={1.2} strokeDasharray="4,3" markerEnd="url(#arrowhead)" />
        {/* vault -> operator */}
        <line x1={370} y1={85} x2={440} y2={85} stroke={T.accent} strokeWidth={1.2} strokeDasharray="4,3" markerEnd="url(#arrowhead)" />
        {/* operator -> network */}
        <path d="M500,110 C500,150 310,130 310,170" fill="none" stroke={T.accent} strokeWidth={1.2} strokeDasharray="4,3" markerEnd="url(#arrowhead)" />
        {/* network -> misconduct */}
        <line x1={310} y1={220} x2={320} y2={270} stroke={T.red} strokeWidth={1.2} strokeDasharray="4,3" markerEnd="url(#arrowRed)" />
        {/* misconduct -> resolver */}
        <path d="M250,282 C220,312 230,320 220,340" fill="none" stroke={T.green} strokeWidth={1.2} strokeDasharray="4,3" markerEnd="url(#arrowGreen)" />
        <text x={175} y={318} fill={T.green} fontSize={8} fontFamily={font} fontWeight={600} letterSpacing={1}>VETO PERIOD</text>
        {/* misconduct -> slashed */}
        <line x1={390} y1={292} x2={440} y2={328} stroke={T.red} strokeWidth={1.5} strokeDasharray="6,3" markerEnd="url(#arrowRed)" />
        <text x={400} y={280} textAnchor="middle" fill={T.red} fontSize={8} fontFamily={font} fontWeight={600} letterSpacing={1}>NO VETO</text>
        {/* resolver -> vetoed */}
        <line x1={145} y1={340} x2={145} y2={306} stroke={T.green} strokeWidth={1.2} markerEnd="url(#arrowGreen)" />
        <text x={192} y={325} fill={T.green} fontSize={8} fontFamily={font} fontWeight={600} letterSpacing={1}>FUNDS SAFE</text>

        {/* Nodes */}
        {/* COLLATERAL */}
        <rect x={60} y={60} width={120} height={50} rx={4} fill={`${T.cyan}10`} stroke={T.cyan} strokeWidth={1} />
        <text x={120} y={82} textAnchor="middle" fill={T.cyan} fontSize={10} fontFamily={font} fontWeight={700} letterSpacing={1.5}>COLLATERAL</text>
        <text x={120} y={97} textAnchor="middle" fill={T.textMuted} fontSize={8} fontFamily={font}>ERC-20 Deposit</text>

        {/* VAULT */}
        <rect x={250} y={60} width={120} height={50} rx={4} fill={`${T.accent}10`} stroke={T.accent} strokeWidth={1} />
        <text x={310} y={82} textAnchor="middle" fill={T.accent} fontSize={10} fontFamily={font} fontWeight={700} letterSpacing={1.5}>VAULT</text>
        <text x={310} y={97} textAnchor="middle" fill={T.textMuted} fontSize={8} fontFamily={font}>Delegation Layer</text>

        {/* OPERATOR */}
        <rect x={440} y={60} width={120} height={50} rx={4} fill={`${T.magenta}10`} stroke={T.magenta} strokeWidth={1} />
        <text x={500} y={82} textAnchor="middle" fill={T.magenta} fontSize={10} fontFamily={font} fontWeight={700} letterSpacing={1.5}>OPERATOR</text>
        <text x={500} y={97} textAnchor="middle" fill={T.textMuted} fontSize={8} fontFamily={font}>Node Runner</text>

        {/* NETWORK */}
        <rect x={250} y={170} width={120} height={50} rx={4} fill={`${T.amber}10`} stroke={T.amber} strokeWidth={1} />
        <text x={310} y={192} textAnchor="middle" fill={T.amber} fontSize={10} fontFamily={font} fontWeight={700} letterSpacing={1.5}>NETWORK</text>
        <text x={310} y={207} textAnchor="middle" fill={T.textMuted} fontSize={8} fontFamily={font}>Security Consumer</text>

        {/* MISCONDUCT? */}
        <rect x={250} y={270} width={140} height={44} rx={4} fill={`${T.red}10`} stroke={T.red} strokeWidth={1} />
        <text x={320} y={290} textAnchor="middle" fill={T.red} fontSize={10} fontFamily={font} fontWeight={700} letterSpacing={1.5}>MISCONDUCT?</text>
        <text x={320} y={305} textAnchor="middle" fill={T.textMuted} fontSize={8} fontFamily={font}>Slash Request</text>

        {/* RESOLVER */}
        <rect x={100} y={340} width={120} height={44} rx={4} fill={`${T.green}10`} stroke={T.green} strokeWidth={1} />
        <text x={160} y={358} textAnchor="middle" fill={T.green} fontSize={10} fontFamily={font} fontWeight={700} letterSpacing={1.5}>RESOLVER</text>
        <text x={160} y={374} textAnchor="middle" fill={T.textMuted} fontSize={8} fontFamily={font}>Veto Arbiter</text>

        {/* SLASHED */}
        <rect x={440} y={310} width={110} height={36} rx={4} fill={`${T.red}10`} stroke={T.red} strokeWidth={1} />
        <text x={495} y={333} textAnchor="middle" fill={T.red} fontSize={10} fontFamily={font} fontWeight={700} letterSpacing={1.5}>SLASHED</text>

        {/* VETOED */}
        <rect x={100} y={270} width={90} height={36} rx={4} fill={`${T.green}10`} stroke={T.green} strokeWidth={1} />
        <text x={145} y={293} textAnchor="middle" fill={T.green} fontSize={10} fontFamily={font} fontWeight={700} letterSpacing={1.5}>VETOED</text>

        {/* Trust premium */}
        <rect x={350} y={348} width={230} height={44} rx={4} fill={T.greenMuted} stroke={T.green} strokeWidth={0.5} />
        <text x={365} y={364} fill={T.green} fontSize={9} fontFamily={font} fontWeight={600}>TRUST PREMIUM</text>
        <text x={365} y={381} fill={T.textMuted} fontSize={8} fontFamily={font}>Veto window = institutional comfort</text>
      </svg>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHART 4: TICKER CONFUSION CATALYST TIMELINE
// ═══════════════════════════════════════════════════════════════
function CatalystTimeline() {
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
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 0,
            bottom: 0,
            width: 2,
            background: `linear-gradient(180deg, ${T.accent}, ${T.magenta})`,
            borderRadius: 1,
          }}
        />
        {events.map((e, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 14,
              marginBottom: 14,
              alignItems: "flex-start",
              animation: `fadeSlideUp 0.4s ease ${0.5 + i * 0.08}s both`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 9,
                marginTop: 8,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background:
                  e.impact === "CRITICAL"
                    ? T.red
                    : e.side === "crypto"
                      ? T.magenta
                      : T.accent,
                border: `2px solid ${T.bg}`,
                boxShadow:
                  e.impact === "CRITICAL"
                    ? `0 0 12px ${T.red}60`
                    : "none",
                animation:
                  e.impact === "CRITICAL" ? "blink 2s infinite" : "none",
              }}
            />
            <div
              style={{
                flex: 1,
                background: `${e.color}08`,
                border: `1px solid ${e.color}25`,
                borderRadius: 4,
                padding: "10px 14px",
                borderLeft: `3px solid ${e.color}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: font,
                    fontSize: 9,
                    color: e.color,
                    fontWeight: 700,
                    letterSpacing: 2,
                  }}
                >
                  {e.month} &mdash; {e.date}
                </span>
                <span
                  style={{
                    fontFamily: font,
                    fontSize: 8,
                    padding: "1px 6px",
                    borderRadius: 2,
                    background:
                      e.impact === "CRITICAL"
                        ? T.redMuted
                        : e.impact === "HIGH"
                          ? T.amberMuted
                          : T.cyanMuted,
                    color:
                      e.impact === "CRITICAL"
                        ? T.red
                        : e.impact === "HIGH"
                          ? T.amber
                          : T.cyan,
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}
                >
                  {e.impact}
                </span>
              </div>
              <div
                style={{
                  fontFamily: fontSans,
                  fontSize: 12,
                  color: T.textBright,
                  whiteSpace: "pre-line",
                  lineHeight: 1.4,
                }}
              >
                {e.label}
              </div>
              <div
                style={{
                  fontFamily: font,
                  fontSize: 10,
                  color: T.textMuted,
                  marginTop: 4,
                }}
              >
                Est. SYM Vol:{" "}
                <span style={{ color: e.color, fontWeight: 600 }}>
                  {e.vol}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHART 5: VALUATION SENSITIVITY HEATMAP
// ═══════════════════════════════════════════════════════════════
function SensitivityHeatmap() {
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
  const getColor = (val: number) => {
    const ratio = val / currentPrice;
    if (ratio >= 0.6)
      return { bg: T.greenMuted, text: T.green, border: `${T.green}40` };
    if (ratio >= 0.45)
      return { bg: T.amberMuted, text: T.amber, border: `${T.amber}40` };
    return { bg: T.redMuted, text: T.red, border: `${T.red}40` };
  };

  return (
    <Card delay={0.5}>
      <SectionHeader
        number="05"
        title="DCF Sensitivity Heatmap"
        subtitle="INTRINSIC VALUE / SHARE"
      />
      <div
        style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}
      >
        <Badge color={T.green} bg={T.greenMuted}>
          &gt;60% of Price = Closer
        </Badge>
        <Badge color={T.amber} bg={T.amberMuted}>
          45&ndash;60% = Deep Discount
        </Badge>
        <Badge color={T.red} bg={T.redMuted}>
          &lt;45% = Extreme Overval.
        </Badge>
        <span
          style={{
            fontFamily: font,
            fontSize: 10,
            color: T.textMuted,
            marginLeft: "auto",
          }}
        >
          Current: <span style={{ color: T.textBright }}>$55.81</span>
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: font,
            minWidth: 500,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "8px 12px",
                  textAlign: "left",
                  fontSize: 9,
                  color: T.textMuted,
                  borderBottom: `1px solid ${T.border}`,
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                WACC &rarr;
                <br />
                TGR &darr;
              </th>
              {waccValues.map((w) => (
                <th
                  key={w}
                  style={{
                    padding: "8px 12px",
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: w === 10.5 ? T.accent : T.text,
                    borderBottom: `1px solid ${T.border}`,
                    background: w === 10.5 ? T.accentGlow : "transparent",
                  }}
                >
                  {w}%
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tgrValues.map((tgr, ri) => (
              <tr key={tgr}>
                <td
                  style={{
                    padding: "8px 12px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: tgr === 3.0 ? T.accent : T.text,
                    borderBottom: `1px solid ${T.border}08`,
                    background: tgr === 3.0 ? T.accentGlow : "transparent",
                  }}
                >
                  {tgr}%{tgr === 3.0 ? " \u2605" : ""}
                </td>
                {data[ri].map((val, ci) => {
                  const c = getColor(val);
                  const isBase = ri === 2 && ci === 2;
                  return (
                    <td
                      key={ci}
                      style={{
                        padding: "10px 12px",
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight: 700,
                        color: c.text,
                        background: c.bg,
                        borderBottom: `1px solid ${T.border}08`,
                        border: isBase
                          ? `2px solid ${T.accent}`
                          : `1px solid ${c.border}`,
                        borderRadius: isBase ? 4 : 0,
                        position: "relative",
                      }}
                    >
                      ${val}
                      {isBase && (
                        <div
                          style={{
                            position: "absolute",
                            top: -1,
                            right: -1,
                            fontSize: 7,
                            color: T.bg,
                            background: T.accent,
                            padding: "1px 4px",
                            borderRadius: "0 3px 0 3px",
                            fontWeight: 700,
                            letterSpacing: 1,
                          }}
                        >
                          BASE
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: "10px 14px",
          background: T.bg,
          borderRadius: 4,
          borderLeft: `2px solid ${T.amber}`,
          fontFamily: font,
          fontSize: 10,
          color: T.textMuted,
          lineHeight: 1.6,
        }}
      >
        <span style={{ color: T.amber, fontWeight: 700 }}>KEY INSIGHT:</span>{" "}
        Even at the most bullish parameters (9.5% WACC / 4.0% TGR), intrinsic
        value reaches only $35 &mdash; a 37% discount to market. The base case
        ($20) implies ~64% overvaluation relative to normalised DCF. The market
        is pricing option value on MFC rollout + international scaling +
        GreenBox traction.
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════
export default function SymboticDashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: "ALL", icon: "\u25C9" },
    { label: "VENN", icon: "\u2295" },
    { label: "WATERFALL", icon: "\u25AE" },
    { label: "FLOW", icon: "\u21F6" },
    { label: "TIMELINE", icon: "\u23F1" },
    { label: "HEATMAP", icon: "\u25A6" },
  ];

  const charts = [
    <VennDiagram key="v" />,
    <WaterfallChart key="w" />,
    <VetoSlasherFlow key="f" />,
    <CatalystTimeline key="t" />,
    <SensitivityHeatmap key="h" />,
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.text,
        fontFamily: font,
        position: "relative",
      }}
    >
      {/* Global keyframe styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Scanline overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 999,
          opacity: 0.015,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />

      {/* Header */}
      <div
        style={{
          background: "#060a12",
          borderBottom: `1px solid ${T.border}`,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/research/symbotic-automation-at-scale"
            style={{
              width: 32,
              height: 32,
              borderRadius: 4,
              background: T.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: font,
              fontSize: 14,
              fontWeight: 800,
              color: "#fff",
              textDecoration: "none",
            }}
          >
            S
          </Link>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.textBright,
                letterSpacing: 1,
              }}
            >
              SYMBOTIC INTELLIGENCE TERMINAL
            </div>
            <div
              style={{
                fontSize: 9,
                color: T.textMuted,
                letterSpacing: 2,
                marginTop: 2,
              }}
            >
              SOLO STRATEGIST &bull; DUAL-HORIZON RESEARCH &bull; FEB 17 2026
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              fontSize: 10,
              color: T.green,
              animation: "blink 2s infinite",
            }}
          >
            &bull;
          </span>
          <span
            style={{ fontSize: 9, color: T.textMuted, letterSpacing: 1 }}
          >
            LIVE DATA
          </span>
        </div>
      </div>

      <Ticker />

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: 0,
          padding: "0 24px",
          background: "#060a12",
          borderBottom: `1px solid ${T.border}`,
          overflowX: "auto",
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              padding: "10px 18px",
              border: "none",
              cursor: "pointer",
              background: activeTab === i ? T.bgCard : "transparent",
              color: activeTab === i ? T.accent : T.textMuted,
              fontFamily: font,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 1.5,
              borderBottom:
                activeTab === i
                  ? `2px solid ${T.accent}`
                  : "2px solid transparent",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 12 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div style={{ padding: 24, maxWidth: 780, margin: "0 auto" }}>
        {activeTab === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {charts}
          </div>
        ) : (
          charts[activeTab - 1]
        )}

        {/* Back link */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link
            href="/research/symbotic-automation-at-scale"
            style={{
              fontFamily: font,
              fontSize: 11,
              color: T.accent,
              textDecoration: "none",
              letterSpacing: 1,
            }}
          >
            &larr; BACK TO RESEARCH ARTICLE
          </Link>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 32,
            padding: "16px 0",
            borderTop: `1px solid ${T.border}`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 8,
              color: T.textMuted,
              letterSpacing: 2,
              lineHeight: 1.8,
            }}
          >
            SOLO STRATEGIST RESEARCH TERMINAL &bull; DATA AS OF FEB 17 2026
            <br />
            SOURCES: SEC 10-K/10-Q FILINGS &bull; DEFILLAMA &bull; CHAINWIRE
            &bull; COMPANY PRESS RELEASES
            <br />
            NOT INVESTMENT ADVICE &bull; FOR INFORMATIONAL PURPOSES ONLY
          </div>
        </div>
      </div>
    </div>
  );
}
