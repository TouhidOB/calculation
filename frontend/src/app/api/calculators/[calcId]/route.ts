import { NextRequest, NextResponse } from "next/server"

const BACKEND = "http://backend:8000/api"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ calcId: string }> }
) {
  const { calcId } = await params
  const res = await fetch(`${BACKEND}/calculators/${calcId}/`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}