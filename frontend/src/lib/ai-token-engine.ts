/**
 * AI Tokenizer, Visualizer & Multi-Model Inference Cost Engine.
 * Comprehensive catalog supporting 34 leading world AI models across
 * OpenAI, Anthropic, Google Gemini, DeepSeek, xAI (Grok), Meta (Llama),
 * Mistral AI, Alibaba (Qwen), Cohere, Amazon (Nova), and Microsoft (Phi).
 */

export type AIProvider =
  | "All"
  | "OpenAI"
  | "Anthropic"
  | "Google"
  | "DeepSeek"
  | "xAI"
  | "Meta"
  | "Mistral"
  | "Qwen"
  | "Cohere"
  | "Amazon"
  | "Microsoft"

export interface ModelSpec {
  id: string
  name: string
  provider: Exclude<AIProvider, "All">
  inputPerM: number      // USD per 1 Million input tokens
  outputPerM: number     // USD per 1 Million output tokens
  contextWindow: number  // in tokens
  maxOutput: number      // max generation tokens
  description: string
  badgeColor: string
  providerColor: string
}

export const AI_MODELS: Record<string, ModelSpec> = {
  // ─── OpenAI ──────────────────────────────────────────────────────────
  "gpt-4o": {
    id: "gpt-4o",
    name: "GPT-4o (Omni)",
    provider: "OpenAI",
    inputPerM: 2.50,
    outputPerM: 10.00,
    contextWindow: 128000,
    maxOutput: 16384,
    description: "Flagship multimodal intelligence for high-complexity multimodal work.",
    badgeColor: "#10a37f",
    providerColor: "#10a37f",
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    inputPerM: 0.15,
    outputPerM: 0.60,
    contextWindow: 128000,
    maxOutput: 16384,
    description: "Fast, cost-efficient model for everyday lightweight tasks and reasoning.",
    badgeColor: "#10a37f",
    providerColor: "#10a37f",
  },
  "o1": {
    id: "o1",
    name: "o1 Reasoning",
    provider: "OpenAI",
    inputPerM: 15.00,
    outputPerM: 60.00,
    contextWindow: 200000,
    maxOutput: 100000,
    description: "Deep chain-of-thought reasoning model for math, coding, and science.",
    badgeColor: "#059669",
    providerColor: "#10a37f",
  },
  "o1-mini": {
    id: "o1-mini",
    name: "o1-mini",
    provider: "OpenAI",
    inputPerM: 1.10,
    outputPerM: 4.40,
    contextWindow: 128000,
    maxOutput: 65536,
    description: "Fast reasoning model optimized for coding, math, and STEM reasoning.",
    badgeColor: "#059669",
    providerColor: "#10a37f",
  },
  "o3-mini": {
    id: "o3-mini",
    name: "o3-mini",
    provider: "OpenAI",
    inputPerM: 1.10,
    outputPerM: 4.40,
    contextWindow: 200000,
    maxOutput: 100000,
    description: "High-speed reasoning model specialized in STEM and coding benchmarks.",
    badgeColor: "#0d9488",
    providerColor: "#10a37f",
  },
  "gpt-4-turbo": {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    inputPerM: 10.00,
    outputPerM: 30.00,
    contextWindow: 128000,
    maxOutput: 4096,
    description: "Legacy high-capability GPT-4 model with vision capabilities.",
    badgeColor: "#0284c7",
    providerColor: "#10a37f",
  },
  "gpt-3-5-turbo": {
    id: "gpt-3-5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    inputPerM: 0.50,
    outputPerM: 1.50,
    contextWindow: 16385,
    maxOutput: 4096,
    description: "Fast legacy model for low-latency everyday tasks.",
    badgeColor: "#64748b",
    providerColor: "#10a37f",
  },

  // ─── Anthropic ───────────────────────────────────────────────────────
  "claude-3-7-sonnet": {
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet (Hybrid)",
    provider: "Anthropic",
    inputPerM: 3.00,
    outputPerM: 15.00,
    contextWindow: 200000,
    maxOutput: 64000,
    description: "Hybrid reasoning & instant response model with extended thinking modes.",
    badgeColor: "#d97706",
    providerColor: "#d97706",
  },
  "claude-3-5-sonnet": {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    inputPerM: 3.00,
    outputPerM: 15.00,
    contextWindow: 200000,
    maxOutput: 8192,
    description: "Industry-leading reasoning, coding, and nuanced contextual comprehension.",
    badgeColor: "#d97706",
    providerColor: "#d97706",
  },
  "claude-3-5-haiku": {
    id: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    inputPerM: 0.80,
    outputPerM: 4.00,
    contextWindow: 200000,
    maxOutput: 8192,
    description: "Ultra-fast, responsive intelligence at competitive cost efficiency.",
    badgeColor: "#f59e0b",
    providerColor: "#d97706",
  },
  "claude-3-opus": {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    inputPerM: 15.00,
    outputPerM: 75.00,
    contextWindow: 200000,
    maxOutput: 4096,
    description: "Top-tier intelligence for complex open-ended analysis and long document reasoning.",
    badgeColor: "#b45309",
    providerColor: "#d97706",
  },

  // ─── Google Gemini ───────────────────────────────────────────────────
  "gemini-2-flash": {
    id: "gemini-2-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    inputPerM: 0.10,
    outputPerM: 0.40,
    contextWindow: 1048576,
    maxOutput: 8192,
    description: "Next-gen multimodal speed champion with 1M context window.",
    badgeColor: "#4285f4",
    providerColor: "#4285f4",
  },
  "gemini-2-flash-lite": {
    id: "gemini-2-flash-lite",
    name: "Gemini 2.0 Flash-Lite",
    provider: "Google",
    inputPerM: 0.075,
    outputPerM: 0.30,
    contextWindow: 1048576,
    maxOutput: 8192,
    description: "Ultra-cost-efficient Gemini 2.0 tier designed for massive throughput.",
    badgeColor: "#60a5fa",
    providerColor: "#4285f4",
  },
  "gemini-1-5-pro": {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    inputPerM: 1.25,
    outputPerM: 5.00,
    contextWindow: 2097152,
    maxOutput: 8192,
    description: "Massive 2M token context window for full codebases and long video streams.",
    badgeColor: "#1d4ed8",
    providerColor: "#4285f4",
  },
  "gemini-1-5-flash": {
    id: "gemini-1-5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    inputPerM: 0.075,
    outputPerM: 0.30,
    contextWindow: 1048576,
    maxOutput: 8192,
    description: "Lightweight, fast model for high-frequency automated pipelines.",
    badgeColor: "#3b82f6",
    providerColor: "#4285f4",
  },

  // ─── DeepSeek ────────────────────────────────────────────────────────
  "deepseek-v3": {
    id: "deepseek-v3",
    name: "DeepSeek-V3",
    provider: "DeepSeek",
    inputPerM: 0.14,
    outputPerM: 0.28,
    contextWindow: 64000,
    maxOutput: 8192,
    description: "671B MoE model delivering frontier intelligence at disruptive sub-dollar pricing.",
    badgeColor: "#0284c7",
    providerColor: "#0284c7",
  },
  "deepseek-r1": {
    id: "deepseek-r1",
    name: "DeepSeek-R1 (Reasoning)",
    provider: "DeepSeek",
    inputPerM: 0.55,
    outputPerM: 2.19,
    contextWindow: 64000,
    maxOutput: 8192,
    description: "Open-weights reasoning model with emergent self-verification chains.",
    badgeColor: "#0369a1",
    providerColor: "#0284c7",
  },

  // ─── xAI (Grok) ──────────────────────────────────────────────────────
  "grok-2": {
    id: "grok-2",
    name: "xAI Grok 2",
    provider: "xAI",
    inputPerM: 2.00,
    outputPerM: 10.00,
    contextWindow: 128000,
    maxOutput: 4096,
    description: "State-of-the-art reasoning model from xAI with advanced real-time knowledge.",
    badgeColor: "#1e293b",
    providerColor: "#0f172a",
  },
  "grok-2-mini": {
    id: "grok-2-mini",
    name: "xAI Grok 2 mini",
    provider: "xAI",
    inputPerM: 0.20,
    outputPerM: 1.00,
    contextWindow: 128000,
    maxOutput: 4096,
    description: "Lightweight speed version of Grok 2 for fast query resolution.",
    badgeColor: "#334155",
    providerColor: "#0f172a",
  },

  // ─── Meta (Llama) ────────────────────────────────────────────────────
  "llama-3-3-70b": {
    id: "llama-3-3-70b",
    name: "Llama 3.3 (70B)",
    provider: "Meta",
    inputPerM: 0.40,
    outputPerM: 0.40,
    contextWindow: 128000,
    maxOutput: 4096,
    description: "State-of-the-art open weights model matching prior 405B capabilities.",
    badgeColor: "#0668e1",
    providerColor: "#0668e1",
  },
  "llama-3-1-405b": {
    id: "llama-3-1-405b",
    name: "Llama 3.1 (405B)",
    provider: "Meta",
    inputPerM: 2.00,
    outputPerM: 2.00,
    contextWindow: 128000,
    maxOutput: 4096,
    description: "Frontier open-weights 405B foundation model for complex distillation & coding.",
    badgeColor: "#1d4ed8",
    providerColor: "#0668e1",
  },
  "llama-3-1-8b": {
    id: "llama-3-1-8b",
    name: "Llama 3.1 (8B)",
    provider: "Meta",
    inputPerM: 0.05,
    outputPerM: 0.05,
    contextWindow: 128000,
    maxOutput: 4096,
    description: "Ultra-compact open-weights model for high-speed edge and batch workflows.",
    badgeColor: "#38bdf8",
    providerColor: "#0668e1",
  },

  // ─── Mistral AI ──────────────────────────────────────────────────────
  "mistral-large": {
    id: "mistral-large",
    name: "Mistral Large 2",
    provider: "Mistral",
    inputPerM: 2.00,
    outputPerM: 6.00,
    contextWindow: 128000,
    maxOutput: 8192,
    description: "Flagship multilingual reasoning and code model from Mistral AI.",
    badgeColor: "#f97316",
    providerColor: "#ea580c",
  },
  "mistral-small": {
    id: "mistral-small",
    name: "Mistral Small 3",
    provider: "Mistral",
    inputPerM: 0.20,
    outputPerM: 0.60,
    contextWindow: 32000,
    maxOutput: 8192,
    description: "Cost-optimized enterprise model with quick latency and code prowess.",
    badgeColor: "#fb923c",
    providerColor: "#ea580c",
  },
  "codestral": {
    id: "codestral",
    name: "Mistral Codestral",
    provider: "Mistral",
    inputPerM: 0.30,
    outputPerM: 0.90,
    contextWindow: 256000,
    maxOutput: 8192,
    description: "Dedicated coding model fluent in 80+ programming languages with 256k window.",
    badgeColor: "#c2410c",
    providerColor: "#ea580c",
  },

  // ─── Alibaba Qwen ────────────────────────────────────────────────────
  "qwen-2-5-72b": {
    id: "qwen-2-5-72b",
    name: "Qwen 2.5 (72B)",
    provider: "Qwen",
    inputPerM: 0.35,
    outputPerM: 0.40,
    contextWindow: 128000,
    maxOutput: 8192,
    description: "Top-performing open-weights model excelling across coding, math, and CJK text.",
    badgeColor: "#7c3aed",
    providerColor: "#6d28d9",
  },
  "qwen-2-5-coder-32b": {
    id: "qwen-2-5-coder-32b",
    name: "Qwen 2.5 Coder (32B)",
    provider: "Qwen",
    inputPerM: 0.15,
    outputPerM: 0.15,
    contextWindow: 128000,
    maxOutput: 8192,
    description: "Open-source state of the art in code generation, debugging, and repository reasoning.",
    badgeColor: "#8b5cf6",
    providerColor: "#6d28d9",
  },
  "qwq-32b-preview": {
    id: "qwq-32b-preview",
    name: "QwQ 32B (Reasoning)",
    provider: "Qwen",
    inputPerM: 0.15,
    outputPerM: 0.15,
    contextWindow: 32000,
    maxOutput: 8192,
    description: "Specialized open reasoning model rivaling OpenAI o1-mini benchmarks.",
    badgeColor: "#a855f7",
    providerColor: "#6d28d9",
  },

  // ─── Cohere ──────────────────────────────────────────────────────────
  "command-r-plus": {
    id: "command-r-plus",
    name: "Command R+",
    provider: "Cohere",
    inputPerM: 2.50,
    outputPerM: 10.00,
    contextWindow: 128000,
    maxOutput: 4096,
    description: "Enterprise RAG and multi-step tool use powerhouse.",
    badgeColor: "#059669",
    providerColor: "#047857",
  },
  "command-r": {
    id: "command-r",
    name: "Command R",
    provider: "Cohere",
    inputPerM: 0.15,
    outputPerM: 0.60,
    contextWindow: 128000,
    maxOutput: 4096,
    description: "Scalable model optimized for conversational interactions and search citations.",
    badgeColor: "#10b981",
    providerColor: "#047857",
  },

  // ─── Amazon Nova ─────────────────────────────────────────────────────
  "amazon-nova-pro": {
    id: "amazon-nova-pro",
    name: "Amazon Nova Pro",
    provider: "Amazon",
    inputPerM: 0.80,
    outputPerM: 3.20,
    contextWindow: 300000,
    maxOutput: 5120,
    description: "AWS multimodal foundation model with 300k token context window.",
    badgeColor: "#f59e0b",
    providerColor: "#d97706",
  },
  "amazon-nova-lite": {
    id: "amazon-nova-lite",
    name: "Amazon Nova Lite",
    provider: "Amazon",
    inputPerM: 0.06,
    outputPerM: 0.24,
    contextWindow: 300000,
    maxOutput: 5120,
    description: "Low-cost high-speed multimodal processing on AWS Bedrock.",
    badgeColor: "#fbbf24",
    providerColor: "#d97706",
  },
  "amazon-nova-micro": {
    id: "amazon-nova-micro",
    name: "Amazon Nova Micro",
    provider: "Amazon",
    inputPerM: 0.035,
    outputPerM: 0.14,
    contextWindow: 128000,
    maxOutput: 4096,
    description: "Lowest latency text-only model on AWS at sub-cent pricing.",
    badgeColor: "#fcd34d",
    providerColor: "#d97706",
  },

  // ─── Microsoft Phi ───────────────────────────────────────────────────
  "phi-4": {
    id: "phi-4",
    name: "Microsoft Phi-4 (14B)",
    provider: "Microsoft",
    inputPerM: 0.07,
    outputPerM: 0.14,
    contextWindow: 16384,
    maxOutput: 4096,
    description: "14B small language model excelling in complex mathematical and STEM reasoning.",
    badgeColor: "#0284c7",
    providerColor: "#0369a1",
  },
}

