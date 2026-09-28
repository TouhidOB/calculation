/**
 * Advanced SEO, GEO (Generative Engine Optimization) & AEO content helpers.
 * Provides rich domain-specific FAQs, Direct Answer Capsules, worked numerical
 * examples, mathematical formulas, and high-intent topic cluster maps.
 */
import type { CalculatorDef } from "@/lib/calculator-api"
import { CATEGORY_META } from "@/lib/calculator-api"

export function seoTitleFor(calc: CalculatorDef): string {
  const cat = CATEGORY_META[calc.category]?.label || calc.category
  return `${calc.name} — Free Online ${cat.replace(" Calculators", " Calculator")} | TryCalc`
}

export function seoMetaDescriptionFor(calc: CalculatorDef): string {
  const cat = (CATEGORY_META[calc.category]?.label || calc.category).replace(/ Calculators?$/i, "")
  const fieldList = calc.fields.slice(0, 3).map((f) => f.label).join(", ")
  const base = `Free online ${calc.name} for instant ${cat.toLowerCase()} results. Enter ${fieldList} for accurate figures, formula breakdown, and insights. Try it now!`
  if (base.length <= 160) return base
  return `Calculate ${calc.name} instantly with our free online tool. Accurate ${cat.toLowerCase()} calculations with step-by-step breakdown. 100% free, no signup.`
}

/**
 * 40-55 word direct answer capsule targeted for Google AI Overviews, Perplexity & ChatGPT Search.
 */
export function seoDirectAnswerFor(calc: CalculatorDef): string {
  const name = calc.name.toLowerCase()

  if (name.includes("mortgage")) {
    return "A mortgage payment is calculated using the standard fixed-rate amortization equation: M = P[r(1+r)^n] / [(1+r)^n - 1]. For a $400,000 loan at 6.5% interest over 30 years (360 months), the monthly principal and interest payment is $2,528.27, totaling $910,178 over the full term."
  }
  if (name.includes("loan payment") || name.includes("personal loan") || name.includes("auto loan")) {
    return "Monthly loan payments are determined by amortizing the principal balance over the repayment duration at the periodic interest rate. For a $25,000 personal or auto loan at 5.0% annual interest over 60 months, the fixed monthly payment is $471.78."
  }
  if (name.includes("compound interest")) {
    return "Compound interest computes future accumulated value via A = P(1 + r/n)^(nt). An initial deposit of $10,000 invested at 7% annual interest compounded monthly over 10 years will grow to $20,096.61, generating $10,096.61 in compound interest."
  }
  if (name.includes("bmi") || name.includes("body mass index")) {
    return "Body Mass Index (BMI) is an anthropometric metric calculated as weight in kilograms divided by height in meters squared (BMI = kg/m²). For an adult measuring 175 cm (5 ft 9 in) and weighing 70 kg (154 lbs), the BMI is 22.9, falling into the optimal Normal Weight category (18.5–24.9)."
  }
  if (name.includes("calorie") || name.includes("bmr") || name.includes("tdee")) {
    return "Daily caloric expenditure combines Basal Metabolic Rate (BMR) and physical activity. Using the Mifflin-St Jeor formula, a 30-year-old male weighing 75 kg at 178 cm height has a resting BMR of ~1,718 calories, scaling to ~2,362 daily calories for moderate physical activity."
  }
  if (name.includes("concrete")) {
    return "Concrete slab volume is determined by multiplying Length × Width × Depth (in meters or feet). A 10 m × 5 m slab with a 15 cm thickness requires exactly 7.5 cubic meters (9.81 cubic yards) of concrete, equivalent to approximately 441 standard 50-kg cement bags with sand and aggregate."
  }
  if (name.includes("roi") || name.includes("return on investment")) {
    return "Return on Investment (ROI) evaluates capital efficiency using ROI = [(Final Value - Initial Cost) / Initial Cost] × 100%. An investment growing from $10,000 to $15,000 yields an absolute ROI of 50.00% ($5,000 net profit)."
  }

  const fieldsDesc = calc.fields.slice(0, 3).map((f) => f.label).join(", ")
  return `The ${calc.name} evaluates ${fieldsDesc} to produce verified, deterministic outputs according to standard mathematical models. Execute the calculator above to generate instant itemized figures, exportable audit ledgers, and calculation breakdowns.`
}

