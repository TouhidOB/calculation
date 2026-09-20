import { ImageResponse } from "next/og"
import { getCalculator, CATEGORY_META, type CalcFieldDef } from "@/lib/calculator-api"

export const runtime = "nodejs"

export const alt = "TryCalc Calculator Workstation"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ calcId: string }> }) {
  const { calcId } = await params
  let title = "Free Online Calculator"
  let catLabel = "Universal Precision"
  let fieldNames = "Instant Deterministic Results"

  try {
    const calc = await getCalculator(calcId)
    if (calc) {
      title = calc.name
      catLabel = CATEGORY_META[calc.category]?.label || calc.category
      fieldNames = calc.fields.slice(0, 4).map((f: CalcFieldDef) => f.label).join(" • ")
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          border: "16px solid #334155",
        }}
      >
        {/* Top telemetry bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 16px #10b981",
              }}
            />
            <span
              style={{
                fontSize: "20px",
                fontWeight: "800",
                letterSpacing: "2px",
                color: "#38bdf8",
                textTransform: "uppercase",
              }}
            >
              TRYCALC INSTRUMENTS · MODEL TC-689
            </span>
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 20px",
              background: "rgba(56, 189, 248, 0.15)",
              borderRadius: "20px",
              border: "1px solid #38bdf8",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "700", color: "#38bdf8" }}>{catLabel}</span>
          </div>
        </div>

        {/* Central Display Chassis */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "40px 48px",
            background: "rgba(15, 23, 42, 0.85)",
            borderRadius: "24px",
            border: "2px solid #334155",
          }}
        >
          <div style={{ fontSize: "52px", fontWeight: "900", color: "#f8fafc", lineHeight: "1.15" }}>
            {title}
          </div>
          <div style={{ fontSize: "24px", fontWeight: "600", color: "#94a3b8" }}>
            Parameters: {fieldNames}
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "28px", fontSize: "20px", fontWeight: "600", color: "#cbd5e1" }}>
            <span>⚡ Instant Computation</span>
            <span>✓ 64-Bit Precision</span>
            <span>🔒 100% Free &amp; Deterministic</span>
          </div>
          <div style={{ fontSize: "26px", fontWeight: "900", color: "#38bdf8", letterSpacing: "1px" }}>
            trycalc.net
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
