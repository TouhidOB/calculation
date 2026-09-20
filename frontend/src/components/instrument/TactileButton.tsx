"use client"

import React from "react"
import { Button, ButtonProps } from "@mui/material"

interface TactileButtonProps extends ButtonProps {
  buttonColor?: "primary" | "secondary" | "success" | "warning" | "default"
  isExecuting?: boolean
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  children,
  buttonColor = "primary",
  isExecuting = false,
  sx,
  ...props
}) => {
  // Styles for different hardware button states
  const colorConfigs = {
    primary: {
      bg: "linear-gradient(180deg, #4f46e5 0%, #4338ca 100%)",
      border: "#3730a3",
      shadowColor: "#312e81",
      textColor: "#ffffff",
    },
    success: {
      bg: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
      border: "#047857",
      shadowColor: "#064e3b",
      textColor: "#ffffff",
    },
    warning: {
      bg: "linear-gradient(180deg, #f59e0b 0%, #d97706 100%)",
      border: "#b45309",
      shadowColor: "#78350f",
      textColor: "#ffffff",
    },
    secondary: {
      bg: "linear-gradient(180deg, #64748b 0%, #475569 100%)",
      border: "#334155",
      shadowColor: "#1e293b",
      textColor: "#ffffff",
    },
    default: {
      bg: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)",
      border: "#cbd5e1",
      shadowColor: "#94a3b8",
      textColor: "#0f172a",
    },
  }

  const config = colorConfigs[buttonColor] || colorConfigs.primary

  return (
    <Button
      {...props}
      sx={{
        background: config.bg,
        color: config.textColor,
        border: `1.5px solid ${config.border}`,
        borderRadius: "10px",
        boxShadow: `0 4px 0 ${config.shadowColor}, 0 6px 12px rgba(15, 23, 42, 0.15)`,
        fontWeight: 700,
        textTransform: "none",
        letterSpacing: "0.02em",
        transition: "all 0.12s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          background: config.bg,
          filter: "brightness(1.06)",
        },
        "&:active": {
          transform: "translateY(2px)",
          boxShadow: `0 2px 0 ${config.shadowColor}, 0 2px 4px rgba(15, 23, 42, 0.2)`,
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  )
}
