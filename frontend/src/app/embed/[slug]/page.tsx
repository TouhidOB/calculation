import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CalculatorRunnerView from "@/components/CalculatorRunnerView"
import type { CalculatorDef } from "@/lib/calculator-api"
import fallbackData from "@/lib/calculators-fallback.json"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000"

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
async function resolveCalc(slug: string): Promise<{ calc: CalculatorDef; canonicalId: string } | null> {
  const direct = await fetchCalc(slug)
  if (direct) return { calc: direct, canonicalId: slug }

  if (slug.endsWith("-calculator")) {
    const trimmed = slug.replace(/-calculator$/, "")
    const alt = await fetchCalc(trimmed)
    if (alt) return { calc: alt, canonicalId: trimmed }
  } else {
    const suffixed = `${slug}-calculator`
    const alt = await fetchCalc(suffixed)
    if (alt) return { calc: alt, canonicalId: suffixed }
  }

  return null
}

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

  return ids.map((id) => ({ slug: id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const resolved = await resolveCalc(slug)
  if (!resolved) {
    return { title: "Calculator Widget | TryCalc" }
  }
  const { calc, canonicalId } = resolved
  return {
    title: `${calc.name} Widget | TryCalc`,
    description: `Embed the interactive ${calc.name} on your website or blog. Free, responsive, instant calculation widget powered by TryCalc.`,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${SITE_URL}/calculators/${canonicalId}`,
    },
  }
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const resolved = await resolveCalc(slug)
  if (!resolved) notFound()

  return <CalculatorRunnerView calc={resolved.calc} embedded />
}
