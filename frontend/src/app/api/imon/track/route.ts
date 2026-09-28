import { NextRequest, NextResponse } from "next/server"
import { analyticsStore } from "@/lib/analytics-store"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, path, referrer, durationSeconds } = body

    if (!sessionId || !path) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const forwarded = req.headers.get("x-forwarded-for")
    const realIp = req.headers.get("x-real-ip")
    const cfIp = req.headers.get("cf-connecting-ip")
    const ip = (cfIp || realIp || (forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1"))

    const userAgent = req.headers.get("user-agent") || ""
    const isBot = analyticsStore.detectBot(userAgent)

    // Resolve country
    const cfCountry = req.headers.get("cf-ipcountry")
    let countryCode = cfCountry || "XX"
    let countryName = "Unknown"
    let city = ""

    if (cfCountry && cfCountry !== "XX") {
      countryCode = cfCountry
      countryName = cfCountry
    } else {
      const geo = await analyticsStore.resolveGeo(ip)
      countryCode = geo.countryCode
      countryName = geo.countryName
      city = geo.city
    }

    analyticsStore.recordEvent({
      sessionId,
      ip,
      countryCode,
      countryName,
      city,
      path: path.split("?")[0], // clean query params
      referrer: referrer || "",
      userAgent,
      isBot,
      durationSeconds: Number(durationSeconds) || 0,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
