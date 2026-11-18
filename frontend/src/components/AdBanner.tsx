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
  // native slots use a container div instead of atOptions/iframe format
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

// Injects atOptions + invoke.js directly into the container div (Adsterra SPA pattern).
// Returns a cleanup function that removes the injected nodes.
function injectAdsterraSlot(container: HTMLDivElement, config: AdsterraSlotConfig): () => void {
  // Clear any previous content to prevent duplicate injection on re-render
  container.innerHTML = ""

  if (config.isNative) {
    // Native banner: async script + container div (no atOptions)
    const containerDiv = document.createElement("div")
    containerDiv.id = `container-${config.key}`
    container.appendChild(containerDiv)

    const script = document.createElement("script")
    script.async = true
    script.dataset.cfasync = "false"
    script.src = config.invokeUrl
    container.appendChild(script)

    return () => {
      container.innerHTML = ""
    }
  }

  // Standard banner: atOptions config script + invoke.js script
  const optionsScript = document.createElement("script")
  optionsScript.type = "text/javascript"
  optionsScript.text = [
    "atOptions = {",
    `  'key': '${config.key}',`,
    "  'format': 'iframe',",
    `  'height': ${config.height},`,
    `  'width': ${config.width},`,
    "  'params': {}",
    "};",
  ].join("\n")
  container.appendChild(optionsScript)

  const invokeScript = document.createElement("script")
  invokeScript.type = "text/javascript"
  invokeScript.src = config.invokeUrl
  container.appendChild(invokeScript)

  return () => {
    container.innerHTML = ""
  }
}

function AdsterraSlot({ slotKey }: { slotKey: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const injectedKey = useRef<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Skip re-injection if slotKey unchanged (avoids duplicate on StrictMode double-invoke)
    if (injectedKey.current === slotKey) return
    injectedKey.current = slotKey

    const config = ADSTERRA_SLOTS[slotKey]
    if (!config) return

    const cleanup = injectAdsterraSlot(container, config)
    return () => {
      injectedKey.current = null
      cleanup()
    }
  }, [slotKey])

  const config = ADSTERRA_SLOTS[slotKey]
  if (!config) return null

  return (
    <div
      ref={containerRef}
      style={{
        width: config.width,
        height: config.height,
        maxWidth: config.maxWidth,
        margin: "0 auto",
        overflow: "hidden",
      }}
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

  useEffect(() => {
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
    pathname?.startsWith("/api")
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
          <AdsterraSlot key={slotKey} slotKey={slotKey} />
        </Box>
      )}
    </Box>
  )
}
