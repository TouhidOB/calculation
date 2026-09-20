"use client"

import React, { useState, useEffect, useCallback } from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Chip from "@mui/material/Chip"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"

// Icons
import CalculateIcon from "@mui/icons-material/Calculate"
import ScienceIcon from "@mui/icons-material/Science"
import BackspaceIcon from "@mui/icons-material/Backspace"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"

/* -------------------------------------------------------------------------- */
/*                 MATHEMATICAL EVALUATION & ENGINE HELPERS                   */
/* -------------------------------------------------------------------------- */

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN
  if (n === 0 || n === 1) return 1
  if (n > 170) return Infinity
  let res = 1
  for (let i = 2; i <= n; i++) res *= i
  return res
}

function toFraction(val: number, maxDenom = 1000): string | null {
  if (!Number.isFinite(val)) return null
  if (Number.isInteger(val)) return String(val)
  const sign = val < 0 ? "-" : ""
  const absVal = Math.abs(val)
  let bestNum = 1
  let bestDen = 1
  let minErr = Math.abs(absVal - bestNum / bestDen)
  for (let d = 1; d <= maxDenom; d++) {
    const n = Math.round(absVal * d)
    const err = Math.abs(absVal - n / d)
    if (err < minErr) {
      minErr = err
      bestNum = n
      bestDen = d
      if (err < 1e-9) break
    }
  }
  if (minErr < 1e-5) {
    return `${sign}${bestNum}/${bestDen}`
  }
  return null
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

function sanitizeAndEvaluate(
  rawExpr: string,
  angleMode: "deg" | "rad",
  vars: { ans: number; mem: number } = { ans: 0, mem: 0 }
): { result: number; display: string } {
  let expr = rawExpr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/π/g, `(${Math.PI})`)
    .replace(/\be\b/g, `(${Math.E})`)
    .replace(/\bAns\b/g, `(${vars.ans})`)
    .replace(/°/g, "")

  expr = autoCloseParens(expr)

  // Factorials: e.g. 5! -> fact(5)
  expr = expr.replace(/(\d+(?:\.\d+)?|\([^)]+\))!/g, "fact($1)")

  // Percentages: e.g. 50% -> (50/100)
  expr = expr.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)")

  // Exponentiation: a^b -> Math.pow(a, b)
  while (expr.includes("^")) {
    const prev = expr
    expr = expr.replace(/(\b\w+(?:\.\w+)?|\([^()]+\))\s*\^\s*(\b\w+(?:\.\w+)?|\([^()]+\))/, "Math.pow($1, $2)")
    if (expr === prev) break
  }

  // Implicit multiplication: 5(2) -> 5*(2), (2)(3) -> (2)*(3)
  expr = expr.replace(/(\d)(\()/g, "$1*$2")
  expr = expr.replace(/(\))(\d|\()/g, "$1*$2")

  const context = {
    Math,
    deg2rad: (d: number) => (d * Math.PI) / 180,
    rad2deg: (r: number) => (r * 180) / Math.PI,
    fact: factorial,
    sin: (x: number) => {
      if (angleMode === "deg" && Math.abs(x % 180) === 0) return 0
      return angleMode === "deg" ? Math.sin((x * Math.PI) / 180) : Math.sin(x)
    },
    cos: (x: number) => {
      if (angleMode === "deg" && Math.abs(x % 180) === 90) return 0
      return angleMode === "deg" ? Math.cos((x * Math.PI) / 180) : Math.cos(x)
    },
    tan: (x: number) => {
      if (angleMode === "deg" && Math.abs(x % 180) === 90) throw new Error("Math ERROR")
      if (angleMode === "deg" && Math.abs(x % 180) === 0) return 0
      return angleMode === "deg" ? Math.tan((x * Math.PI) / 180) : Math.tan(x)
    },
    asin: (x: number) => {
      if (x < -1 || x > 1) throw new Error("Math ERROR")
      const res = Math.asin(x)
      return angleMode === "deg" ? (res * 180) / Math.PI : res
    },
    acos: (x: number) => {
      if (x < -1 || x > 1) throw new Error("Math ERROR")
      const res = Math.acos(x)
      return angleMode === "deg" ? (res * 180) / Math.PI : res
    },
    atan: (x: number) => {
      const res = Math.atan(x)
      return angleMode === "deg" ? (res * 180) / Math.PI : res
    },
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    log: (x: number) => {
      if (x <= 0) throw new Error("Math ERROR")
      return Math.log10(x)
    },
    ln: (x: number) => {
      if (x <= 0) throw new Error("Math ERROR")
      return Math.log(x)
    },
    sqrt: (x: number) => {
      if (x < 0) throw new Error("Math ERROR")
      return Math.sqrt(x)
    },
    cbrt: (x: number) => Math.cbrt(x),
    abs: (x: number) => Math.abs(x),
    exp: (x: number) => Math.exp(x),
    A: vars.ans,
    B: vars.ans,
    C: vars.ans,
    D: vars.ans,
    E: vars.ans,
    F: vars.ans,
    X: vars.ans,
    Y: vars.ans,
    M: vars.mem,
  }

  if (/[^0-9+\-*/().,a-zA-Z_\s]/.test(expr)) {
    throw new Error("Invalid characters")
  }

  const fn = new Function(...Object.keys(context), `"use strict"; return (${expr})`)
  const rawRes = fn(...Object.values(context))

  if (!Number.isFinite(rawRes)) {
    if (rawRes === Infinity || rawRes === -Infinity) throw new Error("Infinity")
    throw new Error("Math ERROR")
  }

  // Floating point rounding
  let rounded = parseFloat(rawRes.toPrecision(12))
  if (Math.abs(rounded) < 1e-12) rounded = 0

  const cleanRes = Number.isInteger(rounded) ? rounded : +rounded.toFixed(10)

  return {
    result: cleanRes,
    display: String(cleanRes),
  }
}

