import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CalculatorRunnerView from "@/components/CalculatorRunnerView"
import type { CalculatorDef } from "@/lib/calculator-api"

const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000"

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ calcId: string }>
}): Promise<Metadata> {
  const { calcId } = await params
  const calc = await fetchCalc(calcId)
  if (!calc) {
    return { title: "Calculator | TryCalc" }
  }
  return {
    title: `${calc.name} Widget | TryCalc`,
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ calcId: string }>
}) {
  const { calcId } = await params
  const calc = await fetchCalc(calcId)
  if (!calc) notFound()

  return <CalculatorRunnerView calc={calc} embedded />
}
