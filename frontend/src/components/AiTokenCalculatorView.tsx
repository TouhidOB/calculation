"use client"

import React, { useState, useMemo } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Slider from "@mui/material/Slider"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import LinearProgress from "@mui/material/LinearProgress"

import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import PrintIcon from "@mui/icons-material/Print"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import FlashOnIcon from "@mui/icons-material/FlashOn"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"

import {
  AI_MODELS,
  PROVIDER_LIST,
  AIProvider,
  tokenizeText,
  calculateMultiModelPricing,
  formatUsd,
} from "@/lib/ai-token-engine"
import { TactileButton } from "@/components/instrument/TactileButton"

const PROMPT_PRESETS = [
  {
    label: "Customer Support Agent",
    prompt:
      "You are a helpful and polite customer support specialist for an e-commerce platform. Assist the user with resolving their order inquiry, explain return policies clearly, and offer constructive next steps.",
  },
  {
    label: "Python Code Refactor",
    prompt:
      "Review the following Python module for performance bottlenecks, algorithmic complexity, and type safety. Refactor it to use modern Python 3.12 idioms, async/await patterns, and comprehensive docstrings.",
  },
  {
    label: "RAG Knowledge Retrieval",
    prompt:
      "Based on the provided corporate policy document snippets below, answer the user's question regarding healthcare benefits and annual leave rollover. Cite specific sections and state if information is missing.",
  },
  {
    label: "Creative Copywriting",
    prompt:
      "Draft three compelling, high-converting social media ad hooks for a revolutionary SaaS productivity tool. Keep the tone witty, urgent, and focused on saving 10+ hours of manual work every week.",
  },
]

