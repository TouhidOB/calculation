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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // 1. Core pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/calculators`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/disclaimer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ]

  // 2. Hub-and-Spoke Semantic Category Hub URLs (2026 SEO Topical Authority)
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_KEYS.map((slug) => ({
    url: `${SITE_URL}/category/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.9,
  }))

  // 3. All 689 Calculators
  const calcRoutes: MetadataRoute.Sitemap = []
  const seenIds = new Set<string>()

  try {
    const res = await fetch(`${BACKEND_URL}/api/calculators/`, {
      next: { revalidate: 86400 },
      headers: { Accept: "application/json" },
    })
    if (res.ok) {
      const data = await res.json()
      const categories = data.categories || {}
      for (const catKey of Object.keys(categories)) {
        const raw = categories[catKey]
        const calcs: CalculatorDef[] = Array.isArray(raw) ? raw : (raw?.calculators || [])
        for (const c of calcs) {
          if (c?.id && !seenIds.has(c.id)) {
            seenIds.add(c.id)
            calcRoutes.push({
              url: `${SITE_URL}/calculators/${c.id}`,
              lastModified: now,
              changeFrequency: "weekly",
              priority: 0.8,
            })
          }
        }
      }
    }
  } catch (err) {
    console.warn("Sitemap: Backend unreachable during build, using fallback registry:", err)
  }

  // Ensure all 689 calculators are present via fallback if backend was unavailable
  if (calcRoutes.length === 0) {
    const fallbackCats = (fallbackData.categories as unknown) as Record<string, CalculatorDef[] | { calculators: CalculatorDef[] }>
    for (const catKey of Object.keys(fallbackCats)) {
      const raw = fallbackCats[catKey]
      const calcs: CalculatorDef[] = Array.isArray(raw) ? raw : (raw?.calculators || [])
      for (const c of calcs) {
        if (c?.id && !seenIds.has(c.id)) {
          seenIds.add(c.id)
          calcRoutes.push({
            url: `${SITE_URL}/calculators/${c.id}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
          })
        }
      }
    }
  }

  return [...staticRoutes, ...categoryRoutes, ...calcRoutes]
}
