# Architecture & Design Plan: Infusing Authentic Hardware & Precision Instrument Vibe Across All 689 Calculators

> **For Hermes:** Follow this blueprint to systematically upgrade TryCalc's calculator runner into an authentic, tactile, precision instrument console.

**Goal:** Transform all 689 calculator interfaces on `trycalc.net` from flat web forms into tactile, high-precision "Instrument Workstation Consoles" (reminiscent of executive financial terminals, precision laboratory meters, and engineering workstations) while maintaining 100% responsiveness, zero latency, and pure light-theme clarity.

**Architecture:** A modular skeuomorphic-tactile design system built atop MUI 6 and Tailwind CSS. The central `CalculatorRunnerView` is refactored into a dual-chassis workstation: an **Input Control Deck** with tactile recessed fields and mechanical 3D action triggers on the left, and a **Digital Instrument Readout & Ledger Console** on the right with an illuminated primary KPI screen, category-specific visualizers (Thermal Ledger Slip, Precision Arc Gauge, and Engineering Spec Sheet), and an audit action bar.

**Tech Stack:** Next.js 16 (Turbopack), React 19, TypeScript, Material UI (MUI), Emotion, SVG Vector Gauges, DOMPurify.

---

## 1. Deep Analysis of Current Calculator Architecture

### Current State
* **Catalog Size:** 689 live tools (706 defined in `calculators-fallback.json`), categorized into 11 distinct domains (`finance`, `health`, `construction`, `conversion`, `basic`, `garments`, `date_time`, `business_investment`, `real_estate`, `education`, `event_budget`).
* **Universal Runner:** All 689 calculators are rendered through a single master component: `CalculatorRunnerView.tsx` (`src/components/CalculatorRunnerView.tsx`).
* **Dual Calculation Engines:**
  1. **Python DRF Backend:** Returns structured key-value maps (e.g., `{"monthly_payment": "$1,432.25", "total_interest": "$215,610.00"}`).
  2. **Sandboxed Client JS (`JsExecutor.tsx`):** Executes complex legacy scripts and renders HTML blocks with tables, summaries, or text.
* **The Problem / User Need:**
  * While the homepage QuickCalculator and Scientific Calculator have achieved stunning, photorealistic hardware presence (molded plastic chassis, solar cells, STN liquid crystal screens, 3D tactile buttons), the individual calculator pages currently look like flat, standard web forms (`#ffffff` cards, 1px grey borders, plain text fields).
  * They lack the tangible weight, precision craftsmanship, and tactile satisfaction that make professional instruments feel trustworthy, satisfying, and authoritative.

---

## 2. Core Design System: "TryCalc Precision Console"

We will define 4 key architectural primitives to give every calculator a cohesive, realistic instrument feel:

```
+-----------------------------------------------------------------------------------+
|                        TRYCALC PRECISION INSTRUMENT CONSOLE                       |
|   [● LIVE READY]  TRYCALC PRECISION CORE v2.4       [64-BIT PRECISION INSTRUMENT] |
+-------------------------------------------------+---------------------------------+
|               INPUT CONTROL DECK                |  DIGITAL READOUT & LEDGER DECK  |
|                                                 |                                 |
| +---------------------------------------------+ | +-----------------------------+ |
| | Recessed Field Group                        | | | ILLUMINATED DIGITAL SCREEN  | |
| | [ Home Price             |   $ 400,000.00 ] | | |  TOTAL MONTHLY PAYMENT      | |
| |                                             | | |  $ 2,450.85 / mo            | |
| | [ Down Payment (20%)     |   $  80,000.00 ] | | |  [● FIXED] [30-YR] [P&I]    | |
| |                                             | | +-----------------------------+ |
| | [ Interest Rate          |         6.85 % ] | |                                 |
| |                                             | | +-----------------------------+ |
| | [ Loan Term              |       30 Years ] | | | CATEGORY VISUALIZER:        | |
| +---------------------------------------------+ | |  • Finance: Audit Ledger    | |
|                                                 | |  • Health: Analog Arc Gauge | |
| +---------------------------------------------+ | |  • Construction: Spec Sheet | |
| | TACTILE ACTION TRIGGERS                     | | +-----------------------------+ |
| | [ ⚡ CALCULATE (3D Depth) ]                  | |                                 |
| | [ ⟳ PRESET A ]  [ ↺ CLEAR ]                 | | [ COPY AUDIT ] [ PRINT SLIP ] | |
+-------------------------------------------------+---------------------------------+
```