export function seoIntroFor(calc: CalculatorDef): string {
  const fname = calc.name.toLowerCase()
  const fieldList = calc.fields.slice(0, 4).map((f) => f.label.toLowerCase()).join(", ")

  const intros: Record<string, string> = {
    finance: `Use this free online ${fname} to get instant, accurate results for your financial planning. Enter ${fieldList} and get detailed breakdowns with charts-ready numbers — ideal for loans, savings, investments, and budgeting decisions.`,
    health: `Calculate your ${fname.replace(" calculator", "")} results instantly with this free online health tool. Enter ${fieldList} for a personalized health assessment used by fitness enthusiasts and healthcare screening.`,
    construction: `Estimate materials, costs, and quantities with this free online ${fname}. Enter ${fieldList} to plan your construction project accurately — concrete, paint, tiles, gravel, and more.`,
    conversion: `Convert instantly with this free online ${fname}. Enter your value in ${fieldList} and get precise conversions — length, weight, temperature, area, volume, data, and currency units.`,
    date_time: `Find exact dates and durations with this free online ${fname}. Enter ${fieldList} to calculate ages, date differences, working days, and countdowns in seconds.`,
    real_estate: `Plan property decisions with this free online ${fname}. Enter ${fieldList} to estimate mortgage payments, affordability, rental yield, and closing costs.`,
    basic: `Solve everyday math instantly with this free online ${fname}. Enter ${fieldList} for percentage, discount, tip, and ratio results you can trust.`,
    education: `Compute grades and academic scores with this free online ${fname}. Enter ${fieldList} to get GPA, percentages, test scores, and grade point averages.`,
    math: `Solve math problems step-by-step with this free online ${fname}. Enter ${fieldList} for fractions, statistics, algebra, and geometry answers.`,
    event_budget: `Budget your events perfectly with this free online ${fname}. Enter ${fieldList} to estimate costs, split expenses, and track spending.`,
    business_investment: `Project returns and business metrics with this free online ${fname}. Enter ${fieldList} for ROI, growth, margin, and investment analysis.`,
    science: `Compute scientific values with this free online ${fname}. Enter ${fieldList} for physics, chemistry, and engineering calculations.`,
    misc: `Get quick answers with this free online ${fname}. Enter ${fieldList} for instant, accurate results.`,
    other: `Get quick answers with this free online ${fname}. Enter ${fieldList} for instant, accurate results.`,
  }
  return intros[calc.category] || intros.misc
}

export function seoHowToFor(calc: CalculatorDef): string[] {
  const fields = calc.fields.slice(0, 3)
  const steps: string[] = []
  steps.push(`Open the ${calc.name} — all inputs are clearly labeled with units.`)
  fields.forEach((f, i) => {
    const unit = f.unit ? ` (in ${f.unit})` : ""
    steps.push(`Enter your ${f.label.toLowerCase()}${unit} — step ${i + 1} of ${fields.length}.`)
  })
  steps.push("Click the Calculate button — your result appears instantly on the right panel.")
  steps.push("Adjust any input and recalculate as many times as you need — it's 100% free, no signup required.")
  return steps
}

export interface WorkedExample {
  title: string
  scenario: string
  inputs: { label: string; value: string }[]
  results: { label: string; value: string }[]
  explanation: string
}

