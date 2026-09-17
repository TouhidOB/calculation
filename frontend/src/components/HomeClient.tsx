"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { listCalculators, runCalculator, type CategoryMap, type CalculatorDef, CATEGORY_META } from "@/lib/calculator-api"
import { getCalcIcon } from "@/lib/calc-icons"
import JsExecutor from "@/components/JsExecutor"
import ModernDatePicker from "@/components/ModernDatePicker"
import GlobalFooter from "@/components/GlobalFooter"
import { getIconComponent } from "@/lib/icon-registry"
import DOMPurify from "dompurify"

// MUI components
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Divider from "@mui/material/Divider"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import InputAdornment from "@mui/material/InputAdornment"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Alert from "@mui/material/Alert"
import Badge from "@mui/material/Badge"
import Stack from "@mui/material/Stack"
import Snackbar from "@mui/material/Snackbar"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"

// Icons
import CalculatorLogoIcon from "@/components/CalculatorLogoIcon"
import MenuIcon from "@mui/icons-material/Menu"
import CalculateIcon from "@mui/icons-material/Calculate"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SearchIcon from "@mui/icons-material/Search"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ConstructionIcon from "@mui/icons-material/Construction"
import CheckroomIcon from "@mui/icons-material/Checkroom"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import FunctionsIcon from "@mui/icons-material/Functions"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import HomeIcon from "@mui/icons-material/Home"
import ScheduleIcon from "@mui/icons-material/Schedule"
import SchoolIcon from "@mui/icons-material/School"
import HomeWorkIcon from "@mui/icons-material/HomeWork"
import CelebrationIcon from "@mui/icons-material/Celebration"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import SpeedIcon from "@mui/icons-material/Speed"
import BackspaceIcon from "@mui/icons-material/Backspace"
import FlashOnIcon from "@mui/icons-material/FlashOn"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"

const DRAWER_WIDTH = 270

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  finance: <AttachMoneyIcon />,
  business_investment: <TrendingUpIcon />,
  health: <FavoriteIcon />,
  construction: <ConstructionIcon />,
  basic: <FunctionsIcon />,
  garments: <CheckroomIcon />,
  conversion: <SwapHorizIcon />,
  date_time: <ScheduleIcon />,
  education: <SchoolIcon />,
  real_estate: <HomeWorkIcon />,
  event_budget: <CelebrationIcon />,
}

/* ---------- SEO helper: humanized how-to + FAQ per calculator ---------- */

export function seoTitleFor(calc: CalculatorDef): string {
  const cat = CATEGORY_META[calc.category]?.label || calc.category
  return `${calc.name} — Free Online ${cat.replace(" Calculators", " Calculator")} | TryCalc`
}

function seoIntroFor(calc: CalculatorDef): string {
  const fname = calc.name.toLowerCase()
  const fieldList = calc.fields.slice(0, 4).map(f => f.label.toLowerCase()).join(", ")

  const intros: Record<string, string> = {
    finance: `Use this free online ${fname} to get instant, accurate results for your financial planning. Enter ${fieldList} and get detailed breakdowns with charts-ready numbers — ideal for loans, savings, investments, and budgeting decisions.`,
    health: `Calculate your ${fname.replace(" calculator", "")} results instantly with this free online health tool. Enter ${fieldList} for a personalized health assessment used by fitness enthusiasts and healthcare screening.`,
    construction: `Estimate materials, costs, and quantities with this free online ${fname}. Enter ${fieldList} to plan your construction project accurately — concrete, paint, tiles, gravel, and more.`,
    conversion: `Convert instantly with this free online ${fname}. Enter your value in ${fieldList} and get precise conversions — length, weight, temperature, area, volume, data, and currency units.`,
    date_time: `Find exact dates and durations with this free online ${fname}. Enter ${fieldList} to calculate ages, date differences, working days, and countdowns in seconds.`,
    real_estate: `Plan property decisions with this free online ${fname}. Enter ${fieldList} to estimate mortgage payments, affordability, rental yield, and closing costs.`,
    basic: `Solve everyday math instantly with this free online ${fname}. Enter ${fieldList} for percentage, discount, tip, and ratio results you can trust.`,
    education: `Compute grades and academic scores with this free online ${fname}. Enter ${fieldList} to get GPA, percentages, test scores, and grade point averages.`,
    math: `Solve math problems step-by-step with this free online ${fname}. Enter ${fieldList} for fractions, statistics, algebra, and geometry answers.`,
    garments: `Calculate textile and apparel metrics with this free online ${fname}. Enter ${fieldList} for fabric consumption, costing, and production planning.`,
    event_budget: `Budget your events perfectly with this free online ${fname}. Enter ${fieldList} to estimate costs, split expenses, and track spending.`,
    business_investment: `Project returns and business metrics with this free online ${fname}. Enter ${fieldList} for ROI, growth, margin, and investment analysis.`,
  }
  return intros[calc.category] || `Calculate ${fname} with this free online tool. Accurate, instant results with clear explanations.`
}

