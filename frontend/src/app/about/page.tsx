import type { Metadata } from "next"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Link from "next/link"
import GlobalNavbar from "@/components/GlobalNavbar"
import CalculatorLogoIcon from "@/components/CalculatorLogoIcon"
import SpeedIcon from "@mui/icons-material/Speed"
import VerifiedIcon from "@mui/icons-material/Verified"
import DevicesIcon from "@mui/icons-material/Devices"
import LockOpenIcon from "@mui/icons-material/LockOpen"

export const metadata: Metadata = {
  title: "About Us & Editorial Methodology — TryCalc.net",
  description:
    "Learn about TryCalc's mission to provide 689+ deterministic, free, fast online calculators. Our editorial standards, mathematical formula verification, and team methodology.",
  alternates: {
    canonical: "https://trycalc.net/about",
  },
}

export default function AboutUsPage() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f8fafc" }}>
      <GlobalNavbar />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            mb: 4,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
            <CalculatorLogoIcon size={36} />
            <Typography variant="overline" sx={{ fontWeight: 800, color: "#4f46e5", letterSpacing: 1 }}>
              About TryCalc.net
            </Typography>
          </Stack>

          <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: "#0f172a", mb: 2, fontSize: { xs: 28, md: 40 } }}>
            The Web&apos;s Fastest, Free Computational Knowledge Engine
          </Typography>

          <Typography variant="h6" sx={{ color: "#475569", fontWeight: 400, lineHeight: 1.6, maxWidth: 900, mb: 3 }}>
            TryCalc was created with a straightforward mission: eliminate clunky, paywalled, ad-choked calculator websites and provide instant, deterministic, and scientifically accurate calculations across 689+ specialized domains.
          </Typography>

          <Divider sx={{ my: 3, borderColor: "#e2e8f0" }} />

          {/* Value Pillars */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, height: "100%", bgcolor: "#f8fafc" }}>
                <CardContent>
                  <SpeedIcon sx={{ color: "#4f46e5", fontSize: 32, mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", mb: 0.5 }}>
                    Zero Latency
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                    Calculations run client-side in the browser or via high-speed edge compute, delivering instant answers in milliseconds.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, height: "100%", bgcolor: "#f8fafc" }}>
                <CardContent>
                  <VerifiedIcon sx={{ color: "#10b981", fontSize: 32, mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", mb: 0.5 }}>
                    Verified Formulas
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                    Every algorithm references peer-reviewed formulas, government agencies (NIST, Federal Reserve, WHO), and standard physics.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, height: "100%", bgcolor: "#f8fafc" }}>
                <CardContent>
                  <LockOpenIcon sx={{ color: "#f59e0b", fontSize: 32, mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", mb: 0.5 }}>
                    100% Free &amp; Private
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                    No login required, no paywalls, and no storing of your private financial or physiological calculations on our servers.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, height: "100%", bgcolor: "#f8fafc" }}>
                <CardContent>
                  <DevicesIcon sx={{ color: "#0284c7", fontSize: 32, mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", mb: 0.5 }}>
                    Universal Mobile UX
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                    Fully responsive layout engineered with Material UI, progressive web app (PWA) support, and printable export summaries.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* E-E-A-T & Editorial Standards */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
            Our Editorial Standards &amp; Calculation Methodology (E-E-A-T)
          </Typography>

          <Stack spacing={3} sx={{ color: "#334155", lineHeight: 1.8 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
                1. Rigorous Formula Verification
              </Typography>
              <Typography variant="body1">
                Unlike general AI text generators that frequently fabricate mathematical equations or hallucinate numerical arithmetic, every calculator on TryCalc uses strictly deterministic, reproducible algorithms written in TypeScript/Python. Formulas are cross-checked against standard mathematical and financial textbooks, IEEE floating point specifications, and authoritative regulatory bodies.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
                2. Tool-First Visual Hierarchy
              </Typography>
              <Typography variant="body1">
                We respect your time. When you land on any TryCalc page, the interactive calculator form and live results visualizer are presented first at the top of the viewport. We believe useful software should do the work first and provide contextual documentation, FAQs, and citations below for those who wish to learn more.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
                3. Open &amp; Embeddable Ecosystem
              </Typography>
              <Typography variant="body1">
                We provide free iframe embed widgets across our entire catalog, enabling educators, journalists, bloggers, and real estate professionals to seamlessly integrate accurate calculators into their websites with zero licensing fees.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
                4. Continuous Maintenance &amp; Bug Bounty
              </Typography>
              <Typography variant="body1">
                Financial rules, tax brackets, and physiological metrics evolve. Our engineering team continuously reviews and patches algorithms. If you spot an edge case or have a suggestion, reach out directly through our <Link href="/contact" style={{ color: "#4f46e5", fontWeight: 700 }}>Contact Portal</Link>.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
