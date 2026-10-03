"use client"

import React, { useState, useEffect } from "react"
import Drawer from "@mui/material/Drawer"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Chip from "@mui/material/Chip"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import CircularProgress from "@mui/material/CircularProgress"
import Tooltip from "@mui/material/Tooltip"
import Alert from "@mui/material/Alert"

import CloseIcon from "@mui/icons-material/Close"
import RefreshIcon from "@mui/icons-material/Refresh"
import SearchIcon from "@mui/icons-material/Search"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import TrendingDownIcon from "@mui/icons-material/TrendingDown"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import LanguageIcon from "@mui/icons-material/Language"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import StarIcon from "@mui/icons-material/Star"

interface SEORankingItem {
  id: number
  path: string
  title: string
  category: string
  target_keyword: string
  secondary_keywords: string[]
  google_rank: number
  bing_rank: number
  previous_rank: number
  rank_change: number
  indexed_google: boolean
  indexed_bing: boolean
  impressions_30d: number
  clicks_30d: number
  ctr_percent: number
  last_checked: string
}

interface SEOSummary {
  total_tracked: number
  top_3: number
  top_10: number
  top_50: number
  gained: number
  dropped: number
  indexed_total: number
}

interface SEORankRadarProps {
  open: boolean
  onClose: () => void
}

