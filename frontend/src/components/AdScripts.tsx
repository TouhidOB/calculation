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
        strategy="lazyOnload"
      />

      {/* Adsterra / Third-party Network Script */}
      <Script
        id="ad-network-tag"
        src="https://bauval.org/14/2309082ed44cbc9e4f1d7274aaad3b58"
        strategy="lazyOnload"
      />
    </>
  )
}
