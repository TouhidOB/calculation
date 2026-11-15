import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get("title") || "Free Online Calculator"
  const cat = searchParams.get("cat") || "Utility & Tools"
  const desc =
    searchParams.get("desc") ||
    "Instant, accurate calculations online with step-by-step results and explanations."

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e1b4b 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle decorative glowing background accents */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 450,
            height: 450,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%)",
          }}
        />

        {/* Top Header: Brand Logo + Category Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: 26,
                fontWeight: 900,
                boxShadow: "0 8px 16px rgba(79, 70, 229, 0.4)",
              }}
            >
              ∑
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.5px", color: "#ffffff" }}>
                TryCalc<span style={{ color: "#818cf8" }}>.net</span>
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 9999,
              background: "rgba(99, 102, 241, 0.18)",
              border: "1.5px solid rgba(165, 180, 252, 0.35)",
              color: "#c7d2fe",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            <span>⚡</span>
            <span>{cat}</span>
          </div>
        </div>

        {/* Middle: Title & Description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: 1000,
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: title.length > 35 ? 54 : 64,
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-1.5px",
              color: "#ffffff",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 22,
              lineHeight: 1.5,
              color: "#94a3b8",
              maxWidth: 950,
            }}
          >
            {desc.length > 150 ? desc.slice(0, 147) + "..." : desc}
          </div>
        </div>

        {/* Bottom Feature Badges & Trust Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: 24,
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10b981", fontSize: 17, fontWeight: 700 }}>
              <span>✓</span>
              <span style={{ color: "#e2e8f0" }}>100% Free &amp; Instant</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#38bdf8", fontSize: 17, fontWeight: 700 }}>
              <span>⚡</span>
              <span style={{ color: "#e2e8f0" }}>High-Precision Math</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#a855f7", fontSize: 17, fontWeight: 700 }}>
              <span>🔒</span>
              <span style={{ color: "#e2e8f0" }}>No Sign-Up Needed</span>
            </div>
          </div>

          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#64748b",
            }}
          >
            774+ Tools Catalog
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
