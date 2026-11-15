"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import IconButton from "@mui/material/IconButton"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Tooltip from "@mui/material/Tooltip"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import Badge from "@mui/material/Badge"
import Divider from "@mui/material/Divider"

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import SearchIcon from "@mui/icons-material/Search"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import VisibilityIcon from "@mui/icons-material/Visibility"
import RefreshIcon from "@mui/icons-material/Refresh"
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep"
import PostAddIcon from "@mui/icons-material/PostAdd"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"
import SpeedIcon from "@mui/icons-material/Speed"
import BarChartIcon from "@mui/icons-material/BarChart"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import PsychologyIcon from "@mui/icons-material/Psychology"
import FunctionsIcon from "@mui/icons-material/Functions"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import InputIcon from "@mui/icons-material/Input"
import OutputIcon from "@mui/icons-material/Output"
import LaunchIcon from "@mui/icons-material/Launch"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"

export interface CalculatorSpec {
  inputs: Array<{
    name: string
    type: string
    label: string
    defaultValue?: string | number
    unit?: string
  }>
  outputs: Array<{
    name: string
    label: string
    unit?: string
  }>
  formula: string
  editorialGuide: string
  slug?: string
}

export interface SeoProposal {
  id: string
  targetKeyword: string
  category: string
  slug: string
  searchVolume: number
  searchVolumeFormatted: string
  difficulty: number
  difficultyLevel: string
  cpc: number
  estEcpm: number
  potentialMonthlyTraffic: number
  estMonthlyRevenue: number
  status: "pending" | "approved" | "rejected"
  liveUrl?: string
  builtAt?: string
  indexed?: boolean
  prosBangla: string[]
  consBangla: string[]
  spec: CalculatorSpec
  isDemo: boolean
  createdAt: string
  updatedAt: string
}

