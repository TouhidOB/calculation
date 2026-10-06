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
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import IconButton from "@mui/material/IconButton"
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
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import TuneIcon from "@mui/icons-material/Tune"
import InfoIcon from "@mui/icons-material/Info"

// Types
export interface RaidCalculatorViewProps {
  onToast?: (msg: string) => void
}

interface RaidConfigMeta {
  name: string
  fullName: string
  minDrives: number
  badge: string
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
    badge: "Maximum Speed",
    description: "Maximum speed and 100% capacity. Data is split evenly across all drives without parity.",
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
    pros: ["100% storage efficiency", "Maximum read/write performance", "No CPU parity overhead"],
    cons: ["Zero fault tolerance (1 drive failure = 100% data loss)", "Never use for unbacked data"],
  },
  raid1: {
    name: "RAID 1",
    fullName: "Mirroring (1:1 Duplication)",
    minDrives: 2,
    badge: "Simple Mirror",
    description: "Exact replica of data across mirrored drives. Simple and fast recovery.",
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
    pros: ["Simple and fast recovery", "Can lose all but one mirrored drive", "Fast multi-threaded reads"],
    cons: ["High storage cost (50% capacity with 2 drives)", "Slow writes relative to RAID 0"],
  },
  raid5: {
    name: "RAID 5",
    fullName: "Distributed Single Parity",
    minDrives: 3,
    badge: "Most Popular for NAS",
    description: "Data and single parity distributed across 3+ drives. Best balance of capacity, speed, and cost.",
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
    pros: ["High capacity efficiency ((N-1)/N)", "Cost effective for 3-5 drives", "Fast sequential reads"],
    cons: ["Only 1 drive failure allowed", "High URE rebuild risk on large drives (>8TB)", "Write penalty (4 I/O per write)"],
  },
  raid6: {
    name: "RAID 6",
    fullName: "Distributed Dual Parity (P+Q)",
    minDrives: 4,
    badge: "Recommended for >8TB Drives",
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
    pros: ["Tolerates 2 concurrent drive failures", "Safe against URE during rebuild on large HDDs", "Enterprise standard"],
    cons: ["Requires minimum 4 drives", "Higher write penalty (6 I/O per random write)"],
  },
  raid10: {
    name: "RAID 10",
    fullName: "1+0 Striped Mirrors",
    minDrives: 4,
    badge: "Best for Databases & VMs",
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
    pros: ["Top-tier random read & write IOPS", "Blazing fast rebuild times (simple mirror copy)", "No parity CPU overhead"],
    cons: ["50% storage capacity efficiency", "Requires an even number of drives (min 4)"],
  },
  raid50: {
    name: "RAID 50",
    fullName: "Striped RAID 5 Sub-Arrays",
    minDrives: 6,
    badge: "High Capacity + Speed",
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
    pros: ["Higher write throughput than RAID 5", "Faster rebuild than single RAID 5", "Great for 8-16 drive arrays"],
    cons: ["Requires minimum 6 drives", "Array fails if 2 drives fail in same sub-group"],
  },
  raid60: {
    name: "RAID 60",
    fullName: "Striped RAID 6 Sub-Arrays",
    minDrives: 8,
    badge: "Ultra Resilient Enterprise",
    description: "RAID 0 stripe across two or more RAID 6 dual-parity sets. High redundancy for large petabyte arrays.",
    maxFaultTolerance: () => 4,
    computeUsableTB: (n, s, spares) => {
      const active = Math.max(0, n - spares)
      if (active < 8) return { usableTB: 0, parityTB: 0, mirrorTB: 0, spareTB: spares * s, wastedTB: active * s }
      const groups = 2
      return {
        usableTB: (active - groups * 2) * s,
        parityTB: groups * 2 * s,
        mirrorTB: 0,
        spareTB: spares * s,
        wastedTB: 0,
      }
    },
    readMultiplier: (n) => n - 4,
    writeMultiplier: (n) => (n - 4) / 4,
    writePenalty: 6,
    pros: ["Can withstand 2 drive failures in EACH sub-array", "Top tier safety for 12+ drive chassis"],
    cons: ["Requires minimum 8 drives", "4 drives dedicated to parity"],
  },
  zfs_z1: {
    name: "ZFS RAID-Z1",
    fullName: "OpenZFS Single Parity vdev",
    minDrives: 3,
    badge: "TrueNAS / OpenZFS",
    description: "OpenZFS software RAID with dynamic stripe width and end-to-end data checksumming against silent corruption.",
    maxFaultTolerance: () => 1,
    computeUsableTB: (n, s, spares) => {
      const active = Math.max(0, n - spares)
      if (active < 3) return { usableTB: 0, parityTB: 0, mirrorTB: 0, spareTB: spares * s, wastedTB: active * s }
      const rawUsable = (active - 1) * s
      return {
        usableTB: rawUsable * 0.967,
        parityTB: 1 * s,
        mirrorTB: 0,
        spareTB: spares * s,
        wastedTB: rawUsable * 0.033,
      }
    },
    readMultiplier: (n) => Math.max(1, n - 1),
    writeMultiplier: (n) => Math.max(0.25, (n - 1) / 4),
    writePenalty: 4,
    pros: ["Automatic self-healing data checksums", "No write-hole vulnerability", "Copy-on-write snapshots"],
    cons: ["Only 1 drive failure tolerated", "Vdev expansion requires careful planning"],
  },
  zfs_z2: {
    name: "ZFS RAID-Z2",
    fullName: "OpenZFS Dual Parity vdev",
    minDrives: 4,
    badge: "Recommended for TrueNAS",
    description: "OpenZFS dual distributed parity. Highly recommended for modern high-capacity TrueNAS and ZFS pools.",
    maxFaultTolerance: () => 2,
    computeUsableTB: (n, s, spares) => {
      const active = Math.max(0, n - spares)
      if (active < 4) return { usableTB: 0, parityTB: 0, mirrorTB: 0, spareTB: spares * s, wastedTB: active * s }
      const rawUsable = (active - 2) * s
      return {
        usableTB: rawUsable * 0.967,
        parityTB: 2 * s,
        mirrorTB: 0,
        spareTB: spares * s,
        wastedTB: rawUsable * 0.033,
      }
    },
    readMultiplier: (n) => Math.max(1, n - 2),
    writeMultiplier: (n) => Math.max(0.2, (n - 2) / 6),
    writePenalty: 6,
    pros: ["Protects against 2 drive failures", "End-to-end ZFS checksum data integrity", "Safe for 16TB+ drives"],
    cons: ["Requires minimum 4 drives", "Slightly higher CPU utilization for dual parity"],
  },
  jbod: {
    name: "JBOD",
    fullName: "Just a Bunch of Disks (Span)",
    minDrives: 1,
    badge: "Linear Spanning",
    description: "Combines drives into one large volume sequentially. No performance gain or redundancy.",
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
    pros: ["Can mix different drive capacities seamlessly", "100% capacity utilization", "Simple concatenation"],
    cons: ["No redundancy", "Loss of one drive corrupts the spanned filesystem"],
  },
}

