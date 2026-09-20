import type { MetadataRoute } from "next"
import type { CalculatorDef } from "@/lib/calculator-api"
import fallbackData from "@/lib/calculators-fallback.json"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000"

export const dynamic = "force-dynamic"
export const revalidate = 86400

const CATEGORY_KEYS = [
  "finance",
  "business_investment",
  "health",
  "construction",
  "basic",
  "garments",
  "conversion",
  "date_time",
  "education",
  "real_estate",
  "event_budget",
]

export async function generateSitemaps() {
  return [
    { id: "core" },
    ...CATEGORY_KEYS.map((k) => ({ id: k })),
  ]
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // 1. Core Pages (Home, About, Privacy, Category Hubs)
  if (id === "core") {
    const entries: MetadataRoute.Sitemap = [
      {
        url: SITE_URL,
        lastModified: now,
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${SITE_URL}/about`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/contact`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/privacy`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      },
      {
        url: `${SITE_URL}/terms`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      },
      {
        url: `${SITE_URL}/disclaimer`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      },
    ]

    // All Category Hub URLs
    CATEGORY_KEYS.forEach((catSlug) => {
      entries.push({
        url: `${SITE_URL}/category/${catSlug}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9,
      })
    })

    return entries
  }

  // 2. Specific Category Sitemaps
  const targetCategory = id
  const entries: MetadataRoute.Sitemap = []

  // Add the category hub itself to its specific partition
  entries.push({
    url: `${SITE_URL}/category/${targetCategory}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.95,
  })

  // Fetch calculators for this category
  try {
    const res = await fetch(`${BACKEND_URL}/api/calculators/`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    })
    if (res.ok) {
      const data = await res.json()
      if (data && data.categories && data.categories[targetCategory]) {
        const list = data.categories[targetCategory]
        if (Array.isArray(list)) {
          for (const item of list) {
            const calcId = String(item.id)
            if (calcId) {
              entries.push({
                url: `${SITE_URL}/calculators/${calcId}`,
                lastModified: now,
                changeFrequency: "weekly",
                priority: 0.85,
              })
            }
          }
        }
        return entries
      }
    }
  } catch {}

  // Fallback to bundled data if backend call fails during build
  const fallbackCats = fallbackData.categories as unknown as Record<string, { calculators: CalculatorDef[] }>
  const fallbackList = fallbackCats[targetCategory]?.calculators || []

  for (const calc of fallbackList) {
    entries.push({
      url: `${SITE_URL}/calculators/${calc.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    })
  }

  return entries
}