export function seoHowToFor(calc: CalculatorDef): string[] {
  const steps: string[] = []
  if (calc.fields.length > 0) {
    const names = calc.fields.slice(0, 3).map(f => `"${f.label}"`).join(", ")
    steps.push(`Enter your inputs in the form fields: ${names}${calc.fields.length > 3 ? " and any additional parameters." : "."}`)
  } else {
    steps.push("Review the default parameters or adjust the inputs to match your scenario.")
  }
  steps.push('Click the "Calculate" button to process your values.')
  steps.push("Review your instant result with full breakdowns and units displayed in the result panel.")
  steps.push("Adjust inputs and recalculate as needed — all calculations are 100% free and run instantly without signup.")
  return steps
}

export function seoFaqFor(calc: CalculatorDef): Array<{ q: string; a: string }> {
  const cat = CATEGORY_META[calc.category]?.label || "online"
  return [
    {
      q: `Is the ${calc.name} completely free to use?`,
      a: `Yes, 100% free with unlimited calculations. There is no signup, credit card, or download required.`,
    },
    {
      q: `How accurate is this ${calc.name}?`,
      a: `The calculator uses standard mathematical and industry formulas to provide exact, high-precision results. Always review the inputs for your specific use case.`,
    },
    {
      q: `Can I use this ${calc.name} on my phone or tablet?`,
      a: `Yes! TryCalc is fully responsive and optimized for mobile phones, tablets, laptops, and desktop computers.`,
    },
    {
      q: `Where can I find more ${cat}?`,
      a: `Browse our sidebar menu or the related calculators section below to discover hundreds of specialized free tools.`,
    },
  ]
}

/* ---------- Quick Basic Calculator Widget ---------- */

const BASIC_KEYS = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "=", "+",
]

function BasicCalculator() {
  const [display, setDisplay] = useState("0")
  const [expr, setExpr] = useState("")

  const press = (k: string) => {
    if (k === "=") {
      try {
        const clean = (expr + display).replace(/[^0-9+\-*/.]/g, "")
        if (!clean) return
        const fn = new Function(`return (${clean})`)
        const res = fn()
        const out = Number.isFinite(res) ? String(+res.toFixed(8)) : "Error"
        setDisplay(out)
        setExpr("")
      } catch {
        setDisplay("Error")
        setExpr("")
      }
      return
    }

    if (["+", "-", "*", "/"].includes(k)) {
      setExpr((prev) => (prev ? `${prev} ${display} ${k}` : `${display} ${k}`))
      setDisplay("0")
      return
    }

    if (k === ".") {
      if (!display.includes(".")) setDisplay((prev) => prev + ".")
      return
    }

    setDisplay((prev) => (prev === "0" || prev === "Error" ? k : prev + k))
  }

  const clearAll = () => {
    setDisplay("0")
    setExpr("")
  }

  const backspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"))
  }

  return (
    <Paper
      elevation={0}
      component="section"
      aria-label="Quick online calculator"
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
        <CalculateIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
          Quick Calculator
        </Typography>
        <Chip label="Free" size="small" color="primary" variant="outlined" sx={{ ml: "auto", fontWeight: 600 }} />
      </Stack>

      {/* Display */}
      <Box
        sx={{
          bgcolor: "#f8fafc",
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          px: 2,
          py: 1,
          mb: 2,
          textAlign: "right",
          minHeight: 72,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace", minHeight: 16 }}>
          {expr ? `${expr.replace(/\*/g, "×").replace(/\//g, "÷")}…` : "\u00A0"}
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontFamily: "monospace", fontWeight: 700, color: "#0f172a", wordBreak: "break-all", lineHeight: 1.2 }}
        >
          {display.replace(/\*/g, "×").replace(/\//g, "÷")}
        </Typography>
      </Box>

      {/* Keys */}
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }}>
          <Stack direction="row" spacing={1}>
            <Button
              onClick={clearAll}
              variant="contained"
              color="error"
              sx={{ flexGrow: 1, borderRadius: 2.5, py: 1.2, fontWeight: 700 }}
            >
              C
            </Button>
            <Button
              onClick={backspace}
              variant="outlined"
              sx={{ flexGrow: 1, borderRadius: 2.5, py: 1.2, color: "#475569", borderColor: "#cbd5e1" }}
              aria-label="backspace"
            >
              <BackspaceIcon />
            </Button>
            <Button
              onClick={() => press("(")}
              variant="outlined"
              sx={{ flexGrow: 1, borderRadius: 2.5, py: 1.2, fontWeight: 700, color: "#475569", borderColor: "#cbd5e1" }}
            >
              (
            </Button>
            <Button
              onClick={() => press(")")}
              variant="outlined"
              sx={{ flexGrow: 1, borderRadius: 2.5, py: 1.2, fontWeight: 700, color: "#475569", borderColor: "#cbd5e1" }}
            >
              )
            </Button>
          </Stack>
        </Grid>
        {BASIC_KEYS.map((k) => (
          <Grid key={k} size={{ xs: 3, sm: 3 }}>
            <Button
              fullWidth
              variant={k === "=" ? "contained" : /[+\-*/]/.test(k) ? "outlined" : "text"}
              color={k === "=" ? "primary" : /[+\-*/]/.test(k) ? "secondary" : "inherit"}
              onClick={() => press(k)}
              sx={{
                aspectRatio: "1.7",
                minWidth: 0,
                p: 0,
                fontSize: "1.15rem",
                fontWeight: 700,
                borderRadius: 2.5,
                bgcolor: /[0-9.]/.test(k) ? "#f8fafc" : undefined,
                color: /[0-9.]/.test(k) ? "#0f172a" : undefined,
                border: /[0-9.]/.test(k) ? "1px solid #e2e8f0" : undefined,
                transition: "transform 0.08s ease, background-color 0.15s ease",
                "&:hover": {
                  bgcolor: /[0-9.]/.test(k) ? "#f1f5f9" : undefined,
                },
                "&:active": { transform: "scale(0.94)" },
              }}
            >
              {k === "*" ? "×" : k === "/" ? "÷" : k}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, textAlign: "center", fontWeight: 500 }}>
        Addition · Subtraction · Multiplication · Division — instant results
      </Typography>
    </Paper>
  )
}

