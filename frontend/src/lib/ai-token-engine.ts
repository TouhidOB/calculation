/**
 * AI Tokenizer, Visualizer & Multi-Model Inference Cost Engine.
 * Supports OpenAI (GPT-4o, GPT-4o-mini, o1, o3-mini), Anthropic (Claude 3.5 Sonnet, Claude 3.5 Haiku),
 * Google Gemini (Gemini 2.0 Flash, Gemini 1.5 Pro), DeepSeek (V3, R1), and Meta Llama 3.3.
 */

export interface ModelSpec {
  id: string
  name: string
  provider: "OpenAI" | "Anthropic" | "Google" | "DeepSeek" | "Meta"
  inputPerM: number      // USD per 1 Million input tokens
  outputPerM: number     // USD per 1 Million output tokens
  contextWindow: number  // in tokens
  maxOutput: number      // max generation tokens
  description: string
  badgeColor: string
  providerColor: string
}

export const AI_MODELS: Record<string, ModelSpec> = {
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
    name: "OpenAI o1 Reasoning",
    provider: "OpenAI",
    inputPerM: 15.00,
    outputPerM: 60.00,
    contextWindow: 200000,
    maxOutput: 100000,
    description: "Deep chain-of-thought reasoning model for math, coding, and science.",
    badgeColor: "#059669",
    providerColor: "#10a37f",
  },
  "o3-mini": {
    id: "o3-mini",
    name: "OpenAI o3-mini",
    provider: "OpenAI",
    inputPerM: 1.10,
    outputPerM: 4.40,
    contextWindow: 200000,
    maxOutput: 100000,
    description: "High-speed reasoning model specialized in STEM and coding benchmarks.",
    badgeColor: "#0d9488",
    providerColor: "#10a37f",
  },
  "claude-3-5-sonnet": {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    inputPerM: 3.00,
    outputPerM: 15.00,
    contextWindow: 200000,
    maxOutput: 8192,
    description: "Industry-leading coding, architectural reasoning, and agentic workflows.",
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
    description: "Lightning-fast responsiveness with near-Sonnet intelligence levels.",
    badgeColor: "#b45309",
    providerColor: "#d97706",
  },
  "gemini-2-flash": {
    id: "gemini-2-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    inputPerM: 0.10,
    outputPerM: 0.40,
    contextWindow: 1048576,
    maxOutput: 8192,
    description: "Next-gen multimodal speed with massive 1 Million token context window.",
    badgeColor: "#2563eb",
    providerColor: "#2563eb",
  },
  "gemini-1-5-pro": {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    inputPerM: 1.25,
    outputPerM: 5.00,
    contextWindow: 2097152,
    maxOutput: 8192,
    description: "Extreme long-context reasoning with up to 2 Million tokens support.",
    badgeColor: "#1d4ed8",
    providerColor: "#2563eb",
  },
  "deepseek-v3": {
    id: "deepseek-v3",
    name: "DeepSeek-V3 (MoE)",
    provider: "DeepSeek",
    inputPerM: 0.14,
    outputPerM: 0.28,
    contextWindow: 65536,
    maxOutput: 8192,
    description: "Ultra high-efficiency Mixture-of-Experts 671B model with disruptive pricing.",
    badgeColor: "#0284c7",
    providerColor: "#0284c7",
  },
  "deepseek-r1": {
    id: "deepseek-r1",
    name: "DeepSeek-R1 (Reasoning)",
    provider: "DeepSeek",
    inputPerM: 0.55,
    outputPerM: 2.19,
    contextWindow: 65536,
    maxOutput: 8192,
    description: "Open-weights reasoning model with exceptional math & logic performance.",
    badgeColor: "#0369a1",
    providerColor: "#0284c7",
  },
  "llama-3-3-70b": {
    id: "llama-3-3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta",
    inputPerM: 0.40,
    outputPerM: 0.40,
    contextWindow: 128000,
    maxOutput: 8192,
    description: "Open foundation model matching prior 405B capabilities at a fraction of cost.",
    badgeColor: "#7c3aed",
    providerColor: "#7c3aed",
  },
}

