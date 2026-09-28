import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/app/imon-api/auth/route"
import { analyticsStore } from "@/lib/analytics-store"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("imon_token")?.value || req.headers.get("authorization")?.replace("Bearer ", "")

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ ok: false, error: "Unauthorized access" }, { status: 401 })
  }

  const timeframe = req.nextUrl.searchParams.get("timeframe") || "all"
  const stats = analyticsStore.getStats(timeframe)
  return NextResponse.json({ ok: true, stats })
}
