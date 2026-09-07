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