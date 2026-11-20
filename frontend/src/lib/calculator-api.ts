/**
 * Calculator API client — talks to Next.js API routes which proxy to Django backend.
 *
 * Uses relative URLs that hit our own /api/* routes (server-side proxy to backend).
 */

export interface CalcFieldDef {
  name: string
  label: string
  type: "number" | "select" | "date" | "text"
  unit: string
  required: boolean
  default: number | string | null
  options: { value: string; label: string }[] | null
  min: number | null
  max: number | null
  step: number | null
  help: string
}

export interface CalculatorDef {
  id: string
  name: string
  category: string
  description: string
  fields: CalcFieldDef[]
}

export interface CategoryMap {
  [category: string]: CalculatorDef[]
}

export interface RunResult {
  ok: boolean
  calculator: string
  result: Record<string, unknown>
}

export interface RunError {
  errors: string[]
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const body = await res.json()
      detail = body.errors?.join("; ") || body.error || body.detail || detail
    } catch { /* keep default */ }
    throw new Error(detail)
  }
  return res.json() as Promise<T>
}

let cachedCalculatorsPromise: Promise<{ categories: CategoryMap; total: number }> | null = null
const calcCache = new Map<string, Promise<CalculatorDef>>()

export async function listCalculators(): Promise<{ categories: CategoryMap; total: number }> {
  if (cachedCalculatorsPromise) {
    return cachedCalculatorsPromise
  }
  cachedCalculatorsPromise = handle<{ categories: CategoryMap; total: number }>(
    await fetch("/api/calculators/")
  ).catch((err) => {
    cachedCalculatorsPromise = null
    throw err
  })
  return cachedCalculatorsPromise
}

export async function getCalculator(id: string): Promise<CalculatorDef> {
  const cached = calcCache.get(id)
  if (cached) {
    return cached
  }
  const p = handle<CalculatorDef>(
    await fetch(`/api/calculators/${id}/`)
  ).catch((err) => {
    calcCache.delete(id)
    throw err
  })
  calcCache.set(id, p)
  return p
}

export async function runCalculator(
  id: string,
  values: Record<string, string | number>
): Promise<RunResult> {
  return handle(
    await fetch(`/api/calculators/${id}/run/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
  )
}

export async function getCalculatorScript(id: string): Promise<{ js_key: string; script: string }> {
  return handle(
    await fetch(`/api/calculators/${id}/script/`, { cache: "no-store" })
  )
}

export const CATEGORY_META: Record<string, { label: string; emoji: string; color: string }> = {
  finance: { label: "Finance", emoji: "", color: "#2563eb" },
  business_investment: { label: "Business & Investment", emoji: "", color: "#334155" },
  health: { label: "Health & Fitness", emoji: "", color: "#0f766e" },
  construction: { label: "Construction", emoji: "", color: "#b45309" },
  basic: { label: "Basic & Math", emoji: "", color: "#475569" },
  conversion: { label: "Unit Conversion", emoji: "", color: "#0284c7" },
  storage: { label: "Storage & Infrastructure", emoji: "", color: "#1d4ed8" },
  date_time: { label: "Date & Time", emoji: "", color: "#0369a1" },
  education: { label: "Education & Academic", emoji: "", color: "#3730a3" },
  real_estate: { label: "Real Estate & Mortgage", emoji: "", color: "#047857" },
  event_budget: { label: "Event & Budget", emoji: "", color: "#9a3412" },
  ai_helper: { label: "AI & Token Computation", emoji: "", color: "#475569" },
  mobile_servicing: { label: "Mobile Servicing", emoji: "", color: "#0284c7" },
  repair_business: { label: "Repair Business", emoji: "", color: "#0f766e" },
}