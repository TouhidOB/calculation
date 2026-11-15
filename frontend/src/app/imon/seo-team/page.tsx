import type { Metadata } from "next"
import SeoExpertTeamView from "@/components/SeoExpertTeamView"

export const metadata: Metadata = {
  title: "AI SEO Expert Team & Research War-Room | TryCalc Admin",
  description: "Internal AI SEO expert keyword discovery, blueprinting, and approval war-room.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default function SeoTeamPage() {
  return <SeoExpertTeamView />
}