export const PROVIDER_LIST: AIProvider[] = [
  "All",
  "OpenAI",
  "Anthropic",
  "Google",
  "DeepSeek",
  "xAI",
  "Meta",
  "Mistral",
  "Qwen",
  "Cohere",
  "Amazon",
  "Microsoft",
]

export interface TokenChunk {
  text: string
  colorIdx: number
  id: number
}

export interface TokenAnalysisResult {
  tokens: number
  characters: number
  charactersNoSpaces: number
  words: number
  lines: number
  bytes: number
  bytesFormatted: string
  tokensPerWord: number
  chunks: TokenChunk[]
}

export interface PricingComparisonItem {
  modelId: string
  modelName: string
  provider: string
  providerColor: string
  inputCost: number
  outputCost: number
  singleRunCost: number
  singleRunFormatted: string
  costPer1k: number
  costPer1kFormatted: string
  costPer1m: number
  costPer1mFormatted: string
  contextWindow: number
  contextUtilPct: number
  isCurrent: boolean
}

/**
 * Tokenize text into chunks and compute metrics.
 */
export function tokenizeText(text: string): TokenAnalysisResult {
  if (!text) {
    return {
      tokens: 0,
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      bytes: 0,
      bytesFormatted: "0 B",
      tokensPerWord: 0,
      chunks: [],
    }
  }

  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, "").length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const lines = text.split("\n").length

  // Calculate UTF-8 byte size
  const encoder = new TextEncoder()
  const bytes = encoder.encode(text).length
  const bytesFormatted =
    bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
      : bytes > 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${bytes} B`

  // Token chunking regex (BPE-aligned)
  const tokenRegex = /(\s+|[A-Za-z0-9]+|[^\s\w])/g
  const matches = text.match(tokenRegex) || [text]
  const chunks: TokenChunk[] = []

  let colorCounter = 0
  for (let i = 0; i < matches.length; i++) {
    const raw = matches[i]
    if (/^[A-Za-z0-9]+$/.test(raw) && raw.length > 5) {
      for (let s = 0; s < raw.length; s += 4) {
        chunks.push({
          text: raw.slice(s, s + 4),
          colorIdx: colorCounter % 8,
          id: chunks.length,
        })
        colorCounter++
      }
    } else {
      chunks.push({
        text: raw,
        colorIdx: colorCounter % 8,
        id: chunks.length,
      })
      colorCounter++
    }
  }

  // Model-family token counting heuristic
  const latinMatches = text.match(/[A-Za-z0-9]/g)?.length || 0
  const spaceMatches = text.match(/\s/g)?.length || 0
  const punctMatches = text.match(/[^\w\s]/g)?.length || 0
  const cjkMatches = text.match(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g)?.length || 0
  const indicMatches = text.match(/[\u0980-\u09ff\u0900-\u097f]/g)?.length || 0
  const otherMatches = characters - latinMatches - spaceMatches - punctMatches - cjkMatches - indicMatches

  const baseTokens =
    latinMatches * 0.27 +
    spaceMatches * 0.3 +
    punctMatches * 0.7 +
    (cjkMatches + indicMatches) * 1.85 +
    otherMatches * 1.2

  const wordTokens = words > 0 ? words * 1.32 : 0
  const estimated = Math.max(baseTokens, wordTokens)
  const finalTokens = Math.max(1, Math.round(estimated))
  const tokensPerWord = words > 0 ? Number((finalTokens / words).toFixed(2)) : 0

  return {
    tokens: finalTokens,
    characters,
    charactersNoSpaces,
    words,
    lines,
    bytes,
    bytesFormatted,
    tokensPerWord,
    chunks,
  }
}

/**
 * Format USD amount with appropriate precision.
 */
export function formatUsd(val: number): string {
  if (val === 0) return "$0.00"
  if (val < 0.0001) return `< $0.0001`
  if (val < 0.01) return `$${val.toFixed(5)}`
  if (val < 1.0) return `$${val.toFixed(4)}`
  return `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Calculate multi-model pricing for single run and batch runs.
 */
