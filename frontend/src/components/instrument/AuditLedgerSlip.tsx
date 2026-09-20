"use client"

import React from "react"
import { Box, Typography } from "@mui/material"

interface LedgerRow {
  label: string
  value: string | number
  highlight?: boolean
  isTotal?: boolean
}

interface AuditLedgerSlipProps {
  title?: string
  rows?: LedgerRow[]
  items?: LedgerRow[]
  footerNote?: string
  recordId?: string
}

export const AuditLedgerSlip: React.FC<AuditLedgerSlipProps> = ({
  title = "FINANCIAL AUDIT LEDGER",
  rows,
  items,
  footerNote = "VERIFIED COMPUTATION",
  recordId = "TC-889211",
}) => {
  const displayRows = rows || items || []
  return (
    <Box
      sx={{
        position: "relative",
        background: "#ffffff",
        borderRadius: "12px",
        border: "1.5px solid #e2e8f0",
        boxShadow:
          "0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)",
        p: { xs: 2, sm: 3 },
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      }}
    >
      {/* Top Perforated Receipt Notch Line */}
      <Box
        sx={{
          position: "relative",
          borderBottom: "2px dashed #cbd5e1",
          pb: 1.5,
          mb: 2,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.85rem",
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: "#0f172a",
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.68rem",
            color: "#64748b",
            mt: 0.5,
          }}
        >
          <span>ID: {recordId}</span>
          <span>TryCalc Ledger v2.4</span>
        </Box>
      </Box>

      {/* Itemized Ledger Rows */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {displayRows.map((row, idx) => {
          if (row.isTotal) {
            return (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  pt: 1.2,
                  mt: 0.8,
                  borderTop: "2px dashed #94a3b8",
                  borderBottom: "3px double #0f172a",
                  pb: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {row.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    color: "#4338ca",
                  }}
                >
                  {row.value}
                </Typography>
              </Box>
            )
          }

          return (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 0.35,
                borderBottom: "1px dotted #e2e8f0",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.78rem",
                  color: row.highlight ? "#0f172a" : "#475569",
                  fontWeight: row.highlight ? 700 : 500,
                }}
              >
                {row.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  fontWeight: row.highlight ? 700 : 600,
                  color: row.highlight ? "#1e1b4b" : "#0f172a",
                }}
              >
                {row.value}
              </Typography>
            </Box>
          )
        })}
      </Box>

      {/* Bottom Official Verification Stamp */}
      <Box
        sx={{
          mt: 2.5,
          pt: 1.5,
          borderTop: "2px dashed #cbd5e1",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
            px: 1.2,
            py: 0.3,
            borderRadius: "4px",
            border: "1.5px solid #059669",
            color: "#059669",
            fontWeight: 800,
            fontSize: "0.68rem",
            letterSpacing: "0.08em",
            transform: "rotate(-1deg)",
          }}
        >
          <span>✓</span>
          <span>{footerNote}</span>
        </Box>

        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.65rem",
            color: "#94a3b8",
          }}
        >
          ISO 9001 PRECISION AUDITED
        </Typography>
      </Box>
    </Box>
  )
}
