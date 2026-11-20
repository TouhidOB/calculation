"use client"

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"

export default function StickyAdBanner() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const dismissed = sessionStorage.getItem("trycalc_sticky_ad_dismissed")
    if (!dismissed) {
      setIsOpen(true)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!mounted || !isOpen) return null

  // Guard: do not show on admin, embed, or api routes
  if (
    pathname?.startsWith("/imon") ||
    pathname?.startsWith("/embed") ||
    pathname?.startsWith("/api") ||
    pathname?.startsWith("/imon-api")
  ) {
    return null
  }

  const handleDismiss = () => {
    setIsOpen(false)
    try {
      sessionStorage.setItem("trycalc_sticky_ad_dismissed", "1")
    } catch {
      // ignore
    }
  }

  // 320x50 on mobile, 728x90 on desktop
  const slotConfig = isMobile
    ? {
        key: "588309ac0db6954132d031da985925e6",
        invokeUrl: "https://bauval.org/22/588309ac0db6954132d031da985925e6",
        width: 320,
        height: 50,
      }
    : {
        key: "de76315577db984790c237ee9c2956b7",
        invokeUrl: "https://bauval.org/22/de76315577db984790c237ee9c2956b7",
        width: 728,
        height: 90,
      }

  const srcDoc = `<!DOCTYPE html>
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
      'key': '${slotConfig.key}',
      'format': 'iframe',
      'height': ${slotConfig.height},
      'width': ${slotConfig.width},
      'params': {}
    };
  </script>
  <script type="text/javascript" src="${slotConfig.invokeUrl}"></script>
</body>
</html>`

  return (
    <Box
      className="no-print"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        bgcolor: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        boxShadow: "0 -4px 16px rgba(15, 23, 42, 0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 0.5,
        px: 1,
        transition: "transform 0.3s ease-in-out",
        "@media print": {
          display: "none !important",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: isMobile ? 360 : 760,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 0.5,
          mb: 0.25,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.6rem",
            fontWeight: 700,
            color: "#94a3b8",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            userSelect: "none",
          }}
        >
          Sponsored
        </Typography>

        <IconButton
          size="small"
          onClick={handleDismiss}
          aria-label="Close ad"
          sx={{
            p: 0.25,
            color: "#64748b",
            "&:hover": {
              color: "#0f172a",
              bgcolor: "#f1f5f9",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          width: slotConfig.width,
          height: slotConfig.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <iframe
          key={`${slotConfig.key}-${isMobile ? "m" : "d"}`}
          title="sponsored-anchor-ad"
          srcDoc={srcDoc}
          width={slotConfig.width}
          height={slotConfig.height}
          style={{
            width: `${slotConfig.width}px`,
            height: `${slotConfig.height}px`,
            border: "none",
            overflow: "hidden",
            display: "block",
          }}
          scrolling="no"
        />
      </Box>
    </Box>
  )
}
