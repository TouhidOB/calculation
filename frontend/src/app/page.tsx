"use client"

import * as React from "react"
import { useContext, useEffect, useMemo, useState } from "react"
import { ColorModeContext } from "@/theme/ThemeRegistry"
import { listCalculators, runCalculator, type CategoryMap, type CalculatorDef, CATEGORY_META } from "@/lib/calculator-api"
import { getCalcIcon } from "@/lib/calc-icons"
import JsExecutor from "@/components/JsExecutor"
import { getIconComponent } from "@/lib/icon-registry"

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
import CardContent from "@mui/material/CardContent"
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
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import Skeleton from "@mui/material/Skeleton"
import Fade from "@mui/material/Fade"
import Badge from "@mui/material/Badge"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import useMediaQuery from "@mui/material/useMediaQuery"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import { useTheme, styled } from "@mui/material/styles"

// Icons
import MenuIcon from "@mui/icons-material/Menu"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import HelpIcon from "@mui/icons-material/Help"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import SpeedIcon from "@mui/icons-material/Speed"
import BackspaceIcon from "@mui/icons-material/Backspace"

const DRAWER_WIDTH = 260

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

function seoTitleFor(calc: CalculatorDef): string {
  const cat = CATEGORY_META[calc.category]?.label || calc.category
  return `${calc.name} — Free Online ${cat.replace(" Calculators", " Calculator")} | CalcHub`
}

function seoIntroFor(calc: CalculatorDef): string {
  const cat = CATEGORY_META[calc.category]?.label || "general"
  const fname = calc.name.toLowerCase()
  const fieldList = calc.fields.slice(0, 4).map(f => f.label.toLowerCase()).join(", ")

  // Category-specific intros with rich SEO keywords
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
    science: `Compute scientific values with this free online ${fname}. Enter ${fieldList} for physics, chemistry, and engineering calculations.`,
    misc: `Get quick answers with this free online ${fname}. Enter ${fieldList} for instant, accurate results.`,
    other: `Get quick answers with this free online ${fname}. Enter ${fieldList} for instant, accurate results.`,
  }
  return intros[calc.category] || intros.misc
}

function seoHowToFor(calc: CalculatorDef): string[] {
  const fields = calc.fields.slice(0, 3)
  const steps: string[] = []
  steps.push(`Open the ${calc.name} — all inputs are clearly labeled with units.`)
  fields.forEach((f, i) => {
    const unit = f.unit ? ` (in ${f.unit})` : ""
    steps.push(`Enter your ${f.label.toLowerCase()}${unit} — step ${i + 1} of ${fields.length}.`)
  })
  steps.push("Click the Calculate button — your result appears instantly on the right panel.")
  steps.push("Adjust any input and recalculate as many times as you need — it's 100% free, no signup required.")
  return steps
}

function seoFaqFor(calc: CalculatorDef): { q: string; a: string }[] {
  const cat = CATEGORY_META[calc.category]?.label || "General"
  return [
    {
      q: `Is the ${calc.name} free to use?`,
      a: `Yes — the ${calc.name} on CalcHub is completely free with unlimited calculations, no registration, and no ads interrupting your work.`,
    },
    {
      q: `How accurate is the ${calc.name}?`,
      a: `The ${calc.name} uses standard formulas widely accepted in ${cat.toLowerCase()} and updates results in real time as you type. Results are estimates for planning purposes.`,
    },
    {
      q: `Can I use the ${calc.name} on mobile?`,
      a: `Absolutely — CalcHub calculators are fully responsive and work on phones, tablets, and desktops with the same speed and accuracy.`,
    },
  ]
}

/* ---------- Basic Calculator Widget ---------- */

const BASIC_KEYS = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"]

