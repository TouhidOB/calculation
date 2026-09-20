"use client"

import React from "react"
import { Box, Typography } from "@mui/material"

interface InstrumentChassisProps {
  children: React.ReactNode
  title?: string
  categoryName?: string
  categoryEmoji?: string
  isCalculating?: boolean
  onReset?: () => void
  onFillExample?: () => void
}

export const InstrumentChassis: React.FC<InstrumentChassisProps> = ({
  children,
  title,
  categoryName,
  categoryEmoji = "⚡",
  isCalculating = false,
  onReset,
  onFillExample,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        background: "linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)",
        borderRadius: "24px",
        border: "1.5px solid #cbd5e1",
        boxShadow:
          "0 24px 48px -12px rgba(15, 23, 42, 0.14), 0 8px 16px -4px rgba(15, 23, 42, 0.06), inset 0 1px 2px #ffffff",
        overflow: "hidden",
        mb: 4,
      }}
    >
      {/* 4 Corner Screw Rivets */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "radial-gradient(circle, #cbd5e1 30%, #94a3b8 100%)",
          boxShadow: "inset 0 1px 1px #fff, 0 1px 2px rgba(0,0,0,0.25)",
          zIndex: 3,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "radial-gradient(circle, #cbd5e1 30%, #94a3b8 100%)",
          boxShadow: "inset 0 1px 1px #fff, 0 1px 2px rgba(0,0,0,0.25)",
          zIndex: 3,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "radial-gradient(circle, #cbd5e1 30%, #94a3b8 100%)",
          boxShadow: "inset 0 1px 1px #fff, 0 1px 2px rgba(0,0,0,0.25)",
          zIndex: 3,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          right: 10,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "radial-gradient(circle, #cbd5e1 30%, #94a3b8 100%)",
          boxShadow: "inset 0 1px 1px #fff, 0 1px 2px rgba(0,0,0,0.25)",
          zIndex: 3,
        }}
      />

      {/* Top Precision Hardware Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          px: { xs: 2.5, sm: 3.5 },
          py: 1.5,
          background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
          borderBottom: "1.5px solid #334155",
          color: "#f8fafc",
        }}
      >
        {/* Left: Status LED Indicator */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box
            sx={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              bgcolor: isCalculating ? "#f59e0b" : "#10b981",
              boxShadow: isCalculating
                ? "0 0 10px #f59e0b, 0 0 4px #f59e0b"
                : "0 0 10px #10b981, 0 0 4px #10b981",
              animation: isCalculating
                ? "pulse 0.8s infinite ease-in-out"
                : "none",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 1, transform: "scale(1)" },
                "50%": { opacity: 0.4, transform: "scale(0.85)" },
              },
            }}
          />
          <Typography
            sx={{
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: isCalculating ? "#fcd34d" : "#a7f3d0",
              textTransform: "uppercase",
            }}
          >
            {isCalculating ? "COMPUTING..." : "CONSOLE READY"}
          </Typography>
        </Box>

        {/* Center: Hardware Instrument Badge */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.4,
            borderRadius: "6px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "#cbd5e1",
              textTransform: "uppercase",
            }}
          >
            TRYCALC INSTRUMENTS · MODEL TC-689
          </Typography>
        </Box>

        {/* Right: Technical Specification Badge */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {categoryName && (
            <Box
              sx={{
                px: 1.2,
                py: 0.3,
                borderRadius: "4px",
                background: "rgba(99, 102, 241, 0.18)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                fontSize: "0.68rem",
                fontWeight: 600,
                color: "#c7d2fe",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <span>{categoryEmoji}</span>
              <span>{categoryName}</span>
            </Box>
          )}
          <Box
            sx={{
              px: 1,
              py: 0.3,
              borderRadius: "4px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              fontSize: "0.68rem",
              fontFamily: "monospace",
              color: "#94a3b8",
            }}
          >
            64-BIT PRECISION
          </Box>
        </Box>
      </Box>

      {/* Main Console Interior Deck */}
      <Box sx={{ p: { xs: 2, sm: 3.5 }, position: "relative", zIndex: 2 }}>
        {children}
      </Box>

      {/* Bottom Trim Bar */}
      <Box
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          py: 1,
          background: "linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%)",
          borderTop: "1px solid #94a3b8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#475569",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
        }}
      >
        <Typography sx={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600 }}>
          {title ? `${title} · ` : ""}TryCalc Universal Engine
        </Typography>
        <Typography
          sx={{
            fontSize: "0.68rem",
            color: "#64748b",
            fontFamily: "monospace",
            display: { xs: "none", sm: "block" },
          }}
        >
          CALIBRATED · HIGH ACCURACY
        </Typography>
      </Box>
    </Box>
  )
}
