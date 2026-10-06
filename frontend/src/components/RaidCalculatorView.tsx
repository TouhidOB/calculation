"use client"

import React, { useState, useMemo, useCallback } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Slider from "@mui/material/Slider"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Divider from "@mui/material/Divider"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Alert from "@mui/material/Alert"
import LinearProgress from "@mui/material/LinearProgress"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import DeleteIcon from "@mui/icons-material/Delete"
import StorageIcon from "@mui/icons-material/Storage"
import SpeedIcon from "@mui/icons-material/Speed"
import SecurityIcon from "@mui/icons-material/Security"
import MemoryIcon from "@mui/icons-material/Memory"
import RefreshIcon from "@mui/icons-material/Refresh"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import ErrorIcon from "@mui/icons-material/Error"
import TuneIcon from "@mui/icons-material/Tune"
import InfoIcon from "@mui/icons-material/Info"
import LanIcon from "@mui/icons-material/Lan"
import DvrIcon from "@mui/icons-material/Dvr"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import CompareArrowsIcon from "@mui/icons-material/CompareArrows"
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"
import ViewModuleIcon from "@mui/icons-material/ViewModule"

export interface RaidCalculatorViewProps {
  onToast?: (message: string, severity?: "success" | "info" | "warning" | "error") => void
}

export type RaidTypeCode =
  | "shr1"
  | "shr2"
  | "raid0"
  | "raid1"
  | "raid5"
  | "raid6"
  | "raid10"
  | "raid50"
  | "raid60"
  | "zfs_z1"
  | "zfs_z2"
  | "zfs_z3"
  | "jbod"

export interface RaidMeta {
  code: RaidTypeCode
  name: string
  shortLabel: string
  category: "hybrid" | "standard" | "zfs" | "linear"
  minDrives: number
  maxDriveTolerance: number
  writePenalty: number
  tag: string
  color: string
  description: string
}

export const RAID_ARCHITECTURES: Record<RaidTypeCode, RaidMeta> = {
  shr1: {
    code: "shr1",
    name: "Synology Hybrid RAID 1 (SHR-1)",
    shortLabel: "SHR-1",
    category: "hybrid",
    minDrives: 1,
    maxDriveTolerance: 1,
    writePenalty: 4,
    tag: "Best for Mixed Disks",
    color: "#0284c7",
    description: "Automatic mixed-drive horizontal slicing with 1-drive redundancy. Maximizes usable storage.",
  },
  shr2: {
    code: "shr2",
    name: "Synology Hybrid RAID 2 (SHR-2)",
    shortLabel: "SHR-2",
    category: "hybrid",
    minDrives: 4,
    maxDriveTolerance: 2,
    writePenalty: 6,
    tag: "High Mixed Safety",
    color: "#0369a1",
    description: "Mixed-drive slicing with 2-drive redundancy. Ideal for 4+ mixed drive arrays.",
  },
  raid5: {
    code: "raid5",
    name: "RAID 5 (Single Distributed Parity)",
    shortLabel: "RAID 5",
    category: "standard",
    minDrives: 3,
    maxDriveTolerance: 1,
    writePenalty: 4,
    tag: "Most Popular NAS",
    color: "#10b981",
    description: "1 disk capacity dedicated to parity across all disks. Array capacity bounded by smallest drive.",
  },
  raid6: {
    code: "raid6",
    name: "RAID 6 (Dual Distributed Parity)",
    shortLabel: "RAID 6",
    category: "standard",
    minDrives: 4,
    maxDriveTolerance: 2,
    writePenalty: 6,
    tag: "Dual Parity Safety",
    color: "#059669",
    description: "2 disks capacity for parity. Survives 2 concurrent disk failures during long rebuilds.",
  },
  raid10: {
    code: "raid10",
    name: "RAID 10 (Striped Mirrors 1+0)",
    shortLabel: "RAID 10",
    category: "standard",
    minDrives: 4,
    maxDriveTolerance: 1,
    writePenalty: 2,
    tag: "Fastest & Best IOPS",
    color: "#8b5cf6",
    description: "Pairs of mirrored disks striped together. 50% capacity with fastest rebuilds and highest IOPS.",
  },
  raid1: {
    code: "raid1",
    name: "RAID 1 (1:1 Mirroring)",
    shortLabel: "RAID 1",
    category: "standard",
    minDrives: 2,
    maxDriveTolerance: 1,
    writePenalty: 1,
    tag: "Simple 2-Bay Mirror",
    color: "#6366f1",
    description: "Exact duplicate copy across 2+ disks. 1 disk usable, ideal for 2-bay NAS.",
  },
  raid0: {
    code: "raid0",
    name: "RAID 0 (Pure Striping)",
    shortLabel: "RAID 0",
    category: "standard",
    minDrives: 2,
    maxDriveTolerance: 0,
    writePenalty: 1,
    tag: "Max Speed (No Safety)",
    color: "#ef4444",
    description: "Data split evenly across disks. Maximum speed and capacity, but 1 drive failure loses ALL data.",
  },
  zfs_z1: {
    code: "zfs_z1",
    name: "OpenZFS RAID-Z1",
    shortLabel: "RAID-Z1",
    category: "zfs",
    minDrives: 3,
    maxDriveTolerance: 1,
    writePenalty: 4,
    tag: "TrueNAS Single Parity",
    color: "#0d9488",
    description: "ZFS dynamic stripe-width parity with data self-healing and checksum verification.",
  },
  zfs_z2: {
    code: "zfs_z2",
    name: "OpenZFS RAID-Z2",
    shortLabel: "RAID-Z2",
    category: "zfs",
    minDrives: 4,
    maxDriveTolerance: 2,
    writePenalty: 6,
    tag: "TrueNAS Dual Parity",
    color: "#0f766e",
    description: "ZFS dual-parity with end-to-end data integrity. Recommended for drives 8TB and above.",
  },
  zfs_z3: {
    code: "zfs_z3",
    name: "OpenZFS RAID-Z3",
    shortLabel: "RAID-Z3",
    category: "zfs",
    minDrives: 5,
    maxDriveTolerance: 3,
    writePenalty: 8,
    tag: "Triple Parity Mission-Critical",
    color: "#115e59",
    description: "ZFS triple-parity protection. Survives 3 simultaneous drive failures in large disk pools.",
  },
  raid50: {
    code: "raid50",
    name: "RAID 50 (Striped RAID 5 Sets)",
    shortLabel: "RAID 50",
    category: "standard",
    minDrives: 6,
    maxDriveTolerance: 1,
    writePenalty: 4,
    tag: "Enterprise 6+ Bays",
    color: "#d97706",
    description: "Two or more RAID 5 arrays striped together. Faster rebuild times than single large RAID 5.",
  },
  raid60: {
    code: "raid60",
    name: "RAID 60 (Striped RAID 6 Sets)",
    shortLabel: "RAID 60",
    category: "standard",
    minDrives: 8,
    maxDriveTolerance: 2,
    writePenalty: 6,
    tag: "Enterprise 8+ Bays",
    color: "#b45309",
    description: "Two or more RAID 6 arrays striped together. High fault tolerance for enterprise SANs.",
  },
  jbod: {
    code: "jbod",
    name: "JBOD (Just a Bunch of Disks)",
    shortLabel: "JBOD",
    category: "linear",
    minDrives: 1,
    maxDriveTolerance: 0,
    writePenalty: 1,
    tag: "Span All Disks",
    color: "#64748b",
    description: "Disks concatenated into a single large volume. 100% capacity, no redundancy.",
  },
}

