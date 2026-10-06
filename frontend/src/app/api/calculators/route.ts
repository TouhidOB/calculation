import { NextResponse } from "next/server"

const BACKEND = "http://backend:8000/api"

export async function GET() {
  const res = await fetch(`${BACKEND}/calculators/`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  })
  const data = await res.json()
  return NextResponse.json(data, {
    status: res.status,
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=120, must-revalidate",
    },
  })
}