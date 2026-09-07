import { NextRequest, NextResponse } from "next/server"

const BACKEND = "http://backend:8000/api"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ calcId: string }> }
) {
  const { calcId } = await params
  const body = await request.json()
  
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