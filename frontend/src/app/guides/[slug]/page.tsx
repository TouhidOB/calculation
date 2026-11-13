import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GUIDES } from "@/lib/guides-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return {};

  return {
    title: guide.title + " | TryCalc Guides",
    description: guide.description,
    alternates: {
      canonical: "https://trycalc.net/guides/" + guide.slug,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      publishedTime: guide.publishedAt,
      authors: [guide.author],
    },
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.description,
    "author": {
      "@type": "Organization",
      "name": guide.author,
      "url": "https://trycalc.net"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TryCalc",
      "url": "https://trycalc.net"
    },
    "datePublished": guide.publishedAt,
    "mainEntityOfPage": "https://trycalc.net/guides/" + guide.slug
  };

  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm">
        <nav className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:underline">Guides</Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium truncate">{guide.title}</span>
        </nav>

        <header className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-blue-700 uppercase bg-blue-100 rounded-full dark:bg-blue-900/40 dark:text-blue-300">
            {guide.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {guide.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <span>By {guide.author}</span>
            <span>&bull;</span>
            <time dateTime={guide.publishedAt}>{guide.publishedAt}</time>
            <span>&bull;</span>
            <span>{guide.readTime}</span>
          </div>
        </header>

        {/* Embedded Interactive Tool CTA Banner */}
        <aside className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-blue-900 dark:text-blue-200">
              Try the Interactive Calculation Tool
            </h2>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Calculate real figures instantly with the official {guide.calculatorTitle}.
            </p>
          </div>
          <Link
            href={"/calculators/" + guide.calculatorSlug}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            Open Calculator &rarr;
          </Link>
        </aside>

        {/* Main Editorial Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
          {guide.content.map((paragraph, index) => (
            <p key={index} className="text-base sm:text-lg">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <Link href="/guides" className="text-sm font-semibold text-blue-600 hover:underline">
            &larr; Back to all guides
          </Link>
          <Link
            href={"/calculators/" + guide.calculatorSlug}
            className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600"
          >
            Launch Tool &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
