"use client"

import * as React from "react"
import { useContext, useEffect, useMemo, useState } from "react"
import { ColorModeContext } from "@/theme/ThemeRegistry"
import { listCalculators, runCalculator, getCalculatorScript, type CategoryMap, type CalculatorDef, CATEGORY_META } from "@/lib/calculator-api"
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
import { useTheme } from "@mui/material/styles"

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
        {Object.keys(categories).map((cat) => {
          const meta = CATEGORY_META[cat]
          const count = categories[cat]?.length || 0
          return (
            <ListItemButton
              key={cat}
              selected={activeCat === cat && !activeCalc}
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
                onClick={() => { setActiveCalc(null) }}
              >
                <HomeIcon fontSize="small" />
                {CATEGORY_META[activeCat || ""]?.label || "Home"}
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
                placeholder="Search calculators…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
            <CalculatorRunner calc={activeCalc} onBack={() => setActiveCalc(null)} />
          ) : (
            <>
              {/* Category header */}
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center",  mb: 1 }}>
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
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {search && allFiltered
                        ? `Search: "${search}"`
                        : CATEGORY_META[activeCat || ""]?.label || "Calculators"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {displayCalcs.length} calculator{displayCalcs.length !== 1 ? "s" : ""}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Calculator cards grid */}
              <Grid container spacing={2}>
                {displayCalcs.map((calc, i) => {
                  const catMeta = CATEGORY_META[calc.category]
                  return (
                    <Grid key={calc.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                      <Fade in timeout={200 + i * 60}>
                        <Card>
                          <CardActionArea onClick={() => setActiveCalc(calc)} sx={{ p: 0 }}>
                            <CardContent sx={{ p: 2.5 }}>
                              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: `linear-gradient(135deg, ${catMeta?.color || "#888"}33, ${catMeta?.color || "#888"}11)`,
                                    color: catMeta?.color,
                                  }}
                                >
                                  {(() => {
                                    const iconName = getCalcIcon(calc.id)
                                    const IconComp = getIconComponent(iconName)
                                    return <IconComp fontSize="medium" />
                                  })()}
                                </Box>
                                <Chip
                                  label={catMeta?.label || calc.category}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: 11,
                                    bgcolor: `${catMeta?.color || "#888"}22`,
                                    color: catMeta?.color,
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ ml: "auto !important" }}>
                                  {calc.fields.length} fields
                                </Typography>
                              </Stack>
                              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                {calc.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                                {calc.description}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
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

/* ---------- Calculator Runner ---------- */

function CalculatorRunner({
  calc,
  onBack,
}: {
  calc: CalculatorDef
  onBack: () => void
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

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
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
    url: `https://calchub.io/calculators/${calc.id}`,
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
      <Container maxWidth="md" disableGutters>
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
            <Stack direction="row" spacing={1} sx={{ alignItems: "center",  mb: 0.5 }}>
              <Chip
                label={catMeta?.label || calc.category}
                size="small"
                sx={{
                  bgcolor: `${catMeta?.color || "#888"}22`,
                  color: catMeta?.color,
                }}
              />
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
                  sx={{ py: 1.5, fontSize: 16 }}
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
                <Stack direction="row" spacing={1} sx={{ alignItems: "center",  mb: 2 }}>
                  <CheckCircleIcon color="primary" />
                  <Typography variant="h6" color="primary.main">
                    Result
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
                Results will appear here
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
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