function BasicCalculator() {
  const [display, setDisplay] = useState("0")
  const [expr, setExpr] = useState("")
  const [justEvaluated, setJustEvaluated] = useState(false)

  const safeEval = (e: string): string => {
    try {
      // Only allow digits, operators, decimal, parentheses, spaces
      if (!/^[0-9+\-*/.() ]+$/.test(e)) return "Error"
      // eslint-disable-next-line no-new-func
      const val = Function(`"use strict"; return (${e})`)()
      if (typeof val !== "number" || !isFinite(val)) return "Error"
      return String(Math.round(val * 1e10) / 1e10)
    } catch {
      return "Error"
    }
  }

  const press = (key: string) => {
    if (justEvaluated && /[0-9.]/.test(key)) {
      setDisplay(key)
      setExpr("")
      setJustEvaluated(false)
      return
    }
    setJustEvaluated(false)
    if (key === "=") {
      const full = expr + display
      const res = safeEval(full)
      setDisplay(res)
      setExpr("")
      setJustEvaluated(true)
      return
    }
    if (["+", "-", "*", "/"].includes(key)) {
      setExpr(expr + display + key)
      setDisplay("0")
      return
    }
    setDisplay(display === "0" && key !== "." ? key : display + key)
  }

  const backspace = () => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0")
  }

  const clearAll = () => {
    setDisplay("0")
    setExpr("")
    setJustEvaluated(false)
  }

  const CalcKeyButton = styled(Button)(({ theme }) => ({
    minWidth: 0,
    width: "100%",
    aspectRatio: "1.6",
    p: 0,
    fontSize: "1.1rem",
    fontWeight: 600,
    borderRadius: 12,
    boxShadow: "none",
    transition: "transform 0.08s ease",
    "&:active": { transform: "scale(0.95)" },
  }))

  return (
    <Paper
      elevation={0}
      component="section"
      aria-label="Basic online calculator"
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(160deg, rgba(99,102,241,0.14), rgba(139,92,246,0.06))"
            : "linear-gradient(160deg, rgba(99,102,241,0.10), rgba(139,92,246,0.03))",
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
        <CalculateIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Quick Calculator
        </Typography>
        <Chip label="Free" size="small" color="primary" variant="outlined" sx={{ ml: "auto" }} />
      </Stack>

      {/* Display */}
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.75)"),
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
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
          sx={{ fontFamily: "monospace", fontWeight: 700, wordBreak: "break-all", lineHeight: 1.2 }}
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
              sx={{ flexGrow: 1, borderRadius: 12, py: 1.2, fontWeight: 700 }}
            >
              C
            </Button>
            <Button
              onClick={backspace}
              variant="outlined"
              sx={{ flexGrow: 1, borderRadius: 12, py: 1.2 }}
              aria-label="backspace"
            >
              <BackspaceIcon />
            </Button>
            <Button
              onClick={() => press("(")}
              variant="outlined"
              sx={{ flexGrow: 1, borderRadius: 12, py: 1.2, fontWeight: 700 }}
            >
              (
            </Button>
            <Button
              onClick={() => press(")")}
              variant="outlined"
              sx={{ flexGrow: 1, borderRadius: 12, py: 1.2, fontWeight: 700 }}
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
                borderRadius: 12,
                transition: "transform 0.08s ease",
                "&:active": { transform: "scale(0.94)" },
              }}
            >
              {k === "*" ? "×" : k === "/" ? "÷" : k}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, textAlign: "center" }}>
        Addition · Subtraction · Multiplication · Division — instant results
      </Typography>
    </Paper>
  )
}

