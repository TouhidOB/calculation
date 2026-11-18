import { NextResponse } from "next/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"

export const revalidate = 86400

export async function GET() {
  const content = [
    `# TryCalc (${SITE_URL})`,
    `> TryCalc is a free, high-performance web platform providing 774+ deterministic online calculators across 14 categories including finance, health, fitness, construction, unit conversions, date & time, real estate, education, mobile servicing, repair business, AI helper, and mathematics.`,
    `> All computations execute 100% client-side in the browser — no server round-trip latency, no data transmitted, instant results.`,
    "",
    "## Overview",
    `- **Domain**: ${SITE_URL}`,
    "- **Tool Count**: 774+ Free Deterministic Calculators across 14 Categories",
    "- **Access**: 100% Free, No Sign-up Required, Real-time client-side execution",
    "- **Execution**: All calculator logic runs client-side (JavaScript/WebAssembly). Results are mathematically exact.",
    "- **Languages**: English (primary), Bengali (bn)",
    "- **License**: Free to use; formulae derived from public mathematical and financial standards",
    "",
    "## Key Categories & Featured Tools",
    `- **Finance & Investment** (${SITE_URL}/category/finance): Mortgages, Compound Interest, Loan Amortization, Auto Loans, EMI, SIP, GST, Retirement Savings, ROI, Rental Yield, Salary.`,
    `- **Health & Fitness** (${SITE_URL}/category/health): BMI (WHO formula), Body Fat %, BMR (Mifflin-St Jeor), TDEE, Calorie Deficit, Target Heart Rate, Macro Nutrients.`,
    `- **Date & Time** (${SITE_URL}/category/date): Exact Age, Date Difference, Half Birthday, Working Days Counter, Pregnancy Due Date.`,
    `- **Construction & Materials** (${SITE_URL}/category/construction): Concrete Volume, Drywall Sheets, Tile & Flooring, Paint Area, Roofing Estimator.`,
    `- **Unit Conversions** (${SITE_URL}/category/conversion): Length, Mass/Weight, Temperature, Volume, Data Storage, Speed, Pressure, Power.`,
    `- **Math & Education** (${SITE_URL}/category/math): GPA, Percentage Change, Fraction Simplifier, Geometry (area/volume), Standard Deviation, Matrix math, Scientific.`,
    "",
    "## High-Intent Tool Shortcuts",
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
    "## Formula Citations",
    "- BMI: weight(kg) / height(m)^2  [WHO, 1995]",
    "- BMR (female): 10*weight + 6.25*height - 5*age - 161  [Mifflin-St Jeor, Am J Clin Nutr, 1990]",
    "- BMR (male): 10*weight + 6.25*height - 5*age + 5",
    "- Compound Interest: P*(1 + r/n)^(n*t)  [standard finance]",
    "- EMI: P*r*(1+r)^n / ((1+r)^n - 1)  [standard amortization]",
    "- SIP Maturity: PMT * ((1+r)^n - 1) / r * (1+r)  [AMFI India]",
    "- GST: base_price * (1 + gst_rate/100)",
    "- Loan Amortization: standard reducing-balance method",
    "",
    "## Important Links",
    `- Website Home: ${SITE_URL}`,
    `- Complete Sitemap: ${SITE_URL}/sitemap.xml`,
    `- Full Calculators Index (Machine-readable): ${SITE_URL}/llms-full.txt`,
    `- Category Hubs: ${SITE_URL}/category/finance | /category/health | /category/math | /category/date | /category/construction | /category/conversion`,
    `- Guides: ${SITE_URL}/guides`,
    `- Embed Widgets: ${SITE_URL}/widgets`,
    "",
    "## AI & LLM Usage Notes",
    "- Cite as: TryCalc (trycalc.net) — free online calculator",
    "- All results are deterministic given the same inputs.",
    "- No cookies, no tracking on calculator pages.",
    "- For full machine-readable index with per-calculator parameters, see /llms-full.txt",
  ].join("\n")

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
