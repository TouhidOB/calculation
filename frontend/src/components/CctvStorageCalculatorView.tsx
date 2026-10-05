"use client"

import React, { useState, useMemo } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Slider from "@mui/material/Slider"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import LinearProgress from "@mui/material/LinearProgress"
import Switch from "@mui/material/Switch"
import FormControlLabel from "@mui/material/FormControlLabel"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Divider from "@mui/material/Divider"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"

import VideocamIcon from "@mui/icons-material/Videocam"
import StorageIcon from "@mui/icons-material/Storage"
import SpeedIcon from "@mui/icons-material/Speed"
import SecurityIcon from "@mui/icons-material/Security"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import PrintIcon from "@mui/icons-material/Print"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import MemoryIcon from "@mui/icons-material/Memory"
import DnsIcon from "@mui/icons-material/Dns"
import SavingsIcon from "@mui/icons-material/Savings"

// Industry standard base bitrates at 15 FPS H.264 (Medium motion)
const RESOLUTIONS: Record<string, { label: string; mp: number; baseMbps: number; desc: string }> = {
  "720p": { label: "720p (1 MP)", mp: 1.0, baseMbps: 1.5, desc: "1280 × 720 HD" },
  "1080p": { label: "1080p (2 MP Full HD)", mp: 2.0, baseMbps: 2.5, desc: "1920 × 1080 (Surveillance Standard)" },
  "3mp": { label: "3 MP", mp: 3.0, baseMbps: 3.5, desc: "2048 × 1536" },
  "4mp": { label: "4 MP (2K QHD)", mp: 4.0, baseMbps: 4.5, desc: "2560 × 1440 / 2688 × 1520" },
  "5mp": { label: "5 MP", mp: 5.0, baseMbps: 5.5, desc: "2592 × 1944" },
  "6mp": { label: "6 MP", mp: 6.0, baseMbps: 6.5, desc: "3072 × 2048" },
  "4k": { label: "8 MP (4K UHD)", mp: 8.0, baseMbps: 8.0, desc: "3840 × 2160 Ultra HD" },
  "12mp": { label: "12 MP (Ultra)", mp: 12.0, baseMbps: 12.0, desc: "4000 × 3000 Fisheye / Multi-sensor" },
}

const CODECS: Record<string, { label: string; factor: number; savingsText: string; color: string }> = {
  h265_plus: { label: "H.265+ (Smart Codec)", factor: 0.30, savingsText: "70% storage savings", color: "#10b981" },
  h265: { label: "H.265 (HEVC Standard)", factor: 0.50, savingsText: "50% storage savings", color: "#0ea5e9" },
  h264_plus: { label: "H.264+ (Smart H.264)", factor: 0.70, savingsText: "30% storage savings", color: "#8b5cf6" },
  h264: { label: "H.264 (AVC Baseline)", factor: 1.00, savingsText: "Baseline reference", color: "#64748b" },
  mjpeg: { label: "MJPEG (Legacy)", factor: 2.80, savingsText: "2.8× higher bitrate", color: "#ef4444" },
}

const MOTIONS: Record<string, { label: string; factor: number; desc: string }> = {
  low: { label: "Low (Static corridor, hallway, night)", factor: 0.8, desc: "20% movement activity" },
  medium: { label: "Medium (Office, retail store, yard)", factor: 1.0, desc: "40-50% movement activity" },
  high: { label: "High (Busy street, cashier, highway)", factor: 1.3, desc: "80%+ continuous movement" },
}

const RAID_MODES: Record<string, { label: string; minDrives: number; desc: string }> = {
  none: { label: "No RAID / JBOD (Single Drive)", minDrives: 1, desc: "100% capacity usable, no redundancy" },
  raid0: { label: "RAID 0 (Striping)", minDrives: 2, desc: "100% capacity usable, maximum speed, zero fault tolerance" },
  raid1: { label: "RAID 1 (Mirroring)", minDrives: 2, desc: "50% capacity usable, 1 drive failure tolerance" },
  raid5: { label: "RAID 5 (Single Parity)", minDrives: 3, desc: "N-1 usable, 1 drive failure tolerance (Recommended for 4+ bays)" },
  raid6: { label: "RAID 6 (Dual Parity)", minDrives: 4, desc: "N-2 usable, 2 drives failure tolerance" },
  raid10: { label: "RAID 10 (Stripe of Mirrors)", minDrives: 4, desc: "50% usable, high performance and fault tolerance" },
}

