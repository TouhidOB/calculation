"use client"

import * as React from "react"
import Link from "next/link"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import CalculateIcon from "@mui/icons-material/Calculate"

export interface RelatedCalcItem {
  id: string
  name: string
  description: string
  category?: string
}

interface RelatedCalculatorsSectionProps {
  calculators: RelatedCalcItem[]
  currentCategory: string
  categoryLabel?: string
  categoryColor?: string
  title?: string
  subtitle?: string
}

export default function RelatedCalculatorsSection({
  calculators,
  currentCategory,
  categoryLabel,
  categoryColor = "#4f46e5",
  title = "Recommended Next Tools",
  subtitle,
}: RelatedCalculatorsSectionProps) {
  if (!calculators || calculators.length === 0) {
    return null
  }

  const catLabel = categoryLabel || currentCategory.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  const items = calculators.slice(0, 4)

  return (
    <Box
      component="section"
      className="no-print"
      aria-label={title}
      sx={{
        my: { xs: 3.5, md: 4.5 },
        p: { xs: 2.5, sm: 3.5 },
        bgcolor: "#ffffff",
        borderRadius: 4,
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 8px 30px rgba(15, 23, 42, 0.04)",
        "@media print": { display: "none !important" },
      }}
    >
      {/* Header with Title, Context Subtitle, and Category Hub Link */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 3,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", mb: 0.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                bgcolor: "#eef2ff",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(79, 70, 229, 0.15)",
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                fontSize: { xs: 19, sm: 22 },
                letterSpacing: "-0.4px",
              }}
            >
              {title}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: "#475569", fontSize: { xs: 13, sm: 14 } }}>
            {subtitle || `Explore popular companion calculators in ${catLabel} to continue your workflow`}
          </Typography>
        </Box>

        <Button
          component={Link}
          href={`/category/${currentCategory}`}
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            fontSize: 13,
            color: "#4f46e5",
            bgcolor: "#eef2ff",
            px: 2,
            py: 0.8,
            borderRadius: "10px",
            border: "1px solid #e0e7ff",
            transition: "all 0.15s ease",
            "&:hover": {
              bgcolor: "#4f46e5",
              color: "#ffffff",
              borderColor: "#4f46e5",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
            },
          }}
        >
          View All in {catLabel}
        </Button>
      </Box>

      {/* Sleek Grid of 4 Related Calculator Cards */}
      <Grid container spacing={2.5}>
        {items.map((calcItem) => (
          <Grid key={calcItem.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#ffffff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 3.5,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  borderColor: "#4f46e5",
                  boxShadow: "0 16px 32px -8px rgba(79, 70, 229, 0.14), 0 4px 12px rgba(15, 23, 42, 0.05)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardActionArea
                component={Link}
                href={`/calculators/${calcItem.id}`}
                sx={{
                  p: 2.5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  flexGrow: 1,
                  textAlign: "left",
                }}
              >
                {/* Top Badge Row */}
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", width: "100%", mb: 1.5 }}>
                  <Chip
                    size="small"
                    label={catLabel}
                    sx={{
                      bgcolor: `${categoryColor}16`,
                      color: categoryColor,
                      fontWeight: 700,
                      fontSize: 11,
                      height: 22,
                      borderRadius: "6px",
                      border: `1px solid ${categoryColor}30`,
                    }}
                  />
                  <Box
                    sx={{
                      ml: "auto !important",
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      bgcolor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CalculateIcon sx={{ fontSize: 13 }} />
                  </Box>
                </Stack>

                {/* Calculator Title */}
                <Typography
                  variant="subtitle1"
                  component="h3"
                  sx={{
                    fontWeight: 800,
                    color: "#0f172a",
                    fontSize: "0.98rem",
                    lineHeight: 1.35,
                    mb: 1,
                    letterSpacing: "-0.2px",
                  }}
                >
                  {calcItem.name}
                </Typography>

                {/* Brief Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: "#475569",
                    fontSize: "0.825rem",
                    lineHeight: 1.5,
                    mb: 2.5,
                    flexGrow: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {calcItem.description || "Free instant online calculation tool calibrated for accurate results."}
                </Typography>

                {/* High Contrast Clean 'Open Calculator' Button */}
                <Box
                  sx={{
                    mt: "auto",
                    width: "100%",
                    py: 1,
                    px: 2,
                    borderRadius: "10px",
                    bgcolor: "#0f172a",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.825rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.8,
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 4px rgba(15, 23, 42, 0.12)",
                    ".MuiCardActionArea-root:hover &": {
                      bgcolor: "#4f46e5",
                      boxShadow: "0 6px 16px rgba(79, 70, 229, 0.35)",
                    },
                  }}
                >
                  <span>Open Calculator</span>
                  <ArrowForwardIcon sx={{ fontSize: 15 }} />
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
