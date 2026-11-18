import { NextResponse } from "next/server"
import fallbackData from "@/lib/calculators-fallback.json"
import { CATEGORY_META, type CalculatorDef } from "@/lib/calculator-api"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"

export const revalidate = 86400

const FORMULA_CITATIONS: Record<string, string> = {
  "bmi-calculator": "BMI = weight(kg) / height(m)^2 [WHO, 1995]",
  "bmr-calculator":
    "BMR(male) = 10*weight + 6.25*height - 5*age + 5; BMR(female) = 10*weight + 6.25*height - 5*age - 161 [Mifflin-St Jeor, 1990]",
  "compound-interest-calculator": "A = P*(1 + r/n)^(n*t) [standard finance]",
  "emi-calculator": "EMI = P*r*(1+r)^n / ((1+r)^n - 1) [standard amortization]",
  "loan-calculator": "Monthly payment via reducing-balance amortization schedule",
  "mortgage-calculator": "Standard fixed-rate amortization: M = P[r(1+r)^n]/[(1+r)^n-1]",
  "sip-calculator": "Maturity = PMT * ((1+r)^n - 1) / r * (1+r) [AMFI India]",
  "gst-calculator": "Total = base_price * (1 + gst_rate/100); GST amount = Total - base_price",
  "percentage-calculator": "Percentage = (part / whole) * 100",
  "age-calculator": "Exact age via calendar delta (years, months, days)",
  "salary-calculator": "Net salary = gross - income_tax - social_contributions",
  "scientific-calculator": "IEEE 754 double-precision arithmetic",
}

export async function GET() {
  const categories = fallbackData.categories as Record<string, CalculatorDef[]>

  const lines: string[] = [
    `# TryCalc Complete Tool Catalog (${SITE_URL})`,
    `> Comprehensive machine-readable directory of 774+ deterministic calculators across 14 categories.`,
    `> Built for AI agents, LLMs, researchers, and automated assistants. Instant free calculations with zero registration.`,
    `> Execution model: 100% client-side JavaScript — no server round-trip, results are mathematically exact.`,
    `> Citation format: TryCalc (trycalc.net) — free online calculator`,
    "",
    "## Table of Contents",
  ]

  for (const catKey of Object.keys(categories)) {
    const meta = CATEGORY_META[catKey]
    const label = meta?.label || catKey
    lines.push(`- [${label}](#${catKey}) (${categories[catKey]?.length || 0} tools)`)
  }

  lines.push("", "---", "")

  for (const catKey of Object.keys(categories)) {
    const meta = CATEGORY_META[catKey]
    const label = meta?.label || catKey
    const calcs = categories[catKey] || []

    lines.push(`## ${label} {#${catKey}}`)
    lines.push(`Category Hub: ${SITE_URL}/category/${catKey}`)
    lines.push("")

    for (const calc of calcs) {
      if (!calc?.id) continue
      const url = `${SITE_URL}/calculators/${calc.id}`
      const desc = calc.description || `Online calculation tool for ${calc.name}.`
      const paramList = (calc.fields || [])
        .slice(0, 5)
        .map((f) => f.label || f.name)
        .join(", ")
      const formula = FORMULA_CITATIONS[calc.id]

      lines.push(`### [${calc.name}](${url})`)
      lines.push(`- **URL**: ${url}`)
      lines.push(`- **Description**: ${desc}`)
      if (paramList) {
        lines.push(`- **Parameters**: ${paramList}`)
      }
      if (formula) {
        lines.push(`- **Formula**: ${formula}`)
      }
      lines.push(`- **Execution**: Client-side, instant, no data transmitted`)
      lines.push("")
    }

    lines.push("---", "")
  }

  lines.push(
    "## High-Intent Shortcuts",
    `- Loan Calculator: ${SITE_URL}/calculators/loan-calculator`,
    `- EMI Calculator: ${SITE_URL}/calculators/emi-calculator`,
    `- BMI Calculator: ${SITE_URL}/calculators/bmi-calculator`,
    `- SIP Calculator: ${SITE_URL}/calculators/sip-calculator`,
    `- Age Calculator: ${SITE_URL}/calculators/age-calculator`,
    `- GST Calculator: ${SITE_URL}/calculators/gst-calculator`,
    `- Mortgage Calculator: ${SITE_URL}/calculators/mortgage-calculator`,
    `- Compound Interest Calculator: ${SITE_URL}/calculators/compound-interest-calculator`,
    `- Percentage Calculator: ${SITE_URL}/calculators/percentage-calculator`,
    `- Salary Calculator: ${SITE_URL}/calculators/salary-calculator`,
    `- Scientific Calculator: ${SITE_URL}/calculators/scientific-calculator`,
    "",
    "## See Also",
    `- Summary index: ${SITE_URL}/llms.txt`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- Guides: ${SITE_URL}/guides`,
  )

  const content = lines.join("\n")

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
