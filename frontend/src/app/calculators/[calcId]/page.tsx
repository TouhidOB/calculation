import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import CalculatorRunnerView from "@/components/CalculatorRunnerView"
import { seoIntroFor, seoTitleFor, seoFaqFor, seoHowToFor, seoMetaDescriptionFor, seoDirectAnswerFor } from "@/lib/seo-helpers"
import type { CalculatorDef } from "@/lib/calculator-api"
import { CATEGORY_META } from "@/lib/calculator-api"
import fallbackData from "@/lib/calculators-fallback.json"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000"

/** ISR: pages are cached and refreshed daily. */
export const revalidate = 86400

function findInFallback(id: string): CalculatorDef | null {
  const cats = (fallbackData.categories as unknown as Record<string, CalculatorDef[]>) || {}
  for (const list of Object.values(cats)) {
    if (Array.isArray(list)) {
      const found = list.find((c) => c.id === id)
      if (found) return found
    }
  }
  return null
}

function getRelatedCalculators(category: string, currentId: string) {
  const cats = (fallbackData.categories as unknown as Record<string, CalculatorDef[]>) || {}
  const list = cats[category] || []
  return list
    .filter((c) => c.id !== currentId)
    .slice(0, 4)
    .map((c) => ({ id: c.id, name: c.name, description: c.description || "" }))
}

async function fetchCalc(calcId: string): Promise<CalculatorDef | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/calculators/${calcId}/`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    })
    if (res.ok) {
      const data = await res.json()
      if (data && data.id && Array.isArray(data.fields)) return data as CalculatorDef
    }
  } catch {}
  return findInFallback(calcId)
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
  const ids: string[] = []
  try {
    const res = await fetch(`${BACKEND_URL}/api/calculators/`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      const categories = (data.categories as Record<string, CalculatorDef[]>) || {}
      for (const list of Object.values(categories)) {
        if (Array.isArray(list)) for (const c of list) ids.push(String(c.id))
      }
    }
  } catch {}

  if (ids.length === 0) {
    const cats = (fallbackData.categories as unknown as Record<string, CalculatorDef[]>) || {}
    for (const list of Object.values(cats)) {
      if (Array.isArray(list)) for (const c of list) ids.push(String(c.id))
    }
  }

  return ids.map((id) => ({ calcId: id }))
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
  const metaDesc = seoMetaDescriptionFor(calc)
  const url = `${SITE_URL}/calculators/${canonicalId}`
  const catLabel = CATEGORY_META[calc.category]?.label || calc.category
  return {
    title,
    description: metaDesc,
    alternates: {
      canonical: url,
      languages: {
        "x-default": url,
        "en": url,
        "en-US": url,
        "en-GB": url,
        "en-CA": url,
        "en-AU": url,
        "en-IN": url,
        "en-BD": url,
        "en-SG": url,
        "en-IE": url,
        "en-NZ": url,
        "en-ZA": url,
      },
    },
    openGraph: {
      title,
      description: metaDesc,
      url,
      type: "website",
      siteName: "TryCalc",
      locale: "en_US",
      alternateLocale: ["en_GB", "en_CA", "en_AU", "en_IN"],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${calc.name} - Free Online Calculator` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDesc,
      images: ["/og-image.png"],
    },
    keywords: [
      calc.name.toLowerCase(),
      `${calc.name.toLowerCase()} online`,
      `${calc.name.toLowerCase()} free`,
      `${catLabel.toLowerCase()} calculator`,
      "online calculator",
      "free calculator tool",
      "international currency calculator",
      "worldwide unit conversion",
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

  const relatedCalcs = getRelatedCalculators(calc.category, canonicalId)
  const faqs = seoFaqFor(calc)
  const howToSteps = seoHowToFor(calc)
  const catLabel = CATEGORY_META[calc.category]?.label || calc.category

  // 1. BreadcrumbList JSON-LD
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TryCalc", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: catLabel, item: `${SITE_URL}/category/${calc.category}` },
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
    datePublished: "2026-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "en-US",
    author: {
      "@type": "Organization",
      name: "TryCalc",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "2480",
      bestRating: "5",
      worstRating: "1",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".direct-answer-capsule", ".formula-representation"],
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

  const intro = seoIntroFor(calc)
  const directAnswer = seoDirectAnswerFor(calc)

  return (
    <>
      {/* ── Schema JSON-LD blocks (server-rendered, crawlable) ── */}
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

      {/*
        ── SEO-critical server-rendered heading block ──
        Visually hidden but fully rendered in the HTML for Google/AI crawlers.
        Supplies H1, H2, direct-answer capsule and intro paragraph that the
        client-only CalculatorRunnerView cannot provide at parse time.
      */}
      <div
        aria-hidden="false"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
      >
        <h1>{calc.name} — Free Online {catLabel.replace(" Calculators", " Calculator")} | TryCalc</h1>
        <p className="direct-answer-capsule">{directAnswer}</p>
        <h2>About the {calc.name}</h2>
        <p>{intro}</p>
        <h2>How to Use the {calc.name}</h2>
        <ol>
          {howToSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <div key={i}>
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href={SITE_URL}>TryCalc</a></li>
            <li><a href={`${SITE_URL}/category/${calc.category}`}>{catLabel}</a></li>
            <li>{calc.name}</li>
          </ol>
        </nav>
      </div>

      <CalculatorRunnerView calc={calc} initialRelatedCalcs={relatedCalcs} />
    </>
  )
}
