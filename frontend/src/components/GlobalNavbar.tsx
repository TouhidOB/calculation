"use client"

import * as React from "react"
import { useContext, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ColorModeContext } from "@/theme/ThemeRegistry"
import { CATEGORY_META, listCalculators, type CalculatorDef, type CategoryMap } from "@/lib/calculator-api"
import { getCalcIcon } from "@/lib/calc-icons"
import { getIconComponent } from "@/lib/icon-registry"

// MUI Components
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
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Paper from "@mui/material/Paper"
import Popper from "@mui/material/Popper"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import MenuItem from "@mui/material/MenuItem"
import MenuList from "@mui/material/MenuList"
import Button from "@mui/material/Button"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"

// Icons
import MenuIcon from "@mui/icons-material/Menu"
import SearchIcon from "@mui/icons-material/Search"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import CalculateIcon from "@mui/icons-material/Calculate"
import HomeIcon from "@mui/icons-material/Home"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import CloseIcon from "@mui/icons-material/Close"

// Category Icons
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ConstructionIcon from "@mui/icons-material/Construction"
import FunctionsIcon from "@mui/icons-material/Functions"
import CheckroomIcon from "@mui/icons-material/Checkroom"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import ScheduleIcon from "@mui/icons-material/Schedule"
import SchoolIcon from "@mui/icons-material/School"
import HomeWorkIcon from "@mui/icons-material/HomeWork"
import CelebrationIcon from "@mui/icons-material/Celebration"

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

const DRAWER_WIDTH = 280

interface GlobalNavbarProps {
  currentCategory?: string
  currentCalcId?: string
  showCategoryBar?: boolean
}

