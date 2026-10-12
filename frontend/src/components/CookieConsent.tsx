"use client"

import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Link from "next/link"

const CONSENT_KEY = "trycalc_cookie_consent_v1"

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      setVisible(true)
    }
  }, [])

  if (!mounted || !visible) return null

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted")
    setVisible(false)
  }

  return (
    <Box
      className="no-print"
      sx={{
        position: "fixed",
        bottom: { xs: 12, sm: 20 },
        left: { xs: 12, sm: 20 },
        right: { xs: 12, sm: "auto" },
        maxWidth: { sm: 460 },
        zIndex: 9999,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: 3.5,
          bgcolor: "#ffffff",
          border: "1px solid #cbd5e1",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)",
        }}
      >
        <Stack spacing={1.5}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                bgcolor: "rgba(79, 70, 229, 0.1)",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              🍪
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
              Privacy &amp; Cookie Compliance
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6, fontSize: 13 }}>
            TryCalc uses cookies to analyze traffic, personalize calculation utilities, and deliver policy-compliant advertisements through Google AdSense. By continuing to use our tools, you agree to our{" "}
            <Link href="/privacy" style={{ color: "#4f46e5", textDecoration: "underline", fontWeight: 600 }}>
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" style={{ color: "#4f46e5", textDecoration: "underline", fontWeight: 600 }}>
              Terms of Service
            </Link>.
          </Typography>

          <Stack direction="row" spacing={1.5} sx={{ pt: 0.5, justifyContent: "flex-end" }}>
            <Button
              component={Link}
              href="/privacy"
              size="small"
              sx={{
                color: "#64748b",
                textTransform: "none",
                fontWeight: 600,
                fontSize: 13,
                "&:hover": { color: "#0f172a" },
              }}
            >
              Learn More
            </Button>
            <Button
              onClick={handleAccept}
              variant="contained"
              size="small"
              sx={{
                bgcolor: "#4f46e5",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 700,
                fontSize: 13,
                borderRadius: "8px",
                px: 2.5,
                "&:hover": { bgcolor: "#4338ca" },
              }}
            >
              Accept Cookies
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}
