"use client"

/**
 * CalculatorRunnerView — Enhanced UX calculator form + 3-Step Operation Visual Bar +
 * Fill Example / Reset + Copy Results + 100% Pure Light Theme.
 */
import * as React from "react"
import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import type { CalculatorDef } from "@/lib/calculator-api"
import { listCalculators, runCalculator, CATEGORY_META } from "@/lib/calculator-api"
import JsExecutor from "@/components/JsExecutor"
import GlobalNavbar from "@/components/GlobalNavbar"
import ModernDatePicker from "@/components/ModernDatePicker"
import { seoHowToFor, seoFaqFor, seoIntroFor, seoFormulaFor } from "@/lib/seo-helpers"
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
import Skeleton from "@mui/material/Skeleton"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import Divider from "@mui/material/Divider"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"

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
import ShareIcon from "@mui/icons-material/Share"
import HistoryIcon from "@mui/icons-material/History"
import DeleteIcon from "@mui/icons-material/Delete"
import CloseIcon from "@mui/icons-material/Close"
import CodeIcon from "@mui/icons-material/Code"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import PieChartIcon from "@mui/icons-material/PieChart"

interface HistoryEntry {
  id: string
  time: string
  values: Record<string, string>
  summary: string
}

function ResultBreakdownChart({ result }: { result: Record<string, unknown> }) {
  const chartItems = React.useMemo(() => {
    const entries = Object.entries(result)
      .filter(([k, v]) => {
        if (k === "note" || k === "js_required") return false
        const kLower = k.toLowerCase()
        if (kLower.includes("total") || kLower.includes("sum")) return false
        const num = typeof v === "number" ? v : parseFloat(String(v).replace(/[^0-9.-]+/g, ""))
        return !isNaN(num) && num > 0
      })
      .map(([k, v]) => {
        const num = typeof v === "number" ? v : parseFloat(String(v).replace(/[^0-9.-]+/g, ""))
        return { label: k.replaceAll("_", " "), value: num }
      })
    return entries.length >= 2 && entries.length <= 6 ? entries.slice(0, 5) : []
  }, [result])

  if (chartItems.length < 2) return null

  const sum = chartItems.reduce((acc, curr) => acc + curr.value, 0)
  if (sum <= 0) return null

  const colors = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"]
  let accumulatedPercent = 0
  const radius = 38
  const circumference = 2 * Math.PI * radius

  return (
    <Box sx={{ mt: 3, pt: 2.5, borderTop: "1px solid #e2e8f0" }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
        <PieChartIcon sx={{ color: "#4f46e5", fontSize: 20 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
          Visual Breakdown
        </Typography>
      </Stack>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
        <Box sx={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ transform: "rotate(-90deg)" }}>
            {chartItems.map((item, idx) => {
              const percent = item.value / sum
              const strokeDasharray = `${percent * circumference} ${circumference}`
              const strokeDashoffset = -accumulatedPercent * circumference
              accumulatedPercent += percent
              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={colors[idx % colors.length]}
                  strokeWidth="14"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              )
            })}
          </svg>
        </Box>

        <Stack spacing={1} sx={{ flexGrow: 1, minWidth: 160 }}>
          {chartItems.map((item, idx) => {
            const percent = Math.round((item.value / sum) * 100)
            return (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: colors[idx % colors.length], flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569", textTransform: "capitalize" }}>
                    {item.label}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#0f172a", fontFamily: "monospace" }}>
                  {percent}%
                </Typography>
              </Box>
            )
          })}
        </Stack>
      </Box>
    </Box>
  )
}

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

export default function CalculatorRunnerView({
  calc,
  embedded = false,
}: {
  calc: CalculatorDef
  embedded?: boolean
}) {
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
    if (typeof window !== "undefined") {
      try {
        const sp = new URLSearchParams(window.location.search)
        for (const f of calc.fields) {
          const v = sp.get(f.name)
          if (v !== null && v !== "") {
            init[f.name] = v
          }
        }
      } catch {}
    }
    return init
  })
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [jsHtml, setJsHtml] = useState<string | null>(null)
  const [jsTrigger, setJsTrigger] = useState(0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [embedOpen, setEmbedOpen] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem(`trycalc_hist_${calc.id}`)
      return stored ? (JSON.parse(stored) as HistoryEntry[]) : []
    } catch {
      return []
    }
  })
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  })
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

  const saveHistory = React.useCallback(
    (
      inputVals: Record<string, string>,
      resObj: Record<string, unknown> | null,
      htmlStr: string | null
    ) => {
      if (typeof window === "undefined") return
      try {
        let summary = ""
        if (resObj) {
          const valid = Object.entries(resObj).filter(
            ([k]) => k !== "note" && k !== "js_required"
          )
          if (valid.length > 0) {
            summary = `${valid[0][0].replaceAll("_", " ")}: ${String(valid[0][1])}`
            if (valid.length > 1) {
              summary += ` | ${valid[1][0].replaceAll("_", " ")}: ${String(valid[1][1])}`
            }
          }
        } else if (htmlStr) {
          const tmp = document.createElement("div")
          tmp.innerHTML = htmlStr
          const firstLine = (tmp.textContent || tmp.innerText || "").trim().split("\n")[0]
          summary = firstLine ? firstLine.slice(0, 60) : "Calculated"
        }
        if (!summary) summary = "Calculated"

        const newEntry: HistoryEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          time: `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · ${new Date().toLocaleDateString()}`,
          values: { ...inputVals },
          summary,
        }

        setHistory((prev) => {
          const filtered = prev.filter(
            (h) => JSON.stringify(h.values) !== JSON.stringify(inputVals)
          )
          const next = [newEntry, ...filtered].slice(0, 10)
          try {
            localStorage.setItem(`trycalc_hist_${calc.id}`, JSON.stringify(next))
          } catch {}
          return next
        })
      } catch {}
    },
    [calc.id]
  )

  const executeCalculation = React.useCallback(
    async (inputVals: Record<string, string>) => {
      setBusy(true)
      setErr(null)
      setResult(null)
      setJsHtml(null)
      try {
        const payload: Record<string, string | number> = {}
        for (const f of calc.fields) {
          const v = inputVals[f.name]
          payload[f.name] =
            f.type === "number" && v !== "" && v !== undefined ? Number(v) : (v ?? "")
        }
        const res = await runCalculator(calc.id, payload)
        if (res.result && Object.keys(res.result).length > 0) {
          if (
            "js_required" in res.result ||
            (typeof res.result.note === "string" &&
              res.result.note.includes("client-side"))
          ) {
            setJsTrigger((prev) => prev + 1)
            return
          } else {
            setResult(res.result)
            setBusy(false)
            saveHistory(inputVals, res.result, null)
            return
          }
        }
        setJsTrigger((prev) => prev + 1)
      } catch {
        setJsTrigger((prev) => prev + 1)
      }
    },
    [calc.fields, calc.id, saveHistory]
  )

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
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setToast({ open: true, message: "✅ Results copied to clipboard!" })
      })
    }
  }

  const handleShare = () => {
    if (typeof window === "undefined") return
    const sp = new URLSearchParams()
    for (const f of calc.fields) {
      const v = values[f.name]
      if (v !== undefined && v !== null && v !== "") {
        sp.set(f.name, String(v))
      }
    }
    const queryString = sp.toString()
    const shareUrl = `${window.location.origin}${window.location.pathname}${queryString ? `?${queryString}` : ""}`
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setToast({ open: true, message: "🔗 Shareable link with inputs copied to clipboard!" })
        })
        .catch(() => {
          setToast({ open: true, message: "Could not copy link to clipboard." })
        })
    }
  }

  const handleRestoreHistory = (item: HistoryEntry) => {
    setValues(item.values)
    setHistoryOpen(false)
    executeCalculation(item.values)
  }

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(`trycalc_hist_${calc.id}`)
    } catch {}
    setHistory([])
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCalculation(values)
  }

  const handleJsResult = (sandboxResult: { html: string; text: string }) => {
    setJsHtml(sandboxResult.html)
    setBusy(false)
    saveHistory(values, null, sandboxResult.html)
  }

  const handleJsError = (error: string) => {
    setErr(`Calculation failed: ${error}`)
    setBusy(false)
  }

  // Auto-run when opened with shareable URL parameters
  const autoCalculatedRef = React.useRef(false)
  useEffect(() => {
    if (autoCalculatedRef.current || typeof window === "undefined") return
    try {
      const sp = new URLSearchParams(window.location.search)
      let hasParam = false
      for (const f of calc.fields) {
        if (sp.get(f.name)) {
          hasParam = true
          break
        }
      }
      if (hasParam) {
        autoCalculatedRef.current = true
        const timer = setTimeout(() => {
          executeCalculation(values)
        }, 150)
        return () => clearTimeout(timer)
      }
    } catch {}
  }, [calc.fields, executeCalculation, values])

  const catMeta = CATEGORY_META[calc.category]
  const formulaGuide = useMemo(() => seoFormulaFor(calc), [calc])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Global Universal Header */}
      {!embedded && <GlobalNavbar currentCategory={calc.category} currentCalcId={calc.id} />}

      <Box sx={{ minHeight: embedded ? "auto" : "100vh", bgcolor: "#f8fafc", py: embedded ? 1.5 : { xs: 2.5, md: 4 } }}>
        <Container maxWidth="xl" sx={{ px: embedded ? 1.5 : undefined }}>
          {/* Breadcrumbs */}
          {!embedded && (
            <Breadcrumbs
              className="no-print"
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
          )}

          {embedded && (
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2, pb: 1.5, borderBottom: "1px solid #e2e8f0" }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "6px",
                    bgcolor: "#eef2ff",
                    color: "#4f46e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CalculateIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: 16, sm: 18 } }}>
                  {calc.name}
                </Typography>
              </Stack>
              <MuiLink
                href={`https://trycalc.net/calculators/${calc.id}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#4f46e5",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                TryCalc.net ↗
              </MuiLink>
            </Stack>
          )}

          {/* Sleek Tool-First Header */}
          {!embedded && (
            <Box className="no-print" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "-0.5px",
                    color: "#0f172a",
                    fontSize: { xs: 22, sm: 26, md: 30 },
                  }}
                >
                  {calc.name}
                </Typography>
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
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, display: { xs: "none", sm: "inline" } }}>
                  • {calc.fields.length} inputs • 100% Free
                </Typography>
              </Stack>
            </Box>
          )}

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
                {/* Quick actions toolbar */}
                <Stack direction="row" spacing={1} className="no-print" sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}>
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
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ShareIcon sx={{ fontSize: 16 }} />}
                    onClick={handleShare}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: 12.5,
                      color: "#475569",
                      borderColor: "#e2e8f0",
                      bgcolor: "#f8fafc",
                      "&:hover": { bgcolor: "#f1f5f9", borderColor: "#cbd5e1", color: "#0f172a" },
                    }}
                  >
                    Share Link
                  </Button>
                  {!embedded && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CodeIcon sx={{ fontSize: 16 }} />}
                      onClick={() => setEmbedOpen(true)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: 12.5,
                        color: "#475569",
                        borderColor: "#e2e8f0",
                        bgcolor: "#f8fafc",
                        "&:hover": { bgcolor: "#f1f5f9", borderColor: "#cbd5e1", color: "#0f172a" },
                      }}
                    >
                      Embed
                    </Button>
                  )}
                  {history.length > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<HistoryIcon sx={{ fontSize: 16 }} />}
                      onClick={() => setHistoryOpen(true)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: 12.5,
                        color: "#475569",
                        borderColor: "#e2e8f0",
                        bgcolor: "#f8fafc",
                        "&:hover": { bgcolor: "#f1f5f9", borderColor: "#cbd5e1", color: "#0f172a" },
                      }}
                    >
                      History ({history.length})
                    </Button>
                  )}
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
                      className="no-print"
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

              {busy ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3.5 },
                    border: "1px solid #e2e8f0",
                    borderRadius: 3.5,
                    bgcolor: "#ffffff",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 3 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width={120} height={32} />
                    <Skeleton variant="rounded" width={70} height={24} sx={{ ml: "auto", borderRadius: 1 }} />
                  </Stack>

                  <Stack spacing={2.5}>
                    {[1, 2, 3, 4].map((i) => (
                      <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1.5, borderBottom: "1px solid #f1f5f9" }}>
                        <Skeleton variant="text" width="40%" height={24} />
                        <Skeleton variant="text" width="28%" height={28} />
                      </Box>
                    ))}
                  </Stack>

                  <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #e2e8f0", display: "flex", gap: 1.5 }}>
                    <Skeleton variant="rounded" width={130} height={36} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rounded" width={80} height={36} sx={{ borderRadius: 2 }} />
                  </Box>
                </Paper>
              ) : result || jsHtml ? (
                <Paper
                  elevation={0}
                  className="print-card"
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

                  {result && <ResultBreakdownChart result={result} />}

                  {/* Result Actions */}
                  <Stack direction="row" spacing={1.5} className="no-print" sx={{ mt: 3, pt: 2, borderTop: "1px solid #e2e8f0", flexWrap: "wrap", gap: 1 }}>
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
                      startIcon={<ShareIcon />}
                      onClick={handleShare}
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
                      Share Link
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
                      Print Report
                    </Button>
                  </Stack>
                </Paper>
              ) : (
                <Paper
                  elevation={0}
                  className="no-print"
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

          {/* Detailed Overview, Methodology & Guides — Below-the-Fold Content */}
          {!embedded && (
            <Box className="no-print" sx={{ mt: 5 }}>
              {/* Direct Calculation Overview & SEO Intro Card */}
              <Box
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  mb: 3.5,
                  bgcolor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 3.5,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    bgcolor: "#16a34a",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    mt: 0.2,
                  }}
                >
                  <FunctionsIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#166534", mb: 0.5 }}>
                    Calculation Methodology &amp; Direct Overview
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#14532d", lineHeight: 1.6, mb: 1.5 }}>
                    The <strong>{calc.name}</strong> evaluates {calc.fields.length} key input variables ({calc.fields.slice(0, 3).map(f => f.label).join(", ")}{calc.fields.length > 3 ? ", and more" : ""}) using industry-standard deterministic algorithms. Fill parameters above to generate complete instant breakdowns, amortizations, and formatted exportable results.
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6 }}>
                    {seoIntro}
                  </Typography>
                </Box>
              </Box>

              {/* 3-Step Operation Quick Guide */}
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
                          Fill fields or use ⚡ Fill Example
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
                          Deterministic formula engine
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
                          Breakdown, charts, copy &amp; print
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>

              <Grid container spacing={3.5}>
                {/* Mathematical Formula & Methodology Section (Google E-E-A-T) */}
                <Grid size={{ xs: 12 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3.5,
                      borderRadius: 3.5,
                      border: "1px solid #e2e8f0",
                      bgcolor: "#ffffff",
                    }}
                  >
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "10px",
                          bgcolor: "#f0fdf4",
                          color: "#16a34a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MenuBookIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                          Formula &amp; Calculation Methodology
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          Verified standard mathematical models and algorithmic implementation
                        </Typography>
                      </Box>
                    </Stack>

                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 2.5,
                        mb: 2,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "#4f46e5", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, display: "block", mb: 0.5 }}>
                        Formula Representation
                      </Typography>
                      <Typography variant="body1" sx={{ fontFamily: "monospace", fontWeight: 700, color: "#0f172a", wordBreak: "break-word" }}>
                        {formulaGuide.formula}
                      </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.7, mb: 1.5 }}>
                      {formulaGuide.explanation}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                      <strong>Source &amp; Reference:</strong> {formulaGuide.source}. Built for instant client-side execution with continuous unit test validation on TryCalc.
                    </Typography>
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
          )}

          {/* Related / Category Calculators Internal Linking */}
          {relatedCalcs.length > 0 && (
            <Box className="no-print" sx={{ mt: 5, mb: 2 }}>
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

          {/* Embedded Footer Link */}
          {embedded && (
            <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #e2e8f0", textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "#64748b", display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                Powered by{" "}
                <MuiLink
                  href={`https://trycalc.net/calculators/${calc.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "#4f46e5", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                >
                  TryCalc.net
                </MuiLink>{" "}
                — Free Online Calculators
              </Typography>
            </Box>
          )}

          {/* Dedicated print-only report header (strictly placed at bottom, hidden on screen, visible only when printing) */}
          <Box
            className="print-only"
            style={{ display: "none" }}
            sx={{
              "@media print": { display: "block !important" },
              mt: 4,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#000000", mb: 0.5 }}>
              TryCalc.net — {calc.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569", mb: 2 }}>
              Category: {catMeta?.label || calc.category} · Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · URL: https://trycalc.net/calculators/{calc.id}
            </Typography>
            <Box sx={{ p: 2, border: "1px solid #cbd5e1", borderRadius: 2, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: "#0f172a" }}>
                Input Parameters Summary:
              </Typography>
              <Grid container spacing={1}>
                {calc.fields.map((f) => (
                  <Grid key={f.name} size={{ xs: 6 }}>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                      {f.label}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                      {values[f.name] || f.default || "—"} {f.unit || ""}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* History Drawer */}
      <Drawer
        anchor="right"
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        slotProps={{
          backdrop: {
            sx: { bgcolor: "rgba(15, 23, 42, 0.25)", backdropFilter: "blur(2px)" },
          },
        }}
      >
        <Box sx={{ width: { xs: 320, sm: 400 }, p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <HistoryIcon sx={{ color: "#4f46e5", fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: 18 }}>
                Calculation History
              </Typography>
            </Stack>
            <IconButton size="small" onClick={() => setHistoryOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Typography variant="caption" sx={{ color: "#64748b", mb: 2 }}>
            Saved locally in this browser. Click any calculation to restore inputs.
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 0.5 }}>
            {history.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <HistoryIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
                <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                  No calculations saved yet
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Run a calculation to see your history here.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {history.map((item) => (
                  <Card
                    key={item.id}
                    elevation={0}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 2.5,
                      bgcolor: "#ffffff",
                      transition: "all 0.15s ease",
                      "&:hover": { borderColor: "#4f46e5", bgcolor: "#f8fafc" },
                    }}
                  >
                    <CardActionArea onClick={() => handleRestoreHistory(item)} sx={{ p: 2 }}>
                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                          {item.time}
                        </Typography>
                        <Chip
                          label="Restore"
                          size="small"
                          sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: "#eef2ff", color: "#4f46e5" }}
                        />
                      </Stack>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                        {item.summary}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          fontSize: 11,
                        }}
                      >
                        {Object.entries(item.values)
                          .filter(([, v]) => v !== "")
                          .map(([k, v]) => `${calc.fields.find((f) => f.name === k)?.label || k}: ${v}`)
                          .join(" · ")}
                      </Typography>
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>

          {history.length > 0 && (
            <Box sx={{ pt: 2, borderTop: "1px solid #e2e8f0", mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={handleClearHistory}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
              >
                Clear History
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Global Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        message={toast.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      {/* Embed Code Dialog */}
      {!embedded && (
        <Dialog
          open={embedOpen}
          onClose={() => setEmbedOpen(false)}
          maxWidth="sm"
          fullWidth
          slotProps={{
            backdrop: {
              sx: { bgcolor: "rgba(15, 23, 42, 0.35)", backdropFilter: "blur(2px)" },
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, color: "#0f172a", pb: 1 }}>
            Embed This Calculator on Your Website
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: "#475569", mb: 2 }}>
              Copy and paste the HTML code below into your blog, CMS, or website to embed the interactive <strong>{calc.name}</strong> directly on your page.
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: "#0f172a",
                color: "#e2e8f0",
                borderRadius: 2,
                fontFamily: "monospace",
                fontSize: 12.5,
                wordBreak: "break-all",
                userSelect: "all",
                border: "1px solid #334155",
              }}
            >
              {`<iframe src="https://trycalc.net/embed/${calc.id}" width="100%" height="700" frameborder="0" style="border:1px solid #e2e8f0;border-radius:12px;max-width:900px;" title="${calc.name} — TryCalc"></iframe>`}
            </Box>
            <Typography variant="caption" sx={{ color: "#64748b", mt: 1.5, display: "block" }}>
              💡 Responsive design: The widget automatically adapts to desktop, tablet, and mobile layouts.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button
              onClick={() => setEmbedOpen(false)}
              sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<ContentCopyIcon />}
              onClick={() => {
                const code = `<iframe src="https://trycalc.net/embed/${calc.id}" width="100%" height="700" frameborder="0" style="border:1px solid #e2e8f0;border-radius:12px;max-width:900px;" title="${calc.name} — TryCalc"></iframe>`
                navigator.clipboard.writeText(code).then(() => {
                  setToast({ open: true, message: "Embed code copied to clipboard!" })
                  setEmbedOpen(false)
                })
              }}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                bgcolor: "#4f46e5",
                "&:hover": { bgcolor: "#4338ca" },
              }}
            >
              Copy Embed Code
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}
