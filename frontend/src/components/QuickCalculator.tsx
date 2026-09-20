"use client"

import React, { useState, useEffect, useCallback } from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Grid"
import CalculateIcon from "@mui/icons-material/Calculate"
import ScienceIcon from "@mui/icons-material/Science"
import BackspaceIcon from "@mui/icons-material/Backspace"

/* ---------- Safe Math Engine ---------- */

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN
  if (n === 0 || n === 1) return 1
  let res = 1
  for (let i = 2; i <= Math.min(n, 170); i++) res *= i
  return res
}

function autoCloseParens(str: string): string {
  let open = 0
  for (const ch of str) {
    if (ch === "(") open++
    else if (ch === ")") open--
  }
  if (open > 0) return str + ")".repeat(open)
  return str
}

function evaluateExpression(rawExpr: string, angleMode: "deg" | "rad"): string {
  try {
    if (!rawExpr || !rawExpr.trim()) return "0"

    let s = rawExpr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-")
      .replace(/π/g, "Math.PI")
      .replace(/\be\b/g, "Math.E")
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/∛\(/g, "Math.cbrt(")

    // Implicit multiplication: 2( -> 2*(, )( -> )*(, )2 -> )*2, 2π -> 2*π
    s = s.replace(/(\d)(\()/g, "$1*(")
    s = s.replace(/(\))(\()/g, "$1*(")
    s = s.replace(/(\))(\d)/g, "$1*$2")
    s = s.replace(/(\d)(π|e|sin|cos|tan|asin|acos|atan|log|ln|sqrt)/g, "$1*$2")
    s = s.replace(/(π|e)(\d)/g, "$1*$2")
    s = s.replace(/(π|e)(\()/g, "$1*(")

    // Percentage: e.g. 50% -> (50/100)
    s = s.replace(/(\d+(\.\d+)?|\([^)]+\))%/g, "($1/100)")

    // Factorial: e.g. 5! -> factorial(5)
    s = s.replace(/(\d+(\.\d+)?|\([^)]+\))!/g, "factorial($1)")

    // Exponentiation: ^ to **
    s = s.replace(/\^/g, "**")

    // Auto-close missing parentheses
    s = autoCloseParens(s)

    const isDeg = angleMode === "deg"
    const scope = {
      Math,
      factorial,
      sin: (x: number) => Math.sin(isDeg ? (x * Math.PI) / 180 : x),
      cos: (x: number) => Math.cos(isDeg ? (x * Math.PI) / 180 : x),
      tan: (x: number) => {
        if (isDeg && Math.abs((x % 180) - 90) < 1e-9) return NaN
        return Math.tan(isDeg ? (x * Math.PI) / 180 : x)
      },
      asin: (x: number) =>
        isDeg ? (Math.asin(x) * 180) / Math.PI : Math.asin(x),
      acos: (x: number) =>
        isDeg ? (Math.acos(x) * 180) / Math.PI : Math.acos(x),
      atan: (x: number) =>
        isDeg ? (Math.atan(x) * 180) / Math.PI : Math.atan(x),
      sqrt: Math.sqrt,
      cbrt: Math.cbrt,
      log: Math.log10,
      ln: Math.log,
      exp: Math.exp,
      abs: Math.abs,
    }

    const fn = new Function(...Object.keys(scope), `return (${s});`)
    let val = fn(...Object.values(scope))

    if (typeof val !== "number" || !Number.isFinite(val)) {
      return "Error"
    }

    if (Math.abs(val) < 1e-12) val = 0
    return parseFloat(val.toPrecision(10)).toString()
  } catch {
    return "Error"
  }
}

/* ---------- QuickCalculator Component ---------- */

const BASIC_KEYS = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "=", "+",
]