export const POPULAR_DRIVE_CAPACITIES = [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]

export const FILESYSTEM_OPTIONS = [
  { value: "btrfs", label: "Btrfs (4% Metadata & Snapshots - Synology DSM)", overhead: 0.04 },
  { value: "zfs", label: "OpenZFS (1.56% Slop Space - TrueNAS / Proxmox)", overhead: 0.0156 },
  { value: "ext4", label: "EXT4 (2% Reserved Inodes - Linux)", overhead: 0.02 },
  { value: "ntfs", label: "NTFS / ReFS (1.5% Cluster Overhead - Windows Server)", overhead: 0.015 },
  { value: "raw", label: "Raw Partition (0% Overhead)", overhead: 0.0 },
]

export const DRIVE_MEDIA_TYPES = [
  { value: "enterprise_hdd", label: "Enterprise HDD (7200 RPM, URE 10^15)", ure: 1e-15, defaultSpeed: 240, defaultCost: 280 },
  { value: "nas_hdd", label: "NAS / Consumer HDD (5400-5900 RPM, URE 10^14)", ure: 1e-14, defaultSpeed: 180, defaultCost: 180 },
  { value: "sata_ssd", label: "SATA 2.5\" SSD (TLC, URE 10^16)", ure: 1e-16, defaultSpeed: 540, defaultCost: 220 },
  { value: "nvme_ssd", label: "NVMe PCIe Gen4 SSD (Enterprise, URE 10^17)", ure: 1e-17, defaultSpeed: 3500, defaultCost: 450 },
]