export interface TokenChunk {
  text: string
  id: number
  colorIdx: number
}

export interface TokenAnalysisResult {
  tokens: number
  characters: number
  charactersNoSpaces: number
  words: number
  lines: number
  sentences: number
  bytes: number
  bytesFormatted: string
  tokensPerWord: number
  readingTimeSec: number
  speakingTimeSec: number
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

// BPE tokenization heuristics pattern matching modern LLM tokenizers (tiktoken cl100k/o200k)
const BPE_SPLIT_REGEX = /'(?:[sdmt]|ll|ve|re)| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu

export function tokenizeText(text: string): TokenAnalysisResult {
  if (!text) {
    return {
      tokens: 0,
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      sentences: 0,
      bytes: 0,
      bytesFormatted: "0 B",
      tokensPerWord: 0,
      readingTimeSec: 0,
      speakingTimeSec: 0,
      chunks: [],
    }
  }

  const characters = text.length
  const charactersNoSpaces = text.replace(/\s+/g, "").length
  const wordsMatch = text.trim().match(/[\S]+/g)
  const words = wordsMatch ? wordsMatch.length : 0
  const lines = text.split(/\r\n|\r|\n/).length
  const sentencesMatch = text.match(/[^.!?]+[.!?]+(\s|$)/g)
  const sentences = sentencesMatch ? sentencesMatch.length : (words > 0 ? 1 : 0)

  // Byte size (UTF-8 encoding)
  const encoder = new TextEncoder()
  const bytes = encoder.encode(text).length
  const bytesFormatted = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`

  // Token chunks generation
  const chunks: TokenChunk[] = []
  let totalTokens = 0
  const matches = text.match(BPE_SPLIT_REGEX) || []

  for (let i = 0; i < matches.length; i++) {
    const rawChunk = matches[i]
    if (!rawChunk) continue

    // Unicode multi-byte characters (Bengali, Hindi, Arabic, Chinese, Emoji)
    // usually take 1-3 tokens per character depending on UTF-8 bytes
    const chunkBytes = encoder.encode(rawChunk).length
    let tokenWeight = 1
    if (chunkBytes > rawChunk.length && !/^[\s]+$/.test(rawChunk)) {
      // Non-ASCII detected
      tokenWeight = Math.max(1, Math.round(chunkBytes / 3))
    } else if (rawChunk.length > 8 && !/^[\s]+$/.test(rawChunk)) {
      // Very long compound token splits in BPE
      tokenWeight = Math.max(1, Math.ceil(rawChunk.length / 4))
    }

    totalTokens += tokenWeight
    chunks.push({
      text: rawChunk,
      id: i,
      colorIdx: i % 8,
    })
  }

  // Safety floor for very dense inputs
  if (totalTokens === 0 && characters > 0) {
    totalTokens = Math.max(1, Math.ceil(characters / 4))
  }

  const tokensPerWord = words > 0 ? Number((totalTokens / words).toFixed(2)) : 0
  // Average reading speed: 220 words per minute (3.66 words/sec)
  const readingTimeSec = Math.max(1, Math.round(words / 3.66))
  // Average speaking speed: 140 words per minute (2.33 words/sec)
  const speakingTimeSec = Math.max(1, Math.round(words / 2.33))

  return {
    tokens: totalTokens,
    characters,
    charactersNoSpaces,
    words,
    lines,
    sentences,
    bytes,
    bytesFormatted,
    tokensPerWord,
    readingTimeSec,
    speakingTimeSec,
    chunks,
  }
}

export function formatUsd(val: number): string {
  if (val === 0) return "$0.00"
  if (val < 0.000001) return `< $0.000001`
  if (val < 0.0001) return `$${val.toFixed(6)}`
  if (val < 0.01) return `$${val.toFixed(4)}`
  return `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

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
    const inCost = (promptTokens * m.inputPerM) / 1000000
    const outCost = (outputTokens * m.outputPerM) / 1000000
    const totalSingle = inCost + outCost
    const costPer1k = totalSingle * 1000
    const costPer1m = totalSingle * 1000000
    const utilPct = Number(((totalReqTokens / m.contextWindow) * 100).toFixed(2))

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
