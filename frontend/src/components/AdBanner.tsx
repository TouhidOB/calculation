"use client"

import React, { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

export type AdVariant = "leaderboard" | "rectangle" | "skyscraper" | "native" | "auto"

export interface AdBannerProps {
  variant?: AdVariant
  provider?: "adsterra" | "adsense"
  slot?: string
  format?: "auto" | "rectangle" | "horizontal" | "fluid"
  responsive?: boolean
  layoutKey?: string
  style?: React.CSSProperties
  className?: string
  minHeight?: number | string
}

interface AdsterraSlotConfig {
  key: string
  invokeUrl: string
  width: number | string
  height: number
  maxWidth: number | string
  isNative?: boolean
}

const ADSTERRA_SLOTS: Record<string, AdsterraSlotConfig> = {
  "leaderboard-desktop": {
    key: "de76315577db984790c237ee9c2956b7",
    invokeUrl: "https://bauval.org/22/de76315577db984790c237ee9c2956b7",
    width: 728,
    height: 90,
    maxWidth: 728,
  },
  "leaderboard-mobile": {
    key: "588309ac0db6954132d031da985925e6",
    invokeUrl: "https://bauval.org/22/588309ac0db6954132d031da985925e6",
    width: 320,
    height: 50,
    maxWidth: 320,
  },
  rectangle: {
    key: "2998d7717a6167b642b7e993ac6b83cd",
    invokeUrl: "https://bauval.org/22/2998d7717a6167b642b7e993ac6b83cd",
    width: 300,
    height: 250,
    maxWidth: 300,
  },
  skyscraper: {
    key: "9c34faf322cd1e96726811c02338f33e",
    invokeUrl: "https://bauval.org/22/9c34faf322cd1e96726811c02338f33e",
    width: 160,
    height: 600,
    maxWidth: 160,
  },
  native: {
    key: "629019d94e390a3219d8e53e10cec964",
    invokeUrl: "https://bauval.org/21/629019d94e390a3219d8e53e10cec964",
    width: "100%",
    height: 160,
    maxWidth: "100%",
    isNative: true,
  },
}

function getSlotKey(variant: AdVariant, isMobile: boolean): string {
  switch (variant) {
    case "rectangle":
      return "rectangle"
    case "skyscraper":
      return "skyscraper"
    case "native":
      return "native"
    case "leaderboard":
    default:
      return isMobile ? "leaderboard-mobile" : "leaderboard-desktop"
  }
}

function AdsterraSlot({ slotKey }: { slotKey: string }) {
  const config = ADSTERRA_SLOTS[slotKey]
  if (!config) return null

  const srcDoc = config.isNative
    ? `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  </style>
</head>
<body>
  <div id="container-${config.key}"></div>
  <script async="async" data-cfasync="false" src="${config.invokeUrl}"></script>
</body>
</html>`
    : `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key': '${config.key}',
      'format': 'iframe',
      'height': ${config.height},
      'width': ${config.width},
      'params': {}
    };
  </script>
  <script type="text/javascript" src="${config.invokeUrl}"></script>
</body>
</html>`

  const widthStyle = typeof config.width === "number" ? `${config.width}px` : config.width
  const maxWidthStyle = typeof config.maxWidth === "number" ? `${config.maxWidth}px` : config.maxWidth

  return (
    <iframe
      key={slotKey}
      title={`ad-${slotKey}`}
      srcDoc={srcDoc}
      width={config.width}
      height={config.height}
      style={{
        width: widthStyle,
        height: `${config.height}px`,
        maxWidth: maxWidthStyle,
        border: "none",
        overflow: "hidden",
        display: "block",
        margin: "0 auto",
      }}
      scrolling="no"
    />
  )
}

export default function AdBanner({
  variant = "auto",
  provider = "adsterra",
  slot,
  format = "auto",
  responsive = true,
  layoutKey,
  style,
  className = "",
  minHeight,
}: AdBannerProps) {
  const pathname = usePathname()
  const adsenseRef = useRef<HTMLModElement | null>(null)
  const isPushed = useRef(false)

  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile((prev) => (prev !== mobile ? mobile : prev))
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Guard: never render ads on admin/embed/api routes
  if (
    pathname?.startsWith("/imon") ||
    pathname?.startsWith("/embed") ||
    pathname?.startsWith("/api") ||
    pathname?.startsWith("/imon-api")
  ) {
    return null
  }

  const effectiveVariant: AdVariant =
    variant !== "auto"
      ? variant
      : format === "rectangle"
      ? "rectangle"
      : "leaderboard"

  const useAdSense =
    (provider === "adsense" || (Boolean(slot) && provider !== "adsterra")) && Boolean(slot)

  const publisherId = "ca-pub-2861472312283458"

  // AdSense push (only once per mount)
  useEffect(() => {
    if (!useAdSense || isPushed.current) return
    try {
      if (typeof window !== "undefined") {
        const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []
        adsbygoogle.push({})
        isPushed.current = true
      }
    } catch {
      // ignore
    }
  }, [useAdSense, pathname])

  const slotKey = getSlotKey(effectiveVariant, isMobile)
  const adConfig = ADSTERRA_SLOTS[slotKey]

  const calculatedMinHeight =
    minHeight ??
    (effectiveVariant === "skyscraper"
      ? 620
      : effectiveVariant === "rectangle"
      ? 270
      : effectiveVariant === "native"
      ? 180
      : isMobile
      ? 66
      : 106)

  if (!mounted) {
    return (
      <Box
        className={`no-print ${className}`}
        sx={{
          my: 2.5,
          minHeight: calculatedMinHeight,
          ...style,
        }}
      />
    )
  }

  return (
    <Box
      className={`no-print ${className}`}
      sx={{
        my: 2.5,
        textAlign: "center",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        bgcolor: "#f8fafc",
        border: "1px dashed #e2e8f0",
        borderRadius: 2.5,
        p: { xs: 1, sm: 1.5 },
        minHeight: calculatedMinHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        boxSizing: "border-box",
        "@media print": {
          display: "none !important",
        },
        ...style,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: "block",
          fontSize: "0.65rem",
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          mb: 0.5,
          userSelect: "none",
        }}
      >
        Advertisement
      </Typography>

      {useAdSense ? (
        <Box sx={{ width: "100%", minHeight: 90, display: "flex", justifyContent: "center" }}>
          <ins
            ref={adsenseRef}
            className="adsbygoogle"
            style={{
              display: "block",
              width: "100%",
              textAlign: "center",
            }}
            data-ad-client={publisherId}
            {...(slot ? { "data-ad-slot": slot } : {})}
            data-ad-format={format}
            data-full-width-responsive={responsive ? "true" : "false"}
            {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            maxWidth: adConfig?.maxWidth ?? "100%",
            height: adConfig?.height ?? "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            mx: "auto",
          }}
        >
          <AdsterraSlot slotKey={slotKey} />
        </Box>
      )}
    </Box>
  )
}
