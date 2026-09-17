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
  size = 22,
  color = "#ffffff",
}: CalculatorLogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* Calculator Body with smooth rounded corners */}
      <rect x="3.5" y="2" width="17" height="20" rx="3.5" fill={color} />

      {/* Screen display (dark LCD bezel) */}
      <rect x="5.5" y="4.2" width="13" height="4.2" rx="1.2" fill="#1e1b4b" />
      {/* LCD digits readout indicator */}
      <rect x="13.2" y="5.4" width="3.8" height="1.8" rx="0.5" fill="#38bdf8" />
      <circle cx="7.2" cy="6.3" r="0.6" fill="#a5b4fc" />
      <circle cx="9" cy="6.3" r="0.6" fill="#a5b4fc" />

      {/* 3x3 Keypad buttons grid */}
      {/* Row 1 */}
      <rect x="5.5" y="10" width="3.2" height="2.5" rx="0.8" fill="#4f46e5" />
      <rect x="10.4" y="10" width="3.2" height="2.5" rx="0.8" fill="#4f46e5" />
      <rect x="15.3" y="10" width="3.2" height="2.5" rx="0.8" fill="#f59e0b" />

      {/* Row 2 */}
      <rect x="5.5" y="13.5" width="3.2" height="2.5" rx="0.8" fill="#4f46e5" />
      <rect x="10.4" y="13.5" width="3.2" height="2.5" rx="0.8" fill="#4f46e5" />
      <rect x="15.3" y="13.5" width="3.2" height="2.5" rx="0.8" fill="#4f46e5" />

      {/* Row 3 */}
      <rect x="5.5" y="17" width="3.2" height="2.5" rx="0.8" fill="#4f46e5" />
      <rect x="10.4" y="17" width="3.2" height="2.5" rx="0.8" fill="#4f46e5" />
      <rect x="15.3" y="17" width="3.2" height="2.5" rx="0.8" fill="#10b981" />
    </svg>
  )
}
