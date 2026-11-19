/**
 * Zero-dependency Google Live Data Mining Library
 * Hits Google Autocomplete API endpoint with seed queries, wildcard expansions,
 * alphabet variations, and People Also Ask (PAA) question heuristics.
 */

export type SuggestSource = "autocomplete" | "alphabet" | "paa" | "wildcard"

export type SearchIntent = "informational" | "commercial" | "transactional" | "navigational"

export interface GoogleSuggestItem {
  keyword: string
  source: SuggestSource
  intent: SearchIntent
  seed: string
  prefix?: string
  letter?: string
  relevanceRank: number
  estimatedVolume: number
  estimatedDifficulty: number
  eEatReadinessScore: number
}

export interface GoogleSuggestOptions {
  includeAlphabet?: boolean
  includePaa?: boolean
  includeWildcard?: boolean
  maxAlphabetLetters?: number
  language?: string
  country?: string
}

export interface GoogleSuggestResult {
  seed: string
  timestamp: string
  totalSuggestions: number
  items: GoogleSuggestItem[]
  paaQuestions: GoogleSuggestItem[]
  alphabetKeywords: GoogleSuggestItem[]
  directSuggestions: GoogleSuggestItem[]
  wildcardKeywords: GoogleSuggestItem[]
}

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

/**
 * Deterministic intent classifier for search keywords
 */
export function estimateSearchIntent(keyword: string): SearchIntent {
  const kw = keyword.toLowerCase()

  // Transactional indicators (action, calculating, converting, tool usage)
  if (
    kw.includes("calculator") ||
    kw.includes("calculate") ||
    kw.includes("estimator") ||
    kw.includes("convert") ||
    kw.includes("converter") ||
    kw.includes("tool") ||
    kw.includes("generator") ||
    kw.includes("solver") ||
    kw.includes("download") ||
    kw.includes("app") ||
    kw.includes("sheet") ||
    kw.includes("template")
  ) {
    return "transactional"
  }

  // Commercial investigation (best, top, vs, cost, price, review)
  if (
    kw.includes("best") ||
    kw.includes("top") ||
    kw.includes("vs") ||
    kw.includes("versus") ||
    kw.includes("review") ||
    kw.includes("comparison") ||
    kw.includes("rates") ||
    kw.includes("cost") ||
    kw.includes("price") ||
    kw.includes("pricing") ||
    kw.includes("quote") ||
    kw.includes("fees")
  ) {
    return "commercial"
  }

  // Navigational (brand names or target platforms)
  if (
    kw.includes("excel") ||
    kw.includes("zillow") ||
    kw.includes("bankrate") ||
    kw.includes("investopedia") ||
    kw.includes("nerdwallet") ||
    kw.includes("reddit") ||
    kw.includes("youtube") ||
    kw.includes("google")
  ) {
    return "navigational"
  }

  // Informational (questions, explanations, formulas)
  return "informational"
}

/**
 * Computes heuristic metrics (search volume, difficulty, E-E-A-T readiness score)
 * based on keyword length, position, and intent.
 */
export function estimateKeywordMetrics(
  keyword: string,
  source: SuggestSource,
  rank: number
): { volume: number; difficulty: number; eEatScore: number } {
  const words = keyword.trim().split(/\s+/).length
  const hash = keyword.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)

  // Autocomplete top results have highest baseline demand
  let baseVol = 12000
  if (source === "autocomplete") baseVol = 24000
  else if (source === "paa") baseVol = 16000
  else if (source === "alphabet") baseVol = 9000
  else if (source === "wildcard") baseVol = 11000

  // Dampen volume as rank drops
  const rankMultiplier = Math.max(0.3, 1 - (rank - 1) * 0.06)
  const volume = Math.round((baseVol * rankMultiplier + (hash % 8500)) / 100) * 100

  // Difficulty: long-tail is lower difficulty
  let difficulty = Math.max(12, Math.min(45, 38 - words * 3 + (hash % 10)))
  if (source === "paa") difficulty = Math.max(10, difficulty - 5) // PAA questions are easier to rank with good content

  // E-E-A-T Score: measures how easily programmatic structured data can satisfy this query (0-100)
  // Higher for calculations, formulas, concrete questions
  let eEatScore = 85 + (hash % 13) // Baseline 85-97
  if (keyword.toLowerCase().includes("calculator") || keyword.toLowerCase().includes("calculate")) {
    eEatScore = Math.min(99, eEatScore + 4)
  }
  if (source === "paa") {
    eEatScore = Math.min(100, eEatScore + 2)
  }

  return { volume, difficulty, eEatScore }
}

