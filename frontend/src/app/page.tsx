import type { Metadata } from "next"
import HomeClient from "@/components/HomeClient"
import type { CategoryMap } from "@/lib/calculator-api"
import fallbackData from "@/lib/calculators-fallback.json"

const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000"

export const revalidate = 60

export const metadata: Metadata = {
  title: {
    absolute: "TryCalc (2026) — 725 Free Online Calculators | Fast, Accurate & Modern",
  },
  description:
    "Free online calculators (2026) for finance, mortgage, health, fitness, construction, math, conversions, and AI. Fast, accurate, instant results with zero signup.",
  alternates: {
    canonical: "https://trycalc.net",
  },
}

async function getCalculators(): Promise<{ categories: CategoryMap; total: number }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/calculators/`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    })
    if (res.ok) {
      const data = await res.json()
      if (data && data.total && data.total > 0) {
        return {
          categories: data.categories || {},
          total: data.total || 0,
        }
      }
    }
  } catch (err) {
    console.warn("Using bundled fallback calculator registry for homepage:", err)
  }

  return {
    categories: fallbackData.categories as unknown as CategoryMap,
    total: fallbackData.total || 725,
  }
}

export default async function Page() {
  const { categories, total } = await getCalculators()
  return <HomeClient initialCategories={categories} initialTotal={total} />
}
