import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides-data";

export const metadata: Metadata = {
  title: "Calculation Guides & Practical Tutorials | TryCalc",
  description: "Expert editorial guides, financial formulas, engineering tutorials, and mathematical walk-throughs provided by TryCalc.",
  alternates: {
    canonical: "https://trycalc.net/guides",
  },
};

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-blue-700 uppercase bg-blue-100 rounded-full dark:bg-blue-900/40 dark:text-blue-300">
            TryCalc Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            In-Depth Calculation Guides & Tutorials
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Comprehensive explanations of formulas, industry standards, financial models, and mathematical methodologies.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {GUIDES.map((guide) => (
            <article
              key={guide.slug}
              className="flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-medium text-blue-600 dark:text-blue-400">{guide.category}</span>
                  <span>{guide.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Link href={"/guides/" + guide.slug}>{guide.title}</Link>
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
                  {guide.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link
                  href={"/guides/" + guide.slug}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                >
                  Read Full Guide &rarr;
                </Link>
                <Link
                  href={"/calculators/" + guide.calculatorSlug}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
                >
                  Interactive Tool
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
