/* Utility functions for calculator components */
import { clsx } from "clsx"

export function cn(...inputs: (string | boolean | undefined)[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(amount)
}

export function calculatePercent(part: number, total: number): number {
  if (total === 0) return 0
  return Math.round((part / total) * 100 * 100) / 100
}

export function stripEmojis(str: string): string {
  if (!str) return ""
  return str.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{20E3}\u{3297}\u{3299}\u{303D}\u{3030}\u{24C2}]/gu, "").trim()
}