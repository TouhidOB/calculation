import type { Metadata } from "next"
import HomeClient from "@/components/HomeClient"
import type { CategoryMap } from "@/lib/calculator-api"

const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "CalcHub — 680+ Free Online Calculators | Finance, Health, Construction & More",
  description:
    "Free online calculators for finance, health, fitness, construction, date & time, conversions, real estate, and everyday math. Fast, accurate, and responsive.",
}

async function getCalculators(): Promise<{ categories: CategoryMap; total: number }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/calculators/`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    })
    if (!res.ok) {
      return { categories: {}, total: 0 }
    }
    const data = await res.json()
    return {
      categories: data.categories || {},
      total: data.total || 0,
    }
  } catch (err) {
    console.error("Error prefetching calculators for homepage:", err)
    return { categories: {}, total: 0 }
  }
}

export default async function Page() {
  const { categories, total } = await getCalculators()
  return <HomeClient initialCategories={categories} initialTotal={total} />
}