const POPULAR_RAID_KEYS = ["raid5", "raid6", "raid10", "raid1", "raid0", "zfs_z2"]

const DRIVE_TYPES = [
  { id: "consumer_hdd", label: "Consumer HDD (5400 RPM / URE 10¹⁴)", ure: 1e-14, speedMB: 150, cost: 120 },
  { id: "nas_hdd", label: "NAS / Enterprise HDD (7200 RPM / URE 10¹⁵)", ure: 1e-15, speedMB: 220, cost: 180 },
  { id: "datacenter_hdd", label: "Datacenter Enterprise (SAS 12Gb / URE 10¹⁶)", ure: 1e-16, speedMB: 270, cost: 260 },
  { id: "sata_ssd", label: "SATA SSD (550 MB/s / URE 10¹⁷)", ure: 1e-17, speedMB: 520, cost: 190 },
  { id: "nvme_ssd", label: "NVMe Gen4 SSD (5000 MB/s / URE 10¹⁸)", ure: 1e-18, speedMB: 4500, cost: 280 },
]

const POPULAR_DRIVE_SIZES = [2, 4, 8, 12, 16, 20, 22, 24]
const POPULAR_DRIVE_COUNTS = [2, 4, 6, 8, 12, 16, 24]

const PRESETS = [
  {
    name: "Home NAS / Media Hub",
    badge: "Plex / Synology",
    raid: "raid5",
    drives: 4,
    size: 8,
    type: "nas_hdd",
    spares: 0,
    cost: 180,
  },
  {
    name: "Enterprise File Server",
    badge: "High Security",
    raid: "raid6",
    drives: 8,
    size: 16,
    type: "nas_hdd",
    spares: 1,
    cost: 320,
  },
  {
    name: "4K/8K Video Editing Suite",
    badge: "Extreme IOPS",
    raid: "raid10",
    drives: 6,
    size: 4,
    type: "sata_ssd",
    spares: 0,
    cost: 210,
  },
  {
    name: "Database / VM Host",
    badge: "Fast Rebuild",
    raid: "raid10",
    drives: 8,
    size: 8,
    type: "nvme_ssd",
    spares: 0,
    cost: 280,
  },
  {
    name: "Cold Cloud Archive",
    badge: "Max Capacity",
    raid: "zfs_z2",
    drives: 12,
    size: 20,
    type: "datacenter_hdd",
    spares: 1,
    cost: 380,
  },
]

