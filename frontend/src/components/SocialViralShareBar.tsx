"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"

// MUI Icons
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CheckIcon from "@mui/icons-material/Check"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import RedditIcon from "@mui/icons-material/Reddit"
import XIcon from "@mui/icons-material/X"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import FacebookIcon from "@mui/icons-material/Facebook"
import CodeIcon from "@mui/icons-material/Code"
import ShareIcon from "@mui/icons-material/Share"

import type { CalculatorDef } from "@/lib/calculator-api"

interface SocialViralShareBarProps {
  calc: CalculatorDef
  shareUrl?: string
  onEmbedClick: () => void
  onToast: (msg: string) => void
  compact?: boolean
}

export default function SocialViralShareBar({
  calc,
  shareUrl: customShareUrl,
  onEmbedClick,
  onToast,
  compact = false,
}: SocialViralShareBarProps) {
  const [copied, setCopied] = useState(false)

  const currentUrl =
    customShareUrl ||
    (typeof window !== "undefined"
      ? window.location.href
      : `https://trycalc.net/calculators/${calc.id}`)

  const shareTitle = `${calc.name} — Free Online Calculator`
  const shareText = `Calculate ${calc.name} instantly for free on TryCalc:`

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} — ${currentUrl}`)}`
  const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(`${shareTitle} | TryCalc`)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}&via=trycalc`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setCopied(true)
        onToast("Link copied to clipboard!")
        setTimeout(() => setCopied(false), 2500)
      })
    }
  }

  const handleSocialClick = (url: string) => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer,width=640,height=560")
    }
  }

  return (
    <Paper
      elevation={0}
      className="no-print"
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px -2px rgba(15,23,42,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1.5,
        mb: 2.5,
        "@media print": { display: "none !important" },
      }}
    >
      {/* Left: Label */}
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "7px",
            bgcolor: "#eff6ff",
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShareIcon sx={{ fontSize: 16 }} />
        </Box>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            fontSize: { xs: 12.5, sm: 13.5 },
            letterSpacing: "-0.2px",
          }}
        >
          Share this tool:
        </Typography>
      </Stack>

      {/* Center & Right: Action buttons */}
      <Stack
        direction="row"
        spacing={{ xs: 0.75, sm: 1 }}
        sx={{
          alignItems: "center",
          flexWrap: "wrap",
          gap: { xs: 0.75, sm: 1 },
        }}
      >
        {/* Copy Link */}
        <Button
          size="small"
          variant="outlined"
          onClick={handleCopyLink}
          startIcon={copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            fontSize: 12,
            px: 1.5,
            py: 0.6,
            color: copied ? "#16a34a" : "#334155",
            borderColor: copied ? "#86efac" : "#cbd5e1",
            bgcolor: copied ? "#f0fdf4" : "#f8fafc",
            "&:hover": {
              bgcolor: copied ? "#dcfce7" : "#f1f5f9",
              borderColor: copied ? "#4ade80" : "#94a3b8",
            },
            transition: "all 0.15s ease",
          }}
        >
          {copied ? "Copied!" : "Copy Link"}
        </Button>

        {/* WhatsApp */}
        <Tooltip title="Share on WhatsApp" arrow>
          <IconButton
            size="small"
            aria-label="Share on WhatsApp"
            onClick={() => handleSocialClick(whatsappUrl)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              bgcolor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#16a34a",
              "&:hover": {
                bgcolor: "#25D366",
                borderColor: "#25D366",
                color: "#ffffff",
                transform: "translateY(-1px)",
              },
              transition: "all 0.15s ease",
            }}
          >
            <WhatsAppIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>

        {/* Reddit */}
        <Tooltip title="Share on Reddit" arrow>
          <IconButton
            size="small"
            aria-label="Share on Reddit"
            onClick={() => handleSocialClick(redditUrl)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              bgcolor: "#fff7ed",
              border: "1px solid #fed7aa",
              color: "#ea580c",
              "&:hover": {
                bgcolor: "#FF4500",
                borderColor: "#FF4500",
                color: "#ffffff",
                transform: "translateY(-1px)",
              },
              transition: "all 0.15s ease",
            }}
          >
            <RedditIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>

        {/* X (Twitter) */}
        <Tooltip title="Share on X (Twitter)" arrow>
          <IconButton
            size="small"
            aria-label="Share on X"
            onClick={() => handleSocialClick(twitterUrl)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              bgcolor: "#f8fafc",
              border: "1px solid #cbd5e1",
              color: "#0f172a",
              "&:hover": {
                bgcolor: "#000000",
                borderColor: "#000000",
                color: "#ffffff",
                transform: "translateY(-1px)",
              },
              transition: "all 0.15s ease",
            }}
          >
            <XIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>

        {/* LinkedIn */}
        <Tooltip title="Share on LinkedIn" arrow>
          <IconButton
            size="small"
            aria-label="Share on LinkedIn"
            onClick={() => handleSocialClick(linkedinUrl)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              bgcolor: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#2563eb",
              "&:hover": {
                bgcolor: "#0A66C2",
                borderColor: "#0A66C2",
                color: "#ffffff",
                transform: "translateY(-1px)",
              },
              transition: "all 0.15s ease",
            }}
          >
            <LinkedInIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>

        {/* Facebook */}
        <Tooltip title="Share on Facebook" arrow>
          <IconButton
            size="small"
            aria-label="Share on Facebook"
            onClick={() => handleSocialClick(facebookUrl)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              bgcolor: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#1d4ed8",
              "&:hover": {
                bgcolor: "#1877F2",
                borderColor: "#1877F2",
                color: "#ffffff",
                transform: "translateY(-1px)",
              },
              transition: "all 0.15s ease",
            }}
          >
            <FacebookIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>

        {/* Embed Widget Button */}
        <Button
          size="small"
          variant="contained"
          onClick={onEmbedClick}
          startIcon={<CodeIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            fontSize: 12,
            px: 1.8,
            py: 0.6,
            bgcolor: "#4338ca",
            color: "#ffffff",
            boxShadow: "0 2px 4px rgba(67, 56, 202, 0.2)",
            "&:hover": {
              bgcolor: "#3730a3",
              boxShadow: "0 4px 8px rgba(67, 56, 202, 0.3)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.15s ease",
          }}
        >
          {"</>"} Embed
        </Button>
      </Stack>
    </Paper>
  )
}
