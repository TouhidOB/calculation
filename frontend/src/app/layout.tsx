import type { Metadata } from "next"
import ThemeRegistry from "@/theme/ThemeRegistry"
import OrganizationJsonLd from "@/components/OrganizationJsonLd"

const siteUrl = "https://calchub.io"
const siteName = "CalcHub"
const defaultTitle = "CalcHub — 689 Free Online Calculators"
const defaultDescription = "Free online calculators for finance, health, construction, conversion, math, date/time, real estate, and more. 689 calculators across 11 categories with instant results. No signup required."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | CalcHub",
  },
  description: defaultDescription,
  keywords: [
    "online calculator",
    "free calculator",
    "finance calculator",
    "mortgage calculator",
    "bmi calculator",
    "compound interest calculator",
    "loan calculator",
    "retirement calculator",
    "construction calculator",
    "unit converter",
    "percentage calculator",
    "calchub",
  ],
  authors: [{ name: "CalcHub Team" }],
  creator: "CalcHub",
  publisher: "CalcHub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CalcHub - Free Online Calculators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@calchub",
    creator: "@calchub",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og-image.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "tools",
  classification: "Free Online Calculators",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="canonical" href={siteUrl} />
        <link rel="icon" href="/favicon-32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <OrganizationJsonLd />
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}