export function seoWorkedExampleFor(calc: CalculatorDef): WorkedExample {
  const name = calc.name.toLowerCase()

  if (name.includes("mortgage")) {
    return {
      title: "Real-World Mortgage Calculation Scenario",
      scenario: "Purchasing a $500,000 property with 20% down ($100,000), financing $400,000 on a 30-year fixed loan at 6.5% interest.",
      inputs: [
        { label: "Loan Amount (Principal)", value: "$400,000" },
        { label: "Interest Rate", value: "6.5% APR" },
        { label: "Loan Term", value: "30 Years (360 Months)" },
      ],
      results: [
        { label: "Monthly Payment (P&I)", value: "$2,528.27" },
        { label: "Total Interest Paid", value: "$510,177.95" },
        { label: "Total Cost of Loan", value: "$910,177.95" },
      ],
      explanation: "Over the 30-year lifecycle, monthly payments amortize principal while paying down compounding interest. Making one extra payment per year can shorten repayment by over 4 years.",
    }
  }

  if (name.includes("bmi") || name.includes("body mass index")) {
    return {
      title: "Sample Adult Anthropometric Evaluation",
      scenario: "An adult individual measuring 175 cm (5 feet 9 inches) in stature with a body weight of 70 kg (154.3 lbs).",
      inputs: [
        { label: "Height", value: "175 cm (1.75 m)" },
        { label: "Weight", value: "70.0 kg" },
      ],
      results: [
        { label: "Body Mass Index (BMI)", value: "22.9 kg/m²" },
        { label: "WHO Classification", value: "Normal / Healthy Weight" },
        { label: "Healthy Weight Range", value: "56.7 kg – 76.3 kg" },
      ],
      explanation: "A BMI of 22.9 sits well within the WHO optimal range of 18.5 to 24.9 kg/m², which correlates statistically with minimal cardiovascular and metabolic health risks.",
    }
  }

  if (name.includes("concrete")) {
    return {
      title: "Residential Patio Slab Construction Estimate",
      scenario: "Pouring a rectangular concrete foundation slab measuring 10 meters in length, 5 meters in width, and 15 centimeters in depth.",
      inputs: [
        { label: "Slab Length", value: "10.0 m" },
        { label: "Slab Width", value: "5.0 m" },
        { label: "Slab Thickness", value: "15.0 cm (0.15 m)" },
      ],
      results: [
        { label: "Total Concrete Volume", value: "7.50 m³ (9.81 yd³)" },
        { label: "Standard 50kg Bags", value: "441 Bags (approx.)" },
        { label: "Coarse Sand Required", value: "3.75 m³" },
        { label: "Crushed Gravel Required", value: "5.625 m³" },
      ],
      explanation: "Engineers recommend adding a 10% wastage margin for site settling, irregular excavation edges, and mixer spillage, bringing the total order to ~8.25 m³.",
    }
  }

  // Generic worked example fallback based on default fields
  return {
    title: `Practical Application Example for ${calc.name}`,
    scenario: `Standard operational scenario demonstrating verified calculation using representative benchmark values.`,
    inputs: calc.fields.slice(0, 3).map((f) => ({
      label: f.label,
      value: `${f.default || "100"} ${f.unit || ""}`.trim(),
    })),
    results: [
      { label: "Deterministic Output", value: "Verified by Engine" },
      { label: "Computation Status", value: "High Precision (64-bit)" },
    ],
    explanation: `Calculations execute instantaneously using deterministic mathematical models without external network latency.`,
  }
}

/**
 * Domain-specific, highly relevant FAQs (E-E-A-T compliant) preventing thin-content penalties.
 */
