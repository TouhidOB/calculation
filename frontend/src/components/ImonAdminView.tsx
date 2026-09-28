"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Chip from "@mui/material/Chip"
import Alert from "@mui/material/Alert"
import LinearProgress from "@mui/material/LinearProgress"
import CircularProgress from "@mui/material/CircularProgress"

// Icons
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import PublicIcon from "@mui/icons-material/Public"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import TodayIcon from "@mui/icons-material/Today"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import LogoutIcon from "@mui/icons-material/Logout"
import RefreshIcon from "@mui/icons-material/Refresh"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"

// Dynamic import for 3D Three.js Globe (avoids SSR window errors)
const ThreeGlobeView = dynamic(() => import("@/components/ThreeGlobeView"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 440,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
      }}
    >
      <CircularProgress size={36} sx={{ color: "#3b82f6", mr: 2 }} />
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        Initializing 3D Interactive WebGL Globe...
      </Typography>
    </Box>
  ),
})

interface StatsResponse {
  liveActiveUsers: number
  todayVisits: number
  monthVisits: number
  yearVisits: number
  lifetimeVisits: number
  avgDwellSeconds: number
  topCountries: { code: string; name: string; count: number; percentage: number }[]
  topPages: { path: string; views: number; avgDwellSeconds: number }[]
  recentActivity: {
    ip: string
    countryCode: string
    countryName: string
    city: string
    path: string
    durationSeconds: number
    timestamp: number
  }[]
  lastUpdated: number
}

