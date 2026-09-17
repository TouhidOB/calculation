import { NextResponse } from "next/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000"

export const revalidate = 86400

export async function GET() {
  let listText = ""
  try {
    const res = await fetch(`${BACKEND_URL}/api/calculators/`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    })
    if (res.ok) {
      const data = await res.json()
      if (data && data.categories) {
        for (const [catName, list] of Object.entries<any>(data.categories)) {
          listText += `\n### Category: ${catName.toUpperCase()}\n`
          if (Array.isArray(list)) {
            for (const item of list) {
              listText += `- [${item.name}](${SITE_URL}/calculators/${item.id}): ${item.description || "Instant online calculation"}\n`
            }
          }
        }
      }
    }
  } catch (err) {
    listText = "\nCould not fetch complete list dynamically.\n"
  }

  const content = `# TryCalc Full Calculators Index (Machine-Readable Directory)
> Complete listing of 690 free online calculators on TryCalc (${SITE_URL}) for AI assistants, LLMs, and automated agents.

${listText}
`

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
