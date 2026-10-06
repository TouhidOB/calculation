"use client"

import React, { useState, useMemo } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Slider from "@mui/material/Slider"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Tooltip from "@mui/material/Tooltip"
import Grid from "@mui/material/Grid"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Alert from "@mui/material/Alert"
import LinearProgress from "@mui/material/LinearProgress"
import Divider from "@mui/material/Divider"
import DnsIcon from "@mui/icons-material/Dns"
import StorageIcon from "@mui/icons-material/Storage"
import SpeedIcon from "@mui/icons-material/Speed"
import SecurityIcon from "@mui/icons-material/Security"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import PrintIcon from "@mui/icons-material/Print"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import BoltIcon from "@mui/icons-material/Bolt"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"

// Types
export interface RaidCalculatorViewProps {
  onToast?: (msg: string) => void
}

interface RaidConfigMeta {
  name: string
  fullName: string
  minDrives: number
  description: string
  maxFaultTolerance: (n: number) => number
  computeUsableTB: (n: number, s: number, spares: number) => {
    usableTB: number
    parityTB: number
    mirrorTB: number
    spareTB: number
    wastedTB: number
  }
  readMultiplier: (n: number) => number
  writeMultiplier: (n: number) => number
  writePenalty: number
  pros: string[]
  cons: string[]
}