export default function Home() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { toggleColorMode } = useContext(ColorModeContext)

  const [categories, setCategories] = useState<CategoryMap>({})
  const [total, setTotal] = useState(0)
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [activeCalc, setActiveCalc] = useState<CalculatorDef | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    listCalculators()
      .then((data) => {
        setCategories(data.categories)
        setTotal(data.total)
        setActiveCat(Object.keys(data.categories)[0] || null)
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const filteredCalcs = useMemo(() => {
    if (!activeCat || !categories[activeCat]) return []
    if (!search.trim()) return categories[activeCat]
    const q = search.toLowerCase()
    return categories[activeCat].filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    )
  }, [categories, activeCat, search])

  // All calculators search
  const allFiltered = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    const results: CalculatorDef[] = []
    Object.values(categories).forEach((calcs) =>
      calcs.forEach((c) => {
        if (c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
          results.push(c)
      })
    )
    return results
  }, [categories, search])

  const handleSelectCat = (cat: string) => {
    setActiveCat(cat)
    setActiveCalc(null)
    setSearch("")
    setShowWelcome(false)
    if (isMobile) setDrawerOpen(false)
  }

  // Drawer content
  const drawerContent = (
    <Box sx={{ width: DRAWER_WIDTH, pt: 2 }}>
      <Box sx={{ px: 2, pb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <CalculateIcon color="primary" sx={{ fontSize: 28 }} />
        <Typography variant="h6" noWrap sx={{ fontWeight: 800 }}>
          CalcHub
        </Typography>
        <Chip label={total} size="small" color="primary" sx={{ ml: "auto" }} />
      </Box>
      <Divider />
      <List sx={{ px: 1 }}>
        <ListItemButton
          selected={showWelcome && !activeCalc}
          onClick={() => {
            setShowWelcome(true)
            setActiveCalc(null)
            setSearch("")
            if (isMobile) setDrawerOpen(false)
          }}
          sx={{ borderRadius: 2, mb: 0.5 }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary="Welcome Home"
            slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500 } } }}
          />
        </ListItemButton>
        {Object.keys(categories).map((cat) => {
          const meta = CATEGORY_META[cat]
          const count = categories[cat]?.length || 0
          return (
            <ListItemButton
              key={cat}
              selected={activeCat === cat && !activeCalc && !showWelcome}
              onClick={() => handleSelectCat(cat)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: meta?.color }}>
                {CATEGORY_ICONS[cat] || <CalculateIcon />}
              </ListItemIcon>
              <ListItemText
                primary={meta?.label || cat}
                slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500 } } }}
              />
              <Chip label={count} size="small" variant="outlined" />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} />
        <Grid container spacing={2}>
          {[...Array(6)].map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Backend unavailable
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Container>
    )
  }

  const displayCalcs = allFiltered || filteredCalcs
  const catCount = Object.keys(categories).length

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              borderRight: "1px solid",
              borderColor: "divider",
              backgroundImage: "none",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            color: "text.primary",
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundImage: "none",
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}

            {activeCalc && (
              <IconButton onClick={() => setActiveCalc(null)} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            )}

            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ flexGrow: 1 }}>
              <Link
                underline="hover"
                color="inherit"
                sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}
                onClick={() => { setActiveCalc(null); setShowWelcome(true) }}
              >
                <HomeIcon fontSize="small" />
                {showWelcome && !activeCalc
                  ? "Welcome"
                  : CATEGORY_META[activeCat || ""]?.label || "Home"}
              </Link>
              {activeCalc && (
                <Typography color="text.primary" sx={{ fontWeight: 600 }}>
                  {activeCalc.name}
                </Typography>
              )}
            </Breadcrumbs>

            {/* Search */}
            {!activeCalc && (
              <TextField
                size="small"
                placeholder="Search 689+ calculators…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); if (e.target.value) setShowWelcome(false) }}
                sx={{
                  width: isMobile ? 140 : 260,
                  "& .MuiOutlinedInput-root": { borderRadius: 10 },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}

            {/* Theme toggle */}
            <Tooltip title="Toggle theme">
              <IconButton onClick={toggleColorMode} sx={{ ml: 1 }}>
                {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Content area */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          {activeCalc ? (
            <CalculatorRunner
              calc={activeCalc}
              onBack={() => setActiveCalc(null)}
              onOpenCalc={(c) => { window.location.href = `/calculators/${c.id}` }}
            />
          ) : showWelcome && !search ? (
            /* ================= WELCOME PAGE ================= */
            <Container maxWidth="lg" disableGutters sx={{ px: { xs: 0, md: 1 } }}>
              {/* Hero */}
              <Box
                component="header"
                sx={{
                  textAlign: "center",
                  py: { xs: 5, md: 8 },
                  px: 2,
                  borderRadius: 5,
                  mb: 5,
                  background: (t) =>
                    t.palette.mode === "dark"
                      ? "radial-gradient(ellipse at top, rgba(99,102,241,0.22), transparent 65%)"
                      : "radial-gradient(ellipse at top, rgba(99,102,241,0.14), transparent 65%)",
                }}
              >
                <Chip
                  icon={<AutoAwesomeIcon />}
                  label="100% Free · No Signup · Instant Results"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2.5, fontWeight: 600 }}
                />
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: "2rem", sm: "2.8rem", md: "3.4rem" },
                    mb: 1.5,
                    background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Welcome to CalcHub
                </Typography>
                <Typography
                  variant="h5"
                  component="p"
                  color="text.secondary"
                  sx={{ maxWidth: 720, mx: "auto", mb: 1, fontWeight: 400, lineHeight: 1.5 }}
                >
                  Your all-in-one destination for <strong>{total}+ free online calculators</strong> across{" "}
                  <strong>{catCount} categories</strong> — finance, health, construction, conversion, math &amp; more.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mx: "auto", mb: 4 }}>
                  From mortgage payments and BMI to concrete estimates and unit conversions — every
                  calculator is instant, accurate, and works on any device.
                </Typography>

                {/* Stats */}
                <Grid container spacing={2} sx={{ maxWidth: 760, mx: "auto", mb: 4 }}>
                  {[
                    { icon: <CalculateIcon />, value: `${total}+`, label: "Calculators" },
                    { icon: <FunctionsIcon />, value: `${catCount}`, label: "Categories" },
                    { icon: <SpeedIcon />, value: "Instant", label: "Results" },
                    { icon: <CheckCircleIcon />, value: "Free", label: "Forever" },
                  ].map((s, i) => (
                    <Grid key={i} size={{ xs: 6, sm: 3 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          py: 2.5,
                          px: 1,
                          borderRadius: 4,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Box sx={{ color: "primary.main", mb: 0.5, display: "flex", justifyContent: "center" }}>
                          {s.icon}
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>{s.value}</Typography>
                        <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {/* Category quick chips */}
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ flexWrap: "wrap", justifyContent: "center", maxWidth: 720, mx: "auto" }}
                >
                  {Object.keys(categories).map((cat) => {
                    const meta = CATEGORY_META[cat]
                    const count = categories[cat]?.length || 0
                    return (
                      <Chip
                        key={cat}
                        label={`${meta?.label || cat} · ${count}`}
                        onClick={() => handleSelectCat(cat)}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                          px: 0.5,
                          "&:hover": { bgcolor: `${meta?.color || "#6366f1"}22` },
                          border: "1px solid",
                          borderColor: `${meta?.color || "#6366f1"}44`,
                        }}
                      />
                    )
                  })}
                </Stack>
              </Box>

              {/* Basic calculator + how-to */}
              <Grid container spacing={4} sx={{ mb: 6, alignItems: "flex-start" }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <BasicCalculator />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4, border: "1px solid", borderColor: "divider", height: "100%" }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
                      <HelpIcon color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        How to Use CalcHub
                      </Typography>
                    </Stack>
                    {[
                      { t: "Pick a category", d: "Choose from 11 categories in the left sidebar — Finance, Health, Construction, Conversion and more." },
                      { t: "Select a calculator", d: "Click any calculator card — each opens with clearly labeled inputs, units and helpful hints." },
                      { t: "Enter your values", d: "Type your numbers. Every field shows its unit so you always know what to enter." },
                      { t: "Get instant results", d: "Click Calculate — results appear instantly with detailed breakdowns. Free, unlimited, no signup." },
                    ].map((s, i) => (
                      <Stack key={i} direction="row" spacing={2} sx={{ mb: 2.5 }}>
                        <Box
                          sx={{
                            width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            bgcolor: "primary.main", color: "primary.contrastText",
                            fontWeight: 700, fontSize: 14,
                          }}
                        >
                          {i + 1}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{s.t}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {s.d}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Paper>
                </Grid>
              </Grid>

              {/* Popular calculators */}
              <Box component="section" sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2.5 }}>
                  <AutoAwesomeIcon color="primary" />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                    Popular Calculators
                  </Typography>
                </Stack>
                <Grid container spacing={2}>
                  {Object.values(categories)
                    .flat()
                    .filter((c) =>
                      ["mortgage", "bmi", "loan", "compound", "age", "percentage", "tip", "calorie", "concrete", "currency", "simple-interest", "discount"].some((p) => c.id.includes(p))
                    )
                    .slice(0, 12)
                    .map((calc, i) => (
                      <Grid key={calc.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                        <Fade in timeout={200 + i * 60}>
                          <CalcCard calc={calc} onOpen={(c) => { window.location.href = `/calculators/${c.id}` }} />
                        </Fade>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </Container>
          ) : (
            <>
              {/* Category header */}
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `linear-gradient(135deg, ${CATEGORY_META[activeCat || ""]?.color || "#6366f1"}33, ${CATEGORY_META[activeCat || ""]?.color || "#6366f1"}11)`,
                      color: CATEGORY_META[activeCat || ""]?.color,
                    }}
                  >
                    {CATEGORY_ICONS[activeCat || ""] || <CalculateIcon />}
                  </Box>
                  <Box>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                      {search && allFiltered
                        ? `Search: "${search}"`
                        : CATEGORY_META[activeCat || ""]?.label || "Calculators"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {displayCalcs.length} calculator{displayCalcs.length !== 1 ? "s" : ""}
                      {search && allFiltered ? ` matching "${search}"` : ""}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Calculator cards grid */}
              <Grid container spacing={2}>
                {displayCalcs.map((calc, i) => {
                  return (
                    <Grid key={calc.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                      <Fade in timeout={200 + i * 60}>
                        <CalcCard calc={calc} onOpen={(c) => { window.location.href = `/calculators/${c.id}` }} />
                      </Fade>
                    </Grid>
                  )
                })}
              </Grid>

              {displayCalcs.length === 0 && (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No calculators found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try a different search term
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

/* ---------- Calculator Card (modern UI) ---------- */

function CalcCard({ calc, onOpen }: { calc: CalculatorDef; onOpen: (c: CalculatorDef) => void }) {
  const catMeta = CATEGORY_META[calc.category]
  const IconComp = getIconComponent(getCalcIcon(calc.id))

  return (
    <Card
      sx={{
        height: "100%",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": { transform: "translateY(-3px)", boxShadow: 6 },
        borderRadius: 3,
      }}
    >
      <CardActionArea
        href={`/calculators/${calc.id}`}
        onClick={() => onOpen(calc)}
        sx={{ height: "100%", p: 0 }}
      >
        <CardContent sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column" }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${catMeta?.color || "#888"}30, ${catMeta?.color || "#888"}10)`,
                color: catMeta?.color,
                flexShrink: 0,
              }}
            >
              <IconComp fontSize="medium" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Chip
                label={catMeta?.label || calc.category}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 11,
                  bgcolor: `${catMeta?.color || "#888"}1E`,
                  color: catMeta?.color,
                  fontWeight: 600,
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: "auto !important", flexShrink: 0 }}>
              {calc.fields.length} inputs
            </Typography>
          </Stack>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700 }}>
            {calc.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.55, flexGrow: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {calc.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

/* ---------- Calculator Runner (with SEO how-to + FAQ) ---------- */

function CalculatorRunner({
  calc,
  onBack,
  onOpenCalc,
}: {
  calc: CalculatorDef
  onBack: () => void
  onOpenCalc: (c: CalculatorDef) => void
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const f of calc.fields) {
      init[f.name] = f.default != null ? String(f.default) : ""
    }
    return init
  })
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [jsHtml, setJsHtml] = useState<string | null>(null)
  const [jsTrigger, setJsTrigger] = useState(0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const howToSteps = useMemo(() => seoHowToFor(calc), [calc])
  const faqs = useMemo(() => seoFaqFor(calc), [calc])
  const seoIntro = useMemo(() => seoIntroFor(calc), [calc])
  const seoTitle = useMemo(() => seoTitleFor(calc), [calc])

  // Structured data for SEO: SoftwareApplication + FAQPage + HowTo
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: calc.name,
        description: calc.description,
        applicationCategory: "CalculatorApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        featureList: calc.fields.map(f => f.label).join(", "),
      },
      {
        "@type": "HowTo",
        name: `How to use the ${calc.name}`,
        step: howToSteps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text: s,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
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
      // First try backend run
      const res = await runCalculator(calc.id, payload)
      if (res.result && Object.keys(res.result).length > 0) {
        // Check if it's a "client-side" note
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
      // Backend can't compute — trigger client-side JS execution
      setJsTrigger(prev => prev + 1)
    } catch {
      // Backend error — try JS execution as fallback
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 0, md: 1 } }}>
        {/* Calculator header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
            {seoTitle.split(" — ")[0]}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {seoIntro}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Form section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
                <Chip
                  label={catMeta?.label || calc.category}
                  size="small"
                  sx={{
                    bgcolor: `${catMeta?.color || "#888"}22`,
                    color: catMeta?.color,
                    fontWeight: 600,
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                  {calc.fields.length} inputs · instant result
                </Typography>
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 0.5 }}>
                {calc.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {calc.description}
              </Typography>

              <form onSubmit={submit}>
                <Stack spacing={2.5}>
                  {calc.fields.map((f) => {
                    if (f.type === "select") {
                      return (
                        <FormControl key={f.name} fullWidth>
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
                    return (
                      <TextField
                        key={f.name}
                        label={f.label}
                        type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                        value={values[f.name]}
                        onChange={(e) =>
                          setValues({ ...values, [f.name]: e.target.value })
                        }
                        placeholder={f.help || ""}
                        helperText={f.help || undefined}
                        slotProps={{
                          input: {
                            endAdornment: f.unit ? (
                              <InputAdornment position="end">{f.unit}</InputAdornment>
                            ) : undefined,
                          },
                          htmlInput: {
                            min: f.min ?? undefined,
                            max: f.max ?? undefined,
                            step: f.step ?? undefined,
                          },
                        }}
                      />
                    )
                  })}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={busy}
                    startIcon={busy ? undefined : <PlayArrowIcon />}
                    sx={{ py: 1.5, fontSize: 16, borderRadius: 10 }}
                  >
                    {busy ? "Calculating…" : "Calculate"}
                  </Button>
                </Stack>
              </form>

              {err && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {err}
                </Alert>
              )}

              {/* JS Executor for client-side calculators */}
              {jsTrigger > 0 && (
                <JsExecutor
                  calcId={calc.id}
                  fields={calc.fields.map(f => ({
                    name: f.name,
                    type: f.type,
                    value: values[f.name]
                  }))}
                  onResult={handleJsResult}
                  onError={handleJsError}
                  trigger={jsTrigger}
                />
              )}
            </Paper>
          </Grid>

          {/* Result section */}
          <Grid size={{ xs: 12, md: 6 }}>
            {(result || jsHtml) ? (
              <Fade in>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: 3,
                    background: (theme) =>
                      theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))"
                        : "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.02))",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
                    <CheckCircleIcon color="primary" />
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                      Your Result
                    </Typography>
                  </Stack>

                  {jsHtml ? (
                    <Box
                      sx={{
                        overflow: 'auto',
                        maxHeight: 400,
                        fontSize: 14,
                        lineHeight: 1.6,
                      }}
                      component="div"
                      dangerouslySetInnerHTML={{ __html: jsHtml }}
                    />
                  ) : result ? (
                    <Stack spacing={1.5}>
                      {Object.entries(result).map(([key, val]) => (
                        <Box
                          key={key}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: 2,
                            pb: 1.5,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {String(key).replaceAll("_", " ")}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: "monospace" }}>
                            {renderValue(val)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : null}
                </Paper>
              </Fade>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 3,
                  textAlign: "center",
                  opacity: 0.6,
                }}
              >
                <CalculateIcon sx={{ fontSize: 48, mb: 1, opacity: 0.4 }} />
                <Typography variant="body1" color="text.secondary">
                  Fill in the form and click Calculate
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Results will appear here instantly
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* ===== How to Use + FAQ (SEO content under calculator) ===== */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              component="section"
              sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
                <HelpIcon color="primary" />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                  How to Use the {calc.name}
                </Typography>
              </Stack>
              <Stack spacing={1.8}>
                {howToSteps.map((s, i) => (
                  <Stack key={i} direction="row" spacing={2}>
                    <Box
                      sx={{
                        width: 28, height: 28, borderRadius: "50%", flexShrink: 0, mt: 0.2,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        bgcolor: "primary.main", color: "primary.contrastText",
                        fontWeight: 700, fontSize: 13,
                      }}
                    >
                      {i + 1}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {s}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              component="section"
              sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
                <HelpIcon color="primary" />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                  Frequently Asked Questions
                </Typography>
              </Stack>
              {faqs.map((f, i) => (
                <Accordion key={i} elevation={0} sx={{ bgcolor: "transparent", "&:before": { display: "none" }, mb: 0.5, border: "1px solid", borderColor: "divider", borderRadius: "10px !important" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: "10px" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{f.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {f.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>
        </Grid>

        {/* Related calculators */}
        <Box component="section" sx={{ mt: 5 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Related Calculators
          </Typography>
          <Grid container spacing={2}>
            {/* Simple: pass via prop from parent is complex; show category siblings */}
            <RelatedCalculators calc={calc} onOpen={onOpenCalc} />
          </Grid>
        </Box>
      </Container>
    </>
  )
}

function RelatedCalculators({ calc, onOpen }: { calc: CalculatorDef; onOpen: (c: CalculatorDef) => void }) {
  const [related, setRelated] = useState<CalculatorDef[]>([])
  useEffect(() => {
    listCalculators()
      .then((data) => {
        const siblings = (data.categories[calc.category] || [])
          .filter((c) => c.id !== calc.id)
          .slice(0, 3)
        setRelated(siblings)
      })
      .catch(() => {})
  }, [calc.id])
  return (
    <>
      {related.map((c) => (
        <Grid key={c.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <CalcCard calc={c} onOpen={onOpen} />
        </Grid>
      ))}
    </>
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
