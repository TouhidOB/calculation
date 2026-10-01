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
  const [outputTokens, setOutputTokens] = useState(initialOutputTokens)
  const [requestsCount, setRequestsCount] = useState(initialRequests)
  const [showTokensView, setShowTokensView] = useState(true)

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
                Clear Text
              </Button>
            </Stack>

            {/* Presets Chips */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, display: "block", mb: 1 }}>
                Quick Persona Presets:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {PROMPT_PRESETS.map((p) => (
                  <Chip
                    key={p.label}
                    label={p.label}
                    size="small"
                    onClick={() => {
                      setPrompt(p.prompt)
                      onToast?.(`⚡ Loaded "${p.label}"`)
                    }}
                    sx={{
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 11.5,
                      bgcolor: prompt === p.prompt ? "#ede9fe" : "#f1f5f9",
                      color: prompt === p.prompt ? "#6d28d9" : "#475569",
                      border: prompt === p.prompt ? "1px solid #c4b5fd" : "1px solid #e2e8f0",
                      "&:hover": { bgcolor: "#e2e8f0" },
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
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontWeight: 700, color: "#475569" }}>Target AI Model</InputLabel>
                <Select
                  value={selectedModel}
                  label="Target AI Model"
                  onChange={(e) => setSelectedModel(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  {Object.values(AI_MODELS).map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      <Stack direction="row" spacing={1.5} sx={{ width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>
                          {m.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                          ${m.inputPerM.toFixed(2)} / ${m.outputPerM.toFixed(2)} per 1M
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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
              }}
            >
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 800, color: "#a5b4fc" }}>
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
                    }}
                  />
                </Stack>

                {/* Big Metric Readout */}
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "baseline", my: 1.5 }}>
                  <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: -1, color: "#ffffff", fontSize: { xs: "2.75rem", sm: "3.5rem" } }}>
                    {tokenAnalysis.tokens.toLocaleString()}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#c7d2fe", fontWeight: 700 }}>
                    Tokens
                  </Typography>
                </Stack>

                {/* Key Sub-metrics grid */}
                <Grid container spacing={2} sx={{ mt: 1, pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.15)" }}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" sx={{ color: "#a5b4fc", display: "block" }}>Words</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>{tokenAnalysis.words.toLocaleString()}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" sx={{ color: "#a5b4fc", display: "block" }}>Characters</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>{tokenAnalysis.characters.toLocaleString()}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" sx={{ color: "#a5b4fc", display: "block" }}>Token/Word Ratio</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>{tokenAnalysis.tokensPerWord}x</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" sx={{ color: "#a5b4fc", display: "block" }}>Payload Size</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>{tokenAnalysis.bytesFormatted}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Inference Cost Ledger Card */}
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
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  Estimated Inference Cost ({pricing.selectedModel.name})
                </Typography>
                <Chip
                  size="small"
                  icon={pricing.contextStatus === "safe" ? <CheckCircleIcon sx={{ fontSize: "14px !important" }} /> : <WarningAmberIcon sx={{ fontSize: "14px !important" }} />}
                  label={`${pricing.contextPct}% of ${pricing.selectedModel.contextWindow >= 1000000 ? `${(pricing.selectedModel.contextWindow / 1000000).toFixed(0)}M` : `${(pricing.selectedModel.contextWindow / 1000).toFixed(0)}k`} Context`}
                  sx={{
                    bgcolor: pricing.contextStatus === "safe" ? "#dcfce7" : "#fef9c3",
                    color: pricing.contextStatus === "safe" ? "#166534" : "#854d0e",
                    fontWeight: 700,
                    fontSize: 11,
                  }}
                />
              </Stack>

              {/* Context Limit Progress Bar */}
              <Box sx={{ mb: 2.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(1, pricing.contextPct))}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#f1f5f9",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: pricing.contextStatus === "safe" ? "#10b981" : "#f59e0b",
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              {/* Cost Breakdown Items */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2.5, border: "1px solid #e2e8f0" }}>
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                      SINGLE EXECUTION COST
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", my: 0.5 }}>
                      {formatUsd(pricing.singleTotalCost)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b", fontSize: 11 }}>
                      Input: {formatUsd(pricing.singleInputCost)} · Output: {formatUsd(pricing.singleOutputCost)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2.5, border: "1px solid #e2e8f0" }}>
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                      BATCH ({requestsCount.toLocaleString()} RUNS)
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#8b5cf6", my: 0.5 }}>
                      {pricing.batchCostFormatted}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b", fontSize: 11 }}>
                      1k runs: {pricing.costPer1kFormatted} · 1M: {pricing.costPer1mFormatted}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Interactive Token Chunk Visualizer */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 3.5,
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
              }}
            >
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  Color-Coded Token Highlighting
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => setShowTokensView(!showTokensView)}
                  sx={{ textTransform: "none", fontWeight: 700, fontSize: 12, color: "#8b5cf6" }}
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
                    maxHeight: 240,
                    overflowY: "auto",
                    lineHeight: 2,
                    wordBreak: "break-word",
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
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
                Cross-Model Pricing Comparison
              </Typography>
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
                  {pricing.comparison.map((item) => (
                    <Box
                      component="tr"
                      key={item.modelId}
                      sx={{
                        borderBottom: "1px solid #f1f5f9",
                        bgcolor: item.isCurrent ? "#f5f3ff" : "transparent",
                        "&:hover": { bgcolor: "#f8fafc" },
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