export function RaidCalculatorView({ onToast }: RaidCalculatorViewProps) {
  // State
  const [activeTab, setActiveTab] = useState<number>(0) // 0: Builder, 1: Recommendation Wizard
  const [raidMode, setRaidMode] = useState<string>("raid5")
  const [driveCount, setDriveCount] = useState<number>(6)
  const [driveSizeTB, setDriveSizeTB] = useState<number>(8)
  const [driveType, setDriveType] = useState<string>("nas_hdd")
  const [hotSpares, setHotSpares] = useState<number>(0)
  const [costPerDrive, setCostPerDrive] = useState<number>(180)
  const [failedBays, setFailedBays] = useState<number[]>([])

  // Wizard state
  const [wizardUseCase, setWizardUseCase] = useState<string>("nas")
  const [wizardPriority, setWizardPriority] = useState<string>("balanced")

  const currentMeta = RAID_TYPES[raidMode] || RAID_TYPES.raid5
  const currentDriveMeta = DRIVE_TYPES.find((d) => d.id === driveType) || DRIVE_TYPES[1]

  // Calculated Results
  const calcResults = useMemo(() => {
    const rawTotalTB = driveCount * driveSizeTB
    const rawTotalTiB = (rawTotalTB * 1e12) / Math.pow(1024, 4)

    const allocation = currentMeta.computeUsableTB(driveCount, driveSizeTB, hotSpares)
    const usableTB = Math.max(0, allocation.usableTB)
    const parityTB = Math.max(0, allocation.parityTB)
    const mirrorTB = Math.max(0, allocation.mirrorTB)
    const spareTB = Math.max(0, allocation.spareTB)
    const wastedTB = Math.max(0, allocation.wastedTB)

    const usableTiB = (usableTB * 1e12) / Math.pow(1024, 4)
    const osFormattedTiB = usableTiB * 0.975 // 2.5% filesystem metadata / ext4 reserve
    const efficiencyPercent = rawTotalTB > 0 ? (usableTB / rawTotalTB) * 100 : 0

    const faultToleranceDrives = currentMeta.maxFaultTolerance(driveCount - hotSpares)

    // Speeds
    const activeDrives = Math.max(1, driveCount - hotSpares)
    const readSpeedMB = currentMeta.readMultiplier(activeDrives) * currentDriveMeta.speedMB
    const writeSpeedMB = currentMeta.writeMultiplier(activeDrives) * currentDriveMeta.speedMB

    // Rebuild Time & URE Probability
    const singleDriveSpeedMB = currentDriveMeta.speedMB
    const totalRebuildSeconds = (driveSizeTB * 1e6) / (singleDriveSpeedMB * 0.65) // 65% controller throughput under load
    const rebuildTimeHours = totalRebuildSeconds / 3600

    const bitsToReadDuringRebuild = (activeDrives - 1) * driveSizeTB * 8 * 1e12
    const ureRate = currentDriveMeta.ure
    const ureRiskPercent =
      faultToleranceDrives === 1
        ? Math.min(99.9, (1 - Math.pow(1 - ureRate, bitsToReadDuringRebuild)) * 100)
        : faultToleranceDrives >= 2
        ? Math.min(99.9, Math.pow((1 - Math.pow(1 - ureRate, bitsToReadDuringRebuild)), 2) * 100)
        : 0

    // Costs
    const totalHardwareCost = driveCount * costPerDrive
    const costPerUsableTB = usableTB > 0 ? totalHardwareCost / usableTB : 0

    // Simulation status
    const actualFailedCount = failedBays.length
    let arrayStatus: "optimal" | "degraded" | "failed" = "optimal"
    let statusMessage = "All drives operational. Array is in Optimal state."

    if (actualFailedCount > 0) {
      if (actualFailedCount <= faultToleranceDrives) {
        arrayStatus = "degraded"
        statusMessage = `Array is DEGRADED (${actualFailedCount} failed drive). Redundancy is compromised. Hot rebuild required!`
      } else {
        arrayStatus = "failed"
        statusMessage = `ARRAY FAILED! (${actualFailedCount} drives failed, exceeding fault tolerance of ${faultToleranceDrives}). Data loss has occurred!`
      }
    }

    return {
      rawTotalTB,
      rawTotalTiB,
      usableTB,
      parityTB,
      mirrorTB,
      spareTB,
      wastedTB,
      usableTiB,
      osFormattedTiB,
      efficiencyPercent,
      faultToleranceDrives,
      readSpeedMB,
      writeSpeedMB,
      rebuildTimeHours,
      ureRiskPercent,
      totalHardwareCost,
      costPerUsableTB,
      arrayStatus,
      statusMessage,
      actualFailedCount,
    }
  }, [raidMode, driveCount, driveSizeTB, driveType, hotSpares, costPerDrive, failedBays, currentMeta, currentDriveMeta])

  // Comparison Matrix for all RAID levels
  const comparisonMatrix = useMemo(() => {
    return Object.entries(RAID_TYPES).map(([k, meta]) => {
      const active = Math.max(0, driveCount - hotSpares)
      const valid = active >= meta.minDrives
      const alloc = valid ? meta.computeUsableTB(driveCount, driveSizeTB, hotSpares) : { usableTB: 0 }
      const usableTB = alloc.usableTB
      const rawTotal = driveCount * driveSizeTB
      const eff = rawTotal > 0 ? (usableTB / rawTotal) * 100 : 0
      const ft = meta.maxFaultTolerance(active)
      const rSpeed = meta.readMultiplier(active) * currentDriveMeta.speedMB
      const wSpeed = meta.writeMultiplier(active) * currentDriveMeta.speedMB

      return {
        key: k,
        name: meta.name,
        badge: meta.badge,
        valid,
        minDrives: meta.minDrives,
        usableTB,
        efficiencyPercent: eff,
        faultTolerance: ft,
        readSpeed: rSpeed,
        writeSpeed: wSpeed,
        isCurrent: k === raidMode,
      }
    })
  }, [driveCount, driveSizeTB, hotSpares, raidMode, currentDriveMeta])

  // Smart Wizard Recommendation
  const wizardRecommendation = useMemo(() => {
    if (wizardUseCase === "video" || wizardPriority === "speed") {
      return {
        raid: "raid10",
        name: "RAID 10 (Striped Mirrors)",
        reason: "Delivers maximum read/write IOPS and the fastest rebuild speeds. Ideal for 4K/8K real-time editing and databases without parity calculation latency.",
        suggestedDrives: Math.max(4, driveCount % 2 === 0 ? driveCount : driveCount + 1),
      }
    }
    if (driveSizeTB >= 12 || wizardPriority === "max_safety") {
      return {
        raid: "raid6",
        name: "RAID 6 (Dual Distributed Parity)",
        reason: "With drives 12TB or larger, RAID 6 is essential. It survives 2 simultaneous disk failures, guarding against URE read errors during multi-day rebuilds.",
        suggestedDrives: Math.max(4, driveCount),
      }
    }
    if (wizardUseCase === "truenas" || wizardUseCase === "zfs") {
      return {
        raid: "zfs_z2",
        name: "OpenZFS RAID-Z2",
        reason: "TrueNAS and ZFS standard. Provides end-to-end cryptographic checksumming against silent data corruption and protects against 2 drive failures.",
        suggestedDrives: Math.max(4, driveCount),
      }
    }
    if (wizardPriority === "cheap") {
      return {
        raid: "raid5",
        name: "RAID 5 (Single Parity)",
        reason: "Offers the highest capacity efficiency (N-1)/N while retaining 1-disk fault tolerance. Cost-effective for 3 to 5 disk home storage.",
        suggestedDrives: Math.max(3, driveCount),
      }
    }
    return {
      raid: "raid5",
      name: "RAID 5 (Single Parity)",
      reason: "The gold standard for general home NAS, Plex servers, and medium backup repositories with up to 5 drives.",
      suggestedDrives: Math.max(3, driveCount),
    }
  }, [wizardUseCase, wizardPriority, driveSizeTB, driveCount])

  // Handlers
  const handleApplyPreset = (p: (typeof PRESETS)[0]) => {
    setRaidMode(p.raid)
    setDriveCount(p.drives)
    setDriveSizeTB(p.size)
    setDriveType(p.type)
    setHotSpares(p.spares)
    setCostPerDrive(p.cost)
    setFailedBays([])
    if (onToast) onToast(`Applied preset: ${p.name}`)
  }

  const handleToggleBayFailure = (bayIndex: number) => {
    setFailedBays((prev) => {
      if (prev.includes(bayIndex)) {
        return prev.filter((b) => b !== bayIndex)
      } else {
        return [...prev, bayIndex]
      }
    })
  }

  const handleSimulateFailCount = (count: number) => {
    const baysToFail = Array.from({ length: Math.min(count, driveCount) }, (_, i) => i)
    setFailedBays(baysToFail)
    if (onToast) onToast(`Simulated ${baysToFail.length} failed drive(s)`)
  }

  const handleResetSimulation = () => {
    setFailedBays([])
    if (onToast) onToast("All drive bays restored to healthy status")
  }

  const handleCopySummary = () => {
    const text = `=== TryCalc RAID Array Specification ===
RAID Level: ${currentMeta.name} (${currentMeta.fullName})
Drives: ${driveCount} × ${driveSizeTB} TB (${currentDriveMeta.label})
Hot Spares: ${hotSpares} drive(s)
Raw Total: ${calcResults.rawTotalTB.toFixed(1)} TB (${calcResults.rawTotalTiB.toFixed(1)} TiB)
Usable Capacity: ${calcResults.usableTB.toFixed(1)} TB (${calcResults.usableTiB.toFixed(1)} TiB)
Storage Efficiency: ${calcResults.efficiencyPercent.toFixed(1)}%
Fault Tolerance: Up to ${calcResults.faultToleranceDrives} drive failure(s)
Est. Read Throughput: ~${calcResults.readSpeedMB.toFixed(0)} MB/s
Est. Write Throughput: ~${calcResults.writeSpeedMB.toFixed(0)} MB/s
Est. Rebuild Time: ~${calcResults.rebuildTimeHours.toFixed(1)} hours
URE Rebuild Risk: ${calcResults.ureRiskPercent.toFixed(2)}%
Total Hardware Investment: $${calcResults.totalHardwareCost.toLocaleString()} ($${calcResults.costPerUsableTB.toFixed(2)}/usable TB)
Calculated via: https://trycalc.net/calculators/raid-calculator`

    navigator.clipboard.writeText(text)
    if (onToast) onToast("RAID specification copied to clipboard!")
  }

  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      {/* ─── TOP MODE NAVIGATION & PRESETS ─── */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid #e2e8f0",
          borderRadius: 3,
          bgcolor: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ minHeight: 40 }}
          >
            <Tab
              icon={<TuneIcon sx={{ fontSize: 18, mr: 0.5 }} />}
              iconPosition="start"
              label="Interactive Array Builder"
              sx={{ fontWeight: 700, textTransform: "none", fontSize: "0.9rem", minHeight: 40, py: 0.5 }}
            />
            <Tab
              icon={<AutoAwesomeIcon sx={{ fontSize: 18, mr: 0.5, color: "#8b5cf6" }} />}
              iconPosition="start"
              label="Smart Recommendation Wizard"
              sx={{ fontWeight: 700, textTransform: "none", fontSize: "0.9rem", minHeight: 40, py: 0.5 }}
            />
          </Tabs>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RestartAltIcon fontSize="small" />}
              onClick={handleResetSimulation}
              sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.8rem", borderColor: "#cbd5e1" }}
            >
              Reset Simulation
            </Button>
          </Box>
        </Box>

        {/* 1-Click Architecture Presets */}
        <Box sx={{ pt: 1.5, borderTop: "1px solid #f1f5f9" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <BoltIcon sx={{ color: "#f59e0b", fontSize: 18 }} />
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 }}>
              1-Click Industry Presets:
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {PRESETS.map((p) => (
              <Button
                key={p.name}
                size="small"
                variant="outlined"
                onClick={() => handleApplyPreset(p)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  borderColor: "#e2e8f0",
                  bgcolor: "#f8fafc",
                  color: "#1e293b",
                  py: 0.5,
                  px: 1.2,
                  "&:hover": { bgcolor: "#f1f5f9", borderColor: "#cbd5e1" },
                }}
              >
                {p.name}
                <Chip
                  label={p.badge}
                  size="small"
                  sx={{
                    ml: 0.8,
                    height: 18,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    bgcolor: "#e2e8f0",
                    color: "#475569",
                  }}
                />
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* ─── SMART RECOMMENDATION WIZARD TAB ─── */}
      {activeTab === 1 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3.5,
            border: "2px solid #8b5cf6",
            borderRadius: 3.5,
            bgcolor: "#faf5ff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <AutoAwesomeIcon sx={{ color: "#8b5cf6", fontSize: 26 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#581c87" }}>
                RAID Architecture Recommendation Assistant
              </Typography>
              <Typography variant="body2" sx={{ color: "#7e22ce" }}>
                Answer 2 quick questions to find the perfect RAID level for your workload and safety requirements.
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#6b21a8", display: "block", mb: 0.8 }}>
                1. PRIMARY USE CASE:
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={wizardUseCase}
                onChange={(e) => setWizardUseCase(e.target.value)}
                sx={{ bgcolor: "#ffffff" }}
              >
                <MenuItem value="nas">Home NAS / Media Server (Plex, Photos, General Backups)</MenuItem>
                <MenuItem value="video">Real-time 4K/8K Video Editing / Production Scratch</MenuItem>
                <MenuItem value="business">Business File Server & Cloud Sync</MenuItem>
                <MenuItem value="db">High-IOPS Database / Virtualization (VMware/Proxmox)</MenuItem>
                <MenuItem value="truenas">TrueNAS / OpenZFS Dedicated Storage Pool</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#6b21a8", display: "block", mb: 0.8 }}>
                2. TOP PRIORITY:
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={wizardPriority}
                onChange={(e) => setWizardPriority(e.target.value)}
                sx={{ bgcolor: "#ffffff" }}
              >
                <MenuItem value="balanced">Balanced (High Capacity + 1-Disk Redundancy)</MenuItem>
                <MenuItem value="max_safety">Maximum Safety (Dual Parity / 2-Disk Redundancy)</MenuItem>
                <MenuItem value="speed">Maximum Speed & Lowest Latency (Fastest IOPS)</MenuItem>
                <MenuItem value="cheap">Lowest Cost per Usable TB</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Recommended Result Banner */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              bgcolor: "#ffffff",
              border: "1px solid #d8b4fe",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ maxWidth: 650 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <CheckCircleIcon sx={{ color: "#8b5cf6", fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#4c1d95" }}>
                  Recommended: {wizardRecommendation.name}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#475569" }}>
                {wizardRecommendation.reason}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<TuneIcon />}
              onClick={() => {
                setRaidMode(wizardRecommendation.raid)
                setDriveCount(wizardRecommendation.suggestedDrives)
                setActiveTab(0)
                if (onToast) onToast(`Applied recommended ${wizardRecommendation.name}`)
              }}
              sx={{
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#7c3aed",
                "&:hover": { bgcolor: "#6d28d9" },
              }}
            >
              Apply Recommended Setup
            </Button>
          </Paper>
        </Paper>
      )}

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
              boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
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

            {/* 1. Quick RAID Level Pills */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#475569", display: "block", mb: 1 }}>
                SELECT RAID ARCHITECTURE:
              </Typography>

              {/* Popular Quick Buttons */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 1.5 }}>
                {POPULAR_RAID_KEYS.map((k) => {
                  const meta = RAID_TYPES[k]
                  const isSelected = raidMode === k
                  return (
                    <Button
                      key={k}
                      size="small"
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => {
                        setRaidMode(k)
                        const minRequired = meta.minDrives
                        if (driveCount < minRequired) setDriveCount(minRequired)
                        setFailedBays([])
                      }}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        py: 0.5,
                        px: 1.2,
                        borderRadius: 2,
                        bgcolor: isSelected ? "#2563eb" : "#f8fafc",
                        borderColor: isSelected ? "#2563eb" : "#cbd5e1",
                        color: isSelected ? "#ffffff" : "#334155",
                        "&:hover": {
                          bgcolor: isSelected ? "#1d4ed8" : "#f1f5f9",
                        },
                      }}
                    >
                      {meta.name}
                    </Button>
                  )
                })}
              </Box>

              {/* Full Select Dropdown */}
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
                        {meta.name} — {meta.fullName}
                      </Typography>
                      <Chip
                        label={`min ${meta.minDrives}`}
                        size="small"
                        sx={{ height: 18, fontSize: "0.65rem", ml: 1 }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              <Alert severity="info" sx={{ mt: 1.2, py: 0.5, px: 1.5, "& .MuiAlert-message": { fontSize: "0.8rem" } }}>
                <strong>{currentMeta.name}:</strong> {currentMeta.description}
              </Alert>
            </Box>

            {/* 2. Number of Drives with Stepper Buttons */}
            <Box sx={{ mb: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#475569" }}>
                  NUMBER OF DISKS:
                </Typography>
                <Chip
                  label={`${driveCount} Disks (${driveCount - hotSpares} Active + ${hotSpares} Spare)`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                />
              </Box>

              {/* Stepper + Slider Row */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <IconButton
                  size="small"
                  disabled={driveCount <= currentMeta.minDrives}
                  onClick={() => {
                    const newCount = Math.max(currentMeta.minDrives, driveCount - 1)
                    setDriveCount(newCount)
                    if (hotSpares >= newCount) setHotSpares(0)
                    setFailedBays((prev) => prev.filter((b) => b < newCount))
                  }}
                  sx={{ border: "1px solid #cbd5e1", borderRadius: 1.5 }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>

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

                <IconButton
                  size="small"
                  disabled={driveCount >= 24}
                  onClick={() => {
                    const newCount = Math.min(24, driveCount + 1)
                    setDriveCount(newCount)
                  }}
                  sx={{ border: "1px solid #cbd5e1", borderRadius: 1.5 }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Quick Drive Count Chips */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}>
                {POPULAR_DRIVE_COUNTS.filter((n) => n >= currentMeta.minDrives).map((num) => (
                  <Chip
                    key={num}
                    label={`${num} Drives`}
                    clickable
                    size="small"
                    variant={driveCount === num ? "filled" : "outlined"}
                    color={driveCount === num ? "primary" : "default"}
                    onClick={() => {
                      setDriveCount(num)
                      if (hotSpares >= num) setHotSpares(0)
                      setFailedBays((prev) => prev.filter((b) => b < num))
                    }}
                    sx={{ fontWeight: 600, fontSize: "0.75rem", height: 24 }}
                  />
                ))}
              </Box>
            </Box>

            {/* 3. Individual Drive Capacity with Stepper */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#475569", display: "block", mb: 0.8 }}>
                DRIVE CAPACITY (TB):
              </Typography>

              {/* Quick Capacity Chips */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, mb: 1.2 }}>
                {POPULAR_DRIVE_SIZES.map((sz) => (
                  <Chip
                    key={sz}
                    label={`${sz} TB`}
                    clickable
                    size="small"
                    variant={driveSizeTB === sz ? "filled" : "outlined"}
                    color={driveSizeTB === sz ? "primary" : "default"}
                    onClick={() => setDriveSizeTB(sz)}
                    sx={{ fontWeight: 600, fontSize: "0.75rem", height: 24 }}
                  />
                ))}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  size="small"
                  disabled={driveSizeTB <= 1}
                  onClick={() => setDriveSizeTB(Math.max(1, driveSizeTB - 1))}
                  sx={{ border: "1px solid #cbd5e1", borderRadius: 1.5 }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>

                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  label="Custom Drive Size (TB)"
                  value={driveSizeTB}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 1
                    setDriveSizeTB(Math.max(0.5, Math.min(100, val)))
                  }}
                  slotProps={{
                    htmlInput: { min: 0.5, max: 100, step: 0.5 },
                  }}
                />

                <IconButton
                  size="small"
                  disabled={driveSizeTB >= 100}
                  onClick={() => setDriveSizeTB(Math.min(100, driveSizeTB + 1))}
                  sx={{ border: "1px solid #cbd5e1", borderRadius: 1.5 }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* 4. Drive Class & Error Rate */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#475569", display: "block", mb: 0.8 }}>
                DRIVE TYPE & URE SPECIFICATION:
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={driveType}
                onChange={(e) => {
                  const newType = e.target.value
                  setDriveType(newType)
                  const matched = DRIVE_TYPES.find((d) => d.id === newType)
                  if (matched) setCostPerDrive(matched.cost)
                }}
              >
                {DRIVE_TYPES.map((dt) => (
                  <MenuItem key={dt.id} value={dt.id}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {dt.label}
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* 5. Hot Spares & Cost Per Drive */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#475569", display: "block", mb: 0.5 }}>
                  HOT SPARES:
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={hotSpares}
                  onChange={(e) => setHotSpares(Number(e.target.value))}
                >
                  {[0, 1, 2, 3, 4].filter((n) => n < driveCount - 1).map((n) => (
                    <MenuItem key={n} value={n}>
                      {n === 0 ? "None (0)" : `${n} Spare Disk(s)`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#475569", display: "block", mb: 0.5 }}>
                  COST / DRIVE ($):
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  value={costPerDrive}
                  onChange={(e) => setCostPerDrive(Math.max(0, parseFloat(e.target.value) || 0))}
                  slotProps={{
                    htmlInput: { min: 0, step: 10 },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: VISUAL CHASSIS, HERO KPIS, PERFORMANCE & RISK */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* ─── HERO STATS CALLOUT (4 KPI CARDS) ─── */}
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            {/* Card 1: Usable Capacity */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid #bfdbfe",
                  bgcolor: "#eff6ff",
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#1e40af", textTransform: "uppercase" }}>
                  Usable Storage
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#1d4ed8", my: 0.5 }}>
                  {calcResults.usableTB.toFixed(1)} <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>TB</span>
                </Typography>
                <Typography variant="caption" sx={{ color: "#3b82f6", fontWeight: 600 }}>
                  {calcResults.usableTiB.toFixed(1)} TiB ({calcResults.efficiencyPercent.toFixed(0)}%)
                </Typography>
              </Paper>
            </Grid>

            {/* Card 2: Fault Tolerance */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid #bbf7d0",
                  bgcolor: "#f0fdf4",
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#166534", textTransform: "uppercase" }}>
                  Fault Tolerance
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#15803d", my: 0.5 }}>
                  {calcResults.faultToleranceDrives} <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Drive(s)</span>
                </Typography>
                <Typography variant="caption" sx={{ color: "#16a34a", fontWeight: 600 }}>
                  Max Safe Failures
                </Typography>
              </Paper>
            </Grid>

            {/* Card 3: Read Throughput */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#f8fafc",
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#475569", textTransform: "uppercase" }}>
                  Est. Read Speed
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", my: 0.5 }}>
                  ~{calcResults.readSpeedMB.toFixed(0)} <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>MB/s</span>
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                  {currentMeta.readMultiplier(Math.max(1, driveCount - hotSpares))}× Multiplier
                </Typography>
              </Paper>
            </Grid>

            {/* Card 4: Total Cost */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid #fed7aa",
                  bgcolor: "#fff7ed",
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#9a3412", textTransform: "uppercase" }}>
                  Hardware Cost
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#c2410c", my: 0.5 }}>
                  ${calcResults.totalHardwareCost.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: "#ea580c", fontWeight: 600 }}>
                  ${calcResults.costPerUsableTB.toFixed(2)} / Usable TB
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* ─── VIRTUAL CHASSIS & INTERACTIVE FAULT SIMULATION ─── */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3.5,
              border: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
            }}
          >
            {/* Header with 1-Click Simulation Triggers */}
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  Interactive Drive Chassis ({driveCount} Bays)
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Click any bay or use quick buttons to simulate live disk failure
                </Typography>
              </Box>

              {/* 1-Click Simulation Buttons */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleSimulateFailCount(1)}
                  sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.75rem" }}
                >
                  Fail 1 Disk
                </Button>
                {calcResults.faultToleranceDrives >= 2 && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleSimulateFailCount(2)}
                    sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.75rem" }}
                  >
                    Fail 2 Disks
                  </Button>
                )}
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={handleResetSimulation}
                  sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.75rem" }}
                >
                  Heal All
                </Button>
              </Box>
            </Box>

            {/* Array Health Status Banner */}
            <Alert
              severity={
                calcResults.arrayStatus === "optimal"
                  ? "success"
                  : calcResults.arrayStatus === "degraded"
                  ? "warning"
                  : "error"
              }
              sx={{
                mb: 2,
                borderRadius: 2.5,
                fontWeight: 700,
                "& .MuiAlert-message": { fontSize: "0.85rem" },
              }}
            >
              {calcResults.statusMessage}
            </Alert>

            {/* Rack Module */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: "#0f172a",
                border: "1px solid #1e293b",
              }}
            >
              <Grid container spacing={1.5}>
                {Array.from({ length: driveCount }, (_, idx) => {
                  const isFailed = failedBays.includes(idx)
                  const isHotSpare = idx >= driveCount - hotSpares

                  let bayColor = "#10b981" // Operational Green
                  let bayLabel = "Data + Parity"
                  let statusTag = "HEALTHY"

                  if (isFailed) {
                    bayColor = "#ef4444"
                    bayLabel = "FAILED DISK"
                    statusTag = "FAILED"
                  } else if (isHotSpare) {
                    bayColor = "#0284c7"
                    bayLabel = "Hot Standby"
                    statusTag = "SPARE"
                  }

                  return (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={idx}>
                      <Box
                        onClick={() => handleToggleBayFailure(idx)}
                        sx={{
                          p: 1.2,
                          borderRadius: 2,
                          bgcolor: isFailed ? "rgba(239, 68, 68, 0.15)" : "#1e293b",
                          border: `1.5px solid ${isFailed ? "#ef4444" : "#334155"}`,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: bayColor,
                            transform: "translateY(-2px)",
                            boxShadow: `0 4px 12px ${isFailed ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.2)"}`,
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 800, fontSize: "0.7rem" }}>
                            BAY {idx + 1}
                          </Typography>
                          <Chip
                            label={statusTag}
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: "0.6rem",
                              fontWeight: 900,
                              bgcolor: isFailed ? "#ef4444" : isHotSpare ? "#0284c7" : "#10b981",
                              color: "#ffffff",
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: "#f8fafc", fontWeight: 800 }}>
                          {driveSizeTB} TB
                        </Typography>
                        <Typography variant="caption" sx={{ color: isFailed ? "#fca5a5" : "#94a3b8", fontSize: "0.7rem", display: "block" }}>
                          {bayLabel}
                        </Typography>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>

              {/* Bay Legend */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2, pt: 1.5, borderTop: "1px solid #334155" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#10b981" }} />
                  <Typography variant="caption" sx={{ color: "#cbd5e1", fontWeight: 600 }}>
                    Active Data/Parity
                  </Typography>
                </Box>
                {hotSpares > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#0284c7" }} />
                    <Typography variant="caption" sx={{ color: "#cbd5e1", fontWeight: 600 }}>
                      Hot Spare
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ef4444" }} />
                  <Typography variant="caption" sx={{ color: "#cbd5e1", fontWeight: 600 }}>
                    Simulated Failure (Click bay to toggle)
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Paper>

          {/* ─── STORAGE ALLOCATION SEGMENT BAR ─── */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3.5,
              border: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                Storage Allocation Breakdown
              </Typography>
              <Chip
                label={`${calcResults.efficiencyPercent.toFixed(1)}% Usable Efficiency`}
                size="small"
                color="primary"
                sx={{ fontWeight: 700 }}
              />
            </Box>

            {/* Segmented Progress Bar */}
            <Box
              sx={{
                display: "flex",
                height: 18,
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#f1f5f9",
                mb: 2,
              }}
            >
              {calcResults.usableTB > 0 && (
                <Box
                  sx={{
                    width: `${(calcResults.usableTB / calcResults.rawTotalTB) * 100}%`,
                    bgcolor: "#10b981",
                    transition: "width 0.3s ease",
                  }}
                />
              )}
              {calcResults.parityTB > 0 && (
                <Box
                  sx={{
                    width: `${(calcResults.parityTB / calcResults.rawTotalTB) * 100}%`,
                    bgcolor: "#f59e0b",
                    transition: "width 0.3s ease",
                  }}
                />
              )}
              {calcResults.mirrorTB > 0 && (
                <Box
                  sx={{
                    width: `${(calcResults.mirrorTB / calcResults.rawTotalTB) * 100}%`,
                    bgcolor: "#8b5cf6",
                    transition: "width 0.3s ease",
                  }}
                />
              )}
              {calcResults.spareTB > 0 && (
                <Box
                  sx={{
                    width: `${(calcResults.spareTB / calcResults.rawTotalTB) * 100}%`,
                    bgcolor: "#0284c7",
                    transition: "width 0.3s ease",
                  }}
                />
              )}
            </Box>

            {/* Legend Stats Grid */}
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <Typography variant="caption" sx={{ color: "#166534", fontWeight: 700, display: "block" }}>
                    ● Usable Space
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#15803d" }}>
                    {calcResults.usableTB.toFixed(1)} TB
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#16a34a", fontSize: "0.7rem" }}>
                    ({calcResults.usableTiB.toFixed(1)} TiB)
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: "#fffbeb", border: "1px solid #fde68a" }}>
                  <Typography variant="caption" sx={{ color: "#92400e", fontWeight: 700, display: "block" }}>
                    ● Protection
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#b45309" }}>
                    {(calcResults.parityTB + calcResults.mirrorTB).toFixed(1)} TB
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#d97706", fontSize: "0.7rem" }}>
                    {calcResults.parityTB > 0 ? "Parity" : "Mirroring"}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: "#f0f9ff", border: "1px solid #bae6fd" }}>
                  <Typography variant="caption" sx={{ color: "#075985", fontWeight: 700, display: "block" }}>
                    ● Hot Spare
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#0369a1" }}>
                    {calcResults.spareTB.toFixed(1)} TB
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#0284c7", fontSize: "0.7rem" }}>
                    {hotSpares} Disk(s)
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <Typography variant="caption" sx={{ color: "#475569", fontWeight: 700, display: "block" }}>
                    ● Raw Total
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e293b" }}>
                    {calcResults.rawTotalTB.toFixed(1)} TB
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.7rem" }}>
                    ({calcResults.rawTotalTiB.toFixed(1)} TiB)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* ─── PERFORMANCE & REBUILD RISK CARDS ─── */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Speed Details */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <SpeedIcon sx={{ color: "#0284c7" }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    IOPS & Throughput Multipliers
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Estimated Read Speed:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#0369a1" }}>
                    ~{calcResults.readSpeedMB.toFixed(0)} MB/s ({currentMeta.readMultiplier(Math.max(1, driveCount - hotSpares))}× Single Drive)
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Estimated Write Speed (Penalty: {currentMeta.writePenalty}):
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    ~{calcResults.writeSpeedMB.toFixed(0)} MB/s ({currentMeta.writeMultiplier(Math.max(1, driveCount - hotSpares)).toFixed(2)}× Single Drive)
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Rebuild & URE Risk */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <SecurityIcon sx={{ color: "#8b5cf6" }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    Rebuild Time & URE Risk
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Est. Array Rebuild Duration:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    ~{calcResults.rebuildTimeHours.toFixed(1)} Hours (@ 65% controller load)
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Unrecoverable Read Error (URE) Risk:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,
                      color: calcResults.ureRiskPercent > 20 ? "#dc2626" : calcResults.ureRiskPercent > 5 ? "#d97706" : "#16a34a",
                    }}
                  >
                    {calcResults.ureRiskPercent.toFixed(2)}% Probability
                  </Typography>
                </Box>
                {calcResults.ureRiskPercent > 20 && (
                  <Typography variant="caption" sx={{ color: "#b91c1c", fontWeight: 700, display: "block", mt: 0.5 }}>
                    ⚠️ High risk on large HDDs! Consider RAID 6 or RAID 10.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* ─── ACTION UTILITIES & EXPORT ─── */}
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1.5 }}>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Total Hardware: <strong>${calcResults.totalHardwareCost.toLocaleString()}</strong> (${calcResults.costPerUsableTB.toFixed(2)}/TB)
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopySummary}
                sx={{ textTransform: "none", fontWeight: 700, borderColor: "#cbd5e1" }}
              >
                Copy Specification
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
                sx={{ textTransform: "none", fontWeight: 700, borderColor: "#cbd5e1" }}
              >
                Print / PDF
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* ─── SIDE-BY-SIDE COMPARISON TABLE WITH 1-CLICK APPLY ─── */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 4,
          border: "1px solid #e2e8f0",
          borderRadius: 3.5,
          bgcolor: "#ffffff",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1, mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem" }}>
              Side-by-Side Comparison for {driveCount} × {driveSizeTB} TB Drives
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Compare storage capacity, speed multipliers, and fault tolerance across all RAID configurations
            </Typography>
          </Box>
        </Box>

        <TableContainer sx={{ borderRadius: 2, border: "1px solid #e2e8f0" }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: "#334155" }}>RAID Level</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: "#334155" }}>Usable (TB)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: "#334155" }}>Efficiency</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: "#334155" }}>Fault Tolerance</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: "#334155" }}>Read Speed</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: "#334155" }}>Write Speed</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: "#334155" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comparisonMatrix.map((row) => (
                <TableRow
                  key={row.key}
                  sx={{
                    bgcolor: row.isCurrent ? "#eff6ff" : "inherit",
                    "&:hover": { bgcolor: row.isCurrent ? "#dbeafe" : "#f8fafc" },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: row.isCurrent ? 800 : 600, color: row.isCurrent ? "#1d4ed8" : "#1e293b" }}>
                        {row.name}
                      </Typography>
                      {row.isCurrent && (
                        <Chip
                          label="ACTIVE"
                          size="small"
                          color="primary"
                          sx={{ height: 18, fontSize: "0.62rem", fontWeight: 800 }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.7rem" }}>
                      {row.badge}
                    </Typography>
                  </TableCell>

                  <TableCell align="right" sx={{ fontWeight: 700, color: row.valid ? "#0f172a" : "#94a3b8" }}>
                    {row.valid ? `${row.usableTB.toFixed(1)} TB` : `Requires ${row.minDrives}+ Disks`}
                  </TableCell>

                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {row.valid ? `${row.efficiencyPercent.toFixed(0)}%` : "—"}
                  </TableCell>

                  <TableCell align="center">
                    {row.valid ? (
                      <Chip
                        label={row.faultTolerance === 0 ? "0 (No Protection)" : `${row.faultTolerance} Disk Failure(s)`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          bgcolor: row.faultTolerance === 0 ? "#fee2e2" : row.faultTolerance >= 2 ? "#dcfce7" : "#fef3c7",
                          color: row.faultTolerance === 0 ? "#991b1b" : row.faultTolerance >= 2 ? "#166534" : "#92400e",
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  <TableCell align="right" sx={{ fontWeight: 600, color: row.valid ? "#0369a1" : "#94a3b8" }}>
                    {row.valid ? `~${row.readSpeed.toFixed(0)} MB/s` : "—"}
                  </TableCell>

                  <TableCell align="right" sx={{ fontWeight: 600, color: row.valid ? "#0f172a" : "#94a3b8" }}>
                    {row.valid ? `~${row.writeSpeed.toFixed(0)} MB/s` : "—"}
                  </TableCell>

                  <TableCell align="center">
                    {row.isCurrent ? (
                      <Typography variant="caption" sx={{ fontWeight: 800, color: "#2563eb" }}>
                        Selected
                      </Typography>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={!row.valid}
                        onClick={() => {
                          setRaidMode(row.key)
                          setFailedBays([])
                          if (onToast) onToast(`Switched to ${row.name}`)
                        }}
                        sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.75rem", py: 0.2 }}
                      >
                        Apply
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default RaidCalculatorView