/**
 * Core query scraper hitting Google Autocomplete (client=chrome)
 */
export async function queryGoogleSuggest(
  query: string,
  language = "en",
  country = "us"
): Promise<string[]> {
  const clean = query.trim()
  if (!clean) return []

  const url = `https://suggestqueries.google.com/complete/search?client=chrome&hl=${encodeURIComponent(
    language
  )}&gl=${encodeURIComponent(country)}&q=${encodeURIComponent(clean)}`

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": DEFAULT_USER_AGENT,
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(4000),
    })

    if (!res.ok) return []

    const data = await res.json()
    if (Array.isArray(data) && Array.isArray(data[1])) {
      return (data[1] as any[])
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter((item) => item.length > 0 && !item.startsWith("http://") && !item.startsWith("https://"))
    }

    return []
  } catch {
    return []
  }
}

/**
 * Alphabet expansion scraper: seed + " a", seed + " b" ...
 */
export async function fetchAlphabetSuggestions(
  seed: string,
  options?: { maxLetters?: number; language?: string; country?: string }
): Promise<GoogleSuggestItem[]> {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("").slice(0, options?.maxLetters ?? 26)
  const results: GoogleSuggestItem[] = []
  const seen = new Set<string>()

  // Run in chunks of 5 to avoid socket saturation
  const chunkSize = 5
  for (let i = 0; i < letters.length; i += chunkSize) {
    const chunk = letters.slice(i, i + chunkSize)
    const promises = chunk.map(async (letter) => {
      const q = `${seed.trim()} ${letter}`
      const suggestions = await queryGoogleSuggest(q, options?.language, options?.country)
      return { letter, suggestions }
    })

    const resolved = await Promise.all(promises)
    for (const { letter, suggestions } of resolved) {
      suggestions.slice(0, 4).forEach((kw, idx) => {
        const lower = kw.toLowerCase()
        if (!seen.has(lower)) {
          seen.add(lower)
          const metrics = estimateKeywordMetrics(kw, "alphabet", idx + 1)
          results.push({
            keyword: kw,
            source: "alphabet",
            intent: estimateSearchIntent(kw),
            seed,
            letter,
            relevanceRank: idx + 1,
            estimatedVolume: metrics.volume,
            estimatedDifficulty: metrics.difficulty,
            eEatReadinessScore: metrics.eEatScore,
          })
        }
      })
    }
  }

  return results
}

/**
 * People Also Ask & Question intent scraper
 */
export async function fetchPaaQuestions(
  seed: string,
  options?: { language?: string; country?: string }
): Promise<GoogleSuggestItem[]> {
  const cleanSeed = seed.trim()
  const prefixes = [
    `how to calculate ${cleanSeed}`,
    `what is ${cleanSeed}`,
    `best calculator for ${cleanSeed}`,
    `how much does ${cleanSeed}`,
    `how does ${cleanSeed} work`,
    `why use a ${cleanSeed} calculator`,
  ]

  const results: GoogleSuggestItem[] = []
  const seen = new Set<string>()

  const promises = prefixes.map(async (prefix) => {
    const suggestions = await queryGoogleSuggest(prefix, options?.language, options?.country)
    return { prefix, suggestions }
  })

  const resolved = await Promise.all(promises)
  for (const { prefix, suggestions } of resolved) {
    // Include the prefix itself if it sounds like a viable question
    if (!seen.has(prefix.toLowerCase())) {
      seen.add(prefix.toLowerCase())
      const m = estimateKeywordMetrics(prefix, "paa", 1)
      results.push({
        keyword: prefix,
        source: "paa",
        intent: "informational",
        seed: cleanSeed,
        prefix,
        relevanceRank: 1,
        estimatedVolume: m.volume,
        estimatedDifficulty: m.difficulty,
        eEatReadinessScore: m.eEatScore,
      })
    }

    suggestions.slice(0, 4).forEach((kw, idx) => {
      const lower = kw.toLowerCase()
      if (!seen.has(lower)) {
        seen.add(lower)
        const metrics = estimateKeywordMetrics(kw, "paa", idx + 2)
        results.push({
          keyword: kw,
          source: "paa",
          intent: estimateSearchIntent(kw),
          seed: cleanSeed,
          prefix,
          relevanceRank: idx + 2,
          estimatedVolume: metrics.volume,
          estimatedDifficulty: metrics.difficulty,
          eEatReadinessScore: metrics.eEatScore,
        })
      }
    })
  }

  return results
}