const RAID_TYPES: Record<string, RaidConfigMeta> = {
  raid0: {
    name: "RAID 0",
    fullName: "Striping (No Redundancy)",
    minDrives: 2,
    description: "Maximum speed and 100% capacity. Data is split evenly across all drives.",
    maxFaultTolerance: () => 0,
    computeUsableTB: (n, s, spares) => {
      const active = Math.max(0, n - spares)
      return {
        usableTB: active * s,
        parityTB: 0,
        mirrorTB: 0,
        spareTB: spares * s,
        wastedTB: 0,
      }
    },
    readMultiplier: (n) => n,
    writeMultiplier: (n) => n,
    writePenalty: 1,
    pros: ["100% storage efficiency", "Maximum read/write performance", "No CPU parity calculation overhead"],
    cons: ["Zero fault tolerance (1 drive failure = 100% data loss)", "Never use for critical or unbacked data"],
  },
  raid1: {
    name: "RAID 1",
    fullName: "Mirroring (1:1 Duplication)",
    minDrives: 2,
    description: "Exact replica of data across mirrored drives. Excellent read speed and high fault tolerance.",
    maxFaultTolerance: (n) => n - 1,
    computeUsableTB: (n, s, spares) => {
      const active = Math.max(0, n - spares)
      const usable = active > 0 ? s : 0
      const mirror = Math.max(0, (active - 1) * s)
      return {
        usableTB: usable,
        parityTB: 0,
        mirrorTB: mirror,
        spareTB: spares * s,
        wastedTB: 0,
      }
    },
    readMultiplier: (n) => n,
    writeMultiplier: () => 1,
    writePenalty: 2,
    pros: ["Simple and fast recovery", "Can lose all but one mirrored drive", "Fast multi-threaded read IOPS"],
    cons: ["High storage cost (50% capacity with 2 drives, less with 3+)", "Slow write performance relative to RAID 0"],
  },
  raid5: {
    name: "RAID 5",
    fullName: "Distributed Single Parity",
    minDrives: 3,
    description: "Data and single parity distributed across 3+ drives. Balances capacity, speed, and safety.",
    maxFaultTolerance: () => 1,
    computeUsableTB: (n, s, spares) => {
      const active = Math.max(0, n - spares)
      if (active < 3) return { usableTB: 0, parityTB: 0, mirrorTB: 0, spareTB: spares * s, wastedTB: active * s }
      return {
        usableTB: (active - 1) * s,
        parityTB: 1 * s,
        mirrorTB: 0,
        spareTB: spares * s,
        wastedTB: 0,
      }
    },
    readMultiplier: (n) => Math.max(1, n - 1),
    writeMultiplier: (n) => Math.max(0.25, (n - 1) / 4),
    writePenalty: 4,
    pros: ["High capacity efficiency ((N-1)/N)", "Cost effective for 3-5 drives", "Fast sequential read speeds"],
    cons: ["Only 1 drive failure allowed", "High URE rebuild failure risk on large drives (>8TB)", "Heavy write penalty (4 I/O per write)"],
  },
  raid6: {
    name: "RAID 6",
    fullName: "Distributed Dual Parity (P+Q)",
    minDrives: 4,
    description: "Dual parity blocks distributed across 4+ drives. Withstands simultaneous loss of any 2 drives.",
    maxFaultTolerance: () => 2,
    computeUsableTB: (n, s, spares) => {
      const active = Math.max(0, n - spares)
      if (active < 4) return { usableTB: 0, parityTB: 0, mirrorTB: 0, spareTB: spares * s, wastedTB: active * s }
      return {
        usableTB: (active - 2) * s,
        parityTB: 2 * s,
        mirrorTB: 0,
        spareTB: spares * s,
        wastedTB: 0,
      }
    },
    readMultiplier: (n) => Math.max(1, n - 2),
    writeMultiplier: (n) => Math.max(0.2, (n - 2) / 6),
    writePenalty: 6,
    pros: ["Tolerates 2 concurrent drive failures", "Safe against URE during rebuild on 10TB+ HDDs", "Industry standard for enterprise NAS & SAN"],
    cons: ["Requires minimum 4 drives", "Higher parity penalty (6 I/O per random write)", "Slightly longer rebuild times"],
  },
  raid10: {
    name: "RAID 10",
    fullName: "1+0 Striped Mirrors",
    minDrives: 4,
    description: "Stripe of mirrored pairs (RAID 1+0). Combines extreme IOPS performance with rapid, stress-free rebuilds.",
    maxFaultTolerance: (n) => Math.floor(n / 2),
    computeUsableTB: (n, s, spares) => {
      const active = Math.max(0, n - spares)
      const validEven = active - (active % 2)
      const wasted = (active % 2) * s
      if (validEven < 4) return { usableTB: 0, parityTB: 0, mirrorTB: 0, spareTB: spares * s, wastedTB: active * s }
      return {
        usableTB: (validEven / 2) * s,
        parityTB: 0,
        mirrorTB: (validEven / 2) * s,
        spareTB: spares * s,
        wastedTB: wasted,
      }
    },
    readMultiplier: (n) => n,
    writeMultiplier: (n) => n / 2,
    writePenalty: 2,
    pros: ["Top-tier random read & write IOPS", "Blazing fast rebuild times (simple mirror copy)", "No heavy parity CPU calculations"],
    cons: ["Only 50% storage capacity efficiency", "Requires an even number of drives (min 4)"],
  },
  raid50: {
    name: "RAID 50",
    fullName: "Striped RAID 5 Sub-Arrays",
    minDrives: 6,
    description: "RAID 0 stripe across two or more RAID 5 parity groups. High capacity with better IOPS than single RAID 5.",
    maxFaultTolerance: () => 2,
    computeUsableTB: (n, s, spares) => {
      const active = Math.max(0, n - spares)
      if (active < 6) return { usableTB: 0, parityTB: 0, mirrorTB: 0, spareTB: spares * s, wastedTB: active * s }
      const groups = 2
      return {
        usableTB: (active - groups) * s,
        parityTB: groups * s,
        mirrorTB: 0,
        spareTB: spares * s,
        wastedTB: 0,
      }
    },
    readMultiplier: (n) => n - 2,
    writeMultiplier: (n) => (n - 2) / 3,
    writePenalty: 4,
    pros: ["Better write throughput and rebuild times than RAID 5", "Tolerates 1 failure per sub-group (up to 2 total)", "Great for 8 to 24 bay arrays"],
    cons: ["Array fails if 2 drives die within the SAME sub-group", "Minimum 6 drives required"],
  },
  raid60: {
    name: "RAID 60",
    fullName: "Striped RAID 6 Sub-Arrays",
    minDrives: 8,
    description: "RAID 0 stripe across two RAID 6 dual-parity groups. Extreme enterprise protection for large arrays.",
    maxFaultTolerance: () => 4,
    computeUsableTB: (n, s, spares) => {
      const active = Math.max(0, n - spares)
      if (active < 8) return { usableTB: 0, parityTB: 0, mirrorTB: 0, spareTB: spares * s, wastedTB: active * s }
      const groups = 2
      return {
        usableTB: (active - 2 * groups) * s,
        parityTB: 2 * groups * s,
        mirrorTB: 0,
        spareTB: spares * s,
        wastedTB: 0,
      }
    },
    readMultiplier: (n) => n - 4,
    writeMultiplier: (n) => (n - 4) / 4,
    writePenalty: 6,
    pros: ["Up to 4 drive failure resilience (2 per set)", "Optimal for dense 16 to 36-bay storage chassis", "Safe for 18TB-24TB drives"],
    cons: ["Minimum 8 drives required", "4 drives dedicated to parity overhead"],
  },
  jbod: {
    name: "JBOD",
    fullName: "Just a Bunch of Disks (Spanned)",
    minDrives: 1,
    description: "Concatenates all disks into one large continuous pool. No performance boost and no redundancy.",
    maxFaultTolerance: () => 0,
    computeUsableTB: (n, s, spares) => {
      const active = Math.max(0, n - spares)
      return {
        usableTB: active * s,
        parityTB: 0,
        mirrorTB: 0,
        spareTB: spares * s,
        wastedTB: 0,
      }
    },
    readMultiplier: () => 1,
    writeMultiplier: () => 1,
    writePenalty: 1,
    pros: ["Can mix different disk capacities", "100% capacity usable", "Simple architecture"],
    cons: ["No redundancy (drive loss corrupts spanned volume)", "Single drive performance"],
  },
}

const DRIVE_SIZES = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]

