import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import CalculatorRunnerView from "@/components/CalculatorRunnerView"
import { seoIntroFor, seoTitleFor, seoFaqFor, seoHowToFor } from "@/lib/seo-helpers"
import type { CalculatorDef } from "@/lib/calculator-api"
import { CATEGORY_META } from "@/lib/calculator-api"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"
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

/** Resolves calculator with automatic alias fallback (e.g. bmi-calculator -> bmi or vice-versa). */
async function resolveCalc(calcId: string): Promise<{ calc: CalculatorDef; canonicalId: string } | null> {
  const direct = await fetchCalc(calcId)
  if (direct) return { calc: direct, canonicalId: calcId }

  if (calcId.endsWith("-calculator")) {
    const trimmed = calcId.replace(/-calculator$/, "")
    const alt = await fetchCalc(trimmed)
    if (alt) return { calc: alt, canonicalId: trimmed }
  } else {
    const suffixed = `${calcId}-calculator`
    const alt = await fetchCalc(suffixed)
    if (alt) return { calc: alt, canonicalId: suffixed }
  }

  return null
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
    const categories = (data.categories as Record<string, CalculatorDef[]>) || {}
    for (const list of Object.values(categories)) {
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
  const resolved = await resolveCalc(calcId)
  if (!resolved) {
    return { title: "Calculator not found | TryCalc" }
  }
  const { calc, canonicalId } = resolved
  const title = seoTitleFor(calc).replace(/ \| TryCalc$/, "")
  const intro = seoIntroFor(calc)
  const url = `${SITE_URL}/calculators/${canonicalId}`
  const catLabel = CATEGORY_META[calc.category]?.label || calc.category
  return {
    title,
    description: intro,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: intro,
      url,
      type: "website",
      siteName: "TryCalc",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${calc.name} - Free Online Calculator` }],
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
      `${catLabel.toLowerCase()} calculator`,
      "online calculator",
      "free calculator tool",
      "trycalc",
    ],
  }
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ calcId: string }>
}) {
  const { calcId } = await params
  const resolved = await resolveCalc(calcId)
  if (!resolved) notFound()

  if (resolved.canonicalId !== calcId) {
    permanentRedirect(`/calculators/${resolved.canonicalId}`)
  }

  const { calc, canonicalId } = resolved

  const faqs = seoFaqFor(calc)
  const howToSteps = seoHowToFor(calc)
  const catLabel = CATEGORY_META[calc.category]?.label || calc.category

  // 1. BreadcrumbList JSON-LD
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TryCalc", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: catLabel, item: `${SITE_URL}/calculators?category=${calc.category}` },
      { "@type": "ListItem", position: 3, name: calc.name, item: `${SITE_URL}/calculators/${canonicalId}` },
    ],
  }

  // 2. WebApplication / SoftwareApplication JSON-LD
  const softwareAppLd = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    name: `${calc.name} — Free Online Calculator`,
    alternateName: calc.name,
    url: `${SITE_URL}/calculators/${canonicalId}`,
    description: seoIntroFor(calc),
    applicationCategory: "UtilityApplication",
    applicationSubCategory: catLabel,
    operatingSystem: "All",
    browserRequirements: "Requires modern web browser with HTML5 support.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: `Instant calculation, ${calc.fields.length} configurable parameter fields, 1-click example filler, copy results, reset inputs, responsive mobile & desktop UI`,
    publisher: {
      "@type": "Organization",
      name: "TryCalc",
      url: SITE_URL,
    },
  }

  // 3. FAQPage JSON-LD
  const faqPageLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  }

  // 4. HowTo JSON-LD
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use the ${calc.name}`,
    description: `Step-by-step guide to calculating ${calc.name.toLowerCase()} instantly using TryCalc.`,
    step: howToSteps.map((stepText, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: `Step ${idx + 1}`,
      text: stepText,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
      <CalculatorRunnerView calc={calc} />
    </>
  )
}
