# TryCalc Imon Admin Real-Time Traffic & 3D Analytics Dashboard Plan

> **For Hermes:** Use subagent-driven-development or sequential execution to implement this plan task-by-task after user approval.

**Goal:** Build a secure, password-protected administrative portal at `https://trycalc.net/imon` with credentials `IT` / `[REDACTED]` featuring a 3D modernized analytics dashboard that visualizes real-time live visitors, geographic origins (countries), temporal volumes (daily, monthly, yearly, lifetime), session dwell times, and top visited calculator endpoints.

**Architecture:** 
1. **Frontend (/imon & /api/imon/*):** Next.js App Router dynamic route with client-side session authentication (JWT/cookie-based) guarding the dashboard.
2. **Telemetry & Tracking Engine:** Lightweight client beacon / edge middleware tracking pageviews, referrer, user-agent, geolocation headers, and heartbeat duration (`navigator.sendBeacon` on visibility change and unload) without external bloat or third-party cookies.
3. **Data Aggregation & Storage:** Dedicated SQLite/PostgreSQL analytics tables (`traffic_visits`, `traffic_sessions`) with index-backed aggregation endpoints returning temporal slices (Today, 30-Day, 1-Year, All-Time), country distributions, and live-pulse active users (last 5 minutes).
4. **3D Interactive Visualization:** Three.js / Canvas WebGL interactive glowing earth globe / 3D telemetry bar matrix displaying real-time country traffic pulses, paired with high-contrast glassmorphic HUD metric cards and activity tickers.

**Tech Stack:** Next.js 16 (App Router), React 19, Material-UI (MUI v6), Three.js / WebGL Canvas, GeoIP / Header lookup, Python/Django REST Framework or Next.js Route Handlers.

---

### Task 1: Authentication & Secure Session Foundation (`/imon/login` & API)

**Objective:** Create the secure authentication endpoint and session management for user `IT` with credentials stored in environment variables, returning a signed HttpOnly session cookie or Bearer token.

**Files:**
- Create: `/home/imon/calculation/frontend/src/app/api/imon/auth/route.ts`
- Create: `/home/imon/calculation/frontend/src/lib/imon-auth.ts`
- Modify: `/home/imon/calculation/frontend/.env.production` (Add `IMON_ADMIN_USER=IT`, `IMON_ADMIN_PASSWORD=[REDACTED]`, `IMON_JWT_SECRET=[REDACTED]`)

**Step 1: Write Authentication Route Handler**
- Check POST request body for `username === process.env.IMON_ADMIN_USER` and `password === process.env.IMON_ADMIN_PASSWORD`.
- Issue HMAC-SHA256 session token with 7-day expiration.
- Rate-limit login attempts (max 5 failed attempts per 15 minutes) to protect against brute-force.

**Step 2: Verification**
- Test with valid credentials: returns HTTP 200 with session cookie.
- Test with invalid credentials: returns HTTP 401 Unauthorized.

---

### Task 2: High-Performance Telemetry Beacon & Database Storage

**Objective:** Implement a lightweight, zero-latency tracking mechanism that records page visits, country, device, path, and exact dwell time (seconds spent on page).

**Files:**
- Create: `/home/imon/calculation/frontend/src/app/api/imon/track/route.ts`
- Create: `/home/imon/calculation/frontend/src/components/TrafficTelemetry.tsx`
- Modify: `/home/imon/calculation/frontend/src/app/layout.tsx` (Inject `<TrafficTelemetry />` globally)
- Backend model / SQLite table: `traffic_sessions` (columns: `session_id`, `ip_hash`, `country_code`, `country_name`, `path`, `user_agent`, `duration_seconds`, `created_at`, `updated_at`).

**Step 1: Client Beacon (`TrafficTelemetry.tsx`)**
- On initial mount, generate unique session token and send initial visit ping to `/api/imon/track`.
- Every 15 seconds (heartbeat) and on `window.onbeforeunload` / `document.visibilitychange`, send beacon update with cumulative active seconds.
- Automatically ignore known bots (Googlebot, Bingbot, YandexBot) from inflating real user dwell time metrics.

**Step 2: Server Track Handler (`/api/imon/track/route.ts`)**
- Parse headers for IP country (Cloudflare `cf-ipcountry`, Caddy `X-Forwarded-For`, or free GeoIP lookup).
- Upsert visitor record into analytics store with timestamp and duration.

**Step 3: Verification**
- Load any calculator page; verify a new row is logged with accurate country, path, and duration increments.

---

### Task 3: Metrics Aggregation Engine API (`/api/imon/stats`)

**Objective:** Build high-speed aggregation queries providing live pulse (last 5 min), daily, monthly, yearly, lifetime counts, country breakdowns, and top pages.

**Files:**
- Create: `/home/imon/calculation/frontend/src/app/api/imon/stats/route.ts`

**Data Points Returned:**
1. **Live Pulse:** Active visitors with heartbeats within the last 5 minutes.
2. **Temporal Aggregates:**
   - Today (00:00 to now)
   - Monthly (Current calendar month)
   - Yearly (2026 to date)
   - Lifetime (All historical records)
3. **Country Breakdown:** Top countries with country code, name, visitor count, and percentage share.
4. **Engagement & Dwell Time:** Average time spent per session, distribution (<30s, 1-3m, >5m).
5. **Top Visited Pages:** Top 20 calculator and category endpoints sorted by total views and average duration.
6. **Recent Activity Feed:** Stream of the last 30 live events (Path, Country, Device, Duration).

**Step 1: Verification**
- Invoke endpoint with admin authorization header; verify JSON output structure and aggregation accuracy.

---

### Task 4: 3D Visualization Canvas (Interactive Earth Globe / Pulse Mesh)

**Objective:** Build a 3D WebGL interactive visualization component showing the earth globe with illuminated arcs and glowing markers at visitor country coordinates.

**Files:**
- Create: `/home/imon/calculation/frontend/src/components/admin/TrafficGlobe3D.tsx`

**Features:**
- Lightweight Three.js Canvas / OrbitControls.
- Dark/Luminous modern sphere with glowing continental outlines.
- Animated pulsating beacons emerging from top visitor countries (USA, UK, Germany, Bangladesh, India, Canada, etc.).
- Smooth mouse drag and auto-rotation with hover tooltips showing live active visitor counts per country.
- Graceful CSS fallback for low-spec mobile devices.

**Step 1: Verification**
- Render in isolation; verify 60 FPS rendering, zero memory leaks, and proper cleanup on component unmount.

---

### Task 5: Modernized Cyberpunk/Executive Dashboard UI (`/imon`)

**Objective:** Construct the complete `/imon` page with login guard, KPI HUD cards, 3D globe, interactive charts, and live activity ticker.

**Files:**
- Create: `/home/imon/calculation/frontend/src/app/imon/page.tsx`
- Create: `/home/imon/calculation/frontend/src/components/admin/AdminLoginModal.tsx`
- Create: `/home/imon/calculation/frontend/src/components/admin/MetricCardHUD.tsx`
- Create: `/home/imon/calculation/frontend/src/components/admin/CountryRankTable.tsx`
- Create: `/home/imon/calculation/frontend/src/components/admin/TopPagesTable.tsx`
- Create: `/home/imon/calculation/frontend/src/components/admin/LiveActivityStream.tsx`

**UI Layout & Theme:**
- **Status Bar:** Live pulse indicator (`● 12 Users Online Now`), Auto-Refresh toggle (5s, 15s, 30s), Current Date/Time.
- **Top Row (KPI Readouts):**
  - Today's Visits (with delta vs yesterday)
  - This Month's Visits
  - This Year's Visits (2026)
  - Lifetime Total Visitors
  - Average Dwell Time (e.g. `2m 45s`)
- **Middle Section (Visual Core):**
  - Left (60%): 3D Interactive Country Globe & Geo Pulse Map.
  - Right (40%): Top Countries Leaderboard with national flags, progress bars, and visitor percentages.
- **Bottom Section (Granular Analytics):**
  - Left: Top Visited Calculators (`/calculators/mortgage`, `/calculators/bmi`, etc.) with view counts and avg stay duration.
  - Right: Real-time Live Event Log (IP Hash, Country, Page Visited, Active Stay Duration).

---

### Task 6: Production Build, Testing, Security Audit & Deployment

**Objective:** Verify security isolation, zero test residue, build compilation, and zero-downtime deployment to production VPS.

**Steps:**
1. Run `npx tsc --noEmit` and `npm run build` on frontend.
2. Verify unauthorized access to `/imon` redirects to login modal without leaking data.
3. Test login with `IT` / `[REDACTED]`; verify dashboard populates with live telemetry.
4. Verify non-indexation: Add `robots: { index: false, follow: false }` to `/imon` metadata so search engines never index the admin portal.
5. Push to Git (`feat/nextjs-mui-fullstack`) and deploy on VPS `stockwhisk`.
6. Confirm zero residue in DB and temporary directories.
