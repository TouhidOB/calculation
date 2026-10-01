import type { Metadata } from "next"
import Link from "next/link"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Stack from "@mui/material/Stack"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import GlobalNavbar from "@/components/GlobalNavbar"
import GlobalFooter from "@/components/GlobalFooter"

export const metadata: Metadata = {
  title: "Free Calculator Widgets for Websites & Blogs (2026) | TryCalc",
  description:
    "Embed 675+ free, interactive calculators on your website or blog with zero code. Mobile-ready, high-speed, and customizable HTML iframe widgets with instant results.",
  alternates: {
    canonical: "https://trycalc.net/widgets",
  },
  openGraph: {
    title: "Free Calculator Widgets for Websites & Blogs (2026) | TryCalc",
    description: "Embed free, interactive calculators on your website. 100% free, fast, responsive.",
    url: "https://trycalc.net/widgets",
  },
}

const FEATURED_WIDGETS = [
  {
    id: "mortgage",
    name: "Mortgage & Amortization Widget",
    category: "Finance & Real Estate",
    description: "Ideal for real estate agents, home builders, and mortgage brokers. Computes monthly P&I, total interest, and loan payoffs.",
    slug: "mortgage",
    height: 720,
  },
  {
    id: "bmi",
    name: "BMI & Health Metric Widget",
    category: "Health & Fitness",
    description: "Essential for personal trainers, nutritionists, and wellness blogs. Computes BMI, WHO weight category, and target weight.",
    slug: "bmi",
    height: 680,
  },
  {
    id: "loan-calculator",
    name: "Auto & Personal Loan Widget",
    category: "Finance & Banking",
    description: "Perfect for auto dealerships, peer-to-peer lenders, and personal finance portals. Calculates monthly payments and total payback.",
    slug: "loan-calculator",
    height: 680,
  },
  {
    id: "calorie-calculator",
    name: "Daily Calorie & TDEE Widget",
    category: "Fitness & Nutrition",
    description: "Calculates BMR and total daily energy expenditure based on Mifflin-St Jeor equation across activity levels.",
    slug: "calorie-calculator",
    height: 720,
  },
  {
    id: "concrete",
    name: "Concrete Slab & Footing Volume Widget",
    category: "Construction & DIY",
    description: "Calculates cubic yards, cubic meters, and 60/80lb cement bag counts for contractors, patio builders, and landscapers.",
    slug: "concrete",
    height: 680,
  },
  {
    id: "percentage-calculator",
    name: "Percentage, Discount & Markup Widget",
    category: "Math & Everyday",
    description: "Fast multi-mode percentage solver for eCommerce merchants, teachers, and accounting blogs.",
    slug: "percentage-calculator",
    height: 640,
  },
]

export default function WidgetsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Free Calculator Widgets for Websites (2026)",
    description: "Directory of embeddable HTML iframe calculator widgets for webmasters and bloggers.",
    url: "https://trycalc.net/widgets",
    publisher: {
      "@type": "Organization",
      name: "TryCalc",
      url: "https://trycalc.net",
    },
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f8fafc" }}>
      <GlobalNavbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 }, flex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
          <Chip
            label="FOR WEBMASTERS &amp; BLOGGERS"
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: "0.5px",
              bgcolor: "rgba(79, 70, 229, 0.1)",
              color: "#4f46e5",
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-1px",
              fontSize: { xs: 28, sm: 36, md: 44 },
              mb: 2,
            }}
          >
            Free Embeddable Calculator Widgets
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#475569",
              fontWeight: 400,
              maxWidth: 720,
              mx: "auto",
              lineHeight: 1.6,
              fontSize: { xs: 15, sm: 17 },
            }}
          >
            Engage your readers, lower your bounce rate, and add high-utility interactive tools to your website. 100% free, responsive, and easy to embed with a single line of HTML.
          </Typography>
        </Box>

        {/* Benefits Grid */}
        <Grid container spacing={3} sx={{ mb: { xs: 5, md: 7 } }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#ffffff", height: "100%" }}>
              <Typography variant="h3" sx={{ mb: 1 }}>⚡</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
                Instant &amp; Fast Loading
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                Lightweight sandboxed iframes optimized with zero external bloat. Loads in under 200ms without slowing down your Core Web Vitals.
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#ffffff", height: "100%" }}>
              <Typography variant="h3" sx={{ mb: 1 }}>📱</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
                100% Responsive Design
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                Adapts seamlessly to phones, tablets, and desktop sidebars. Fits neatly into full-width article bodies or narrow 300px sidebars.
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#ffffff", height: "100%" }}>
              <Typography variant="h3" sx={{ mb: 1 }}>🛠️</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
                675+ Tools Available
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                Every single calculator on TryCalc can be embedded! Simply replace the ID in the iframe snippet with any of our 675 calculator slugs.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Featured Widgets Catalog */}
        <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", mb: 3 }}>
          Featured Popular Widgets
        </Typography>

        <Grid container spacing={3.5} sx={{ mb: 6 }}>
          {FEATURED_WIDGETS.map((w) => {
            const iframeCode = `<iframe src="https://trycalc.net/embed/${w.slug}" width="100%" height="${w.height}" frameborder="0" style="border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);" title="${w.name}"></iframe>\n<p style="font-size:12px;color:#64748b;margin-top:6px;text-align:right;">Powered by <a href="https://trycalc.net/calculators/${w.slug}" target="_blank" rel="noopener noreferrer" style="color:#4f46e5;font-weight:600;text-decoration:none;">TryCalc</a></p>`

            return (
              <Grid size={{ xs: 12, md: 6 }} key={w.id}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 3.5,
                    bgcolor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ p: 3, flex: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                      <Chip label={w.category} size="small" sx={{ fontWeight: 700, fontSize: 11, bgcolor: "#f1f5f9", color: "#475569" }} />
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
                      {w.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b", mb: 2.5, lineHeight: 1.6 }}>
                      {w.description}
                    </Typography>

                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.75 }}>
                      HTML EMBED SNIPPET:
                    </Typography>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "#0f172a",
                        color: "#38bdf8",
                        fontFamily: "monospace",
                        fontSize: 12,
                        borderRadius: 2,
                        overflowX: "auto",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        lineHeight: 1.5,
                        mb: 2,
                      }}
                    >
                      {iframeCode}
                    </Box>

                    <Stack direction="row" spacing={1.5} sx={{ mt: "auto", pt: 1 }}>
                      <Link href={`/calculators/${w.slug}`} style={{ textDecoration: "none" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#4f46e5", "&:hover": { textDecoration: "underline" } }}>
                          Preview Full Calculator →
                        </Typography>
                      </Link>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        {/* How to Embed Guide */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3.5, border: "1px solid #cbd5e1", bgcolor: "#ffffff" }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", mb: 2 }}>
            How to Embed Any Calculator on WordPress, Webflow, Shopify, or Custom HTML
          </Typography>
          <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.7, mb: 3 }}>
            Embedding a calculator takes less than 60 seconds. Follow these 3 simple steps:
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                1
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  Find the Calculator Slug
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Browse any of our 675 calculators and copy its URL slug (e.g. <code>mortgage</code>, <code>calorie-calculator</code>, or <code>auto-loan</code>).
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                2
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  Paste the Iframe Code into Your CMS
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  In WordPress, add a <strong>Custom HTML block</strong> and paste the snippet. In Shopify or Webflow, add an <strong>Embed Component</strong>.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                3
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  Publish &amp; Enjoy Live Calculations
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  The widget instantly becomes live and calculates results natively inside your page with zero maintenance required on your end.
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Container>

      <GlobalFooter />
    </Box>
  )
}
