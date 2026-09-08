import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://calchub.io"

// Categories from the backend registry (11 categories)
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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ]

  // Category landing pages
  CATEGORIES.forEach((cat) => {
    entries.push({
      url: `${SITE_URL}/?category=${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: cat.priority,
    })
  })

  return entries
}