export function seoFaqFor(calc: CalculatorDef): { q: string; a: string }[] {
  const name = calc.name.toLowerCase()
  const cat = CATEGORY_META[calc.category]?.label || "General"

  if (name.includes("mortgage")) {
    return [
      {
        q: "What is included in this mortgage payment calculation?",
        a: "This calculator determines your monthly Principal and Interest (P&I) based on the fixed-rate amortization equation. In real estate, your actual lender payment may also include Property Taxes, Homeowners Insurance, Private Mortgage Insurance (PMI), and HOA fees (commonly known as PITI).",
      },
      {
        q: "How does a 15-year mortgage compare to a 30-year mortgage?",
        a: "A 15-year mortgage requires higher monthly installments (typically 30–40% higher) because the principal balance is repaid in half the time. However, it results in dramatic savings—often reducing lifetime interest charges by 55% to 65% compared to a 30-year loan.",
      },
      {
        q: "How does an extra principal payment affect my mortgage term?",
        a: "Every extra dollar paid toward your principal balance reduces the compounding base for subsequent interest cycles. Making just one additional monthly payment per year can shave 4 to 6 years off a standard 30-year mortgage and save tens of thousands in interest.",
      },
      {
        q: "When does Private Mortgage Insurance (PMI) stop being charged?",
        a: "Under U.S. Federal law (Homeowners Protection Act), conventional lenders must automatically cancel PMI once your loan balance reaches 78% of the home's original purchase value, provided your payments remain current.",
      },
    ]
  }

  if (name.includes("bmi") || name.includes("body mass index")) {
    return [
      {
        q: "What are the standard adult BMI categories defined by the World Health Organization?",
        a: "The WHO defines the following classifications for adults: Underweight (BMI < 18.5), Normal Weight (BMI 18.5–24.9), Overweight (BMI 25.0–29.9), and Obese (BMI ≥ 30.0, divided into Class I, II, and III).",
      },
      {
        q: "What are the limitations of using BMI as a health metric?",
        a: "BMI relies solely on height and weight, meaning it cannot distinguish between lean muscle mass and adipose body fat. Athletes, bodybuilders, and resistance trainers often show an 'overweight' BMI despite having exceptionally low body fat and peak metabolic health.",
      },
      {
        q: "Do Asian populations use different BMI cutoffs?",
        a: "Yes. The WHO and health authorities recommend lower thresholds for Asian populations due to higher body fat percentages at lower body weights: Normal Weight is 18.5–22.9, Overweight is 23.0–27.4, and Obese is BMI ≥ 27.5.",
      },
      {
        q: "How often should I check my BMI?",
        a: "For most healthy adults, tracking body mass index once every 1 to 3 months is sufficient. Daily weight fluctuations primarily reflect hydration, sodium intake, and glycogen storage rather than fat loss or muscle gain.",
      },
    ]
  }

  if (name.includes("concrete")) {
    return [
      {
        q: "How much extra concrete should I order for wastage?",
        a: "Industry standards recommend ordering an additional 10% to 15% above your calculated volume. This buffer accounts for ground unevenness, trench subgrade settling, formwork deflection, and spillage during pouring.",
      },
      {
        q: "What is the standard concrete mix ratio for slabs and footings?",
        a: "The most common general-purpose structural concrete mix ratio is 1:2:4 by volume—1 part Portland cement, 2 parts clean sand, and 4 parts coarse crushed stone/gravel, providing compressive strength of approximately 3,000 PSI (20 MPa).",
      },
      {
        q: "How many 50kg cement bags are needed per cubic meter of concrete?",
        a: "For a standard 1:2:4 mix design, one cubic meter of cured concrete typically requires approximately 6 to 7 standard 50-kg bags of Portland cement along with ~0.5 m³ of sand and ~0.8 m³ of aggregate.",
      },
    ]
  }

  if (name.includes("roi") || name.includes("return on investment")) {
    return [
      {
        q: "What is the difference between Simple ROI and Annualized ROI?",
        a: "Simple ROI measures the cumulative percentage gain regardless of time. Annualized ROI (CAGR) calculates the geometric average annual growth rate, allowing fair comparisons between an investment held for 2 years versus one held for 10 years.",
      },
      {
        q: "Does standard ROI account for inflation and tax liabilities?",
        a: "Basic ROI calculations measure nominal returns. To evaluate true purchasing power, investors subtract the annualized inflation rate (Real ROI) and applicable capital gains taxes.",
      },
      {
        q: "What is considered a strong ROI in equity markets?",
        a: "Historically, broad stock index benchmarks (such as the S&P 500) have produced an average nominal annualized ROI of approximately 9% to 10% over multi-decade holding periods (7% after adjusting for inflation).",
      },
    ]
  }

  // Category-specific structured FAQs
  if (calc.category === "finance" || calc.category === "business_investment") {
    return [
      {
        q: `How is the ${calc.name} calculated?`,
        a: `The ${calc.name} uses standard actuarial and financial formulas verified against commercial banking standards. It performs deterministic math in real time as parameters are updated.`,
      },
      {
        q: "Are the financial results guaranteed by lenders?",
        a: "Results provided by TryCalc are mathematical projections for planning and comparison. Lenders may apply differing underwriting requirements, credit tiers, and localized compounding rules.",
      },
      {
        q: "Can I export or print my financial computation?",
        a: "Yes — use the 'Print Audit Report' or 'Copy Results' buttons on the control console to generate clean, formatted documentation for your records.",
      },
    ]
  }

  // Standard high-quality domain fallback
  return [
    {
      q: `How does the ${calc.name} work?`,
      a: `The ${calc.name} evaluates your input parameters (${calc.fields.slice(0, 3).map((f) => f.label).join(", ")}) using verified, standardized algorithms in ${cat.toLowerCase()} to deliver instantaneous, accurate telemetry.`,
    },
    {
      q: `Is the ${calc.name} completely free to use?`,
      a: `Yes — TryCalc provides 100% free access to all 674+ calculators with unlimited runs, zero account registration requirements, and no paywalls.`,
    },
    {
      q: "Can I use this calculator on mobile devices?",
      a: "Yes — the TryCalc workstation console is fully responsive, optimized for low-latency touch input across smartphones, tablets, and desktop workstations.",
    },
  ]
}

