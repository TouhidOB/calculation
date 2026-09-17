"use client"

/**
 * CalculatorRunnerView — Enhanced UX calculator form + 3-Step Operation Visual Bar +
 * Fill Example / Reset + Copy Results + 100% Pure Light Theme.
 */
import * as React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import type { CalculatorDef } from "@/lib/calculator-api"
import { listCalculators, runCalculator, CATEGORY_META } from "@/lib/calculator-api"
import JsExecutor from "@/components/JsExecutor"
import GlobalNavbar from "@/components/GlobalNavbar"
import ModernDatePicker from "@/components/ModernDatePicker"
import { seoHowToFor, seoFaqFor, seoIntroFor, seoTitleFor } from "@/lib/seo-helpers"
import DOMPurify from "dompurify"

// MUI components
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import InputAdornment from "@mui/material/InputAdornment"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Alert from "@mui/material/Alert"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import MuiLink from "@mui/material/Link"
import Snackbar from "@mui/material/Snackbar"

// Icons
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CalculateIcon from "@mui/icons-material/Calculate"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import HelpIcon from "@mui/icons-material/Help"
import HomeIcon from "@mui/icons-material/Home"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import FlashOnIcon from "@mui/icons-material/FlashOn"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import PrintIcon from "@mui/icons-material/Print"
import FunctionsIcon from "@mui/icons-material/Functions"

function generateExampleValues(fields: CalculatorDef["fields"]): Record<string, string> {
  const ex: Record<string, string> = {}
  for (const f of fields) {
    const name = f.name.toLowerCase()
    const label = (f.label || "").toLowerCase()

    if (f.type === "select") {
      ex[f.name] = f.options && f.options.length > 0 ? String(f.options[0].value) : ""
    } else if (f.type === "date") {
      if (name.includes("dob") || name.includes("birth") || label.includes("birth")) {
        ex[f.name] = "1998-05-15"
      } else if (name.includes("start") || name.includes("older") || name.includes("date1") || name.includes("lmp")) {
        ex[f.name] = "2024-01-15"
      } else if (name.includes("end") || name.includes("newer") || name.includes("date2") || name.includes("target")) {
        ex[f.name] = "2026-09-17"
      } else {
        ex[f.name] = "2024-06-01"
      }
    } else {
      if (f.default != null && f.default !== "") {
        ex[f.name] = String(f.default)
      } else if (name.includes("price") || name.includes("loan") || name.includes("amount") || name.includes("principal")) {
        ex[f.name] = "50000"
      } else if (name.includes("rate") || name.includes("interest") || name.includes("percent") || name.includes("tax")) {
        ex[f.name] = "6.5"
      } else if (name.includes("term") || name.includes("year") || name.includes("period") || name.includes("tenure")) {
        ex[f.name] = "15"
      } else if (name.includes("month")) {
        ex[f.name] = "12"
      } else if (name.includes("age")) {
        ex[f.name] = "28"
      } else if (name.includes("height")) {
        ex[f.name] = "175"
      } else if (name.includes("weight")) {
        ex[f.name] = "70"
      } else if (name.includes("income") || name.includes("salary")) {
        ex[f.name] = "65000"
      } else if (name.includes("down")) {
        ex[f.name] = "10000"
      } else if (f.type === "number") {
        ex[f.name] = "100"
      } else {
        ex[f.name] = "Sample"
      }
    }
  }
  return ex
}

