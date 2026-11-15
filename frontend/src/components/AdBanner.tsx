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

interface AdsterraConfig {
  src: string
  width: number | string
  height: number
  maxWidth: number | string
}

const getAdsterraConfig = (variant: AdVariant, isMobile: boolean): AdsterraConfig => {
  switch (variant) {
    case "rectangle":
      return {
        src: "/ads/banner-300x250.html",
        width: 300,
        height: 250,
        maxWidth: 300,
      }
    case "skyscraper":
      return {
        src: "/ads/skyscraper-160x600.html",
        width: 160,
        height: 600,
        maxWidth: 160,
      }
    case "native":
      return {
        src: "/ads/native-banner.html",
        width: "100%",
        height: 160,
        maxWidth: "100%",
      }
    case "leaderboard":
    default:
      return isMobile
        ? {
            src: "/ads/banner-320x50.html",
            width: 320,
            height: 50,
            maxWidth: 320,
          }
        : {
            src: "/ads/banner-728x90.html",
            width: 728,
            height: 90,
            maxWidth: 728,
          }
  }
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

  // Screen size detection (mobile < 768px vs desktop >= 768px)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)

  // Map format or variant prop
  const effectiveVariant: AdVariant =
    variant !== "auto"
      ? variant
      : format === "rectangle"
      ? "rectangle"
      : "leaderboard"

  // Allow switching to AdSense if explicitly passed and active, default to Adsterra
  const useAdSense = (provider === "adsense" || (Boolean(slot) && provider !== "adsterra")) && Boolean(slot)

  // Screen detection after mount and dynamic resize listener
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

  // AdSense execution fallback
  const publisherId = "ca-pub-2861472312283458"
  useEffect(() => {
    if (!useAdSense || isPushed.current) return
    try {
      if (typeof window !== "undefined") {
        const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []
        adsbygoogle.push({})
        isPushed.current = true
      }
    } catch {
      // Ignore adsbygoogle errors
    }
  }, [useAdSense, pathname])

  const adConfig = getAdsterraConfig(effectiveVariant, isMobile)

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
            maxWidth: adConfig.maxWidth,
            height: adConfig.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            mx: "auto",
          }}
        >
          {mounted ? (
            <iframe
              key={`${pathname || ""}-${effectiveVariant}-${isMobile ? "m" : "d"}`}
              src={`${adConfig.src}?p=${encodeURIComponent(pathname || "")}`}
              title="Advertisement"
              width={adConfig.width}
              height={adConfig.height}
              loading="lazy"
              scrolling="no"
              frameBorder="0"
              allow="autoplay 'none'; camera 'none'; microphone 'none'"
              style={{
                border: 0,
                overflow: "hidden",
                display: "block",
                maxWidth: "100%",
                margin: "0 auto",
              }}
            />
          ) : null}
        </Box>
      )}
    </Box>
  )
}
