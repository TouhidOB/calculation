import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/app/imon-api/auth/route"

const BACKEND_INTERNAL_URL = process.env.BACKEND_URL || "http://backend:8000"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("imon_token")?.value || req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const res = await fetch(`${BACKEND_INTERNAL_URL}/api/seo/rankings/`, {
      cache: "no-store",
    })
    if (!res.ok) {
      throw new Error(`Django backend returned ${res.status}`)
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("[SEO Rankings API Proxy] Error:", err)
    return NextResponse.json({ ok: false, error: "Failed to fetch SEO rankings" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("imon_token")?.value || req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const res = await fetch(`${BACKEND_INTERNAL_URL}/api/seo/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    if (!res.ok) {
      throw new Error(`Django backend returned ${res.status}`)
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("[SEO Refresh API Proxy] Error:", err)
    return NextResponse.json({ ok: false, error: "Failed to refresh SEO rankings" }, { status: 500 })
  }
}