export default function SeoExpertTeamView() {
  const [proposals, setProposals] = useState<SeoProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Modals & Dialogs
  const [selectedProposal, setSelectedProposal] = useState<SeoProposal | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [customModalOpen, setCustomModalOpen] = useState(false)
  const [customKeyword, setCustomKeyword] = useState("")
  const [customCategory, setCustomCategory] = useState("Finance")

  // Feedback Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastSeverity, setToastSeverity] = useState<"success" | "info" | "warning" | "error">("info")

  // Fetch proposals
  const fetchProposals = async () => {
    setLoading(true)
    try {
      const res = await fetch("/imon-api/seo-team")
      if (res.status === 401) {
        window.location.href = "/imon"
        return
      }
      const data = await res.json()
      if (data.ok && Array.isArray(data.proposals)) {
        setProposals(data.proposals)
      } else {
        setToastMessage(data.error || "Failed to load proposals")
        setToastSeverity("error")
      }
    } catch {
      setToastMessage("Network error while connecting to SEO Team API")
      setToastSeverity("error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProposals()
  }, [])

  // Action Handlers
  const handleApprove = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setActionLoading(true)
    try {
      const res = await fetch("/imon-api/seo-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_and_build", id }),
      })
      if (res.status === 401) {
        window.location.href = "/imon"
        return
      }
      const data = await res.json()
      if (data.ok && data.proposals) {
        setProposals(data.proposals)
        if (selectedProposal && selectedProposal.id === id) {
          setSelectedProposal(data.proposal || { ...selectedProposal, status: "approved", liveUrl: data.liveUrl })
        }
        setToastMessage("ক্যালকুলেটর সফলভাবে তৈরি ও লাইভ করা হয়েছে! (Built & Live)")
        setToastSeverity("success")
      }
    } catch {
      setToastMessage("Failed to approve and build proposal")
      setToastSeverity("error")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setActionLoading(true)
    try {
      const res = await fetch("/imon-api/seo-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", id }),
      })
      const data = await res.json()
      if (data.ok && data.proposals) {
        setProposals(data.proposals)
        if (selectedProposal && selectedProposal.id === id) {
          setSelectedProposal({ ...selectedProposal, status: "rejected" })
        }
        setToastMessage("প্রস্তাবটি বাতিল করা হয়েছে (Proposal Rejected)")
        setToastSeverity("warning")
      }
    } catch {
      setToastMessage("Failed to reject proposal")
      setToastSeverity("error")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDiscover = async () => {
    setActionLoading(true)
    try {
      const res = await fetch("/imon-api/seo-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "discover" }),
      })
      const data = await res.json()
      if (data.ok && data.proposals) {
        setProposals(data.proposals)
        setToastMessage(`নতুন কিওয়ার্ড গবেষণা সম্পন্ন হয়েছে: "${data.proposal.targetKeyword}"`)
        setToastSeverity("success")
      }
    } catch {
      setToastMessage("Failed to run auto-discovery")
      setToastSeverity("error")
    } finally {
      setActionLoading(false)
    }
  }

  const handleCustomResearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customKeyword.trim()) return

    setActionLoading(true)
    try {
      const res = await fetch("/imon-api/seo-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "custom",
          keyword: customKeyword.trim(),
          category: customCategory,
        }),
      })
      const data = await res.json()
      if (data.ok && data.proposals) {
        setProposals(data.proposals)
        setCustomModalOpen(false)
        setCustomKeyword("")
        setToastMessage(`কাস্টম কিওয়ার্ড এনালাইসিস সম্পন্ন হয়েছে!`)
        setToastSeverity("success")
      } else {
        setToastMessage(data.error || "Custom analysis failed")
        setToastSeverity("error")
      }
    } catch {
      setToastMessage("Error running custom research")
      setToastSeverity("error")
    } finally {
      setActionLoading(false)
    }
  }

  const handleSeedDemo = async () => {
    setActionLoading(true)
    try {
      const res = await fetch("/imon-api/seo-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed_demo" }),
      })
      const data = await res.json()
      if (data.ok && data.proposals) {
        setProposals(data.proposals)
        setToastMessage("ডেমো ডাটা সফলভাবে লোড করা হয়েছে (Demo Data Seeded)")
        setToastSeverity("info")
      }
    } catch {
      setToastMessage("Failed to seed demo data")
      setToastSeverity("error")
    } finally {
      setActionLoading(false)
    }
  }

  const handlePurgeDemo = async () => {
    setActionLoading(true)
    try {
      const res = await fetch("/imon-api/seo-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "purge_demo" }),
      })
      const data = await res.json()
      if (data.ok && data.proposals) {
        setProposals(data.proposals)
        setToastMessage("ডেমো ডাটা সফলভাবে মুছে ফেলা হয়েছে (Demo Data Cleared)")
        setToastSeverity("info")
      }
    } catch {
      setToastMessage("Failed to clear demo data")
      setToastSeverity("error")
    } finally {
      setActionLoading(false)
    }
  }

  const openPreview = (proposal: SeoProposal) => {
    setSelectedProposal(proposal)
    setPreviewOpen(true)
  }

  const copySlug = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(slug)
    setToastMessage("Slug copied to clipboard!")
    setToastSeverity("info")
  }

  // Filtered Proposals
  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const matchesTab = activeTab === "all" || p.status === activeTab
      const matchesSearch =
        searchQuery === "" ||
        p.targetKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [proposals, activeTab, searchQuery])

  // Calculated KPI Metrics
  const metrics = useMemo(() => {
    const totalKeywords = proposals.length
    const pendingCount = proposals.filter((p) => p.status === "pending").length
    const approvedCount = proposals.filter((p) => p.status === "approved").length
    const rejectedCount = proposals.filter((p) => p.status === "rejected").length

    const potentialTraffic = proposals
      .filter((p) => p.status !== "rejected")
      .reduce((sum, p) => sum + (p.potentialMonthlyTraffic || 0), 0)

    const estRevenue = proposals
      .filter((p) => p.status !== "rejected")
      .reduce((sum, p) => sum + (p.estMonthlyRevenue || 0), 0)

    return {
      totalKeywords,
      pendingCount,
      approvedCount,
      rejectedCount,
      potentialTraffic,
      estRevenue,
    }
  }, [proposals])

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", color: "#0f172a", pb: 10 }}>
      {/* Top Header Command Bar */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Title & Navigation */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Link href="/imon" passHref style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                    borderColor: "#cbd5e1",
                    color: "#475569",
                    bgcolor: "#f8fafc",
                    "&:hover": { bgcolor: "#f1f5f9", borderColor: "#94a3b8" },
                  }}
                >
                  Telemetry Cockpit
                </Button>
              </Link>

              <Divider orientation="vertical" flexItem sx={{ height: 28, alignSelf: "center" }} />

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      color: "#0f172a",
                      letterSpacing: "-0.5px",
                      fontSize: { xs: 18, sm: 22 },
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <span>🧠</span> AI SEO Expert Team & Research War-Room
                  </Typography>
                  <Chip
                    size="small"
                    label="AUTONOMOUS BLUEPRINTING"
                    sx={{
                      bgcolor: "#eff6ff",
                      color: "#2563eb",
                      fontWeight: 800,
                      fontSize: 11,
                      border: "1px solid #bfdbfe",
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 0.25 }}>
                  Targeted Keyword Intelligence • Bengali Pros/Cons Analysis • E-E-A-T Calculator Blueprinting
                </Typography>
              </Box>
            </Box>

            {/* Action Bar */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="medium"
                startIcon={<AutoAwesomeIcon />}
                onClick={handleDiscover}
                disabled={actionLoading}
                sx={{
                  bgcolor: "#4f46e5",
                  color: "#ffffff",
                  fontWeight: 800,
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                  "&:hover": { bgcolor: "#4338ca" },
                }}
              >
                Auto-Discover Keywords
              </Button>

              <Button
                variant="outlined"
                size="medium"
                startIcon={<SearchIcon />}
                onClick={() => setCustomModalOpen(true)}
                disabled={actionLoading}
                sx={{
                  borderColor: "#2563eb",
                  color: "#2563eb",
                  fontWeight: 800,
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                  bgcolor: "#eff6ff",
                  "&:hover": { bgcolor: "#dbeafe", borderColor: "#1d4ed8" },
                }}
              >
                Custom Keyword Research
              </Button>

              <Tooltip title="Populate realistic demo SEO proposals across Finance, Health, Construction, Tech">
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<PostAddIcon />}
                  onClick={handleSeedDemo}
                  disabled={actionLoading}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                    borderColor: "#cbd5e1",
                    color: "#334155",
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                >
                  Seed Demo Data
                </Button>
              </Tooltip>

              <Tooltip title="Remove all demo proposals for a clean slate">
                <Button
                  variant="outlined"
                  size="medium"
                  color="error"
                  startIcon={<DeleteSweepIcon />}
                  onClick={handlePurgeDemo}
                  disabled={actionLoading}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                  }}
                >
                  Clear Demo Data
                </Button>
              </Tooltip>

              <Tooltip title="Refresh from persistent database">
                <IconButton
                  onClick={fetchProposals}
                  disabled={loading}
                  sx={{
                    border: "1px solid #cbd5e1",
                    borderRadius: 2,
                    p: 1,
                    color: "#64748b",
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {/* KPI Metric Cards */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {/* 1. Researched Keywords */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, letterSpacing: 0.5 }}>
                  RESEARCHED KEYWORDS
                </Typography>
                <Box sx={{ bgcolor: "#eff6ff", p: 0.8, borderRadius: 2, color: "#2563eb", display: "flex" }}>
                  <PsychologyIcon fontSize="small" />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
                {metrics.totalKeywords}
              </Typography>
              <Typography variant="caption" sx={{ color: "#059669", fontWeight: 600 }}>
                High-intent Calculator Niches
              </Typography>
            </Paper>
          </Grid>

          {/* 2. Pending Approvals */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: "#ffffff",
                border: "1px solid #fef3c7",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "#b45309", fontWeight: 700, letterSpacing: 0.5 }}>
                  PENDING APPROVALS
                </Typography>
                <Box sx={{ bgcolor: "#fffbeb", p: 0.8, borderRadius: 2, color: "#d97706", display: "flex" }}>
                  <WarningAmberIcon fontSize="small" />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#b45309" }}>
                {metrics.pendingCount}
              </Typography>
              <Typography variant="caption" sx={{ color: "#92400e", fontWeight: 600 }}>
                অনুমোদনের অপেক্ষায় রয়েছে
              </Typography>
            </Paper>
          </Grid>

          {/* 3. Approved */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: "#ffffff",
                border: "1px solid #d1fae5",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "#065f46", fontWeight: 700, letterSpacing: 0.5 }}>
                  APPROVED BLUEPRINTS
                </Typography>
                <Box sx={{ bgcolor: "#ecfdf5", p: 0.8, borderRadius: 2, color: "#059669", display: "flex" }}>
                  <CheckCircleIcon fontSize="small" />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#065f46" }}>
                {metrics.approvedCount}
              </Typography>
              <Typography variant="caption" sx={{ color: "#059669", fontWeight: 600 }}>
                ডেভেলপমেন্টের জন্য চূড়ান্ত
              </Typography>
            </Paper>
          </Grid>

          {/* 4. Potential Monthly Traffic */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, letterSpacing: 0.5 }}>
                  POTENTIAL TRAFFIC
                </Typography>
                <Box sx={{ bgcolor: "#f3e8ff", p: 0.8, borderRadius: 2, color: "#7e22ce", display: "flex" }}>
                  <TrendingUpIcon fontSize="small" />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
                {metrics.potentialTraffic > 1000
                  ? `${(metrics.potentialTraffic / 1000).toFixed(1)}k`
                  : metrics.potentialTraffic}{" "}
                <Typography component="span" sx={{ fontSize: 16, color: "#64748b", fontWeight: 600 }}>
                  /mo
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                Est. Organic Clicks
              </Typography>
            </Paper>
          </Grid>

          {/* 5. Est. Ad Revenue */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, letterSpacing: 0.5 }}>
                  EST. AD REVENUE
                </Typography>
                <Box sx={{ bgcolor: "#fef9c3", p: 0.8, borderRadius: 2, color: "#a16207", display: "flex" }}>
                  <MonetizationOnIcon fontSize="small" />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#059669" }}>
                ${metrics.estRevenue.toFixed(2)}{" "}
                <Typography component="span" sx={{ fontSize: 16, color: "#64748b", fontWeight: 600 }}>
                  /mo
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                AdSense + Adsterra eCPM
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Filters, Search & Tabs */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Filter Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: 14,
                minHeight: 44,
                color: "#64748b",
                "&.Mui-selected": {
                  color: "#4f46e5",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#4f46e5",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>All Proposals</span>
                  <Chip size="small" label={metrics.totalKeywords} sx={{ height: 20, fontSize: 11, fontWeight: 700 }} />
                </Box>
              }
              value="all"
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Pending Review (অনুমোদনের অপেক্ষায়)</span>
                  <Chip
                    size="small"
                    label={metrics.pendingCount}
                    sx={{
                      height: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: "#fef3c7",
                      color: "#b45309",
                    }}
                  />
                </Box>
              }
              value="pending"
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Approved (অনুমোদিত)</span>
                  <Chip
                    size="small"
                    label={metrics.approvedCount}
                    sx={{
                      height: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: "#d1fae5",
                      color: "#065f46",
                    }}
                  />
                </Box>
              }
              value="approved"
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Rejected</span>
                  <Chip
                    size="small"
                    label={metrics.rejectedCount}
                    sx={{ height: 20, fontSize: 11, fontWeight: 700 }}
                  />
                </Box>
              }
              value="rejected"
            />
          </Tabs>

          {/* Keyword Search */}
          <TextField
            size="small"
            placeholder="Filter keywords, category, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: "#94a3b8", mr: 1, fontSize: 20 }} />,
              },
            }}
            sx={{
              minWidth: 280,
              bgcolor: "#f8fafc",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused fieldset": { borderColor: "#4f46e5" },
              },
            }}
          />
        </Paper>

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ py: 8, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress size={40} sx={{ color: "#4f46e5" }} />
          </Box>
        )}

        {/* Empty State */}
        {!loading && filteredProposals.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px dashed #cbd5e1",
            }}
          >
            <PsychologyIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}>
              কোনো কিওয়ার্ড প্রস্তাব পাওয়া যায়নি
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
              নতুন কিওয়ার্ড গবেষণার জন্য &ldquo;Auto-Discover Keywords&rdquo; অথবা &ldquo;Seed Demo Data&rdquo; বাটনে ক্লিক করুন।
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                startIcon={<AutoAwesomeIcon />}
                onClick={handleDiscover}
                sx={{ bgcolor: "#4f46e5", textTransform: "none", fontWeight: 700, borderRadius: 2 }}
              >
                Auto-Discover Keywords
              </Button>
              <Button
                variant="outlined"
                startIcon={<PostAddIcon />}
                onClick={handleSeedDemo}
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
              >
                Seed Demo Data
              </Button>
            </Box>
          </Paper>
        )}

        {/* Proposal Cards List */}
        {!loading && (
          <Grid container spacing={3}>
            {filteredProposals.map((proposal) => {
              const isApproved = proposal.status === "approved"
              const isRejected = proposal.status === "rejected"
              const isPending = proposal.status === "pending"

              return (
                <Grid size={{ xs: 12 }} key={proposal.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: "#ffffff",
                      border: "1px solid",
                      borderColor: isApproved ? "#a7f3d0" : isRejected ? "#fecaca" : "#e2e8f0",
                      boxShadow: isApproved
                        ? "0 4px 14px rgba(16, 185, 129, 0.08)"
                        : "0 2px 6px rgba(0,0,0,0.03)",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                        borderColor: isApproved ? "#10b981" : "#cbd5e1",
                      },
                    }}
                  >
                    {/* Top Header: Keyword, Category, Slug & Status */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 300 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 0.75 }}>
                          <Typography
                            variant="h6"
                            component="h2"
                            sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: 17, sm: 20 } }}
                          >
                            {proposal.targetKeyword}
                          </Typography>

                          <Chip
                            size="small"
                            label={proposal.category}
                            sx={{
                              bgcolor:
                                proposal.category === "Finance"
                                  ? "#eff6ff"
                                  : proposal.category === "Health"
                                  ? "#ecfdf5"
                                  : proposal.category === "Construction"
                                  ? "#fffbeb"
                                  : "#f3e8ff",
                              color:
                                proposal.category === "Finance"
                                  ? "#1d4ed8"
                                  : proposal.category === "Health"
                                  ? "#047857"
                                  : proposal.category === "Construction"
                                  ? "#b45309"
                                  : "#6b21a8",
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          />

                          {proposal.isDemo && (
                            <Chip
                              size="small"
                              variant="outlined"
                              label="Demo Sample"
                              sx={{ fontSize: 11, color: "#94a3b8", borderColor: "#e2e8f0" }}
                            />
                          )}
                        </Box>

                        {/* Suggested Slug */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="body2" sx={{ color: "#64748b", fontFamily: "monospace", fontSize: 13 }}>
                            Slug: <strong style={{ color: "#4f46e5" }}>{proposal.slug}</strong>
                          </Typography>
                          <Tooltip title="Copy Slug">
                            <IconButton size="small" onClick={(e) => copySlug(proposal.slug, e)}>
                              <ContentCopyIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* Status Badge & Fast Action */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {isPending && (
                          <Chip
                            label="অনুমোদনের অপেক্ষায় (Pending Review)"
                            sx={{
                              bgcolor: "#fef3c7",
                              color: "#92400e",
                              fontWeight: 800,
                              fontSize: 12,
                              border: "1px solid #fde68a",
                            }}
                          />
                        )}
                        {isApproved && (
                          <Chip
                            icon={<CheckCircleIcon sx={{ fontSize: "16px !important", color: "#065f46 !important" }} />}
                            label="অনুমোদিত (Approved Blueprint)"
                            sx={{
                              bgcolor: "#d1fae5",
                              color: "#065f46",
                              fontWeight: 800,
                              fontSize: 12,
                              border: "1px solid #a7f3d0",
                            }}
                          />
                        )}
                        {isRejected && (
                          <Chip
                            icon={<CancelIcon sx={{ fontSize: "16px !important", color: "#991b1b !important" }} />}
                            label="বাতিলকৃত (Rejected)"
                            sx={{
                              bgcolor: "#fee2e2",
                              color: "#991b1b",
                              fontWeight: 800,
                              fontSize: 12,
                              border: "1px solid #fecaca",
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* SEO Metrics Badges Strip */}
                    <Box
                      sx={{
                        p: 1.5,
                        mb: 2.5,
                        bgcolor: "#f8fafc",
                        borderRadius: 2.5,
                        border: "1px solid #f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 2, md: 4 },
                        flexWrap: "wrap",
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                          SEARCH VOLUME
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                          {proposal.searchVolumeFormatted}
                        </Typography>
                      </Box>

                      <Divider orientation="vertical" flexItem />

                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                          KEYWORD DIFFICULTY (KD)
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 800,
                            color: proposal.difficulty < 25 ? "#059669" : "#d97706",
                          }}
                        >
                          {proposal.difficultyLevel}
                        </Typography>
                      </Box>

                      <Divider orientation="vertical" flexItem />

                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                          EST. eCPM
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: "#059669" }}>
                          ${proposal.estEcpm.toFixed(2)}
                        </Typography>
                      </Box>

                      <Divider orientation="vertical" flexItem />

                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                          GOOGLE CPC
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: "#475569" }}>
                          ${proposal.cpc.toFixed(2)}
                        </Typography>
                      </Box>

                      <Divider orientation="vertical" flexItem />

                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                          EST. MONTHLY TRAFFIC
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: "#2563eb" }}>
                          {proposal.potentialMonthlyTraffic.toLocaleString()} clicks/mo
                        </Typography>
                      </Box>

                      <Divider orientation="vertical" flexItem />

                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                          EST. AD REVENUE
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: "#059669" }}>
                          ${proposal.estMonthlyRevenue.toFixed(2)} / mo
                        </Typography>
                      </Box>
                    </Box>

                    {/* Bengali Analysis Boxes: Pros & Cons */}
                    <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
                      {/* সুবিধা (Pros strictly in Bengali) */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            bgcolor: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            height: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 800,
                              color: "#166534",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1.25,
                            }}
                          >
                            <ThumbUpAltIcon sx={{ fontSize: 18, color: "#16a34a" }} />
                            সুবিধা ও এসইও সম্ভাবনা (Key Advantages & Monetization)
                          </Typography>
                          <Box component="ul" sx={{ m: 0, pl: 2.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
                            {proposal.prosBangla.map((pro, idx) => (
                              <Typography
                                component="li"
                                variant="body2"
                                key={idx}
                                sx={{ color: "#14532d", fontWeight: 500, lineHeight: 1.6 }}
                              >
                                {pro}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      </Grid>

                      {/* অসুবিধা ও সতর্কতা (Cons/Risks strictly in Bengali) */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            bgcolor: "#fff7ed",
                            border: "1px solid #fed7aa",
                            height: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 800,
                              color: "#9a3412",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1.25,
                            }}
                          >
                            <WarningAmberIcon sx={{ fontSize: 18, color: "#ea580c" }} />
                            অসুবিধা ও ঝুঁকি সতর্কতা (Challenges, Competitors & Risks)
                          </Typography>
                          <Box component="ul" sx={{ m: 0, pl: 2.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
                            {proposal.consBangla.map((con, idx) => (
                              <Typography
                                component="li"
                                variant="body2"
                                key={idx}
                                sx={{ color: "#7c2d12", fontWeight: 500, lineHeight: 1.6 }}
                              >
                                {con}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Footer Actions: [Approve], [Reject], [Preview Spec] */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                        pt: 1,
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => openPreview(proposal)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          borderRadius: 2,
                          color: "#4f46e5",
                          borderColor: "#c7d2fe",
                          bgcolor: "#eef2ff",
                          "&:hover": { bgcolor: "#e0e7ff", borderColor: "#818cf8" },
                        }}
                      >
                        প্রিভিউ দেখুন (Preview Calculator Spec & Formula)
                      </Button>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {proposal.status === "approved" ? (
                          <Button
                            variant="contained"
                            size="small"
                            component="a"
                            href={proposal.liveUrl || `/calculators/${(proposal.spec?.slug || proposal.targetKeyword || proposal.id).split("/").pop()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<LaunchIcon />}
                            sx={{
                              bgcolor: "#2563eb",
                              color: "#ffffff",
                              fontWeight: 800,
                              textTransform: "none",
                              borderRadius: 2,
                              px: 2,
                              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                              "&:hover": { bgcolor: "#1d4ed8" },
                            }}
                          >
                            লাইভ ক্যালকুলেটর (View Live)
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<RocketLaunchIcon />}
                            onClick={(e) => handleApprove(proposal.id, e)}
                            disabled={actionLoading}
                            sx={{
                              bgcolor: "#059669",
                              color: "#ffffff",
                              fontWeight: 800,
                              textTransform: "none",
                              borderRadius: 2,
                              px: 2,
                              boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)",
                              "&:hover": { bgcolor: "#047857" },
                            }}
                          >
                            অনুমোদন ও অটো-বিল্ড (Approve & Build)
                          </Button>
                        )}

                        {proposal.status !== "rejected" && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={(e) => handleReject(proposal.id, e)}
                            disabled={actionLoading}
                            sx={{
                              fontWeight: 700,
                              textTransform: "none",
                              borderRadius: 2,
                              px: 2,
                            }}
                          >
                            বাতিল করুন (Reject)
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              )
            })}
          </Grid>
        )}
      </Container>

      {/* Interactive Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3.5,
              p: 1,
              bgcolor: "#ffffff",
            },
          },
        }}
      >
        {selectedProposal && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    📐 Calculator Architecture & Engineering Spec
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    {selectedProposal.targetKeyword} • {selectedProposal.category}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={selectedProposal.status.toUpperCase()}
                  sx={{
                    bgcolor:
                      selectedProposal.status === "approved"
                        ? "#d1fae5"
                        : selectedProposal.status === "rejected"
                        ? "#fee2e2"
                        : "#fef3c7",
                    color:
                      selectedProposal.status === "approved"
                        ? "#065f46"
                        : selectedProposal.status === "rejected"
                        ? "#991b1b"
                        : "#b45309",
                    fontWeight: 800,
                  }}
                />
              </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: "#f1f5f9", display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Formula Blueprint */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <FunctionsIcon sx={{ color: "#4f46e5" }} />
                  Mathematical Formula & Logic Blueprint
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "#0f172a",
                    color: "#38bdf8",
                    borderRadius: 2,
                    fontFamily: "monospace",
                    fontSize: 13.5,
                    overflowX: "auto",
                  }}
                >
                  <code>{selectedProposal.spec.formula}</code>
                </Paper>
              </Box>

              {/* Planned Inputs Table */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <InputIcon sx={{ color: "#2563eb" }} />
                  Planned Input Fields ({selectedProposal.spec.inputs.length})
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Field Name</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Label</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Default Value</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Unit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedProposal.spec.inputs.map((inp, idx) => (
                        <TableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell sx={{ fontFamily: "monospace", color: "#4f46e5", fontWeight: 600 }}>
                            {inp.name}
                          </TableCell>
                          <TableCell>
                            <Chip size="small" label={inp.type} sx={{ height: 20, fontSize: 11 }} />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{inp.label}</TableCell>
                          <TableCell sx={{ color: "#64748b" }}>{String(inp.defaultValue ?? "-")}</TableCell>
                          <TableCell sx={{ color: "#64748b" }}>{inp.unit || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Planned Outputs Table */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <OutputIcon sx={{ color: "#059669" }} />
                  Planned Output Metrics ({selectedProposal.spec.outputs.length})
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Output Metric</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Label</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Unit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedProposal.spec.outputs.map((out, idx) => (
                        <TableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell sx={{ fontFamily: "monospace", color: "#059669", fontWeight: 600 }}>
                            {out.name}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{out.label}</TableCell>
                          <TableCell sx={{ color: "#64748b" }}>{out.unit || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Editorial & E-E-A-T Guide Draft */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <MenuBookIcon sx={{ color: "#d97706" }} />
                  E-E-A-T Editorial & Search Intent Guidance Draft
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    color: "#334155",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {selectedProposal.spec.editorialGuide}
                </Paper>
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setPreviewOpen(false)} sx={{ textTransform: "none", color: "#64748b" }}>
                Close
              </Button>
              {selectedProposal.status === "approved" ? (
                <Button
                  variant="contained"
                  component="a"
                  href={selectedProposal.liveUrl || `/calculators/${(selectedProposal.spec?.slug || selectedProposal.targetKeyword || selectedProposal.id).split("/").pop()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<LaunchIcon />}
                  sx={{
                    bgcolor: "#2563eb",
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#1d4ed8" },
                  }}
                >
                  View Live Tool (লাইভ ক্যালকুলেটর)
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<RocketLaunchIcon />}
                  onClick={() => {
                    handleApprove(selectedProposal.id)
                  }}
                  sx={{
                    bgcolor: "#059669",
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#047857" },
                  }}
                >
                  Approve & Auto-Build (অনুমোদন ও অটো-বিল্ড)
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Custom Keyword Research Dialog */}
      <Dialog
        open={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 1,
            },
          },
        }}
      >
        <form onSubmit={handleCustomResearch}>
          <DialogTitle sx={{ fontWeight: 800, color: "#0f172a" }}>
            🔍 Custom Keyword SEO Analysis & Blueprinting
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              যেকোনো ক্যালকুলেটর কিওয়ার্ড ইনপুট দিন। এআই এসইও টিম সার্চ ভলিউম, eCPM, বাংলা সুবিধা ও অসুবিধা এবং সম্পূর্ণ ক্যালকুলেটর স্পেসিফিকেশন তৈরি করবে।
            </Typography>

            <TextField
              label="Target Keyword"
              placeholder="e.g. Roof Pitch and Shingle Calculator"
              fullWidth
              required
              value={customKeyword}
              onChange={(e) => setCustomKeyword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={customCategory}
                label="Category"
                onChange={(e) => setCustomCategory(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="Finance">Finance (ফাইন্যান্স)</MenuItem>
                <MenuItem value="Health">Health (স্বাস্থ্য ও ফিটনেস)</MenuItem>
                <MenuItem value="Construction">Construction (নির্মাণ ও ম্যাটেরিয়াল)</MenuItem>
                <MenuItem value="Tech">Tech & Cloud (প্রযুক্তি ও হোস্টিং)</MenuItem>
                <MenuItem value="Real Estate">Real Estate (রিয়েল এস্টেট)</MenuItem>
                <MenuItem value="Math">Math & Statistics</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setCustomModalOpen(false)} sx={{ textTransform: "none", color: "#64748b" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={actionLoading || !customKeyword.trim()}
              startIcon={<AutoAwesomeIcon />}
              sx={{
                bgcolor: "#4f46e5",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                "&:hover": { bgcolor: "#4338ca" },
              }}
            >
              Analyze & Generate Blueprint
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity={toastSeverity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2, fontWeight: 600 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
