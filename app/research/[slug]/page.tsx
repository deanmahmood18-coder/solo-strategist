import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleLayout } from "@/components/article-layout";
import { researchArticles } from "@/data/research";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return researchArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = researchArticles.find((item) => item.slug === slug);

  if (!article) {
    return {
      title: "Not Found | The Solo Strategist"
    };
  }

  return {
    title: `${article.title} | The Solo Strategist`,
    description: article.summary
  };
}

export default async function ResearchArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = researchArticles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <ArticleLayout article={article}>
      {article.content.map((section) => (
        <section key={section.heading}>
          <h2 className="font-serif text-3xl text-midnight dark:text-champagne">{section.heading}</h2>
          <div className="mt-3 space-y-6 text-ink/90 dark:text-slate-200">
            {section.body.map((item, index) =>
              typeof item === "string" ? (
                <p key={index}>{item}</p>
              ) : (
                <figure key={index}>
                  <img
                    src={item.figure.src}
                    alt={item.figure.caption}
                    className="w-full rounded-sm border border-midnight/10 dark:border-slate-700"
                  />
                  <figcaption className="mt-2 text-center text-xs text-ink/50 dark:text-slate-500">
                    {item.figure.caption}
                  </figcaption>
                </figure>
              )
            )}
          </div>
        </section>
      ))}
    </ArticleLayout>
  );
}
