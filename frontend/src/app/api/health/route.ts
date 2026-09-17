import { NextResponse } from "next/server"

const BACKEND = "http://backend:8000/api"

export async function GET() {
  const res = await fetch(`${BACKEND}/health/`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}