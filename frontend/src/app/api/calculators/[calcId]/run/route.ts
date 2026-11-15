import { NextRequest, NextResponse } from "next/server"
import { getCustomCalculator, executeCustomCalculation } from "@/lib/custom-calculators"

const BACKEND = "http://backend:8000/api"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ calcId: string }> }
) {
  const { calcId } = await params
  const body = await request.json()

  // 1. Check custom dynamically generated calculators
  const custom = getCustomCalculator(calcId)
  if (custom) {
    const calcResult = executeCustomCalculation(calcId, body)
    return NextResponse.json({
      ok: !calcResult.error,
      calculator: calcId,
      result: calcResult,
    })
  }

  // 2. Fall back to backend
  const res = await fetch(`${BACKEND}/calculators/${calcId}/run/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
