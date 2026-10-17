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
        
        const dbLifetimeVisitors = dbData.lifetime?.visitors || 0
        const dbLifetimeRequests = dbData.lifetime?.requests || 0
        const dbTodayVisitors = dbData.today?.visitors || 0
        const dbTodayRequests = dbData.today?.requests || 0

        // Multi-week SQLite database persistence
        if (dbLifetimeVisitors > 0) {
          stats.lifetimeVisits = dbLifetimeVisitors
          stats.totalHitsLogged = dbLifetimeRequests
        }
        if (dbTodayVisitors > 0) {
          stats.todayVisits = Math.max(stats.todayVisits, dbTodayVisitors)
        }

        // Calculate period slices from daily breakdown
        interface DailyRow {
          date: string
          realHumanVisitors?: number
          botRequests?: number
          totalRequests?: number
          uniqueIps?: number
        }

        const breakdown = dbData.dailyBreakdown as DailyRow[]
        let breakdownSlice = breakdown
        if (timeframe === "today") {
          const todayStr = new Date().toISOString().split("T")[0]
          breakdownSlice = breakdown.filter((d) => d.date === todayStr)
        } else if (timeframe === "7d") {
          breakdownSlice = breakdown.slice(0, 7)
        } else if (timeframe === "30d") {
          breakdownSlice = breakdown.slice(0, 30)
        }

        const dbPeriodHuman = breakdownSlice.reduce((sum, r) => sum + (r.realHumanVisitors || 0), 0)
        const dbPeriodBots = breakdownSlice.reduce((sum, r) => sum + (r.botRequests || 0), 0)
        const dbPeriodRequests = breakdownSlice.reduce((sum, r) => sum + (r.totalRequests || 0), 0)
        const dbPeriodUniqueIps = breakdownSlice.reduce((sum, r) => sum + (r.uniqueIps || 0), 0)

        const todayRow = breakdown.find((d) => d.date === new Date().toISOString().split("T")[0])
        const dbTodayBots = todayRow?.botRequests || 0
        const dbTodayUniqueIps = todayRow?.uniqueIps || dbTodayVisitors

        // When viewing global (country === "ALL"), bridge the persistent database metrics
        if (country === "ALL") {
          if (timeframe === "all") {
            const totalHuman = Math.max(stats.humanVisitsCount, dbLifetimeVisitors)
            const totalBots = Math.max(stats.botVisitsCount, Math.max(0, dbLifetimeRequests - totalHuman))
            stats.humanVisitsCount = totalHuman
            stats.botVisitsCount = totalBots
            stats.totalVisits = totalHuman + totalBots
            stats.lifetimeVisits = Math.max(stats.lifetimeVisits, dbLifetimeVisitors)
            stats.totalHitsLogged = Math.max(stats.totalHitsLogged, dbLifetimeRequests, stats.totalVisits)

            if (audience === "human") {
              stats.filteredVisits = totalHuman
            } else if (audience === "bots") {
              stats.filteredVisits = totalBots
            } else {
              stats.filteredVisits = stats.totalVisits
            }

            if (dbLifetimeVisitors > 0) {
              stats.uniqueVisitorIPs = Math.max(stats.uniqueVisitorIPs, dbLifetimeVisitors)
              stats.filteredUniqueIPs = Math.max(stats.filteredUniqueIPs, stats.uniqueVisitorIPs)
            }
          } else if (timeframe === "30d" || timeframe === "7d") {
            const periodHuman = Math.max(stats.humanVisitsCount, dbPeriodHuman)
            const periodBots = Math.max(stats.botVisitsCount, dbPeriodBots, Math.max(0, dbPeriodRequests - periodHuman))
            stats.humanVisitsCount = periodHuman
            stats.botVisitsCount = periodBots
            stats.totalVisits = periodHuman + periodBots

            if (audience === "human") {
              stats.filteredVisits = periodHuman
            } else if (audience === "bots") {
              stats.filteredVisits = periodBots
            } else {
              stats.filteredVisits = stats.totalVisits
            }

            if (dbPeriodUniqueIps > 0) {
              stats.filteredUniqueIPs = Math.max(stats.filteredUniqueIPs, dbPeriodUniqueIps)
            }
          } else if (timeframe === "today") {
            const todayHuman = Math.max(stats.humanVisitsCount, dbTodayVisitors)
            const todayBots = Math.max(stats.botVisitsCount, dbTodayBots, Math.max(0, dbTodayRequests - todayHuman))
            stats.humanVisitsCount = todayHuman
            stats.botVisitsCount = todayBots
            stats.totalVisits = todayHuman + todayBots

            if (audience === "human") {
              stats.filteredVisits = todayHuman
            } else if (audience === "bots") {
              stats.filteredVisits = todayBots
            } else {
              stats.filteredVisits = stats.totalVisits
            }

            if (dbTodayUniqueIps > 0) {
              stats.filteredUniqueIPs = Math.max(stats.filteredUniqueIPs, dbTodayUniqueIps)
            }
          }

          // Recalculate human / bot ratio
          const totalVis = stats.humanVisitsCount + stats.botVisitsCount
          if (totalVis > 0) {
            stats.humanPercentage = Number(((stats.humanVisitsCount / totalVis) * 100).toFixed(1))
            stats.botPercentage = Number(((stats.botVisitsCount / totalVis) * 100).toFixed(1))
          }
        }
      }
    }
  } catch (err) {
    // Graceful fallback to in-memory stats
  }

  return NextResponse.json({ ok: true, stats })
}
