# Modernized Storage RAID Calculator Implementation Plan

> **For Hermes:** Use sequential execution or subagent-driven development to implement this plan task-by-task after user review and approval.

**Goal:** Add a state-of-the-art, modernized **RAID Calculator** (`raid-calculator`) under the **"Storage Calculator"** (`storage`) category on TryCalc (`trycalc.net`), featuring an interactive visual drive-bay array rack, real-time drive failure simulator, URE (Unrecoverable Read Error) rebuild probability risk modeling, IOPS/throughput performance multipliers, cost-per-usable-TB economics, and side-by-side array comparison.

**Architecture:**
1. **Backend Math & Registry Engine (`backend/api/calculators/raid_calculator.py`):** High-precision Python calculator computing raw capacity, usable capacity (TB and TiB), parity/redundancy overhead, storage efficiency %, fault tolerance (disks survived), URE bit-error failure probability during rebuild, array rebuild duration, sequential & random IOPS throughput multipliers, and comparative matrix across 10 RAID topologies.
2. **Interactive Modernized UI Runner (`frontend/src/components/RaidCalculatorView.tsx`):** A custom MUI-based interactive experience featuring:
   - **Interactive Drive Bay Rack Visualizer**: Realistic 2 to 24 bay NAS/SAN chassis with LED indicators, visualizing Data (blue), Parity (amber), Mirror (violet), and Hot Spare (emerald) blocks.
   - **Real-Time Drive Failure Simulator**: Click any drive bay in the rack to simulate hardware failure; displays array health (Optimal 🟢, Degraded 🟡, Failed 🔴) and calculates survival probability.
   - **Interactive Capacity Segment Bar**: Multi-segment progress bar detailing Usable Space vs Parity vs Mirror vs Spare vs Wasted Space.
   - **Scientific Rebuild & URE Risk Analysis**: Mathematical calculation of rebuild data load and second-drive failure probability ($1 - (1 - P_e)^{\text{bits}}$) during multi-day rebuilds on large HDDs.
   - **Live RAID Comparison Matrix**: Side-by-side evaluation table across RAID 0, 1, 5, 6, 10, 50, 60, and OpenZFS RAID-Z1/Z2/Z3 for the user's exact drive configuration.
   - **Hardware Cost & Price per Usable TB Estimator**: CapEx hardware calculator with $/TB metrics.
   - **Hardware Presets Toolbar**: Instant 1-click configurations for Home NAS, Plex Media Server, High-IOPS Database/VM, 4K/8K Video Editing Scratch, and Enterprise Archive.
3. **SEO & Discovery Integration:**
   - Add to `storage` category in `calculators-fallback.json` (increasing total calculator count from 725 to 726, storage category from 5 to 6 tools).
   - Server-rendered Schema.org JSON-LD (`WebApplication`, `FAQPage`, `HowTo`, `BreadcrumbList`).
   - Keyword targeting: "raid calculator", "synology raid calculator", "raid 5 vs raid 6 calculator", "raid 10 usable capacity", "openzfs raidz calculator", "raid rebuild failure probability calculator".

**Tech Stack:** Python 3.12 (Django 5 REST Framework registry), Next.js 16 (App Router & Turbopack), React 19, TypeScript, Material-UI (MUI v6), Docker Compose.

---

## Detailed Task Breakdown

### Task 1: Backend RAID Math & Engine Registration
**Objective:** Create the mathematical calculation engine and register the `raid-calculator` under category `"storage"`.

**Files:**
- Create: `/home/imon/calculation/backend/api/calculators/raid_calculator.py`
- Modify: `/home/imon/calculation/backend/api/calculators/__init__.py`
- Test: `/home/imon/calculation/backend/tests/test_raid_calculator.py`

