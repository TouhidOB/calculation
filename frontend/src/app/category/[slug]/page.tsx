import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"

// Icons
import HomeIcon from "@mui/icons-material/Home"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import CalculateIcon from "@mui/icons-material/Calculate"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

import GlobalNavbar from "@/components/GlobalNavbar"
import GlobalFooter from "@/components/GlobalFooter"
import { CATEGORY_META, type CategoryMap, type CalculatorDef } from "@/lib/calculator-api"
import fallbackData from "@/lib/calculators-fallback.json"

const SITE_URL = "https://trycalc.net"
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000"

export const revalidate = 86400 // 1 day cache

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map((slug) => ({ slug }))
}

const CATEGORY_EDITORIAL: Record<
  string,
  {
    tagline: string
    intro: string
    keyFeatures: string[]
    bestFor: string
  }
> = {
  finance: {
    tagline: "Precision Loan, Mortgage & Investment Workstations",
    intro:
      "Engineered for financial analysts, borrowers, and investors. Compute exact monthly amortizations, interest schedules, debt ratios, and multi-asset yields with 64-bit precision and zero subscription paywalls.",
    keyFeatures: [
      "Deterministic amortization and APR calculation algorithms",
      "Dynamic thermal-style audit ledger receipts for instant verification",
      "Full compliance with standard banking financial formulas",
    ],
    bestFor: "Mortgage planning, loan structuring, debt payoffs, and financial modeling",
  },
  business_investment: {
    tagline: "Corporate Valuation, ROI & Capital Growth Calculators",
    intro:
      "Comprehensive tools for startup founders, equity traders, and business managers. Evaluate return on investment, net present value (NPV), break-even thresholds, and inventory turnover instantly.",
    keyFeatures: [
      "Compound growth and internal rate of return (IRR) models",
      "Break-even and unit economics cash flow analytics",
      "Exportable tabular breakdown sheets for business reporting",
    ],
    bestFor: "Venture planning, portfolio analysis, equity valuation, and commercial forecasts",
  },
  health: {
    tagline: "Biometric & Nutritional Precision Instruments",
    intro:
      "Calibrated biometric estimators for clinical and personal health management. Calculate body mass index (BMI), basal metabolic rates (BMR), total daily energy expenditure (TDEE), and macronutrient targets based on peer-reviewed clinical formulas.",
    keyFeatures: [
      "Mifflin-St Jeor and Harris-Benedict thermodynamic equations",
      "Precision calibrated arc gauges with color-coded classification zones",
      "Clear medical context disclaimers adhering to global health standards",
    ],
    bestFor: "Dietary optimization, athletic performance tracking, and body composition analysis",
  },
  construction: {
    tagline: "Architectural & Structural Engineering Estimators",
    intro:
      "Industrial material estimation calculators for civil engineers, site managers, and contractors. Accurately measure concrete volume, rebar reinforcement weights, masonry block counts, and roofing pitches with automated wastage safety buffers.",
    keyFeatures: [
      "Volumetric and mass density conversions (50kg cement bag yields)",
      "Structured engineering Bill of Materials (BOM) specification sheets",
      "Imperial and metric dimensional harmonization",
    ],
    bestFor: "Site logistics, quantity surveying, cost estimation, and structural planning",
  },
  basic: {
    tagline: "Everyday Mathematics, Percentages & Academic Tools",
    intro:
      "Rapid calculation utilities for everyday quantitative problems. From percentage increases and ratio proportions to fractions and standard algebraic functions.",
    keyFeatures: [
      "Zero-latency client-side algorithmic execution",
      "Step-by-step mathematical reasoning and formula guides",
      "High-contrast tactile keypad layout for rapid data entry",
    ],
    bestFor: "Academic homework, retail discounts, markups, and daily mathematics",
  },
  garments: {
    tagline: "RMG, Textile & Apparel Manufacturing Calculators",
    intro:
      "Purpose-built for textile merchandisers, apparel pattern makers, and industrial garment factories. Calculate yarn counts, fabric GSM consumption, sewing thread consumption, and production efficiency rates.",
    keyFeatures: [
      "Direct and indirect yarn numbering system conversions (Ne, Nm, Denier, Tex)",
      "Knitted and woven fabric consumption formulas",
      "Factory standard costing and production SMV calculators",
    ],
    bestFor: "Garment manufacturing, textile merchandising, and factory line balancing",
  },
  conversion: {
    tagline: "Scientific & Universal Unit Conversion Engine",
    intro:
      "Instant multi-unit conversion between metric, imperial, US customary, and SI units across length, area, volume, mass, pressure, speed, temperature, and digital storage.",
    keyFeatures: [
      "High-precision floating-point conversion factors",
      "Comprehensive multi-unit equivalent cross-reference tables",
      "Zero network latency with instant input synchronization",
    ],
    bestFor: "Cross-border engineering, international travel, scientific experiments, and trade",
  },
  date_time: {
    tagline: "Temporal Analytics, Workday & Chronological Tools",
    intro:
      "Compute precise calendar durations, working day timelines, business days between dates, and international time zone offsets.",
    keyFeatures: [
      "Leap year and calendar boundary compensation algorithms",
      "Working business days exclusions (weekends and holidays)",
      "Chronological countdowns and milestone planning",
    ],
    bestFor: "Project management, legal notice deadlines, age verification, and scheduling",
  },
  education: {
    tagline: "Academic GPA, Scoring & Grading Workstations",
    intro:
      "Specialized calculators for students, educators, and university administrators. Compute weighted grade point averages (GPA), cumulative CGPA, test curves, and final exam target scores.",
    keyFeatures: [
      "Standard 4.0, 5.0, and percentage-based collegiate grading systems",
      "Weighted credit-hour semester aggregation",
      "Customizable grade boundary scales",
    ],
    bestFor: "University students, academic advisors, teachers, and high school counseling",
  },
  real_estate: {
    tagline: "Property Investment, Cap Rate & Rental Yield Tools",
    intro:
      "Real estate investment analytics for landlords, property developers, and prospective homeowners. Evaluate capitalization rates (Cap Rate), gross rent multipliers (GRM), cash-on-cash return, and mortgage affordability.",
    keyFeatures: [
      "Net operating income (NOI) and property cash flow projections",
      "Property tax, HOA, and maintenance operational reserve budgeting",
      "Comprehensive buyer and investor yield ledgers",
    ],
    bestFor: "Rental property evaluation, commercial leasing, and residential home purchases",
  },
  event_budget: {
    tagline: "Event Financial Planning & Budget Allocators",
    intro:
      "Structured budgeting tools for weddings, corporate conferences, and private banquets. Estimate per-guest catering costs, venue capacities, beverage quantities, and contingency reserves.",
    keyFeatures: [
      "Per-head itemized expense allocation",
      "Venue seating and banquet space logistics",
      "Visual cost breakdown distribution",
    ],
    bestFor: "Wedding planners, corporate event coordinators, and party organizers",
  },
}