export function calculateMultiModelPricing(
  promptTokens: number,
  outputTokens: number,
  requestsCount: number = 1,
  selectedModelId: string = "gpt-4o"
): {
  selectedModel: ModelSpec
  singleInputCost: number
  singleOutputCost: number
  singleTotalCost: number
  batchCost: number
  batchCostFormatted: string
  costPer1kFormatted: string
  costPer1mFormatted: string
  contextPct: number
  contextStatus: "safe" | "moderate" | "heavy" | "exceeded"
  comparison: PricingComparisonItem[]
} {
  const selectedModel = AI_MODELS[selectedModelId] || AI_MODELS["gpt-4o"]

  const singleInputCost = (promptTokens * selectedModel.inputPerM) / 1000000
  const singleOutputCost = (outputTokens * selectedModel.outputPerM) / 1000000
  const singleTotalCost = singleInputCost + singleOutputCost
  const batchCost = singleTotalCost * Math.max(1, requestsCount)

  const totalReqTokens = promptTokens + outputTokens
  const contextPct = Number(((totalReqTokens / selectedModel.contextWindow) * 100).toFixed(2))

  let contextStatus: "safe" | "moderate" | "heavy" | "exceeded" = "safe"
  if (totalReqTokens > selectedModel.contextWindow) {
    contextStatus = "exceeded"
  } else if (contextPct > 70) {
    contextStatus = "heavy"
  } else if (contextPct > 30) {
    contextStatus = "moderate"
  }

  const comparison: PricingComparisonItem[] = Object.values(AI_MODELS).map((m) => {
    let mTokens = promptTokens
    if (m.id.includes("gemini")) mTokens = Math.round(promptTokens * 0.96)
    else if (m.id.includes("claude")) mTokens = Math.round(promptTokens * 1.02)
    else if (m.id.includes("llama") || m.id.includes("mistral")) mTokens = Math.round(promptTokens * 1.04)

    const inCost = (mTokens * m.inputPerM) / 1000000
    const outCost = (outputTokens * m.outputPerM) / 1000000
    const totalSingle = inCost + outCost
    const costPer1k = totalSingle * 1000
    const costPer1m = totalSingle * 1000000
    const mTotalTokens = mTokens + outputTokens
    const utilPct = Number(((mTotalTokens / m.contextWindow) * 100).toFixed(2))

    return {
      modelId: m.id,
      modelName: m.name,
      provider: m.provider,
      providerColor: m.providerColor,
      inputCost: inCost,
      outputCost: outCost,
      singleRunCost: totalSingle,
      singleRunFormatted: formatUsd(totalSingle),
      costPer1k,
      costPer1kFormatted: formatUsd(costPer1k),
      costPer1m,
      costPer1mFormatted: formatUsd(costPer1m),
      contextWindow: m.contextWindow,
      contextUtilPct: utilPct,
      isCurrent: m.id === selectedModel.id,
    }
  }).sort((a, b) => a.singleRunCost - b.singleRunCost)

  return {
    selectedModel,
    singleInputCost,
    singleOutputCost,
    singleTotalCost,
    batchCost,
    batchCostFormatted: formatUsd(batchCost),
    costPer1kFormatted: formatUsd(singleTotalCost * 1000),
    costPer1mFormatted: formatUsd(singleTotalCost * 1000000),
    contextPct,
    contextStatus,
    comparison,
  }
}
