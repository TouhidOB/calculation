import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/app/imon-api/auth/route"
import { analyticsStore } from "@/lib/analytics-store"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("imon_token")?.value || req.headers.get("authorization")?.replace("Bearer ", "")

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ ok: false, error: "Unauthorized access" }, { status: 401 })
  }

  const timeframe = req.nextUrl.searchParams.get("timeframe") || "all"
  const audience = req.nextUrl.searchParams.get("audience") || "all"
  const country = req.nextUrl.searchParams.get("country") || "ALL"
  const stats = analyticsStore.getStats({ timeframe, audience, country })

  // Query Backend Database Daily Breakdown
  try {
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8088"
    const dbRes = await fetch(`${backendUrl}/api/analytics/stats/`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    })
    if (dbRes.ok) {
      const dbData = await dbRes.json()
      if (dbData.ok && Array.isArray(dbData.dailyBreakdown)) {
        stats.databaseDailyBreakdown = dbData.dailyBreakdown
        // Override lifetime and today with true multi-week database persistence if available
        if (dbData.lifetime?.visitors > 0) {
          stats.lifetimeVisits = dbData.lifetime.visitors
          stats.totalHitsLogged = dbData.lifetime.requests
        }
        if (dbData.today?.visitors > 0) {
          stats.todayVisits = dbData.today.visitors
        }
      }
    }
  } catch (err) {
    // Graceful fallback to in-memory stats
  }

  return NextResponse.json({ ok: true, stats })
}
