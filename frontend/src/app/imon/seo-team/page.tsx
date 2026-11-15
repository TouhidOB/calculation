import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/app/imon-api/auth/route"
import SeoExpertTeamView from "@/components/SeoExpertTeamView"

export const metadata: Metadata = {
  title: "AI SEO Expert Team & Research War-Room | TryCalc Super Admin",
  description: "Internal AI SEO expert keyword discovery, blueprinting, and approval war-room.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default async function SeoTeamPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("imon_token")?.value
  const isAuthenticated = token ? verifyToken(token) : false

  if (!isAuthenticated) {
    redirect("/imon")
  }

  return <SeoExpertTeamView />
}
