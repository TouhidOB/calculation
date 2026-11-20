import * as React from "react"

interface CalculatorLogoIconProps {
  size?: number | string
  color?: string
}

/**
 * Modern, detailed, high-contrast Calculator Icon
 * Features realistic calculator bezel, LCD screen readout, and keypad buttons.
 */
export default function CalculatorLogoIcon({
  size = 20,
  color = "currentColor",
}: CalculatorLogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0 }}
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="20" rx="2.5" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="16" y1="14" x2="16" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  )
}