// 8 distinct pastel backgrounds for token visualization
const TOKEN_COLORS = [
  { bg: "#ede9fe", color: "#5b21b6", border: "#ddd6fe" }, // violet
  { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" }, // blue
  { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" }, // emerald
  { bg: "#fef9c3", color: "#854d0e", border: "#fef08a" }, // amber
  { bg: "#ffedd5", color: "#9a3412", border: "#fed7aa" }, // orange
  { bg: "#fce7f3", color: "#9d174d", border: "#fbcfe8" }, // pink
  { bg: "#e0e7ff", color: "#3730a3", border: "#c7d2fe" }, // indigo
  { bg: "#ccfbf1", color: "#115e59", border: "#99f6e4" }, // teal
]

interface AiTokenCalculatorViewProps {
  initialPrompt?: string
  initialModel?: string
  initialOutputTokens?: number
  initialRequests?: number
  onToast?: (msg: string) => void
}

export function AiTokenCalculatorView({
  initialPrompt = "You are an expert AI assistant. Please analyze the following data and generate a clear, professional summary with key action items and insights.",
  initialModel = "gpt-4o",
  initialOutputTokens = 500,
  initialRequests = 1,
  onToast,
}: AiTokenCalculatorViewProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [selectedModel, setSelectedModel] = useState(initialModel)
  const [modelFilterProvider, setModelFilterProvider] = useState<AIProvider>("All")
  const [tableFilterProvider, setTableFilterProvider] = useState<AIProvider>("All")
  const [outputTokens, setOutputTokens] = useState(initialOutputTokens)
  const [requestsCount, setRequestsCount] = useState(initialRequests)
  const [showTokensView, setShowTokensView] = useState(true)

  // Filter models for dropdown
  const filteredDropdownModels = useMemo(() => {
    const list = Object.values(AI_MODELS)
    if (modelFilterProvider === "All") return list
    return list.filter((m) => m.provider === modelFilterProvider)
  }, [modelFilterProvider])

  // Handle provider filter click for dropdown
  const handleDropdownProviderChange = (prov: AIProvider) => {
    setModelFilterProvider(prov)
    if (prov !== "All") {
      const providerModels = Object.values(AI_MODELS).filter((m) => m.provider === prov)
      if (providerModels.length > 0 && !providerModels.some((m) => m.id === selectedModel)) {
        setSelectedModel(providerModels[0].id)
      }
    }
  }

  // Live Token Analysis
  const tokenAnalysis = useMemo(() => tokenizeText(prompt), [prompt])

  // Multi-Model Cost Calculation
  const pricing = useMemo(
    () =>
      calculateMultiModelPricing(
        tokenAnalysis.tokens,
        outputTokens,
        requestsCount,
        selectedModel
      ),
    [tokenAnalysis.tokens, outputTokens, requestsCount, selectedModel]
  )

  // Filter models for comparison table
  const filteredComparison = useMemo(() => {
    if (tableFilterProvider === "All") return pricing.comparison
    return pricing.comparison.filter((item) => item.provider === tableFilterProvider)
  }, [pricing.comparison, tableFilterProvider])

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        onToast?.(`📋 ${label} copied to clipboard!`)
      })
    }
  }

  const handleReset = () => {
    setPrompt("")
    setOutputTokens(500)
    setRequestsCount(1)
    onToast?.("🔄 Prompt cleared")
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3.5}>
        {/* Left Form / Prompt Input Column */}
        <Grid size={{ xs: 12, lg: 6 }} className="no-print" sx={{ "@media print": { display: "none !important" } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              border: "1px solid #e2e8f0",
              borderRadius: 3.5,
              bgcolor: "#ffffff",
            }}
          >
            {/* Quick Actions Header */}
            <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<FlashOnIcon sx={{ color: "#8b5cf6" }} />}
                onClick={() => {
                  const randomPreset = PROMPT_PRESETS[Math.floor(Math.random() * PROMPT_PRESETS.length)]
                  setPrompt(randomPreset.prompt)
                  onToast?.(`⚡ Loaded "${randomPreset.label}" preset`)
                }}
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
                Sample Prompt
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={handleReset}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 12.5,
                  color: "#64748b",
                  borderColor: "#e2e8f0",
                  bgcolor: "#ffffff",
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              >
                Clear
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={() => copyToClipboard(prompt, "Prompt text")}
                disabled={!prompt}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 12.5,
                  color: "#64748b",
                  borderColor: "#e2e8f0",
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              >
                Copy
              </Button>
            </Stack>

            {/* Presets Chips */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, display: "block", mb: 1 }}>
                Quick Templates
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {PROMPT_PRESETS.map((p) => (
                  <Chip
                    key={p.label}
                    label={p.label}
                    size="small"
                    clickable
                    onClick={() => {
                      setPrompt(p.prompt)
                      onToast?.(`Loaded "${p.label}"`)
                    }}
                    sx={{
                      borderRadius: 1.5,
                      fontWeight: 600,
                      fontSize: 12,
                      bgcolor: "#f1f5f9",
                      color: "#334155",
                      border: "1px solid #e2e8f0",
                      "&:hover": { bgcolor: "#e2e8f0", color: "#0f172a" },
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Main Prompt Input Area */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  Prompt / Content Textarea
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                  {tokenAnalysis.tokens.toLocaleString()} Tokens · {tokenAnalysis.characters.toLocaleString()} Chars
                </Typography>
              </Stack>
              <TextField
                fullWidth
                multiline
                minRows={5}
                maxRows={14}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type or paste your AI system prompt, user prompt, document text, or code here..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    bgcolor: "#f8fafc",
                    fontFamily: "var(--font-mono, monospace), ui-monospace, Menlo, Consolas, monospace",
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    "&:hover": { bgcolor: "#ffffff" },
                    "&.Mui-focused": { bgcolor: "#ffffff" },
                  },
                }}
              />
            </Box>

            {/* Controls Row */}
            <Stack spacing={2.5}>
              <Box>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#475569" }}>
                    Filter Provider:
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                    {filteredDropdownModels.length} models
                  </Typography>
                </Stack>
                {/* Provider filter chips with flex wrap so all 12 providers are instantly accessible */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.75,
                    mb: 1.5,
                  }}
                >
                  {PROVIDER_LIST.map((prov) => (
                    <Chip
                      key={prov}
                      label={prov}
                      size="small"
                      clickable
                      onClick={() => handleDropdownProviderChange(prov)}
                      variant={modelFilterProvider === prov ? "filled" : "outlined"}
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: "16px",
                        bgcolor: modelFilterProvider === prov ? "#8b5cf6" : "#f8fafc",
                        color: modelFilterProvider === prov ? "#ffffff" : "#475569",
                        borderColor: modelFilterProvider === prov ? "#8b5cf6" : "#e2e8f0",
                        "&:hover": {
                          bgcolor: modelFilterProvider === prov ? "#7c3aed" : "#f1f5f9",
                        },
                      }}
                    />
                  ))}
                </Box>

                <FormControl fullWidth size="medium">
                  <InputLabel sx={{ fontWeight: 700, color: "#475569" }}>Target AI Model</InputLabel>
                  <Select
                    value={selectedModel}
                    label="Target AI Model"
                    onChange={(e) => setSelectedModel(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    {filteredDropdownModels.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        <Stack direction="row" spacing={1.5} sx={{ width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <Chip
                              size="small"
                              label={m.provider}
                              sx={{
                                height: 18,
                                fontSize: 10,
                                fontWeight: 800,
                                bgcolor: `${m.providerColor}15`,
                                color: m.providerColor,
                              }}
                            />
                            <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>
                              {m.name}
                            </Typography>
                          </Stack>
                          <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                            ${m.inputPerM.toFixed(2)} / ${m.outputPerM.toFixed(2)} per 1M
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Output Tokens Slider */}
              <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2.5, border: "1px solid #e2e8f0" }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    Expected Completion Tokens:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#8b5cf6" }}>
                    {outputTokens.toLocaleString()} tokens
                  </Typography>
                </Stack>
                <Slider
                  value={outputTokens}
                  min={0}
                  max={8192}
                  step={50}
                  onChange={(_, val) => setOutputTokens(val as number)}
                  sx={{
                    color: "#8b5cf6",
                    "& .MuiSlider-thumb": { width: 16, height: 16 },
                  }}
                />
                <Stack direction="row" sx={{ justifyContent: "space-between", mt: -0.5 }}>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>0 tokens</Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>2,000</Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>4,000</Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>8,192 max</Typography>
                </Stack>
              </Box>

              {/* Request Volume Multiplier */}
              <TextField
                fullWidth
                label="Batch Request Scale Multiplier"
                type="number"
                value={requestsCount}
                onChange={(e) => setRequestsCount(Math.max(1, parseInt(e.target.value) || 1))}
                helperText="Calculate costs for recurring batch API execution (e.g. 1000 daily queries)"
                slotProps={{
                  input: {
                    sx: { borderRadius: 2, bgcolor: "#f8fafc" },
                  },
                }}
              />
            </Stack>
          </Paper>
        </Grid>

        {/* Right Results & Visualizer Column */}
        <Grid size={{ xs: 12, lg: 6 }} className="print-full-width" sx={{ "@media print": { width: "100% !important", maxWidth: "100% !important", flexBasis: "100% !important" } }}>
          <Stack spacing={2.5}>
            {/* Primary Hero Readout Card */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: 3.5,
                background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
                color: "#ffffff",
                boxShadow: "0 10px 25px -5px rgba(49, 46, 129, 0.3)",
                position: "relative",
                overflow: "hidden",
                "@media print": {
                  background: "#f8fafc !important",
                  color: "#0f172a !important",
                  border: "2px solid #4338ca !important",
                  boxShadow: "none !important",
                },
              }}
            >
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 800, color: "#a5b4fc", "@media print": { color: "#64748b !important" } }}>
                    PROMPT TOKEN COMPUTATION · BPE ENGINE
                  </Typography>
                  <Chip
                    size="small"
                    label={`${pricing.selectedModel.provider} · ${pricing.selectedModel.name}`}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.15)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: 11,
                      backdropFilter: "blur(6px)",
                      "@media print": {
                        bgcolor: "#e2e8f0 !important",
                        color: "#0f172a !important",
                      },
                    }}
                  />
                </Stack>

                {/* Primary Metric Displays */}
                <Grid container spacing={2} sx={{ my: 1.5, alignItems: "baseline" }}>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1, letterSpacing: -1, color: "#ffffff", "@media print": { color: "#0f172a !important" } }}>
                      {tokenAnalysis.tokens.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#c7d2fe", mt: 0.5, fontWeight: 600, "@media print": { color: "#475569 !important" } }}>
                      Prompt Tokens
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1, color: "#38bdf8", "@media print": { color: "#0284c7 !important" } }}>
                      {formatUsd(pricing.singleTotalCost)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#c7d2fe", mt: 0.5, fontWeight: 600, "@media print": { color: "#475569 !important" } }}>
                      Single Call Cost
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1, color: "#a7f3d0", "@media print": { color: "#059669 !important" } }}>
                      {pricing.batchCostFormatted}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#c7d2fe", mt: 0.5, fontWeight: 600, "@media print": { color: "#475569 !important" } }}>
                      Batch ({requestsCount.toLocaleString()} {requestsCount === 1 ? "run" : "runs"})
                    </Typography>
                  </Grid>
                </Grid>

                {/* Context Window Utilization Gauge */}
                <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.15)", "@media print": { borderTop: "1px solid #cbd5e1 !important" } }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
                    <Typography variant="caption" sx={{ color: "#c7d2fe", fontWeight: 700, "@media print": { color: "#475569 !important" } }}>
                      Context Window Saturation ({pricing.selectedModel.contextWindow >= 1000000 ? `${(pricing.selectedModel.contextWindow / 1000000).toFixed(0)}M` : `${(pricing.selectedModel.contextWindow / 1000).toFixed(0)}k`} tokens max)
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "#ffffff", "@media print": { color: "#0f172a !important" } }}>
                      {pricing.contextPct}% used
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, pricing.contextPct)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        bgcolor:
                          pricing.contextStatus === "exceeded"
                            ? "#ef4444"
                            : pricing.contextStatus === "heavy"
                            ? "#f59e0b"
                            : "#10b981",
                      },
                    }}
                  />
                  {pricing.contextStatus === "exceeded" && (
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 1, color: "#fca5a5" }}>
                      <WarningAmberIcon fontSize="small" />
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        Prompt + Output tokens exceed this model's context capacity!
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Box>
            </Paper>

            {/* Secondary Metrics Cards */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    border: "1px solid #e2e8f0",
                    bgcolor: "#ffffff",
                    textAlign: "center",
                    "@media print": {
                      bgcolor: "#ffffff !important",
                      borderColor: "#cbd5e1 !important",
                    },
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a !important" }}>
                    {tokenAnalysis.words.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#475569 !important", fontWeight: 700 }}>
                    Total Words
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    border: "1px solid #e2e8f0",
                    bgcolor: "#ffffff",
                    textAlign: "center",
                    "@media print": {
                      bgcolor: "#ffffff !important",
                      borderColor: "#cbd5e1 !important",
                    },
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a !important" }}>
                    {tokenAnalysis.characters.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#475569 !important", fontWeight: 700 }}>
                    Characters
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    border: "1px solid #e2e8f0",
                    bgcolor: "#ffffff",
                    textAlign: "center",
                    "@media print": {
                      bgcolor: "#ffffff !important",
                      borderColor: "#cbd5e1 !important",
                    },
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a !important" }}>
                    {tokenAnalysis.tokensPerWord}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#475569 !important", fontWeight: 700 }}>
                    Tokens / Word
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    border: "1px solid #e2e8f0",
                    bgcolor: "#ffffff",
                    textAlign: "center",
                    "@media print": {
                      bgcolor: "#ffffff !important",
                      borderColor: "#cbd5e1 !important",
                    },
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a !important" }}>
                    {tokenAnalysis.bytesFormatted}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#475569 !important", fontWeight: 700 }}>
                    Payload Size
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Token Chunks Highlighter (Tiktokenizer style) */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 3.5,
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
              }}
            >
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    Token Chunk Visualizer
                  </Typography>
                  <Chip
                    size="small"
                    label={`${tokenAnalysis.chunks.length} chunks`}
                    sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: "#f1f5f9" }}
                  />
                </Stack>
                <Button
                  size="small"
                  onClick={() => setShowTokensView(!showTokensView)}
                  sx={{ textTransform: "none", fontSize: 12, fontWeight: 700, color: "#8b5cf6" }}
                >
                  {showTokensView ? "Hide Tokens" : "Show Tokens"}
                </Button>
              </Stack>

              {showTokensView && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f8fafc",
                    borderRadius: 2.5,
                    border: "1px solid #e2e8f0",
                    maxHeight: 280,
                    overflowY: "auto",
                    lineHeight: 1.8,
                  }}
                >
                  {tokenAnalysis.chunks.length === 0 ? (
                    <Typography variant="body2" sx={{ color: "#94a3b8", fontStyle: "italic" }}>
                      Enter text on the left to see color-coded token splits...
                    </Typography>
                  ) : (
                    tokenAnalysis.chunks.map((chunk) => {
                      const color = TOKEN_COLORS[chunk.colorIdx]
                      return (
                        <Tooltip key={chunk.id} title={`Token #${chunk.id + 1}`} arrow placement="top">
                          <Box
                            component="span"
                            sx={{
                              display: "inline-block",
                              px: 0.5,
                              py: 0.1,
                              m: "1.5px",
                              borderRadius: "4px",
                              bgcolor: color.bg,
                              color: color.color,
                              border: `1px solid ${color.border}`,
                              fontFamily: "var(--font-mono, monospace), monospace",
                              fontSize: 12.5,
                              fontWeight: 600,
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {chunk.text}
                          </Box>
                        </Tooltip>
                      )
                    })
                  )}
                </Box>
              )}
            </Paper>

            {/* Multi-Model Comparison Table */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 3.5,
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                overflowX: "auto",
              }}
            >
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    Global AI Model Pricing Matrix ({filteredComparison.length} Models)
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Click any row to test on that model · Sorted by execution expense
                  </Typography>
                </Box>
              </Stack>

              {/* Provider filter bar with flex-wrap */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.75,
                  mb: 2,
                }}
              >
                {PROVIDER_LIST.map((prov) => (
                  <Chip
                    key={prov}
                    label={prov}
                    size="small"
                    clickable
                    onClick={() => setTableFilterProvider(prov)}
                    variant={tableFilterProvider === prov ? "filled" : "outlined"}
                    sx={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      borderRadius: "16px",
                      bgcolor: tableFilterProvider === prov ? "#0f172a" : "#ffffff",
                      color: tableFilterProvider === prov ? "#ffffff" : "#475569",
                      borderColor: tableFilterProvider === prov ? "#0f172a" : "#e2e8f0",
                      "&:hover": {
                        bgcolor: tableFilterProvider === prov ? "#1e293b" : "#f1f5f9",
                      },
                    }}
                  />
                ))}
              </Box>

              <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <Box component="thead">
                  <Box component="tr" sx={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                    <Box component="th" sx={{ pb: 1, fontWeight: 800, color: "#475569" }}>Model</Box>
                    <Box component="th" sx={{ pb: 1, fontWeight: 800, color: "#475569" }}>Single Run</Box>
                    <Box component="th" sx={{ pb: 1, fontWeight: 800, color: "#475569" }}>1k Runs</Box>
                    <Box component="th" sx={{ pb: 1, fontWeight: 800, color: "#475569" }}>Context</Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {filteredComparison.map((item) => (
                    <Box
                      component="tr"
                      key={item.modelId}
                      onClick={() => {
                        setSelectedModel(item.modelId)
                        onToast?.(`⚡ Switched target model to ${item.modelName}`)
                      }}
                      sx={{
                        borderBottom: "1px solid #f1f5f9",
                        bgcolor: item.isCurrent ? "#f5f3ff" : "transparent",
                        cursor: "pointer",
                        transition: "background-color 0.15s ease",
                        "&:hover": { bgcolor: item.isCurrent ? "#ede9fe" : "#f8fafc" },
                      }}
                    >
                      <Box component="td" sx={{ py: 1.2 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                          <Chip
                            size="small"
                            label={item.provider}
                            sx={{
                              height: 18,
                              fontSize: 10,
                              fontWeight: 800,
                              bgcolor: `${item.providerColor}15`,
                              color: item.providerColor,
                            }}
                          />
                          <Typography sx={{ fontWeight: item.isCurrent ? 800 : 600, fontSize: 12.5, color: item.isCurrent ? "#6d28d9" : "#1e293b" }}>
                            {item.modelName}
                          </Typography>
                          {item.isCurrent && (
                            <Chip
                              size="small"
                              label="Active"
                              sx={{
                                height: 16,
                                fontSize: 9,
                                fontWeight: 800,
                                bgcolor: "#8b5cf6",
                                color: "#ffffff",
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                      <Box component="td" sx={{ py: 1.2, fontWeight: 700, color: "#0f172a" }}>
                        {item.singleRunFormatted}
                      </Box>
                      <Box component="td" sx={{ py: 1.2, fontWeight: 700, color: "#64748b" }}>
                        {item.costPer1kFormatted}
                      </Box>
                      <Box component="td" sx={{ py: 1.2, color: "#64748b", fontSize: 11.5 }}>
                        {item.contextWindow >= 1000000 ? `${(item.contextWindow / 1000000).toFixed(0)}M` : `${(item.contextWindow / 1000).toFixed(0)}k`} ({item.contextUtilPct}%)
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>

            {/* Tactile Action Buttons */}
            <Stack direction="row" spacing={1.5} className="no-print" sx={{ mt: 2, flexWrap: "wrap", gap: 1, "@media print": { display: "none !important" } }}>
              <TactileButton
                size="small"
                buttonColor="primary"
                startIcon={<ContentCopyIcon />}
                onClick={() => {
                  const summaryText = `AI Prompt Token & Cost Audit:
Model: ${pricing.selectedModel.name} (${pricing.selectedModel.provider})
Prompt Tokens: ${tokenAnalysis.tokens.toLocaleString()}
Characters: ${tokenAnalysis.characters.toLocaleString()} (Words: ${tokenAnalysis.words.toLocaleString()})
Expected Output: ${outputTokens.toLocaleString()} tokens
Single Execution Cost: ${formatUsd(pricing.singleTotalCost)}
Batch (${requestsCount} runs): ${pricing.batchCostFormatted}
1k Runs: ${pricing.costPer1kFormatted}

Audited on TryCalc.net`
                  copyToClipboard(summaryText, "Token calculation report")
                }}
              >
                Copy Token Report
              </TactileButton>
              <TactileButton
                size="small"
                buttonColor="secondary"
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
              >
                Print Audit Certificate
              </TactileButton>
            </Stack>

            {/* Print-Only Official Footer */}
            <Box className="print-only" sx={{ display: "none", "@media print": { display: "block !important" }, mt: 3, pt: 1.5, borderTop: "1px solid #cbd5e1", textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                Official calculation audit certificate generated by TryCalc.net Universal Engine · Calibrated AI BPE Matrix
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
