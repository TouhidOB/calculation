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
        background: "linear-gradient(180deg, #090d16 0%, #111827 100%)",
        borderRadius: "16px",
        border: "2px solid #1f2937",
        boxShadow:
          "inset 0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(16, 185, 129, 0.05)",
        p: { xs: 2, sm: 2.5 },
        overflow: "hidden",
      }}
    >
      {/* Acrylic Glass Surface Highlight Glare */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40%",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top Annunciator & Label Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          mb: 1,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#9ca3af",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>

        {/* Annunciator Flags */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          {annunciators.map((ann, idx) => (
            <Box
              key={idx}
              sx={{
                px: 0.6,
                py: 0.15,
                borderRadius: "3px",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#6ee7b7",
                fontSize: "0.6rem",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              {ann}
            </Box>
          ))}
          {statusBadge && (
            <Box
              sx={{
                px: 1,
                py: 0.2,
                borderRadius: "4px",
                background:
                  typeof statusBadge === "object" && statusBadge.color
                    ? `${statusBadge.color}22`
                    : "rgba(99, 102, 241, 0.2)",
                border: `1px solid ${
                  typeof statusBadge === "object" && statusBadge.color
                    ? statusBadge.color
                    : "#818cf8"
                }`,
                color:
                  typeof statusBadge === "object" && statusBadge.color
                    ? statusBadge.color
                    : "#c7d2fe",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              {typeof statusBadge === "string" ? statusBadge : statusBadge.text}
            </Box>
          )}
        </Box>
      </Box>

      {/* Main Large Digital Metric */}
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          gap: 1.2,
          position: "relative",
          zIndex: 2,
          my: 0.5,
        }}
      >
        <Typography
          sx={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: { xs: "2rem", sm: "2.6rem" },
            fontWeight: 800,
            color: "#34d399",
            letterSpacing: "0.02em",
            lineHeight: 1.1,
            textShadow:
              "0 0 16px rgba(52, 211, 153, 0.4), 0 0 2px rgba(52, 211, 153, 0.8)",
          }}
        >
          {value}
        </Typography>
        {unit && (
          <Typography
            sx={{
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: { xs: "0.9rem", sm: "1.1rem" },
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: "0.04em",
            }}
          >
            {unit}
          </Typography>
        )}
      </Box>

      {/* Sub-text / Formula Note */}
      {subText && (
        <Typography
          sx={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "0.72rem",
            color: "#64748b",
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