const DRIVE_TYPES: Record<string, { label: string; speedMBs: number; ureRate: number; defaultCost: number }> = {
  hdd_5400: { label: "Consumer HDD (5400 RPM / URE 10^14)", speedMBs: 140, ureRate: 1e14, defaultCost: 110 },
  hdd_7200: { label: "NAS / Enterprise HDD (7200 RPM / URE 10^15)", speedMBs: 240, ureRate: 1e15, defaultCost: 240 },
  sata_ssd: { label: "SATA 2.5\" SSD (550 MB/s / URE 10^16)", speedMBs: 500, ureRate: 1e16, defaultCost: 180 },
  nvme_ssd: { label: "NVMe Gen4 SSD (5000 MB/s / URE 10^17)", speedMBs: 4500, ureRate: 1e17, defaultCost: 320 },
}

const PRESETS = [
  {
    name: "Home NAS / Media Hub",
    badge: "Plex / Synology",
    raid: "raid5",
    drives: 4,
    size: 4,
    type: "hdd_5400",
    spares: 0,
    cost: 95,
  },
  {
    name: "Enterprise File & Backup Server",
    badge: "High Security",
    raid: "raid6",
    drives: 8,
    size: 16,
    type: "hdd_7200",
    spares: 1,
    cost: 290,
  },
  {
    name: "High-Speed 4K/8K Video Editing",
    badge: "Extreme IOPS",
    raid: "raid10",
    drives: 4,
    size: 2,
    type: "nvme_ssd",
    spares: 0,
    cost: 160,
  },
  {
    name: "Mission-Critical Database VM",
    badge: "Fast Rebuild",
    raid: "raid10",
    drives: 8,
    size: 4,
    type: "sata_ssd",
    spares: 0,
    cost: 260,
  },
  {
    name: "Cold Storage Cloud Archive",
    badge: "Maximum Capacity",
    raid: "raid60",
    drives: 16,
    size: 20,
    type: "hdd_7200",
    spares: 2,
    cost: 380,
  },
]

