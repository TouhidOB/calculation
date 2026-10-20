"use client"

import React, { useEffect, useRef } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

interface AdBannerProps {
  slot?: string
  format?: "auto" | "rectangle" | "horizontal" | "fluid"
  responsive?: boolean
  layoutKey?: string
  style?: React.CSSProperties
  className?: string
  minHeight?: number | string
}

export default function AdBanner({
  slot,
  format = "auto",
  responsive = true,
  layoutKey,
  style,
  className = "",
  minHeight = 100,
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement | null>(null)
  const isPushed = useRef(false)

  const publisherId = "ca-pub-2861472312283458"
  // Default fallback slot or user-configured slot
  const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_RESULT_SLOT

  // If no ad slot is configured (e.g. site is pending approval or slot ID not created yet),
  // do not render empty dashed placeholders that can trigger AdSense 'site under construction' flags.
  if (!adSlot) {
    return null
  }

  useEffect(() => {
    // Only push once per mount and if element is in DOM
    if (isPushed.current) return

    try {
      if (typeof window !== "undefined") {
        const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []
        adsbygoogle.push({})
        isPushed.current = true
      }
    } catch (err) {
      // Ignore adsbygoogle errors (e.g. adblocker active or duplicate push)
    }
  }, [])

  return (
    <Box
      className={`no-print ${className}`}
      sx={{
        my: 2.5,
        textAlign: "center",
        width: "100%",
        overflow: "hidden",
        bgcolor: "#f8fafc",
        border: "1px dashed #e2e8f0",
        borderRadius: 2.5,
        p: 1.5,
        minHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
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
        }}
      >
        Advertisement
      </Typography>

      <Box sx={{ width: "100%", minHeight: 90, display: "flex", justifyContent: "center" }}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: "block",
            width: "100%",
            textAlign: "center",
          }}
          data-ad-client={publisherId}
          {...(adSlot ? { "data-ad-slot": adSlot } : {})}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
          {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
        />
      </Box>
    </Box>
  )
}