// Pure calculation engine for individual architecture
export function calculateArrayMetrics(
  raidCode: RaidTypeCode,
  drives: number[],
  hotSpares: number = 0,
  diskSpeedMb: number = 220,
  ureRate: number = 1e-15,
  fsOverheadPct: number = 0.04
) {
  const nTotal = drives.length
  if (nTotal === 0) {
    return {
      valid: false,
      error: "No drives selected",
      usableTb: 0,
      usableTib: 0,
      netUsableTb: 0,
      netUsableTib: 0,
      parityTb: 0,
      spareTb: 0,
      unusedTb: 0,
      totalRawTb: 0,
      efficiencyPct: 0,
      faultToleranceDrives: 0,
      readMultiplier: 1,
      writeMultiplier: 1,
      estReadSpeedMb: 0,
      estWriteSpeedMb: 0,
      rebuildHours: 0,
      ureProbPct: 0,
    }
  }

  const nActive = Math.max(1, nTotal - hotSpares)
  const activeDrives = [...drives.slice(0, nActive)].sort((a, b) => b - a)
  const spareDrives = drives.slice(nActive)
  const totalRawTb = drives.reduce((sum, d) => sum + d, 0)
  const spareTb = spareDrives.reduce((sum, d) => sum + d, 0)
  const meta = RAID_ARCHITECTURES[raidCode]

  if (nActive < meta.minDrives) {
    return {
      valid: false,
      error: `Requires min ${meta.minDrives} drives (current: ${nActive})`,
      usableTb: 0,
      usableTib: 0,
      netUsableTb: 0,
      netUsableTib: 0,
      parityTb: 0,
      spareTb: spareTb,
      unusedTb: totalRawTb - spareTb,
      totalRawTb,
      efficiencyPct: 0,
      faultToleranceDrives: 0,
      readMultiplier: 1,
      writeMultiplier: 1,
      estReadSpeedMb: 0,
      estWriteSpeedMb: 0,
      rebuildHours: 0,
      ureProbPct: 0,
    }
  }

  const minDriveSize = activeDrives[activeDrives.length - 1] || 0
  let usableTb = 0
  let parityTb = 0
  let unusedTb = 0
  let faultToleranceDrives = meta.maxDriveTolerance
  let readMult = 1.0
  let writeMult = 1.0
  let readNeedsDrives = 1

  if (raidCode === "shr1") {
    // Slicing algorithm
    const uniqueHeights = Array.from(new Set(activeDrives)).sort((a, b) => a - b)
    let prevH = 0
    let u = 0
    let p = 0
    let un = 0
    for (const h of uniqueHeights) {
      const sliceH = h - prevH
      const count = activeDrives.filter((d) => d >= h).length
      if (count >= 3) {
        u += (count - 1) * sliceH
        p += 1 * sliceH
      } else if (count === 2) {
        u += 1 * sliceH
        p += 1 * sliceH
      } else if (count === 1) {
        un += 1 * sliceH
      }
      prevH = h
    }
    usableTb = u
    parityTb = p
    unusedTb = un
    faultToleranceDrives = 1
    readMult = Math.max(1.0, nActive - 1)
    writeMult = Math.max(0.5, nActive / 4.0)
    readNeedsDrives = nActive - 1
  } else if (raidCode === "shr2") {
    if (nActive < 4) {
      return {
        valid: false,
        error: "SHR-2 requires at least 4 drives",
        usableTb: 0,
        usableTib: 0,
        netUsableTb: 0,
        netUsableTib: 0,
        parityTb: 0,
        spareTb: spareTb,
        unusedTb: totalRawTb - spareTb,
        totalRawTb,
        efficiencyPct: 0,
        faultToleranceDrives: 0,
        readMultiplier: 1,
        writeMultiplier: 1,
        estReadSpeedMb: 0,
        estWriteSpeedMb: 0,
        rebuildHours: 0,
        ureProbPct: 0,
      }
    }
    const uniqueHeights = Array.from(new Set(activeDrives)).sort((a, b) => a - b)
    let prevH = 0
    let u = 0
    let p = 0
    let un = 0
    for (const h of uniqueHeights) {
      const sliceH = h - prevH
      const count = activeDrives.filter((d) => d >= h).length
      if (count >= 4) {
        u += (count - 2) * sliceH
        p += 2 * sliceH
      } else if (count === 3) {
        u += 1 * sliceH
        p += 2 * sliceH
      } else {
        un += count * sliceH
      }
      prevH = h
    }
    usableTb = u
    parityTb = p
    unusedTb = un
    faultToleranceDrives = 2
    readMult = Math.max(1.0, nActive - 2)
    writeMult = Math.max(0.4, nActive / 6.0)
    readNeedsDrives = nActive - 1
  } else if (raidCode === "raid0") {
    usableTb = nActive * minDriveSize
    unusedTb = activeDrives.reduce((s, d) => s + d, 0) - usableTb
    faultToleranceDrives = 0
    readMult = nActive
    writeMult = nActive
    readNeedsDrives = nActive
  } else if (raidCode === "raid1") {
    usableTb = minDriveSize
    parityTb = (nActive - 1) * minDriveSize
    unusedTb = activeDrives.reduce((s, d) => s + d, 0) - (usableTb + parityTb)
    faultToleranceDrives = nActive - 1
    readMult = nActive
    writeMult = 1.0
    readNeedsDrives = 1
  } else if (raidCode === "raid5" || raidCode === "zfs_z1") {
    usableTb = (nActive - 1) * minDriveSize
    parityTb = 1 * minDriveSize
    unusedTb = activeDrives.reduce((s, d) => s + d, 0) - (usableTb + parityTb)
    faultToleranceDrives = 1
    readMult = Math.max(1.0, nActive - 1)
    writeMult = Math.max(0.5, nActive / 4.0)
    readNeedsDrives = nActive - 1
  } else if (raidCode === "raid6" || raidCode === "zfs_z2") {
    usableTb = (nActive - 2) * minDriveSize
    parityTb = 2 * minDriveSize
    unusedTb = activeDrives.reduce((s, d) => s + d, 0) - (usableTb + parityTb)
    faultToleranceDrives = 2
    readMult = Math.max(1.0, nActive - 2)
    writeMult = Math.max(0.4, nActive / 6.0)
    readNeedsDrives = nActive - 1
  } else if (raidCode === "zfs_z3") {
    usableTb = (nActive - 3) * minDriveSize
    parityTb = 3 * minDriveSize
    unusedTb = activeDrives.reduce((s, d) => s + d, 0) - (usableTb + parityTb)
    faultToleranceDrives = 3
    readMult = Math.max(1.0, nActive - 3)
    writeMult = Math.max(0.3, nActive / 8.0)
    readNeedsDrives = nActive - 1
  } else if (raidCode === "raid10") {
    const effN = nActive % 2 === 0 ? nActive : nActive - 1
    const pairCount = Math.floor(effN / 2)
    usableTb = pairCount * minDriveSize
    parityTb = pairCount * minDriveSize
    unusedTb = activeDrives.reduce((s, d) => s + d, 0) - (usableTb + parityTb)
    faultToleranceDrives = 1
    readMult = effN
    writeMult = pairCount
    readNeedsDrives = 1
  } else if (raidCode === "raid50") {
    const groups = 2
    usableTb = (nActive - groups) * minDriveSize
    parityTb = groups * minDriveSize
    unusedTb = activeDrives.reduce((s, d) => s + d, 0) - (usableTb + parityTb)
    faultToleranceDrives = 1
    readMult = Math.max(1.0, nActive - groups)
    writeMult = Math.max(0.5, nActive / 4.0)
    readNeedsDrives = nActive - groups
  } else if (raidCode === "raid60") {
    const groups = 2
    usableTb = (nActive - groups * 2) * minDriveSize
    parityTb = groups * 2 * minDriveSize
    unusedTb = activeDrives.reduce((s, d) => s + d, 0) - (usableTb + parityTb)
    faultToleranceDrives = 2
    readMult = Math.max(1.0, nActive - groups * 2)
    writeMult = Math.max(0.4, nActive / 6.0)
    readNeedsDrives = nActive - groups * 2
  } else if (raidCode === "jbod") {
    usableTb = activeDrives.reduce((s, d) => s + d, 0)
    parityTb = 0
    unusedTb = 0
    faultToleranceDrives = 0
    readMult = 1.0
    writeMult = 1.0
    readNeedsDrives = 1
  }

  const efficiencyPct = totalRawTb > 0 ? (usableTb / totalRawTb) * 100 : 0
  const tibFactor = Math.pow(1000, 4) / Math.pow(1024, 4)
  const usableTib = usableTb * tibFactor
  const netUsableTb = Math.max(0, usableTb * (1 - fsOverheadPct))
  const netUsableTib = Math.max(0, usableTib * (1 - fsOverheadPct))

  // Scientific URE Calculation during rebuild
  const bitsRead = Math.max(0, readNeedsDrives) * minDriveSize * 8 * 1e12
  const exponent = -bitsRead * ureRate
  let ureProbPct = exponent < -50 ? 99.99 : (1 - Math.exp(exponent)) * 100
  ureProbPct = Math.min(99.99, Math.max(0.01, ureProbPct))

  // Rebuild duration
  const rebuildSpeedMb = Math.max(40, diskSpeedMb * 0.65)
  const diskMb = minDriveSize * 1000 * 1000
  const rebuildHours = minDriveSize > 0 ? Math.round((diskMb / (rebuildSpeedMb * 3600)) * 10) / 10 : 0

  return {
    valid: true,
    error: null,
    usableTb: Math.round(usableTb * 100) / 100,
    usableTib: Math.round(usableTib * 100) / 100,
    netUsableTb: Math.round(netUsableTb * 100) / 100,
    netUsableTib: Math.round(netUsableTib * 100) / 100,
    parityTb: Math.round(parityTb * 100) / 100,
    spareTb: Math.round(spareTb * 100) / 100,
    unusedTb: Math.round(unusedTb * 100) / 100,
    totalRawTb: Math.round(totalRawTb * 100) / 100,
    efficiencyPct: Math.round(efficiencyPct * 10) / 10,
    faultToleranceDrives,
    readMultiplier: Math.round(readMult * 10) / 10,
    writeMultiplier: Math.round(writeMult * 10) / 10,
    estReadSpeedMb: Math.round(diskSpeedMb * readMult),
    estWriteSpeedMb: Math.round(diskSpeedMb * writeMult),
    rebuildHours,
    ureProbPct: Math.round(ureProbPct * 10) / 10,
  }
}

