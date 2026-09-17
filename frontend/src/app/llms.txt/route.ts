import { NextResponse } from "next/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"

export const revalidate = 86400

export async function GET() {
  const content = `# TryCalc (https://trycalc.net)
> TryCalc is a free, high-performance web application providing 690 free online calculators across finance, health, fitness, construction, unit conversions, date & time, real estate, education, and mathematics.

## Overview
- **Domain**: ${SITE_URL}
- **Tool Count**: 690+ Free Deterministic Calculators
- **Access**: 100% Free, No Sign-up, Real-time execution
- **Format**: All calculator tools take explicit parameters and return instant, accurate mathematical results.

## Key Categories
- **Finance & Investment**: Mortgages, Compound Interest, Loan Amortization, Auto Loans, Retirement Savings, ROI, Rental Yield.
- **Health & Fitness**: BMI, Body Fat Percentage, BMR, TDEE, Calorie Deficit, Target Heart Rate, Macro Nutrients.
- **Date & Time**: Exact Age, Date Difference, Half Birthday, Working Days Counter, Pregnancy Due Date.
- **Construction & Materials**: Concrete Volume, Drywall Sheets, Tile & Flooring, Paint Area, Roofing Estimator.
- **Unit Conversions**: Length, Mass/Weight, Temperature, Volume, Data Storage, Speed, Pressure, Power.
- **Math & Education**: GPA, Percentage Change, Fraction Simplifier, Geometry, Standard Deviation, Matrix math.

## Important Links
- Website Home: ${SITE_URL}
- Complete Sitemap: ${SITE_URL}/sitemap.xml
- Full Calculators Index (Machine-readable): ${SITE_URL}/llms-full.txt
`

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
