import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000"

export const revalidate = 86400

const CATEGORIES: { slug: string; priority: number }[] = [
  { slug: "finance", priority: 1.0 },
  { slug: "business_investment", priority: 0.9 },
  { slug: "health", priority: 0.9 },
  { slug: "construction", priority: 0.8 },
  { slug: "basic", priority: 0.8 },
  { slug: "garments", priority: 0.7 },
  { slug: "conversion", priority: 0.9 },
  { slug: "date_time", priority: 0.8 },
  { slug: "education", priority: 0.7 },
  { slug: "real_estate", priority: 0.8 },
  { slug: "event_budget", priority: 0.7 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ]

  // Category landing pages
  CATEGORIES.forEach((cat) => {
    entries.push({
      url: `${SITE_URL}/calculators?category=${cat.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: cat.priority,
    })
  })

  // Fetch all 690+ calculators from the backend registry
  try {
    const res = await fetch(`${BACKEND_URL}/api/calculators/`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    })
    if (res.ok) {
      const data = await res.json()
      const seen = new Set<string>()

      if (data && data.categories) {
        for (const [category, list] of Object.entries<any>(data.categories)) {
          if (Array.isArray(list)) {
            for (const item of list) {
              const id = String(item.id)
              if (id && !seen.has(id)) {
                seen.add(id)
                entries.push({
                  url: `${SITE_URL}/calculators/${id}`,
                  lastModified: now,
                  changeFrequency: "weekly",
                  priority: 0.85,
                })
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch calculators for sitemap:", err)
  }

  return entries
}