export default function CalculatorRunnerView({ calc }: { calc: CalculatorDef }) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    const todayStr = new Date().toISOString().split("T")[0]
    for (const f of calc.fields) {
      if (f.default != null && f.default !== "") {
        init[f.name] = String(f.default)
      } else if (f.type === "date") {
        init[f.name] = todayStr
      } else {
        init[f.name] = ""
      }
    }
    return init
  })
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [jsHtml, setJsHtml] = useState<string | null>(null)
  const [jsTrigger, setJsTrigger] = useState(0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [copyToast, setCopyToast] = useState(false)
  const [relatedCalcs, setRelatedCalcs] = useState<{ id: string; name: string; description: string }[]>([])

  useEffect(() => {
    listCalculators()
      .then((data) => {
        const list = data.categories[calc.category] || []
        setRelatedCalcs(list.filter((c) => c.id !== calc.id))
      })
      .catch(() => {})
  }, [calc.id, calc.category])

  const howToSteps = React.useMemo(() => seoHowToFor(calc), [calc])
  const faqs = React.useMemo(() => seoFaqFor(calc), [calc])
  const seoIntro = React.useMemo(() => seoIntroFor(calc), [calc])
  const seoTitle = React.useMemo(() => seoTitleFor(calc), [calc])

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: calc.name,
        description: calc.description,
        applicationCategory: "CalculatorApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        featureList: calc.fields.map((f) => f.label).join(", "),
      },
      {
        "@type": "HowTo",
        name: `How to use the ${calc.name}`,
        step: howToSteps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text: s,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  }

  const handleFillExample = () => {
    const ex = generateExampleValues(calc.fields)
    setValues(ex)
  }

  const handleReset = () => {
    const init: Record<string, string> = {}
    const todayStr = new Date().toISOString().split("T")[0]
    for (const f of calc.fields) {
      if (f.default != null && f.default !== "") {
        init[f.name] = String(f.default)
      } else if (f.type === "date") {
        init[f.name] = todayStr
      } else {
        init[f.name] = ""
      }
    }
    setValues(init)
    setResult(null)
    setJsHtml(null)
    setErr(null)
  }

  const handleCopyResult = () => {
    let textToCopy = `${calc.name} Results:\n`
    if (result) {
      for (const [k, v] of Object.entries(result)) {
        textToCopy += `${String(k).replaceAll("_", " ")}: ${String(v)}\n`
      }
    } else if (jsHtml) {
      const tmp = document.createElement("div")
      tmp.innerHTML = jsHtml
      textToCopy += tmp.textContent || tmp.innerText || ""
    }
    textToCopy += `\nCalculated on TryCalc.net`
    navigator.clipboard.writeText(textToCopy)
    setCopyToast(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    setResult(null)
    setJsHtml(null)
    try {
      const payload: Record<string, string | number> = {}
      for (const f of calc.fields) {
        const v = values[f.name]
        payload[f.name] = f.type === "number" && v !== "" ? Number(v) : v
      }
      const res = await runCalculator(calc.id, payload)
      if (res.result && Object.keys(res.result).length > 0) {
        if ("js_required" in res.result || (typeof res.result.note === "string" && res.result.note.includes("client-side"))) {
          setJsTrigger((prev) => prev + 1)
          return
        } else {
          setResult(res.result)
          setBusy(false)
          return
        }
      }
      setJsTrigger((prev) => prev + 1)
    } catch {
      setJsTrigger((prev) => prev + 1)
    }
  }

  const handleJsResult = (sandboxResult: { html: string; text: string }) => {
    setJsHtml(sandboxResult.html)
    setBusy(false)
  }

  const handleJsError = (error: string) => {
    setErr(`Calculation failed: ${error}`)
    setBusy(false)
  }

  const catMeta = CATEGORY_META[calc.category]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Global Universal Header */}
      <GlobalNavbar currentCategory={calc.category} currentCalcId={calc.id} />

      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: { xs: 2.5, md: 4 } }}>
        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: "#94a3b8" }} />}
            sx={{ mb: 2.5 }}
          >
            <MuiLink
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                textDecoration: "none",
                color: "#64748b",
                fontSize: 13,
                fontWeight: 600,
                "&:hover": { color: "#4f46e5" },
              }}
            >
              <HomeIcon sx={{ fontSize: 16 }} />
              Home
            </MuiLink>
            <MuiLink
              component={Link}
              href={`/?cat=${calc.category}`}
              sx={{
                textDecoration: "none",
                color: "#64748b",
                fontSize: 13,
                fontWeight: 600,
                "&:hover": { color: "#4f46e5" },
              }}
            >
              {catMeta?.label || calc.category}
            </MuiLink>
            <Typography sx={{ color: "#0f172a", fontSize: 13, fontWeight: 700 }}>
              {calc.name}
            </Typography>
          </Breadcrumbs>

          {/* Calculator Header Intro */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
              <Chip
                label={catMeta?.label || calc.category}
                size="small"
                sx={{
                  bgcolor: `${catMeta?.color || "#4f46e5"}18`,
                  color: catMeta?.color || "#4f46e5",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              />
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                ⚡ 100% Free · No Signup Required · Instant Breakdown
              </Typography>
            </Stack>

            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.5px", color: "#0f172a" }}>
              {seoTitle.split(" — ")[0]}
            </Typography>

            {/* Direct Answer / Formula Capsule for GEO/AEO & Quick Read */}
            <Box
              sx={{
                p: 2,
                mb: 1.5,
                bgcolor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 2.5,
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  bgcolor: "#16a34a",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  mt: 0.2,
                }}
              >
                <FunctionsIcon sx={{ fontSize: 16 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#166534", mb: 0.2 }}>
                  Direct Calculation Overview &amp; Formula Guide
                </Typography>
                <Typography variant="body2" sx={{ color: "#14532d", lineHeight: 1.5 }}>
                  The <strong>{calc.name}</strong> evaluates {calc.fields.length} key input variables ({calc.fields.slice(0, 3).map(f => f.label).join(", ")}{calc.fields.length > 3 ? ", and more" : ""}) using industry-standard deterministic algorithms. Fill parameters below to generate complete instant breakdowns, amortizations, and formatted exportable results.
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.6, maxWidth: 900 }}>
              {seoIntro}
            </Typography>
          </Box>

          {/* 3-Step Operation Status Visual Bar */}
          <Box sx={{ mb: 3.5, p: 2, borderRadius: 3.5, bgcolor: "#ffffff", border: "1px solid #e2e8f0" }}>
            <Grid container spacing={2} sx={{ alignItems: "center" }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: "#4f46e5",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)",
                    }}
                  >
                    1
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>
                      Enter Parameters
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: "#64748b" }}>
                      Fill or use ⚡ Fill Example
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: busy ? "#f59e0b" : "#f1f5f9",
                      color: busy ? "#fff" : "#475569",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    2
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: busy ? "#d97706" : "#0f172a" }}>
                      Calculate
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: "#64748b" }}>
                      Milli-second deterministic engine
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: result || jsHtml ? "#10b981" : "#f1f5f9",
                      color: result || jsHtml ? "#fff" : "#475569",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    3
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: result || jsHtml ? "#16a34a" : "#0f172a" }}>
                      Instant Results
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: "#64748b" }}>
                      Live breakdown, copy & print
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={3.5}>
            {/* Form section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  border: "1px solid #e2e8f0",
                  borderRadius: 3.5,
                  bgcolor: "#ffffff",
                }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {calc.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b", ml: "auto", fontWeight: 600 }}>
                    {calc.fields.length} inputs
                  </Typography>
                </Stack>

                {/* Quick actions toolbar */}
                <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<FlashOnIcon sx={{ color: "#f59e0b" }} />}
                    onClick={handleFillExample}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: 12.5,
                      color: "#0f172a",
                      borderColor: "#e2e8f0",
                      bgcolor: "#f8fafc",
                      "&:hover": { bgcolor: "#f1f5f9", borderColor: "#cbd5e1" },
                    }}
                  >
                    ⚡ Fill Example
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<RestartAltIcon />}
                    onClick={handleReset}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: 12.5,
                      color: "#64748b",
                      "&:hover": { bgcolor: "#f8fafc", color: "#0f172a" },
                    }}
                  >
                    ↺ Reset
                  </Button>
                </Stack>

                <form onSubmit={submit}>
                  <Stack spacing={2.5}>
                    {calc.fields.map((f) => {
                      if (f.type === "select") {
                        return (
                          <FormControl key={f.name} fullWidth size="medium">
                            <InputLabel>{f.label}</InputLabel>
                            <Select
                              value={values[f.name]}
                              label={f.label}
                              onChange={(e) =>
                                setValues({ ...values, [f.name]: e.target.value })
                              }
                            >
                              {(f.options || []).map((o) => (
                                <MenuItem key={o.value} value={o.value}>
                                  {o.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )
                      }
                      if (f.type === "date") {
                        return (
                          <ModernDatePicker
                            key={f.name}
                            label={f.label}
                            value={values[f.name]}
                            onChange={(val) => setValues({ ...values, [f.name]: val })}
                            helperText={f.help || undefined}
                          />
                        )
                      }
                      return (
                        <TextField
                          key={f.name}
                          type={f.type === "number" ? "number" : "text"}
                          label={f.label}
                          value={values[f.name] ?? ""}
                          onChange={(e) =>
                            setValues({ ...values, [f.name]: e.target.value })
                          }
                          fullWidth
                          slotProps={{
                            input: {
                              endAdornment: f.unit ? (
                                <InputAdornment position="end">{f.unit}</InputAdornment>
                              ) : null,
                            },
                          }}
                          helperText={f.help || undefined}
                        />
                      )
                    })}

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={busy}
                      startIcon={<PlayArrowIcon />}
                      sx={{
                        py: 1.6,
                        borderRadius: 3,
                        fontWeight: 800,
                        textTransform: "none",
                        fontSize: 16,
                        bgcolor: "#4f46e5",
                        "&:hover": { bgcolor: "#4338ca" },
                        boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                      }}
                    >
                      {busy ? "Calculating..." : "⚡ Calculate"}
                    </Button>
                  </Stack>
                </form>
              </Paper>
            </Grid>

            {/* Results section */}
            <Grid size={{ xs: 12, md: 6 }}>
              {/* Hidden JS sandboxed executor */}
              <JsExecutor
                calcId={calc.id}
                fields={calc.fields.map((f) => ({
                  name: f.name,
                  type: f.type,
                  value: values[f.name] || (f.default ?? ""),
                }))}
                onResult={handleJsResult}
                onError={handleJsError}
                trigger={jsTrigger}
              />

              {err ? (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {err}
                </Alert>
              ) : null}

              {result || jsHtml ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3.5 },
                    border: "1px solid #e2e8f0",
                    borderRadius: 3.5,
                    bgcolor: "#ffffff",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2.5 }}>
                    <CheckCircleIcon sx={{ color: "#10b981" }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      Results
                    </Typography>
                    <Chip label="Ready" size="small" sx={{ ml: "auto", bgcolor: "#ecfdf5", color: "#059669", fontWeight: 700, border: "1px solid #a7f3d0" }} />
                  </Stack>

                  {/* Render JS runner HTML output with DOMPurify sanitization */}
                  {jsHtml ? (
                    <Box
                      component="div"
                      dangerouslySetInnerHTML={{
                        __html: typeof window !== "undefined" ? DOMPurify.sanitize(jsHtml) : jsHtml,
                      }}
                    />
                  ) : result ? (
                    <Stack spacing={2}>
                      {Object.entries(result).map(([key, val]) => (
                        <Box
                          key={key}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: 2,
                            pb: 1.5,
                            borderBottom: "1px solid #f1f5f9",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "#475569", textTransform: "capitalize", fontWeight: 600 }}
                          >
                            {String(key).replaceAll("_", " ")}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", fontFamily: "monospace" }}>
                            {String(val)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : null}

                  {/* Result Actions */}
                  <Stack direction="row" spacing={1.5} sx={{ mt: 3, pt: 2, borderTop: "1px solid #e2e8f0" }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopyResult}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: 13,
                        bgcolor: "#4f46e5",
                        "&:hover": { bgcolor: "#4338ca" },
                      }}
                    >
                      Copy Results
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PrintIcon />}
                      onClick={() => typeof window !== "undefined" && window.print()}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#475569",
                        borderColor: "#e2e8f0",
                        "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
                      }}
                    >
                      Print
                    </Button>
                  </Stack>
                </Paper>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    border: "1px dashed #cbd5e1",
                    borderRadius: 3.5,
                    textAlign: "center",
                    bgcolor: "#ffffff",
                  }}
                >
                  <CalculateIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                    Ready to Calculate
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", maxWidth: 360, mx: "auto" }}>
                    Fill the form on the left or click <strong>⚡ Fill Example</strong> to see instant results.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>

          {/* How-To & FAQ Sections */}
          <Box sx={{ mt: 5 }}>
            <Grid container spacing={3.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: 3.5,
                    border: "1px solid #e2e8f0",
                    bgcolor: "#ffffff",
                    height: "100%",
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "10px",
                        bgcolor: "#eff6ff",
                        color: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AutoAwesomeIcon fontSize="small" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      How to Use This Calculator
                    </Typography>
                  </Stack>
                  <Stack spacing={2}>
                    {howToSteps.map((step, idx) => (
                      <Stack key={idx} direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: "#f1f5f9",
                            color: "#4f46e5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 800,
                            flexShrink: 0,
                            mt: 0.2,
                          }}
                        >
                          {idx + 1}
                        </Box>
                        <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                          {step}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: 3.5,
                    border: "1px solid #e2e8f0",
                    bgcolor: "#ffffff",
                    height: "100%",
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "10px",
                        bgcolor: "#fef3c7",
                        color: "#d97706",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <HelpIcon fontSize="small" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      Frequently Asked Questions
                    </Typography>
                  </Stack>
                  <Stack spacing={1.5}>
                    {faqs.map((faq, idx) => (
                      <Accordion
                        key={idx}
                        disableGutters
                        elevation={0}
                        sx={{
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px !important",
                          "&:before": { display: "none" },
                          bgcolor: "#f8fafc",
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#64748b" }} />}>
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                            {faq.q}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                          <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                            {faq.a}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Related / Category Calculators Internal Linking */}
          {relatedCalcs.length > 0 && (
            <Box sx={{ mt: 5, mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    Related {catMeta?.label || calc.category} Calculators
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Explore other free online tools in the same category
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  href={`/?cat=${calc.category}`}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    color: "#4f46e5",
                  }}
                >
                  View All
                </Button>
              </Box>

              <Grid container spacing={2}>
                {relatedCalcs.slice(0, 4).map((rel) => (
                  <Grid key={rel.id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        border: "1px solid #e2e8f0",
                        borderRadius: 3,
                        transition: "all 0.15s ease",
                        "&:hover": {
                          borderColor: "#4f46e5",
                          boxShadow: "0 4px 12px rgba(79, 70, 229, 0.08)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <CardActionArea
                        component={Link}
                        href={`/calculators/${rel.id}`}
                        sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a", mb: 0.5 }}>
                          {rel.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#64748b",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {rel.description || "Free instant online calculation tool."}
                        </Typography>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>

      {/* Copy Toast Notification */}
      <Snackbar
        open={copyToast}
        autoHideDuration={2500}
        onClose={() => setCopyToast(false)}
        message="✅ Results copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  )
}
