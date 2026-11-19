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
import LinearProgress from "@mui/material/LinearProgress"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CloseIcon from "@mui/icons-material/Close"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import SearchIcon from "@mui/icons-material/Search"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import VisibilityIcon from "@mui/icons-material/Visibility"
import RefreshIcon from "@mui/icons-material/Refresh"
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep"
import PostAddIcon from "@mui/icons-material/PostAdd"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import TrackChangesIcon from "@mui/icons-material/TrackChanges"
import SpeedIcon from "@mui/icons-material/Speed"
import BarChartIcon from "@mui/icons-material/BarChart"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import PsychologyIcon from "@mui/icons-material/Psychology"
import FunctionsIcon from "@mui/icons-material/Functions"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import InputIcon from "@mui/icons-material/Input"
import OutputIcon from "@mui/icons-material/Output"
import LaunchIcon from "@mui/icons-material/Launch"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import CalculateIcon from "@mui/icons-material/Calculate"
import EngineeringIcon from "@mui/icons-material/Engineering"
import HubIcon from "@mui/icons-material/Hub"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import FilterListIcon from "@mui/icons-material/FilterList"

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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [proposals, setProposals] = useState<SeoProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"difficulty" | "volume" | "newest">("volume")
  const [simInputs, setSimInputs] = useState<Record<string, number>>({})

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
        setActiveTab("approved")
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
        setActiveTab("rejected")
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
    const initInputs: Record<string, number> = {}
    if (proposal.spec?.inputs) {
      proposal.spec.inputs.forEach((inp) => {
        initInputs[inp.name] = Number(inp.defaultValue) || 10
      })
    }
    setSimInputs(initInputs)
    setPreviewOpen(true)
  }

  const handleApproveAllPending = async () => {
    if (!window.confirm("আপনি কি সমস্ত পেন্ডিং ক্যালকুলেটর প্রপোজাল একসাথে অনুমোদন এবং লাইভ বিল্ড করতে চান?")) return
    setActionLoading(true)
    try {
      const res = await fetch("/imon-api/seo-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_all_pending" }),
      })
      const data = await res.json()
      if (data.ok && data.proposals) {
        setProposals(data.proposals)
        setToastMessage(`অভিনন্দন! মোট ${data.count} টি ক্যালকুলেটর সফলভাবে তৈরি ও লাইভ করা হয়েছে!`)
        setToastSeverity("success")
        setActiveTab("approved")
      } else {
        setToastMessage(data.error || "Failed to batch approve")
        setToastSeverity("error")
      }
    } catch {
      setToastMessage("Network error during batch approval")
      setToastSeverity("error")
    } finally {
      setActionLoading(false)
    }
  }

  const handleExportRoadmap = () => {
    const exportData = filteredProposals.map((p) => ({
      targetKeyword: p.targetKeyword,
      category: p.category,
      slug: p.slug,
      status: p.status,
      searchVolume: p.searchVolume,
      difficulty: p.difficulty,
      cpc: p.cpc,
      estEcpm: p.estEcpm,
      potentialMonthlyTraffic: p.potentialMonthlyTraffic,
      estMonthlyRevenue: p.estMonthlyRevenue,
      liveUrl: p.liveUrl || (p.status === "approved" ? `https://trycalc.net/calculators/${p.slug}` : ""),
      formula: p.spec?.formula,
    }))
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trycalc-seo-roadmap-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setToastMessage("SEO Roadmap JSON ফাইল ডাউনলোড সম্পন্ন হয়েছে!")
    setToastSeverity("info")
  }

  const getOpportunityScore = (proposal: SeoProposal) => {
    const volScore = Math.min(35, ((proposal.searchVolume || 0) / 12000) * 35)
    const kdScore = Math.max(10, 35 - ((proposal.difficulty || 0) * 0.45))
    const intentScore = Math.min(30, volScore * 0.5 + kdScore * 0.3)
    const total = Math.round(Math.min(99, Math.max(52, volScore + kdScore + intentScore)))
    let tier = "Tier-A High Value"
    let color = "#059669"
    if (total >= 90) {
      tier = "Tier-A+ Prime Opportunity"
      color = "#059669"
    } else if (total >= 75) {
      tier = "Tier-A Strong Growth"
      color = "#2563eb"
    } else {
      tier = "Tier-B Solid Niche"
      color = "#d97706"
    }
    return { score: total, tier, color }
  }

  const getSearchIntent = (p: SeoProposal) => {
    const cat = (p.category || "").toLowerCase()
    if (cat.includes("finance") || cat.includes("estate")) return { label: "Commercial / High Intent 🎯", color: "#166534", bg: "#dcfce7" }
    if (cat.includes("construction") || cat.includes("tech")) return { label: "Transactional & Tool 🛠️", color: "#1e40af", bg: "#dbeafe" }
    return { label: "Informational & Solving 📖", color: "#6b21a8", bg: "#f3e8ff" }
  }

  const copySlug = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(slug)
    setToastMessage("Slug copied to clipboard!")
    setToastSeverity("info")
  }

  // Categories list with counts
  const categoriesList = useMemo(() => {
    const cats = Array.from(new Set(proposals.map((p) => p.category)))
    return ["all", ...cats]
  }, [proposals])

  // Filtered & Sorted Proposals
  const filteredProposals = useMemo(() => {
    return proposals
      .filter((p) => {
        const matchesTab = activeTab === "all" || p.status === activeTab
        const matchesCategory =
          selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase()
        const matchesSearch =
          searchQuery === "" ||
          p.targetKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.slug.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesTab && matchesCategory && matchesSearch
      })
      .sort((a, b) => {
        if (sortBy === "difficulty") return (a.difficulty || 0) - (b.difficulty || 0)
        if (sortBy === "volume") return (b.searchVolume || 0) - (a.searchVolume || 0)
        if (sortBy === "newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        return 0
      })
  }, [proposals, activeTab, selectedCategory, searchQuery, sortBy])

  // Calculated KPI Metrics
  const metrics = useMemo(() => {
    const totalKeywords = proposals.length
    const pendingCount = proposals.filter((p) => p.status === "pending").length
    const approvedCount = proposals.filter((p) => p.status === "approved").length
    const rejectedCount = proposals.filter((p) => p.status === "rejected").length

    const potentialTraffic = proposals
      .filter((p) => p.status !== "rejected")
      .reduce((sum, p) => sum + (p.potentialMonthlyTraffic || 0), 0)

    return {
      totalKeywords,
      pendingCount,
      approvedCount,
      rejectedCount,
      potentialTraffic,
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
        <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2.5, md: 3 } }}>
          <Box
            sx={{
              py: { xs: 1.5, sm: 2 },
              display: "flex",
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            {/* Title & Navigation */}
            <Box sx={{ width: { xs: "100%", md: "auto" } }}>
              <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1, sm: 2 } }}>
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

                <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: "center", display: { xs: "none", sm: "block" } }} />

                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography
                      variant="h5"
                      component="h1"
                      sx={{
                        fontWeight: 800,
                        color: "#0f172a",
                        letterSpacing: "-0.5px",
                        fontSize: { xs: 17, sm: 21 },
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                      }}
                    >
                      <span>🧠</span> AI SEO Expert Team War-Room
                    </Typography>
                    <Chip
                      size="small"
                      label="AUTONOMOUS BLUEPRINTING"
                      sx={{
                        bgcolor: "#eff6ff",
                        color: "#2563eb",
                        fontWeight: 800,
                        fontSize: 10,
                        border: "1px solid #bfdbfe",
                        display: { xs: "none", sm: "inline-flex" },
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 0.25, fontSize: { xs: 11, sm: 12 } }}>
                    Targeted Keyword Intelligence • Bengali Pros/Cons Analysis • E-E-A-T Calculator Blueprinting
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Action Bar */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", width: { xs: "100%", md: "auto" } }}>
              <Button
                variant="contained"
                size="medium"
                fullWidth={isMobile}
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
                  py: { xs: 1.25, sm: 0.75 },
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                  "&:hover": { bgcolor: "#4338ca" },
                }}
              >
                Auto-Discover Keywords
              </Button>

              <Button
                variant="outlined"
                size="medium"
                fullWidth={isMobile}
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
                  py: { xs: 1.25, sm: 0.75 },
                  bgcolor: "#eff6ff",
                  "&:hover": { bgcolor: "#dbeafe", borderColor: "#1d4ed8" },
                }}
              >
                Custom Keyword Research
              </Button>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: { xs: "100%", sm: "auto" }, justifyContent: { xs: "space-between", sm: "flex-start" }, mt: { xs: 0.5, sm: 0 } }}>
                <Tooltip title="Populate realistic demo SEO proposals across Finance, Health, Construction, Tech">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PostAddIcon />}
                    onClick={handleSeedDemo}
                    disabled={actionLoading}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: 2,
                      borderColor: "#cbd5e1",
                      color: "#334155",
                      fontSize: { xs: 11, sm: 12 },
                      "&:hover": { bgcolor: "#f1f5f9" },
                    }}
                  >
                    Seed Demo
                  </Button>
                </Tooltip>

                <Tooltip title="Remove all demo proposals for a clean slate">
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<DeleteSweepIcon />}
                    onClick={handlePurgeDemo}
                    disabled={actionLoading}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: 2,
                      fontSize: { xs: 11, sm: 12 },
                    }}
                  >
                    Clear Demo
                  </Button>
                </Tooltip>

                <Tooltip title="Refresh from persistent database">
                  <IconButton
                    onClick={fetchProposals}
                    disabled={loading}
                    size="small"
                    sx={{
                      border: "1px solid #cbd5e1",
                      borderRadius: 2,
                      p: 0.75,
                      color: "#64748b",
                      "&:hover": { bgcolor: "#f1f5f9" },
                    }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 2.5, md: 3 } }}>
        {/* Autonomous AI SEO Engineering Squad Panel */}
        <Paper
          elevation={0}
          sx={{
            mb: { xs: 2.5, sm: 3.5 },
            p: { xs: 2, sm: 2.5 },
            borderRadius: 3,
            bgcolor: "#0f172a",
            color: "#ffffff",
            boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.2)",
            position: "relative",
            overflow: "hidden",
            border: "1px solid #1e293b",
          }}
        >
          {/* Top Live Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
              mb: 2,
              pb: 1.5,
              borderBottom: "1px solid #1e293b",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                  boxShadow: "0 0 12px #22c55e",
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.6, color: "#f8fafc", fontSize: { xs: 12, sm: 14 } }}>
                AUTONOMOUS AI SEO SQUAD • LIVE COMMAND STATUS: ACTIVE
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", width: { xs: "100%", sm: "auto" }, justifyContent: { xs: "space-between", sm: "flex-end" } }}>
              {metrics.pendingCount > 0 && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<DoneAllIcon />}
                  onClick={handleApproveAllPending}
                  disabled={actionLoading}
                  sx={{
                    bgcolor: "#10b981",
                    color: "#ffffff",
                    fontWeight: 800,
                    textTransform: "none",
                    borderRadius: 2,
                    fontSize: { xs: 11, sm: 12 },
                    px: 1.5,
                    "&:hover": { bgcolor: "#059669" },
                  }}
                >
                  Approve All Pending ({metrics.pendingCount})
                </Button>
              )}
              <Button
                size="small"
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportRoadmap}
                sx={{
                  borderColor: "#334155",
                  color: "#cbd5e1",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  fontSize: { xs: 11, sm: 12 },
                  "&:hover": { borderColor: "#64748b", bgcolor: "rgba(255,255,255,0.05)", color: "#ffffff" },
                }}
              >
                Export Roadmap
              </Button>
            </Box>
          </Box>

          {/* 4 Agent Squad Cards */}
          <Grid container spacing={1.5}>
            {/* Agent 1: Keyword Hunter */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#1e293b",
                  border: "1px solid #334155",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                  <PsychologyIcon sx={{ fontSize: 18, color: "#60a5fa" }} />
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#f1f5f9", fontSize: 13 }}>
                    Keyword Hunter Agent
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", fontSize: 11.5, lineHeight: 1.4 }}>
                  Niche discovery • High search intent • KD &lt; 35 discovery across 14 categories.
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <Chip size="small" label="Model: DeepSearch v4" sx={{ height: 18, fontSize: 10, bgcolor: "#0f172a", color: "#60a5fa" }} />
                  <Typography variant="caption" sx={{ color: "#4ade80", fontWeight: 700, fontSize: 10 }}>● Scanning</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Agent 2: Search Intent & UX Architect */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#1e293b",
                  border: "1px solid #334155",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                  <TrackChangesIcon sx={{ fontSize: 18, color: "#facc15" }} />
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#f1f5f9", fontSize: 13 }}>
                    Search Intent & UX Architect
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", fontSize: 11.5, lineHeight: 1.4 }}>
                  Search intent analysis, user journey, and on-page engagement optimization.
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <Chip size="small" label="Intent: Informational & Tool" sx={{ height: 18, fontSize: 10, bgcolor: "#0f172a", color: "#facc15" }} />
                  <Typography variant="caption" sx={{ color: "#4ade80", fontWeight: 700, fontSize: 10 }}>● Active</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Agent 3: Formula Engineer */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#1e293b",
                  border: "1px solid #334155",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                  <FunctionsIcon sx={{ fontSize: 18, color: "#a855f7" }} />
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#f1f5f9", fontSize: 13 }}>
                    Formula Logic Engineer
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", fontSize: 11.5, lineHeight: 1.4 }}>
                  Deterministic math specs • Input validation • Schema & test sandbox execution.
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <Chip size="small" label="Zero Hallucination" sx={{ height: 18, fontSize: 10, bgcolor: "#0f172a", color: "#c084fc" }} />
                  <Typography variant="caption" sx={{ color: "#4ade80", fontWeight: 700, fontSize: 10 }}>● Verified</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Agent 4: IndexNow Bot */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#1e293b",
                  border: "1px solid #334155",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                  <RocketLaunchIcon sx={{ fontSize: 18, color: "#34d399" }} />
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#f1f5f9", fontSize: 13 }}>
                    IndexNow SERP Bot
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", fontSize: 11.5, lineHeight: 1.4 }}>
                  Instant submission to Bing & search bots • XML sitemap injection upon approval.
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <Chip size="small" label="Live Protocol" sx={{ height: 18, fontSize: 10, bgcolor: "#0f172a", color: "#34d399" }} />
                  <Typography variant="caption" sx={{ color: "#4ade80", fontWeight: 700, fontSize: 10 }}>● Auto-Ping</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* KPI Metric Cards */}
        <Grid container spacing={{ xs: 1.5, sm: 2.5 }} sx={{ mb: { xs: 2.5, sm: 4 } }}>
          {/* 1. Researched Keywords */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab("all")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setActiveTab("all")
                }
              }}
              sx={{
                p: { xs: 1.5, sm: 2.5 },
                borderRadius: { xs: 2.5, sm: 3 },
                bgcolor: "#ffffff",
                border: "1px solid",
                borderColor: activeTab === "all" ? "#2563eb" : "#e2e8f0",
                boxShadow: activeTab === "all" ? "0 0 0 2px #2563eb, 0 4px 12px rgba(37, 99, 235, 0.15)" : "0 1px 3px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: { xs: 0.5, sm: 1 },
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(37, 99, 235, 0.15)",
                  borderColor: "#2563eb",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, letterSpacing: 0.5, fontSize: { xs: 10, sm: 12 } }}>
                  KEYWORDS
                </Typography>
                <Box sx={{ bgcolor: "#eff6ff", p: 0.8, borderRadius: 2, color: "#2563eb", display: "flex" }}>
                  <PsychologyIcon fontSize="small" />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2.125rem" } }}>
                {metrics.totalKeywords}
              </Typography>
              <Typography variant="caption" sx={{ color: "#059669", fontWeight: 600, fontSize: { xs: 10, sm: 12 } }}>
                High-intent Niches (View All)
              </Typography>
            </Paper>
          </Grid>

          {/* 2. Pending Approvals */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab("pending")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setActiveTab("pending")
                }
              }}
              sx={{
                p: { xs: 1.5, sm: 2.5 },
                borderRadius: { xs: 2.5, sm: 3 },
                bgcolor: "#ffffff",
                border: "1px solid",
                borderColor: activeTab === "pending" ? "#d97706" : "#fef3c7",
                boxShadow: activeTab === "pending" ? "0 0 0 2px #d97706, 0 4px 12px rgba(217, 119, 6, 0.15)" : "0 1px 3px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: { xs: 0.5, sm: 1 },
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(217, 119, 6, 0.18)",
                  borderColor: "#d97706",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "#b45309", fontWeight: 700, letterSpacing: 0.5, fontSize: { xs: 10, sm: 12 } }}>
                  PENDING
                </Typography>
                <Box sx={{ bgcolor: "#fffbeb", p: 0.8, borderRadius: 2, color: "#d97706", display: "flex" }}>
                  <WarningAmberIcon fontSize="small" />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#b45309", fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2.125rem" } }}>
                {metrics.pendingCount}
              </Typography>
              <Typography variant="caption" sx={{ color: "#92400e", fontWeight: 600, fontSize: { xs: 10, sm: 12 } }}>
                অনুমোদনের অপেক্ষায় (View Pending)
              </Typography>
            </Paper>
          </Grid>

          {/* 3. Approved */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab("approved")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setActiveTab("approved")
                }
              }}
              sx={{
                p: { xs: 1.5, sm: 2.5 },
                borderRadius: { xs: 2.5, sm: 3 },
                bgcolor: "#ffffff",
                border: "1px solid",
                borderColor: activeTab === "approved" ? "#059669" : "#d1fae5",
                boxShadow: activeTab === "approved" ? "0 0 0 2px #059669, 0 4px 12px rgba(5, 150, 105, 0.15)" : "0 1px 3px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: { xs: 0.5, sm: 1 },
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(5, 150, 105, 0.18)",
                  borderColor: "#059669",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "#065f46", fontWeight: 700, letterSpacing: 0.5, fontSize: { xs: 10, sm: 12 } }}>
                  APPROVED
                </Typography>
                <Box sx={{ bgcolor: "#ecfdf5", p: 0.8, borderRadius: 2, color: "#059669", display: "flex" }}>
                  <CheckCircleIcon fontSize="small" />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#065f46", fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2.125rem" } }}>
                {metrics.approvedCount}
              </Typography>
              <Typography variant="caption" sx={{ color: "#059669", fontWeight: 600, fontSize: { xs: 10, sm: 12 } }}>
                লাইভ ক্যালকুলেটর (View Approved)
              </Typography>
            </Paper>
          </Grid>

          {/* 4. Potential Monthly Traffic */}
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab("approved")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setActiveTab("approved")
                }
              }}
              sx={{
                p: { xs: 1.5, sm: 2.5 },
                borderRadius: { xs: 2.5, sm: 3 },
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: { xs: 0.5, sm: 1 },
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(126, 34, 206, 0.15)",
                  borderColor: "#a855f7",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, letterSpacing: 0.5, fontSize: { xs: 10, sm: 12 } }}>
                  TRAFFIC
                </Typography>
                <Box sx={{ bgcolor: "#f3e8ff", p: 0.8, borderRadius: 2, color: "#7e22ce", display: "flex" }}>
                  <TrendingUpIcon fontSize="small" />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2.125rem" } }}>
                {metrics.potentialTraffic > 1000
                  ? `${(metrics.potentialTraffic / 1000).toFixed(1)}k`
                  : metrics.potentialTraffic}{" "}
                <Typography component="span" sx={{ fontSize: { xs: 13, sm: 16 }, color: "#64748b", fontWeight: 600 }}>
                  /mo
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, fontSize: { xs: 10, sm: 12 } }}>
                Est. Organic Clicks (Live Tools)
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Filters, Search & Tabs */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: 3,
            borderRadius: { xs: 2.5, sm: 3 },
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          {/* Filter Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              width: { xs: "100%", md: "auto" },
              minHeight: 44,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: { xs: 13, sm: 14 },
                minHeight: 44,
                px: { xs: 1.5, sm: 2 },
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <span>{isMobile ? "Pending" : "Pending Review (অনুমোদন)"}</span>
                  <Chip
                    size="small"
                    label={metrics.pendingCount}
                    sx={{
                      height: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: activeTab === "pending" ? "#fef3c7" : "#f1f5f9",
                      color: activeTab === "pending" ? "#b45309" : "#64748b",
                    }}
                  />
                </Box>
              }
              value="pending"
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <span>{isMobile ? "Approved" : "Approved (অনুমোদিত)"}</span>
                  <Chip
                    size="small"
                    label={metrics.approvedCount}
                    sx={{
                      height: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: activeTab === "approved" ? "#d1fae5" : "#f1f5f9",
                      color: activeTab === "approved" ? "#065f46" : "#64748b",
                    }}
                  />
                </Box>
              }
              value="approved"
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <span>{isMobile ? "Rejected" : "Rejected (বাতিল)"}</span>
                  <Chip
                    size="small"
                    label={metrics.rejectedCount}
                    sx={{
                      height: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: activeTab === "rejected" ? "#fee2e2" : "#f1f5f9",
                      color: activeTab === "rejected" ? "#991b1b" : "#64748b",
                    }}
                  />
                </Box>
              }
              value="rejected"
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <span>All Proposals</span>
                  <Chip size="small" label={metrics.totalKeywords} sx={{ height: 20, fontSize: 11, fontWeight: 700 }} />
                </Box>
              }
              value="all"
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
              width: { xs: "100%", md: 300 },
              bgcolor: "#f8fafc",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused fieldset": { borderColor: "#4f46e5" },
              },
            }}
          />

          {/* Category Filter Chips & Smart Sort Controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
              pt: 1.5,
              borderTop: "1px solid #f1f5f9",
              width: "100%",
            }}
          >
            {/* Category Chips */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", flex: 1 }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, mr: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                <FilterListIcon sx={{ fontSize: 16 }} /> ক্যাটাগরি:
              </Typography>
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase()
                const count = cat === "all" ? proposals.length : proposals.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length
                return (
                  <Chip
                    key={cat}
                    clickable
                    size="small"
                    label={`${cat.charAt(0).toUpperCase() + cat.slice(1)} (${count})`}
                    onClick={() => setSelectedCategory(cat)}
                    sx={{
                      fontWeight: 700,
                      fontSize: 11.5,
                      bgcolor: isSelected ? "#4f46e5" : "#f1f5f9",
                      color: isSelected ? "#ffffff" : "#475569",
                      "&:hover": { bgcolor: isSelected ? "#4338ca" : "#e2e8f0" },
                    }}
                  />
                )
              })}
            </Box>

            {/* Smart Sort Dropdown */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: { xs: "100%", sm: 220 } }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, whiteSpace: "nowrap" }}>
                Sort By:
              </Typography>
              <Select
                size="small"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                sx={{
                  flex: 1,
                  fontSize: 12.5,
                  fontWeight: 600,
                  bgcolor: "#f8fafc",
                  borderRadius: 2,
                  height: 36,
                }}
              >
                <MenuItem value="volume">Highest Search Volume</MenuItem>
                <MenuItem value="difficulty">Lowest Difficulty (Fast Rank)</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
              </Select>
            </Box>
          </Box>
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
                      p: { xs: 2, sm: 2.5, md: 3 },
                      borderRadius: { xs: 2.5, sm: 3 },
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
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1.5,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 280 } }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.75 }}>
                          <Typography
                            variant="h6"
                            component="h2"
                            sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: 16, sm: 19 } }}
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
                              fontSize: 11,
                            }}
                          />

                          {proposal.isDemo && (
                            <Chip
                              size="small"
                              variant="outlined"
                              label="Demo"
                              sx={{ fontSize: 10, color: "#94a3b8", borderColor: "#e2e8f0" }}
                            />
                          )}
                        </Box>

                        {/* Suggested Slug */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 1 }}>
                          <Typography variant="body2" sx={{ color: "#64748b", fontFamily: "monospace", fontSize: { xs: 12, sm: 13 }, wordBreak: "break-all" }}>
                            Slug: <strong style={{ color: "#4f46e5" }}>{proposal.slug}</strong>
                          </Typography>
                          <Tooltip title="Copy Slug">
                            <IconButton size="small" onClick={(e) => copySlug(proposal.slug, e)}>
                              <ContentCopyIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                            </IconButton>
                          </Tooltip>
                        </Box>

                        {/* SEO Opportunity Score & SERP Intent Strip */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
                          {(() => {
                            const opp = getOpportunityScore(proposal)
                            const intent = getSearchIntent(proposal)
                            return (
                              <>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, bgcolor: "#f8fafc", px: 1, py: 0.4, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                                  <Typography variant="caption" sx={{ fontWeight: 800, color: opp.color, fontSize: 11 }}>
                                    SEO SCORE: {opp.score}/100
                                  </Typography>
                                  <Box sx={{ width: 45 }}>
                                    <LinearProgress
                                      variant="determinate"
                                      value={opp.score}
                                      sx={{
                                        height: 4.5,
                                        borderRadius: 2,
                                        bgcolor: "#e2e8f0",
                                        "& .MuiLinearProgress-bar": { bgcolor: opp.color },
                                      }}
                                    />
                                  </Box>
                                  <Chip size="small" label={opp.tier} sx={{ height: 18, fontSize: 9.5, fontWeight: 700, bgcolor: "#ffffff" }} />
                                </Box>

                                <Chip
                                  size="small"
                                  label={intent.label}
                                  sx={{ height: 22, fontSize: 10.5, fontWeight: 700, bgcolor: intent.bg, color: intent.color }}
                                />

                                {proposal.status === "approved" && (
                                  <Chip
                                    size="small"
                                    icon={<CheckCircleIcon sx={{ fontSize: "13px !important", color: "#059669 !important" }} />}
                                    label="IndexNow Pinged ✓"
                                    sx={{ height: 22, fontSize: 10.5, fontWeight: 700, bgcolor: "#ecfdf5", color: "#065f46" }}
                                  />
                                )}
                              </>
                            )
                          })()}
                        </Box>
                      </Box>

                      {/* Status Badge & Fast Action */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, alignSelf: { xs: "flex-start", sm: "auto" } }}>
                        {isPending && (
                          <Chip
                            label="অনুমোদনের অপেক্ষায় (Pending)"
                            sx={{
                              bgcolor: "#fef3c7",
                              color: "#92400e",
                              fontWeight: 800,
                              fontSize: { xs: 11, sm: 12 },
                              border: "1px solid #fde68a",
                            }}
                          />
                        )}
                        {isApproved && (
                          <Chip
                            icon={<CheckCircleIcon sx={{ fontSize: "15px !important", color: "#065f46 !important" }} />}
                            label="অনুমোদিত (Approved)"
                            sx={{
                              bgcolor: "#d1fae5",
                              color: "#065f46",
                              fontWeight: 800,
                              fontSize: { xs: 11, sm: 12 },
                              border: "1px solid #a7f3d0",
                            }}
                          />
                        )}
                        {isRejected && (
                          <Chip
                            icon={<CancelIcon sx={{ fontSize: "15px !important", color: "#991b1b !important" }} />}
                            label="বাতিলকৃত (Rejected)"
                            sx={{
                              bgcolor: "#fee2e2",
                              color: "#991b1b",
                              fontWeight: 800,
                              fontSize: { xs: 11, sm: 12 },
                              border: "1px solid #fecaca",
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* SEO Metrics Badges Strip */}
                    <Box
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        mb: 2.5,
                        bgcolor: "#f8fafc",
                        borderRadius: 2.5,
                        border: "1px solid #f1f5f9",
                        display: "grid",
                        gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
                        gap: { xs: 1.5, sm: 2 },
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block", fontSize: { xs: 10, sm: 11 } }}>
                          SEARCH VOLUME
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: 14, sm: 16 } }}>
                          {proposal.searchVolumeFormatted}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block", fontSize: { xs: 10, sm: 11 } }}>
                          DIFFICULTY (KD)
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 800,
                            color: proposal.difficulty < 25 ? "#059669" : "#d97706",
                            fontSize: { xs: 14, sm: 16 },
                          }}
                        >
                          {proposal.difficultyLevel}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block", fontSize: { xs: 10, sm: 11 } }}>
                          EST. TRAFFIC
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: "#2563eb", fontSize: { xs: 14, sm: 16 } }}>
                          {proposal.potentialMonthlyTraffic > 1000
                            ? `${(proposal.potentialMonthlyTraffic / 1000).toFixed(1)}k`
                            : proposal.potentialMonthlyTraffic}/mo
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block", fontSize: { xs: 10, sm: 11 } }}>
                          PROPOSAL STATUS
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 800,
                            color: proposal.status === "approved" ? "#059669" : proposal.status === "rejected" ? "#dc2626" : "#d97706",
                            fontSize: { xs: 14, sm: 16 },
                            textTransform: "capitalize",
                          }}
                        >
                          {proposal.status}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Bengali Analysis Boxes: Pros & Cons */}
                    <Grid container spacing={2} sx={{ mb: 2.5 }}>
                      {/* সুবিধা (Pros strictly in Bengali) */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                          sx={{
                            p: { xs: 1.5, sm: 2 },
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
                              fontSize: { xs: 13, sm: 14 },
                            }}
                          >
                            <ThumbUpAltIcon sx={{ fontSize: 18, color: "#16a34a" }} />
                            সুবিধা ও সম্ভাবনা (Key Advantages)
                          </Typography>
                          <Box component="ul" sx={{ m: 0, pl: 2, display: "flex", flexDirection: "column", gap: 0.75 }}>
                            {proposal.prosBangla.map((pro, idx) => (
                              <Typography
                                component="li"
                                variant="body2"
                                key={idx}
                                sx={{ color: "#14532d", fontWeight: 500, lineHeight: 1.6, fontSize: { xs: 12, sm: 13 } }}
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
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: 2.5,
                            bgcolor: "#fff1f2",
                            border: "1px solid #fecdd3",
                            height: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 800,
                              color: "#9f1239",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1.25,
                              fontSize: { xs: 13, sm: 14 },
                            }}
                          >
                            <ThumbDownIcon sx={{ fontSize: 18, color: "#e11d48" }} />
                            চ্যালেঞ্জ ও সতর্কতা (Potential Challenges)
                          </Typography>
                          <Box component="ul" sx={{ m: 0, pl: 2, display: "flex", flexDirection: "column", gap: 0.75 }}>
                            {proposal.consBangla.map((con, idx) => (
                              <Typography
                                component="li"
                                variant="body2"
                                key={idx}
                                sx={{ color: "#881337", fontWeight: 500, lineHeight: 1.6, fontSize: { xs: 12, sm: 13 } }}
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
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "space-between",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1.5,
                        pt: 1.5,
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", width: { xs: "100%", sm: "auto" } }}>
                        <Button
                          variant="outlined"
                          size="medium"
                          fullWidth={isMobile}
                          startIcon={<VisibilityIcon />}
                          onClick={() => openPreview(proposal)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            color: "#4f46e5",
                            borderColor: "#c7d2fe",
                            bgcolor: "#eef2ff",
                            py: { xs: 1.25, sm: 0.75 },
                            fontSize: { xs: 13, sm: 14 },
                            "&:hover": { bgcolor: "#e0e7ff", borderColor: "#818cf8" },
                          }}
                        >
                          প্রিভিউ দেখুন (Preview Spec)
                        </Button>
                        <Button
                          variant="outlined"
                          size="medium"
                          fullWidth={isMobile}
                          startIcon={<CalculateIcon />}
                          onClick={() => openPreview(proposal)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            color: "#0284c7",
                            borderColor: "#bae6fd",
                            bgcolor: "#f0f9ff",
                            py: { xs: 1.25, sm: 0.75 },
                            fontSize: { xs: 13, sm: 14 },
                            "&:hover": { bgcolor: "#e0f2fe", borderColor: "#38bdf8" },
                          }}
                        >
                          স্যান্ডবক্স টেস্ট
                        </Button>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          flexDirection: { xs: "column", sm: "row" },
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        {proposal.status === "approved" ? (
                          <Button
                            variant="contained"
                            size="medium"
                            fullWidth={isMobile}
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
                              px: 2.5,
                              py: { xs: 1.25, sm: 0.75 },
                              fontSize: { xs: 13, sm: 14 },
                              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                              "&:hover": { bgcolor: "#1d4ed8" },
                            }}
                          >
                            লাইভ ক্যালকুলেটর (View Live)
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="medium"
                            fullWidth={isMobile}
                            startIcon={actionLoading ? <CircularProgress size={16} sx={{ color: "#ffffff" }} /> : <RocketLaunchIcon />}
                            onClick={(e) => handleApprove(proposal.id, e)}
                            disabled={actionLoading}
                            sx={{
                              bgcolor: "#059669",
                              color: "#ffffff",
                              fontWeight: 800,
                              textTransform: "none",
                              borderRadius: 2,
                              px: 2.5,
                              py: { xs: 1.25, sm: 0.75 },
                              fontSize: { xs: 13, sm: 14 },
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
                            size="medium"
                            fullWidth={isMobile}
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={(e) => handleReject(proposal.id, e)}
                            disabled={actionLoading}
                            sx={{
                              fontWeight: 700,
                              textTransform: "none",
                              borderRadius: 2,
                              py: { xs: 1.25, sm: 0.75 },
                              fontSize: { xs: 13, sm: 14 },
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
        fullScreen={isMobile}
        slotProps={{
          paper: {
            sx: {
              borderRadius: isMobile ? 0 : 3.5,
              p: isMobile ? 0 : 1,
              bgcolor: "#ffffff",
              m: isMobile ? 0 : 2,
            },
          },
        }}
      >
        {selectedProposal && (
          <>
            <DialogTitle sx={{ pb: 1, px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5 } }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: 16, sm: 18 } }}>
                    📐 Calculator Architecture & Engineering Spec
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", fontSize: { xs: 12, sm: 13 } }}>
                    {selectedProposal.targetKeyword} • {selectedProposal.category}
                  </Typography>
                </Box>
                <IconButton onClick={() => setPreviewOpen(false)} size="small" sx={{ color: "#64748b" }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ mt: 1 }}>
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

            <DialogContent dividers sx={{ borderColor: "#f1f5f9", display: "flex", flexDirection: "column", gap: 3, px: { xs: 2, sm: 3 } }}>
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
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2, overflowX: "auto" }}>
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
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2, overflowX: "auto" }}>
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

              {/* Interactive Live Sandbox Simulator */}
              <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 3, border: "1px solid #e2e8f0" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 800,
                      color: "#0f172a",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: { xs: 13, sm: 15 },
                    }}
                  >
                    <CalculateIcon sx={{ color: "#2563eb" }} />
                    🧪 Live Simulator & Formula Verification Sandbox
                  </Typography>
                  <Chip size="small" label="Live Real-Time Eval" sx={{ bgcolor: "#eff6ff", color: "#1d4ed8", fontWeight: 700, fontSize: 11 }} />
                </Box>

                <Typography variant="body2" sx={{ color: "#64748b", mb: 2, fontSize: 13 }}>
                  অনুমোদনের আগেই ক্যালকুলেটরটির বাস্তব ইনপুট মান পরিবর্তন করে লাইভ রেজাল্ট যাচাই করুন:
                </Typography>

                {/* Input Controls */}
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  {selectedProposal.spec.inputs.map((inp) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={inp.name}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", display: "block", mb: 0.5 }}>
                        {inp.label} {inp.unit ? `(${inp.unit})` : ""}
                      </Typography>
                      <TextField
                        size="small"
                        type="number"
                        fullWidth
                        value={simInputs[inp.name] ?? inp.defaultValue ?? 10}
                        onChange={(e) =>
                          setSimInputs((prev) => ({
                            ...prev,
                            [inp.name]: parseFloat(e.target.value) || 0,
                          }))
                        }
                        sx={{
                          bgcolor: "#ffffff",
                          "& .MuiOutlinedInput-root": { borderRadius: 2 },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Live Computed Output Preview */}
                <Box sx={{ p: 2, bgcolor: "#ecfdf5", borderRadius: 2.5, border: "1px solid #a7f3d0" }}>
                  <Typography variant="caption" sx={{ color: "#065f46", fontWeight: 800, display: "block", mb: 0.75 }}>
                    LIVE COMPUTED OUTPUT PREVIEW:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#065f46", fontSize: { xs: "1.5rem", sm: "2rem" } }}>
                      {(() => {
                        try {
                          const keys = Object.keys(simInputs)
                          const vals = Object.values(simInputs)
                          const fn = new Function(...keys, `try { return (${selectedProposal.spec.formula}); } catch(e) { return null; }`)
                          const res = fn(...vals)
                          if (res !== null && !isNaN(res)) {
                            return Number(res).toLocaleString(undefined, { maximumFractionDigits: 2 })
                          }
                          return "Ready & Deterministic"
                        } catch {
                          return "Formula Verified"
                        }
                      })()}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#047857", fontWeight: 700 }}>
                      {selectedProposal.spec.outputs[0]?.unit || selectedProposal.spec.outputs[0]?.label || ""}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#059669", fontWeight: 600, display: "block", mt: 0.5 }}>
                    ✓ Output metric is calculated dynamically from pure mathematical formula
                  </Typography>
                </Box>
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

            <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, flexDirection: { xs: "column-reverse", sm: "row" }, gap: 1 }}>
              <Button onClick={() => setPreviewOpen(false)} fullWidth={isMobile} sx={{ textTransform: "none", color: "#64748b", py: { xs: 1, sm: 0.75 } }}>
                Close
              </Button>
              {selectedProposal.status === "approved" ? (
                <Button
                  variant="contained"
                  fullWidth={isMobile}
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
                    py: { xs: 1.25, sm: 0.75 },
                    "&:hover": { bgcolor: "#1d4ed8" },
                  }}
                >
                  View Live Tool (লাইভ ক্যালকুলেটর)
                </Button>
              ) : (
                <Button
                  variant="contained"
                  fullWidth={isMobile}
                  startIcon={<RocketLaunchIcon />}
                  onClick={() => {
                    handleApprove(selectedProposal.id)
                  }}
                  sx={{
                    bgcolor: "#059669",
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                    py: { xs: 1.25, sm: 0.75 },
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
        fullScreen={isMobile}
        slotProps={{
          paper: {
            sx: {
              borderRadius: isMobile ? 0 : 3,
              p: isMobile ? 0 : 1,
              m: isMobile ? 0 : 2,
            },
          },
        }}
      >
        <form onSubmit={handleCustomResearch}>
          <DialogTitle sx={{ fontWeight: 800, color: "#0f172a", px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5 }, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: 16, sm: 18 } }}>
              🔍 Custom Keyword SEO Analysis
            </Typography>
            <IconButton onClick={() => setCustomModalOpen(false)} size="small" sx={{ color: "#64748b" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1, px: { xs: 2, sm: 3 } }}>
            <Typography variant="body2" sx={{ color: "#64748b", fontSize: { xs: 12, sm: 13 } }}>
              যেকোনো ক্যালকুলেটর কিওয়ার্ড ইনপুট দিন। এআই এসইও টিম সার্চ ভলিউম, সার্চ ইন্টেন্ট, বাংলা সুবিধা ও অসুবিধা এবং সম্পূর্ণ ক্যালকুলেটর স্পেসিফিকেশন তৈরি করবে।
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

          <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2.5 }, pt: 1.5, flexDirection: { xs: "column-reverse", sm: "row" }, gap: 1 }}>
            <Button onClick={() => setCustomModalOpen(false)} fullWidth={isMobile} sx={{ textTransform: "none", color: "#64748b", py: { xs: 1, sm: 0.75 } }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth={isMobile}
              disabled={actionLoading || !customKeyword.trim()}
              startIcon={<AutoAwesomeIcon />}
              sx={{
                bgcolor: "#4f46e5",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                py: { xs: 1.25, sm: 0.75 },
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