/* -------------------------------------------------------------------------- */
/*                       MAIN QUICK CALCULATOR COMPONENT                      */
/* -------------------------------------------------------------------------- */

const BASIC_KEYS = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "=", "+",
]

export default function QuickCalculator() {
  // Mode: "basic" (default Quick view) | "casio" (Full Casio fx-991ES PLUS Pink)
  const [mode, setMode] = useState<"basic" | "casio">("basic")

  // Basic Mode State (Unified to prevent React batching/closure issues)
  const [basic, setBasic] = useState<{
    display: string
    expr: string
    evaluated: boolean
  }>({
    display: "0",
    expr: "",
    evaluated: false,
  })

  // Casio Mode State
  const [formula, setFormula] = useState("")
  const [resultDisplay, setResultDisplay] = useState("0")
  const [hasEvaluated, setHasEvaluated] = useState(false)
  const [isFractionView, setIsFractionView] = useState(false)
  const [lastNumericResult, setLastNumericResult] = useState<number>(0)
  const [historyList, setHistoryList] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)

  // Casio Indicators
  const [isShift, setIsShift] = useState(false)
  const [isAlpha, setIsAlpha] = useState(false)
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg")
  const [hasMemory, setHasMemory] = useState(false)
  const [memoryValue, setMemoryValue] = useState<number>(0)
  const [ansValue, setAnsValue] = useState<number>(0)

  // Blinking cursor
  const [cursorVisible, setCursorVisible] = useState(true)
  useEffect(() => {
    const timer = setInterval(() => setCursorVisible((v) => !v), 600)
    return () => clearInterval(timer)
  }, [])

  /* -------------------------- BASIC CALCULATOR LOGIC ------------------------- */
  const pressBasic = useCallback((k: string) => {
    setBasic((prev) => {
      const { display, expr, evaluated } = prev

      if (k === "=" || k === "Enter") {
        let fullExpr = expr ? (expr + (display !== "0" || !expr.trim().endsWith(")") ? display : "")) : display
        if (expr.endsWith(") ")) fullExpr = expr

        let clean = fullExpr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").trim()
        clean = clean.replace(/[+\-*/]$/, "").trim()
        clean = autoCloseParens(clean)

        if (!clean) return prev

        try {
          if (/[^0-9+\-*/().\s]/.test(clean)) throw new Error("Invalid")
          const fn = new Function(`"use strict"; return (${clean})`)
          const res = fn()
          if (!Number.isFinite(res)) throw new Error("Error")
          const rounded = parseFloat(res.toPrecision(12))
          return {
            display: String(rounded),
            expr: fullExpr.trim() + " = ",
            evaluated: true,
          }
        } catch {
          return {
            display: "Error",
            expr: "",
            evaluated: true,
          }
        }
      }

      if (["+", "-", "*", "/", "×", "÷", "−"].includes(k)) {
        const op = (k === "*" || k === "×") ? "×" : (k === "/" || k === "÷") ? "÷" : (k === "-" || k === "−") ? "−" : "+"
        if (evaluated) {
          return {
            display: "0",
            expr: display + " " + op + " ",
            evaluated: false,
          }
        }
        if (expr && display === "0" && !expr.trim().endsWith(")")) {
          return {
            ...prev,
            expr: expr.trim().replace(/[×÷−+]$/, op) + " ",
          }
        }
        return {
          display: "0",
          expr: (expr ? expr : "") + (expr.endsWith(") ") ? "" : display + " ") + op + " ",
          evaluated: false,
        }
      }

      if (k === "(") {
        if (evaluated) {
          return {
            display: "0",
            expr: "( ",
            evaluated: false,
          }
        }
        return {
          display: "0",
          expr: (expr ? expr : "") + "( ",
          evaluated: false,
        }
      }

      if (k === ")") {
        return {
          display: "0",
          expr: (expr ? expr : "") + (display !== "0" ? display + " " : "") + ") ",
          evaluated: false,
        }
      }

      if (k === ".") {
        if (evaluated) {
          return {
            display: "0.",
            expr: "",
            evaluated: false,
          }
        }
        if (!display.includes(".")) {
          return {
            ...prev,
            display: display + ".",
          }
        }
        return prev
      }

      if (k >= "0" && k <= "9") {
        if (evaluated) {
          return {
            display: k,
            expr: "",
            evaluated: false,
          }
        }
        return {
          ...prev,
          display: display === "0" ? k : display + k,
        }
      }

      return prev
    })
  }, [])

  const clearBasic = useCallback(() => {
    setBasic({
      display: "0",
      expr: "",
      evaluated: false,
    })
  }, [])

  const backspaceBasic = useCallback(() => {
    setBasic((prev) => {
      if (prev.evaluated) {
        return { display: "0", expr: "", evaluated: false }
      }
      if (prev.display.length > 1) {
        return { ...prev, display: prev.display.slice(0, -1) }
      }
      return { ...prev, display: "0" }
    })
  }, [])

  /* -------------------------- CASIO CALCULATOR LOGIC ------------------------- */
  const insertToken = useCallback((token: string) => {
    setFormula((prev) => {
      if (hasEvaluated) {
        setHasEvaluated(false)
        setIsFractionView(false)
        // If user presses an operator right after evaluation, chain from Ans
        if (["+", "-", "×", "÷", "^"].includes(token)) {
          return `Ans ${token} `
        }
        return token
      }
      return prev + token
    })
    setIsShift(false)
    setIsAlpha(false)
  }, [hasEvaluated])

  const evaluateCasio = useCallback(() => {
    if (!formula.trim()) return
    try {
      const evalRes = sanitizeAndEvaluate(formula, angleMode, { ans: ansValue, mem: memoryValue })
      setResultDisplay(evalRes.display)
      setLastNumericResult(evalRes.result)
      setAnsValue(evalRes.result)
      setHasEvaluated(true)
      setIsFractionView(false)
      setHistoryList((prev) => [...prev.filter((h) => h !== formula), formula])
      setHistoryIndex(-1)
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Syntax ERROR"
      setResultDisplay(errMsg.includes("Undefined") ? "Math ERROR" : "Syntax ERROR")
      setHasEvaluated(true)
    }
  }, [formula, ansValue, memoryValue, angleMode])

  const allClearCasio = useCallback(() => {
    setFormula("")
    setResultDisplay("0")
    setHasEvaluated(false)
    setIsFractionView(false)
    setIsShift(false)
    setIsAlpha(false)
  }, [])

  const deleteCasio = useCallback(() => {
    if (hasEvaluated) {
      allClearCasio()
      return
    }
    setFormula((prev) => {
      if (!prev) return ""
      // Delete multi-char functions cleanly
      const patterns = [
        "sin(", "cos(", "tan(", "asin(", "acos(", "atan(",
        "sinh(", "cosh(", "tanh(", "log(", "ln(", "sqrt(", "cbrt(",
        "abs(", "fact(", "Math.pow(", "10^(", "exp(", "^(-1)", "*10^", "Ans"
      ]
      for (const p of patterns) {
        if (prev.endsWith(p)) {
          return prev.slice(0, -p.length)
        }
      }
      return prev.slice(0, -1)
    })
  }, [hasEvaluated, allClearCasio])

  const toggleFractionView = useCallback(() => {
    if (!hasEvaluated) return
    if (isFractionView) {
      setResultDisplay(String(lastNumericResult))
      setIsFractionView(false)
    } else {
      const frac = toFraction(lastNumericResult)
      if (frac) {
        setResultDisplay(frac)
        setIsFractionView(true)
      }
    }
  }, [hasEvaluated, isFractionView, lastNumericResult])

  const cycleAngleMode = useCallback(() => {
    setAngleMode((prev) => (prev === "deg" ? "rad" : "deg"))
  }, [])

  // Replay D-Pad History
  const historyUp = () => {
    if (historyList.length === 0) return
    const newIdx = historyIndex === -1 ? historyList.length - 1 : Math.max(0, historyIndex - 1)
    setHistoryIndex(newIdx)
    setFormula(historyList[newIdx])
    setHasEvaluated(false)
  }

  const historyDown = () => {
    if (historyList.length === 0 || historyIndex === -1) return
    const newIdx = historyIndex + 1
    if (newIdx >= historyList.length) {
      setHistoryIndex(-1)
      setFormula("")
    } else {
      setHistoryIndex(newIdx)
      setFormula(historyList[newIdx])
    }
    setHasEvaluated(false)
  }

  /* ---------------------------- KEYBOARD LISTENER --------------------------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return

      if (mode === "basic") {
        if (e.key >= "0" && e.key <= "9") {
          pressBasic(e.key)
        } else if (e.key === ".") {
          pressBasic(".")
        } else if (e.key === "+") {
          pressBasic("+")
        } else if (e.key === "-") {
          pressBasic("-")
        } else if (e.key === "*") {
          pressBasic("*")
        } else if (e.key === "/") {
          e.preventDefault()
          pressBasic("/")
        } else if (e.key === "(" || e.key === ")") {
          pressBasic(e.key)
        } else if (e.key === "Enter" || e.key === "=") {
          e.preventDefault()
          pressBasic("=")
        } else if (e.key === "Backspace") {
          e.preventDefault()
          backspaceBasic()
        } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
          clearBasic()
        }
      } else {
        // mode === "casio"
        if (e.key >= "0" && e.key <= "9") {
          insertToken(e.key)
        } else if (e.key === ".") {
          insertToken(".")
        } else if (e.key === "+") {
          insertToken("+")
        } else if (e.key === "-") {
          insertToken("−")
        } else if (e.key === "*") {
          insertToken("×")
        } else if (e.key === "/") {
          e.preventDefault()
          insertToken("÷")
        } else if (e.key === "^") {
          insertToken("^")
        } else if (e.key === "(" || e.key === ")") {
          insertToken(e.key)
        } else if (e.key === "Enter" || e.key === "=") {
          e.preventDefault()
          evaluateCasio()
        } else if (e.key === "Backspace") {
          e.preventDefault()
          deleteCasio()
        } else if (e.key === "Escape") {
          allClearCasio()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mode, pressBasic, clearBasic, backspaceBasic, insertToken, evaluateCasio, deleteCasio, allClearCasio])

  /* ========================================================================== */
  /*                               CASIO BUTTON RENDERER                        */
  /* ========================================================================== */

  interface CasioKeyProps {
    label: string
    shiftLabel?: string
    alphaLabel?: string
    onClick: () => void
    variant?: "fn" | "num" | "op" | "del" | "ac" | "shift" | "alpha" | "mode" | "equals"
    fontSize?: any
    span?: number
  }

  const renderCasioKey = ({
    label,
    shiftLabel,
    alphaLabel,
    onClick,
    variant = "fn",
    fontSize,
    span = 1,
  }: CasioKeyProps) => {
    // Style by variant
    let bg = "#ffffff"
    let color = "#1e293b"
    let border = "1px solid #f9a8d4"
    let boxShadow = "0 3px 0 #f472b6, 0 4px 6px rgba(244, 114, 182, 0.25)"
    let hoverBg = "#fdf2f8"

    if (variant === "fn") {
      bg = "#fdf2f8"
      color = "#334155"
      border = "1px solid #fbcfe8"
      boxShadow = "0 2.5px 0 #f472b6, 0 3px 5px rgba(244, 114, 182, 0.2)"
      hoverBg = "#fce7f3"
    } else if (variant === "shift") {
      bg = isShift ? "#fef3c7" : "#fffbeb"
      color = "#b45309"
      border = isShift ? "2px solid #f59e0b" : "1px solid #fde68a"
      boxShadow = isShift ? "0 1px 0 #d97706, inset 0 2px 4px rgba(0,0,0,0.1)" : "0 2.5px 0 #d97706"
      hoverBg = "#fef3c7"
    } else if (variant === "alpha") {
      bg = isAlpha ? "#fce7f3" : "#fff1f2"
      color = "#be185d"
      border = isAlpha ? "2px solid #ec4899" : "1px solid #fbcfe8"
      boxShadow = isAlpha ? "0 1px 0 #db2777, inset 0 2px 4px rgba(0,0,0,0.1)" : "0 2.5px 0 #db2777"
      hoverBg = "#fce7f3"
    } else if (variant === "del") {
      bg = "#e11d48"
      color = "#ffffff"
      border = "1px solid #be123c"
      boxShadow = "0 3px 0 #9f1239, 0 4px 6px rgba(225, 29, 72, 0.3)"
      hoverBg = "#be123c"
    } else if (variant === "ac") {
      bg = "#ea580c"
      color = "#ffffff"
      border = "1px solid #c2410c"
      boxShadow = "0 3px 0 #9a3412, 0 4px 6px rgba(234, 88, 12, 0.35)"
      hoverBg = "#c2410c"
    } else if (variant === "equals") {
      bg = "#0284c7"
      color = "#ffffff"
      border = "1px solid #0369a1"
      boxShadow = "0 3px 0 #075985, 0 4px 6px rgba(2, 132, 199, 0.35)"
      hoverBg = "#0369a1"
    } else if (variant === "op") {
      bg = "#f8fafc"
      color = "#0f172a"
      border = "1px solid #cbd5e1"
      boxShadow = "0 3px 0 #94a3b8"
      hoverBg = "#f1f5f9"
    } else if (variant === "num") {
      bg = "#ffffff"
      color = "#0f172a"
      border = "1px solid #f9a8d4"
      boxShadow = "0 3px 0 #f472b6, 0 4px 6px rgba(244, 114, 182, 0.2)"
      hoverBg = "#fdf2f8"
    }

    return (
      <Box
        key={label + (shiftLabel || "")}
        sx={{
          gridColumn: span > 1 ? `span ${span}` : "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          minHeight: { xs: 44, sm: 48 },
          position: "relative",
          userSelect: "none",
        }}
      >
        {/* Shift / Alpha top micro-labels printed on calculator casing */}
        {(shiftLabel || alphaLabel) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              px: 0.5,
              mb: "2px",
              lineHeight: 1,
              pointerEvents: "none",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: "0.62rem",
                fontWeight: 800,
                color: "#b45309", // Gold/Amber Shift label
                fontFamily: "sans-serif",
                textShadow: "0 0.5px 0 #ffffff",
              }}
            >
              {shiftLabel || ""}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: "0.62rem",
                fontWeight: 800,
                color: "#be185d", // Magenta/Pink Alpha label
                fontFamily: "sans-serif",
                textShadow: "0 0.5px 0 #ffffff",
              }}
            >
              {alphaLabel || ""}
            </Typography>
          </Box>
        )}

        {/* Physical Button Key */}
        <Button
          fullWidth
          onClick={onClick}
          disableRipple
          sx={{
            py: { xs: 0.6, sm: 0.8 },
            px: 0.5,
            minWidth: 0,
            height: "100%",
            borderRadius: "9px",
            background: bg,
            color: color,
            border: border,
            boxShadow: boxShadow,
            fontWeight: 800,
            fontSize: fontSize || { xs: "0.82rem", sm: "0.92rem" },
            fontFamily: "'Outfit', 'Roboto', 'Segoe UI', sans-serif",
            textTransform: "none",
            transition: "all 0.08s ease-in-out",
            "&:hover": {
              background: hoverBg,
            },
            "&:active": {
              transform: "translateY(2px)",
              boxShadow: "0 0.5px 0 transparent, inset 0 2px 4px rgba(0,0,0,0.15)",
            },
          }}
        >
          {label}
        </Button>
      </Box>
    )
  }

  /* ========================================================================== */
  /*                                   RENDER                                   */
  /* ========================================================================== */

  /* ----------------------- 1. BASIC QUICK VIEW (DEFAULT) -------------------- */
  if (mode === "basic") {
    return (
      <Paper
        elevation={0}
        component="section"
        aria-label="Quick Calculator"
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          background: "#ffffff",
          boxShadow: "0 10px 30px -10px rgba(79, 70, 229, 0.12)",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "#eef2ff",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CalculateIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
                Quick Calculator
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.72rem" }}>
                Instant · Basic Math
              </Typography>
            </Box>
          </Box>

          {/* Mode Convert Button (Switch to Casio fx-991ES PLUS Pink) */}
          <Button
            variant="outlined"
            size="small"
            onClick={() => setMode("casio")}
            startIcon={<ScienceIcon sx={{ color: "#ec4899 !important" }} />}
            sx={{
              fontWeight: 800,
              fontSize: "0.75rem",
              borderRadius: 2.5,
              textTransform: "none",
              color: "#be185d",
              borderColor: "#fbcfe8",
              bgcolor: "#fdf2f8",
              py: 0.5,
              px: 1.5,
              boxShadow: "0 2px 8px rgba(244, 114, 182, 0.15)",
              "&:hover": {
                bgcolor: "#fce7f3",
                borderColor: "#f472b6",
                transform: "translateY(-1px)",
              },
            }}
          >
            Scientific Pro
          </Button>
        </Box>

        {/* Display Screen */}
        <Box
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 3,
            bgcolor: "#0f172a",
            color: "#ffffff",
            textAlign: "right",
            minHeight: 82,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#94a3b8",
              fontSize: "0.78rem",
              fontFamily: "monospace",
              minHeight: 18,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {basic.expr || "\u00A0"}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: 1,
              color: "#f8fafc",
              fontSize: { xs: "1.75rem", sm: "2.1rem" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {basic.display}
          </Typography>
        </Box>

        {/* Action Keys (C, Backspace, Parens) */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid size={{ xs: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={clearBasic}
              sx={{ fontWeight: 800, borderRadius: 2, py: 1, borderColor: "#fca5a5" }}
            >
              C
            </Button>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={backspaceBasic}
              sx={{ fontWeight: 700, borderRadius: 2, py: 1, color: "#475569", borderColor: "#cbd5e1" }}
            >
              <BackspaceIcon sx={{ fontSize: 18 }} />
            </Button>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => pressBasic("(")}
              sx={{ fontWeight: 700, borderRadius: 2, py: 1, color: "#475569", borderColor: "#cbd5e1" }}
            >
              (
            </Button>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => pressBasic(")")}
              sx={{ fontWeight: 700, borderRadius: 2, py: 1, color: "#475569", borderColor: "#cbd5e1" }}
            >
              )
            </Button>
          </Grid>
        </Grid>

        {/* Keypad Grid 4x4 */}
        <Grid container spacing={1}>
          {BASIC_KEYS.map((k) => (
            <Grid size={{ xs: 3 }} key={k}>
              <Button
                fullWidth
                variant={k === "=" ? "contained" : "outlined"}
                color={k === "=" ? "primary" : "inherit"}
                onClick={() => pressBasic(k)}
                sx={{
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  py: 1.3,
                  borderRadius: 2,
                  ...(k === "="
                    ? {
                        bgcolor: "#4f46e5",
                        color: "#ffffff",
                        "&:hover": { bgcolor: "#4338ca" },
                      }
                    : ["+", "-", "*", "/"].includes(k)
                    ? {
                        bgcolor: "#f0fdf4",
                        color: "#15803d",
                        borderColor: "#bbf7d0",
                        "&:hover": { bgcolor: "#dcfce7" },
                      }
                    : {
                        bgcolor: "#f8fafc",
                        color: "#0f172a",
                        borderColor: "#e2e8f0",
                        "&:hover": { bgcolor: "#f1f5f9" },
                      }),
                }}
              >
                {k === "*" ? "×" : k === "/" ? "÷" : k === "-" ? "−" : k}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1.8,
            textAlign: "center",
            color: "#64748b",
            fontSize: "0.75rem",
            fontWeight: 500,
          }}
        >
          Basic Math · Click <strong>Scientific Pro</strong> for trigonometry, powers & fractions
        </Typography>
      </Paper>
    )
  }

  /* ---------------- 2. SCIENTIFIC PRO PINK EDITION ----------------- */
  return (
    <Paper
      elevation={0}
      component="section"
      aria-label="TryCalc Pink Scientific Calculator Pro"
      sx={{
        p: { xs: 2, sm: 2.8 },
        borderRadius: "32px",
        background: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 35%, #fbcfe8 100%)",
        border: "2px solid #f472b6",
        boxShadow:
          "0 24px 50px -15px rgba(244, 114, 182, 0.45), 0 0 0 1px rgba(251, 207, 232, 0.9), inset 0 2px 4px rgba(255, 255, 255, 0.9)",
        position: "relative",
      }}
    >
      {/* Top Header: Brand, Solar Cell & Feature Badges */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Brand Logo */}
          <Box>
            <Typography
              sx={{
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                fontWeight: 900,
                letterSpacing: "1.8px",
                fontSize: { xs: "1.05rem", sm: "1.2rem" },
                color: "#1e293b",
                textShadow: "0 1px 0 rgba(255, 255, 255, 0.8)",
                lineHeight: 1,
              }}
            >
              TRYCALC
            </Typography>
            <Typography
              sx={{
                fontSize: "0.58rem",
                fontWeight: 800,
                color: "#64748b",
                letterSpacing: "0.5px",
                lineHeight: 1.2,
                mt: "2px",
              }}
            >
              DUAL POWER
            </Typography>
          </Box>

          {/* Authentic Solar Cell Panel */}
          <Box
            sx={{
              width: { xs: 80, sm: 94 },
              height: { xs: 24, sm: 28 },
              borderRadius: "4px",
              background: "linear-gradient(180deg, #451a03 0%, #2e1065 100%)",
              border: "1.5px solid #78350f",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6), 0 1px 2px rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              px: 0.5,
              position: "relative",
            }}
          >
            {/* Photovoltaic Cells grid lines */}
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: "1px",
                  height: "80%",
                  bgcolor: "rgba(245, 158, 11, 0.25)",
                }}
              />
            ))}
          </Box>

          {/* Model Designation & Quick Switch */}
          <Box sx={{ textAlign: "right" }}>
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", justifyContent: "flex-end" }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "0.82rem", sm: "0.95rem" },
                  color: "#0f172a",
                  letterSpacing: "0.3px",
                  lineHeight: 1.1,
                }}
              >
                SCIENTIFIC
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.8, alignItems: "center", justifyContent: "flex-end", mt: "2px" }}>
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#64748b" }}>
                PRO EDITION
              </Typography>
              <Chip
                label="NATURAL DISPLAY"
                size="small"
                sx={{
                  height: 16,
                  fontSize: "0.55rem",
                  fontWeight: 800,
                  bgcolor: "#ffffff",
                  color: "#be123c",
                  border: "1px solid #fbcfe8",
                  "& .MuiChip-label": { px: 0.5 },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Mode Switcher Return Bar */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.2 }}>
          <Chip
            label="Pink Edition · High Precision"
            size="small"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.7)",
              color: "#be185d",
              fontSize: "0.65rem",
              fontWeight: 700,
              height: 20,
            }}
          />
          <Button
            size="small"
            onClick={() => setMode("basic")}
            startIcon={<CalculateIcon sx={{ fontSize: "14px !important" }} />}
            sx={{
              py: 0.2,
              px: 1,
              fontSize: "0.7rem",
              fontWeight: 700,
              borderRadius: "12px",
              color: "#475569",
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              textTransform: "none",
              "&:hover": { bgcolor: "#f8fafc", color: "#0f172a" },
            }}
          >
            Quick View
          </Button>
        </Box>
      </Box>

      {/* ====================================================================== */}
      {/*           AUTHENTIC CASIO NATURAL-V.P.A.M. DOT MATRIX LCD              */}
      {/* ====================================================================== */}
      <Box
        sx={{
          mb: 2.2,
          p: 1.5,
          borderRadius: "14px",
          // The exact olive-greenish STN LCD matrix tone of genuine Casio calculators
          background: "linear-gradient(180deg, #cdd7bf 0%, #c4cfb4 100%)",
          border: "3px solid #334155",
          boxShadow:
            "inset 0 4px 10px rgba(0,0,0,0.35), 0 2px 6px rgba(255,255,255,0.8)",
          minHeight: 104,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          userSelect: "none",
        }}
      >
        {/* LCD Status Indicators Bar */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 0.5 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* [S] Shift */}
            <Typography
              sx={{
                fontSize: "0.68rem",
                fontWeight: 900,
                fontFamily: "monospace",
                color: isShift ? "#142014" : "rgba(20, 32, 20, 0.18)",
                bgcolor: isShift ? "rgba(20, 32, 20, 0.15)" : "transparent",
                px: "3px",
                borderRadius: "2px",
              }}
            >
              [S]
            </Typography>

            {/* [A] Alpha */}
            <Typography
              sx={{
                fontSize: "0.68rem",
                fontWeight: 900,
                fontFamily: "monospace",
                color: isAlpha ? "#142014" : "rgba(20, 32, 20, 0.18)",
                bgcolor: isAlpha ? "rgba(20, 32, 20, 0.15)" : "transparent",
                px: "3px",
                borderRadius: "2px",
              }}
            >
              [A]
            </Typography>

            {/* [M] Memory */}
            <Typography
              sx={{
                fontSize: "0.68rem",
                fontWeight: 900,
                fontFamily: "monospace",
                color: hasMemory ? "#142014" : "rgba(20, 32, 20, 0.18)",
              }}
            >
              [M]
            </Typography>

            {/* [D] DEG / [R] RAD */}
            <Typography
              onClick={cycleAngleMode}
              sx={{
                fontSize: "0.68rem",
                fontWeight: 900,
                fontFamily: "monospace",
                color: "#142014",
                cursor: "pointer",
                borderBottom: "1px dashed #142014",
                "&:hover": { opacity: 0.7 },
              }}
            >
              [{angleMode === "deg" ? "D" : "R"}]
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {isFractionView && (
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 900,
                  fontFamily: "monospace",
                  color: "#142014",
                }}
              >
                [Frac]
              </Typography>
            )}
            <Typography
              sx={{
                fontSize: "0.65rem",
                fontWeight: 900,
                fontFamily: "monospace",
                color: "#142014",
              }}
            >
              Math ▲▼
            </Typography>
          </Box>
        </Box>

        {/* Upper Formula / Equation Input Line with Blinking Cursor */}
        <Box
          sx={{
            minHeight: 26,
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            py: 0.3,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Typography
            component="div"
            sx={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: { xs: "0.95rem", sm: "1.1rem" },
              fontWeight: 700,
              color: "#142014",
              letterSpacing: "0.5px",
            }}
          >
            {formula || "\u00A0"}
            {!hasEvaluated && (
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "2px",
                  height: "1em",
                  bgcolor: cursorVisible ? "#142014" : "transparent",
                  ml: "2px",
                  verticalAlign: "middle",
                }}
              />
            )}
          </Typography>
        </Box>

        {/* Lower Main Calculation Result Output Line */}
        <Box sx={{ textAlign: "right", minHeight: 34, overflowX: "auto" }}>
          <Typography
            sx={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: { xs: "1.6rem", sm: "1.9rem" },
              fontWeight: 900,
              color: "#0a120a",
              letterSpacing: "1px",
              lineHeight: 1.1,
            }}
          >
            {resultDisplay}
          </Typography>
        </Box>
      </Box>

      {/* ====================================================================== */}
      {/*              CASIO CONTROL ROW: SHIFT, ALPHA, REPLAY D-PAD, MODE, ON   */}
      {/* ====================================================================== */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          px: { xs: 0.5, sm: 1 },
        }}
      >
        {/* Left Controls: SHIFT & ALPHA */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, width: { xs: 62, sm: 72 } }}>
          <Button
            size="small"
            onClick={() => setIsShift((v) => !v)}
            sx={{
              py: 0.5,
              borderRadius: "8px",
              bgcolor: isShift ? "#fef3c7" : "#fffbeb",
              color: "#b45309",
              border: isShift ? "2px solid #f59e0b" : "1px solid #fde68a",
              boxShadow: isShift ? "0 1px 0 #d97706, inset 0 2px 4px rgba(0,0,0,0.1)" : "0 2px 0 #d97706",
              fontWeight: 900,
              fontSize: "0.78rem",
              textTransform: "none",
            }}
          >
            SHIFT
          </Button>
          <Button
            size="small"
            onClick={() => setIsAlpha((v) => !v)}
            sx={{
              py: 0.5,
              borderRadius: "8px",
              bgcolor: isAlpha ? "#fce7f3" : "#fff1f2",
              color: "#be185d",
              border: isAlpha ? "2px solid #ec4899" : "1px solid #fbcfe8",
              boxShadow: isAlpha ? "0 1px 0 #db2777, inset 0 2px 4px rgba(0,0,0,0.1)" : "0 2px 0 #db2777",
              fontWeight: 900,
              fontSize: "0.78rem",
              textTransform: "none",
            }}
          >
            ALPHA
          </Button>
        </Box>

        {/* Center: Iconic Oval REPLAY 4-Way D-Pad */}
        <Box
          sx={{
            width: { xs: 96, sm: 110 },
            height: { xs: 68, sm: 76 },
            borderRadius: "38px",
            // Silver metallic / light pink Casio REPLAY pad
            background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
            border: "2px solid #cbd5e1",
            boxShadow:
              "0 4px 10px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            p: 0.5,
            position: "relative",
          }}
        >
          {/* Up arrow (History prev) */}
          <IconButton
            size="small"
            onClick={historyUp}
            sx={{ p: 0, color: "#475569", "&:hover": { color: "#0f172a" } }}
          >
            <ArrowDropUpIcon sx={{ fontSize: 24 }} />
          </IconButton>

          {/* Left / REPLAY text / Right */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", px: 0.8 }}>
            <IconButton
              size="small"
              onClick={() => {
                /* cursor left */
              }}
              sx={{ p: 0, color: "#475569" }}
            >
              <ArrowLeftIcon sx={{ fontSize: 20 }} />
            </IconButton>

            <Typography
              sx={{
                fontSize: "0.62rem",
                fontWeight: 900,
                color: "#64748b",
                letterSpacing: "1px",
                userSelect: "none",
              }}
            >
              REPLAY
            </Typography>

            <IconButton
              size="small"
              onClick={() => {
                /* cursor right */
              }}
              sx={{ p: 0, color: "#475569" }}
            >
              <ArrowRightIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Down arrow (History next) */}
          <IconButton
            size="small"
            onClick={historyDown}
            sx={{ p: 0, color: "#475569", "&:hover": { color: "#0f172a" } }}
          >
            <ArrowDropDownIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Box>

        {/* Right Controls: MODE/SETUP & ON */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, width: { xs: 62, sm: 72 } }}>
          <Button
            size="small"
            onClick={cycleAngleMode}
            sx={{
              py: 0.5,
              borderRadius: "8px",
              bgcolor: "#ffffff",
              color: "#1e293b",
              border: "1px solid #cbd5e1",
              boxShadow: "0 2px 0 #94a3b8",
              fontWeight: 800,
              fontSize: "0.72rem",
              textTransform: "none",
            }}
          >
            MODE
          </Button>
          <Button
            size="small"
            onClick={allClearCasio}
            sx={{
              py: 0.5,
              borderRadius: "8px",
              bgcolor: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              boxShadow: "0 2px 0 #94a3b8",
              fontWeight: 900,
              fontSize: "0.78rem",
              textTransform: "none",
            }}
          >
            ON
          </Button>
        </Box>
      </Box>

      {/* ====================================================================== */}
      {/*               SCIENTIFIC FUNCTION KEYS GRID (6 COLUMNS)                */}
      {/* ====================================================================== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: { xs: "6px 4px", sm: "8px 6px" },
          mb: 2,
        }}
      >
        {/* ROW 1 */}
        {renderCasioKey({
          label: "x⁻¹",
          shiftLabel: "x!",
          onClick: () => {
            if (isShift) insertToken("!")
            else insertToken("^(-1)")
          },
        })}
        {renderCasioKey({
          label: "log■□",
          shiftLabel: "d/dx",
          onClick: () => insertToken("log("),
        })}
        {renderCasioKey({
          label: "믐",
          shiftLabel: "■/□",
          onClick: () => insertToken("/"),
        })}
        {renderCasioKey({
          label: "√■",
          shiftLabel: "³√■",
          onClick: () => {
            if (isShift) insertToken("cbrt(")
            else insertToken("sqrt(")
          },
        })}
        {renderCasioKey({
          label: "x²",
          shiftLabel: "x³",
          onClick: () => {
            if (isShift) insertToken("^3")
            else insertToken("^2")
          },
        })}
        {renderCasioKey({
          label: "xʸ",
          shiftLabel: "x√",
          onClick: () => insertToken("^"),
        })}

        {/* ROW 2 */}
        {renderCasioKey({
          label: "log",
          shiftLabel: "10■",
          onClick: () => {
            if (isShift) insertToken("10^(")
            else insertToken("log(")
          },
        })}
        {renderCasioKey({
          label: "ln",
          shiftLabel: "e■",
          alphaLabel: "e",
          onClick: () => {
            if (isAlpha) insertToken("e")
            else if (isShift) insertToken("exp(")
            else insertToken("ln(")
          },
        })}
        {renderCasioKey({
          label: "(-)",
          shiftLabel: "←",
          alphaLabel: "A",
          onClick: () => insertToken("−"),
        })}
        {renderCasioKey({
          label: "°' \"",
          shiftLabel: "←",
          alphaLabel: "B",
          onClick: () => insertToken("°"),
        })}
        {renderCasioKey({
          label: "hyp",
          shiftLabel: "Abs",
          alphaLabel: "C",
          onClick: () => {
            if (isShift) insertToken("abs(")
            else insertToken("sinh(")
          },
        })}
        {renderCasioKey({
          label: "sin",
          shiftLabel: "sin⁻¹",
          alphaLabel: "D",
          onClick: () => {
            if (isShift) insertToken("asin(")
            else insertToken("sin(")
          },
        })}

        {/* ROW 3 */}
        {renderCasioKey({
          label: "cos",
          shiftLabel: "cos⁻¹",
          alphaLabel: "E",
          onClick: () => {
            if (isShift) insertToken("acos(")
            else insertToken("cos(")
          },
        })}
        {renderCasioKey({
          label: "tan",
          shiftLabel: "tan⁻¹",
          alphaLabel: "F",
          onClick: () => {
            if (isShift) insertToken("atan(")
            else insertToken("tan(")
          },
        })}
        {renderCasioKey({
          label: "RCL",
          shiftLabel: "STO",
          alphaLabel: "X",
          onClick: () => {
            if (isAlpha) insertToken("X")
            else insertToken("Ans")
          },
        })}
        {renderCasioKey({
          label: "ENG",
          shiftLabel: "←",
          alphaLabel: "Y",
          onClick: () => {
            if (isAlpha) insertToken("Y")
            else insertToken("*10^3")
          },
        })}
        {renderCasioKey({
          label: "(",
          shiftLabel: "%",
          onClick: () => {
            if (isShift) insertToken("%")
            else insertToken("(")
          },
        })}
        {renderCasioKey({
          label: ")",
          shiftLabel: ",",
          onClick: () => insertToken(")"),
        })}

        {/* ROW 4 */}
        {renderCasioKey({
          label: "S<=>D",
          shiftLabel: "a b/c",
          span: 3,
          fontSize: { xs: "0.85rem", sm: "0.95rem" },
          onClick: toggleFractionView,
        })}
        {renderCasioKey({
          label: "M+",
          shiftLabel: "M-",
          alphaLabel: "M",
          span: 3,
          onClick: () => {
            setHasMemory(true)
            setMemoryValue((prev) => prev + lastNumericResult)
          },
        })}
      </Box>

      {/* ====================================================================== */}
      {/*             BOTTOM NUMBER & ARITHMETIC KEYPAD (5 COLUMNS)              */}
      {/* ====================================================================== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: { xs: "7px 5px", sm: "9px 7px" },
        }}
      >
        {/* ROW 1: 7, 8, 9, DEL, AC */}
        {renderCasioKey({
          label: "7",
          variant: "num",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          onClick: () => insertToken("7"),
        })}
        {renderCasioKey({
          label: "8",
          variant: "num",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          onClick: () => insertToken("8"),
        })}
        {renderCasioKey({
          label: "9",
          variant: "num",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          onClick: () => insertToken("9"),
        })}
        {renderCasioKey({
          label: "DEL",
          variant: "del",
          fontSize: { xs: "0.82rem", sm: "0.95rem" },
          onClick: deleteCasio,
        })}
        {renderCasioKey({
          label: "AC",
          variant: "ac",
          fontSize: { xs: "0.85rem", sm: "1rem" },
          onClick: allClearCasio,
        })}

        {/* ROW 2: 4, 5, 6, ×, ÷ */}
        {renderCasioKey({
          label: "4",
          variant: "num",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          onClick: () => insertToken("4"),
        })}
        {renderCasioKey({
          label: "5",
          variant: "num",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          onClick: () => insertToken("5"),
        })}
        {renderCasioKey({
          label: "6",
          variant: "num",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          onClick: () => insertToken("6"),
        })}
        {renderCasioKey({
          label: "×",
          variant: "op",
          fontSize: { xs: "1.2rem", sm: "1.35rem" },
          onClick: () => insertToken("×"),
        })}
        {renderCasioKey({
          label: "÷",
          variant: "op",
          fontSize: { xs: "1.2rem", sm: "1.35rem" },
          onClick: () => insertToken("÷"),
        })}

        {/* ROW 3: 1, 2, 3, +, − */}
        {renderCasioKey({
          label: "1",
          variant: "num",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          onClick: () => insertToken("1"),
        })}
        {renderCasioKey({
          label: "2",
          variant: "num",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          onClick: () => insertToken("2"),
        })}
        {renderCasioKey({
          label: "3",
          variant: "num",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          onClick: () => insertToken("3"),
        })}
        {renderCasioKey({
          label: "+",
          variant: "op",
          fontSize: { xs: "1.2rem", sm: "1.35rem" },
          onClick: () => insertToken("+"),
        })}
        {renderCasioKey({
          label: "−",
          variant: "op",
          fontSize: { xs: "1.2rem", sm: "1.35rem" },
          onClick: () => insertToken("−"),
        })}

        {/* ROW 4: 0, ., ×10ˣ, Ans, = */}
        {renderCasioKey({
          label: "0",
          variant: "num",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          onClick: () => insertToken("0"),
        })}
        {renderCasioKey({
          label: "•",
          variant: "num",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          onClick: () => insertToken("."),
        })}
        {renderCasioKey({
          label: "×10ˣ",
          shiftLabel: "π",
          alphaLabel: "e",
          variant: "fn",
          fontSize: { xs: "0.78rem", sm: "0.88rem" },
          onClick: () => {
            if (isAlpha) insertToken("e")
            else if (isShift) insertToken("π")
            else insertToken("*10^")
          },
        })}
        {renderCasioKey({
          label: "Ans",
          shiftLabel: "%",
          variant: "fn",
          fontSize: { xs: "0.82rem", sm: "0.95rem" },
          onClick: () => {
            if (isShift) insertToken("%")
            else insertToken("Ans")
          },
        })}
        {renderCasioKey({
          label: "=",
          variant: "equals",
          fontSize: { xs: "1.3rem", sm: "1.5rem" },
          onClick: evaluateCasio,
        })}
      </Box>

      {/* Casio Footer Casing Inscription */}
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 2,
          textAlign: "center",
          color: "#9d174d",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.3px",
        }}
      >
        TryCalc · High Precision Scientific Calculator · Natural Display
      </Typography>
    </Paper>
  )
}
