"use client"

import React, { useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Chip from "@mui/material/Chip"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import CloseIcon from "@mui/icons-material/Close"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CheckIcon from "@mui/icons-material/Check"
import CodeIcon from "@mui/icons-material/Code"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import VisibilityIcon from "@mui/icons-material/Visibility"
import type { CalculatorDef } from "@/lib/calculator-api"

interface CalculatorEmbedDialogProps {
  open: boolean
  onClose: () => void
  calc: CalculatorDef
  onToast: (msg: string) => void
}

export default function CalculatorEmbedDialog({
  open,
  onClose,
  calc,
  onToast,
}: CalculatorEmbedDialogProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code")

  const slug = calc.id
  const embedUrl = `https://trycalc.net/embed/${slug}`
  const canonicalUrl = `https://trycalc.net/calculators/${slug}`

  // Standard responsive embed code matching the requirement
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" style="border:1px solid #e2e8f0; border-radius:8px;"></iframe><div style="font-size:11px; text-align:right; margin-top:4px;">Powered by <a href="${canonicalUrl}" target="_blank" rel="noopener">TryCalc</a></div>`

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(embedCode).then(() => {
        setCopied(true)
        onToast("Embed snippet copied to clipboard!")
        setTimeout(() => setCopied(false), 2500)
      })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { bgcolor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)" },
        },
        paper: {
          sx: {
            borderRadius: 3.5,
            border: "1px solid #cbd5e1",
            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 2.5,
          bgcolor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: "#e0e7ff",
              color: "#4338ca",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CodeIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: 16, sm: 18 } }}>
              Embed {calc.name} Widget
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
              Free responsive iframe widget for your blog, CMS, or website
            </Typography>
          </Box>
        </Stack>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close dialog"
          sx={{ color: "#64748b", "&:hover": { bgcolor: "#e2e8f0", color: "#0f172a" } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="body2" sx={{ color: "#475569", mb: 2, lineHeight: 1.6 }}>
          Integrate the interactive <strong>{calc.name}</strong> directly into your web pages. Simply copy the snippet below and paste it into WordPress, Webflow, Wix, Squarespace, or any HTML file.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 0.75 }}>
          <Chip label="100% Free" size="small" sx={{ bgcolor: "#ecfdf5", color: "#047857", fontWeight: 700, fontSize: 11 }} />
          <Chip label="Responsive" size="small" sx={{ bgcolor: "#eff6ff", color: "#1d4ed8", fontWeight: 700, fontSize: 11 }} />
          <Chip label="Auto-Updates" size="small" sx={{ bgcolor: "#fdf4ff", color: "#a21caf", fontWeight: 700, fontSize: 11 }} />
          <Chip label="Zero Ad Clutter" size="small" sx={{ bgcolor: "#fffbeb", color: "#b45309", fontWeight: 700, fontSize: 11 }} />
        </Stack>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ minHeight: 38 }}
          >
            <Tab
              value="code"
              label="HTML Embed Code"
              icon={<CodeIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              sx={{ minHeight: 38, textTransform: "none", fontWeight: 700, fontSize: 13 }}
            />
            <Tab
              value="preview"
              label="Live Widget Preview"
              icon={<VisibilityIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              sx={{ minHeight: 38, textTransform: "none", fontWeight: 700, fontSize: 13 }}
            />
          </Tabs>
        </Box>

        {activeTab === "code" ? (
          <Box>
            <Box
              sx={{
                p: 2,
                bgcolor: "#0f172a",
                color: "#f8fafc",
                borderRadius: 2.5,
                border: "1px solid #334155",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: { xs: 11.5, sm: 12.5 },
                lineHeight: 1.6,
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
                userSelect: "all",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {embedCode}
            </Box>

            <Typography variant="caption" sx={{ color: "#64748b", mt: 1.5, display: "block" }}>
              💡 <strong>Placement Tip:</strong> In WordPress, add a <em>Custom HTML</em> block and paste this snippet. The calculator automatically stretches to fill its parent container width while maintaining a sleek 600px height.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2.5, overflow: "hidden", bgcolor: "#f8fafc" }}>
            <Box sx={{ p: 1, px: 2, bgcolor: "#f1f5f9", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569" }}>
                Preview Window (600px height)
              </Typography>
              <Button
                component="a"
                href={embedUrl}
                target="_blank"
                rel="noopener"
                size="small"
                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                sx={{ textTransform: "none", fontSize: 11, fontWeight: 700 }}
              >
                Open in new tab
              </Button>
            </Box>
            <iframe
              src={embedUrl}
              width="100%"
              height="480"
              style={{ border: "none", display: "block", background: "#ffffff" }}
              title={`${calc.name} Widget Preview`}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: "none", color: "#64748b", fontWeight: 600, fontSize: 13 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCopy}
          startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            fontSize: 13,
            bgcolor: copied ? "#16a34a" : "#2563eb",
            "&:hover": { bgcolor: copied ? "#15803d" : "#1d4ed8" },
            px: 2.5,
            borderRadius: 2,
            boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
          }}
        >
          {copied ? "Copied Embed Code!" : "Copy Embed Code"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
