import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const ADMIN_USER = process.env.IMON_ADMIN_USER || "IT"
const ADMIN_PASS = process.env.IMON_ADMIN_PASSWORD || "imran%$#"
const JWT_SECRET = process.env.IMON_JWT_SECRET || "trycalc-imon-dashboard-secret-key-2026-981723"

function signToken(username: string): string {
  const payload = JSON.stringify({
    user: username,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days valid
  })
  const b64Payload = Buffer.from(payload).toString("base64url")
  const hmac = crypto.createHmac("sha256", JWT_SECRET).update(b64Payload).digest("base64url")
  return `${b64Payload}.${hmac}`
}

export function verifyToken(token: string): boolean {
  try {
    const [b64Payload, hmac] = token.split(".")
    if (!b64Payload || !hmac) return false
    const expected = crypto.createHmac("sha256", JWT_SECRET).update(b64Payload).digest("base64url")
    if (hmac !== expected) return false
    const data = JSON.parse(Buffer.from(b64Payload, "base64url").toString("utf-8"))
    if (data.exp < Date.now()) return false
    return data.user === ADMIN_USER
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = signToken(username)
      const res = NextResponse.json({ ok: true, message: "Authentication successful" })
      res.cookies.set("imon_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      })
      return res
    }

    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 })
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true, message: "Logged out" })
  res.cookies.delete("imon_token")
  return res
}
