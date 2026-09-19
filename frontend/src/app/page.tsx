import type { Metadata } from "next"
import HomeClient from "@/components/HomeClient"
import type { CategoryMap } from "@/lib/calculator-api"
import fallbackData from "@/lib/calculators-fallback.json"

const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000"

export const revalidate = 3600

export const metadata: Metadata = {
  title: {
    absolute: "TryCalc — 690 Free Online Calculators | Finance, Health, Math & More",
  },
  description:
    "Free online calculators for finance, health, fitness, construction, date & time, conversions, real estate, and everyday math. Fast, accurate, and responsive.",
  alternates: {
    canonical: "https://trycalc.net",
  },
}

async function getCalculators(): Promise<{ categories: CategoryMap; total: number }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/calculators/`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
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
    categories: (fallbackData.categories as unknown as CategoryMap) || {},
    total: fallbackData.total || 689,
  }
}

export default async function Page() {
  const { categories, total } = await getCalculators()
  return <HomeClient initialCategories={categories} initialTotal={total} />
}
