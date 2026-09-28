import type { Metadata } from "next"
import ImonAdminView from "@/components/ImonAdminView"

export const metadata: Metadata = {
  title: "TryCalc Admin Telemetry & Control Hub",
  description: "Internal traffic monitoring and 3D telemetry dashboard.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default function ImonAdminPage() {
  return <ImonAdminView />
}
