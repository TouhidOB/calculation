"use client"

/**
 * CalculatorRunnerView — the interactive calculator form + result panel.
 * Extracted from page.tsx so /calculators/[calcId] pages can reuse it.
 */
import * as React from "react"
import { useEffect, useState } from "react"
import type { CalculatorDef } from "@/lib/calculator-api"
import { listCalculators, runCalculator, CATEGORY_META } from "@/lib/calculator-api"
import { getCalcIcon } from "@/lib/calc-icons"
import { getIconComponent } from "@/lib/icon-registry"
import JsExecutor from "@/components/JsExecutor"
import { seoHowToFor, seoFaqFor, seoIntroFor, seoTitleFor } from "@/lib/seo-helpers"

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
import Fade from "@mui/material/Fade"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CalculateIcon from "@mui/icons-material/Calculate"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import HelpIcon from "@mui/icons-material/Help"
import { useRouter } from "next/navigation"

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
        // Check if it's a "client-side" note
        const vals = Object.values(res.result)
        const hasRealResult = vals.some(
          (v) => v !== null && v !== undefined &&
            String(v) !== "This calculator runs client-side" &&
            String(v) !== "JS_CALC"
        )
        if (hasRealResult) {
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
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 0, md: 1 } }}>
        {/* Calculator header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
            {seoTitle.split(" — ")[0]}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {seoIntro}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Form section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
                <Chip
                  label={catMeta?.label || calc.category}
                  size="small"
                  sx={{
                    bgcolor: `${catMeta?.color || "#888"}22`,
                    color: catMeta?.color,
                    fontWeight: 600,
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                  {calc.fields.length} inputs · instant result
                </Typography>
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 0.5 }}>
                {calc.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {calc.description}
              </Typography>

              <form onSubmit={submit}>
                <Stack spacing={2.5}>
                  {calc.fields.map((f) => {
                    if (f.type === "select") {
                      return (
                        <FormControl key={f.name} fullWidth>
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
                    return (
                      <TextField
                        key={f.name}
                        label={f.label}
                        type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                        value={values[f.name]}
                        onChange={(e) =>
                          setValues({ ...values, [f.name]: e.target.value })
                        }
                        placeholder={f.help || ""}
                        helperText={f.help || undefined}
                        slotProps={{
                          input: {
                            endAdornment: f.unit ? (
                              <InputAdornment position="end">{f.unit}</InputAdornment>
                            ) : undefined,
                          },
                          htmlInput: {
                            min: f.min ?? undefined,
                            max: f.max ?? undefined,
                            step: f.step ?? undefined,
                          },
                        }}
                      />
                    )
                  })}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={busy}
                    startIcon={busy ? undefined : <PlayArrowIcon />}
                    sx={{ py: 1.5, fontSize: 16, borderRadius: 10 }}
                  >
                    {busy ? "Calculating…" : "Calculate"}
                  </Button>
                </Stack>
              </form>

              {err && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {err}
                </Alert>
              )}

              {/* JS Executor for client-side calculators */}
              {jsTrigger > 0 && (
                <JsExecutor
                  calcId={calc.id}
                  fields={calc.fields.map(f => ({
                    name: f.name,
                    type: f.type,
                    value: values[f.name]
                  }))}
                  onResult={handleJsResult}
                  onError={handleJsError}
                  trigger={jsTrigger}
                />
              )}
            </Paper>
          </Grid>

          {/* Result section */}
          <Grid size={{ xs: 12, md: 6 }}>
            {(result || jsHtml) ? (
              <Fade in>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: 3,
                    background: (theme) =>
                      theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))"
                        : "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.02))",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
                    <CheckCircleIcon color="primary" />
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                      Your Result
                    </Typography>
                  </Stack>

                  {jsHtml ? (
                    <Box
                      sx={{
                        overflow: 'auto',
                        maxHeight: 400,
                        fontSize: 14,
                        lineHeight: 1.6,
                      }}
                      component="div"
                      dangerouslySetInnerHTML={{ __html: jsHtml }}
                    />
                  ) : result ? (
                    <Stack spacing={1.5}>
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
              </Fade>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 3,
                  textAlign: "center",
                  opacity: 0.6,
                }}
              >
                <CalculateIcon sx={{ fontSize: 48, mb: 1, opacity: 0.4 }} />
                <Typography variant="body1" color="text.secondary">
                  Fill in the form and click Calculate
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Results will appear here instantly
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
              sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
                <HelpIcon color="primary" />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                  How to Use the {calc.name}
                </Typography>
              </Stack>
              <Stack spacing={1.8}>
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
              sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
                <HelpIcon color="primary" />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                  Frequently Asked Questions
                </Typography>
              </Stack>
              {faqs.map((f, i) => (
                <Accordion key={i} elevation={0} sx={{ bgcolor: "transparent", "&:before": { display: "none" }, mb: 0.5, border: "1px solid", borderColor: "divider", borderRadius: "10px !important" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: "10px" }}>
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

        {/* Related calculators */}
        <Box component="section" sx={{ mt: 5 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Related Calculators
          </Typography>
          <Grid container spacing={2}>
            <RelatedCalculators calc={calc} onOpen={(c) => router.push(`/calculators/${c.id}`)} />
          </Grid>
        </Box>
      </Container>
    </>
  )
}

/* ---------- Related calculators (links to real pages) ---------- */

function RelatedCalculators({ calc, onOpen }: { calc: CalculatorDef; onOpen: (c: CalculatorDef) => void }) {
  const [related, setRelated] = useState<CalculatorDef[]>([])
  useEffect(() => {
    listCalculators()
      .then((data) => {
        const siblings = (data.categories[calc.category] || [])
          .filter((c) => c.id !== calc.id)
          .slice(0, 3)
        setRelated(siblings)
      })
      .catch(() => {})
  }, [calc.id])
  return (
    <>
      {related.map((c) => (
        <Grid key={c.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <CalcCard calc={c} onOpen={onOpen} />
        </Grid>
      ))}
    </>
  )
}

/* ---------- Calculator Card ---------- */

function CalcCard({ calc, onOpen }: { calc: CalculatorDef; onOpen: (c: CalculatorDef) => void }) {
  const catMeta = CATEGORY_META[calc.category]
  const IconComp = getIconComponent(getCalcIcon(calc.id))

  return (
    <Card
      sx={{
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": { transform: "translateY(-3px)", boxShadow: 6 },
        borderRadius: 3,
      }}
    >
      <CardActionArea onClick={() => onOpen(calc)} sx={{ height: "100%", p: 0 }}>
        <CardContent sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
          <Box
            sx={{
              width: 42, height: 42, borderRadius: 2, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              bgcolor: `${catMeta?.color || "#888"}18`,
              color: catMeta?.color,
            }}
          >
            <IconComp />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, display: "block" }}>
              {calc.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              {catMeta?.label || calc.category}
            </Typography>
          </Box>
        </CardContent>
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