export default function GlobalNavbar({
  currentCategory,
  currentCalcId,
  showCategoryBar = true,
}: GlobalNavbarProps) {
  const theme = useTheme()
  const router = useRouter()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { toggleColorMode } = useContext(ColorModeContext)

  const [categories, setCategories] = useState<CategoryMap>({})
  const [total, setTotal] = useState(689)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchAnchor, setSearchAnchor] = useState<null | HTMLElement>(null)

  useEffect(() => {
    listCalculators()
      .then((data) => {
        if (data && data.categories) {
          setCategories(data.categories)
          setTotal(data.total || 689)
        }
      })
      .catch(() => {
        // Fallback or ignore
      })
  }, [])

  // Flatten all calculators for instant global search
  const allCalculators = useMemo(() => {
    const list: CalculatorDef[] = []
    Object.values(categories).forEach((calcs) => {
      if (Array.isArray(calcs)) {
        calcs.forEach((c) => list.push(c))
      }
    })
    return list
  }, [categories])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase().trim()
    return allCalculators
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      )
      .slice(0, 8)
  }, [allCalculators, searchQuery])

  const handleSearchSelect = (calcId: string) => {
    setSearchQuery("")
    setSearchAnchor(null)
    router.push(`/calculators/${calcId}`)
  }

  const drawerContent = (
    <Box sx={{ width: DRAWER_WIDTH, pt: 2, height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2, pb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <CalculateIcon color="primary" sx={{ fontSize: 30 }} />
        <Typography variant="h6" noWrap sx={{ fontWeight: 800, background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          CalcHub
        </Typography>
        <Chip label={`${total}+`} size="small" color="primary" sx={{ ml: "auto", fontWeight: 700 }} />
      </Box>
      <Divider />
      <List sx={{ px: 1, flexGrow: 1, overflowY: "auto" }}>
        <ListItemButton
          component={Link}
          href="/"
          onClick={() => setDrawerOpen(false)}
          selected={!currentCategory && !currentCalcId}
          sx={{ borderRadius: 2, mb: 0.5 }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary="All Calculators"
            secondary="Browse full directory"
            slotProps={{
              primary: { sx: { fontWeight: 600, fontSize: 14 } },
              secondary: { sx: { fontSize: 12 } },
            }}
          />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />
        <Typography variant="caption" sx={{ px: 2, py: 0.5, color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Categories
        </Typography>

        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const count = categories[key]?.length || 0
          const isSelected = currentCategory === key
          return (
            <ListItemButton
              key={key}
              component={Link}
              href={`/?cat=${key}`}
              onClick={() => setDrawerOpen(false)}
              selected={isSelected}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: meta.color }}>
                {CATEGORY_ICONS[key] || <CalculateIcon />}
              </ListItemIcon>
              <ListItemText
                primary={meta.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: 14,
                    },
                  },
                }}
              />
              <Chip
                label={count > 0 ? count : meta.emoji}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  bgcolor: isSelected ? meta.color : undefined,
                  color: isSelected ? "#fff" : "text.secondary",
                }}
              />
            </ListItemButton>
          )
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="caption" color="text.secondary">
          Mode
        </Typography>
        <IconButton size="small" onClick={toggleColorMode}>
          {theme.palette.mode === "dark" ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
        </IconButton>
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: theme.palette.mode === "dark" ? "rgba(18, 18, 24, 0.85)" : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "text.primary",
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1.5, sm: 2 } }}>
          <Toolbar disableGutters sx={{ minHeight: { xs: 58, md: 66 }, gap: 1.5 }}>
            {/* Drawer Toggle */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 0.5 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Brand Logo & Name */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                textDecoration: "none",
                color: "inherit",
                mr: { xs: 0, sm: 2 },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
                }}
              >
                <CalculateIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontWeight: 900,
                    letterSpacing: "-0.5px",
                    lineHeight: 1.1,
                    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  CalcHub
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, display: "block" }}>
                  689+ Free Tools
                </Typography>
              </Box>
            </Box>

            {/* Global Quick Search Bar */}
            <Box sx={{ flexGrow: 1, position: "relative", maxWidth: { xs: "100%", md: 480 } }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search 680+ calculators..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSearchAnchor(e.currentTarget)
                }}
                onFocus={(e) => {
                  if (searchQuery.trim()) setSearchAnchor(e.currentTarget)
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery("")}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                    fontSize: 14,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.06)",
                    },
                    "&.Mui-focused": {
                      bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,1)",
                    },
                  },
                }}
              />

              {/* Instant Search Popup Dropdown */}
              {searchQuery.trim().length > 0 && (
                <Popper
                  open={Boolean(searchAnchor && searchResults.length > 0)}
                  anchorEl={searchAnchor}
                  placement="bottom-start"
                  style={{ width: searchAnchor ? searchAnchor.clientWidth : 300, zIndex: 1400 }}
                >
                  <ClickAwayListener onClickAway={() => setSearchAnchor(null)}>
                    <Paper
                      elevation={8}
                      sx={{
                        mt: 1,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        maxHeight: 400,
                        overflowY: "auto",
                        p: 1,
                      }}
                    >
                      <MenuList dense>
                        {searchResults.map((c) => {
                          const meta = CATEGORY_META[c.category]
                          return (
                            <MenuItem
                              key={c.id}
                              onClick={() => handleSearchSelect(c.id)}
                              sx={{
                                borderRadius: 2,
                                py: 1,
                                px: 1.5,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                mb: 0.5,
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, flexGrow: 1 }}>
                                  {c.name}
                                </Typography>
                                {meta && (
                                  <Chip
                                    label={meta.label}
                                    size="small"
                                    sx={{
                                      height: 20,
                                      fontSize: 10,
                                      fontWeight: 600,
                                      bgcolor: `${meta.color}22`,
                                      color: meta.color,
                                    }}
                                  />
                                )}
                              </Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  width: "100%",
                                  mt: 0.2,
                                }}
                              >
                                {c.description}
                              </Typography>
                            </MenuItem>
                          )
                        })}
                      </MenuList>
                    </Paper>
                  </ClickAwayListener>
                </Popper>
              )}
            </Box>

            {/* Right Quick Actions */}
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", ml: "auto" }}>
              <Button
                component={Link}
                href="/"
                variant="text"
                size="small"
                startIcon={<HomeIcon />}
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                All Tools
              </Button>

              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                aria-label="toggle light/dark theme"
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2.5,
                  p: 1,
                }}
              >
                {theme.palette.mode === "dark" ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
              </IconButton>
            </Stack>
          </Toolbar>

          {/* Horizontal Scrollable Category Bar */}
          {showCategoryBar && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                overflowX: "auto",
                pb: 1.5,
                pt: 0.5,
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
              }}
            >
              <Chip
                label="🏠 All Categories"
                component={Link}
                href="/"
                clickable
                variant={!currentCategory ? "filled" : "outlined"}
                color={!currentCategory ? "primary" : "default"}
                size="small"
                sx={{ fontWeight: 600, borderRadius: 2, flexShrink: 0 }}
              />
              {Object.entries(CATEGORY_META).map(([catKey, meta]) => {
                const isActive = currentCategory === catKey
                return (
                  <Chip
                    key={catKey}
                    label={`${meta.emoji} ${meta.label}`}
                    component={Link}
                    href={`/?cat=${catKey}`}
                    clickable
                    size="small"
                    sx={{
                      fontWeight: isActive ? 700 : 500,
                      borderRadius: 2,
                      flexShrink: 0,
                      bgcolor: isActive ? `${meta.color}22` : undefined,
                      borderColor: isActive ? meta.color : undefined,
                      color: isActive ? meta.color : "text.primary",
                      border: "1px solid",
                    }}
                  />
                )
              })}
            </Box>
          )}
        </Container>
      </AppBar>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}
