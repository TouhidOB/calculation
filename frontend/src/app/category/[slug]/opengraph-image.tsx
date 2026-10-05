import { ImageResponse } from "next/og"
import { CATEGORY_META } from "@/lib/calculator-api"
import fallbackData from "@/lib/calculators-fallback.json"

export const runtime = "nodejs"

export const alt = "TryCalc Category Hub Workstation"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const catMeta = CATEGORY_META[slug] || { label: "Calculators", emoji: "🧮", color: "#6366f1" }
  const categories = fallbackData.categories as Record<string, unknown[]>
  const toolCount = categories[slug]?.length || 50

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
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
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
              TRYCALC CLUSTER · TOPIC HUB
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 22px",
              background: "rgba(56, 189, 248, 0.15)",
              borderRadius: "20px",
              border: "1px solid #38bdf8",
            }}
          >
            <span style={{ fontSize: "20px" }}>{catMeta.emoji}</span>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "#38bdf8" }}>
              {toolCount} Verified Tools
            </span>
          </div>
        </div>

        {/* Central Chassis */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            padding: "44px 50px",
            background: "rgba(15, 23, 42, 0.85)",
            borderRadius: "24px",
            border: "2px solid #334155",
          }}
        >
          <div style={{ fontSize: "56px", fontWeight: "900", color: "#f8fafc", lineHeight: "1.15" }}>
            {catMeta.label} Calculators
          </div>
          <div style={{ fontSize: "24px", fontWeight: "600", color: "#94a3b8" }}>
            Calibrated deterministic algorithms • Free instant results • Zero tracking
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "28px", fontSize: "20px", fontWeight: "600", color: "#cbd5e1" }}>
            <span>⚡ Real-time Execution</span>
            <span>✓ 64-Bit Arithmetic</span>
            <span>🌐 725 Total Online Tools</span>
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
