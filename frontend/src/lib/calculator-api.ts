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

export async function listCalculators(): Promise<{ categories: CategoryMap; total: number }> {
  return handle(
    await fetch("/api/calculators", { cache: "no-store" })
  )
}

export async function getCalculator(id: string): Promise<CalculatorDef> {
  return handle(
    await fetch(`/api/calculators/${id}`, { cache: "no-store" })
  )
}

export async function runCalculator(
  id: string,
  values: Record<string, string | number>
): Promise<RunResult> {
  return handle(
    await fetch(`/api/calculators/${id}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
  )
}

export const CATEGORY_META: Record<string, { label: string; emoji: string; color: string }> = {
  finance: { label: "Finance", emoji: "💰", color: "#6366f1" },
  business_investment: { label: "Business & Investment", emoji: "📈", color: "#8b5cf6" },
  health: { label: "Health & Fitness", emoji: "❤️", color: "#10b981" },
  construction: { label: "Construction", emoji: "🏗️", color: "#f59e0b" },
  basic: { label: "Basic & Math", emoji: "🧮", color: "#6b7280" },
  garments: { label: "Garments (RMG)", emoji: "👕", color: "#ec4899" },
  conversion: { label: "Unit Conversion", emoji: "🔄", color: "#06b6d4" },
}