async function getCategoryCalculators(categorySlug: string): Promise<CalculatorDef[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/calculators/`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    })
    if (res.ok) {
      const data = await res.json()
      if (data?.categories?.[categorySlug]) {
        return data.categories[categorySlug].calculators || []
      }
    }
  } catch {}

  const fallbackCats = fallbackData.categories as unknown as Record<string, { calculators: CalculatorDef[] }>
  return fallbackCats[categorySlug]?.calculators || []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const catMeta = CATEGORY_META[slug]
  if (!catMeta) return {}

  const editorial = CATEGORY_EDITORIAL[slug] || {
    tagline: `${catMeta.label} Calculators`,
    intro: `Free online ${catMeta.label.toLowerCase()} calculators with instant verified results.`,
  }

  const title = `${catMeta.label} Calculators — Free Online Precision Tools | TryCalc`
  const description = `${editorial.tagline}. ${editorial.intro.slice(0, 160)}`
  const canonicalUrl = `${SITE_URL}/category/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "TryCalc",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const catMeta = CATEGORY_META[slug]
  if (!catMeta) notFound()

  const calcs = await getCategoryCalculators(slug)
  const editorial = CATEGORY_EDITORIAL[slug] || {
    tagline: `${catMeta.label} Calculators`,
    intro: `Free online ${catMeta.label.toLowerCase()} calculators with instant verified results.`,
    keyFeatures: ["Deterministic calculation algorithms", "High precision 64-bit arithmetic", "100% free with no registration"],
    bestFor: `${catMeta.label} planning and everyday computations`,
  }

  // Schema.org CollectionPage & BreadcrumbList
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: `${catMeta.label} Calculators`, item: `${SITE_URL}/category/${slug}` },
    ],
  }

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${catMeta.label} Calculators — TryCalc`,
    description: editorial.intro,
    url: `${SITE_URL}/category/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "TryCalc",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: catMeta.label,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: calcs.map((c, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${SITE_URL}/calculators/${c.id}`,
        name: c.name,
        description: c.description || `Online ${c.name} calculator on TryCalc.`,
      })),
    },
  }

  const otherCategories = Object.entries(CATEGORY_META).filter(([k]) => k !== slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />

      <GlobalNavbar currentCategory={slug} />

      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: { xs: 3, md: 5 } }}>
        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: "#94a3b8" }} />}
            sx={{ mb: 3 }}
          >
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                color: "#64748b",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Home
            </Link>
            <Typography sx={{ color: "#0f172a", fontSize: 14, fontWeight: 700 }}>
              {catMeta.label}
            </Typography>
          </Breadcrumbs>

          {/* Category Hero Header Banner */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              mb: 4,
              borderRadius: 3.5,
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              color: "#ffffff",
              border: "1px solid #334155",
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  bgcolor: "rgba(56, 189, 248, 0.15)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                }}
              >
                {catMeta.emoji}
              </Box>
              <Box>
                <Typography variant="overline" sx={{ color: "#38bdf8", fontWeight: 800, letterSpacing: 1.5 }}>
                  TRYCALC TOPIC CLUSTER
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#f8fafc", letterSpacing: -0.5 }}>
                  {catMeta.label} Calculators
                </Typography>
              </Box>
            </Stack>

            <Typography variant="subtitle1" sx={{ color: "#94a3b8", mb: 2, fontWeight: 600 }}>
              {editorial.tagline}
            </Typography>

            <Typography variant="body1" sx={{ color: "#cbd5e1", maxWidth: 900, lineHeight: 1.7, mb: 3 }}>
              {editorial.intro}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 1.5 }}>
              <Chip
                icon={<CheckCircleIcon sx={{ color: "#34d399 !important" }} />}
                label={`${calcs.length} Specialized Calculators`}
                sx={{ bgcolor: "rgba(52, 211, 153, 0.15)", color: "#34d399", fontWeight: 700 }}
              />
              <Chip
                label="64-Bit Precision Engine"
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", color: "#e2e8f0", fontWeight: 600 }}
              />
              <Chip
                label="Instant Client-Side Execution"
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", color: "#e2e8f0", fontWeight: 600 }}
              />
              <Chip
                label="Free &amp; No Registration"
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", color: "#e2e8f0", fontWeight: 600 }}
              />
            </Stack>
          </Paper>

          {/* Calculator Grid */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                Available {catMeta.label} Tools ({calcs.length})
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Click any calculator to launch its interactive console
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              {calcs.map((calc) => (
                <Grid key={calc.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid #e2e8f0",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                        borderColor: "#cbd5e1",
                      },
                    }}
                  >
                    <Link
                      href={`/calculators/${calc.id}`}
                      style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
                    >
                      <CardActionArea
                        sx={{ height: "100%", p: 2.5, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between" }}
                      >
                        <Box sx={{ width: "100%" }}>
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                            <CalculateIcon sx={{ fontSize: 20, color: "#4f46e5" }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.3 }}>
                              {calc.name}
                            </Typography>
                          </Stack>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#64748b",
                              lineHeight: 1.5,
                              mb: 2,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {calc.description || `Calculate ${calc.name.toLowerCase()} instantly with calibrated formulas.`}
                          </Typography>
                        </Box>

                        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px solid #f1f5f9" }}>
                          <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                            {calc.fields?.length || 3} parameters
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#4f46e5", fontWeight: 700, display: "flex", alignItems: "center" }}>
                            Open Tool <ArrowForwardIcon sx={{ fontSize: 13, ml: 0.3 }} />
                          </Typography>
                        </Box>
                      </CardActionArea>
                    </Link>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Editorial & Domain Methodology (E-E-A-T) */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 6,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
              Methodology &amp; Standards for {catMeta.label}
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.8, mb: 2.5 }}>
              All tools cataloged within the <strong>{catMeta.label}</strong> cluster are mathematically validated against recognized international industry standards, statutory banking formulas, peer-reviewed clinical guidelines, and standard physical constants. Each tool executes deterministically in real-time, guaranteeing zero tracking of private numeric inputs.
            </Typography>

            <Grid container spacing={2}>
              {editorial.keyFeatures.map((feat, idx) => (
                <Grid key={idx} size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #f1f5f9", height: "100%" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
                      ✓ Standard {idx + 1}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b", lineHeight: 1.5, display: "block" }}>
                      {feat}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Related Category Topic Clusters */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
              Explore Other Topic Clusters
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1 }}>
              {otherCategories.map(([catKey, meta]) => (
                <Link key={catKey} href={`/category/${catKey}`} style={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      borderColor: "#e2e8f0",
                      color: "#334155",
                      bgcolor: "#ffffff",
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "#cbd5e1",
                        bgcolor: "#f1f5f9",
                      },
                    }}
                  >
                    <span style={{ marginRight: 6 }}>{meta.emoji}</span> {meta.label}
                  </Button>
                </Link>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      <GlobalFooter />
    </>
  )
}
