import { NextRequest, NextResponse } from "next/server"
import { getCustomCalculator } from "@/lib/custom-calculators"

const BACKEND = "http://backend:8000/api"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ calcId: string }> }
) {
  const { calcId } = await params

  // 1. Check custom dynamically generated calculators
  const custom = getCustomCalculator(calcId)
  if (custom) {
    return NextResponse.json(custom, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    })
  }

  // 2. Fall back to backend
  const res = await fetch(`${BACKEND}/calculators/${calcId}/`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  })
  const data = await res.json()
  return NextResponse.json(data, {
    status: res.status,
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
