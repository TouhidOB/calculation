import type { Metadata } from "next"
import Script from "next/script"
import ThemeRegistry from "@/theme/ThemeRegistry"
import OrganizationJsonLd from "@/components/OrganizationJsonLd"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trycalc.net"
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-KXFZGDCLVQ"
const siteName = "TryCalc"
const defaultTitle = "TryCalc — 690 Free Online Calculators | Finance, Health, Math & More"
const defaultDescription = "TryCalc offers 690 free online calculators for finance, mortgages, loans, health, fitness, construction, math, conversion, date/time, and engineering. Instant deterministic results, no signup required."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | TryCalc",
  },
  description: defaultDescription,
  alternates: {
    canonical: "./",
  },
  keywords: [
    "trycalc",
    "online calculator",
    "free online calculator",
    "finance calculator",
    "mortgage calculator",
    "bmi calculator",
    "compound interest calculator",
    "loan calculator",
    "retirement calculator",
    "construction calculator",
    "unit converter",
    "percentage calculator",
    "date calculator",
    "math solver",
  ],
  authors: [{ name: "TryCalc Team" }],
  creator: "TryCalc",
  publisher: "TryCalc",
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
        alt: "TryCalc - 690 Free Online Calculators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@trycalc",
    creator: "@trycalc",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  verification: {
    google: "googlec41ad06c9e4b72b6",
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
        <link rel="icon" href="/favicon-32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {/* Google Analytics (GA4) */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <OrganizationJsonLd />
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}