export function RaidCalculatorView({ onToast }: RaidCalculatorViewProps) {
  // State: Drive selection (list of drive sizes in TB)
  const [drives, setDrives] = useState<number[]>([16, 16, 8, 4])
  const [selectedRaid, setSelectedRaid] = useState<RaidTypeCode>("shr1")
  const [hotSpares, setHotSpares] = useState<number>(0)
  const [diskMediaType, setDiskMediaType] = useState<string>("enterprise_hdd")
  const [diskSpeedMb, setDiskSpeedMb] = useState<number>(240)
  const [costPerTb, setCostPerTb] = useState<number>(22) // $22/TB typical enterprise
  const [filesystem, setFilesystem] = useState<string>("btrfs")
  const [failedDriveIndexes, setFailedDriveIndexes] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState<"visualizer" | "wizard">("visualizer")

  // Wizard state
  const [wizardGoal, setWizardGoal] = useState<string>("home_nas")
  const [wizardPriority, setWizardPriority] = useState<string>("balanced")

  // Selected media metadata
  const currentMedia = useMemo(
    () => DRIVE_MEDIA_TYPES.find((m) => m.value === diskMediaType) || DRIVE_MEDIA_TYPES[0],
    [diskMediaType]
  )

  const currentFs = useMemo(
    () => FILESYSTEM_OPTIONS.find((f) => f.value === filesystem) || FILESYSTEM_OPTIONS[0],
    [filesystem]
  )

  // Handlers for drive bay tray
  const handleAddDrive = (size: number) => {
    if (drives.length >= 24) {
      onToast?.("Maximum 24 drive bays reached.", "warning")
      return
    }
    setDrives((prev) => [...prev, size])
    onToast?.(`Added ${size} TB Drive to array.`, "success")
  }

  const handleRemoveDrive = (index: number) => {
    setDrives((prev) => prev.filter((_, i) => i !== index))
    setFailedDriveIndexes((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)))
  }

  const handleChangeDriveSize = (index: number, newSize: number) => {
    setDrives((prev) => {
      const next = [...prev]
      next[index] = newSize
      return next
    })
  }

  const handleFillAll = (size: number, count: number) => {
    const newArr = Array(count).fill(size)
    setDrives(newArr)
    setFailedDriveIndexes([])
    onToast?.(`Configured ${count} × ${size} TB drives.`, "info")
  }

  const handleClearAll = () => {
    setDrives([])
    setFailedDriveIndexes([])
  }

  // Toggle failure simulation on a specific bay
  const handleToggleFailDrive = (index: number) => {
    setFailedDriveIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  // Primary calculation for currently selected RAID architecture
  const currentMetrics = useMemo(() => {
    return calculateArrayMetrics(
      selectedRaid,
      drives,
      hotSpares,
      diskSpeedMb,
      currentMedia.ure,
      currentFs.overhead
    )
  }, [selectedRaid, drives, hotSpares, diskSpeedMb, currentMedia.ure, currentFs.overhead])

  // Multi-RAID Comparison Matrix (Calculates all compatible levels simultaneously)
  const allComparisons = useMemo(() => {
    const list: (RaidMeta & ReturnType<typeof calculateArrayMetrics>)[] = []
    const codes: RaidTypeCode[] = [
      "shr1",
      "shr2",
      "raid5",
      "raid6",
      "raid10",
      "raid1",
      "raid0",
      "zfs_z1",
      "zfs_z2",
      "zfs_z3",
      "raid50",
      "raid60",
      "jbod",
    ]
    for (const code of codes) {
      const meta = RAID_ARCHITECTURES[code]
      const metrics = calculateArrayMetrics(
        code,
        drives,
        hotSpares,
        diskSpeedMb,
        currentMedia.ure,
        currentFs.overhead
      )
      if (metrics.valid) {
        list.push({ ...meta, ...metrics })
      }
    }
    return list
  }, [drives, hotSpares, diskSpeedMb, currentMedia.ure, currentFs.overhead])

  // Array Simulation Health Status
  const simulationState = useMemo(() => {
    const failCount = failedDriveIndexes.length
    const allowed = currentMetrics.faultToleranceDrives
    if (failCount === 0) {
      return { status: "OPTIMAL", color: "#10b981", title: "Array Healthy & Optimal", alertType: "success" as const }
    } else if (failCount <= allowed) {
      return {
        status: "DEGRADED",
        color: "#f59e0b",
        title: `Array Degraded (${failCount} Failed Drive). Data Intact - Rebuild Urgently Required!`,
        alertType: "warning" as const,
      }
    } else {
      return {
        status: "FAILED",
        color: "#ef4444",
        title: `Array Crash (${failCount} Failed Drives). Exceeded Fault Tolerance of ${allowed} - Data Loss!`,
        alertType: "error" as const,
      }
    }
  }, [failedDriveIndexes.length, currentMetrics.faultToleranceDrives])

  // Cost estimates
  const totalHardwareCost = useMemo(() => {
    const totalRaw = drives.reduce((sum, d) => sum + d, 0)
    return Math.round(totalRaw * costPerTb)
  }, [drives, costPerTb])

  const costPerUsableTb = useMemo(() => {
    if (currentMetrics.usableTb <= 0) return 0
    return Math.round((totalHardwareCost / currentMetrics.usableTb) * 10) / 10
  }, [totalHardwareCost, currentMetrics.usableTb])

  // NAS Hardware & Networking Recommendation
  const nasRecommendation = useMemo(() => {
    const bayCount = drives.length
    if (bayCount <= 2) {
      return {
        chassis: "2-Bay Desktop NAS (e.g. Synology DS224+ / QNAP TS-264)",
        nic: "1 GbE / 2.5 GbE Ethernet",
        bandwidthMb: "125 - 280 MB/s",
        powerWatts: "~25W (Idle: 10W)",
      }
    } else if (bayCount <= 4) {
      return {
        chassis: "4-Bay Tower NAS (e.g. Synology DS923+ / QNAP TS-464)",
        nic: "2.5 GbE / 10 GbE SFP+ (Optional PCIe)",
        bandwidthMb: "280 - 1,100 MB/s",
        powerWatts: "~45W (Idle: 20W)",
      }
    } else if (bayCount <= 6) {
      return {
        chassis: "6-Bay High-Density Tower (e.g. Synology DS1621+)",
        nic: "10 GbE RJ45 / Dual 2.5 GbE Link Aggregation",
        bandwidthMb: "1,100 MB/s (Saturates 10G)",
        powerWatts: "~65W (Idle: 30W)",
      }
    } else if (bayCount <= 8) {
      return {
        chassis: "8-Bay Tower / 2U Rackmount (e.g. Synology DS1821+ / RS1221+)",
        nic: "10 GbE / 25 GbE SFP28 Dual Port",
        bandwidthMb: "1,100 - 2,500 MB/s",
        powerWatts: "~95W (Idle: 45W)",
      }
    } else {
      return {
        chassis: `${bayCount}-Bay Enterprise 2U/3U/4U SAN Rackmount Server`,
        nic: "25 GbE / 40 GbE / 100 GbE NVMe-oF RoCE",
        bandwidthMb: "3,000+ MB/s",
        powerWatts: "~180W - 350W",
      }
    }
  }, [drives.length])

  // Wizard Recommendation Logic
  const wizardRecommendation = useMemo(() => {
    if (wizardGoal === "home_nas" || wizardGoal === "plex") {
      return {
        raid: "shr1" as RaidTypeCode,
        title: "Synology SHR-1 / RAID 5",
        reason: "Best balance of maximum storage capacity and single-drive fault tolerance for media streaming & family backup.",
      }
    } else if (wizardGoal === "video_editing") {
      return {
        raid: "raid10" as RaidTypeCode,
        title: "RAID 10 (Striped Mirrors)",
        reason: "Zero parity write penalties ($W_p = 2$), fastest random 4K read/write speeds, and instant rebuilds without bottlenecking video timeline scrub.",
      }
    } else if (wizardGoal === "cold_backup" || wizardGoal === "large_archive") {
      return {
        raid: "raid6" as RaidTypeCode,
        title: "RAID 6 / ZFS RAID-Z2 (Dual Parity)",
        reason: "Crucial for large disks (8TB+) where secondary drive failure during multi-day rebuilds would cause total volume loss.",
      }
    } else if (wizardGoal === "database") {
      return {
        raid: "raid10" as RaidTypeCode,
        title: "RAID 10 (1+0)",
        reason: "Maximum IOPS write throughput for transactional SQL databases and virtual machine hosting.",
      }
    }
    return {
      raid: "shr1" as RaidTypeCode,
      title: "SHR-1 (Flexible Parity)",
      reason: "Optimal flexibility for mixed drive sizes with full drive failure safety.",
    }
  }, [wizardGoal])

  return (
    <Box sx={{ width: "100%", maxWidth: 1280, mx: "auto", pb: 6 }}>
      {/* Header Banner with High-Contrast Typography */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          border: "1px solid #334155",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <StorageIcon sx={{ fontSize: 32, color: "#38bdf8" }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.875rem" } }}>
                RAID & Storage Array Calculator
              </Typography>
              <Chip label="Synology SHR & ZFS Ready" size="small" sx={{ bgcolor: "#0284c7", color: "#fff", fontWeight: 700 }} />
            </Box>
            <Typography variant="body2" sx={{ color: "#94a3b8", maxWidth: 780 }}>
              Interactive storage planning workbench inspired by Synology RAID Calculator. Supports mixed drive sizes,
              dynamic horizontal slicing (SHR-1/SHR-2), standard RAID (0, 1, 5, 6, 10, 50, 60), OpenZFS, and live array failure simulation.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant={activeTab === "visualizer" ? "contained" : "outlined"}
              onClick={() => setActiveTab("visualizer")}
              startIcon={<ViewModuleIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                bgcolor: activeTab === "visualizer" ? "#0284c7" : "transparent",
                color: "#fff",
                borderColor: "#475569",
              }}
            >
              Interactive Array Builder
            </Button>
            <Button
              variant={activeTab === "wizard" ? "contained" : "outlined"}
              onClick={() => setActiveTab("wizard")}
              startIcon={<AutoAwesomeIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                bgcolor: activeTab === "wizard" ? "#8b5cf6" : "transparent",
                color: "#fff",
                borderColor: "#475569",
              }}
            >
              Recommendation Wizard
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* STEP 1: DRIVE PALETTE & INTERACTIVE CHASSIS TRAY */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
              1. Select & Insert Drives
            </Typography>
            <Chip
              label={`${drives.length} Drives (${drives.reduce((s, d) => s + d, 0)} TB Raw)`}
              size="small"
              sx={{ bgcolor: "#f1f5f9", color: "#334155", fontWeight: 700 }}
            />
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleFillAll(8, 4)}
              sx={{ textTransform: "none", borderRadius: 1.5, fontWeight: 600 }}
            >
              4 × 8TB Preset
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleFillAll(16, 6)}
              sx={{ textTransform: "none", borderRadius: 1.5, fontWeight: 600 }}
            >
              6 × 16TB Preset
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleFillAll(20, 8)}
              sx={{ textTransform: "none", borderRadius: 1.5, fontWeight: 600 }}
            >
              8 × 20TB Preset
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleClearAll}
              disabled={drives.length === 0}
              sx={{ textTransform: "none", borderRadius: 1.5, fontWeight: 600 }}
            >
              Clear Bays
            </Button>
          </Box>
        </Box>

        {/* Drive Palette Bar */}
        <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, mb: 1, display: "block" }}>
          Click to Insert a Drive into Next Available Bay:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {POPULAR_DRIVE_CAPACITIES.map((cap) => (
            <Button
              key={`palette-${cap}`}
              variant="contained"
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={() => handleAddDrive(cap)}
              sx={{
                bgcolor: "#f8fafc",
                color: "#0f172a",
                border: "1px solid #cbd5e1",
                borderRadius: 2,
                px: 1.5,
                py: 0.6,
                fontWeight: 700,
                fontSize: "0.8125rem",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#0284c7",
                  color: "#ffffff",
                  borderColor: "#0284c7",
                },
              }}
            >
              {cap} TB
            </Button>
          ))}
        </Box>

        {/* Virtual 24-Bay Chassis Tray */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2.5,
            bgcolor: "#0f172a",
            border: "2px solid #1e293b",
            color: "#ffffff",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DvrIcon sx={{ color: "#38bdf8", fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#e2e8f0" }}>
                VIRTUAL STORAGE CHASSIS ({drives.length} SLOTS POPULATED)
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              💡 Click any drive slot to simulate failure or change drive capacity
            </Typography>
          </Box>

          {drives.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center", color: "#64748b", border: "1px dashed #334155", borderRadius: 2 }}>
              <StorageIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                No drives in chassis. Click the capacities above to populate drive bays.
              </Typography>
            </Box>
          ) : (
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
              }}
            >
              {drives.map((size, index) => {
                const isFailed = failedDriveIndexes.includes(index)
                const isHotSpare = index >= drives.length - hotSpares && hotSpares > 0
                return (
                  <Box key={`bay-${index}`}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: isFailed ? "#7f1d1d" : isHotSpare ? "#0c4a6e" : "#1e293b",
                        border: isFailed
                          ? "2px solid #ef4444"
                          : isHotSpare
                          ? "2px solid #0284c7"
                          : "1px solid #334155",
                        color: "#ffffff",
                        transition: "all 0.2s ease",
                        position: "relative",
                        "&:hover": {
                          borderColor: isFailed ? "#f87171" : "#38bdf8",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: "#94a3b8", fontSize: "0.7rem" }}>
                          BAY {String(index + 1).padStart(2, "0")}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveDrive(index)}
                          sx={{ color: "#94a3b8", p: 0.2, "&:hover": { color: "#ef4444" } }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>

                      {/* Drive capacity selector inside bay */}
                      <Box sx={{ mb: 1 }}>
                        <Select
                          size="small"
                          value={size}
                          onChange={(e) => handleChangeDriveSize(index, Number(e.target.value))}
                          sx={{
                            color: "#ffffff",
                            bgcolor: "#0f172a",
                            fontWeight: 800,
                            fontSize: "0.875rem",
                            width: "100%",
                            "& .MuiSelect-select": { py: 0.6, px: 1 },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
                          }}
                        >
                          {POPULAR_DRIVE_CAPACITIES.map((c) => (
                            <MenuItem key={`opt-${index}-${c}`} value={c}>
                              {c} TB HDD
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>

                      {/* Interactive Failure Simulation Button */}
                      <Button
                        fullWidth
                        size="small"
                        onClick={() => handleToggleFailDrive(index)}
                        sx={{
                          py: 0.4,
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          textTransform: "none",
                          borderRadius: 1,
                          bgcolor: isFailed ? "#ef4444" : isHotSpare ? "#0284c7" : "#334155",
                          color: "#ffffff",
                          "&:hover": {
                            bgcolor: isFailed ? "#dc2626" : isHotSpare ? "#0369a1" : "#475569",
                          },
                        }}
                      >
                        {isFailed ? "🔴 FAILED" : isHotSpare ? "🔵 HOT SPARE" : "🟢 HEALTHY"}
                      </Button>
                    </Paper>
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>
      </Paper>

      {/* STEP 2: MULTI-RAID REAL-TIME VISUALIZER (SYNOLOGY PARITY & COMPARISON STACK) */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 2.5, gap: 1.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
              2. Real-Time Storage Breakdown Across All RAID Types
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Instantly compares usable capacity, parity protection, and wasted space for your exact drive configuration.
            </Typography>
          </Box>

          {/* Color Legend */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "3px", bgcolor: "#0284c7" }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                Available Space
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "3px", bgcolor: "#f59e0b" }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                Parity / Protection
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "3px", bgcolor: "#94a3b8" }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                Unused (Wasted)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "3px", bgcolor: "#38bdf8" }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                Hot Spare
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stack of all compatible architectures */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {allComparisons.map((row) => {
            const isSelected = selectedRaid === row.code
            const totalRaw = row.totalRawTb || 1
            const usableWidth = `${Math.min(100, Math.max(0, (row.usableTb / totalRaw) * 100))}%`
            const parityWidth = `${Math.min(100, Math.max(0, (row.parityTb / totalRaw) * 100))}%`
            const spareWidth = `${Math.min(100, Math.max(0, (row.spareTb / totalRaw) * 100))}%`
            const unusedWidth = `${Math.min(100, Math.max(0, (row.unusedTb / totalRaw) * 100))}%`

            return (
              <Paper
                key={`comp-row-${row.code}`}
                elevation={0}
                onClick={() => setSelectedRaid(row.code)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: isSelected ? "2px solid #0284c7" : "1px solid #e2e8f0",
                  bgcolor: isSelected ? "#f0f9ff" : "#f8fafc",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: "#0284c7",
                    bgcolor: "#f0f9ff",
                  },
                }}
              >
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 1, gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      {row.name}
                    </Typography>
                    <Chip label={row.tag} size="small" sx={{ bgcolor: isSelected ? "#0284c7" : "#e2e8f0", color: isSelected ? "#fff" : "#334155", fontWeight: 700, fontSize: "0.7rem" }} />
                    {isSelected && (
                      <Chip label="ACTIVE CONFIGURATION" size="small" color="primary" sx={{ fontWeight: 800, fontSize: "0.6875rem" }} />
                    )}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: "#0284c7" }}>
                      {row.usableTb} TB Usable ({row.usableTib} TiB)
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                      Tolerance: {row.faultToleranceDrives} Drive{row.faultToleranceDrives !== 1 ? "s" : ""}
                    </Typography>
                  </Box>
                </Box>

                {/* Segmented Visual Progress Bar */}
                <Box sx={{ width: "100%", height: 26, borderRadius: 1.5, overflow: "hidden", display: "flex", bgcolor: "#e2e8f0", mb: 1 }}>
                  {row.usableTb > 0 && (
                    <Tooltip title={`Available Capacity: ${row.usableTb} TB (${row.efficiencyPct}%)`}>
                      <Box sx={{ width: usableWidth, height: "100%", bgcolor: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem", fontWeight: 700 }}>
                        {parseFloat(usableWidth) > 12 ? `${row.usableTb} TB` : ""}
                      </Box>
                    </Tooltip>
                  )}
                  {row.parityTb > 0 && (
                    <Tooltip title={`Protection / Parity: ${row.parityTb} TB`}>
                      <Box sx={{ width: parityWidth, height: "100%", bgcolor: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem", fontWeight: 700 }}>
                        {parseFloat(parityWidth) > 12 ? `${row.parityTb} TB` : ""}
                      </Box>
                    </Tooltip>
                  )}
                  {row.spareTb > 0 && (
                    <Tooltip title={`Hot Spare: ${row.spareTb} TB`}>
                      <Box sx={{ width: spareWidth, height: "100%", bgcolor: "#38bdf8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem", fontWeight: 700 }}>
                        {parseFloat(spareWidth) > 12 ? `${row.spareTb} TB` : ""}
                      </Box>
                    </Tooltip>
                  )}
                  {row.unusedTb > 0 && (
                    <Tooltip title={`Unused (Wasted): ${row.unusedTb} TB`}>
                      <Box sx={{ width: unusedWidth, height: "100%", bgcolor: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem", fontWeight: 700 }}>
                        {parseFloat(unusedWidth) > 12 ? `${row.unusedTb} TB Unused` : ""}
                      </Box>
                    </Tooltip>
                  )}
                </Box>

                {/* Subtext info */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    {row.description}
                  </Typography>
                  {row.unusedTb > 0 && (
                    <Typography variant="caption" sx={{ color: "#d97706", fontWeight: 700 }}>
                      ⚠️ {row.unusedTb} TB wasted due to mixed disk size limitation. Use SHR-1 to reclaim!
                    </Typography>
                  )}
                </Box>
              </Paper>
            )
          })}
        </Box>
      </Paper>

      {/* STEP 3: DEEP-DIVE TELEMETRY & HARDWARE TELEMETRY DECK */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" }, gap: 3, mb: 3 }}>
        {/* Left Side: Array Parameters & Filesystem Options */}
        <Box>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#ffffff", height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
              3. Array Parameters & Filesystem
            </Typography>

            {/* Hot Spares Stepper */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.5 }}>
                Dedicated Hot Spare Drives: {hotSpares}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  size="small"
                  disabled={hotSpares <= 0}
                  onClick={() => setHotSpares((p) => Math.max(0, p - 1))}
                  sx={{ border: "1px solid #cbd5e1" }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Slider
                  size="small"
                  value={hotSpares}
                  min={0}
                  max={Math.max(0, drives.length - 2)}
                  step={1}
                  onChange={(_, val) => setHotSpares(Number(val))}
                  sx={{ color: "#0284c7", flex: 1 }}
                />
                <IconButton
                  size="small"
                  disabled={hotSpares >= drives.length - 2}
                  onClick={() => setHotSpares((p) => Math.min(drives.length - 2, p + 1))}
                  sx={{ border: "1px solid #cbd5e1" }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Drive Media Type & URE */}
            <Box sx={{ mb: 2.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontWeight: 600 }}>Drive Media & Reliability</InputLabel>
                <Select
                  value={diskMediaType}
                  label="Drive Media & Reliability"
                  onChange={(e) => {
                    const val = e.target.value
                    setDiskMediaType(val)
                    const m = DRIVE_MEDIA_TYPES.find((x) => x.value === val)
                    if (m) setDiskSpeedMb(m.defaultSpeed)
                  }}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                  {DRIVE_MEDIA_TYPES.map((media) => (
                    <MenuItem key={media.value} value={media.value}>
                      {media.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Target Filesystem (Overhead reservation) */}
            <Box sx={{ mb: 2.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontWeight: 600 }}>Volume Filesystem Metadata Overhead</InputLabel>
                <Select
                  value={filesystem}
                  label="Volume Filesystem Metadata Overhead"
                  onChange={(e) => setFilesystem(e.target.value)}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                  {FILESYSTEM_OPTIONS.map((fs) => (
                    <MenuItem key={fs.value} value={fs.value}>
                      {fs.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Estimated Hardware Cost per TB */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155", display: "block", mb: 0.5 }}>
                Estimated Cost per TB ($): ${costPerTb} / TB
              </Typography>
              <Slider
                size="small"
                value={costPerTb}
                min={10}
                max={100}
                step={2}
                onChange={(_, val) => setCostPerTb(Number(val))}
                sx={{ color: "#10b981" }}
              />
            </Box>
          </Paper>
        </Box>

        {/* Right Side: Primary Active Array Metrics & Failure Simulator */}
        <Box>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#ffffff", height: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                Active Telemetry: {RAID_ARCHITECTURES[selectedRaid].name}
              </Typography>
              <Chip
                label={simulationState.status}
                sx={{
                  bgcolor: simulationState.color,
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                }}
              />
            </Box>

            {/* Live Simulation Alert */}
            {failedDriveIndexes.length > 0 && (
              <Alert severity={simulationState.alertType} sx={{ mb: 2.5, borderRadius: 2, fontWeight: 600 }}>
                {simulationState.title}
              </Alert>
            )}

            {/* Hero Metric Grid */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
              <Box>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <Typography variant="caption" sx={{ color: "#166534", fontWeight: 700, display: "block" }}>
                    Net Usable Storage
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#15803d" }}>
                    {currentMetrics.netUsableTb} TB
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#166534" }}>
                    {currentMetrics.netUsableTib} TiB Formatted
                  </Typography>
                </Paper>
              </Box>

              <Box>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: "#f0f9ff", border: "1px solid #bae6fd" }}>
                  <Typography variant="caption" sx={{ color: "#0369a1", fontWeight: 700, display: "block" }}>
                    Fault Tolerance
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0284c7" }}>
                    {currentMetrics.faultToleranceDrives} Disk{currentMetrics.faultToleranceDrives !== 1 ? "s" : ""}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#0369a1" }}>
                    {currentMetrics.faultToleranceDrives > 0 ? "Protected" : "Zero Redundancy"}
                  </Typography>
                </Paper>
              </Box>

              <Box>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: "#faf5ff", border: "1px solid #e9d5ff" }}>
                  <Typography variant="caption" sx={{ color: "#6b21a8", fontWeight: 700, display: "block" }}>
                    Read Throughput
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#7e22ce" }}>
                    ~{currentMetrics.estReadSpeedMb} MB/s
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6b21a8" }}>
                    {currentMetrics.readMultiplier}× Speed Multiplier
                  </Typography>
                </Paper>
              </Box>

              <Box>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: "#fffbeb", border: "1px solid #fde68a" }}>
                  <Typography variant="caption" sx={{ color: "#92400e", fontWeight: 700, display: "block" }}>
                    Array Hardware Cost
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#b45309" }}>
                    ${totalHardwareCost}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#92400e" }}>
                    ${costPerUsableTb} / Usable TB
                  </Typography>
                </Paper>
              </Box>
            </Box>

            {/* Rebuild Duration & URE Probability Analysis */}
            <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SecurityIcon sx={{ color: "#0284c7", fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    Rebuild Duration & URE Risk Analysis
                  </Typography>
                </Box>
                <Chip
                  label={
                    currentMetrics.ureProbPct > 30
                      ? "High Rebuild Risk"
                      : currentMetrics.ureProbPct > 10
                      ? "Moderate Risk"
                      : "Low Risk"
                  }
                  size="small"
                  sx={{
                    bgcolor: currentMetrics.ureProbPct > 30 ? "#fee2e2" : "#f0fdf4",
                    color: currentMetrics.ureProbPct > 30 ? "#991b1b" : "#166534",
                    fontWeight: 800,
                  }}
                />
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                    Estimated Drive Rebuild Time:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    ⏱️ {currentMetrics.rebuildHours} Hours (~{Math.round((currentMetrics.rebuildHours / 24) * 10) / 10} Days)
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    Based on 65% sustained drive speed under active rebuild workload.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                    Probability of URE during Rebuild:
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      color: currentMetrics.ureProbPct > 30 ? "#dc2626" : "#0284c7",
                    }}
                  >
                    🎲 {currentMetrics.ureProbPct}% Probability
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    {currentMetrics.ureProbPct > 30
                      ? "Recommend RAID 6 / SHR-2 / RAID-Z2 to protect against rebuild loss."
                      : "Within safe operational margins."}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Recommended NAS Chassis & Network Matcher */}
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#0f172a", color: "#ffffff", border: "1px solid #334155" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <LanIcon sx={{ color: "#38bdf8", fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#e2e8f0" }}>
                  RECOMMENDED NAS HARDWARE & NETWORK INTERFACE
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#38bdf8", fontWeight: 700, mb: 0.5 }}>
                • Enclosure: {nasRecommendation.chassis}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
                • Recommended NIC: {nasRecommendation.nic} ({nasRecommendation.bandwidthMb})
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
                • Est. System Power Draw: {nasRecommendation.powerWatts}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* STEP 4: DECISION WIZARD (WHEN TAB IS WIZARD) */}
      {activeTab === "wizard" && (
        <Paper elevation={0} sx={{ p: 3.5, mb: 3, borderRadius: 3, border: "2px solid #8b5cf6", bgcolor: "#faf5ff" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <AutoAwesomeIcon sx={{ color: "#8b5cf6", fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#581c87" }}>
              Smart RAID Recommendation Guide
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#6b21a8", mb: 3 }}>
            Answer these 2 simple questions to find the perfect RAID architecture for your specific project or workflow:
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3, mb: 3 }}>
            <Box>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontWeight: 600 }}>What is your primary use case?</InputLabel>
                <Select
                  value={wizardGoal}
                  label="What is your primary use case?"
                  onChange={(e) => setWizardGoal(e.target.value)}
                  sx={{ fontWeight: 700, borderRadius: 2, bgcolor: "#fff" }}
                >
                  <MenuItem value="home_nas">Plex Media Server & Family File Storage</MenuItem>
                  <MenuItem value="video_editing">4K/8K Video Editing & Creative Workstation</MenuItem>
                  <MenuItem value="cold_backup">Large Cold Archive & Backup (8TB+ Disks)</MenuItem>
                  <MenuItem value="database">Database, Virtualization (VMware/Proxmox) & High IOPS</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontWeight: 600 }}>What is your top priority?</InputLabel>
                <Select
                  value={wizardPriority}
                  label="What is your top priority?"
                  onChange={(e) => setWizardPriority(e.target.value)}
                  sx={{ fontWeight: 700, borderRadius: 2, bgcolor: "#fff" }}
                >
                  <MenuItem value="balanced">Balanced (Maximum Storage with 1-Drive Safety)</MenuItem>
                  <MenuItem value="max_safety">Maximum Safety (Dual Parity 2-Drive Safety)</MenuItem>
                  <MenuItem value="max_speed">Maximum Speed & IOPS Throughput</MenuItem>
                  <MenuItem value="mixed_disks">Ability to mix different size hard drives over time</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: "#ffffff", border: "1px solid #d8b4fe" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#7e22ce", fontWeight: 800, textTransform: "uppercase" }}>
                  RECOMMENDED ARCHITECTURE
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#581c87" }}>
                  🎯 {wizardRecommendation.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b21a8", maxWidth: 650, mt: 0.5 }}>
                  {wizardRecommendation.reason}
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={() => {
                  setSelectedRaid(wizardRecommendation.raid)
                  setActiveTab("visualizer")
                  onToast?.(`Applied ${wizardRecommendation.title} to array workbench.`, "success")
                }}
                sx={{
                  bgcolor: "#7e22ce",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#6b21a8" },
                }}
              >
                Apply This Architecture
              </Button>
            </Box>
          </Paper>
        </Paper>
      )}
    </Box>
  )
}

export default RaidCalculatorView
