"use client"

/**
 * CalculatorRunnerView — the interactive calculator form + result panel + Global Navbar + Breadcrumbs + Related Calculators.
 */
import * as React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { CalculatorDef } from "@/lib/calculator-api"
import { listCalculators, runCalculator, CATEGORY_META } from "@/lib/calculator-api"
import { getCalcIcon } from "@/lib/calc-icons"
import { getIconComponent } from "@/lib/icon-registry"
import JsExecutor from "@/components/JsExecutor"
import GlobalNavbar from "@/components/GlobalNavbar"
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
import CardContent from "@mui/material/CardContent"
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
import Divider from "@mui/material/Divider"

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

export default function CalculatorRunnerView({ calc }: { calc: CalculatorDef }) {
  const router = useRouter()

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const f of calc.fields) {
      init[f.name] = f.default != null ? String(f.default) : ""
    }
    return init
  })
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [jsHtml, setJsHtml] = useState<string | null>(null)
  const [jsTrigger, setJsTrigger] = useState(0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const howToSteps = React.useMemo(() => seoHowToFor(calc), [calc])
  const faqs = React.useMemo(() => seoFaqFor(calc), [calc])
  const seoIntro = React.useMemo(() => seoIntroFor(calc), [calc])
  const seoTitle = React.useMemo(() => seoTitleFor(calc), [calc])

  // Structured data for SEO: SoftwareApplication + FAQPage + HowTo
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
        featureList: calc.fields.map(f => f.label).join(", "),
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
      // First try backend run
      const res = await runCalculator(calc.id, payload)
      if (res.result && Object.keys(res.result).length > 0) {
        if ("js_required" in res.result) {
          // Backend signaled this requires JS execution
          setJsTrigger(prev => prev + 1)
          return
        } else {
          setResult(res.result)
          setBusy(false)
          return
        }
      }
      // Backend can't compute — trigger client-side JS execution
      setJsTrigger(prev => prev + 1)
    } catch {
      // Backend error — try JS execution as fallback
      setJsTrigger(prev => prev + 1)
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

      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 2.5, md: 4 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Breadcrumb Navigation */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: "text.secondary", opacity: 0.6 }} />}
            aria-label="breadcrumb"
            sx={{ mb: 2.5 }}
          >
            <MuiLink
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                textDecoration: "none",
                color: "text.secondary",
                fontSize: 13,
                fontWeight: 600,
                "&:hover": { color: "primary.main" },
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
                color: "text.secondary",
                fontSize: 13,
                fontWeight: 600,
                "&:hover": { color: "primary.main" },
              }}
            >
              {catMeta?.label || calc.category}
            </MuiLink>
            <Typography sx={{ color: "text.primary", fontSize: 13, fontWeight: 700 }}>
              {calc.name}
            </Typography>
          </Breadcrumbs>

          {/* Calculator Header Intro */}
          <Box sx={{ mb: 3.5 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
              <Chip
                label={catMeta?.label || calc.category}
                size="small"
                sx={{
                  bgcolor: `${catMeta?.color || "#6366f1"}22`,
                  color: catMeta?.color || "#6366f1",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                100% Free · No Signup Required · Instant
              </Typography>
            </Stack>

            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.5px" }}>
              {seoTitle.split(" — ")[0]}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, maxWidth: 900 }}>
              {seoIntro}
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {/* Form section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3.5,
                  bgcolor: "background.paper",
                }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {calc.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                    {calc.fields.length} inputs
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {calc.description}
                </Typography>

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
                          <TextField
                            key={f.name}
                            type="date"
                            label={f.label}
                            value={values[f.name] || ""}
                            onChange={(e) =>
                              setValues({ ...values, [f.name]: e.target.value })
                            }
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }}
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
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: 16,
                        boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
                      }}
                    >
                      {busy ? "Calculating..." : "Calculate"}
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
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3.5,
                    bgcolor: "background.paper",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Results
                    </Typography>
                    <Chip label="Ready" size="small" color="success" variant="outlined" sx={{ ml: "auto" }} />
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
                            borderBottom: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {String(key).replaceAll("_", " ")}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: "monospace" }}>
                            {renderValue(val)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : null}
                </Paper>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 3.5,
                    textAlign: "center",
                    opacity: 0.7,
                    bgcolor: "background.paper",
                  }}
                >
                  <CalculateIcon sx={{ fontSize: 56, mb: 1.5, opacity: 0.4, color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Fill in the form and click Calculate
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Instant breakdown and exact results will appear here
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>

          {/* ===== How to Use + FAQ (SEO content under calculator) ===== */}
          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                component="section"
                sx={{ p: 3.5, borderRadius: 3.5, border: "1px solid", borderColor: "divider", height: "100%", bgcolor: "background.paper" }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2.5 }}>
                  <HelpIcon color="primary" />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                    How to Use the {calc.name}
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  {howToSteps.map((s, i) => (
                    <Stack key={i} direction="row" spacing={2}>
                      <Box
                        sx={{
                          width: 28, height: 28, borderRadius: "50%", flexShrink: 0, mt: 0.2,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          bgcolor: "primary.main", color: "primary.contrastText",
                          fontWeight: 700, fontSize: 13,
                        }}
                      >
                        {i + 1}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {s}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                component="section"
                sx={{ p: 3.5, borderRadius: 3.5, border: "1px solid", borderColor: "divider", height: "100%", bgcolor: "background.paper" }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2.5 }}>
                  <HelpIcon color="primary" />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                    Frequently Asked Questions
                  </Typography>
                </Stack>
                {faqs.map((f, i) => (
                  <Accordion key={i} elevation={0} sx={{ bgcolor: "transparent", "&:before": { display: "none" }, mb: 1, border: "1px solid", borderColor: "divider", borderRadius: "12px !important" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: "12px" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{f.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {f.a}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Paper>
            </Grid>
          </Grid>

          {/* ===== Related & Category Calculators ===== */}
          <Box component="section" sx={{ mt: 6 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
              <AutoAwesomeIcon color="primary" />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 800 }}>
                More {catMeta?.label || "Related"} Calculators
              </Typography>
              <Chip
                label="Browse More"
                component={Link}
                href={`/?cat=${calc.category}`}
                clickable
                size="small"
                color="primary"
                variant="outlined"
                sx={{ ml: "auto", fontWeight: 600 }}
              />
            </Stack>
            <Grid container spacing={2.5}>
              <RelatedCalculators calc={calc} onOpen={(c) => router.push(`/calculators/${c.id}`)} />
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  )
}

/* ---------- Related calculators (links to real pages) ---------- */

function RelatedCalculators({ calc, onOpen }: { calc: CalculatorDef; onOpen: (c: CalculatorDef) => void }) {
  const [related, setRelated] = useState<CalculatorDef[]>([])
  const [popular, setPopular] = useState<CalculatorDef[]>([])

  useEffect(() => {
    listCalculators()
      .then((data) => {
        const siblings = (data.categories[calc.category] || [])
          .filter((c) => c.id !== calc.id)
          .slice(0, 6)
        setRelated(siblings)

        // Find popular in other categories
        const otherList: CalculatorDef[] = []
        Object.entries(data.categories).forEach(([key, list]) => {
          if (key !== calc.category && list.length > 0) {
            otherList.push(list[0])
          }
        })
        setPopular(otherList.slice(0, 6))
      })
      .catch(() => {})
  }, [calc.id, calc.category])

  return (
    <>
      {related.map((c) => (
        <Grid key={c.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <CalcCard calc={c} onOpen={onOpen} />
        </Grid>
      ))}

      {popular.length > 0 && (
        <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Trending Across Other Categories
          </Typography>
          <Grid container spacing={2}>
            {popular.map((c) => (
              <Grid key={c.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <CalcCard calc={c} onOpen={onOpen} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </>
  )
}

/* ---------- Calculator Card ---------- */

function CalcCard({ calc, onOpen }: { calc: CalculatorDef; onOpen: (c: CalculatorDef) => void }) {
  const catMeta = CATEGORY_META[calc.category]
  const IconComp = getIconComponent(getCalcIcon(calc.id))

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          borderColor: catMeta?.color || "primary.main",
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={`/calculators/${calc.id}`}
        sx={{ height: "100%", p: 2, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%", mb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: `${catMeta?.color || "#6366f1"}18`,
              color: catMeta?.color || "#6366f1",
            }}
          >
            <IconComp />
          </Box>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
              {calc.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              {catMeta?.label || calc.category}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          {calc.description}
        </Typography>
      </CardActionArea>
    </Card>
  )
}

/* ---------- Value renderer ---------- */

export function renderValue(val: unknown): string {
  if (val === null || val === undefined) return "—"
  if (Array.isArray(val)) return val.map((v) => renderValue(v)).join(", ")
  if (typeof val === "number") {
    return Number.isInteger(val)
      ? val.toLocaleString()
      : val.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }
  if (typeof val === "object") return JSON.stringify(val)
  return String(val)
}
