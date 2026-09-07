import type { Metadata } from "next"
import ThemeRegistry from "@/theme/ThemeRegistry"

export const metadata: Metadata = {
  title: "CalcHub — 40+ Online Calculators",
  description: "Finance, health, construction, garments & conversion calculators.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}