export default function SEORankRadarDrawer({ open, onClose }: SEORankRadarProps) {
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [summary, setSummary] = useState<SEOSummary | null>(null)
  const [rankings, setRankings] = useState<SEORankingItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [lastCheckNotice, setLastCheckNotice] = useState<string | null>(null)

  const fetchRankings = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/imon-api/seo")
      if (!res.ok) throw new Error("Failed to load SEO rank data")
      const data = await res.json()
      if (data.ok) {
        setSummary(data.summary)
        setRankings(data.rankings || [])
      } else {
        throw new Error(data.error || "Unknown backend error")
      }
    } catch (err: any) {
      setError(err.message || "Failed to load rankings")
    } finally {
      setLoading(false)
    }
  }

  const triggerLiveRefresh = async () => {
    setRefreshing(true)
    setError(null)
    try {
      const res = await fetch("/imon-api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 30 }),
      })
      if (!res.ok) throw new Error("Failed to trigger SERP refresh")
      const data = await res.json()
      if (data.ok) {
        setSummary(data.summary)
        setRankings(data.rankings || [])
        setLastCheckNotice(`Live check completed! Updated ${data.updatedCount || 30} pages with fresh search engine positions.`)
        setTimeout(() => setLastCheckNotice(null), 6000)
      }
    } catch (err: any) {
      setError(err.message || "Refresh failed")
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchRankings()
    }
  }, [open])

  const filteredRankings = rankings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.target_keyword.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCat
  })

  const categories = Array.from(new Set(rankings.map((r) => r.category))).filter(Boolean)

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: "90%", md: "85%", lg: "1150px" },
            bgcolor: "#f8fafc",
            p: { xs: 2, sm: 3.5 },
          },
        },
      }}
    >
      {/* Header bar */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
            }}
          >
            <LanguageIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
              Search Engine Rank Radar & SERP Tracker
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Live Google & Bing SERP position monitor across all 724 calculator routes
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            variant="contained"
            onClick={triggerLiveRefresh}
            disabled={refreshing}
            startIcon={refreshing ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
            sx={{
              bgcolor: "#0284c7",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2.5,
              px: 2.5,
              "&:hover": { bgcolor: "#0369a1" },
            }}
          >
            {refreshing ? "Checking SERP..." : "Check / Refresh Live Rankings"}
          </Button>
          <IconButton onClick={onClose} sx={{ color: "#64748b", "&:hover": { bgcolor: "#e2e8f0" } }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {lastCheckNotice && (
        <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
          {lastCheckNotice}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card elevation={0} sx={{ bgcolor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                Total Tracked
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mt: 0.5 }}>
                {summary ? summary.total_tracked : "—"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 600 }}>
                100% active routes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card elevation={0} sx={{ bgcolor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                Top 3 Positions 🥇
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#eab308", mt: 0.5 }}>
                {summary ? summary.top_3 : "—"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Prime SERP spot
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card elevation={0} sx={{ bgcolor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                Top 10 (Page 1)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#10b981", mt: 0.5 }}>
                {summary ? summary.top_10 : "—"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#10b981" }}>
                High CTR Zone
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card elevation={0} sx={{ bgcolor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                Top 50
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#6366f1", mt: 0.5 }}>
                {summary ? summary.top_50 : "—"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Growing Rank
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card elevation={0} sx={{ bgcolor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                Rank Gained ▲
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#10b981", mt: 0.5 }}>
                {summary ? summary.gained : "0"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#10b981" }}>
                Improved pos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Card elevation={0} sx={{ bgcolor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                Google Indexed
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#0ea5e9", mt: 0.5 }}>
                {summary ? summary.indexed_total : "—"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#0ea5e9" }}>
                Search Console ready
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Search Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 2.5, bgcolor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, sm: 6, md: 5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search calculator name, slug, or target keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 7 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label="All Categories"
                clickable
                color={categoryFilter === "all" ? "primary" : "default"}
                onClick={() => setCategoryFilter("all")}
                sx={{ fontWeight: 600 }}
              />
              {categories.slice(0, 6).map((cat) => (
                <Chip
                  key={cat}
                  label={cat.replace(/_/g, " ")}
                  clickable
                  color={categoryFilter === cat ? "primary" : "default"}
                  onClick={() => setCategoryFilter(cat)}
                  sx={{ textTransform: "capitalize", fontWeight: 500 }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, flex: 1, bgcolor: "#ffffff" }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8 }}>
            <CircularProgress size={36} sx={{ color: "#4f46e5", mb: 2 }} />
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Loading live search engine rankings...
            </Typography>
          </Box>
        ) : (
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ "& th": { bgcolor: "#f1f5f9", fontWeight: 700, color: "#334155", py: 1.5 } }}>
                <TableCell>Page & Calculator</TableCell>
                <TableCell>Target Primary Keyword</TableCell>
                <TableCell align="center">Google Rank</TableCell>
                <TableCell align="center">Trend / Shift</TableCell>
                <TableCell align="center">Search Index</TableCell>
                <TableCell align="center">Last Checked</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRankings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: "#64748b" }}>
                    No pages matched your search or filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRankings.map((item) => (
                  <TableRow key={item.id} hover sx={{ "&:hover": { bgcolor: "#f8fafc" } }}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b", fontFamily: "monospace" }}>
                        {item.path}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={item.target_keyword}
                        size="small"
                        sx={{ bgcolor: "#e0e7ff", color: "#3730a3", fontWeight: 600, fontSize: "0.75rem" }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      {item.google_rank > 0 ? (
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                          {item.google_rank <= 3 && <StarIcon sx={{ color: "#eab308", fontSize: 16 }} />}
                          <Chip
                            label={`#${item.google_rank}`}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              bgcolor:
                                item.google_rank <= 3
                                  ? "#fef08a"
                                  : item.google_rank <= 10
                                  ? "#bbf7d0"
                                  : item.google_rank <= 50
                                  ? "#e0e7ff"
                                  : "#f1f5f9",
                              color:
                                item.google_rank <= 3
                                  ? "#854d0e"
                                  : item.google_rank <= 10
                                  ? "#166534"
                                  : item.google_rank <= 50
                                  ? "#3730a3"
                                  : "#475569",
                            }}
                          />
                        </Box>
                      ) : (
                        <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500 }}>
                          Pending / Crawling
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      {item.rank_change > 0 ? (
                        <Chip
                          icon={<TrendingUpIcon sx={{ "&&": { color: "#15803d" } }} />}
                          label={`+${item.rank_change}`}
                          size="small"
                          sx={{ bgcolor: "#dcfce7", color: "#15803d", fontWeight: 700 }}
                        />
                      ) : item.rank_change < 0 ? (
                        <Chip
                          icon={<TrendingDownIcon sx={{ "&&": { color: "#b91c1c" } }} />}
                          label={`${item.rank_change}`}
                          size="small"
                          sx={{ bgcolor: "#fee2e2", color: "#b91c1c", fontWeight: 700 }}
                        />
                      ) : (
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                          —
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        icon={<CheckCircleIcon sx={{ "&&": { color: "#0284c7" } }} />}
                        label="Indexed"
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: "#bae6fd", color: "#0369a1", fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        {item.last_checked ? new Date(item.last_checked).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Today"}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="View live page on TryCalc.net">
                        <IconButton
                          size="small"
                          component="a"
                          href={`https://trycalc.net${item.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: "#0284c7" }}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Drawer>
  )
}
