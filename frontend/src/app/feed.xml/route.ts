import { CATEGORY_META, type CalculatorDef } from "@/lib/calculator-api"
import fallbackData from "@/lib/calculators-fallback.json"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"

export const dynamic = "force-dynamic"
export const revalidate = 86400

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  let calculators: CalculatorDef[] = []
  try {
    const cats = (fallbackData.categories as unknown as Record<string, CalculatorDef[]>) || {}
    calculators = Object.values(cats).flat()
  } catch {
    calculators = []
  }
  try {
    const backendUrl = process.env.BACKEND_URL || "http://backend:8000"
    const res = await fetch(`${backendUrl}/api/calculators/`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        calculators = data
      }
    }
  } catch {
    // fallback to static JSON
  }

  const itemsXml = calculators
    .map((calc) => {
      const catMeta = CATEGORY_META[calc.category]
      const catName = catMeta?.label || calc.category
      const url = `${SITE_URL}/calculators/${calc.id}`
      return `    <item>
      <title>${escapeXml(calc.name)} — Free Online Calculator</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(calc.description || `Instant, free online ${calc.name} tool.`)}</description>
      <category>${escapeXml(catName)}</category>
    </item>`
    })
    .join("\n")

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TryCalc — 774+ Free Instant Calculators</title>
    <link>${SITE_URL}</link>
    <description>Clean, modern, and instant calculators across Finance, Health, Construction, Business, and Math.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  })
}