const PRESETS = [
  {
    name: "Home Security",
    icon: "🏠",
    desc: "4 × 1080p Cameras, 15 days",
    config: { cameras: 4, resolution: "1080p", fps: 15, codec: "h265", motion: "medium", hours: 24, days: 15, audio: false, buffer: 20, raid: "none" },
  },
  {
    name: "Retail Shop",
    icon: "🏬",
    desc: "8 × 4MP QHD, 30 days, Audio",
    config: { cameras: 8, resolution: "4mp", fps: 15, codec: "h265_plus", motion: "medium", hours: 24, days: 30, audio: true, buffer: 20, raid: "none" },
  },
  {
    name: "Commercial Office",
    icon: "🏢",
    desc: "16 × 4MP QHD, 60 days, RAID 5",
    config: { cameras: 16, resolution: "4mp", fps: 20, codec: "h265_plus", motion: "low", hours: 24, days: 60, audio: true, buffer: 20, raid: "raid5" },
  },
  {
    name: "Industrial / Warehouse",
    icon: "🏭",
    desc: "32 × 4K UHD, 90 days, RAID 6",
    config: { cameras: 32, resolution: "4k", fps: 15, codec: "h265_plus", motion: "high", hours: 24, days: 90, audio: true, buffer: 20, raid: "raid6" },
  },
]

const STANDARD_DRIVES = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]

interface CctvStorageCalculatorViewProps {
  onToast?: (msg: string) => void
}

