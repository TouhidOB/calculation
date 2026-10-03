import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/app/imon-api/auth/route"

const DJANGO_API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.INTERNAL_API_URL || "http://127.0.0.1:8000"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("imon_token")?.value || req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const res = await fetch(`${DJANGO_API_BASE}/api/seo/rankings/`, {
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
    const res = await fetch(`${DJANGO_API_BASE}/api/seo/refresh/`, {
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
