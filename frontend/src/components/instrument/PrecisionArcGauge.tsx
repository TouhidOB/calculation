"use client"

import React from "react"
import { Box, Typography } from "@mui/material"

interface GaugeZone {
  min: number
  max: number
  color: string
  label: string
}

interface PrecisionArcGaugeProps {
  value: number
  min?: number
  max?: number
  unit?: string
  title?: string
  statusLabel?: string
  statusText?: string
  zones?: GaugeZone[]
}

const DEFAULT_BMI_ZONES: GaugeZone[] = [
  { min: 10, max: 18.5, color: "#3b82f6", label: "Underweight" },
  { min: 18.5, max: 24.9, color: "#10b981", label: "Normal" },
  { min: 25, max: 29.9, color: "#f59e0b", label: "Overweight" },
  { min: 30, max: 45, color: "#ef4444", label: "Obese" },
]

export const PrecisionArcGauge: React.FC<PrecisionArcGaugeProps> = ({
  value,
  min = 10,
  max = 45,
  unit = "",
  title = "HEALTH RATIO GAUGE",
  statusLabel,
  statusText,
  zones = DEFAULT_BMI_ZONES,
}) => {
  // Clamping value
  const clampedVal = Math.max(min, Math.min(max, value))
  // Calculate needle angle from -90deg to +90deg (180 deg sweep)
  const pct = (clampedVal - min) / (max - min)
  const angle = -90 + pct * 180

  // Arc path helpers
  const cx = 100
  const cy = 90
  const r = 70

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle)
    const end = polarToCartesian(x, y, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ")
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: "14px",
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontFamily: "monospace",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "#64748b",
          textTransform: "uppercase",
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Box sx={{ position: "relative", width: 220, height: 120 }}>
        <svg viewBox="0 0 200 110" width="100%" height="100%">
          {/* Background Track */}
          <path
            d={describeArc(cx, cy, r, -90, 90)}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Color Segments */}
          {zones.map((z, idx) => {
            const zStartPct = (Math.max(min, z.min) - min) / (max - min)
            const zEndPct = (Math.min(max, z.max) - min) / (max - min)
            const zStartAngle = -90 + zStartPct * 180
            const zEndAngle = -90 + zEndPct * 180
            return (
              <path
                key={idx}
                d={describeArc(cx, cy, r, zStartAngle, zEndAngle)}
                fill="none"
                stroke={z.color}
                strokeWidth="14"
                strokeLinecap={idx === 0 || idx === zones.length - 1 ? "round" : "butt"}
              />
            )
          })}

          {/* Center Pivot Hub */}
          <circle cx={cx} cy={cy} r="8" fill="#1e293b" />
          <circle cx={cx} cy={cy} r="4" fill="#94a3b8" />

          {/* Needle Pointer */}
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: `${cx}px ${cy}px`,
              transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <polygon
              points={`${cx - 2.5},${cy} ${cx + 2.5},${cy} ${cx},${cy - r + 5}`}
              fill="#0f172a"
              filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.3))"
            />
            <circle cx={cx} cy={cy - r + 5} r="2" fill="#ef4444" />
          </g>
        </svg>
      </Box>

      {/* Numeric Readout Below Gauge */}
      <Box sx={{ textAlign: "center", mt: -1 }}>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "1.7rem",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.1,
          }}
        >
          {value} {unit}
        </Typography>
        {(statusText || statusLabel) && (
          <Typography
            sx={{
              fontFamily: "sans-serif",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#334155",
              mt: 0.3,
            }}
          >
            {statusText || statusLabel}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