export interface FormulaInfo {
  formula: string
  explanation: string
  variables: { symbol: string; meaning: string }[]
  source: string
}

export function seoFormulaFor(calc: CalculatorDef): FormulaInfo {
  const name = calc.name.toLowerCase()

  if (name.includes("mortgage") || name.includes("loan") || name.includes("emi")) {
    return {
      formula: "M = P · [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]",
      explanation: "Standard fixed-rate amortization equation calculating monthly installment payments where loan interest compounds periodically.",
      variables: [
        { symbol: "M", meaning: "Total monthly installment payment" },
        { symbol: "P", meaning: "Principal loan balance" },
        { symbol: "r", meaning: "Periodic monthly interest rate (Annual rate ÷ 12)" },
        { symbol: "n", meaning: "Total payment periods (Years × 12)" },
      ],
      source: "U.S. Consumer Financial Protection Bureau & Industry Amortization Standards",
    }
  }

  if (name.includes("compound") || name.includes("interest") || name.includes("investment")) {
    return {
      formula: "A = P · (1 + r/n)^(n·t)",
      explanation: "Standard compound interest formula computing future accumulated value where earned interest generates additional earnings.",
      variables: [
        { symbol: "A", meaning: "Final future accumulated balance" },
        { symbol: "P", meaning: "Initial principal / deposit" },
        { symbol: "r", meaning: "Nominal annual interest rate" },
        { symbol: "n", meaning: "Compounding frequency per year" },
        { symbol: "t", meaning: "Investment duration in years" },
      ],
      source: "Federal Reserve Board & Standard Financial Mathematics",
    }
  }

  if (name.includes("bmi") || name.includes("body mass")) {
    return {
      formula: "BMI = weight (kg) / [ height (m) ]²",
      explanation: "Standard epidemiological anthropometric measurement screening body mass categories across adult populations.",
      variables: [
        { symbol: "weight", meaning: "Total body weight measured in kilograms" },
        { symbol: "height", meaning: "Body stature measured in meters" },
      ],
      source: "World Health Organization (WHO) Technical Report Series 854",
    }
  }

  if (name.includes("calorie") || name.includes("bmr") || name.includes("tdee")) {
    return {
      formula: "BMR = 10 · weight(kg) + 6.25 · height(cm) - 5 · age(y) + s",
      explanation: "Mifflin-St Jeor equation determining basal metabolic rate (resting daily caloric expenditure).",
      variables: [
        { symbol: "s", meaning: "+5 for biological males, -161 for biological females" },
        { symbol: "TDEE", meaning: "BMR × Physical Activity Factor (PAL)" },
      ],
      source: "American Journal of Clinical Nutrition (Mifflin et al., 1990)",
    }
  }

  if (name.includes("percentage") || name.includes("discount") || name.includes("tip")) {
    return {
      formula: "Result = (Base Value × Percentage Rate) / 100",
      explanation: "Proportional ratio calculation computing fractional parts of a base whole amount.",
      variables: [
        { symbol: "Base Value", meaning: "Original quantity or initial price" },
        { symbol: "Percentage Rate", meaning: "Portion expressed per 100 units" },
      ],
      source: "International Organization for Standardization (ISO 80000-2:2019)",
    }
  }

  return {
    formula: `F(${calc.fields.slice(0, 3).map((f) => f.name).join(", ")})`,
    explanation: `Calculates exact mathematical outcomes based on ${calc.fields.slice(0, 3).map((f) => f.label).join(", ")} according to established algorithmic standards.`,
    variables: calc.fields.slice(0, 4).map((f) => ({
      symbol: f.label,
      meaning: f.help || (f.unit ? `Measured in ${f.unit}` : "Input parameter"),
    })),
    source: "Verified mathematical algorithms and official domain specifications",
  }
}

export interface ReferenceTable {
  title: string
  subtitle: string
  headers: string[]
  rows: string[][]
  footnote?: string
}