### Pillar A: The Instrument Chassis (Cabinet Enclosure)
* **Surface:** Soft satin platinum/slate finish (`linear-gradient(180deg, #f8fafc 0%, #edf2f7 50%, #e2e8f0 100%)`).
* **Outer Trim:** 2px beveled chassis border with dual-layer shadows (`0 20px 45px -12px rgba(15, 23, 42, 0.22), inset 0 1px 2px #ffffff`).
* **Header Status Strip:**
  * Left: Pulsing emerald micro-LED indicator (`● SYSTEM READY`).
  * Center: Subtly embossed metallic console badge: `TRYCALC PRECISION INSTRUMENT · TC-689`.
  * Right: Technical specification tag: `64-BIT COMPUTE CORE · CALIBRATED`.

### Pillar B: The Tactile Input Deck
* **Recessed Wells:** Input fields sit inside subtle recessed wells (`inset 0 2px 4px rgba(15, 23, 42, 0.05)`), simulating physical console cutouts.
* **Molded Hardware Adornments:** Currency symbols (`$`, `€`, `৳`) and units (`%`, `years`, `kg`, `sq ft`) styled as brushed metallic/matte badges rather than plain text.
* **3D Mechanical Action Triggers:**
  * **Calculate Trigger:** High-profile 3D tactile button with distinct bottom-edge travel shadow (`boxShadow: 0 4px 0 #3730a3, 0 6px 12px rgba(79, 70, 229, 0.35)`), active depression on press (`transform: translateY(3px)`).
  * **Preset & Reset Triggers:** Tactile rocker buttons with physical travel.

### Pillar C: The Illuminated Digital Readout Display
* **Recessed Display Bezel:** Deep slate bezel with inner shadow and top-down acrylic glass glare highlight.
* **Liquid Crystal / Digital Matrix Screen:**
  * Displays the **Hero Calculated Metric** (e.g. `$2,450.85` or `22.4 BMI` or `14.5 cu yd`) in sharp digital typography.
  * Status Annunciator Flags: Small illuminated tags (e.g., `[ANNUAL]`, `[MONTHLY]`, `[OPTIMAL]`, `[AMORTIZED]`).

### Pillar D: Category-Specific Realistic Visualizers
Instead of identical generic text lists, results are rendered using authentic domain-specific artifacts:
1. **Finance & Business Calculators:**
   * **Thermal Audit Ledger Slip:** Styled like a crisp, high-grade financial register receipt with dotted ledger rules, monospace alignment, itemized subtotals, and an official `VERIFIED CALCULATION` seal stamp.
2. **Health, Fitness & Ratio Calculators (BMI, Body Fat, DTI, Calorie):**
   * **Precision Segmented Arc Gauge:** An authentic analog/digital dial meter with color-zoned arc tracks (Green = Healthy/Low Risk, Yellow = Moderate, Red = High) and an animated indicator needle.
3. **Construction, Real Estate & RMG Tools (Concrete, Bricks, Tiles, Costing):**
   * **Technical Specification & Bill of Materials (BOM) Sheet:** Structured like an engineering job-site worksheet, with quantity, standard units, packaging specs, and an adjustable 5%–10% wastage margin toggle.

---

## 3. Step-by-Step Task Breakdown

### Task 1: Create Reusable Hardware Console Primitives
**Objective:** Build dedicated UI components in `src/components/instrument/` to provide consistent skeuomorphic styling.
* **Files:**
  * Create: `frontend/src/components/instrument/InstrumentChassis.tsx` (Outer hardware panel & status strip)
  * Create: `frontend/src/components/instrument/DigitalReadoutScreen.tsx` (Recessed LCD/digital readout window)
  * Create: `frontend/src/components/instrument/TactileTriggerButton.tsx` (3D mechanical action button)
  * Create: `frontend/src/components/instrument/TactileFieldWrapper.tsx` (Recessed input frame with metallic unit badge)

