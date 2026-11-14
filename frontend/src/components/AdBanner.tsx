"use client"

import React, { useEffect, useRef, useState, useId } from "react"
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

const ADSTERRA_CONFIGS = {
  leaderboard_desktop: {
    key: "de76315577db984790c237ee9c2956b7",
    width: 728,
    height: 90,
    src: "https://bauval.org/22/de76315577db984790c237ee9c2956b7",
  },
  leaderboard_mobile: {
    key: "588309ac0db6954132d031da985925e6",
    width: 320,
    height: 50,
    src: "https://bauval.org/22/588309ac0db6954132d031da985925e6",
  },
  rectangle: {
    key: "2998d7717a6167b642b7e993ac6b83cd",
    width: 300,
    height: 250,
    src: "https://bauval.org/22/2998d7717a6167b642b7e993ac6b83cd",
  },
  skyscraper: {
    key: "9c34faf322cd1e96726811c02338f33e",
    width: 160,
    height: 600,
    src: "https://bauval.org/22/9c34faf322cd1e96726811c02338f33e",
  },
  native: {
    containerId: "container-629019d94e390a3219d8e53e10cec964",
    src: "https://bauval.org/21/629019d94e390a3219d8e53e10cec964",
  },
}

// Module-level serial queue ensuring multiple Adsterra instances inject and execute in top window
// without global atOptions race conditions or DOM collisions.
type AdsterraTask = () => Promise<void>
let adQueue: Promise<void> = Promise.resolve()

function enqueueAdsterra(task: AdsterraTask) {
  adQueue = adQueue.then(task).catch(() => {})
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
  const containerRef = useRef<HTMLDivElement | null>(null)
  const adsenseRef = useRef<HTMLModElement | null>(null)
  const isPushed = useRef(false)
  const rawId = useId()
  const adId = rawId.replace(/[^a-zA-Z0-9_-]/g, "_")

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

  // Screen detection after mount
  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
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
  }, [useAdSense])

  // Direct DOM Container Ref Pattern for Adsterra (top window execution for anti-fraud checks)
  useEffect(() => {
    if (useAdSense || !mounted) return

    let isCancelled = false
    const container = containerRef.current
    if (!container) return

    enqueueAdsterra(() => {
      return new Promise<void>((resolve) => {
        if (isCancelled || !containerRef.current) {
          resolve()
          return
        }

        const currentContainer = containerRef.current
        currentContainer.innerHTML = ""

        if (effectiveVariant === "native") {
          // Native Banner (HTML container + async script)
          const nativeContainer = document.createElement("div")
          nativeContainer.id = ADSTERRA_CONFIGS.native.containerId
          nativeContainer.style.width = "100%"
          nativeContainer.style.maxWidth = "100%"

          const adScript = document.createElement("script")
          adScript.type = "text/javascript"
          adScript.async = true
          adScript.setAttribute("data-cfasync", "false")
          adScript.src = ADSTERRA_CONFIGS.native.src

          let completed = false
          const done = () => {
            if (completed) return
            completed = true
            clearTimeout(timeoutTimer)
            setTimeout(resolve, 80)
          }

          adScript.onload = done
          adScript.onerror = done
          const timeoutTimer = setTimeout(done, 2500)

          try {
            currentContainer.appendChild(nativeContainer)
            currentContainer.appendChild(adScript)
          } catch {
            done()
          }
          return
        }

        // Leaderboard (desktop 728x90, mobile 320x50), Rectangle (300x250), or Skyscraper (160x600)
        const config =
          effectiveVariant === "rectangle"
            ? ADSTERRA_CONFIGS.rectangle
            : effectiveVariant === "skyscraper"
            ? ADSTERRA_CONFIGS.skyscraper
            : isMobile
            ? ADSTERRA_CONFIGS.leaderboard_mobile
            : ADSTERRA_CONFIGS.leaderboard_desktop

        // Set global top window atOptions for Adsterra
        if (typeof window !== "undefined") {
          ;(window as unknown as { atOptions?: unknown }).atOptions = {
            key: config.key,
            format: "iframe",
            height: config.height,
            width: config.width,
            params: {},
          }
        }

        // Inline config script
        const confScript = document.createElement("script")
        confScript.type = "text/javascript"
        confScript.text = `atOptions = {
          'key' : '${config.key}',
          'format' : 'iframe',
          'height' : ${config.height},
          'width' : ${config.width},
          'params' : {}
        };`

        // External invocation script
        const adScript = document.createElement("script")
        adScript.type = "text/javascript"
        adScript.src = config.src
        adScript.async = true

        let completed = false
        const done = () => {
          if (completed) return
          completed = true
          clearTimeout(timeoutTimer)
          // Short delay to allow DOM attachment to settle before next queued ad
          setTimeout(resolve, 80)
        }

        adScript.onload = done
        adScript.onerror = done
        const timeoutTimer = setTimeout(done, 2500)

        try {
          currentContainer.appendChild(confScript)
          currentContainer.appendChild(adScript)
        } catch {
          done()
        }
      })
    })

    return () => {
      isCancelled = true
      if (container) {
        container.innerHTML = ""
      }
    }
  }, [useAdSense, mounted, isMobile, effectiveVariant])

  const calculatedMinHeight =
    minHeight ??
    (effectiveVariant === "skyscraper"
      ? 620
      : effectiveVariant === "rectangle"
      ? 270
      : effectiveVariant === "native"
      ? 140
      : isMobile
      ? 66
      : 106)

  const innerDimensions =
    effectiveVariant === "rectangle"
      ? { maxWidth: 300, minHeight: 250, height: 250 }
      : effectiveVariant === "skyscraper"
      ? { maxWidth: 160, minHeight: 600, height: 600 }
      : effectiveVariant === "native"
      ? { maxWidth: "100%", minHeight: 120, height: "auto" }
      : {
          maxWidth: isMobile ? 320 : 728,
          minHeight: isMobile ? 50 : 90,
          height: isMobile ? 50 : 90,
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
          ref={containerRef}
          id={`adsterra-banner-${adId}`}
          sx={{
            width: "100%",
            ...innerDimensions,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            mx: "auto",
            "& iframe": {
              maxWidth: "100%",
              display: "block",
              margin: "0 auto",
            },
            "& #container-629019d94e390a3219d8e53e10cec964": {
              width: "100%",
              maxWidth: "100%",
            },
          }}
        />
      )}
    </Box>
  )
}
