import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Calendar, Hash, TrendingDown } from "lucide-react";

import { postMortems, type PostMortem } from "@/data/post-mortems";

export const metadata: Metadata = {
  title: "Post-Mortems — Transparency Audit | The Solo Strategist",
  description:
    "A public audit trail of broken investment theses. Every failure is documented, analyzed, and converted into a systemic improvement.",
};

function AuditMeta({ entry }: { entry: PostMortem }) {
  const totalReturn = (
    ((entry.exitPrice - entry.entryPrice) / entry.entryPrice) *
    100
  ).toFixed(1);

  return (
    <div className="mb-8 grid gap-3 grid-cols-2 sm:grid-cols-4">
      {[
        {
          icon: Hash,
          label: "Audit ID",
          value: entry.auditId,
        },
        {
          icon: Calendar,
          label: "Date of Exit",
          value: new Date(entry.dateExited).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        },
        {
          icon: TrendingDown,
          label: "Total Return",
          value: `${totalReturn}%`,
        },
        {
          icon: AlertTriangle,
          label: "vs. Benchmark",
          value: entry.totalLossVsBenchmark,
        },
      ].map((m) => (
        <div
          key={m.label}
          className="rounded-sm border border-rose-900/30 bg-rose-950/20 p-3"
        >
          <div className="flex items-center gap-1.5">
            <m.icon className="h-3 w-3 text-rose-500/70" />
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {m.label}
            </p>
          </div>
          <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-rose-400">
            {m.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function Pillar({
  number,
  title,
  summary,
  details,
  accent,
}: {
  number: string;
  title: string;
  summary: string;
  details: string[];
  accent: "rose" | "amber" | "slate";
}) {
  const colors = {
    rose: {
      border: "border-rose-900/40",
      line: "bg-rose-700/60",
      badge: "bg-rose-950/60 text-rose-400 border-rose-900/40",
      title: "text-rose-400",
    },
    amber: {
      border: "border-amber-900/30",
      line: "bg-amber-700/50",
      badge: "bg-amber-950/50 text-amber-400 border-amber-900/30",
      title: "text-amber-400",
    },
    slate: {
      border: "border-slate-700/60",
      line: "bg-slate-600/50",
      badge: "bg-slate-800/60 text-slate-300 border-slate-700/50",
      title: "text-slate-300",
    },
  }[accent];

  return (
    <div className={`relative border-l-2 ${colors.line} pl-6 py-1`}>
      <span
        className={`inline-block rounded border px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest ${colors.badge}`}
      >
        {number}
      </span>
      <h3 className={`mt-2 font-serif text-xl ${colors.title}`}>{title}</h3>
      <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300">
        {summary}
      </p>
      <div className="mt-4 space-y-3">
        {details.map((d, i) => (
          <p key={i} className="text-[13px] leading-relaxed text-slate-400">
            {d}
          </p>
        ))}
      </div>
    </div>
  );
}

function PostMortemEntry({ entry }: { entry: PostMortem }) {
  return (
    <article className="rounded-sm border border-rose-900/20 bg-slate-950 p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-rose-950/80 text-xs font-bold text-rose-400 ring-1 ring-rose-900/40">
              !
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500/80">
              Broken Thesis &mdash; Audit Record
            </p>
          </div>
          <h2 className="mt-2 font-serif text-2xl text-slate-100 sm:text-3xl">
            {entry.title}
          </h2>
          <p className="mt-1 font-mono text-xs text-slate-500">
            {entry.ticker} &middot; Published{" "}
            {new Date(entry.datePublished).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            &middot; Exited{" "}
            {new Date(entry.dateExited).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <AuditMeta entry={entry} />

      {/* Three Pillars */}
      <div className="space-y-8">
        <Pillar
          number="I"
          title="Original Thesis"
          summary={entry.originalThesis.summary}
          details={entry.originalThesis.details}
          accent="slate"
        />
        <Pillar
          number="II"
          title="The Divergence"
          summary={entry.divergence.summary}
          details={entry.divergence.details}
          accent="rose"
        />
        <Pillar
          number="III"
          title={`The Lesson: ${entry.lesson.label}`}
          summary={entry.lesson.summary}
          details={entry.lesson.details}
          accent="amber"
        />
      </div>
    </article>
  );
}

export default function PostMortemsPage() {
  return (
    <div className="container-shell py-14">
      <header className="mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500/80">
          Transparency Audit
        </p>
        <h1 className="mt-2 font-serif text-4xl text-slate-100 sm:text-5xl">
          Post-Mortems
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
          A public audit trail of broken investment theses. Every failure is
          documented, analysed, and converted into a systemic improvement.
          Accountability is not optional &mdash; it is the mechanism through
          which conviction sharpens.
        </p>
        <div className="mt-6 h-px w-16 bg-rose-700/40" />
      </header>

      <div className="space-y-10">
        {postMortems.map((pm) => (
          <PostMortemEntry key={pm.auditId} entry={pm} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/archive"
          className="text-xs text-slate-500 transition hover:text-slate-300"
        >
          &larr; Back to Archive
        </Link>
      </div>
    </div>
  );
}