export function CctvStorageCalculatorView({ onToast }: CctvStorageCalculatorViewProps) {
  // Inputs
  const [cameras, setCameras] = useState<number>(8)
  const [resolution, setResolution] = useState<string>("4mp")
  const [fps, setFps] = useState<number>(15)
  const [codec, setCodec] = useState<string>("h265_plus")
  const [motion, setMotion] = useState<string>("medium")
  const [hoursPerDay, setHoursPerDay] = useState<number>(24)
  const [retentionDays, setRetentionDays] = useState<number>(30)
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true)
  const [bufferPercent, setBufferPercent] = useState<number>(20)
  const [raidMode, setRaidMode] = useState<string>("none")
  const [activeTab, setActiveTab] = useState<number>(0)

  // Load preset
  const handleApplyPreset = (p: typeof PRESETS[0]) => {
    setCameras(p.config.cameras)
    setResolution(p.config.resolution)
    setFps(p.config.fps)
    setCodec(p.config.codec)
    setMotion(p.config.motion)
    setHoursPerDay(p.config.hours)
    setRetentionDays(p.config.days)
    setAudioEnabled(p.config.audio)
    setBufferPercent(p.config.buffer)
    setRaidMode(p.config.raid)
    if (onToast) onToast(`Applied preset: ${p.name}`)
  }

  // Core Calculation Math
  const calculation = useMemo(() => {
    const resMeta = RESOLUTIONS[resolution] || RESOLUTIONS["1080p"]
    const codecMeta = CODECS[codec] || CODECS["h265"]
    const motionMeta = MOTIONS[motion] || MOTIONS["medium"]

    // FPS scaling factor (Surveillance temporal delta inter-frame scaling)
    const fpsScale = Math.pow(Math.max(1, fps) / 15.0, 0.75)
    const audioMbps = audioEnabled ? 0.064 : 0.0

    // Single camera bitrate (Mbps)
    const videoBitrateMbps = resMeta.baseMbps * fpsScale * codecMeta.factor * motionMeta.factor
    const singleCamMbps = Math.max(0.1, videoBitrateMbps + audioMbps)
    const singleCamKbps = Math.round(singleCamMbps * 1000)

    // Total System Bandwidth (Mbps)
    const totalBandwidthMbps = singleCamMbps * Math.max(1, cameras)

    // Daily storage ingestion (GB/day per cam & total)
    // HDD manufacturer standard: 1 TB = 1,000 GB = 10^12 bytes
    const dailyGbPerCam = (singleCamMbps * 3600 * Math.max(1, hoursPerDay)) / (8 * 1000)
    const dailyGbTotal = dailyGbPerCam * Math.max(1, cameras)

    // Raw and Buffered storage (GB & TB)
    const rawStorageGb = dailyGbTotal * Math.max(1, retentionDays)
    const rawStorageTb = rawStorageGb / 1000.0
    const bufferFactor = 1.0 + Math.max(0, bufferPercent) / 100.0
    const recommendedStorageTb = rawStorageTb * bufferFactor
    const recommendedStorageTib = (rawStorageGb * bufferFactor) / 1024.0

    // Hardware Drive & Chassis Recommendation
    let raidMultiplier = 1.0
    if (raidMode === "raid1" || raidMode === "raid10") {
      raidMultiplier = 2.0
    } else if (raidMode === "raid5") {
      raidMultiplier = 1.33 // approx (4 drives -> 3 usable)
    } else if (raidMode === "raid6") {
      raidMultiplier = 1.5 // approx (4 drives -> 2 usable)
    }

    const neededRawTb = recommendedStorageTb * raidMultiplier

    // Find best drive combination
    const minDrives = RAID_MODES[raidMode]?.minDrives || 1
    let bestConfig = { drives: minDrives, size: 2, totalCapacity: minDrives * 2 }
    let found = false

    for (const size of STANDARD_DRIVES) {
      if (size * minDrives >= neededRawTb) {
        bestConfig = { drives: minDrives, size, totalCapacity: minDrives * size }
        found = true
        break
      }
    }

    if (!found) {
      // Scale drives count
      for (let count = minDrives + 1; count <= 24; count++) {
        for (const size of [8, 10, 12, 16, 18, 20]) {
          if (count * size >= neededRawTb) {
            bestConfig = { drives: count, size, totalCapacity: count * size }
            found = true
            break
          }
        }
        if (found) break
      }
    }

    const driveCount = bestConfig.drives
    const driveSize = bestConfig.size

    let nvrChassis = "1-Bay Desktop NVR"
    if (driveCount === 2) nvrChassis = "2-Bay Desktop NVR"
    else if (driveCount >= 3 && driveCount <= 4) nvrChassis = "4-Bay Commercial NVR"
    else if (driveCount >= 5 && driveCount <= 8) nvrChassis = "8-Bay Rackmount NVR"
    else if (driveCount > 8) nvrChassis = "16-Bay / 24-Bay Enterprise NVR"

    // Network switch tier
    let switchTier = "Standard 100M PoE Switch (80 Mbps NVR Input)"
    if (totalBandwidthMbps > 300) {
      switchTier = "Gigabit / 10G Backbone Core Switch (320+ Mbps NVR Input)"
    } else if (totalBandwidthMbps > 70) {
      switchTier = "Gigabit Uplink PoE Switch (160-200 Mbps NVR Input)"
    }

    // Codec comparison matrix
    const codecComparison = Object.entries(CODECS).map(([k, c]) => {
      const vBitrate = resMeta.baseMbps * fpsScale * c.factor * motionMeta.factor + audioMbps
      const dGb = ((vBitrate * 3600 * hoursPerDay) / (8 * 1000)) * cameras
      const rTb = (dGb * retentionDays * bufferFactor) / 1000.0
      const baselineTb = ((resMeta.baseMbps * fpsScale * 1.0 * motionMeta.factor + audioMbps) * 3600 * hoursPerDay * cameras * retentionDays * bufferFactor) / (8 * 1000 * 1000.0)
      const savedTb = Math.max(0, baselineTb - rTb)
      const savedPct = baselineTb > 0 ? (savedTb / baselineTb) * 100 : 0
      return {
        id: k,
        name: c.label,
        factor: c.factor,
        bitrateMbps: (vBitrate * cameras).toFixed(1),
        storageTb: rTb.toFixed(1),
        savedTb: savedTb.toFixed(1),
        savedPct: Math.round(savedPct),
        color: c.color,
      }
    })

    // Retention comparison timeline
    const timelineDays = [7, 14, 30, 45, 60, 90, 180, 365]
    const retentionTimeline = timelineDays.map((d) => {
      const tb = (dailyGbTotal * d * bufferFactor) / 1000.0
      return { days: d, tb: tb < 1 ? tb.toFixed(2) : tb.toFixed(1) }
    })

    return {
      singleCamMbps: singleCamMbps.toFixed(2),
      singleCamKbps,
      totalBandwidthMbps: totalBandwidthMbps.toFixed(1),
      dailyGbPerCam: dailyGbPerCam.toFixed(2),
      dailyGbTotal: dailyGbTotal.toFixed(1),
      rawStorageTb: rawStorageTb.toFixed(2),
      recommendedStorageTb: recommendedStorageTb.toFixed(2),
      recommendedStorageTib: recommendedStorageTib.toFixed(2),
      driveCount,
      driveSize,
      driveModel: `${driveCount} × ${driveSize}TB WD Purple / Seagate SkyHawk`,
      nvrChassis,
      switchTier,
      codecComparison,
      retentionTimeline,
    }
  }, [cameras, resolution, fps, codec, motion, hoursPerDay, retentionDays, audioEnabled, bufferPercent, raidMode])

  // Copy specifications to clipboard
  const handleCopySpec = () => {
    const text = `CCTV Surveillance Storage & Bandwidth Specification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Cameras: ${cameras} × ${RESOLUTIONS[resolution]?.label}
• Codec: ${CODECS[codec]?.label}
• Frame Rate: ${fps} FPS | Motion: ${MOTIONS[motion]?.label}
• Schedule: ${hoursPerDay} hrs/day | Retention: ${retentionDays} days
• Audio: ${audioEnabled ? "Enabled (64 kbps)" : "Disabled"}
• Safety Headroom Buffer: ${bufferPercent}%
• RAID Redundancy: ${RAID_MODES[raidMode]?.label}
────────────────────────────────────────
RESULTS:
• Recommended Storage: ${calculation.recommendedStorageTb} TB (${calculation.recommendedStorageTib} TiB)
• Total Network Bandwidth: ${calculation.totalBandwidthMbps} Mbps
• Daily Recording Ingestion: ${calculation.dailyGbTotal} GB / day (${calculation.dailyGbPerCam} GB/cam)
• Recommended Drives: ${calculation.driveModel}
• Recommended NVR Chassis: ${calculation.nvrChassis}
• Recommended Switch: ${calculation.switchTier}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Calculated at TryCalc.net (CCTV Surveillance Storage Engine)`

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      if (onToast) onToast("CCTV specification copied to clipboard!")
    }
  }

  // Reset to default
  const handleReset = () => {
    setCameras(8)
    setResolution("4mp")
    setFps(15)
    setCodec("h265_plus")
    setMotion("medium")
    setHoursPerDay(24)
    setRetentionDays(30)
    setAudioEnabled(true)
    setBufferPercent(20)
    setRaidMode("none")
    if (onToast) onToast("Reset inputs to default standard configuration.")
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", pb: 4 }}>
      {/* Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 3,
          borderRadius: 2,
          background: "linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)",
          border: "1px solid #e2e8f0",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between" }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 0.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  bgcolor: "#2563eb",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VideocamIcon fontSize="medium" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
                CCTV Storage & Bandwidth Calculator
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "#475569", maxWidth: 800 }}>
              Professional NVR/DVR storage and network throughput capacity planner. Implements official surveillance engineering formulas from <strong>Hikvision</strong>, <strong>Dahua</strong>, <strong>Western Digital Purple</strong>, and <strong>Seagate SkyHawk</strong>.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Copy technical specifications">
              <Button
                variant="outlined"
                size="small"
                onClick={handleCopySpec}
                startIcon={<ContentCopyIcon />}
                sx={{ textTransform: "none", borderColor: "#cbd5e1", color: "#334155", bgcolor: "#ffffff" }}
              >
                Copy Specs
              </Button>
            </Tooltip>
            <Tooltip title="Print technical report">
              <Button
                variant="outlined"
                size="small"
                onClick={() => typeof window !== "undefined" && window.print()}
                startIcon={<PrintIcon />}
                sx={{ textTransform: "none", borderColor: "#cbd5e1", color: "#334155", bgcolor: "#ffffff" }}
              >
                Print
              </Button>
            </Tooltip>
            <Tooltip title="Reset to defaults">
              <Button
                variant="text"
                size="small"
                onClick={handleReset}
                startIcon={<RestartAltIcon />}
                sx={{ textTransform: "none", color: "#64748b" }}
              >
                Reset
              </Button>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Quick Presets */}
        <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px dashed #cbd5e1" }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, display: "block", mb: 1 }}>
            Quick Deployment Presets:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {PRESETS.map((p) => (
              <Chip
                key={p.name}
                label={`${p.icon} ${p.name}`}
                onClick={() => handleApplyPreset(p)}
                clickable
                sx={{
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  bgcolor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#1e293b",
                  "&:hover": { bgcolor: "#f1f5f9", borderColor: "#94a3b8" },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Paper>

      {/* Main Two-Column Layout */}
      <Grid container spacing={3}>
        {/* Left Column: Parameter Controls */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <SecurityIcon fontSize="small" sx={{ color: "#2563eb" }} />
              Camera Stream & Recording Parameters
            </Typography>

            <Stack spacing={3}>
              {/* Cameras Count */}
              <Box>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                    Number of Cameras
                  </Typography>
                  <TextField
                    size="small"
                    type="number"
                    value={cameras}
                    onChange={(e) => setCameras(Math.max(1, parseInt(e.target.value) || 1))}
                    slotProps={{ htmlInput: { min: 1, max: 256 } }}
                    sx={{ width: 90 }}
                  />
                </Stack>
                <Slider
                  value={cameras}
                  min={1}
                  max={64}
                  step={1}
                  onChange={(_, val) => setCameras(val as number)}
                  sx={{ color: "#2563eb" }}
                />
              </Box>

              {/* Resolution & FPS */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 7 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="res-label">Camera Resolution</InputLabel>
                    <Select
                      labelId="res-label"
                      label="Camera Resolution"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                    >
                      {Object.entries(RESOLUTIONS).map(([k, r]) => (
                        <MenuItem key={k} value={k}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 2 }}>
                            <span>{r.label}</span>
                            <Typography variant="caption" sx={{ color: "#64748b" }}>
                              {r.desc}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 5 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="fps-label">Frame Rate (FPS)</InputLabel>
                    <Select
                      labelId="fps-label"
                      label="Frame Rate (FPS)"
                      value={fps}
                      onChange={(e) => setFps(Number(e.target.value))}
                    >
                      {[5, 7.5, 10, 12, 15, 20, 25, 30].map((f) => (
                        <MenuItem key={f} value={f}>
                          {f} FPS {f === 15 ? "⭐ (Sweet Spot)" : ""}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Video Codec */}
              <Box>
                <FormControl fullWidth size="small">
                  <InputLabel id="codec-label">Video Compression Codec</InputLabel>
                  <Select
                    labelId="codec-label"
                    label="Video Compression Codec"
                    value={codec}
                    onChange={(e) => setCodec(e.target.value)}
                  >
                    {Object.entries(CODECS).map(([k, c]) => (
                      <MenuItem key={k} value={k}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 2 }}>
                          <span style={{ fontWeight: 600 }}>{c.label}</span>
                          <Chip size="small" label={c.savingsText} sx={{ bgcolor: `${c.color}15`, color: c.color, fontWeight: 600, fontSize: "0.75rem" }} />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="caption" sx={{ color: "#64748b", mt: 0.5, display: "block" }}>
                  💡 <strong>H.265+</strong> (Hikvision Smart Codec / Dahua Smart HEVC) saves up to 70% storage via dynamic I-frame intervals and background static macroblock filtering.
                </Typography>
              </Box>

              {/* Scene Motion & Complexity */}
              <FormControl fullWidth size="small">
                <InputLabel id="motion-label">Scene Motion & Activity Level</InputLabel>
                <Select
                  labelId="motion-label"
                  label="Scene Motion & Activity Level"
                  value={motion}
                  onChange={(e) => setMotion(e.target.value)}
                >
                  {Object.entries(MOTIONS).map(([k, m]) => (
                    <MenuItem key={k} value={k}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 2 }}>
                        <span>{m.label}</span>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          {m.desc}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Recording Schedule & Retention Days */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                        Recording Hours / Day
                      </Typography>
                      <TextField
                        size="small"
                        type="number"
                        value={hoursPerDay}
                        onChange={(e) => setHoursPerDay(Math.min(24, Math.max(1, parseInt(e.target.value) || 1)))}
                        slotProps={{ htmlInput: { min: 1, max: 24 } }}
                        sx={{ width: 75 }}
                      />
                    </Stack>
                    <Slider
                      value={hoursPerDay}
                      min={1}
                      max={24}
                      step={1}
                      onChange={(_, val) => setHoursPerDay(val as number)}
                      sx={{ color: "#0ea5e9" }}
                    />
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      {hoursPerDay === 24 ? "Continuous 24/7 recording" : `${hoursPerDay} hrs/day motion/scheduled`}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                        Retention Period (Days)
                      </Typography>
                      <TextField
                        size="small"
                        type="number"
                        value={retentionDays}
                        onChange={(e) => setRetentionDays(Math.max(1, parseInt(e.target.value) || 1))}
                        slotProps={{ htmlInput: { min: 1, max: 365 } }}
                        sx={{ width: 85 }}
                      />
                    </Stack>
                    <Slider
                      value={retentionDays}
                      min={7}
                      max={90}
                      step={1}
                      onChange={(_, val) => setRetentionDays(val as number)}
                      sx={{ color: "#0ea5e9" }}
                    />
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Storage days preserved before overwrite
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Audio & Buffer & RAID */}
              <Divider sx={{ my: 1 }} />

              <Grid container spacing={2} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={audioEnabled}
                        onChange={(e) => setAudioEnabled(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                          Audio Stream Recording
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          G.711 / AAC @ 64 kbps per camera
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155" }}>
                      Safety Buffer Headroom
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#2563eb" }}>
                      {bufferPercent}%
                    </Typography>
                  </Stack>
                  <Slider
                    value={bufferPercent}
                    min={0}
                    max={50}
                    step={5}
                    onChange={(_, val) => setBufferPercent(val as number)}
                    sx={{ color: "#64748b" }}
                  />
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Covers filesystem formatting overhead & VBR spikes
                  </Typography>
                </Grid>
              </Grid>

              {/* RAID Redundancy */}
              <Box>
                <FormControl fullWidth size="small">
                  <InputLabel id="raid-label">RAID Storage Redundancy Configuration</InputLabel>
                  <Select
                    labelId="raid-label"
                    label="RAID Storage Redundancy Configuration"
                    value={raidMode}
                    onChange={(e) => setRaidMode(e.target.value)}
                  >
                    {Object.entries(RAID_MODES).map(([k, r]) => (
                      <MenuItem key={k} value={k}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 2 }}>
                          <span style={{ fontWeight: 600 }}>{r.label}</span>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>
                            {r.desc}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column: Real-Time Results Dashboard */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={2.5}>
            {/* Primary Capacity Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "2px solid #2563eb",
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box sx={{ position: "absolute", right: -15, bottom: -15, opacity: 0.12, color: "#1e40af" }}>
                <StorageIcon sx={{ fontSize: 130 }} />
              </Box>

              <Typography variant="overline" sx={{ fontWeight: 700, color: "#1e40af", letterSpacing: 1 }}>
                Recommended Storage Capacity
              </Typography>

              <Stack direction="row" spacing={1} sx={{ alignItems: "baseline", mt: 0.5, mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  {calculation.recommendedStorageTb}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#2563eb" }}>
                  TB
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", ml: 1 }}>
                  ({calculation.recommendedStorageTib} TiB binary)
                </Typography>
              </Stack>

              <Typography variant="body2" sx={{ color: "#334155", mb: 2 }}>
                Includes <strong>{bufferPercent}% safety buffer</strong> (raw requirement: {calculation.rawStorageTb} TB) for {retentionDays} days retention across {cameras} cameras.
              </Typography>

              <Divider sx={{ borderColor: "#bfdbfe", my: 1.5 }} />

              {/* Hardware Recommendation */}
              <Box sx={{ bgcolor: "#ffffff", p: 1.75, borderRadius: 1.5, border: "1px solid #bfdbfe" }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e40af", textTransform: "uppercase", letterSpacing: 0.5, display: "block" }}>
                  Recommended Surveillance Hard Drive Config:
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", mt: 0.25 }}>
                  💾 {calculation.driveModel}
                </Typography>
                <Typography variant="caption" sx={{ color: "#475569", display: "block" }}>
                  NVR Form Factor: <strong>{calculation.nvrChassis}</strong>
                </Typography>
              </Box>
            </Paper>

            {/* Inbound Bandwidth & Daily Ingestion Cards */}
            <Grid container spacing={2}>
              {/* Network Bandwidth */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.25,
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                    bgcolor: "#ffffff",
                    height: "100%",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                    <SpeedIcon fontSize="small" sx={{ color: "#0ea5e9" }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Network Bandwidth
                    </Typography>
                  </Stack>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {calculation.totalBandwidthMbps} <span style={{ fontSize: "1rem", fontWeight: 600, color: "#64748b" }}>Mbps</span>
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 0.5 }}>
                    Single cam: {calculation.singleCamMbps} Mbps ({calculation.singleCamKbps} kbps)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (parseFloat(calculation.totalBandwidthMbps) / 160) * 100)}
                    sx={{
                      mt: 1.5,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "#f1f5f9",
                      "& .MuiLinearProgress-bar": { bgcolor: parseFloat(calculation.totalBandwidthMbps) > 160 ? "#ef4444" : "#0ea5e9" },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: "#64748b", mt: 0.5, display: "block" }}>
                    {calculation.switchTier}
                  </Typography>
                </Paper>
              </Grid>

              {/* Daily Ingestion */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.25,
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                    bgcolor: "#ffffff",
                    height: "100%",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                    <DnsIcon fontSize="small" sx={{ color: "#10b981" }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Daily Ingestion
                    </Typography>
                  </Stack>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {calculation.dailyGbTotal} <span style={{ fontSize: "1rem", fontWeight: 600, color: "#64748b" }}>GB / day</span>
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 0.5 }}>
                    Per camera: {calculation.dailyGbPerCam} GB / day
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 600, display: "block", mt: 1.5 }}>
                    ✓ {(parseFloat(calculation.dailyGbTotal) / 1000).toFixed(2)} TB written per day
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>

      {/* Deep Analysis Tabs */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            borderBottom: "1px solid #e2e8f0",
            mb: 3,
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.9375rem" },
          }}
        >
          <Tab icon={<SavingsIcon />} iconPosition="start" label="Codec Savings Comparison" />
          <Tab icon={<StorageIcon />} iconPosition="start" label="Retention Timeline" />
          <Tab icon={<MemoryIcon />} iconPosition="start" label="Hardware & Drive Guide" />
          <Tab icon={<InfoOutlinedIcon />} iconPosition="start" label="Engineering Formulas" />
        </Tabs>

        {/* Tab 0: Codec Comparison */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
              Storage Requirements by Video Compression Codec
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569", mb: 2 }}>
              Comparing storage needed for {cameras} × {RESOLUTIONS[resolution]?.label} cameras over {retentionDays} days:
            </Typography>

            <TableContainer sx={{ border: "1px solid #e2e8f0", borderRadius: 1.5 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "#334155" }}>Compression Codec</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#334155" }}>Bandwidth (Mbps)</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#334155" }}>Storage Required</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#334155" }}>Storage Saved vs H.264</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#334155" }}>Efficiency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calculation.codecComparison.map((row) => (
                    <TableRow key={row.id} sx={{ bgcolor: row.id === codec ? "#f0fdf4" : "inherit" }}>
                      <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                        {row.name} {row.id === codec && <Chip size="small" label="Active" color="success" sx={{ ml: 1, height: 20, fontSize: "0.7rem" }} />}
                      </TableCell>
                      <TableCell>{row.bitrateMbps} Mbps</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{row.storageTb} TB</TableCell>
                      <TableCell sx={{ color: row.savedPct > 0 ? "#10b981" : "#64748b", fontWeight: 600 }}>
                        {row.savedPct > 0 ? `Saved ${row.savedTb} TB (-${row.savedPct}%)` : "— Baseline"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={`${Math.round((1 / row.factor) * 100)}% Relative`}
                          sx={{ bgcolor: `${row.color}15`, color: row.color, fontWeight: 600, height: 22 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Tab 1: Retention Timeline */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
              Storage Capacity Retention Matrix
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569", mb: 2 }}>
              Projected hard drive storage needed across standard surveillance archive periods:
            </Typography>

            <Grid container spacing={2}>
              {calculation.retentionTimeline.map((item) => (
                <Grid size={{ xs: 6, sm: 3 }} key={item.days}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 1.5,
                      border: item.days === retentionDays ? "2px solid #2563eb" : "1px solid #e2e8f0",
                      bgcolor: item.days === retentionDays ? "#eff6ff" : "#f8fafc",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
                      {item.days} Days
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", my: 0.5 }}>
                      {item.tb} <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>TB</span>
                    </Typography>
                    {item.days === retentionDays && (
                      <Chip size="small" label="Selected" sx={{ bgcolor: "#2563eb", color: "#ffffff", height: 18, fontSize: "0.65rem", fontWeight: 700 }} />
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Tab 2: Hardware & Drive Guide */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
              Surveillance HDD vs Desktop HDD Requirements
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569", mb: 2 }}>
              Standard desktop hard drives (WD Blue, Seagate BarraCuda) are built for 8x5 intermittent reads/writes and will fail prematurely in NVR/DVR continuous write workloads.
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 2, border: "1px solid #bbf7d0", bgcolor: "#f0fdf4", borderRadius: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#166534", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon fontSize="small" /> Recommended: Surveillance-Class Drives
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1e293b", fontSize: "0.875rem" }}>
                    • <strong>Western Digital Purple / Purple Pro</strong> or <strong>Seagate SkyHawk / SkyHawk AI</strong>
                    <br />• 24/7 continuous write workload rating (180 TB/year to 550 TB/year)
                    <br />• AllFrame™ / ImagePerfect™ firmware to prevent dropped video frames
                    <br />• Rotational Vibration (RV) sensors for multi-bay NVR chassis
                    <br />• MTBF rating of 1,000,000+ hours with 3 to 5-year warranty
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 2, border: "1px solid #fed7aa", bgcolor: "#fff7ed", borderRadius: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#9a3412", mb: 1 }}>
                    ⚠️ Avoid Desktop / PC Drives in NVRs
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1e293b", fontSize: "0.875rem" }}>
                    • Desktop drives are designed for 8 hours/day and 55 TB/year workload.
                    <br />• Lack vibration dampening for multi-drive chassis (causes head thrashing).
                    <br />• Enforce strict error recovery that freezes video streams during bad sector rewrites.
                    <br />• Typically fail within 6 to 12 months under 24/7 continuous camera recording.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 3: Engineering Formulas */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
              Official Surveillance Engineering Formulas
            </Typography>

            <Stack spacing={2} sx={{ fontSize: "0.875rem", color: "#334155" }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                  1. Camera Bitrate Formula:
                </Typography>
                <code style={{ background: "#e2e8f0", padding: "4px 8px", borderRadius: 4, display: "block", fontFamily: "monospace" }}>
                  Bitrate (Mbps) = [BaseBitrate(Res) × CodecFactor × (FPS / 15)^0.75 × MotionFactor] + AudioStream(0.064)
                </code>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                  2. Daily Ingestion Storage (Decimal HDD Standard):
                </Typography>
                <code style={{ background: "#e2e8f0", padding: "4px 8px", borderRadius: 4, display: "block", fontFamily: "monospace" }}>
                  Daily Storage (GB/day) = [Total Bitrate (Mbps) × 3,600 sec × Hours/day] ÷ (8 bits/byte × 1,000 MB/GB)
                </code>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                  3. Total Hard Drive Capacity with Safety Buffer:
                </Typography>
                <code style={{ background: "#e2e8f0", padding: "4px 8px", borderRadius: 4, display: "block", fontFamily: "monospace" }}>
                  Recommended Storage (TB) = [Daily Storage (GB) × Retention Days ÷ 1,000] × (1 + Buffer Margin %)
                </code>
              </Paper>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