### Task 2: Build Category-Specific Visualizer Modules
**Objective:** Provide domain-authentic result outputs for Finance, Health, and Engineering.
* **Files:**
  * Create: `frontend/src/components/instrument/AuditLedgerSlip.tsx` (Financial receipt/ledger breakdown)
  * Create: `frontend/src/components/instrument/PrecisionArcGauge.tsx` (Analog/digital arc meter for ratios & health)
  * Create: `frontend/src/components/instrument/SpecificationSheet.tsx` (Engineering BOM worksheet for construction & garments)

### Task 3: Refactor `CalculatorRunnerView.tsx` to Master Console
**Objective:** Wire the new Instrument Console architecture into the universal runner.
* **Files:**
  * Modify: `frontend/src/components/CalculatorRunnerView.tsx`
* **Changes:**
  * Wrap the calculator area inside `InstrumentChassis`.
  * Replace the flat result card with `DigitalReadoutScreen` displaying the primary metric.
  * Dynamically route secondary metrics through the matching category visualizer (`AuditLedgerSlip` for Finance, `PrecisionArcGauge` for Health/Ratios, `SpecificationSheet` for Materials, or enhanced visual grid for General).
  * Enhance input fields with `TactileFieldWrapper` and `TactileTriggerButton`.

### Task 4: Integrate Client JS Results with the Console Aesthetic
**Objective:** Ensure that calculators executed through `JsExecutor` (which output custom HTML) also inherit the authentic console styling.
* **Files:**
  * Modify: `frontend/src/components/CalculatorRunnerView.tsx`
  * Modify: `frontend/src/app/globals.css` (Target generated table/summary elements within `.calculator-result-container` to automatically apply ledger typography, crisp grid borders, and high-contrast numbers).

### Task 5: Mobile Ergonomics & Print Optimization
**Objective:** Ensure seamless scaling across mobile touchscreens and clean thermal/paper output for print.
* **Files:**
  * Modify: `frontend/src/components/CalculatorRunnerView.tsx`
* **Changes:**
  * Mobile view: Gracefully stacks the Control Deck on top and the Digital Readout Deck directly underneath.
  * Print view: Automatically strips navigation, backgrounds, and action buttons, printing a clean, formal "TryCalc Official Calculation Slip".

### Task 6: Production Build, Testing & Multi-Category Verification
**Objective:** Verify that all 689 calculators compile cleanly with zero regressions.
* **Verification Steps:**
  1. Run `npm run build` in `frontend/`.
  2. Verify top calculators across 5 diverse categories:
     - Finance: `mortgage-calculator`, `loan-calculator`
     - Health: `bmi-calculator`, `calorie-calculator`
     - Construction: `concrete-calculator`
     - Business: `roi-calculator`
     - Conversion: `length-converter`
  3. Capture visual verification screenshots via CDP headless browser.
  4. Git commit, push, and deploy to live VPS.

---

## 4. Risks & Safeguards

1. **Risk:** Performance overhead from complex CSS effects across 689 pages.
   * **Safeguard:** Use pure CSS gradients, box-shadows, and vector SVGs. Zero external 3D libraries (Three.js) or heavy canvas dependencies. Zero impact on LCP or TBT.
2. **Risk:** Disrupting JS-executed calculators (`JsExecutor`).
   * **Safeguard:** Isolate raw HTML rendering inside the styled console container using CSS contextual selectors, ensuring table styling is enhanced without modifying JS DOM output directly.
3. **Risk:** Theme/Dark mode conflicts.
   * **Safeguard:** Adhere strictly to the project's high-contrast Light Theme specification (`#0f172a` text, `#f8fafc` to `#e2e8f0` chassis, `#ffffff` card well).

---

## 5. Execution Recommendation
Following the `plan` skill guidelines, this plan is fully designed and documented. Once approved by the user, we will proceed task-by-task with rigorous testing and verification.