export default function QuickCalculator() {
  const [mode, setMode] = useState<"basic" | "scientific">("basic")
  const [display, setDisplay] = useState("0")
  const [expr, setExpr] = useState("")
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg")
  const [isInverse, setIsInverse] = useState(false)
  const [ans, setAns] = useState("0")
  const [hasEvaluated, setHasEvaluated] = useState(false)

  /* --- Evaluation Trigger --- */
  const calculateResult = useCallback(() => {
    let fullExpr = expr ? `${expr} ${display}` : display
    if (fullExpr.endsWith("=") || !fullExpr.trim()) fullExpr = display

    const clean = fullExpr
      .replace(/=/g, "")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-")

    const res = evaluateExpression(clean, angleMode)
    setExpr(fullExpr + " =")
    setDisplay(res)
    if (res !== "Error") {
      setAns(res)
    }
    setHasEvaluated(true)
  }, [expr, display, angleMode])

  /* --- Button Press Handling --- */
  const press = useCallback(
    (k: string) => {
      // Equals
      if (k === "=") {
        calculateResult()
        return
      }

      // If user types a number right after evaluation, start fresh
      if (hasEvaluated && /[0-9.]/.test(k)) {
        setDisplay(k === "." ? "0." : k)
        setExpr("")
        setHasEvaluated(false)
        return
      }

      // If user types an operator after evaluation, continue with answer
      if (hasEvaluated && ["+", "-", "*", "/", "×", "÷", "−", "^"].includes(k)) {
        setExpr(display + " " + (k === "*" ? "×" : k === "/" ? "÷" : k === "-" ? "−" : k))
        setDisplay("0")
        setHasEvaluated(false)
        return
      }

      setHasEvaluated(false)

      // Basic Binary Operators
      if (["+", "-", "*", "/", "×", "÷", "−"].includes(k)) {
        const symbol = k === "*" ? "×" : k === "/" ? "÷" : k === "-" ? "−" : k
        setExpr((prev) => (prev ? `${prev} ${display} ${symbol}` : `${display} ${symbol}`))
        setDisplay("0")
        return
      }

      // Decimal
      if (k === ".") {
        if (!display.includes(".")) setDisplay((prev) => prev + ".")
        return
      }

      // Plus / Minus Toggle (±)
      if (k === "±") {
        setDisplay((prev) => {
          if (prev === "0" || prev === "Error") return prev
          return prev.startsWith("-") ? prev.slice(1) : "-" + prev
        })
        return
      }

      // Scientific Function Calls: sin, cos, tan, log, ln, sqrt, etc.
      if (["sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "sqrt"].includes(k)) {
        if (display === "0" || display === "Error") {
          setDisplay(`${k}(`)
        } else {
          setDisplay((prev) => `${k}(${prev})`)
        }
        return
      }

      // Exponentiation (x^y)
      if (k === "^") {
        setExpr((prev) => (prev ? `${prev} ${display} ^` : `${display} ^`))
        setDisplay("0")
        return
      }

      // Square (x^2)
      if (k === "x²") {
        setDisplay((prev) => `(${prev})^2`)
        return
      }

      // 10^x
      if (k === "10ˣ") {
        setDisplay((prev) => `10^(${prev})`)
        return
      }

      // e^x
      if (k === "eˣ") {
        setDisplay((prev) => `exp(${prev})`)
        return
      }

      // Factorial (!)
      if (k === "!") {
        setDisplay((prev) => (prev === "0" ? "0" : `${prev}!`))
        return
      }

      // Inverse (1/x)
      if (k === "1/x") {
        setDisplay((prev) => (prev === "0" ? "0" : `1/(${prev})`))
        return
      }

      // Percent (%)
      if (k === "%") {
        setDisplay((prev) => (prev === "0" ? "0" : `${prev}%`))
        return
      }

      // Constants π and e
      if (k === "π" || k === "e") {
        setDisplay((prev) => (prev === "0" || prev === "Error" ? k : prev + k))
        return
      }

      // Previous Answer (Ans)
      if (k === "Ans") {
        setDisplay((prev) => (prev === "0" || prev === "Error" ? ans : prev + ans))
        return
      }

      // Parentheses ( and )
      if (k === "(" || k === ")") {
        setDisplay((prev) => (prev === "0" && k === "(" ? "(" : prev + k))
        return
      }

      // Standard Digits 0-9
      setDisplay((prev) => (prev === "0" || prev === "Error" ? k : prev + k))
    },
    [display, expr, ans, hasEvaluated, calculateResult]
  )

  const clearAll = () => {
    setDisplay("0")
    setExpr("")
    setHasEvaluated(false)
  }

  const backspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"))
  }

  /* --- Keyboard Listener --- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid capturing when user is typing in search bar or input field
      const target = e.target as HTMLElement
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return

      if (e.key >= "0" && e.key <= "9") press(e.key)
      else if (e.key === ".") press(".")
      else if (e.key === "+") press("+")
      else if (e.key === "-") press("-")
      else if (e.key === "*") press("*")
      else if (e.key === "/") {
        e.preventDefault()
        press("/")
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault()
        press("=")
      } else if (e.key === "Backspace") {
        backspace()
      } else if (e.key === "Escape") {
        clearAll()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [press])

  return (
    <Paper
      elevation={0}
      component="section"
      aria-label={mode === "basic" ? "Quick online calculator" : "Realistic scientific calculator"}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "#ffffff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Header: Title + Mode Toggle Button */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {mode === "basic" ? (
            <CalculateIcon color="primary" sx={{ fontSize: 24 }} />
          ) : (
            <ScienceIcon sx={{ color: "#4f46e5", fontSize: 24 }} />
          )}
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: "1.05rem", sm: "1.2rem" } }}>
            {mode === "basic" ? "Quick Calculator" : "Scientific Calculator"}
          </Typography>
        </Stack>

        {/* The Toggle Button (Converts to Scientific / Basic) */}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {mode === "scientific" && (
            <Chip
              label={angleMode.toUpperCase()}
              size="small"
              onClick={() => setAngleMode((prev) => (prev === "deg" ? "rad" : "deg"))}
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                bgcolor: "#e0e7ff",
                color: "#3730a3",
                cursor: "pointer",
                "&:hover": { bgcolor: "#c7d2fe" },
              }}
              title="Click to toggle DEG / RAD"
            />
          )}

          <Button
            variant="outlined"
            size="small"
            startIcon={mode === "basic" ? <ScienceIcon /> : <CalculateIcon />}
            onClick={() => setMode((prev) => (prev === "basic" ? "scientific" : "basic"))}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.82rem",
              px: 1.5,
              py: 0.5,
              color: mode === "basic" ? "#4f46e5" : "#0f172a",
              borderColor: mode === "basic" ? "#c7d2fe" : "#cbd5e1",
              bgcolor: mode === "basic" ? "#f5f3ff" : "#f8fafc",
              boxShadow: mode === "basic" ? "0 2px 6px rgba(79, 70, 229, 0.12)" : "none",
              "&:hover": {
                bgcolor: mode === "basic" ? "#ede9fe" : "#f1f5f9",
                borderColor: mode === "basic" ? "#a5b4fc" : "#94a3b8",
              },
            }}
          >
            {mode === "basic" ? "Scientific" : "Basic"}
          </Button>
        </Stack>
      </Stack>

      {/* Realistic Digital LCD Screen */}
      <Box
        sx={{
          bgcolor: "#0f172a",
          borderRadius: 3,
          border: "1px solid #1e293b",
          px: 2,
          py: 1.2,
          mb: 2,
          textAlign: "right",
          minHeight: 76,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)",
          position: "relative",
        }}
      >
        {/* Upper Screen Status / Expression History */}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between", mb: 0.3 }}>
          <Stack direction="row" spacing={0.6}>
            {mode === "scientific" && (
              <>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    px: 0.6,
                    py: 0.1,
                    borderRadius: 1,
                    bgcolor: "rgba(56, 189, 248, 0.15)",
                    color: "#38bdf8",
                  }}
                >
                  {angleMode.toUpperCase()}
                </Typography>
                {isInverse && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      px: 0.6,
                      py: 0.1,
                      borderRadius: 1,
                      bgcolor: "rgba(244, 114, 182, 0.2)",
                      color: "#f472b6",
                    }}
                  >
                    INV
                  </Typography>
                )}
              </>
            )}
          </Stack>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "monospace",
              color: "#94a3b8",
              fontSize: "0.85rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {expr ? `${expr.replace(/\*/g, "×").replace(/\//g, "÷")}` : "\u00A0"}
          </Typography>
        </Stack>

        {/* Main Display: Bold High-Contrast Monospace Digits */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: "monospace",
            fontWeight: 800,
            color: "#f8fafc",
            wordBreak: "break-all",
            lineHeight: 1.15,
            fontSize: display.length > 12 ? "1.45rem" : display.length > 8 ? "1.85rem" : "2.1rem",
            letterSpacing: "-0.5px",
          }}
        >
          {display.replace(/\*/g, "×").replace(/\//g, "÷")}
        </Typography>
      </Box>

      {/* ==================== BASIC KEYPAD (DEFAULT) ==================== */}
      {mode === "basic" && (
        <Grid container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={1}>
              <Button
                onClick={clearAll}
                variant="contained"
                color="error"
                sx={{ flexGrow: 1, borderRadius: 2.5, py: 1.1, fontWeight: 800 }}
              >
                C
              </Button>
              <Button
                onClick={backspace}
                variant="outlined"
                sx={{ flexGrow: 1, borderRadius: 2.5, py: 1.1, color: "#475569", borderColor: "#cbd5e1" }}
                aria-label="backspace"
              >
                <BackspaceIcon fontSize="small" />
              </Button>
              <Button
                onClick={() => press("(")}
                variant="outlined"
                sx={{ flexGrow: 1, borderRadius: 2.5, py: 1.1, fontWeight: 700, color: "#475569", borderColor: "#cbd5e1" }}
              >
                (
              </Button>
              <Button
                onClick={() => press(")")}
                variant="outlined"
                sx={{ flexGrow: 1, borderRadius: 2.5, py: 1.1, fontWeight: 700, color: "#475569", borderColor: "#cbd5e1" }}
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
                  fontSize: "1.2rem",
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
      )}

      {/* ==================== SCIENTIFIC KEYPAD ==================== */}
      {mode === "scientific" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
          {/* Row 1: DEG/RAD, Inv, π, e, C */}
          <Grid container spacing={0.8}>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setAngleMode((prev) => (prev === "deg" ? "rad" : "deg"))}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  borderRadius: 2,
                  bgcolor: "#f1f5f9",
                  color: "#334155",
                  borderColor: "#cbd5e1",
                }}
              >
                {angleMode.toUpperCase()}
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant={isInverse ? "contained" : "outlined"}
                onClick={() => setIsInverse((prev) => !prev)}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  borderRadius: 2,
                  bgcolor: isInverse ? "#4f46e5" : "#f1f5f9",
                  color: isInverse ? "#ffffff" : "#334155",
                  borderColor: "#cbd5e1",
                }}
              >
                Inv
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press("π")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  borderRadius: 2,
                  bgcolor: "#eef2ff",
                  color: "#4338ca",
                  borderColor: "#c7d2fe",
                }}
              >
                π
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press("e")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  borderRadius: 2,
                  bgcolor: "#eef2ff",
                  color: "#4338ca",
                  borderColor: "#c7d2fe",
                }}
              >
                e
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={clearAll}
                sx={{ py: 0.9, minWidth: 0, fontSize: "0.95rem", fontWeight: 800, borderRadius: 2 }}
              >
                AC
              </Button>
            </Grid>
          </Grid>

          {/* Row 2: sin/asin, cos/acos, tan/atan, (, ) */}
          <Grid container spacing={0.8}>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press(isInverse ? "asin" : "sin")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#eef2ff",
                  color: "#4338ca",
                  borderColor: "#c7d2fe",
                }}
              >
                {isInverse ? "sin⁻¹" : "sin"}
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press(isInverse ? "acos" : "cos")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#eef2ff",
                  color: "#4338ca",
                  borderColor: "#c7d2fe",
                }}
              >
                {isInverse ? "cos⁻¹" : "cos"}
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press(isInverse ? "atan" : "tan")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#eef2ff",
                  color: "#4338ca",
                  borderColor: "#c7d2fe",
                }}
              >
                {isInverse ? "tan⁻¹" : "tan"}
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press("(")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                  color: "#334155",
                  borderColor: "#cbd5e1",
                }}
              >
                (
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press(")")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                  color: "#334155",
                  borderColor: "#cbd5e1",
                }}
              >
                )
              </Button>
            </Grid>
          </Grid>

          {/* Row 3: ln/e^x, log/10^x, sqrt/x^2, x^y, ÷ */}
          <Grid container spacing={0.8}>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press(isInverse ? "eˣ" : "ln")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#eef2ff",
                  color: "#4338ca",
                  borderColor: "#c7d2fe",
                }}
              >
                {isInverse ? "eˣ" : "ln"}
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press(isInverse ? "10ˣ" : "log")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#eef2ff",
                  color: "#4338ca",
                  borderColor: "#c7d2fe",
                }}
              >
                {isInverse ? "10ˣ" : "log"}
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press(isInverse ? "x²" : "sqrt")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#eef2ff",
                  color: "#4338ca",
                  borderColor: "#c7d2fe",
                }}
              >
                {isInverse ? "x²" : "√"}
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press("^")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#eef2ff",
                  color: "#4338ca",
                  borderColor: "#c7d2fe",
                }}
              >
                xʸ
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={() => press("/")}
                sx={{ py: 0.9, minWidth: 0, fontSize: "1.1rem", fontWeight: 800, borderRadius: 2 }}
              >
                ÷
              </Button>
            </Grid>
          </Grid>

          {/* Row 4: x!, 1/x, %, ±, × */}
          <Grid container spacing={0.8}>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press("!")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#f1f5f9",
                  color: "#334155",
                  borderColor: "#cbd5e1",
                }}
              >
                x!
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press("1/x")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#f1f5f9",
                  color: "#334155",
                  borderColor: "#cbd5e1",
                }}
              >
                1/x
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press("%")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#f1f5f9",
                  color: "#334155",
                  borderColor: "#cbd5e1",
                }}
              >
                %
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press("±")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#f1f5f9",
                  color: "#334155",
                  borderColor: "#cbd5e1",
                }}
              >
                ±
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={() => press("*")}
                sx={{ py: 0.9, minWidth: 0, fontSize: "1.1rem", fontWeight: 800, borderRadius: 2 }}
              >
                ×
              </Button>
            </Grid>
          </Grid>

          {/* Row 5: 7, 8, 9, ⌫, − */}
          <Grid container spacing={0.8}>
            {["7", "8", "9"].map((num) => (
              <Grid key={num} size={{ xs: 2.4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => press(num)}
                  sx={{
                    py: 0.9,
                    minWidth: 0,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    borderRadius: 2,
                    bgcolor: "#ffffff",
                    color: "#0f172a",
                    borderColor: "#e2e8f0",
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                >
                  {num}
                </Button>
              </Grid>
            ))}
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={backspace}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                  color: "#475569",
                  borderColor: "#cbd5e1",
                }}
                aria-label="backspace"
              >
                <BackspaceIcon fontSize="small" />
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={() => press("-")}
                sx={{ py: 0.9, minWidth: 0, fontSize: "1.2rem", fontWeight: 800, borderRadius: 2 }}
              >
                −
              </Button>
            </Grid>
          </Grid>

          {/* Row 6: 4, 5, 6, Ans, + */}
          <Grid container spacing={0.8}>
            {["4", "5", "6"].map((num) => (
              <Grid key={num} size={{ xs: 2.4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => press(num)}
                  sx={{
                    py: 0.9,
                    minWidth: 0,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    borderRadius: 2,
                    bgcolor: "#ffffff",
                    color: "#0f172a",
                    borderColor: "#e2e8f0",
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                >
                  {num}
                </Button>
              </Grid>
            ))}
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => press("Ans")}
                sx={{
                  py: 0.9,
                  minWidth: 0,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                  color: "#475569",
                  borderColor: "#cbd5e1",
                }}
              >
                Ans
              </Button>
            </Grid>
            <Grid size={{ xs: 2.4 }}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={() => press("+")}
                sx={{ py: 0.9, minWidth: 0, fontSize: "1.1rem", fontWeight: 800, borderRadius: 2 }}
              >
                +
              </Button>
            </Grid>
          </Grid>

          {/* Row 7: 1, 2, 3, 0, . */}
          <Grid container spacing={0.8}>
            {["1", "2", "3", "0", "."].map((num) => (
              <Grid key={num} size={{ xs: 2.4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => press(num)}
                  sx={{
                    py: 0.9,
                    minWidth: 0,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    borderRadius: 2,
                    bgcolor: "#ffffff",
                    color: "#0f172a",
                    borderColor: "#e2e8f0",
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                >
                  {num}
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Row 8: Decisive Equal Button */}
          <Grid container spacing={0.8} sx={{ mt: 0.2 }}>
            <Grid size={{ xs: 12 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => press("=")}
                sx={{
                  py: 1.1,
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  borderRadius: 2.5,
                  boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
                  "&:hover": {
                    bgcolor: "#4338ca",
                    boxShadow: "0 6px 18px rgba(79, 70, 229, 0.45)",
                  },
                }}
              >
                =
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Footer helper note */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1.5, textAlign: "center", fontWeight: 500, fontSize: "0.75rem" }}
      >
        {mode === "basic"
          ? "Instant math · Click Scientific for trigonometry, powers & logarithms"
          : "Full scientific engine · Trigonometry · Logarithms · Powers · Factorials"}
      </Typography>
    </Paper>
  )
}
