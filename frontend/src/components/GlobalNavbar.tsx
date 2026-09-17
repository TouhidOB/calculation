"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CATEGORY_META, listCalculators, type CalculatorDef, type CategoryMap } from "@/lib/calculator-api"

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
import Paper from "@mui/material/Paper"
import Popper from "@mui/material/Popper"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import MenuItem from "@mui/material/MenuItem"
import MenuList from "@mui/material/MenuList"
import Button from "@mui/material/Button"

// Icons
import CalculatorLogoIcon from "@/components/CalculatorLogoIcon"
import MenuIcon from "@mui/icons-material/Menu"
import SearchIcon from "@mui/icons-material/Search"
import CalculateIcon from "@mui/icons-material/Calculate"
import HomeIcon from "@mui/icons-material/Home"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import CloseIcon from "@mui/icons-material/Close"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"

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

const DRAWER_WIDTH = 290

export interface GlobalNavbarProps {
  currentCategory?: string
  currentCalcId?: string
  showCategoryBar?: boolean
}

export default function GlobalNavbar({
  currentCategory,
  showCategoryBar = true,
}: GlobalNavbarProps) {
  const router = useRouter()

  const [categories, setCategories] = useState<CategoryMap>({})
  const [total, setTotal] = useState(689)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchAnchor, setSearchAnchor] = useState<null | HTMLElement>(null)
  const categoryScrollRef = React.useRef<HTMLDivElement>(null)

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: direction === "left" ? -280 : 280,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    listCalculators()
      .then((data) => {
        if (data && data.categories) {
          setCategories(data.categories)
          setTotal(data.total || 689)
        }
      })
      .catch(() => {
        // Fallback
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

  // Filtered calculators based on search
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
      .slice(0, 10)
  }, [allCalculators, searchQuery])

  const handleSelectCalc = (calcId: string) => {
    setSearchQuery("")
    setSearchAnchor(null)
    setDrawerOpen(false)
    router.push(`/calculators/${calcId}`)
  }

  const handleSelectCategory = (catKey: string) => {
    setDrawerOpen(false)
    router.push(`/?cat=${catKey}`)
  }

  // Side Drawer Content
  const drawerContent = (
    <Box sx={{ width: DRAWER_WIDTH, bgcolor: "#ffffff", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e2e8f0",
          bgcolor: "#f8fafc",
        }}
      >
        <Box
          component={Link}
          href="/"
          onClick={() => setDrawerOpen(false)}
          sx={{ display: "flex", alignItems: "center", gap: 1.2, textDecoration: "none", color: "inherit" }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
            }}
          >
            <CalculatorLogoIcon size={22} color="#ffffff" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1, color: "#0f172a" }}>
              TryCalc
            </Typography>
            <Typography variant="caption" sx={{ color: "#475569", fontSize: 11 }}>
              {total}+ Free Calculators
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={() => setDrawerOpen(false)} sx={{ color: "#475569" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Categories List */}
      <List sx={{ px: 1.5, py: 1.5, flexGrow: 1, overflowY: "auto" }}>
        <ListItemButton
          component={Link}
          href="/"
          onClick={() => setDrawerOpen(false)}
          sx={{
            borderRadius: 2,
            mb: 0.5,
            py: 1.2,
            "&:hover": { bgcolor: "rgba(79, 70, 229, 0.06)" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 38, color: "#4f46e5" }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary="All Calculators"
            secondary="Browse full directory"
            slotProps={{
              primary: { sx: { fontWeight: 700, fontSize: 14, color: "#0f172a" } },
              secondary: { sx: { fontSize: 12, color: "#475569" } },
            }}
          />
        </ListItemButton>

        <Divider sx={{ my: 1, borderColor: "#e2e8f0" }} />
        <Typography
          variant="caption"
          sx={{ px: 1.5, py: 0.5, display: "block", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, fontSize: 11 }}
        >
          Categories
        </Typography>

        {Object.keys(CATEGORY_META).map((catKey) => {
          const meta = CATEGORY_META[catKey]
          const count = categories[catKey]?.length || 0
          const isSelected = currentCategory === catKey

          return (
            <ListItemButton
              key={catKey}
              onClick={() => handleSelectCategory(catKey)}
              selected={isSelected}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 1,
                bgcolor: isSelected ? "rgba(79, 70, 229, 0.08)" : "transparent",
                "&:hover": { bgcolor: "rgba(79, 70, 229, 0.05)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: meta.color }}>
                {CATEGORY_ICONS[catKey] || <CalculateIcon />}
              </ListItemIcon>
              <ListItemText
                primary={meta.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: 13.5,
                      color: isSelected ? "#4f46e5" : "#0f172a",
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
                  fontWeight: 700,
                  bgcolor: isSelected ? "#4f46e5" : "#f1f5f9",
                  color: isSelected ? "#fff" : "#475569",
                  border: "1px solid",
                  borderColor: isSelected ? "#4f46e5" : "#e2e8f0",
                }}
              />
            </ListItemButton>
          )
        })}
      </List>
      <Divider sx={{ borderColor: "#e2e8f0" }} />
      <Box sx={{ p: 2, bgcolor: "#f8fafc", textAlign: "center" }}>
        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500, display: "block" }}>
          TryCalc © 2026 · 100% Free &amp; Open
        </Typography>
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e2e8f0",
          color: "#0f172a",
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 1.5, sm: 2.5, md: 4 } }}>
          <Toolbar disableGutters sx={{ minHeight: { xs: 58, md: 66 }, gap: { xs: 1, sm: 2 } }}>
            {/* Drawer Toggle */}
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                p: 0.8,
                bgcolor: "#f8fafc",
                "&:hover": { bgcolor: "#f1f5f9" },
              }}
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
                gap: { xs: 1, sm: 1.2 },
                textDecoration: "none",
                color: "inherit",
                mr: { xs: 1, sm: 2 },
                flexShrink: 0,
              }}
            >
              <Box
                aria-label="TryCalc Calculator Logo"
                sx={{
                  width: { xs: 34, sm: 36 },
                  height: { xs: 34, sm: 36 },
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                  flexShrink: 0,
                }}
              >
                <CalculatorLogoIcon size={20} color="#ffffff" />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  component="span"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: 17, sm: 21, md: 23 },
                    letterSpacing: "-0.03em",
                    color: "#0f172a",
                    display: "block",
                    lineHeight: 1.1,
                  }}
                >
                  TryCalc
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: "#475569",
                    display: { xs: "none", sm: "block" },
                    lineHeight: 1,
                  }}
                >
                  {total}+ Free Tools
                </Typography>
              </Box>
            </Box>

            {/* Global Quick Search Bar */}
            <Box sx={{ flexGrow: 1, position: "relative", maxWidth: { xs: "100%", md: 540 } }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search 680+ calculators (e.g. BMI, Mortgage, Age)..."
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
                        <SearchIcon sx={{ color: "#4f46e5", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSearchQuery("")
                            setSearchAnchor(null)
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#f8fafc",
                    fontSize: 14,
                    color: "#0f172a",
                    "& fieldset": { borderColor: "#cbd5e1" },
                    "&:hover fieldset": { borderColor: "#94a3b8" },
                    "&.Mui-focused fieldset": { borderColor: "#4f46e5" },
                  },
                }}
              />

              {/* Search Dropdown Popper */}
              <Popper
                open={Boolean(searchAnchor && searchResults.length > 0)}
                anchorEl={searchAnchor}
                placement="bottom-start"
                style={{ width: searchAnchor ? searchAnchor.clientWidth : "auto", zIndex: 1400 }}
              >
                <ClickAwayListener onClickAway={() => setSearchAnchor(null)}>
                  <Paper
                    elevation={8}
                    sx={{
                      mt: 1,
                      maxHeight: 420,
                      overflowY: "auto",
                      borderRadius: 2.5,
                      border: "1px solid #cbd5e1",
                      bgcolor: "#ffffff",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)",
                    }}
                  >
                    <MenuList sx={{ p: 1 }}>
                      {searchResults.map((item) => {
                        const meta = CATEGORY_META[item.category]
                        return (
                          <MenuItem
                            key={item.id}
                            onClick={() => handleSelectCalc(item.id)}
                            sx={{
                              p: 1.2,
                              borderRadius: 1.5,
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              "&:hover": { bgcolor: "rgba(79, 70, 229, 0.06)" },
                            }}
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1.5,
                                bgcolor: `${meta?.color || "#4f46e5"}15`,
                                color: meta?.color || "#4f46e5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {CATEGORY_ICONS[item.category] || <CalculateIcon sx={{ fontSize: 18 }} />}
                            </Box>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }} noWrap>
                                {item.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#475569", display: "block" }} noWrap>
                                {item.description}
                              </Typography>
                            </Box>
                            <Chip
                              label={meta?.label || item.category}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: 10.5,
                                fontWeight: 600,
                                bgcolor: `${meta?.color || "#4f46e5"}18`,
                                color: meta?.color || "#4f46e5",
                                flexShrink: 0,
                              }}
                            />
                            <ArrowForwardIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                          </MenuItem>
                        )
                      })}
                    </MenuList>
                  </Paper>
                </ClickAwayListener>
              </Popper>
            </Box>

            {/* Right Action: Category Drawer Open */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setDrawerOpen(true)}
                startIcon={<CalculateIcon sx={{ color: "#4f46e5" }} />}
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  borderRadius: 2,
                  borderColor: "#cbd5e1",
                  color: "#0f172a",
                  fontWeight: 600,
                  fontSize: 13,
                  py: 0.8,
                  px: 1.8,
                  bgcolor: "#ffffff",
                  "&:hover": {
                    borderColor: "#4f46e5",
                    bgcolor: "rgba(79, 70, 229, 0.04)",
                  },
                }}
              >
                Categories
              </Button>
            </Box>
          </Toolbar>

          {/* Subheader: Category Chips Horizontal Scroll Bar */}
          {showCategoryBar && (
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                borderTop: "1px solid #f1f5f9",
                py: 0.8,
              }}
            >
              {/* Left Scroll Chevron */}
              <IconButton
                size="small"
                onClick={() => scrollCategories("left")}
                sx={{
                  display: { xs: "none", sm: "flex" },
                  width: 28,
                  height: 28,
                  mr: 0.5,
                  bgcolor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  color: "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  "&:hover": { bgcolor: "#f1f5f9", color: "#4f46e5" },
                }}
                aria-label="Scroll left"
              >
                <ChevronLeftIcon sx={{ fontSize: 18 }} />
              </IconButton>

              {/* Scrollable Container */}
              <Box
                ref={categoryScrollRef}
                onWheel={(e) => {
                  if (e.deltaY && categoryScrollRef.current) {
                    categoryScrollRef.current.scrollLeft += e.deltaY * 0.8
                  }
                }}
                sx={{
                  flexGrow: 1,
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  pr: { xs: 4, sm: 6, md: 8 },
                  pl: 0.5,
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                }}
              >
                <Chip
                  component={Link}
                  href="/"
                  clickable
                  icon={<HomeIcon sx={{ fontSize: "16px !important", color: !currentCategory ? "#fff !important" : "#475569 !important" }} />}
                  label="All (689+)"
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: 12,
                    height: 30,
                    px: 0.5,
                    bgcolor: !currentCategory ? "#4f46e5" : "#f1f5f9",
                    color: !currentCategory ? "#ffffff" : "#0f172a",
                    border: "1px solid",
                    borderColor: !currentCategory ? "#4f46e5" : "#e2e8f0",
                    "&:hover": {
                      bgcolor: !currentCategory ? "#4338ca" : "#e2e8f0",
                    },
                  }}
                />
                {Object.keys(CATEGORY_META).map((catKey) => {
                  const meta = CATEGORY_META[catKey]
                  const count = categories[catKey]?.length || 0
                  const isSelected = currentCategory === catKey

                  return (
                    <Chip
                      key={catKey}
                      component={Link}
                      href={`/?cat=${catKey}`}
                      clickable
                      label={`${meta.emoji} ${meta.label}${count > 0 ? ` (${count})` : ""}`}
                      size="small"
                      sx={{
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: 12,
                        height: 30,
                        px: 0.5,
                        flexShrink: 0,
                        bgcolor: isSelected ? "#4f46e5" : "#ffffff",
                        color: isSelected ? "#ffffff" : "#0f172a",
                        border: "1px solid",
                        borderColor: isSelected ? "#4f46e5" : "#e2e8f0",
                        "&:hover": {
                          borderColor: meta.color,
                          bgcolor: isSelected ? "#4338ca" : `${meta.color}15`,
                        },
                      }}
                    />
                  )
                })}
              </Box>

              {/* Right Scroll Chevron */}
              <IconButton
                size="small"
                onClick={() => scrollCategories("right")}
                sx={{
                  display: { xs: "none", sm: "flex" },
                  width: 28,
                  height: 28,
                  ml: 0.5,
                  bgcolor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  color: "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  "&:hover": { bgcolor: "#f1f5f9", color: "#4f46e5" },
                }}
                aria-label="Scroll right"
              >
                <ChevronRightIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          )}
        </Container>
      </AppBar>

      {/* Side Drawer Component */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "#ffffff",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}
