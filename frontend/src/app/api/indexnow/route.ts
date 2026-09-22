import { NextResponse } from "next/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"
const INDEXNOW_KEY = "4f89d31b26a849769e55728be26c117d"
const KEY_LOCATION = `${SITE_URL}/4f89d31b26a849769e55728be26c117d.txt`

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const host = new URL(SITE_URL).host
    const urlList: string[] = body.urls || [
      SITE_URL,
      `${SITE_URL}/category/finance`,
      `${SITE_URL}/category/health`,
      `${SITE_URL}/category/construction`,
      `${SITE_URL}/category/business_investment`,
      `${SITE_URL}/category/basic`,
      `${SITE_URL}/category/conversion`,
      `${SITE_URL}/category/date_time`,
      `${SITE_URL}/category/education`,
      `${SITE_URL}/category/real_estate`,
      `${SITE_URL}/category/event_budget`,
    ]

    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }

    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    })

    return NextResponse.json({
      success: res.ok || res.status === 200 || res.status === 202,
      status: res.status,
      submittedUrls: urlList.length,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    indexnowKey: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    hint: "Send POST with optional { urls: string[] } to batch submit to Bing / IndexNow",
  })
}
