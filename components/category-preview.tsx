import Link from "next/link";
import { BarChart3, DollarSign, Globe, TrendingUp } from "lucide-react";

import { researchArticles, type ResearchArticle } from "@/data/research";

const categories: {
  name: ResearchArticle["category"];
  icon: React.ReactNode;
}[] = [
  { name: "Macro",       icon: <Globe className="h-6 w-6" /> },
  { name: "Equities",    icon: <TrendingUp className="h-6 w-6" /> },
  { name: "Credit",      icon: <DollarSign className="h-6 w-6" /> },
  { name: "Commodities", icon: <BarChart3 className="h-6 w-6" /> },
];

function getLatest(cat: ResearchArticle["category"]) {
  return researchArticles.find((a) => a.category === cat);
}

export function CategoryPreview() {
  return (
    <section className="container-shell py-16">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        Research Coverage
      </p>
      <h2 className="mt-1 font-serif text-3xl text-champagne">
        By Discipline
      </h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map(({ name, icon }) => {
          const article = getLatest(name);
          return (
            <Link
              key={name}
              href="/research"
              className="group flex flex-col rounded-sm border border-slate-700/60 bg-slate-900/80 p-5 transition-shadow hover:shadow-paper"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-champagne/[0.08] text-champagne/50">
                  {icon}
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  {name}
                </h3>
              </div>

              {article ? (
                <>
                  <p className="mt-4 font-serif text-base leading-snug text-slate-100 group-hover:text-champagne">
                    {article.title}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {article.takeaways[0]}
                  </p>
                </>
              ) : (
                <p className="mt-4 font-serif text-sm italic text-slate-600">
                  Coverage forthcoming
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