**Mathematical Specifications:**
- **Standard RAID Formulas:**
  - `RAID 0 (Striping)`: Usable = $N \times S$, Fault Tolerance = 0 drives, Efficiency = 100%.
  - `RAID 1 (Mirroring)`: Usable = $S$, Fault Tolerance = $N - 1$ drives, Efficiency = $1/N \times 100\%$.
  - `RAID 5 (Distributed Parity)`: Usable = $(N - 1 - S_{\text{spare}}) \times S$, Fault Tolerance = 1 drive, Efficiency = $(N - 1)/N \times 100\%$. Minimum 3 drives.
  - `RAID 6 (Dual Parity)`: Usable = $(N - 2 - S_{\text{spare}}) \times S$, Fault Tolerance = 2 drives, Efficiency = $(N - 2)/N \times 100\%$. Minimum 4 drives.
  - `RAID 10 (Stripe of Mirrors)`: Usable = $((N - S_{\text{spare}}) / 2) \times S$, Fault Tolerance = 1 drive per mirror set (up to $N/2$ non-paired), Efficiency = 50%. Minimum 4 drives (even count).
  - `RAID 50 (Striped RAID 5)`: Usable = $(N - G - S_{\text{spare}}) \times S$ (where $G \ge 2$ RAID 5 groups), Fault Tolerance = 1 drive per group (up to $G$), Minimum 6 drives.
  - `RAID 60 (Striped RAID 6)`: Usable = $(N - 2G - S_{\text{spare}}) \times S$ (where $G \ge 2$ RAID 6 groups), Fault Tolerance = 2 drives per group, Minimum 8 drives.
  - `ZFS RAID-Z1`: Usable = $(N - 1) \times S$.
  - `ZFS RAID-Z2`: Usable = $(N - 2) \times S$.
  - `ZFS RAID-Z3`: Usable = $(N - 3) \times S$.
  - `JBOD`: Usable = $N \times S$, Fault Tolerance = 0.
- **Tebibytes (TiB) vs Terabytes (TB):**
  - $\text{Capacity}_{\text{TiB}} = \text{Capacity}_{\text{TB}} \times \frac{10^{12}}{2^{40}} \approx \text{Capacity}_{\text{TB}} \times 0.90949$.
  - $\text{Formatted Usable} = \text{Capacity}_{\text{TiB}} \times 0.98$ (standard 2% filesystem inode/metadata reserve).
- **URE Rebuild Risk Formula:**
  - $\text{Bits to Read} = (N - 1) \times S \times 8 \times 10^{12}$.
  - Error rate $P_e$: Consumer HDD = $10^{-14}$, Enterprise HDD = $10^{-15}$, Enterprise SSD = $10^{-16}$.
  - $P(\text{URE Failure}) = 1 - (1 - P_e)^{\text{Bits to Read}}$.
- **Rebuild Time Formula:**
  - $\text{Rebuild Time (Hours)} = \frac{S \times 10^6}{\text{Rebuild Speed (MB/s)} \times 3600}$.
- **Performance Multipliers:**
  - Read Speed = $N_{\text{data}} \times \text{Speed}_{\text{drive}}$.
  - Write Speed = Calculated based on parity write penalty (RAID 5 write penalty: 4 IOs, RAID 6: 6 IOs, RAID 10: 2 IOs).

**Verification:**
- Run Python unit tests verifying exact capacity, parity, and URE probability outputs for 4x 8TB RAID 5, 8x 16TB RAID 6, and 4x 2TB RAID 10.

---

### Task 2: Static Registry & Frontend Icon Synchronization
**Objective:** Add `raid-calculator` to static fallback metadata, icon registries, and category counts so SSR and client-side navigation have instant zero-lag data parity.

**Files:**
- Modify: `/home/imon/calculation/frontend/src/lib/calculators-fallback.json`
  - Append `raid-calculator` under category `"storage"`.
  - Increment total count from 725 to 726.
- Modify: `/home/imon/calculation/frontend/src/lib/calc-icons.ts`
  - Register `"raid-calculator": "Dns"` (or `"Storage"`).

**Verification:**
- Run Node.js script asserting `calculators-fallback.json` has 726 total items and `categories.storage` has 6 items.

---

### Task 3: Interactive Modernized UI (`RaidCalculatorView.tsx`)
**Objective:** Build the flagship interactive frontend view for the RAID calculator.

**Files:**
- Create: `/home/imon/calculation/frontend/src/components/RaidCalculatorView.tsx`
- Modify: `/home/imon/calculation/frontend/src/components/CalculatorRunnerView.tsx` (Wire `calc.id === "raid-calculator"`)

