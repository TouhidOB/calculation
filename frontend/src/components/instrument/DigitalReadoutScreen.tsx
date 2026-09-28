"use client"

import React from "react"
import { Box, Typography } from "@mui/material"

interface DigitalReadoutScreenProps {
  label: string
  value: string | number
  unit?: string
  statusBadge?: string | {
    text: string
    color?: string
  }
  subText?: string
  annunciators?: string[]
}

export const DigitalReadoutScreen: React.FC<DigitalReadoutScreenProps> = ({
  label,
  value,
  unit,
  statusBadge,
  subText,
  annunciators = ["CALC", "READY", "64-BIT"],
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: "16px",
        border: "1.5px solid #cbd5e1",
        boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)",
        p: { xs: 2.5, sm: 3 },
        overflow: "hidden",
      }}
    >
      {/* Top Accent Indicator Line */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)",
        }}
      />

      {/* Top Label & Badges Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          mb: 1.5,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: "0.78rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: "#475569",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>

        {/* Annunciator & Status Badges */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap" }}>
          {annunciators.map((ann, idx) => (
            <Box
              key={idx}
              sx={{
                px: 0.8,
                py: 0.25,
                borderRadius: "4px",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                color: "#475569",
                fontSize: "0.68rem",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              {ann}
            </Box>
          ))}
          {statusBadge && (
            <Box
              sx={{
                px: 1.2,
                py: 0.3,
                borderRadius: "9999px",
                background:
                  typeof statusBadge === "object" && statusBadge.color
                    ? `${statusBadge.color}15`
                    : "#ecfdf5",
                border: `1.5px solid ${
                  typeof statusBadge === "object" && statusBadge.color
                    ? statusBadge.color
                    : "#10b981"
                }`,
                color:
                  typeof statusBadge === "object" && statusBadge.color
                    ? statusBadge.color
                    : "#047857",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {typeof statusBadge === "string" ? statusBadge : statusBadge.text}
            </Box>
          )}
        </Box>
      </Box>

      {/* Main Large Metric Output */}
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          gap: 1.2,
          position: "relative",
          zIndex: 2,
          my: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: { xs: "2.4rem", sm: "3.2rem" },
            fontWeight: 900,
            color: "#0f172a",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {value}
        </Typography>
        {unit && (
          <Typography
            sx={{
              fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: { xs: "1.1rem", sm: "1.4rem" },
              fontWeight: 700,
              color: "#475569",
              letterSpacing: "-0.01em",
            }}
          >
            {unit}
          </Typography>
        )}
      </Box>

      {/* Sub-text / Footnote */}
      {subText && (
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "#64748b",
            fontWeight: 500,
            mt: 0.5,
            position: "relative",
            zIndex: 2,
          }}
        >
          {subText}
        </Typography>
      )}
    </Box>
  )
}
