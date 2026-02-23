import type { Metadata } from "next";

import { ArchiveList } from "@/components/archive-list";

export const metadata: Metadata = {
  title: "Archive | The Solo Strategist",
  description: "Chronological research archive with topic search."
};

export default function ArchivePage() {
  return (
    <div className="container-shell py-14">
      <header className="mb-8 reading-width">
        <h1 className="font-serif text-5xl text-midnight dark:text-slate-100">Research Archive</h1>
        <p className="mt-3 text-lg text-ink/80 dark:text-slate-300">
          A chronological ledger of published theses and post-publication updates.
        </p>
      </header>
      <ArchiveList />
    </div>
  );
}