**Component Architecture:**
1. **Rackmount Chassis Visualizer:**
   - Visual enclosure rendering 2 to 24 hot-swap drive bays in a grid with metallic borders, drive labels (Drive #1, Drive #2, etc.), capacity badges, and activity LEDs.
   - Color coding:
     - Blue (#0284c7): Data Striping
     - Amber (#f59e0b): Parity (RAID 5/6/50/60/ZFS)
     - Purple (#8b5cf6): Mirror Copy (RAID 1/10)
     - Green (#10b981): Hot Spare
     - Gray (#94a3b8): Unused / Wasted
     - Red (#ef4444) with pulse animation: Simulated Failed Drive
2. **Drive Failure Simulation Mode:**
   - Toggle button: "🧪 Test Drive Failure Simulation".
   - When active, clicking any bay toggles it between Healthy and Failed.
   - Dynamic Array Status Banner:
     - 🟢 **Optimal:** "All N drives online. Full fault tolerance intact."
     - 🟡 **Degraded:** "1 drive offline. Array remains fully operational via parity reconstruction, but redundancy is compromised. Replace drive immediately!"
     - 🔴 **Failed (Data Loss):** "2 drives offline in RAID 5. Parity exhausted. Volume unmountable."
3. **Storage Allocation Breakdown Bar:**
   - Visual multi-segment progress bar displaying:
     - Usable Storage (e.g., 24.0 TB / 21.8 TiB — 75.0%)
     - Parity / Redundancy (e.g., 8.0 TB — 25.0%)
     - Hot Spares (if assigned)
     - Format Overhead
4. **Reliability & URE Risk Warning Card:**
   - Displays calculated URE probability during rebuild for the selected drive grade (Consumer vs Enterprise vs SSD).
   - Clear contextual advice (e.g. "⚠️ Warning: With 4x 14TB consumer drives in RAID 5, rebuild URE risk is ~58%. RAID 6 is strongly recommended for drives >= 8TB").
5. **Interactive RAID Comparison Matrix Table:**
   - Dynamic table comparing RAID 0, 1, 5, 6, 10, 50, 60, ZFS Z1, ZFS Z2 for the current disk count and size:
     - Columns: RAID Level, Usable Capacity, Redundancy Loss, Fault Tolerance, Read Multiplier, Write Penalty, Recommendation.
     - 1-click "Apply This RAID" button on each row.
6. **CapEx Hardware Cost Estimator:**
   - User inputs price per drive ($) -> displays Total Drive Cost, Cost per Raw TB, and Cost per Usable TB.
7. **Preset Cards:**
   - 1-click quick setups:
     - 🏠 Home Media NAS (4 × 4TB RAID 5)
     - 🏬 Small Business Office (6 × 8TB RAID 6)
     - ⚡ High-IOPS Database / VM (8 × 2TB NVMe RAID 10)
     - 🎬 4K/8K Video Editing Scratch (4 × 2TB SSD RAID 0)
     - 🏢 Enterprise Big Data Vault (16 × 18TB RAID 60)
8. **Export & Print Bar:**
   - "Copy Hardware Bill of Materials & Specs" button.
   - "Print Array Specification Sheet" button.

**Verification:**
- Test all input controls (drive count slider 2–24, drive size selector 1TB–24TB, RAID level selector, drive type, hot spare selector).
- Verify instant recalculation on slider change with zero lag.

---

### Task 4: SEO Metadata, Rich Snippets & Deep Indexing
**Objective:** Optimize the RAID calculator for search engines, rich snippets, and Google Search Console visibility.

**Files:**
- Modify: `/home/imon/calculation/frontend/src/app/calculators/[calcId]/page.tsx`
  - Add specialized keywords, SEO intro, direct answer capsule, FAQ list, and How-To steps for `raid-calculator`.

**SEO Assets:**
- **Title:** `RAID Calculator (2026) — Array Capacity, Redundancy & Rebuild Risk | TryCalc`
- **Keywords:** `raid calculator`, `synology raid calculator`, `raid 5 calculator`, `raid 6 calculator`, `raid 10 vs raid 5`, `nas storage calculator`, `raid capacity calculator`, `openzfs raidz calculator`, `raid rebuild failure probability`, `unrecoverable read error raid calculator`, `truepas raid calculator`.
- **Structured Data:**
  - `WebApplication` (UtilityApplication, Free)
  - `FAQPage` (6 in-depth questions on RAID levels, rebuild times, URE risks, RAID vs Backup)
  - `HowTo` (4-step array sizing guide)
  - `BreadcrumbList` (Home > Storage Calculator > RAID Calculator)

**Verification:**
- Run `curl -sL https://trycalc.net/calculators/raid-calculator` after deploy to verify JSON-LD tags, H1, H2, and FAQ markup.

---

### Task 5: Build, Test & VPS Production Deployment
**Objective:** Compile the Next.js frontend, execute test suites, push Git commits, deploy to VPS `stockwhisk` (163.227.239.114), and rebuild Docker containers with zero downtime.

**Execution Steps:**
1. Run local Next.js build: `cd /home/imon/calculation/frontend && npm run build` (assert 764 routes compile with zero TypeScript errors).
2. Commit and push changes to branch `feat/nextjs-mui-fullstack`:
   `git commit -m "feat(storage): add modernized interactive RAID Calculator with array visualizer and rebuild risk"`
3. SSH to VPS `stockwhisk` and pull branch:
   `ssh stockwhisk "cd /root/trycalc/app && git pull origin feat/nextjs-mui-fullstack"`
4. Rsync fresh `.next` build from local machine to VPS:
   `rsync -avz --delete /home/imon/calculation/frontend/.next/ stockwhisk:/root/trycalc/app/frontend/.next/`
5. Rebuild and restart frontend and backend Docker containers:
   `ssh stockwhisk "cd /root/trycalc/app && docker compose build backend && docker compose build --no-cache frontend && docker compose up -d"`
6. Verify live deployment:
   - Check HTTP 200 on `https://trycalc.net/calculators/raid-calculator`
   - Check `https://trycalc.net/category/storage` lists 6 calculators (including CCTV Storage and RAID Calculator)
   - Capture live headless browser screenshot and inspect rendered visual bay rack.

---

## Risks, Tradeoffs & Mitigations

1. **Mixed Drive Size Complexity:**
   - *Risk:* Enterprise hardware RAID controllers require uniform drive sizes, whereas consumer NAS (Synology SHR, Unraid) allows mixed sizes.
   - *Mitigation:* Support standard uniform drive calculation as primary default, with an advanced toggle for "Mixed Drive Array (Synology SHR-1 / SHR-2 Algorithm)" so both IT admins and homelab users get exact calculations.
2. **Rebuild Time vs Real-World Drive Throttling:**
   - *Risk:* Real-world rebuild times depend on controller CPU and ongoing I/O load, not just raw disk speed.
   - *Mitigation:* Provide an adjustable "Rebuild Speed" slider (defaulting to a realistic 80 MB/s for active NAS arrays) with a clear tooltip explaining performance impact under active load.
3. **Next.js Standalone Docker Cache Staleness:**
   - *Risk:* Docker image copies `.next/standalone` which is git-ignored, causing stale SSR HTML if not synced.
   - *Mitigation:* Mandatory rsync of `.next` directory to `/root/trycalc/app/frontend/.next/` before running `docker compose build --no-cache frontend` (proven in previous deployment).

---

## Verification Checklist

- [ ] Python backend unit test passes: `_raid_calculator` returns exact capacity for RAID 0, 1, 5, 6, 10, 50, 60, ZFS Z1/Z2.
- [ ] TypeScript build succeeds with 0 errors across all 764 routes.
- [ ] `https://trycalc.net/calculators/raid-calculator` loads with 200 OK.
- [ ] Visual drive bay rack updates instantly when changing drive count, size, or RAID type.
- [ ] Drive failure simulator correctly shows Degraded and Failed status upon clicking bays.
- [ ] Storage category page `https://trycalc.net/category/storage` and sidebar drawer show count 6.
- [ ] Live visual verification via headless browser screenshot.