export interface HomeClientProps {
  initialCategories?: CategoryMap
  initialTotal?: number
}

export default function HomeClient({ initialCategories, initialTotal }: HomeClientProps = {}) {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [categories, setCategories] = useState<CategoryMap>(initialCategories || {})
  const [total, setTotal] = useState(
    initialTotal ||
      (initialCategories
        ? Object.values(initialCategories).reduce((s, a) => s + a.length, 0)
        : 0)
  )
  const [activeCat, setActiveCat] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      return params.get("cat") || params.get("category") || null
    }
    return null
  })
  const [search, setSearch] = useState("")
  const [selectedCalc, setSelectedCalc] = useState<CalculatorDef | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [allFiltered, setAllFiltered] = useState(false)

  // Sync category param from URL on popstate
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      setActiveCat(params.get("cat") || params.get("category") || null)
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    if (initialCategories && Object.keys(initialCategories).length > 0) return
    listCalculators()
      .then((data) => {
        setCategories(data.categories)
        setTotal(data.total)
      })
      .catch((e) => {
        console.error("Failed to load calculators:", e)
      })
  }, [initialCategories])

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  const selectCategory = (cat: string | null) => {
    setActiveCat(cat)
    setSelectedCalc(null)
    setAllFiltered(false)
    if (isMobile) setMobileOpen(false)
  }

  const openCalculator = (calc: CalculatorDef) => {
    setSelectedCalc(calc)
    if (isMobile) setMobileOpen(false)
  }

  // Filtered calculators
  const displayCalcs = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) {
      if (activeCat && categories[activeCat]) return categories[activeCat]
      return []
    }
    const pool =
      allFiltered || !activeCat
        ? Object.values(categories).flat()
        : categories[activeCat] || []

    return pool.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    )
  }, [categories, activeCat, search, allFiltered])

  // Drawer Content
  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#ffffff" }}>
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
            color: "#ffffff",
            boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)",
          }}
        >
          <CalculatorLogoIcon size={24} color="#ffffff" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>
            TryCalc
          </Typography>
          <Typography variant="caption" sx={{ color: "#475569", fontWeight: 600 }}>
            {total} Free Calculators
          </Typography>
        </Box>
      </Box>

      {/* Categories List */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1, overflowY: "auto" }}>
        <ListItemButton
          selected={activeCat === null && !selectedCalc}
          onClick={() => selectCategory(null)}
          sx={{
            borderRadius: 2.5,
            mb: 0.5,
            fontWeight: 600,
            color: activeCat === null ? "#4f46e5" : "#334155",
            bgcolor: activeCat === null ? "rgba(79, 70, 229, 0.08)" : "transparent",
            "&:hover": { bgcolor: "rgba(79, 70, 229, 0.04)" },
          }}
        >
          <ListItemIcon sx={{ color: activeCat === null ? "#4f46e5" : "#64748b", minWidth: 38 }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary="Home & Popular"
            slotProps={{
              primary: { sx: { fontWeight: activeCat === null ? 700 : 500, fontSize: 14 } },
            }}
          />
        </ListItemButton>

        <Divider sx={{ my: 1.5, borderColor: "#e2e8f0" }} />

        <Typography
          variant="caption"
          sx={{ px: 1.5, pb: 1, display: "block", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Categories
        </Typography>

        {Object.entries(CATEGORY_META).map(([catKey, meta]) => {
          const count = categories[catKey]?.length || 0
          const isSelected = activeCat === catKey && !selectedCalc
          return (
            <ListItemButton
              key={catKey}
              selected={isSelected}
              onClick={() => selectCategory(catKey)}
              sx={{
                borderRadius: 2.5,
                mb: 0.5,
                color: isSelected ? meta.color : "#334155",
                bgcolor: isSelected ? `${meta.color}15` : "transparent",
                "&:hover": { bgcolor: `${meta.color}0D` },
              }}
            >
              <ListItemIcon sx={{ color: isSelected ? meta.color : "#64748b", minWidth: 38 }}>
                {CATEGORY_ICONS[catKey] || <CalculateIcon />}
              </ListItemIcon>
              <ListItemText
                primary={meta.label}
                slotProps={{
                  primary: { sx: { fontWeight: isSelected ? 700 : 500, fontSize: 13.5 } },
                }}
              />
              <Badge
                badgeContent={count}
                max={999}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: isSelected ? meta.color : "#f1f5f9",
                    color: isSelected ? "#ffffff" : "#475569",
                    fontWeight: 700,
                    fontSize: 11,
                  },
                }}
              />
            </ListItemButton>
          )
        })}
      </List>

      {/* Footer info */}
      <Box sx={{ p: 2, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
        <Typography variant="caption" sx={{ color: "#475569", display: "block", textAlign: "center", fontWeight: 600 }}>
          100% Free & Open · No Signup
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Top Universal App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e2e8f0",
          color: "#0f172a",
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 1.5, sm: 2.5, md: 3 } }}>
          <Toolbar disableGutters sx={{ minHeight: { xs: 60, md: 68 }, gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Brand Logo & Name */}
            <Box
              onClick={() => selectCategory(null)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                cursor: "pointer",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Box
                aria-label="TryCalc Calculator Logo"
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                  color: "#ffffff",
                  boxShadow: "0 2px 6px rgba(79, 70, 229, 0.3)",
                }}
              >
                <CalculatorLogoIcon size={22} color="#ffffff" />
              </Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: 18, sm: 21 },
                  letterSpacing: "-0.5px",
                  color: "#0f172a",
                }}
              >
                Try<Box component="span" sx={{ color: "#4f46e5" }}>Calc</Box>
              </Typography>
            </Box>

            {/* Search Input in Navbar */}
            <Box sx={{ flexGrow: 1, maxWidth: { xs: 300, sm: 460, md: 600 }, mx: "auto" }}>
              <TextField
                size="small"
                fullWidth
                placeholder={`Search ${total || 680}+ free calculators...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#64748b", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 3,
                      bgcolor: "#f1f5f9",
                      fontSize: 14,
                      color: "#0f172a",
                      "& fieldset": { borderColor: "#e2e8f0" },
                      "&:hover fieldset": { borderColor: "#cbd5e1" },
                      "&.Mui-focused fieldset": { borderColor: "#4f46e5" },
                    },
                  },
                }}
              />
            </Box>

            {/* Category Quick Count Badge */}
            <Chip
              label={`${total || 689} Tools`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700, display: { xs: "none", sm: "flex" } }}
            />
          </Toolbar>
        </Container>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        aria-label="calculator categories"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              borderRight: "1px solid #e2e8f0",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              top: 68,
              height: "calc(100% - 68px)",
              borderRight: "1px solid #e2e8f0",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area (Spacious & Wide) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: { xs: 7.5, md: 8.5 },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f8fafc",
        }}
      >
        {/* If a calculator is selected inline */}
        {selectedCalc ? (
          <CalculatorRunner
            calc={selectedCalc}
            onBack={() => setSelectedCalc(null)}
            onOpenCalc={openCalculator}
          />
        ) : activeCat === null && !search ? (
          /* Home Dashboard (Wide Screen Container) */
          <Container maxWidth="xl" disableGutters sx={{ px: { xs: 0, sm: 1, md: 2 } }}>
            {/* Hero Banner */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4.5, md: 5 },
                mb: 4,
                borderRadius: 4,
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(255, 255, 255, 1) 100%)",
              }}
            >
              <Grid container spacing={3} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Chip
                    icon={<SpeedIcon />}
                    label="Instant, Accurate & 100% Free"
                    size="small"
                    color="primary"
                    sx={{ mb: 2, fontWeight: 700 }}
                  />
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "1.8rem", sm: "2.5rem", md: "2.8rem" },
                      letterSpacing: "-0.8px",
                      lineHeight: 1.2,
                      color: "#0f172a",
                      mb: 1.5,
                    }}
                  >
                    TryCalc — Free Calculators for Everyday Decisions
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#475569", fontSize: 16, lineHeight: 1.6, mb: 3 }}>
                    Access {total || 689}+ high-precision tools across 11 categories: Mortgage, Loans, Health & BMI,
                    Construction, Currency, Date & Time, and Unit Converters.
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => selectCategory("finance")}
                      sx={{ fontWeight: 700, borderRadius: 2.5, px: 3, py: 1.2 }}
                    >
                      Browse Finance Calculators
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => selectCategory("health")}
                      sx={{ fontWeight: 700, borderRadius: 2.5, px: 3, py: 1.2, color: "#4f46e5", borderColor: "#cbd5e1" }}
                    >
                      Health & Fitness
                    </Button>
                  </Stack>
                </Grid>

                {/* Quick Calculator on the right */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <BasicCalculator />
                </Grid>
              </Grid>
            </Paper>

            {/* 11 Category Cards Grid (Wide responsive distribution) */}
            <Box component="section" sx={{ mb: 5 }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 800, color: "#0f172a", mb: 2.5 }}>
                Explore by Category
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(CATEGORY_META).map(([key, meta]) => {
                  const count = categories[key]?.length || 0
                  return (
                    <Grid key={key} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                      <Card
                        elevation={0}
                        sx={{
                          height: "100%",
                          bgcolor: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: 3,
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                            borderColor: meta.color,
                          },
                        }}
                      >
                        <CardActionArea
                          onClick={() => selectCategory(key)}
                          sx={{ height: "100%", p: 2.5, display: "flex", flexDirection: "column", alignItems: "flex-start" }}
                        >
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 2.5,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: `${meta.color}18`,
                              color: meta.color,
                              mb: 2,
                            }}
                          >
                            {CATEGORY_ICONS[key] || <CalculateIcon />}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a", mb: 0.5 }}>
                            {meta.label}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#475569", fontSize: 13, mb: 1.5, flexGrow: 1 }}>
                            Explore {count} {meta.label.toLowerCase()} calculators
                          </Typography>
                          <Chip
                            label={`${count} tools`}
                            size="small"
                            sx={{
                              bgcolor: `${meta.color}15`,
                              color: meta.color,
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          />
                        </CardActionArea>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            </Box>

            {/* Popular Calculators Grid */}
            <Box component="section" sx={{ mb: 5 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
                <AutoAwesomeIcon color="primary" />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  Most Popular Calculators
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {Object.values(categories)
                  .flat()
                  .filter((c) =>
                    ["mortgage", "bmi", "loan", "compound", "age", "percentage", "tip", "calorie", "concrete", "currency", "simple-interest", "discount", "half-birthday"].some((p) => c.id.includes(p))
                  )
                  .slice(0, 15)
                  .map((calc) => (
                    <Grid key={calc.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                      <CalcCard calc={calc} onOpen={(c) => router.push(`/calculators/${c.id}`)} />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Container>
        ) : (
          /* Category or Search Result View */
          <Container maxWidth="xl" disableGutters sx={{ px: { xs: 0, sm: 1, md: 2 } }}>
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: `${CATEGORY_META[activeCat || ""]?.color || "#4f46e5"}18`,
                    color: CATEGORY_META[activeCat || ""]?.color || "#4f46e5",
                  }}
                >
                  {CATEGORY_ICONS[activeCat || ""] || <CalculateIcon />}
                </Box>
                <Box>
                  <Typography variant="h5" component="h1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {search ? `Search results for "${search}"` : CATEGORY_META[activeCat || ""]?.label || "Calculators"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500 }}>
                    {displayCalcs.length} calculator{displayCalcs.length !== 1 ? "s" : ""} available
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Calculators Grid */}
            <Grid container spacing={2}>
              {displayCalcs.map((calc) => (
                <Grid key={calc.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                  <CalcCard calc={calc} onOpen={(c) => router.push(`/calculators/${c.id}`)} />
                </Grid>
              ))}
            </Grid>

            {displayCalcs.length === 0 && (
              <Paper
                elevation={0}
                sx={{ textAlign: "center", py: 8, px: 3, bgcolor: "#ffffff", borderRadius: 3, border: "1px solid #e2e8f0" }}
              >
                <CalculateIcon sx={{ fontSize: 56, color: "#94a3b8", mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                  No calculators found
                </Typography>
                <Typography variant="body2" sx={{ color: "#475569", mb: 2 }}>
                  Try a different search term or browse from our category sidebar.
                </Typography>
                <Button variant="outlined" onClick={() => setSearch("")} sx={{ borderRadius: 2 }}>
                  Clear Search
                </Button>
              </Paper>
            )}
          </Container>
        )}

        {/* Global Footer */}
        <GlobalFooter />
      </Box>
    </Box>
  )
}

/* ---------- Calculator Card (Modern Light Theme) ---------- */

function DynamicCalcIcon({ iconName, category }: { iconName: string; category?: string }) {
  return React.createElement(getIconComponent(iconName, category), { fontSize: "small" })
}

function CalcCard({ calc, onOpen }: { calc: CalculatorDef; onOpen: (c: CalculatorDef) => void }) {
  const catMeta = CATEGORY_META[calc.category]

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 3,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          borderColor: catMeta?.color || "#4f46e5",
        },
      }}
    >
      <CardActionArea
        href={`/calculators/${calc.id}`}
        onClick={() => onOpen(calc)}
        sx={{ height: "100%", p: 2, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%", mb: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: `${catMeta?.color || "#4f46e5"}18`,
              color: catMeta?.color || "#4f46e5",
            }}
          >
            <DynamicCalcIcon iconName={getCalcIcon(calc.id)} category={calc.category} />
          </Box>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, color: "#0f172a" }}>
              {calc.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "#475569", display: "block", fontWeight: 500 }}>
              {catMeta?.label || calc.category}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: "#475569",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          {calc.description}
        </Typography>
      </CardActionArea>
    </Card>
  )
}

function generateExampleValues(fields: CalculatorDef["fields"]): Record<string, string> {
  const ex: Record<string, string> = {}
  for (const f of fields) {
    const name = f.name.toLowerCase()
    const label = (f.label || "").toLowerCase()

    if (f.type === "select") {
      ex[f.name] = f.options && f.options.length > 0 ? String(f.options[0].value) : ""
    } else if (f.type === "date") {
      if (name.includes("dob") || name.includes("birth") || label.includes("birth")) {
        ex[f.name] = "1998-05-15"
      } else if (name.includes("start") || name.includes("older") || name.includes("date1") || name.includes("lmp")) {
        ex[f.name] = "2024-01-15"
      } else if (name.includes("end") || name.includes("newer") || name.includes("date2") || name.includes("target")) {
        ex[f.name] = "2026-09-17"
      } else {
        ex[f.name] = "2024-06-01"
      }
    } else {
      if (f.default != null && f.default !== "") {
        ex[f.name] = String(f.default)
      } else if (name.includes("price") || name.includes("loan") || name.includes("amount") || name.includes("principal")) {
        ex[f.name] = "50000"
      } else if (name.includes("rate") || name.includes("interest") || name.includes("percent") || name.includes("tax")) {
        ex[f.name] = "6.5"
      } else if (name.includes("term") || name.includes("year") || name.includes("period") || name.includes("tenure")) {
        ex[f.name] = "15"
      } else if (name.includes("month")) {
        ex[f.name] = "12"
      } else if (name.includes("age")) {
        ex[f.name] = "28"
      } else if (name.includes("height")) {
        ex[f.name] = "175"
      } else if (name.includes("weight")) {
        ex[f.name] = "70"
      } else if (name.includes("income") || name.includes("salary")) {
        ex[f.name] = "65000"
      } else if (name.includes("down")) {
        ex[f.name] = "10000"
      } else if (f.type === "number") {
        ex[f.name] = "100"
      } else {
        ex[f.name] = "Sample"
      }
    }
  }
  return ex
}

/* ---------- Calculator Runner (Inline or Modal) ---------- */

function CalculatorRunner({
  calc,
  onBack,
}: {
  calc: CalculatorDef
  onBack: () => void
  onOpenCalc?: (c: CalculatorDef) => void
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    const todayStr = new Date().toISOString().split("T")[0]
    for (const f of calc.fields) {
      if (f.default != null && f.default !== "") {
        init[f.name] = String(f.default)
      } else if (f.type === "date") {
        init[f.name] = todayStr
      } else {
        init[f.name] = ""
      }
    }
    return init
  })
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [jsHtml, setJsHtml] = useState<string | null>(null)
  const [jsTrigger, setJsTrigger] = useState(0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [copyToast, setCopyToast] = useState(false)

  const seoIntro = useMemo(() => seoIntroFor(calc), [calc])

  const handleFillExample = () => {
    const ex = generateExampleValues(calc.fields)
    setValues(ex)
  }

  const handleReset = () => {
    const init: Record<string, string> = {}
    const todayStr = new Date().toISOString().split("T")[0]
    for (const f of calc.fields) {
      if (f.default != null && f.default !== "") {
        init[f.name] = String(f.default)
      } else if (f.type === "date") {
        init[f.name] = todayStr
      } else {
        init[f.name] = ""
      }
    }
    setValues(init)
    setResult(null)
    setJsHtml(null)
    setErr(null)
  }

  const handleCopyResult = () => {
    let textToCopy = `${calc.name} Results:\n`
    if (result) {
      for (const [k, v] of Object.entries(result)) {
        textToCopy += `${String(k).replaceAll("_", " ")}: ${String(v)}\n`
      }
    } else if (jsHtml) {
      const tmp = document.createElement("div")
      tmp.innerHTML = jsHtml
      textToCopy += tmp.textContent || tmp.innerText || ""
    }
    textToCopy += `\nCalculated on TryCalc.net`
    navigator.clipboard.writeText(textToCopy)
    setCopyToast(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    setResult(null)
    setJsHtml(null)
    try {
      const payload: Record<string, string | number> = {}
      for (const f of calc.fields) {
        const v = values[f.name]
        payload[f.name] = f.type === "number" && v !== "" ? Number(v) : v
      }
      const res = await runCalculator(calc.id, payload)
      if (res.result && Object.keys(res.result).length > 0) {
        if ("js_required" in res.result || (typeof res.result.note === "string" && res.result.note.includes("client-side"))) {
          setJsTrigger(prev => prev + 1)
          return
        }
        const vals = Object.values(res.result)
        const hasRealResult = vals.some(
          (v) => v !== null && v !== undefined &&
            String(v) !== "This calculator runs client-side" &&
            String(v) !== "JS_CALC"
        )
        if (hasRealResult) {
          setResult(res.result)
          setBusy(false)
          return
        }
      }
      setJsTrigger(prev => prev + 1)
    } catch {
      setJsTrigger(prev => prev + 1)
    }
  }

  const handleJsResult = (sandboxResult: { html: string; text: string }) => {
    setJsHtml(sandboxResult.html)
    setBusy(false)
  }

  const handleJsError = (error: string) => {
    setErr(`Calculation failed: ${error}`)
    setBusy(false)
  }

  const catMeta = CATEGORY_META[calc.category]

  return (
    <Container maxWidth="xl" disableGutters sx={{ px: { xs: 0, sm: 1, md: 2 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 2, fontWeight: 700, color: "#475569" }}
      >
        Back to Dashboard
      </Button>

      {/* Clean Sleek Header — Tool-First */}
      <Box sx={{ mb: 2.5 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "#0f172a" }}>
            {calc.name}
          </Typography>
          <Chip
            label={catMeta?.label || calc.category}
            size="small"
            sx={{ bgcolor: `${catMeta?.color || "#4f46e5"}18`, color: catMeta?.color || "#4f46e5", fontWeight: 700 }}
          />
        </Stack>
      </Box>

      <Grid container spacing={3.5}>
        <Grid size={{ xs: 12, lg: 6.5 }}>
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3.5, bgcolor: "#ffffff", border: "1px solid #e2e8f0" }}>
            {/* Quick Toolbar */}
            <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<FlashOnIcon sx={{ color: "#f59e0b" }} />}
                onClick={handleFillExample}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 12.5,
                  color: "#0f172a",
                  borderColor: "#e2e8f0",
                  bgcolor: "#f8fafc",
                  "&:hover": { bgcolor: "#f1f5f9", borderColor: "#cbd5e1" },
                }}
              >
                ⚡ Fill Example
              </Button>
              <Button
                size="small"
                variant="text"
                startIcon={<RestartAltIcon />}
                onClick={handleReset}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 12.5,
                  color: "#64748b",
                  "&:hover": { bgcolor: "#f8fafc", color: "#0f172a" },
                }}
              >
                ↺ Reset
              </Button>
            </Stack>

            <form onSubmit={submit}>
              <Stack spacing={2.5}>
                {calc.fields.map((f) => {
                  if (f.type === "select") {
                    return (
                      <FormControl key={f.name} fullWidth size="medium">
                        <InputLabel>{f.label}</InputLabel>
                        <Select
                          value={values[f.name]}
                          label={f.label}
                          onChange={(e) =>
                            setValues({ ...values, [f.name]: e.target.value })
                          }
                        >
                          {(f.options || []).map((o) => (
                            <MenuItem key={o.value} value={o.value}>
                              {o.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )
                  }
                  if (f.type === "date") {
                    return (
                      <ModernDatePicker
                        key={f.name}
                        label={f.label}
                        value={values[f.name]}
                        onChange={(val) => setValues({ ...values, [f.name]: val })}
                        helperText={f.help || undefined}
                      />
                    )
                  }
                  return (
                    <TextField
                      key={f.name}
                      type={f.type === "number" ? "number" : "text"}
                      label={f.label}
                      value={values[f.name] ?? ""}
                      onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                      fullWidth
                      slotProps={{
                        input: {
                          endAdornment: f.unit ? <InputAdornment position="end">{f.unit}</InputAdornment> : null,
                        },
                      }}
                      helperText={f.help || undefined}
                    />
                  )
                })}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={busy}
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    py: 1.6,
                    borderRadius: 3,
                    fontWeight: 800,
                    textTransform: "none",
                    fontSize: 16,
                    bgcolor: "#4f46e5",
                    "&:hover": { bgcolor: "#4338ca" },
                    boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                  }}
                >
                  {busy ? "Calculating..." : "⚡ Calculate"}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5.5 }}>
          <JsExecutor
            calcId={calc.id}
            fields={calc.fields.map((f) => ({
              name: f.name,
              type: f.type,
              value: values[f.name] || (f.default ?? ""),
            }))}
            onResult={handleJsResult}
            onError={handleJsError}
            trigger={jsTrigger}
          />

          {err && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{err}</Alert>}

          {result || jsHtml ? (
            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3.5, bgcolor: "#ffffff", border: "1px solid #e2e8f0" }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
                <CheckCircleIcon sx={{ color: "#10b981" }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  Results
                </Typography>
                <Chip label="Ready" size="small" sx={{ ml: "auto", bgcolor: "#ecfdf5", color: "#059669", fontWeight: 700, border: "1px solid #a7f3d0" }} />
              </Stack>
              {jsHtml ? (
                <Box
                  component="div"
                  dangerouslySetInnerHTML={{
                    __html: typeof window !== "undefined" ? DOMPurify.sanitize(jsHtml) : jsHtml,
                  }}
                />
              ) : result ? (
                <Stack spacing={1.5}>
                  {Object.entries(result).map(([k, val]) => (
                    <Box key={k} sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", pb: 1.5, borderBottom: "1px solid #f1f5f9" }}>
                      <Typography variant="body2" sx={{ color: "#475569", textTransform: "capitalize", fontWeight: 600 }}>
                        {String(k).replaceAll("_", " ")}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", fontFamily: "monospace" }}>
                        {renderValue(val)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : null}

              {/* Copy results button */}
              <Stack direction="row" spacing={1.5} sx={{ mt: 3, pt: 2, borderTop: "1px solid #e2e8f0" }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyResult}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 13,
                    bgcolor: "#4f46e5",
                    "&:hover": { bgcolor: "#4338ca" },
                  }}
                >
                  Copy Results
                </Button>
              </Stack>
            </Paper>
          ) : (
            <Paper elevation={0} sx={{ p: 5, border: "1px dashed #cbd5e1", borderRadius: 3.5, textAlign: "center", bgcolor: "#ffffff" }}>
              <CalculateIcon sx={{ fontSize: 56, color: "#94a3b8", mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                Ready to Calculate
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                Fill in the form or click <strong>⚡ Fill Example</strong> to see instant results
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Overview & Guides — Below-the-Fold */}
      <Box sx={{ mt: 5 }}>
        {/* Direct Overview */}
        <Paper
          elevation={0}
          sx={{
            p: 3.5,
            mb: 3.5,
            borderRadius: 3.5,
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
            About {calc.name}
          </Typography>
          <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.7 }}>
            {seoIntro}
          </Typography>
        </Paper>

        {/* 3-Step Operation Visual Bar */}
        <Box sx={{ mb: 3.5, p: 2, borderRadius: 3.5, bgcolor: "#ffffff", border: "1px solid #e2e8f0" }}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: "#4f46e5",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  1
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>
                    Enter Parameters
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: "#64748b" }}>
                    Fill inputs or use ⚡ Fill Example
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: busy ? "#f59e0b" : "#f1f5f9",
                    color: busy ? "#fff" : "#475569",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 800,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  2
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: busy ? "#d97706" : "#0f172a" }}>
                    Calculate
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: "#64748b" }}>
                    Deterministic instant engine
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: result || jsHtml ? "#10b981" : "#f1f5f9",
                    color: result || jsHtml ? "#fff" : "#475569",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 800,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  3
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: result || jsHtml ? "#059669" : "#0f172a" }}>
                    Instant Results
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: "#64748b" }}>
                    View, copy & analyze
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Copy Toast */}
      <Snackbar
        open={copyToast}
        autoHideDuration={2500}
        onClose={() => setCopyToast(false)}
        message="✅ Results copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  )
}

function renderValue(val: unknown): string {
  if (val === null || val === undefined) return "—"
  if (Array.isArray(val)) return val.map((v) => renderValue(v)).join(", ")
  if (typeof val === "number") {
    return Number.isInteger(val)
      ? val.toLocaleString()
      : val.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }
  if (typeof val === "object") return JSON.stringify(val)
  return String(val)
}
