# TryCalc & Calculation Hub — Agent Engineering Context (AGENTS.md)

## Architecture Overview
- **Frontend:** Next.js (Port :3001).
- **Backend:** Python/Django API (Port :8000).
- **Public Domain:** `trycalc.net` / HTTPS Port :443.
- **Inventory:** 725+ calculators across 12 distinct categories.
- **Monetization:** Google AdSense `ca-pub-2861472312283458`.

## Admin & Automation
- **Admin Path:** `/imon` dashboard (Daily visitors, Live SERP Radar).
- **Cron Jobs:** `0 3 * * *` daily rank tracker.
- **Proxy Constraint:** FE Proxy must resolve internal `BACKEND_URL`.
- **SEO Standards:** E-E-A-T schemas, hreflang, zero layout shift (CLS < 0.05).
