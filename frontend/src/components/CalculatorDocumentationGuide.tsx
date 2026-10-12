import React from "react"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Link from "next/link"
import type { CalculatorDef } from "@/lib/calculator-api"
import {
  seoDirectAnswerFor,
  seoIntroFor,
  seoHowToFor,
  seoWorkedExampleFor,
  seoFormulaFor,
  seoFaqFor,
} from "@/lib/seo-helpers"

interface CalculatorDocumentationGuideProps {
  calc: CalculatorDef
  catLabel: string
}

export default function CalculatorDocumentationGuide({
  calc,
  catLabel,
}: CalculatorDocumentationGuideProps) {
  const directAnswer = seoDirectAnswerFor(calc)
  const intro = seoIntroFor(calc)
  const howToSteps = seoHowToFor(calc)
  const workedExample = seoWorkedExampleFor(calc)
  const formulaInfo = seoFormulaFor(calc)
  const faqs = seoFaqFor(calc)

  return (
    <Box
      component="article"
      sx={{
        mt: { xs: 4, md: 6 },
        mb: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          {/* Section Breadcrumbs */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              flexWrap: "wrap",
              mb: 2.5,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            <Link href="/" style={{ color: "#4f46e5", textDecoration: "none", fontWeight: 600 }}>
              TryCalc
            </Link>
            <span>/</span>
            <Link
              href={`/category/${calc.category}`}
              style={{ color: "#4f46e5", textDecoration: "none", fontWeight: 600 }}
            >
              {catLabel}
            </Link>
            <span>/</span>
            <Typography variant="caption" sx={{ color: "#0f172a", fontWeight: 700, fontSize: 13 }}>
              {calc.name} Guide &amp; Formula
            </Typography>
          </Stack>

          {/* Guide Header */}
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 900,
              color: "#0f172a",
              fontSize: { xs: 22, sm: 26, md: 30 },
              letterSpacing: "-0.5px",
              mb: 2,
            }}
          >
            How the {calc.name} Works: Formula, Methodology &amp; Examples
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#475569",
              fontSize: { xs: 15, sm: 16 },
              lineHeight: 1.7,
              mb: 3.5,
              maxWidth: 960,
            }}
          >
            {intro}
          </Typography>

          {/* Direct Answer / Executive Summary Box */}
          <Box
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 3,
              bgcolor: "rgba(79, 70, 229, 0.04)",
              border: "1px solid rgba(79, 70, 229, 0.15)",
              borderLeft: "5px solid #4f46e5",
              mb: 4,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                color: "#4f46e5",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1,
              }}
            >
              Direct Answer &amp; Methodological Summary
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#1e1b4b",
                lineHeight: 1.75,
                fontWeight: 500,
                fontSize: { xs: 14.5, sm: 15.5 },
              }}
            >
              {directAnswer}
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {/* Mathematical Formula Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#f8fafc",
                  height: "100%",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                  Mathematical Formula &amp; Equation Breakdown
                </Typography>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    fontFamily: "monospace",
                    fontSize: 14,
                    color: "#0f172a",
                    fontWeight: 700,
                    mb: 2,
                    overflowX: "auto",
                  }}
                >
                  {formulaInfo.formula}
                </Box>

                <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.7, mb: 2 }}>
                  {formulaInfo.explanation}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Formula Variables &amp; Definitions:
                </Typography>
                <Stack spacing={0.75}>
                  {formulaInfo.variables.map((v, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 1,
                        fontSize: 13,
                        color: "#475569",
                      }}
                    >
                      <strong style={{ color: "#0f172a", fontFamily: "monospace" }}>{v.symbol}:</strong>
                      <span>{v.meaning}</span>
                    </Box>
                  ))}
                </Stack>
                {formulaInfo.source && (
                  <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mt: 1.5, fontSize: 11 }}>
                    Reference: {formulaInfo.source}
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Practical Worked Example Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#f8fafc",
                  height: "100%",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5 }}>
                  Worked Numerical Example ({workedExample.title})
                </Typography>

                <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6, mb: 2 }}>
                  <strong>Scenario:</strong> {workedExample.scenario}
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    mb: 2,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", display: "block", mb: 1 }}>
                    Sample Input Parameters:
                  </Typography>
                  <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                    {workedExample.inputs.map((inp, idx) => (
                      <Stack key={idx} direction="row" sx={{ justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ color: "#64748b" }}>{inp.label}:</span>
                        <strong style={{ color: "#0f172a" }}>{inp.value}</strong>
                      </Stack>
                    ))}
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="caption" sx={{ fontWeight: 800, color: "#166534", display: "block", mb: 1 }}>
                    Computed Outputs:
                  </Typography>
                  <Stack spacing={0.5}>
                    {workedExample.results.map((res, idx) => (
                      <Stack key={idx} direction="row" sx={{ justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ color: "#166534", fontWeight: 600 }}>{res.label}:</span>
                        <strong style={{ color: "#14532d" }}>{res.value}</strong>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>

                <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6, fontSize: 13 }}>
                  {workedExample.explanation}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Step-by-Step Instructions */}
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
              How to Use the {calc.name} (Step by Step)
            </Typography>
            <Grid container spacing={2}>
              {howToSteps.map((step, idx) => (
                <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      border: "1px solid #e2e8f0",
                      bgcolor: "#ffffff",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        bgcolor: "#e0e7ff",
                        color: "#4f46e5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 13,
                        flexShrink: 0,
                        mt: 0.2,
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6 }}>
                      {step}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Frequently Asked Questions */}
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
              Frequently Asked Questions (FAQs)
            </Typography>
            <Stack spacing={2}>
              {faqs.map((faq, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    border: "1px solid #e2e8f0",
                    bgcolor: "#f8fafc",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
                    {faq.q}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.7 }}>
                    {faq.a}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* E-E-A-T Editorial Review & Verification Trust Footnote */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              fontSize: 12,
              color: "#64748b",
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ display: "block", color: "#0f172a", fontWeight: 700 }}>
                ✓ Editorial &amp; Algorithmic Review: TryCalc Mathematics &amp; Systems Team
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Lead Architect: Md. Mainul Islam Imon, B.Sc. CSE. Deterministic formulas verified against ISO, IEEE &amp; industry specifications.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label="Deterministic Engine"
                size="small"
                sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 700, fontSize: 11 }}
              />
              <Chip
                label="Updated 2026"
                size="small"
                sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: 11 }}
              />
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
