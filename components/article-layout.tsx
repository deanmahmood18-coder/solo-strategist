import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import type { ResearchArticle } from "@/data/research";
import { formatDate } from "@/lib/utils";

type ArticleLayoutProps = {
  article: ResearchArticle;
  children: ReactNode;
};

export function ArticleLayout({ article, children }: ArticleLayoutProps) {
  return (
    <article className="container-shell py-12 md:py-16">
      <header className="reading-width border-b border-slate-700 pb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-champagne/80">
          {article.category}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-slate-100 md:text-5xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          {formatDate(article.publishedAt)}&ensp;·&ensp;{article.readingTime}
        </p>
        {article.thumbnail && (
          <div className="mt-6 overflow-hidden rounded-sm border border-slate-700">
            <Image
              src={article.thumbnail}
              alt={article.title}
              width={720}
              height={405}
              className="w-full object-cover"
              priority
            />
          </div>
        )}
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
        <div className="reading-width">
          <section className="rounded-sm border border-slate-700 bg-slate-900 p-6">
            <h2 className="font-serif text-2xl text-champagne">Executive Summary</h2>
            <p className="mt-3 text-slate-200">{article.summary}</p>
          </section>

          <section className="mt-10 space-y-8">{children}</section>

          {article.dashboardUrl && (
            <div className="mt-10">
              <Link
                href={article.dashboardUrl}
                className="inline-flex items-center gap-2 rounded-sm border border-champagne/40 bg-champagne/10 px-6 py-3 font-sans text-sm font-semibold text-champagne transition-colors hover:bg-champagne/20"
              >
                View Interactive Dashboard
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          )}

          <p className="mt-10 border-t border-slate-700 pt-8 font-serif text-xl text-champagne">
            The Solo Strategist
          </p>
        </div>

        <aside className="h-fit rounded-sm border border-slate-700 bg-slate-900 p-6">
          <h2 className="font-serif text-2xl text-champagne">Key Takeaways</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
            {article.takeaways.map((takeaway) => (
              <li key={takeaway}>• {takeaway}</li>
            ))}
          </ul>
        </aside>
      </div>
    </article>
  );
}
