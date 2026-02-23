import type { Metadata } from "next";

import { ResearchGrid } from "@/components/research-grid";

export const metadata: Metadata = {
  title: "Research | The Solo Strategist",
  description: "Longform institutional research by category with archive-level filtering."
};

export default function ResearchPage() {
  return (
    <div className="container-shell py-14">
      <header className="mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Global Research
        </p>
        <h1 className="mt-2 font-serif text-4xl text-slate-100 sm:text-5xl">
          Research Library
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
          Long-horizon memos organized by macro regime, sector structure, and valuation asymmetry.
          Each report reflects independent, bottom-up analysis with full transparency on methodology.
        </p>
        <div className="mt-6 h-px w-16 bg-champagne/30" />
      </header>
      <ResearchGrid />
    </div>
  );
}
