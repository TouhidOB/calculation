import { NextResponse } from "next/server"
import fallbackData from "@/lib/calculators-fallback.json"
import { CATEGORY_META, type CalculatorDef } from "@/lib/calculator-api"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"

export const revalidate = 86400

export async function GET() {
  const categories = fallbackData.categories as Record<string, CalculatorDef[]>

  let lines: string[] = [
    `# TryCalc Complete Tool Catalog (https://trycalc.net)`,
    `> Comprehensive machine-readable directory of 674 deterministic calculators across 10 categories.`,
    `> Built for AI agents, LLMs, researchers, and automated assistants. Instant free calculations with zero registration.`,
    "",
    `## Table of Contents`,
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

      lines.push(`### [${calc.name}](${url})`)
      lines.push(`- **URL**: ${url}`)
      lines.push(`- **Description**: ${desc}`)
      if (paramList) {
        lines.push(`- **Parameters**: ${paramList}`)
      }
      lines.push("")
    }

    lines.push("---", "")
  }

  const content = lines.join("\n")

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
