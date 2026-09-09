import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CalculatorRunnerView from "@/components/CalculatorRunnerView"
import { seoIntroFor, seoTitleFor, seoFaqFor } from "@/lib/seo-helpers"
import type { CalculatorDef } from "@/lib/calculator-api"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://calchub.io"
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000"

/** ISR: pages are cached and refreshed daily. */
export const revalidate = 86400

async function fetchCalc(calcId: string): Promise<CalculatorDef | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/calculators/${calcId}/`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data || !data.id || !Array.isArray(data.fields)) return null
    return data as CalculatorDef
  } catch {
    return null
  }
}

/** Pre-render the most popular calculators at build time. */
export async function generateStaticParams() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/calculators/`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = await res.json()
    const ids: string[] = []
    for (const list of Object.values<any>(data.categories || {})) {
      if (Array.isArray(list)) for (const c of list) ids.push(String(c.id))
    }
    return ids.map((id) => ({ calcId: id }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ calcId: string }>
}): Promise<Metadata> {
  const { calcId } = await params
  const calc = await fetchCalc(calcId)
  if (!calc) {
    return { title: "Calculator not found | CalcHub" }
  }
  const title = seoTitleFor(calc).replace(/ \| CalcHub$/, "")
  const intro = seoIntroFor(calc)
  const url = `${SITE_URL}/calculators/${calcId}`
  return {
    title,
    description: intro,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: intro,
      url,
      type: "website",
      siteName: "CalcHub",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: calc.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: intro,
      images: ["/og-image.png"],
    },
    keywords: [
      calc.name.toLowerCase(),
      `${calc.name.toLowerCase()} online`,
      `${calc.name.toLowerCase()} free`,
      "online calculator",
      "calchub",
    ],
  }
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ calcId: string }>
}) {
  const { calcId } = await params
  const calc = await fetchCalc(calcId)
  if (!calc) notFound()

  // Breadcrumb JSON-LD for this calculator page
  const faqs = seoFaqFor(calc)
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "CalcHub", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: calc.name, item: `${SITE_URL}/calculators/${calcId}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <CalculatorRunnerView calc={calc} />
    </>
  )
}
