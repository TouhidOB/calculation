import { NextResponse } from "next/server"

export const dynamic = "force-static"

export async function GET() {
  const content = `# TryCalc.net ads.txt
# Google AdSense Publisher verification
# Replace placeholder upon AdSense approval:
# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
`
  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