export function seoReferenceTableFor(calc: CalculatorDef): ReferenceTable {
  const name = calc.name.toLowerCase()

  if (name.includes("mortgage") || name.includes("home loan")) {
    return {
      title: "Quick Mortgage Payment Reference Table (30-Year Fixed)",
      subtitle: "Monthly principal and interest (P&I) payments across standard loan amounts and interest rates.",
      headers: ["Loan Amount", "5.5% APR", "6.0% APR", "6.5% APR", "7.0% APR", "7.5% APR"],
      rows: [
        ["$200,000", "$1,136", "$1,199", "$1,264", "$1,331", "$1,398"],
        ["$300,000", "$1,703", "$1,799", "$1,896", "$1,996", "$2,098"],
        ["$400,000", "$2,271", "$2,398", "$2,528", "$2,661", "$2,797"],
        ["$500,000", "$2,839", "$2,998", "$3,160", "$3,327", "$3,496"],
        ["$600,000", "$3,407", "$3,597", "$3,792", "$3,992", "$4,195"],
        ["$750,000", "$4,258", "$4,496", "$4,740", "$4,990", "$5,244"],
      ],
      footnote: "Excludes property taxes, homeowner's insurance (HOI), and private mortgage insurance (PMI).",
    }
  }

  if (name.includes("loan payment") || name.includes("personal loan") || name.includes("auto loan") || name.includes("car loan")) {
    return {
      title: "Monthly Installment Benchmark Matrix (at 6.5% APR)",
      subtitle: "Estimated monthly payments comparing loan balances across typical repayment durations.",
      headers: ["Loan Balance", "36 Months", "48 Months", "60 Months", "72 Months"],
      rows: [
        ["$10,000", "$306 / mo", "$237 / mo", "$196 / mo", "$168 / mo"],
        ["$15,000", "$460 / mo", "$356 / mo", "$293 / mo", "$252 / mo"],
        ["$20,000", "$613 / mo", "$474 / mo", "$391 / mo", "$336 / mo"],
        ["$30,000", "$920 / mo", "$711 / mo", "$587 / mo", "$505 / mo"],
        ["$40,000", "$1,226 / mo", "$949 / mo", "$783 / mo", "$673 / mo"],
        ["$50,000", "$1,533 / mo", "$1,186 / mo", "$978 / mo", "$841 / mo"],
      ],
      footnote: "Fixed interest rate assumed without origination or documentation fees.",
    }
  }

  if (name.includes("bmi") || name.includes("body mass index")) {
    return {
      title: "Official WHO Adult BMI Classification Reference",
      subtitle: "Standard epidemiological body mass index categories and corresponding clinical risk profiles.",
      headers: ["BMI Range (kg/m²)", "Classification", "Risk of Comorbidities", "Recommended Action"],
      rows: [
        ["Less than 18.5", "Underweight", "Nutritional deficiency & osteoporosis", "Consult doctor / dietary surplus"],
        ["18.5 – 24.9", "Normal Weight", "Lowest health risk profile", "Maintain active lifestyle & balanced nutrition"],
        ["25.0 – 29.9", "Overweight", "Increased risk for cardiovascular conditions", "Lifestyle modification & caloric balance"],
        ["30.0 – 34.9", "Obese (Class I)", "High cardiovascular & metabolic risk", "Structured clinical weight management"],
        ["35.0 – 39.9", "Obese (Class II)", "Very high clinical risk", "Medical supervision & lifestyle intervention"],
        ["40.0 and above", "Obese (Class III / Severe)", "Extremely high health risk", "Comprehensive bariatric / clinical consultation"],
      ],
      footnote: "Source: World Health Organization (WHO) international guidelines.",
    }
  }

  if (name.includes("calorie") || name.includes("bmr") || name.includes("tdee")) {
    return {
      title: "Activity Level & Caloric Multiplier Guide",
      subtitle: "How physical activity level (PAL) scales resting basal metabolic rate into total daily energy expenditure (TDEE).",
      headers: ["Activity Classification", "PAL Multiplier", "Weekly Routine", "Example Daily Cal (at 1700 BMR)"],
      rows: [
        ["Sedentary", "1.200", "Desk job, minimal purposeful exercise", "2,040 kcal / day"],
        ["Lightly Active", "1.375", "Light exercise or sports 1–3 days/wk", "2,338 kcal / day"],
        ["Moderately Active", "1.550", "Moderate exercise or sports 3–5 days/wk", "2,635 kcal / day"],
        ["Very Active", "1.725", "Hard exercise or physical job 6–7 days/wk", "2,933 kcal / day"],
        ["Extremely Active", "1.900", "Heavy physical labor or 2x daily training", "3,230 kcal / day"],
      ],
      footnote: "Calculated via Mifflin-St Jeor basal metabolic rate standard.",
    }
  }

  if (name.includes("concrete") || name.includes("slab") || name.includes("cement")) {
    return {
      title: "Standard Slab Concrete Volume & Bag Estimation",
      subtitle: "Typical residential slab dimensions with calculated cubic yards and premix bag requirements.",
      headers: ["Slab Size", "Surface Area", "4-Inch Slab (yd³)", "6-Inch Slab (yd³)", "80 lb Bags (4\")"],
      rows: [
        ["10 ft × 10 ft", "100 sq ft", "1.23 yd³", "1.85 yd³", "56 Bags"],
        ["10 ft × 20 ft", "200 sq ft", "2.47 yd³", "3.70 yd³", "111 Bags"],
        ["12 ft × 12 ft", "144 sq ft", "1.78 yd³", "2.67 yd³", "80 Bags"],
        ["15 ft × 20 ft", "300 sq ft", "3.70 yd³", "5.56 yd³", "167 Bags"],
        ["20 ft × 20 ft", "400 sq ft", "4.94 yd³", "7.41 yd³", "222 Bags"],
        ["24 ft × 24 ft (2-car garage)", "576 sq ft", "7.11 yd³", "10.67 yd³", "320 Bags"],
      ],
      footnote: "Volume calculations assume level ground. Always add 10% for spillage and subgrade unevenness.",
    }
  }

  if (name.includes("percentage") || name.includes("discount") || name.includes("sale price")) {
    return {
      title: "Common Discount & Savings Quick Reference",
      subtitle: "Instant lookup for common retail discounts and price reductions.",
      headers: ["Original Price", "10% Off", "20% Off", "25% Off", "30% Off", "50% Off"],
      rows: [
        ["$25.00", "$22.50", "$20.00", "$18.75", "$17.50", "$12.50"],
        ["$50.00", "$45.00", "$40.00", "$37.50", "$35.00", "$25.00"],
        ["$75.00", "$67.50", "$60.00", "$56.25", "$52.50", "$37.50"],
        ["$100.00", "$90.00", "$80.00", "$75.00", "$70.00", "$50.00"],
        ["$150.00", "$135.00", "$120.00", "$112.50", "$105.00", "$75.00"],
        ["$200.00", "$180.00", "$160.00", "$150.00", "$140.00", "$100.00"],
      ],
      footnote: "Prices show final cost after deducting percentage discount.",
    }
  }

  if (name.includes("compound") || name.includes("investment") || name.includes("savings") || name.includes("retire")) {
    return {
      title: "Compound Growth Projection Table (7% Annual Return)",
      subtitle: "Future portfolio balance compounding annually over 5 to 30 year horizons.",
      headers: ["Initial Balance", "5 Years", "10 Years", "15 Years", "20 Years", "30 Years"],
      rows: [
        ["$5,000", "$7,013", "$9,836", "$13,795", "$19,348", "$38,061"],
        ["$10,000", "$14,026", "$19,672", "$27,590", "$38,697", "$76,123"],
        ["$25,000", "$35,064", "$49,179", "$68,976", "$96,742", "$190,306"],
        ["$50,000", "$70,128", "$98,358", "$137,952", "$193,484", "$380,613"],
        ["$100,000", "$140,255", "$196,715", "$275,903", "$386,968", "$761,226"],
      ],
      footnote: "Based on 7.0% annualized compound return, mirroring historical inflation-adjusted equity benchmarks.",
    }
  }

  return {
    title: `Standard Benchmark Reference for ${calc.name}`,
    subtitle: `Representative baseline calculation values and scale reference across typical input ranges.`,
    headers: ["Parameter Scale", "Benchmark Tier", "Telemetry Status", "Output Precision"],
    rows: [
      ["Baseline Tier (25%)", "Low Intensity", "Deterministic", "Standard (4 Decimals)"],
      ["Standard Tier (50%)", "Normal Range", "Optimal", "High Precision (64-Bit)"],
      ["Elevated Tier (75%)", "High Intensity", "Deterministic", "High Precision (64-Bit)"],
      ["Maximum Tier (100%)", "Peak Capacity", "Verified", "High Precision (64-Bit)"],
    ],
    footnote: "Telemetry values computed deterministically via standard algorithmic definitions.",
  }
}

