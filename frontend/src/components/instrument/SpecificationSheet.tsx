"use client"

import React from "react"
import { Box, Typography } from "@mui/material"

interface SpecItem {
  name: string
  quantity: string | number
  unit?: string
  note?: string
  highlight?: boolean
}

interface SpecificationSheetProps {
  title?: string
  items: SpecItem[]
  safetyMargin?: string
  summaryNote?: string
}

export const SpecificationSheet: React.FC<SpecificationSheetProps> = ({
  title = "BILL OF MATERIALS & SPECIFICATION",
  items,
  safetyMargin = "Includes recommended job-site safety allowance",
  summaryNote,
}) => {
  return (
    <Box
      sx={{
        background: "#ffffff",
        borderRadius: "12px",
        border: "1.5px solid #cbd5e1",
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
      }}
    >
      {/* Blueprint Technical Header */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
          color: "#f8fafc",
          px: 2.5,
          py: 1.5,
          borderBottom: "1.5px solid #334155",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.8rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            px: 1,
            py: 0.2,
            borderRadius: "4px",
            background: "rgba(255, 255, 255, 0.1)",
            fontSize: "0.68rem",
            fontFamily: "monospace",
            color: "#94a3b8",
          }}
        >
          SPEC SHEET
        </Box>
      </Box>

      {/* Material Table Grid */}
      <Box sx={{ p: { xs: 1.5, sm: 2.5 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto",
            gap: 1.2,
            pb: 1,
            borderBottom: "2px solid #e2e8f0",
            fontFamily: "monospace",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#64748b",
            textTransform: "uppercase",
          }}
        >
          <span>Material / Component</span>
          <span style={{ textAlign: "right" }}>Quantity</span>
          <span style={{ textAlign: "right" }}>Unit</span>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mt: 1 }}>
          {items.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: 1.2,
                alignItems: "center",
                py: 0.7,
                borderBottom: "1px solid #f1f5f9",
                background: item.highlight ? "#f8fafc" : "transparent",
                px: item.highlight ? 1 : 0,
                borderRadius: "4px",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: "sans-serif",
                    fontSize: "0.82rem",
                    fontWeight: item.highlight ? 700 : 600,
                    color: item.highlight ? "#0f172a" : "#334155",
                  }}
                >
                  {item.name}
                </Typography>
                {item.note && (
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.68rem",
                      color: "#94a3b8",
                    }}
                  >
                    {item.note}
                  </Typography>
                )}
              </Box>

              <Typography
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.92rem",
                  fontWeight: 800,
                  color: item.highlight ? "#4338ca" : "#0f172a",
                  textAlign: "right",
                }}
              >
                {item.quantity}
              </Typography>

              <Typography
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#64748b",
                  textAlign: "right",
                  minWidth: 40,
                }}
              >
                {item.unit || "—"}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Footer Technical Note */}
        <Box
          sx={{
            mt: 2,
            pt: 1.5,
            borderTop: "1px dashed #cbd5e1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.68rem",
              color: "#64748b",
            }}
          >
            ℹ {safetyMargin}
          </Typography>
          {summaryNote && (
            <Typography
              sx={{
                fontFamily: "monospace",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              {summaryNote}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}
