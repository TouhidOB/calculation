"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function TrafficTelemetry() {
  const pathname = usePathname()
  const startTimeRef = useRef<number>(Date.now())
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Skip tracking on admin page to avoid self-counting
    if (pathname.startsWith("/imon")) return

    // Get or create anonymous session ID
    let sessionId = ""
    try {
      sessionId = sessionStorage.getItem("tc_sid") || ""
      if (!sessionId) {
        sessionId = "s_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36)
        sessionStorage.setItem("tc_sid", sessionId)
      }
    } catch {
      sessionId = "s_fallback_" + Math.random().toString(36).substring(2, 9)
    }

    startTimeRef.current = Date.now()

    const sendPing = (duration: number) => {
      const payload = JSON.stringify({
        sessionId,
        path: pathname,
        referrer: typeof document !== "undefined" ? document.referrer : "",
        durationSeconds: duration,
      })

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/imon/track", new Blob([payload], { type: "application/json" }))
      } else {
        fetch("/api/imon/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {})
      }
    }

    // Initial pageview registration (0s duration)
    sendPing(0)

    // Heartbeat every 15 seconds to track dwell time
    heartbeatTimerRef.current = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
      sendPing(elapsed)
    }, 15000)

    const handleUnload = () => {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
      sendPing(elapsed)
    }

    window.addEventListener("beforeunload", handleUnload)
    window.addEventListener("pagehide", handleUnload)

    return () => {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current)
      window.removeEventListener("beforeunload", handleUnload)
      window.removeEventListener("pagehide", handleUnload)
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
      sendPing(elapsed)
    }
  }, [pathname])

  return null
}
