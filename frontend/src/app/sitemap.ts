import type { MetadataRoute } from "next"
import { CATEGORY_META, type CalculatorDef } from "@/lib/calculator-api"
import fallbackData from "@/lib/calculators-fallback.json"
import { GUIDES } from "@/lib/guides-data"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000"

export const dynamic = "force-dynamic"
export const revalidate = 86400

const CATEGORY_KEYS = Object.keys(CATEGORY_META)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // 1. Core pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: SITE_URL + "/guides",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: SITE_URL + "/widgets",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: SITE_URL + "/about",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: SITE_URL + "/contact",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: SITE_URL + "/disclaimer",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: SITE_URL + "/privacy-policy",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: SITE_URL + "/terms-of-service",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ]

  // 2. Guide Articles
  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: SITE_URL + "/guides/" + guide.slug,
    lastModified: new Date(guide.publishedAt),
    changeFrequency: "monthly",
    priority: 0.85,
  }))

  // 3. Category pages
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_KEYS.map((cat) => ({
    url: SITE_URL + "/category/" + cat,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // 4. Calculator pages from fallback or API
  let calcs: CalculatorDef[] = []
  try {
    const res = await fetch(BACKEND_URL + "/api/v1/calculators/", {
      next: { revalidate: 86400 },
      headers: { Accept: "application/json" },
    })
    if (res.ok) {
      calcs = await res.json()
    }
  } catch {
    // backend unreachable at build time, use fallback
  }

  if (!calcs || calcs.length === 0) {
    const cats = (fallbackData.categories as unknown as Record<string, CalculatorDef[]>) || {}
    for (const list of Object.values(cats)) {
      if (Array.isArray(list)) {
        calcs.push(...list)
      }
    }
  }

  const calculatorRoutes: MetadataRoute.Sitemap = (calcs || [])
    .filter((c) => c && c.id)
    .map((c) => ({
      url: SITE_URL + "/calculators/" + c.id,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }))

  return [...staticRoutes, ...guideRoutes, ...categoryRoutes, ...calculatorRoutes]
}