export function RaidCalculatorView({ onToast }: RaidCalculatorViewProps) {
  // Primary States
  const [raidMode, setRaidMode] = useState<string>("raid5")
  const [driveCount, setDriveCount] = useState<number>(6)
  const [driveSizeTB, setDriveSizeTB] = useState<number>(8)
  const [driveType, setDriveType] = useState<string>("hdd_7200")
  const [hotSpares, setHotSpares] = useState<number>(0)
  const [costPerDrive, setCostPerDrive] = useState<number>(180)

  // Interactive Failure Simulation: Set of failed bay indices (0-indexed)
  const [failedBays, setFailedBays] = useState<number[]>([])

  const currentMeta = RAID_TYPES[raidMode] || RAID_TYPES.raid5
  const currentDriveMeta = DRIVE_TYPES[driveType] || DRIVE_TYPES.hdd_7200

  // Quick preset loader
  const handleApplyPreset = (p: typeof PRESETS[0]) => {
    setRaidMode(p.raid)
    setDriveCount(p.drives)
    setDriveSizeTB(p.size)
    setDriveType(p.type)
    setHotSpares(p.spares)
    setCostPerDrive(p.cost)
    setFailedBays([])
    if (onToast) onToast(`Applied preset: ${p.name}`)
  }

  // Toggle failure state for an individual drive bay
  const toggleBayFailure = (bayIndex: number) => {
    setFailedBays((prev) => {
      const exists = prev.includes(bayIndex)
      const next = exists ? prev.filter((b) => b !== bayIndex) : [...prev, bayIndex]
      if (onToast) {
        onToast(
          exists
            ? `Bay ${bayIndex + 1} restored and online`
            : `Bay ${bayIndex + 1} marked as FAILED (Simulated)`
        )
      }
      return next
    })
  }

  // Reset all failed drives
  const handleResetFailures = () => {
    setFailedBays([])
    if (onToast) onToast("All drive bays restored to optimal health")
  }

  // Core Calculations
  const calcResults = useMemo(() => {
    const rawTotalTB = driveCount * driveSizeTB
    const rawTotalTiB = rawTotalTB * (1000 / 1024) ** 4

    const capacity = currentMeta.computeUsableTB(driveCount, driveSizeTB, hotSpares)
    const usableTB = capacity.usableTB
    const parityTB = capacity.parityTB
    const mirrorTB = capacity.mirrorTB
    const spareTB = capacity.spareTB
    const wastedTB = capacity.wastedTB

    const usableTiB = usableTB * (1000 / 1024) ** 4
    const efficiencyPercent = rawTotalTB > 0 ? (usableTB / rawTotalTB) * 100 : 0

    // Fault tolerance based on current RAID mode
    const faultToleranceDrives = currentMeta.maxFaultTolerance(driveCount - hotSpares)

    // Rebuild duration estimate (hours): Rebuild 1 full drive at 70% sustained drive speed
    const rebuildSpeedMBs = currentDriveMeta.speedMBs * 0.65
    const rebuildTimeHours = (driveSizeTB * 1000 * 1000) / (rebuildSpeedMBs * 3600)

    // URE (Unrecoverable Read Error) Probability Calculation during rebuild
    // P(URE) = 1 - (1 - 1/URE_RATE)^(rebuild_bits)
    // Bits to read during rebuild = (N - 1) * driveSizeTB * 8 * 10^12 bits (for parity arrays)
    const activeDrives = Math.max(1, driveCount - hotSpares)
    const bitsReadDuringRebuild =
      raidMode === "raid1" || raidMode === "raid10"
        ? driveSizeTB * 8e12 // Reading only the remaining mirror drive
        : (activeDrives - 1) * driveSizeTB * 8e12 // Reading all surviving drives to reconstruct parity

    const ureRate = currentDriveMeta.ureRate
    const exponent = bitsReadDuringRebuild / ureRate
    // Poisson / Binomial approximation: 1 - exp(-exponent)
    const ureRiskProb = Math.min(1.0, 1.0 - Math.exp(-exponent))
    const ureRiskPercent = ureRiskProb * 100

    // Multipliers
    const readIOPSMult = currentMeta.readMultiplier(activeDrives)
    const writeIOPSMult = currentMeta.writeMultiplier(activeDrives)
    const estReadSpeedMBs = readIOPSMult * currentDriveMeta.speedMBs
    const estWriteSpeedMBs = writeIOPSMult * currentDriveMeta.speedMBs

    // Cost calculations
    const totalHardwareCost = driveCount * costPerDrive
    const costPerUsableTB = usableTB > 0 ? totalHardwareCost / usableTB : 0

    // Array Health evaluation with simulated failures
    const failedCount = failedBays.length
    let arrayStatus: "optimal" | "degraded" | "failed" = "optimal"
    let statusMessage = "Array is healthy and fully redundant."
    let statusColor: "success" | "warning" | "error" = "success"

    if (failedCount === 0) {
      arrayStatus = "optimal"
      statusMessage = "All drives operational. Array is in Optimal state."
      statusColor = "success"
    } else if (failedCount <= faultToleranceDrives) {
      arrayStatus = "degraded"
      statusMessage = `Array is in DEGRADED mode (${failedCount} drive${
        failedCount > 1 ? "s" : ""
      } failed). Data is still preserved, but immediate replacement is required!`
      statusColor = "warning"
    } else {
      arrayStatus = "failed"
      statusMessage = `CRITICAL FAILURE! ${failedCount} drives failed, exceeding maximum fault tolerance (${faultToleranceDrives}). DATA LOSS HAS OCCURRED.`
      statusColor = "error"
    }

    return {
      rawTotalTB,
      rawTotalTiB,
      usableTB,
      usableTiB,
      parityTB,
      mirrorTB,
      spareTB,
      wastedTB,
      efficiencyPercent,
      faultToleranceDrives,
      rebuildTimeHours,
      ureRiskPercent,
      estReadSpeedMBs,
      estWriteSpeedMBs,
      totalHardwareCost,
      costPerUsableTB,
      failedCount,
      arrayStatus,
      statusMessage,
      statusColor,
    }
  }, [
    driveCount,
    driveSizeTB,
    hotSpares,
    raidMode,
    costPerDrive,
    currentMeta,
    currentDriveMeta,
    failedBays,
  ])

  // Determine block allocation style for visualization per bay
  const getBayRole = (bayIndex: number) => {
    const isSpare = bayIndex >= driveCount - hotSpares
    if (isSpare) return { role: "Hot Spare", color: "#38bdf8", bg: "#e0f2fe", border: "#7dd3fc" }

    if (raidMode === "raid0" || raidMode === "jbod") {
      return { role: "Data Strip", color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" }
    }
    if (raidMode === "raid1") {
      return bayIndex === 0
        ? { role: "Primary Data", color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" }
        : { role: "Mirror Copy", color: "#9333ea", bg: "#faf5ff", border: "#d8b4fe" }
    }
    if (raidMode === "raid5") {
      return { role: `Data + Parity (P${bayIndex % 3})`, color: "#d97706", bg: "#fffbeb", border: "#fcd34d" }
    }
    if (raidMode === "raid6") {
      return { role: `Data + Dual Parity (P+Q)`, color: "#ea580c", bg: "#fff7ed", border: "#fdba74" }
    }
    if (raidMode === "raid10") {
      const pair = Math.floor(bayIndex / 2) + 1
      const isMirror = bayIndex % 2 === 1
      return {
        role: isMirror ? `Mirror Sub-Set ${pair}` : `Stripe Data ${pair}`,
        color: isMirror ? "#9333ea" : "#2563eb",
        bg: isMirror ? "#faf5ff" : "#eff6ff",
        border: isMirror ? "#d8b4fe" : "#93c5fd",
      }
    }
    return { role: "Active Member", color: "#475569", bg: "#f8fafc", border: "#cbd5e1" }
  }

  // Copy Summary to clipboard
  const handleCopySummary = () => {
    const text = `--- TryCalc RAID Array Configuration Summary ---
RAID Level: ${currentMeta.name} (${currentMeta.fullName})
Disks: ${driveCount} × ${driveSizeTB} TB (${currentDriveMeta.label})
Hot Spares: ${hotSpares} drive(s)
Raw Total Capacity: ${calcResults.rawTotalTB.toFixed(1)} TB (${calcResults.rawTotalTiB.toFixed(1)} TiB)
Usable Storage: ${calcResults.usableTB.toFixed(1)} TB (${calcResults.usableTiB.toFixed(1)} TiB)
Storage Efficiency: ${calcResults.efficiencyPercent.toFixed(1)}%
Fault Tolerance: Up to ${calcResults.faultToleranceDrives} drive failure(s)
Est. Rebuild Time: ~${calcResults.rebuildTimeHours.toFixed(1)} hours
Est. URE Rebuild Risk: ${calcResults.ureRiskPercent.toFixed(2)}%
Estimated Hardware Cost: $${calcResults.totalHardwareCost.toLocaleString()} ($${calcResults.costPerUsableTB.toFixed(2)}/usable TB)
Generated at: https://trycalc.net/calculators/raid-calculator`

    navigator.clipboard.writeText(text)
    if (onToast) onToast("RAID calculation copied to clipboard!")
  }

  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      {/* ─── QUICK PRESETS BAR ─── */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3.5,
          border: "1px solid #e2e8f0",
          borderRadius: 3,
          bgcolor: "#f8fafc",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <BoltIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
            1-Click Architecture Presets:
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
          {PRESETS.map((p) => (
            <Button
              key={p.name}
              size="small"
              variant="outlined"
              onClick={() => handleApplyPreset(p)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.82rem",
                borderColor: "#cbd5e1",
                bgcolor: "#ffffff",
                color: "#334155",
                "&:hover": { bgcolor: "#f1f5f9", borderColor: "#94a3b8" },
              }}
            >
              {p.name}
              <Chip
                label={p.badge}
                size="small"
                sx={{
                  ml: 1,
                  height: 18,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  bgcolor: "#e2e8f0",
                  color: "#475569",
                }}
              />
            </Button>
          ))}
        </Box>
      </Paper>

      {/* ─── MAIN TWO-COLUMN WORKBENCH ─── */}
      <Grid container spacing={3.5}>
        {/* LEFT COLUMN: ARRAY BUILDER & DRIVE PARAMETERS */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              border: "1px solid #e2e8f0",
              borderRadius: 3.5,
              bgcolor: "#ffffff",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              <DnsIcon sx={{ color: "#2563eb", fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem" }}>
                  Array Configuration
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Customize drives, parity levels, and hot spares
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            {/* RAID Mode Selection */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", display: "block", mb: 1 }}>
                RAID LEVEL:
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={raidMode}
                onChange={(e) => {
                  const newMode = e.target.value
                  setRaidMode(newMode)
                  const minRequired = RAID_TYPES[newMode]?.minDrives || 2
                  if (driveCount < minRequired) {
                    setDriveCount(minRequired)
                  }
                  setFailedBays([])
                }}
              >
                {Object.entries(RAID_TYPES).map(([k, meta]) => (
                  <MenuItem key={k} value={k}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {meta.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        {meta.fullName} (min {meta.minDrives} drives)
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              <Typography variant="caption" sx={{ color: "#64748b", mt: 0.8, display: "block", fontStyle: "italic" }}>
                {currentMeta.description}
              </Typography>
            </Box>

            {/* Drive Quantity Slider & Stepper */}
            <Box sx={{ mb: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569" }}>
                  NUMBER OF DRIVES:
                </Typography>
                <Chip
                  label={`${driveCount} Drives (${driveCount - hotSpares} Active + ${hotSpares} Spare)`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
              <Slider
                value={driveCount}
                min={currentMeta.minDrives}
                max={24}
                step={1}
                onChange={(_, val) => {
                  const num = Number(val)
                  setDriveCount(num)
                  if (hotSpares >= num) setHotSpares(0)
                  setFailedBays((prev) => prev.filter((b) => b < num))
                }}
                sx={{
                  color: "#2563eb",
                  "& .MuiSlider-thumb": { width: 18, height: 18 },
                }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                {[currentMeta.minDrives, 4, 6, 8, 12, 16, 24]
                  .filter((v, idx, arr) => v <= 24 && arr.indexOf(v) === idx)
                  .map((num) => (
                    <Button
                      key={num}
                      size="small"
                      variant={driveCount === num ? "contained" : "outlined"}
                      onClick={() => {
                        setDriveCount(num)
                        if (hotSpares >= num) setHotSpares(0)
                        setFailedBays((prev) => prev.filter((b) => b < num))
                      }}
                      sx={{ minWidth: 32, py: 0.2, px: 1, fontSize: "0.75rem", borderRadius: 1.5 }}
                    >
                      {num}
                    </Button>
                  ))}
              </Box>
            </Box>

            {/* Drive Capacity */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", display: "block", mb: 0.5 }}>
                SINGLE DRIVE CAPACITY (TB):
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 1.2 }}>
                {DRIVE_SIZES.map((sz) => (
                  <Chip
                    key={sz}
                    label={`${sz} TB`}
                    clickable
                    color={driveSizeTB === sz ? "primary" : "default"}
                    onClick={() => setDriveSizeTB(sz)}
                    sx={{ fontWeight: driveSizeTB === sz ? 700 : 500 }}
                  />
                ))}
              </Box>
              <TextField
                type="number"
                size="small"
                fullWidth
                label="Custom Drive Size (TB)"
                value={driveSizeTB}
                onChange={(e) => setDriveSizeTB(Math.max(0.1, Number(e.target.value)))}
                slotProps={{ htmlInput: { min: 0.1, max: 200, step: 0.5 } }}
              />
            </Box>

            {/* Drive Medium & Class */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", display: "block", mb: 0.8 }}>
                DRIVE TYPE / URE ERROR RATE:
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={driveType}
                onChange={(e) => {
                  const val = e.target.value
                  setDriveType(val)
                  setCostPerDrive(DRIVE_TYPES[val]?.defaultCost || 180)
                }}
              >
                {Object.entries(DRIVE_TYPES).map(([k, meta]) => (
                  <MenuItem key={k} value={k}>
                    {meta.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Hot Spares & Drive Unit Cost */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", display: "block", mb: 0.5 }}>
                  HOT SPARES:
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={hotSpares}
                  onChange={(e) => setHotSpares(Number(e.target.value))}
                >
                  {[0, 1, 2, 3, 4]
                    .filter((sp) => sp < driveCount)
                    .map((sp) => (
                      <MenuItem key={sp} value={sp}>
                        {sp === 0 ? "None (0)" : `${sp} Hot Spare${sp > 1 ? "s" : ""}`}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", display: "block", mb: 0.5 }}>
                  COST / DRIVE ($):
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  value={costPerDrive}
                  onChange={(e) => setCostPerDrive(Math.max(0, Number(e.target.value)))}
                  slotProps={{ htmlInput: { min: 0, step: 10 } }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: INTERACTIVE VISUALIZER, CAPACITY STATS & SIMULATOR */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* ARRAY HEALTH BANNER */}
          <Alert
            severity={calcResults.statusColor}
            icon={
              calcResults.arrayStatus === "optimal" ? (
                <CheckCircleIcon fontSize="inherit" />
              ) : calcResults.arrayStatus === "degraded" ? (
                <WarningAmberIcon fontSize="inherit" />
              ) : (
                <ErrorIcon fontSize="inherit" />
              )
            }
            action={
              calcResults.failedCount > 0 ? (
                <Button color="inherit" size="small" onClick={handleResetFailures} sx={{ fontWeight: 700 }}>
                  Restore All Disks
                </Button>
              ) : undefined
            }
            sx={{
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor:
                calcResults.arrayStatus === "optimal"
                  ? "#bbf7d0"
                  : calcResults.arrayStatus === "degraded"
                  ? "#fde68a"
                  : "#fecaca",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {calcResults.arrayStatus === "optimal"
                ? "ARRAY STATUS: OPTIMAL"
                : calcResults.arrayStatus === "degraded"
                ? "ARRAY STATUS: DEGRADED (FAULT TOLERANCE ENGAGED)"
                : "ARRAY STATUS: FAILED (DATA LOSS)"}
            </Typography>
            <Typography variant="caption">{calcResults.statusMessage}</Typography>
          </Alert>

          {/* INTERACTIVE SERVER RACK & BAY VISUALIZER */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              mb: 3,
              border: "1px solid #e2e8f0",
              borderRadius: 3.5,
              bgcolor: "#0f172a", // Dark server chassis theme
              color: "#ffffff",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f8fafc", display: "flex", alignItems: "center", gap: 1 }}>
                  <StorageIcon sx={{ color: "#38bdf8", fontSize: 20 }} />
                  Virtual Chassis Drive Bay Matrix ({driveCount} Bays)
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Click any disk bay below to simulate live drive failure & array response
                </Typography>
              </Box>
              <Chip
                label={`${calcResults.failedCount} / ${calcResults.faultToleranceDrives} Faults Tolerated`}
                size="small"
                sx={{
                  bgcolor: calcResults.failedCount > 0 ? "#ef4444" : "#1e293b",
                  color: "#ffffff",
                  fontWeight: 700,
                  border: "1px solid #475569",
                }}
              />
            </Box>

            {/* Graphical Bay Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  lg: "repeat(6, 1fr)",
                },
                gap: 1.5,
                p: 1.5,
                bgcolor: "#1e293b",
                borderRadius: 2.5,
                border: "1px solid #334155",
              }}
            >
              {Array.from({ length: driveCount }).map((_, bayIdx) => {
                const isFailed = failedBays.includes(bayIdx)
                const isSpare = bayIdx >= driveCount - hotSpares
                const bayInfo = getBayRole(bayIdx)

                return (
                  <Box
                    key={bayIdx}
                    onClick={() => toggleBayFailure(bayIdx)}
                    sx={{
                      p: 1.2,
                      borderRadius: 2,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      border: "1.5px solid",
                      borderColor: isFailed ? "#ef4444" : isSpare ? "#38bdf8" : "#475569",
                      bgcolor: isFailed ? "rgba(239, 68, 68, 0.2)" : "#0f172a",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                        borderColor: isFailed ? "#f87171" : "#60a5fa",
                      },
                    }}
                  >
                    {/* Activity LED */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: "#94a3b8", fontSize: "0.7rem" }}>
                        BAY {bayIdx + 1}
                      </Typography>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: isFailed ? "#ef4444" : isSpare ? "#38bdf8" : "#22c55e",
                          boxShadow: isFailed
                            ? "0 0 6px #ef4444"
                            : isSpare
                            ? "0 0 6px #38bdf8"
                            : "0 0 6px #22c55e",
                        }}
                      />
                    </Box>

                    {/* Drive Capacity & State */}
                    <Typography variant="body2" sx={{ fontWeight: 800, color: isFailed ? "#fca5a5" : "#f8fafc" }}>
                      {isFailed ? "⚠️ FAILED" : `${driveSizeTB} TB`}
                    </Typography>

                    {/* Role badge */}
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.65rem",
                        color: isFailed ? "#ef4444" : bayInfo.color,
                        fontWeight: 600,
                        display: "block",
                        mt: 0.3,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isFailed ? "Offline / Click to Fix" : bayInfo.role}
                    </Typography>
                  </Box>
                )
              })}
            </Box>

            {/* Drive Legend */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#22c55e" }} />
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Active Data
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#38bdf8" }} />
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Hot Spare
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#ef4444" }} />
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Simulated Failure (Click to toggle)
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* CAPACITY BREAKDOWN BAR */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              mb: 3,
              border: "1px solid #e2e8f0",
              borderRadius: 3.5,
              bgcolor: "#ffffff",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#1e293b" }}>
                Storage Allocation Breakdown:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#2563eb" }}>
                {calcResults.efficiencyPercent.toFixed(1)}% Usable Efficiency
              </Typography>
            </Box>

            {/* Stacked Capacity Bar */}
            <Box
              sx={{
                height: 24,
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                bgcolor: "#e2e8f0",
                mb: 1.5,
              }}
            >
              {calcResults.usableTB > 0 && (
                <Tooltip title={`Usable Data: ${calcResults.usableTB.toFixed(1)} TB`}>
                  <Box
                    sx={{
                      width: `${(calcResults.usableTB / calcResults.rawTotalTB) * 100}%`,
                      bgcolor: "#10b981",
                      transition: "width 0.3s ease",
                    }}
                  />
                </Tooltip>
              )}
              {calcResults.parityTB > 0 && (
                <Tooltip title={`Parity Protection: ${calcResults.parityTB.toFixed(1)} TB`}>
                  <Box
                    sx={{
                      width: `${(calcResults.parityTB / calcResults.rawTotalTB) * 100}%`,
                      bgcolor: "#f59e0b",
                      transition: "width 0.3s ease",
                    }}
                  />
                </Tooltip>
              )}
              {calcResults.mirrorTB > 0 && (
                <Tooltip title={`Mirror Redundancy: ${calcResults.mirrorTB.toFixed(1)} TB`}>
                  <Box
                    sx={{
                      width: `${(calcResults.mirrorTB / calcResults.rawTotalTB) * 100}%`,
                      bgcolor: "#8b5cf6",
                      transition: "width 0.3s ease",
                    }}
                  />
                </Tooltip>
              )}
              {calcResults.spareTB > 0 && (
                <Tooltip title={`Hot Spare: ${calcResults.spareTB.toFixed(1)} TB`}>
                  <Box
                    sx={{
                      width: `${(calcResults.spareTB / calcResults.rawTotalTB) * 100}%`,
                      bgcolor: "#06b6d4",
                      transition: "width 0.3s ease",
                    }}
                  />
                </Tooltip>
              )}
              {calcResults.wastedTB > 0 && (
                <Tooltip title={`Unusable/Wasted: ${calcResults.wastedTB.toFixed(1)} TB`}>
                  <Box
                    sx={{
                      width: `${(calcResults.wastedTB / calcResults.rawTotalTB) * 100}%`,
                      bgcolor: "#94a3b8",
                      transition: "width 0.3s ease",
                    }}
                  />
                </Tooltip>
              )}
            </Box>

            {/* Legend & Exact Numbers */}
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ borderLeft: "3px solid #10b981", pl: 1 }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Usable Space
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {calcResults.usableTB.toFixed(1)} TB
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    ({calcResults.usableTiB.toFixed(1)} TiB)
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Box
                  sx={{
                    borderLeft: `3px solid ${
                      calcResults.parityTB > 0 ? "#f59e0b" : calcResults.mirrorTB > 0 ? "#8b5cf6" : "#cbd5e1"
                    }`,
                    pl: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Protection
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {(calcResults.parityTB + calcResults.mirrorTB).toFixed(1)} TB
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    {calcResults.parityTB > 0 ? "Parity" : calcResults.mirrorTB > 0 ? "Mirror" : "None"}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ borderLeft: "3px solid #06b6d4", pl: 1 }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Hot Spare
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {calcResults.spareTB.toFixed(1)} TB
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    {hotSpares} Disk(s)
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ borderLeft: "3px solid #64748b", pl: 1 }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Raw Total
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {calcResults.rawTotalTB.toFixed(1)} TB
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    ({calcResults.rawTotalTiB.toFixed(1)} TiB)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* PERFORMANCE, REBUILD DURATION & URE RISK CARD */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Speed Multipliers */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  height: "100%",
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  bgcolor: "#f8fafc",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <SpeedIcon sx={{ color: "#0284c7" }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    Speed & IOPS Multipliers
                  </Typography>
                </Box>
                <Box sx={{ mb: 1.2 }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Estimated Read Throughput:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    ~{Math.round(calcResults.estReadSpeedMBs)} MB/s ({currentMeta.readMultiplier(driveCount - hotSpares)}× Single Drive)
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Estimated Write Throughput (Penalty: {currentMeta.writePenalty}):
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    ~{Math.round(calcResults.estWriteSpeedMBs)} MB/s ({currentMeta.writeMultiplier(driveCount - hotSpares).toFixed(2)}× Single Drive)
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Rebuild Duration & URE Rebuild Risk */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  height: "100%",
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  bgcolor: "#f8fafc",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <SecurityIcon sx={{ color: "#8b5cf6" }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    Rebuild Time & URE Risk
                  </Typography>
                </Box>
                <Box sx={{ mb: 1.2 }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Est. Array Rebuild Time:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    ~{calcResults.rebuildTimeHours.toFixed(1)} Hours
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Unrecoverable Read Error (URE) Risk:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 800,
                      color:
                        calcResults.ureRiskPercent > 30
                          ? "#ef4444"
                          : calcResults.ureRiskPercent > 10
                          ? "#f59e0b"
                          : "#10b981",
                    }}
                  >
                    {calcResults.ureRiskPercent.toFixed(2)}% Probability
                  </Typography>
                  {raidMode === "raid5" && driveSizeTB >= 8 && (
                    <Typography variant="caption" sx={{ color: "#dc2626", fontWeight: 700, mt: 0.5, display: "block" }}>
                      ⚠️ High Risk: Large drives in RAID 5 carry significant risk of 2nd drive failure during rebuild. Consider RAID 6 or RAID 10!
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* HARDWARE COST ESTIMATE & ACTION BUTTONS */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              border: "1px solid #e2e8f0",
              borderRadius: 3.5,
              bgcolor: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                Total Hardware Investment:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                ${calcResults.totalHardwareCost.toLocaleString()}
                <Typography component="span" variant="caption" sx={{ color: "#64748b", ml: 1 }}>
                  (${calcResults.costPerUsableTB.toFixed(2)} / Usable TB)
                </Typography>
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopySummary}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Copy Summary
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Print Report
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ─── SIDE-BY-SIDE RAID COMPARISON TABLE ─── */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
          Side-by-Side Comparison for {driveCount} × {driveSizeTB} TB Drives
        </Typography>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflowX: "auto" }}
        >
          <Table size="small">
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: "#1e293b" }}>RAID Type</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#1e293b" }}>Usable (TB)</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#1e293b" }}>Efficiency</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#1e293b" }}>Fault Tolerance</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#1e293b" }}>Read Speed</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#1e293b" }}>Write Speed</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#1e293b" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(RAID_TYPES).map(([k, meta]) => {
                const isSelected = raidMode === k
                const cap = meta.computeUsableTB(driveCount, driveSizeTB, 0)
                const eff = (cap.usableTB / (driveCount * driveSizeTB)) * 100
                const isEligible = driveCount >= meta.minDrives

                return (
                  <TableRow
                    key={k}
                    sx={{
                      bgcolor: isSelected ? "#eff6ff" : "inherit",
                      "&:hover": { bgcolor: isSelected ? "#e0e7ff" : "#f8fafc" },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {meta.name}
                        {isSelected && <Chip label="Active" size="small" color="primary" sx={{ height: 20 }} />}
                      </Box>
                      <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                        {meta.fullName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: isEligible ? "#0f172a" : "#94a3b8" }}>
                      {isEligible ? `${cap.usableTB.toFixed(1)} TB` : `Requires ${meta.minDrives}+ drives`}
                    </TableCell>
                    <TableCell sx={{ color: isEligible ? "#0f172a" : "#94a3b8" }}>
                      {isEligible ? `${eff.toFixed(0)}%` : "—"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {isEligible ? `${meta.maxFaultTolerance(driveCount)} Drive(s)` : "—"}
                    </TableCell>
                    <TableCell>{isEligible ? `${meta.readMultiplier(driveCount)}×` : "—"}</TableCell>
                    <TableCell>{isEligible ? `${meta.writeMultiplier(driveCount).toFixed(2)}×` : "—"}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant={isSelected ? "contained" : "outlined"}
                        disabled={!isEligible}
                        onClick={() => {
                          setRaidMode(k)
                          setFailedBays([])
                          window.scrollTo({ top: 120, behavior: "smooth" })
                        }}
                        sx={{ fontSize: "0.75rem", textTransform: "none", py: 0.3 }}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