/**
 * Wildcard query scraper: "seed vs *", "seed for *", etc.
 */
export async function fetchWildcardSuggestions(
  seed: string,
  options?: { language?: string; country?: string }
): Promise<GoogleSuggestItem[]> {
  const cleanSeed = seed.trim()
  const patterns = [
    `${cleanSeed} vs *`,
    `${cleanSeed} for *`,
    `best * ${cleanSeed}`,
    `how to * ${cleanSeed}`,
  ]

  const results: GoogleSuggestItem[] = []
  const seen = new Set<string>()

  const promises = patterns.map(async (pat) => {
    const suggestions = await queryGoogleSuggest(pat, options?.language, options?.country)
    return { pattern: pat, suggestions }
  })

  const resolved = await Promise.all(promises)
  for (const { pattern, suggestions } of resolved) {
    suggestions.slice(0, 4).forEach((kw, idx) => {
      const lower = kw.toLowerCase()
      if (!seen.has(lower)) {
        seen.add(lower)
        const metrics = estimateKeywordMetrics(kw, "wildcard", idx + 1)
        results.push({
          keyword: kw,
          source: "wildcard",
          intent: estimateSearchIntent(kw),
          seed: cleanSeed,
          prefix: pattern,
          relevanceRank: idx + 1,
          estimatedVolume: metrics.volume,
          estimatedDifficulty: metrics.difficulty,
          eEatReadinessScore: metrics.eEatScore,
        })
      }
    })
  }

  return results
}

/**
 * Full live Google Data Mining suite
 */
export async function mineGoogleKeywordData(
  seed: string,
  options: GoogleSuggestOptions = {}
): Promise<GoogleSuggestResult> {
  const cleanSeed = seed.trim()
  const includeAlphabet = options.includeAlphabet ?? true
  const includePaa = options.includePaa ?? true
  const includeWildcard = options.includeWildcard ?? true
  const maxAlphabetLetters = options.maxAlphabetLetters ?? 12 // Default to first 12 letters for speed, can be up to 26

  // 1. Direct autocomplete suggestions
  const directRaw = await queryGoogleSuggest(cleanSeed, options.language, options.country)
  const seen = new Set<string>()
  const directSuggestions: GoogleSuggestItem[] = []

  directRaw.forEach((kw, idx) => {
    const lower = kw.toLowerCase()
    if (!seen.has(lower)) {
      seen.add(lower)
      const metrics = estimateKeywordMetrics(kw, "autocomplete", idx + 1)
      directSuggestions.push({
        keyword: kw,
        source: "autocomplete",
        intent: estimateSearchIntent(kw),
        seed: cleanSeed,
        relevanceRank: idx + 1,
        estimatedVolume: metrics.volume,
        estimatedDifficulty: metrics.difficulty,
        eEatReadinessScore: metrics.eEatScore,
      })
    }
  })

  // 2. Parallel expansion
  const [alphabetKeywords, paaQuestions, wildcardKeywords] = await Promise.all([
    includeAlphabet
      ? fetchAlphabetSuggestions(cleanSeed, {
          maxLetters: maxAlphabetLetters,
          language: options.language,
          country: options.country,
        })
      : Promise.resolve([]),
    includePaa
      ? fetchPaaQuestions(cleanSeed, {
          language: options.language,
          country: options.country,
        })
      : Promise.resolve([]),
    includeWildcard
      ? fetchWildcardSuggestions(cleanSeed, {
          language: options.language,
          country: options.country,
        })
      : Promise.resolve([]),
  ])

  // Combine and deduplicate
  const allItems: GoogleSuggestItem[] = [...directSuggestions]
  const allSeen = new Set<string>(directSuggestions.map((d) => d.keyword.toLowerCase()))

  for (const item of [...paaQuestions, ...alphabetKeywords, ...wildcardKeywords]) {
    const lower = item.keyword.toLowerCase()
    if (!allSeen.has(lower)) {
      allSeen.add(lower)
      allItems.push(item)
    }
  }

  return {
    seed: cleanSeed,
    timestamp: new Date().toISOString(),
    totalSuggestions: allItems.length,
    items: allItems,
    directSuggestions,
    paaQuestions,
    alphabetKeywords,
    wildcardKeywords,
  }
}

// Convenient function aliases
export const fetchGoogleSuggestions = mineGoogleKeywordData
export const expandKeywordWithPaa = fetchPaaQuestions
export const expandKeywordWithAlphabet = fetchAlphabetSuggestions