export default function ImonAdminView() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [autoRefresh] = useState(true)

  // 1. Initial check for existing authenticated session
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/imon/stats")
      if (res.ok) {
        const data = await res.json()
        if (data.ok && data.stats) {
          setStats(data.stats)
          setIsAuthenticated(true)
          setAuthError("")
        } else {
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }
    } catch {
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  // Auto-refresh stats every 8 seconds
  useEffect(() => {
    if (!isAuthenticated || !autoRefresh) return
    const interval = setInterval(() => {
      fetchStats()
    }, 8000)
    return () => clearInterval(interval)
  }, [isAuthenticated, autoRefresh])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAuthError("")
    try {
      const res = await fetch("/api/imon/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setIsAuthenticated(true)
        fetchStats()
      } else {
        setAuthError(data.error || "Invalid Credentials")
      }
    } catch {
      setAuthError("Network connection error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/imon/auth", { method: "DELETE" })
    } catch {}
    setIsAuthenticated(false)
    setStats(null)
  }

  // Format dwell time
  const formatDwellTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const rem = seconds % 60
    return `${mins}m ${rem}s`
  }

  // Loading Screen
  if (isAuthenticated === null) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#0f172a",
        }}
      >
        <CircularProgress size={42} sx={{ color: "#38bdf8" }} />
      </Box>
    )
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#090d16",
          backgroundImage: "radial-gradient(ellipse at top, #1e293b 0%, #090d16 100%)",
          p: 2,
        }}
      >
        <Paper
          elevation={12}
          sx={{
            maxWidth: 420,
            width: "100%",
            p: { xs: 3.5, sm: 4.5 },
            borderRadius: 3.5,
            bgcolor: "#0f172a",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "rgba(56, 189, 248, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#38bdf8",
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 30 }} />
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.5px" }}>
                TryCalc Command Center
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
                Enter credentials to access live traffic telemetry
              </Typography>
            </Box>

            {authError && (
              <Alert severity="error" sx={{ width: "100%", bgcolor: "rgba(239, 68, 68, 0.15)", color: "#fca5a5" }}>
                {authError}
              </Alert>
            )}

            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="User ID"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  slotProps={{
                    inputLabel: { sx: { color: "#94a3b8" } },
                    input: {
                      sx: {
                        color: "#f8fafc",
                        bgcolor: "#1e293b",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#38bdf8" },
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  slotProps={{
                    inputLabel: { sx: { color: "#94a3b8" } },
                    input: {
                      sx: {
                        color: "#f8fafc",
                        bgcolor: "#1e293b",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#38bdf8" },
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  size="large"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: "#0284c7",
                    color: "#ffffff",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: 16,
                    "&:hover": { bgcolor: "#0369a1" },
                  }}
                >
                  {isSubmitting ? "Authenticating..." : "Unlock Dashboard"}
                </Button>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Box>
    )
  }

  // Authenticated 3D Live Analytics Dashboard
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#070b14",
        color: "#f8fafc",
        pb: 8,
      }}
    >
      {/* Top HUD Navigation Bar */}
      <Box
        sx={{
          borderBottom: "1px solid #1e293b",
          bgcolor: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          py: 1.5,
          px: { xs: 2, md: 4 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: "-0.5px", color: "#38bdf8" }}>
              TRYCALC<span style={{ color: "#f8fafc" }}> / IMON TELEMETRY</span>
            </Typography>
            <Chip
              icon={<FiberManualRecordIcon sx={{ fontSize: 10, color: "#10b981 !important" }} />}
              label="ENGINE LIVE"
              size="small"
              sx={{
                bgcolor: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                fontWeight: 800,
                fontSize: 11,
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={fetchStats}
              startIcon={<RefreshIcon />}
              sx={{
                color: "#94a3b8",
                borderColor: "#334155",
                textTransform: "none",
                "&:hover": { borderColor: "#38bdf8", color: "#38bdf8" },
              }}
            >
              Sync Now
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                bgcolor: "rgba(239, 68, 68, 0.2)",
                color: "#f87171",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { bgcolor: "rgba(239, 68, 68, 0.35)" },
              }}
            >
              Sign Out
            </Button>
          </Box>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Metric Cards Banner */}
        <Grid container spacing={2.5}>
          {/* 1. Live Active Users */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "#0f172a",
                borderRadius: 3,
                border: "1px solid #1e293b",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  bgcolor: "#10b981",
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                  Live Active
                </Typography>
                <PeopleAltIcon sx={{ color: "#10b981", fontSize: 20 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#f8fafc", mt: 1 }}>
                {stats?.liveActiveUsers ?? 1}
              </Typography>
              <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 600 }}>
                ● Real-time pulse
              </Typography>
            </Paper>
          </Grid>

          {/* 2. Today's Visits */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "#0f172a",
                borderRadius: 3,
                border: "1px solid #1e293b",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  bgcolor: "#38bdf8",
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                  Today
                </Typography>
                <TodayIcon sx={{ color: "#38bdf8", fontSize: 20 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#f8fafc", mt: 1 }}>
                {stats?.todayVisits.toLocaleString() ?? "850"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                Last 24 hours
              </Typography>
            </Paper>
          </Grid>

          {/* 3. Monthly Visits */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "#0f172a",
                borderRadius: 3,
                border: "1px solid #1e293b",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  bgcolor: "#818cf8",
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                  This Month
                </Typography>
                <CalendarMonthIcon sx={{ color: "#818cf8", fontSize: 20 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#f8fafc", mt: 1 }}>
                {stats?.monthVisits.toLocaleString() ?? "5,950"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                September 2026
              </Typography>
            </Paper>
          </Grid>

          {/* 4. Yearly Visits */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "#0f172a",
                borderRadius: 3,
                border: "1px solid #1e293b",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  bgcolor: "#c084fc",
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                  Year 2026
                </Typography>
                <TrendingUpIcon sx={{ color: "#c084fc", fontSize: 20 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#f8fafc", mt: 1 }}>
                {stats?.yearVisits.toLocaleString() ?? "5,950"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                Annual cumulative
              </Typography>
            </Paper>
          </Grid>

          {/* 5. Lifetime Traffic */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "#0f172a",
                borderRadius: 3,
                border: "1px solid #1e293b",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  bgcolor: "#f59e0b",
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                  Lifetime
                </Typography>
                <PublicIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#f8fafc", mt: 1 }}>
                {stats?.lifetimeVisits.toLocaleString() ?? "5,950"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                All-time verified hits
              </Typography>
            </Paper>
          </Grid>

          {/* 6. Avg Dwell Time */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "#0f172a",
                borderRadius: 3,
                border: "1px solid #1e293b",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  bgcolor: "#34d399",
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                  Avg Dwell Time
                </Typography>
                <AccessTimeIcon sx={{ color: "#34d399", fontSize: 20 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#f8fafc", mt: 1 }}>
                {stats ? formatDwellTime(stats.avgDwellSeconds) : "1m 24s"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#34d399", fontWeight: 600 }}>
                Dwell engagement
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* 3D Interactive WebGL Globe & Geographic Breakdown */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Left: 3D Globe */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "#0f172a",
                borderRadius: 3.5,
                border: "1px solid #1e293b",
                height: "100%",
                minHeight: 520,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc" }}>
                    3D Global Traffic Telemetry
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Live spherical projection showing user origin beacons (Click &amp; Drag to rotate)
                  </Typography>
                </Box>
                <Chip
                  label="WebGL 3D Accelerated"
                  size="small"
                  sx={{ bgcolor: "#1e293b", color: "#38bdf8", fontWeight: 700 }}
                />
              </Box>

              <Box sx={{ flex: 1, position: "relative", minHeight: 440 }}>
                {stats && <ThreeGlobeView topCountries={stats.topCountries} />}
              </Box>
            </Paper>
          </Grid>

          {/* Right: Country Ranking Table */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "#0f172a",
                borderRadius: 3.5,
                border: "1px solid #1e293b",
                height: "100%",
                minHeight: 520,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc", mb: 0.5 }}>
                Top Countries of Origin
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2.5 }}>
                Geographic distribution of global user requests
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ "& th": { color: "#64748b", fontWeight: 700, borderColor: "#1e293b" } }}>
                      <TableCell>COUNTRY</TableCell>
                      <TableCell align="right">VISITORS</TableCell>
                      <TableCell align="right">SHARE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(stats?.topCountries || []).map((c) => (
                      <TableRow key={c.code} sx={{ "& td": { color: "#f8fafc", borderColor: "#1e293b" } }}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 26,
                                height: 18,
                                borderRadius: 0.5,
                                bgcolor: "#1e293b",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                fontWeight: 800,
                                color: "#38bdf8",
                              }}
                            >
                              {c.code}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {c.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          {c.count.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
                            <Box sx={{ width: 60 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(c.percentage * 2, 100)}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: "#1e293b",
                                  "& .MuiLinearProgress-bar": { bgcolor: "#38bdf8" },
                                }}
                              />
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: "#94a3b8", minWidth: 35 }}>
                              {c.percentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Most Visited Pages & Real-time Live Stream */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Left: Top Pages & Duration */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "#0f172a",
                borderRadius: 3.5,
                border: "1px solid #1e293b",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc", mb: 0.5 }}>
                Most Visited Calculator Pages
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2 }}>
                Tool engagement rank and average dwell time per session
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ "& th": { color: "#64748b", fontWeight: 700, borderColor: "#1e293b" } }}>
                      <TableCell>CALCULATOR PATH</TableCell>
                      <TableCell align="right">TOTAL VIEWS</TableCell>
                      <TableCell align="right">AVG TIME</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(stats?.topPages || []).map((p) => (
                      <TableRow key={p.path} sx={{ "& td": { color: "#f8fafc", borderColor: "#1e293b" } }}>
                        <TableCell sx={{ fontFamily: "monospace", fontSize: 13, color: "#38bdf8" }}>
                          {p.path}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          {p.views.toLocaleString()}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: "#34d399" }}>
                          {formatDwellTime(p.avgDwellSeconds)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Right: Live Real-Time Feed */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "#0f172a",
                borderRadius: 3.5,
                border: "1px solid #1e293b",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc" }}>
                    Live Activity Pulse
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Real-time stream of incoming visitors &amp; page navigation
                  </Typography>
                </Box>
                <Chip
                  icon={<FiberManualRecordIcon sx={{ fontSize: 10, color: "#10b981 !important" }} />}
                  label="Stream Active"
                  size="small"
                  sx={{ bgcolor: "#1e293b", color: "#10b981", fontWeight: 700 }}
                />
              </Box>

              <TableContainer sx={{ maxHeight: 380 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ "& th": { color: "#64748b", fontWeight: 700, borderColor: "#1e293b" } }}>
                      <TableCell>ORIGIN</TableCell>
                      <TableCell>VISITED PAGE</TableCell>
                      <TableCell align="right">TIME SPENT</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(stats?.recentActivity || []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ color: "#64748b", py: 4 }}>
                          Waiting for live incoming visitor pulse...
                        </TableCell>
                      </TableRow>
                    ) : (
                      (stats?.recentActivity || []).map((act, idx) => (
                        <TableRow key={idx} sx={{ "& td": { color: "#f8fafc", borderColor: "#1e293b" } }}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Chip
                                label={act.countryCode}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: 10,
                                  fontWeight: 800,
                                  bgcolor: "#1e293b",
                                  color: "#38bdf8",
                                }}
                              />
                              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                {act.countryName} {act.city ? `(${act.city})` : ""}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontFamily: "monospace", fontSize: 12, color: "#e2e8f0" }}>
                            {act.path}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, color: "#34d399", fontSize: 12 }}>
                            {act.durationSeconds > 0 ? `${act.durationSeconds}s` : "Entering"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
