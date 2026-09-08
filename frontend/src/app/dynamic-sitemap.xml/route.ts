import { NextResponse } from "next/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://calchub.io"

/**
 * Dynamic sitemap that pulls ALL calculator IDs from the backend registry.
 * Regenerated on each request (up to 24h server-side cache).
 */
export const dynamic = "force-dynamic"

interface CalcListItem {
  id: string
}

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || "http://backend:8000"
  let calcUrls: string[] = []

  try {
    const res = await fetch(`${backendUrl}/api/calculators/`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      // categories is a dict of category -> list of calculator objects
      const categoryLists: CalcListItem[][] = Object.values(data.categories || {})
      calcUrls = categoryLists.flatMap((list) =>
        Array.isArray(list) ? list.map((c) => c.id) : []
      )
    }
  } catch {
    // Backend unavailable — sitemap falls back to static entries only
  }

  const now = new Date().toISOString()
  const urls = [
    { loc: SITE_URL, changefreq: "daily", priority: "1.0" },
    ...calcUrls.map((id) => ({
      loc: `${SITE_URL}/?calculator=${id}`,
      changefreq: "weekly",
      priority: "0.8",
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
