"use client"

import { usePathname } from "next/navigation"
import Script from "next/script"

export default function AdScripts() {
  const pathname = usePathname()

  // Strict check: DO NOT inject or execute any ads (AdSense or Adsterra popunder/banners)
  // on internal admin or telemetry pages (/imon, /imon/*, /embed/*)
  const isAdminOrInternal =
    pathname.startsWith("/imon") ||
    pathname.startsWith("/embed") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/imon-api")

  if (isAdminOrInternal) {
    return null
  }

  return (
    <>
      {/* Google AdSense Script */}
      <Script
        id="google-adsense"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2861472312283458"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Adsterra Popunder Script */}
      <Script
        id="ad-network-popunder"
        src="https://bauval.org/14/2309082ed44cbc9e4f1d7274aaad3b58"
        strategy="afterInteractive"
        data-cfasync="false"
      />

      {/* Adsterra Social Bar / In-Page Push (Guaranteed 100% Pageview Impressions) */}
      <Script
        id="ad-network-socialbar"
        src="https://bauval.org/14/783b5650645d44b7f89d76b1893bcba3"
        strategy="afterInteractive"
        data-cfasync="false"
      />
    </>
  )
}
