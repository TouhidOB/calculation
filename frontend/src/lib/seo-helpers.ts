/**
 * Shared SEO content helpers — used by both the home page and
 * the per-calculator detail pages (server + client components).
 */
import type { CalculatorDef } from "@/lib/calculator-api"
import { CATEGORY_META } from "@/lib/calculator-api"

export function seoTitleFor(calc: CalculatorDef): string {
  const cat = CATEGORY_META[calc.category]?.label || calc.category
  return `${calc.name} — Free Online ${cat.replace(" Calculators", " Calculator")} | CalcHub`
}

export function seoIntroFor(calc: CalculatorDef): string {
  const cat = CATEGORY_META[calc.category]?.label || "general"
  const fname = calc.name.toLowerCase()
  const fieldList = calc.fields.slice(0, 4).map(f => f.label.toLowerCase()).join(", ")

  const intros: Record<string, string> = {
    finance: `Use this free online ${fname} to get instant, accurate results for your financial planning. Enter ${fieldList} and get detailed breakdowns with charts-ready numbers — ideal for loans, savings, investments, and budgeting decisions.`,
    health: `Calculate your ${fname.replace(" calculator", "")} results instantly with this free online health tool. Enter ${fieldList} for a personalized health assessment used by fitness enthusiasts and healthcare screening.`,
    construction: `Estimate materials, costs, and quantities with this free online ${fname}. Enter ${fieldList} to plan your construction project accurately — concrete, paint, tiles, gravel, and more.`,
    conversion: `Convert instantly with this free online ${fname}. Enter your value in ${fieldList} and get precise conversions — length, weight, temperature, area, volume, data, and currency units.`,
    date_time: `Find exact dates and durations with this free online ${fname}. Enter ${fieldList} to calculate ages, date differences, working days, and countdowns in seconds.`,
    real_estate: `Plan property decisions with this free online ${fname}. Enter ${fieldList} to estimate mortgage payments, affordability, rental yield, and closing costs.`,
    basic: `Solve everyday math instantly with this free online ${fname}. Enter ${fieldList} for percentage, discount, tip, and ratio results you can trust.`,
    education: `Compute grades and academic scores with this free online ${fname}. Enter ${fieldList} to get GPA, percentages, test scores, and grade point averages.`,
    math: `Solve math problems step-by-step with this free online ${fname}. Enter ${fieldList} for fractions, statistics, algebra, and geometry answers.`,
    garments: `Calculate textile and apparel metrics with this free online ${fname}. Enter ${fieldList} for fabric consumption, costing, and production planning.`,
    event_budget: `Budget your events perfectly with this free online ${fname}. Enter ${fieldList} to estimate costs, split expenses, and track spending.`,
    business_investment: `Project returns and business metrics with this free online ${fname}. Enter ${fieldList} for ROI, growth, margin, and investment analysis.`,
    science: `Compute scientific values with this free online ${fname}. Enter ${fieldList} for physics, chemistry, and engineering calculations.`,
    misc: `Get quick answers with this free online ${fname}. Enter ${fieldList} for instant, accurate results.`,
    other: `Get quick answers with this free online ${fname}. Enter ${fieldList} for instant, accurate results.`,
  }
  return intros[calc.category] || intros.misc
}

export function seoHowToFor(calc: CalculatorDef): string[] {
  const fields = calc.fields.slice(0, 3)
  const steps: string[] = []
  steps.push(`Open the ${calc.name} — all inputs are clearly labeled with units.`)
  fields.forEach((f, i) => {
    const unit = f.unit ? ` (in ${f.unit})` : ""
    steps.push(`Enter your ${f.label.toLowerCase()}${unit} — step ${i + 1} of ${fields.length}.`)
  })
  steps.push("Click the Calculate button — your result appears instantly on the right panel.")
  steps.push("Adjust any input and recalculate as many times as you need — it's 100% free, no signup required.")
  return steps
}

export function seoFaqFor(calc: CalculatorDef): { q: string; a: string }[] {
  const cat = CATEGORY_META[calc.category]?.label || "General"
  return [
    {
      q: `Is the ${calc.name} free to use?`,
      a: `Yes — the ${calc.name} on CalcHub is completely free with unlimited calculations, no registration, and no ads interrupting your work.`,
    },
    {
      q: `How accurate is the ${calc.name}?`,
      a: `The ${calc.name} uses standard formulas widely accepted in ${cat.toLowerCase()} and updates results in real time as you type. Results are estimates for planning purposes.`,
    },
    {
      q: `Can I use the ${calc.name} on mobile?`,
      a: `Absolutely — CalcHub calculators are fully responsive and work on phones, tablets, and desktops with the same speed and accuracy.`,
    },
  ]
}
