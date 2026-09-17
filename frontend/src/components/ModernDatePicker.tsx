"use client"

import * as React from "react"
import { useMemo } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import TodayIcon from "@mui/icons-material/Today"

const MONTHS = [
  { value: "01", name: "Jan", full: "January" },
  { value: "02", name: "Feb", full: "February" },
  { value: "03", name: "Mar", full: "March" },
  { value: "04", name: "Apr", full: "April" },
  { value: "05", name: "May", full: "May" },
  { value: "06", name: "Jun", full: "June" },
  { value: "07", name: "Jul", full: "July" },
  { value: "08", name: "Aug", full: "August" },
  { value: "09", name: "Sep", full: "September" },
  { value: "10", name: "Oct", full: "October" },
  { value: "11", name: "Nov", full: "November" },
  { value: "12", name: "Dec", full: "December" },
]

interface ModernDatePickerProps {
  label: string
  value?: string // YYYY-MM-DD
  onChange: (value: string) => void
  helperText?: string
  required?: boolean
}

export default function ModernDatePicker({
  label,
  value,
  onChange,
  helperText,
  required = false,
}: ModernDatePickerProps) {
  const hiddenDateInputRef = React.useRef<HTMLInputElement>(null)

  // Parse YYYY-MM-DD or default to today's date
  const parsed = useMemo(() => {
    const today = new Date()
    const defYear = today.getFullYear()
    const defMonth = String(today.getMonth() + 1).padStart(2, "0")
    const defDay = String(today.getDate()).padStart(2, "0")

    if (!value || typeof value !== "string" || !value.includes("-")) {
      return { year: defYear, month: defMonth, day: defDay }
    }

    const parts = value.split("-")
    const y = parseInt(parts[0], 10) || defYear
    const m = parts[1] ? parts[1].padStart(2, "0") : defMonth
    const d = parts[2] ? parts[2].padStart(2, "0") : defDay

    return { year: y, month: m, day: d }
  }, [value])

  // Calculate days in selected month and year
  const daysInMonth = useMemo(() => {
    const y = parsed.year
    const m = parseInt(parsed.month, 10)
    return new Date(y, m, 0).getDate()
  }, [parsed.year, parsed.month])

  const handleMonthChange = (newMonth: string) => {
    const d = Math.min(parseInt(parsed.day, 10), new Date(parsed.year, parseInt(newMonth, 10), 0).getDate())
    const formattedDay = String(d).padStart(2, "0")
    onChange(`${parsed.year}-${newMonth}-${formattedDay}`)
  }

  const handleDayChange = (newDay: string) => {
    onChange(`${parsed.year}-${parsed.month}-${newDay.padStart(2, "0")}`)
  }

  const handleYearChange = (newYearStr: string) => {
    const y = parseInt(newYearStr, 10)
    if (!isNaN(y)) {
      const maxDays = new Date(y, parseInt(parsed.month, 10), 0).getDate()
      const d = Math.min(parseInt(parsed.day, 10), maxDays)
      onChange(`${y}-${parsed.month}-${String(d).padStart(2, "0")}`)
    }
  }

  const setToday = () => {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, "0")
    const d = String(today.getDate()).padStart(2, "0")
    onChange(`${y}-${m}-${d}`)
  }

  const handleNativePickerClick = () => {
    if (hiddenDateInputRef.current) {
      if (typeof hiddenDateInputRef.current.showPicker === "function") {
        try {
          hiddenDateInputRef.current.showPicker()
        } catch {
          hiddenDateInputRef.current.focus()
        }
      } else {
        hiddenDateInputRef.current.focus()
      }
    }
  }

  const formattedMonthName = MONTHS.find((m) => m.value === parsed.month)?.name || parsed.month
  const formattedDisplay = `${formattedMonthName} ${parseInt(parsed.day, 10)}, ${parsed.year}`

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2.5,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "#cbd5e1",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      }}
    >
      {/* Top Header: Label + Formatted Badge + Today Shortcut */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
          {label} {required && <Box component="span" sx={{ color: "#ef4444" }}>*</Box>}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            icon={<CalendarMonthIcon sx={{ fontSize: "14px !important", color: "#4f46e5 !important" }} />}
            label={formattedDisplay}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: 12,
              bgcolor: "#eff6ff",
              color: "#1e40af",
              border: "1px solid #dbeafe",
            }}
          />
          <Tooltip title="Set to Today">
            <Button
              size="small"
              onClick={setToday}
              startIcon={<TodayIcon sx={{ fontSize: 14 }} />}
              sx={{
                py: 0.2,
                px: 1,
                fontSize: 11.5,
                fontWeight: 600,
                color: "#475569",
                bgcolor: "#f1f5f9",
                borderRadius: 1.5,
                "&:hover": { bgcolor: "#e2e8f0", color: "#0f172a" },
              }}
            >
              Today
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* 3-Part Split Inputs: Month, Day, Year + Visual Calendar Icon */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
        {/* Month Dropdown */}
        <FormControl size="small" sx={{ flexGrow: 1.2, minWidth: { xs: "100%", sm: 110 } }}>
          <Select
            value={parsed.month}
            onChange={(e) => handleMonthChange(e.target.value)}
            sx={{
              borderRadius: 2,
              bgcolor: "#f8fafc",
              fontSize: 13.5,
              fontWeight: 600,
              color: "#0f172a",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#94a3b8" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#4f46e5" },
            }}
          >
            {MONTHS.map((m) => (
              <MenuItem key={m.value} value={m.value} sx={{ fontSize: 13.5 }}>
                <Box component="span" sx={{ fontWeight: 600, mr: 0.5 }}>{m.name}</Box>
                <Box component="span" sx={{ color: "#64748b", fontSize: 12 }}>({m.full})</Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Day Dropdown */}
        <FormControl size="small" sx={{ flexGrow: 1, minWidth: { xs: "48%", sm: 80 } }}>
          <Select
            value={String(Math.min(parseInt(parsed.day, 10), daysInMonth)).padStart(2, "0")}
            onChange={(e) => handleDayChange(e.target.value)}
            sx={{
              borderRadius: 2,
              bgcolor: "#f8fafc",
              fontSize: 13.5,
              fontWeight: 600,
              color: "#0f172a",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#94a3b8" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#4f46e5" },
            }}
          >
            {Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, "0")).map((dayStr) => (
              <MenuItem key={dayStr} value={dayStr} sx={{ fontSize: 13.5, fontWeight: 500 }}>
                {parseInt(dayStr, 10)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Year Input / Number */}
        <TextField
          size="small"
          type="number"
          value={parsed.year}
          onChange={(e) => handleYearChange(e.target.value)}
          slotProps={{ htmlInput: { min: 1900, max: 2100, step: 1 } }}
          sx={{
            flexGrow: 1,
            minWidth: { xs: "48%", sm: 95 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#f8fafc",
              fontSize: 13.5,
              fontWeight: 600,
              color: "#0f172a",
              "& fieldset": { borderColor: "#cbd5e1" },
              "&:hover fieldset": { borderColor: "#94a3b8" },
              "&.Mui-focused fieldset": { borderColor: "#4f46e5" },
            },
          }}
        />

        {/* Calendar Picker Trigger */}
        <Tooltip title="Open Calendar Popover">
          <IconButton
            onClick={handleNativePickerClick}
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#2563eb",
              flexShrink: 0,
              "&:hover": { bgcolor: "#dbeafe", color: "#1d4ed8" },
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        {/* Hidden Native Date Input for Picker */}
        <input
          ref={hiddenDateInputRef}
          type="date"
          value={`${parsed.year}-${parsed.month}-${parsed.day}`}
          onChange={(e) => {
            if (e.target.value) {
              onChange(e.target.value)
            }
          }}
          style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
        />
      </Box>

      {helperText && (
        <Typography variant="caption" sx={{ display: "block", mt: 1, color: "#64748b", fontSize: 12 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  )
}
