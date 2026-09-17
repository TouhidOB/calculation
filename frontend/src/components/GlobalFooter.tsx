"use client"

import * as React from "react"
import Link from "next/link"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import Chip from "@mui/material/Chip"
import CalculatorLogoIcon from "@/components/CalculatorLogoIcon"

export default function GlobalFooter() {
  return (
    <Box
      component="footer"
      className="no-print"
      sx={{
        mt: "auto",
        bgcolor: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        pt: { xs: 5, md: 7 },
        pb: { xs: 4, md: 5 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 5 }}>
          {/* Brand & Mission Column */}
          <Grid size={{ xs: 12, md: 4.5 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
              <CalculatorLogoIcon size={30} />
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 900,
                  fontSize: 21,
                  letterSpacing: "-0.5px",
                  color: "#0f172a",
                }}
              >
                TryCalc<span style={{ color: "#4f46e5" }}>.net</span>
              </Typography>
              <Chip
                label="689+ Tools"
                size="small"
                sx={{
                  bgcolor: "rgba(79, 70, 229, 0.08)",
                  color: "#4f46e5",
                  fontWeight: 700,
                  fontSize: 11,
                  height: 22,
                }}
              />
            </Stack>

            <Typography
              variant="body2"
              sx={{
                color: "#475569",
                lineHeight: 1.7,
                mb: 2,
                maxWidth: 420,
              }}
            >
              TryCalc is an independent computational platform offering 689+ deterministic, free online calculators across finance, mortgages, health, fitness, construction, and engineering. Built for speed, clarity, and instant decision-making.
            </Typography>

            <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
              ⚡ 100% Free · No Registration · Instant Results
            </Typography>
          </Grid>

          {/* Popular Categories */}
          <Grid size={{ xs: 6, sm: 4, md: 2.7 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: 12,
                mb: 2,
              }}
            >
              Popular Categories
            </Typography>
            <Stack spacing={1.25}>
              <Link href="/?category=finance" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#475569", "&:hover": { color: "#4f46e5" } }}>
                  Finance &amp; Investment
                </Typography>
              </Link>
              <Link href="/?category=health" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#475569", "&:hover": { color: "#4f46e5" } }}>
                  Health &amp; Fitness
                </Typography>
              </Link>
              <Link href="/?category=construction" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#475569", "&:hover": { color: "#4f46e5" } }}>
                  Construction &amp; Building
                </Typography>
              </Link>
              <Link href="/?category=conversion" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#475569", "&:hover": { color: "#4f46e5" } }}>
                  Unit Conversion
                </Typography>
              </Link>
              <Link href="/?category=basic" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#475569", "&:hover": { color: "#4f46e5" } }}>
                  Math &amp; Statistics
                </Typography>
              </Link>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#4f46e5", fontWeight: 700, mt: 0.5 }}>
                  Browse All 689 Calculators →
                </Typography>
              </Link>
            </Stack>
          </Grid>

          {/* Company & Support */}
          <Grid size={{ xs: 6, sm: 4, md: 2.3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: 12,
                mb: 2,
              }}
            >
              Company
            </Typography>
            <Stack spacing={1.25}>
              <Link href="/about" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#475569", "&:hover": { color: "#4f46e5" } }}>
                  About TryCalc
                </Typography>
              </Link>
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#475569", "&:hover": { color: "#4f46e5" } }}>
                  Contact Us
                </Typography>
              </Link>
            </Stack>
          </Grid>

          {/* Legal & Trust — Google AdSense Compliance */}
          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: 12,
                mb: 2,
              }}
            >
              Legal &amp; Privacy
            </Typography>
            <Stack spacing={1.25}>
              <Link href="/privacy" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#475569", "&:hover": { color: "#4f46e5" } }}>
                  Privacy Policy
                </Typography>
              </Link>
              <Link href="/terms" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#475569", "&:hover": { color: "#4f46e5" } }}>
                  Terms of Service
                </Typography>
              </Link>
              <Link href="/disclaimer" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: "#475569", "&:hover": { color: "#4f46e5" } }}>
                  Disclaimer
                </Typography>
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3.5, borderColor: "#e2e8f0" }} />

        {/* Bottom Bar */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            © {new Date().getFullYear()} TryCalc.net. All rights reserved. Calculations are provided for educational and estimation purposes only.
          </Typography>

          <Stack direction="row" spacing={2.5}>
            <Link href="/privacy" style={{ textDecoration: "none" }}>
              <Typography variant="caption" sx={{ color: "#64748b", "&:hover": { color: "#4f46e5" } }}>
                Privacy
              </Typography>
            </Link>
            <Link href="/terms" style={{ textDecoration: "none" }}>
              <Typography variant="caption" sx={{ color: "#64748b", "&:hover": { color: "#4f46e5" } }}>
                Terms
              </Typography>
            </Link>
            <Link href="/disclaimer" style={{ textDecoration: "none" }}>
              <Typography variant="caption" sx={{ color: "#64748b", "&:hover": { color: "#4f46e5" } }}>
                Disclaimer
              </Typography>
            </Link>
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <Typography variant="caption" sx={{ color: "#64748b", "&:hover": { color: "#4f46e5" } }}>
                Contact
              </Typography>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
