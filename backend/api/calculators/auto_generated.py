"""
Auto-generated calculator registry from extracted Django templates.
Total: 494 calculators.
"""
from .engine import CalcField, register_calculator


# These calculators have their calculation logic in JavaScript (client-side).
# The backend serves their field definitions; the frontend runs the JS logic.
# A simple identity function is used as the backend calc function.

def _js_calc(data):
    """Placeholder: actual calculation runs client-side in JavaScript."""
    return {"note": "This calculator runs client-side", "inputs": {k: v for k, v in data.items()}}


register_calculator(
    "allowance-calculator", "Allowance Calculator", "finance",
    "Allowance Calculator",
    fields=[
        CalcField("age", "Child's Age"),
        CalcField("responsibility", "Responsibility Level (1-5)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "annual-budget-planner", "Annual Budget Planner", "finance",
    "Annual Budget Planner",
    fields=[
        CalcField("monthly-income", "Monthly Income"),
        CalcField("monthly-expenses", "Monthly Expenses"),
    ],
    fn=_js_calc,
)

register_calculator(
    "balance-transfer-calculator", "Balance Transfer Calculator", "finance",
    "Balance Transfer Calculator",
    fields=[
        CalcField("balance", "Current Balance"),
        CalcField("rate", "Current Interest (%) per Year Current Interest (%) per Day Current Interest (%) per Month"),
        CalcField("months", "Remaining Years Remaining Days Remaining Months"),
        CalcField("new-rate", "New Interest (%) per Year New Interest (%) per Day New Interest (%) per Month"),
        CalcField("new-term", "New Term (Years) New Term (Days) New Term (Months)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "bill-splitting-calculator", "Bill Splitting Calculator", "finance",
    "Bill Splitting Calculator",
    fields=[
        CalcField("bill-total", "Bill Total"),
        CalcField("bill-tip", "Bill Tip"),
        CalcField("bill-count", "Bill Count"),
    ],
    fn=_js_calc,
)

register_calculator(
    "biweekly-budget-converter", "Bi-Weekly Budget Converter", "finance",
    "Bi-Weekly Budget Converter",
    fields=[
        CalcField("monthly-income", "Total Monthly Income"),
    ],
    fn=_js_calc,
)

register_calculator(
    "budget-calculator", "Budget Calculator", "finance",
    "Budget Calculator",
    fields=[
        CalcField("income", "Total Monthly Income"),
        CalcField("rent", "Rent / Housing"),
        CalcField("food", "Food & Groceries"),
        CalcField("transport", "Transportation"),
        CalcField("utilities", "Utilities (Electricity, Gas, Internet)"),
        CalcField("entertainment", "Entertainment & Others"),
    ],
    fn=_js_calc,
)

register_calculator(
    "car-affordability-calculator", "Car Affordability Calculator", "finance",
    "Car Affordability Calculator",
    fields=[
        CalcField("income", "Gross Monthly Income ($)"),
        CalcField("debts", "Total Monthly Debts (Non-Car) ($)"),
        CalcField("rate", "Annual Loan Interest Rate (%)"),
        CalcField("term", "Loan Term (Total Months, e.g., 60)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cash-envelope-system-planner", "Cash Envelope System Planner", "finance",
    "Cash Envelope System Planner",
    fields=[
        CalcField("groceries", "Groceries (Monthly)"),
        CalcField("transport", "Transport/Gas (Monthly)"),
        CalcField("entertainment", "Entertainment/Fun (Monthly)"),
        CalcField("savings", "Savings Goal (Monthly)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cash-flow", "Cash Flow Calculator", "finance",
    "Cash Flow Calculator",
    fields=[
        CalcField("inc-name", "Income source (e.g., Salary)", type="text"),
        CalcField("inc-value", "Monthly amount"),
        CalcField("exp-name", "Expense (e.g., Rent)", type="text"),
        CalcField("exp-value", "Monthly amount"),
    ],
    fn=_js_calc,
)

register_calculator(
    "charitable-donation-tax-deduction-calculator", "Charitable Donation Tax Deduction Calculator", "finance",
    "Charitable Donation Tax Deduction Calculator",
    fields=[
        CalcField("donation-name", "Charity name / description", type="text"),
        CalcField("donation-amount", "Amount ($)"),
        CalcField("don-tax", "Don Tax"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cost-of-living-comparison-calculator", "Cost of Living Comparison Calculator", "finance",
    "Cost of Living Comparison Calculator",
    fields=[
        CalcField("col-current-city", "City A", type="text"),
        CalcField("col-target-city", "City B", type="text"),
        CalcField("col-salary", "Col Salary"),
        CalcField("col-housing", "e.g., 20"),
        CalcField("col-food", "e.g., 5"),
        CalcField("col-transport", "e.g., -3"),
    ],
    fn=_js_calc,
)

register_calculator(
    "credit-utilization-calculator", "Credit Utilization Calculator", "finance",
    "Credit Utilization Calculator",
    fields=[
        CalcField("credit-limit", "Total Credit Limit"),
        CalcField("credit-used", "Total Credit Balance Used"),
    ],
    fn=_js_calc,
)

register_calculator(
    "debt-consolidation-savings-calculator", "Debt Consolidation Savings Calculator", "finance",
    "Debt Consolidation Savings Calculator",
    fields=[
        CalcField("current-balance", "Total Balance Owed"),
        CalcField("current-interest", "Average Interest Rate (%)"),
        CalcField("current-term", "Months Remaining"),
        CalcField("new-interest", "New Interest Rate (%)"),
        CalcField("new-term", "New Loan Term (Months)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "discretionary-income-calculator", "Discretionary Income Calculator", "finance",
    "Discretionary Income Calculator",
    fields=[
        CalcField("disc-gross", "Disc Gross"),
        CalcField("disc-tax", "e.g., 20"),
        CalcField("disc-needs", "Rent, utilities, groceries..."),
    ],
    fn=_js_calc,
)

register_calculator(
    "disposable-income-calculator", "Disposable Income Calculator", "finance",
    "Disposable Income Calculator",
    fields=[
        CalcField("disp-gross", "Disp Gross"),
        CalcField("disp-tax", "e.g., 20"),
        CalcField("disp-ded", "Insurance, retirement pre-tax..."),
    ],
    fn=_js_calc,
)

register_calculator(
    "dti", "Debt-to-Income (DTI) Calculator", "finance",
    "Debt-to-Income (DTI) Calculator",
    fields=[
        CalcField("gross-income", "e.g., 4000"),
        CalcField("debt-name", "Debt name (e.g., Car loan)", type="text"),
        CalcField("debt-value", "Monthly payment"),
    ],
    fn=_js_calc,
)

register_calculator(
    "emergency-fund", "Emergency Fund Calculator", "finance",
    "Emergency Fund Calculator",
    fields=[
        CalcField("monthly-expenses", "Sum of rent, food, utilities, etc."),
        CalcField("ef-months", "Ef Months", type="select", options=[{"value": "3 months (minimum)", "label": "3 months (minimum)"}, {"value": "6 months (recommended)", "label": "6 months (recommended)"}, {"value": "9 months", "label": "9 months"}, {"value": "12 months", "label": "12 months"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "expense-report-calculator", "Expense Report Calculator", "finance",
    "Expense Report Calculator",
    fields=[
        CalcField("income", "Total Monthly Income"),
        CalcField("housing", "Housing / Rent / Mortgage"),
        CalcField("food", "Food & Groceries"),
        CalcField("transport", "Transportation"),
        CalcField("health", "Health / Medical"),
        CalcField("subscriptions", "Subscriptions (Netflix, etc)"),
        CalcField("others", "Other Expenses"),
    ],
    fn=_js_calc,
)

register_calculator(
    "financial-health-check-calculator", "Financial Health Check", "finance",
    "Financial Health Check",
    fields=[
        CalcField("fh-income", "Fh Income"),
        CalcField("fh-expenses", "Fh Expenses"),
        CalcField("fh-debt", "Fh Debt"),
        CalcField("fh-savings", "Fh Savings"),
    ],
    fn=_js_calc,
)

register_calculator(
    "fire-calculator", "Financial Independence (FIRE) Calculator", "finance",
    "Financial Independence (FIRE) Calculator",
    fields=[
        CalcField("fire-expenses", "Fire Expenses"),
        CalcField("fire-savings", "Fire Savings"),
        CalcField("fire-return", "Fire Return"),
        CalcField("fire-contrib", "Fire Contrib"),
        CalcField("fire-withdraw", "Fire Withdraw"),
    ],
    fn=_js_calc,
)

register_calculator(
    "gift-tax-calculator", "Gift Tax Calculator", "finance",
    "Gift Tax Calculator",
    fields=[
        CalcField("giftAmount", "Gift Amount"),
        CalcField("exemption", "Annual Exemption (Default 17000)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "holiday-budget-calculator", "Holiday Budget Planner", "finance",
    "Holiday Budget Planner",
    fields=[
        CalcField("hol-name", "e.g., Bali getaway", type="text"),
        CalcField("item-name", "Item (Flight / Hotel / Food)", type="text"),
        CalcField("item-amount", "Amount ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "hourly-to-salary-converter", "Hourly → Annual Salary Converter", "finance",
    "Hourly → Annual Salary Converter",
    fields=[
        CalcField("h2s-wage", "H2S Wage"),
        CalcField("h2s-hours", "H2S Hours"),
        CalcField("h2s-weeks", "H2S Weeks"),
    ],
    fn=_js_calc,
)

register_calculator(
    "inflation-calculator", "Inflation / Purchasing Power Calculator", "finance",
    "Inflation / Purchasing Power Calculator",
    fields=[
        CalcField("inf-amount", "Inf Amount"),
        CalcField("inf-from-year", "Inf From Year"),
        CalcField("inf-to-year", "Inf To Year"),
        CalcField("inf-rate", "e.g., 3"),
    ],
    fn=_js_calc,
)

register_calculator(
    "latte-factor-calculator", "'Latte Factor' Savings Calculator", "finance",
    "'Latte Factor' Savings Calculator",
    fields=[
        CalcField("dailyCost", "Daily Expense (Coffee, Snacks, etc.)"),
        CalcField("days", "Days per Month (e.g., 30)"),
        CalcField("months", "Months to Track (e.g., 12)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "mortgage-affordability-calculator", "Mortgage Affordability Calculator", "finance",
    "Mortgage Affordability Calculator",
    fields=[
        CalcField("income", "Gross Monthly Income ($)"),
        CalcField("debts", "Total Monthly Debts ($)"),
        CalcField("rate", "Annual Interest Rate (%)"),
        CalcField("term", "Term (Total Months, e.g., 360 for 30 yrs)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "moving-cost-calculator", "Moving Cost Calculator", "finance",
    "Moving Cost Calculator",
    fields=[
        CalcField("move-name", "Cost item (movers/truck/deposit)", type="text"),
        CalcField("move-amount", "Amount ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "net-worth", "Net Worth Calculator", "finance",
    "Net Worth Calculator",
    fields=[
        CalcField("asset-name", "Asset name (e.g., Savings)", type="text"),
        CalcField("asset-value", "Amount"),
        CalcField("liab-name", "Liability name (e.g., Mortgage)", type="text"),
        CalcField("liab-value", "Amount"),
    ],
    fn=_js_calc,
)

register_calculator(
    "net-worth-projection-calculator", "Net Worth Projection Calculator", "finance",
    "Net Worth Projection Calculator",
    fields=[
        CalcField("current-assets", "Current Assets ($)"),
        CalcField("current-debts", "Current Debts ($)"),
        CalcField("annual-contribution", "Annual Contribution ($)"),
        CalcField("annual-growth", "Expected Annual Growth (%)"),
        CalcField("years", "Number of Years"),
    ],
    fn=_js_calc,
)

register_calculator(
    "no-spend-challenge-calculator", "No-Spend Challenge Savings Calculator", "finance",
    "No-Spend Challenge Savings Calculator",
    fields=[
        CalcField("spend-input", "Typical Discretionary Monthly Spend ($)"),
        CalcField("challenge-days", "Days of No-Spend Challenge"),
    ],
    fn=_js_calc,
)

register_calculator(
    "overtime-pay-calculator", "Overtime Pay Calculator", "finance",
    "Overtime Pay Calculator",
    fields=[
        CalcField("ot-wage", "Ot Wage"),
        CalcField("ot-regular", "Ot Regular"),
        CalcField("ot-hours", "Ot Hours"),
        CalcField("ot-mult", "Ot Mult"),
    ],
    fn=_js_calc,
)

register_calculator(
    "paycheck-calculator", "Paycheck / Take-Home Pay Calculator", "finance",
    "Paycheck / Take-Home Pay Calculator",
    fields=[
        CalcField("pay-gross", "Pay Gross"),
        CalcField("pay-frequency", "Pay Frequency", type="select", options=[{"value": "Monthly", "label": "Monthly"}, {"value": "Semi-Monthly", "label": "Semi-Monthly"}, {"value": "Bi-Weekly", "label": "Bi-Weekly"}, {"value": "Weekly", "label": "Weekly"}]),
        CalcField("pay-tax", "e.g., 20"),
        CalcField("pay-ret", "e.g., 5"),
        CalcField("pay-fixed", "Insurance, union dues..."),
    ],
    fn=_js_calc,
)

register_calculator(
    "personal-inflation-rate-calculator", "Personal Inflation Rate Calculator", "finance",
    "Personal Inflation Rate Calculator",
    fields=[
        CalcField("pir-name", "Category (e.g., Groceries)", type="text"),
        CalcField("pir-last", "Last Year Spend (annual)"),
        CalcField("pir-this", "This Year Spend (annual)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "personal-loan-comparison-calculator", "Personal Loan Comparison", "finance",
    "Personal Loan Comparison",
    fields=[
        CalcField("loan-name", "Lender name", type="text"),
        CalcField("loan-amount", "Loan amount ($)"),
        CalcField("loan-rate", "Annual rate (%)"),
        CalcField("loan-term", "Term (years)"),
        CalcField("loan-fees", "Upfront fees ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "rainy-day-fund-calculator", "Rainy Day Fund Calculator", "finance",
    "Rainy Day Fund Calculator",
    fields=[
        CalcField("rdf-monthly", "Rdf Monthly"),
        CalcField("rdf-stability", "Rdf Stability", type="select", options=[{"value": "1 — Very Stable", "label": "1 — Very Stable"}, {"value": "2", "label": "2"}, {"value": "3 — Moderate", "label": "3 — Moderate"}, {"value": "4", "label": "4"}, {"value": "5 — Unstable", "label": "5 — Unstable"}]),
        CalcField("rdf-months", "Rdf Months"),
    ],
    fn=_js_calc,
)

register_calculator(
    "rent-affordability-calculator", "Rent Affordability Calculator", "finance",
    "Rent Affordability Calculator",
    fields=[
        CalcField("income", "Gross Monthly Income ($)"),
        CalcField("debts", "Total Monthly Debts ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "rule-of-114-144-calculator", "Rule of 114 / 144 Calculator", "finance",
    "Rule of 114 / 144 Calculator",
    fields=[
        CalcField("annual-return", "Expected Annual Return (%)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "rule-of-72-calculator", "Rule of 72 Calculator", "finance",
    "Rule of 72 Calculator",
    fields=[
        CalcField("annual-return", "Expected Annual Return (%)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "salary-to-hourly-converter", "Salary → Hourly Converter", "finance",
    "Salary → Hourly Converter",
    fields=[
        CalcField("s2h-salary", "S2H Salary"),
        CalcField("s2h-hours", "S2H Hours"),
        CalcField("s2h-weeks", "S2H Weeks"),
    ],
    fn=_js_calc,
)

register_calculator(
    "savings-goal", "Savings Goal Calculator", "finance",
    "Savings Goal Calculator",
    fields=[
        CalcField("target-amount", "Target Amount"),
        CalcField("current-savings", "Current Savings"),
        CalcField("annual-rate", "e.g., 5 for 5%"),
        CalcField("monthly-contrib", "Monthly contribution ($)"),
        CalcField("months-to", "Months to reach (integer)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "severance-pay-calculator", "Severance Pay Calculator", "finance",
    "Severance Pay Calculator",
    fields=[
        CalcField("years", "Years Worked (e.g., 5)"),
        CalcField("weeklyPay", "Average Weekly Pay (e.g., 750)"),
        CalcField("multiplier", "Weeks Paid Per Year Worked (Default = 1)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "sinking-fund-calculator", "Sinking Fund Calculator", "finance",
    "Sinking Fund Calculator",
    fields=[
        CalcField("goal", "Total Goal Amount"),
        CalcField("months", "Months to Save"),
    ],
    fn=_js_calc,
)

register_calculator(
    "sp500-historical-return-simulator", "S&P 500 Historical Return Simulator", "finance",
    "S&P 500 Historical Return Simulator",
    fields=[
        CalcField("initial-investment", "Initial Investment ($)"),
        CalcField("years", "Investment Years"),
        CalcField("annual-return", "Expected Annual Return (%)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "spending-tracker", "Spending Tracker & Analyzer", "finance",
    "Spending Tracker & Analyzer",
    fields=[
        CalcField("cat-name", "Category (e.g., Groceries)", type="text"),
        CalcField("cat-value", "Amount"),
    ],
    fn=_js_calc,
)

register_calculator(
    "student-loan-affordability-calculator", "Student Loan Affordability Calculator", "finance",
    "Student Loan Affordability Calculator",
    fields=[
        CalcField("principal", "Loan Amount ($)"),
        CalcField("rate", "Annual Interest Rate (%)"),
        CalcField("term", "Term (Total Months)"),
        CalcField("income", "Gross Monthly Income ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "subscription-management-calculator", "Subscription Management", "finance",
    "Subscription Management",
    fields=[
        CalcField("sub-name", "Subscription name (Netflix)", type="text"),
        CalcField("sub-period", "Sub Period", type="select", options=[{"value": "Monthly", "label": "Monthly"}, {"value": "Annual", "label": "Annual"}]),
        CalcField("sub-amount", "Amount"),
    ],
    fn=_js_calc,
)

register_calculator(
    "wage-garnishment-calculator", "Wage Garnishment Calculator", "finance",
    "Wage Garnishment Calculator",
    fields=[
        CalcField("wg-gross", "Wg Gross"),
        CalcField("wg-freq", "Wg Freq", type="select", options=[{"value": "Weekly", "label": "Weekly"}, {"value": "Bi-weekly", "label": "Bi-weekly"}, {"value": "Semi-monthly", "label": "Semi-monthly"}, {"value": "Monthly", "label": "Monthly"}]),
        CalcField("wg-deductions", "Wg Deductions"),
        CalcField("wg-dependents", "Wg Dependents"),
        CalcField("wg-type", "Wg Type", type="select", options=[{"value": "Percent of disposable income", "label": "Percent of disposable income"}, {"value": "Flat amount per pay", "label": "Flat amount per pay"}, {"value": "Child support (common rules)", "label": "Child support (common rules)"}]),
        CalcField("wg-value", "Wg Value"),
    ],
    fn=_js_calc,
)

register_calculator(
    "windfall-tax-calculator", "Windfall (Lottery / Inheritance) Tax Calculator", "finance",
    "Windfall (Lottery / Inheritance) Tax Calculator",
    fields=[
        CalcField("amount", "Total Amount Received"),
        CalcField("taxRate", "Tax Rate (%) — Enter local value"),
    ],
    fn=_js_calc,
)

register_calculator(
    "yearly-expense-planner", "Yearly Expense Planner", "finance",
    "Yearly Expense Planner",
    fields=[
        CalcField("housing", "Housing / Rent / Mortgage"),
        CalcField("food", "Food & Groceries"),
        CalcField("transport", "Transportation"),
        CalcField("utilities", "Utilities"),
        CalcField("health", "Medical / Insurance"),
        CalcField("entertainment", "Entertainment & Others"),
    ],
    fn=_js_calc,
)

register_calculator(
    "absolute-value-calculator", "Absolute Value Calculator (|x|)", "basic",
    "Absolute Value Calculator (|x|)",
    fields=[
        CalcField("x-input", "e.g., -10, 5 + 3*2", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "area-volume-calculator", "Area & Volume Calculator", "basic",
    "Area & Volume Calculator",
    fields=[
        CalcField("shape-selector", "Select Shape:", type="select", options=[{"value": "Circle Area", "label": "Circle Area"}, {"value": "Square Area", "label": "Square Area"}, {"value": "Rectangle Area", "label": "Rectangle Area"}, {"value": "Triangle Area", "label": "Triangle Area"}, {"value": "Sphere Volume", "label": "Sphere Volume"}, {"value": "Cube Volume", "label": "Cube Volume"}, {"value": "Cylinder Volume", "label": "Cylinder Volume"}, {"value": "Rectangular Prism Volume", "label": "Rectangular Prism Volume"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "arithmetic", "Advanced Basic Arithmetic Calculator", "basic",
    "Advanced Basic Arithmetic Calculator",
    fields=[
        CalcField("display", "Calculator Display (button-based input)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "base-converter", "Multi-Base Converter", "basic",
    "Multi-Base Converter",
    fields=[
        CalcField("number-input", "e.g., A5, 101011, 23, 45", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "binomial-theorem-calculator", "Binomial Theorem Calculator", "basic",
    "Binomial Theorem Calculator",
    fields=[
        CalcField("n-input", "Enter n (e.g., 4)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "boolean-algebra-calculator", "Boolean Algebra Calculator (High Capacity)", "basic",
    "Boolean Algebra Calculator (High Capacity)",
    fields=[
        CalcField("expression-input", "e.g., (A AND B) OR NOT C", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "combination-calculator", "Combination Calculator ($\text{nCr}$)", "basic",
    "Combination Calculator ($\text{nCr}$)",
    fields=[
        CalcField("n-input", "e.g., 10 (Total members)"),
        CalcField("r-input", "e.g., 3 (Committee members)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "complex-number-calculator", "Complex Number Calculator", "basic",
    "Complex Number Calculator",
    fields=[
        CalcField("a1-input", "Real (a1)"),
        CalcField("b1-input", "Imaginary (b1)"),
        CalcField("a2-input", "Real (a2)"),
        CalcField("b2-input", "Imaginary (b2)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "coordinate-converter", "Coordinate System Converter", "basic",
    "Coordinate System Converter",
    fields=[
        CalcField("x-input", "x"),
        CalcField("y-input", "y"),
        CalcField("r-input", "r"),
        CalcField("theta-deg-input", "Angle (deg)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "decimal-to-fraction-converter", "Decimal to Fraction Converter", "basic",
    "Decimal to Fraction Converter",
    fields=[
        CalcField("decimal-input", "e.g., 0.125 or 1.5", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "derivative-calculator", "Calculus: Derivative Solver", "basic",
    "Calculus: Derivative Solver",
    fields=[
        CalcField("function-input", "e.g., 2*x^3 - 4*x + 1", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "eulers-number-calculator", "Euler's Number (e) Calculator", "basic",
    "Euler's Number (e) Calculator",
    fields=[
        CalcField("input-value", "e.g., 10 (position) or 1.5 (exponent)", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "factor-calculator", "Factor Calculator", "basic",
    "Factor Calculator",
    fields=[
        CalcField("number-input", "e.g., 12, 100"),
    ],
    fn=_js_calc,
)

register_calculator(
    "factorial-calculator", "Factorial Calculator ($\mathbf{n!}$)", "basic",
    "Factorial Calculator ($\mathbf{n!}$)",
    fields=[
        CalcField("n-input", "e.g., 7 or 15"),
    ],
    fn=_js_calc,
)

register_calculator(
    "fraction-simplifier", "Fraction Simplifier", "basic",
    "Fraction Simplifier",
    fields=[
        CalcField("numerator-input", "e.g., 12"),
        CalcField("denominator-input", "e.g., 18"),
    ],
    fn=_js_calc,
)

register_calculator(
    "fraction-to-decimal-converter", "Fraction to Decimal Converter", "basic",
    "Fraction to Decimal Converter",
    fields=[
        CalcField("numerator-input", "e.g., 3"),
        CalcField("denominator-input", "e.g., 8"),
    ],
    fn=_js_calc,
)

register_calculator(
    "gcf-calculator", "Greatest Common Factor (GCF) Calculator", "basic",
    "Greatest Common Factor (GCF) Calculator",
    fields=[
        CalcField("number-a", "e.g., 36"),
        CalcField("number-b", "e.g., 48"),
    ],
    fn=_js_calc,
)

register_calculator(
    "graphing-calculator", "Pro Graphing Calculator", "basic",
    "Pro Graphing Calculator",
    fields=[
        CalcField("function-input", "e.g., sin(x) * x^2", type="text"),
        CalcField("x-min", "X Min"),
        CalcField("x-max", "X Max"),
        CalcField("y-min", "Y Min"),
        CalcField("y-max", "Y Max"),
    ],
    fn=_js_calc,
)

register_calculator(
    "integral-calculator", "Calculus: Integral Solver", "basic",
    "Calculus: Integral Solver",
    fields=[
        CalcField("function-input", "e.g., 3*x^2 - 4*x + 1", type="text"),
        CalcField("lower-bound", "e.g., 0"),
        CalcField("upper-bound", "e.g., 5"),
    ],
    fn=_js_calc,
)

register_calculator(
    "lcm-calculator", "Least Common Multiple (LCM) Calculator", "basic",
    "Least Common Multiple (LCM) Calculator",
    fields=[
        CalcField("number-a", "e.g., 12"),
        CalcField("number-b", "e.g., 18"),
    ],
    fn=_js_calc,
)

register_calculator(
    "limit-calculator", "Calculus: Limit Calculator", "basic",
    "Calculus: Limit Calculator",
    fields=[
        CalcField("function-input", "e.g., sin(x) / x or (x^2 - 1) / (x - 1)", type="text"),
        CalcField("limit-a", "e.g., 0, 1, or 2"),
    ],
    fn=_js_calc,
)

register_calculator(
    "line-equation-calculator", "Slope & Y-Intercept Calculator", "basic",
    "Slope & Y-Intercept Calculator",
    fields=[
        CalcField("x1-input", "x1"),
        CalcField("y1-input", "y1"),
        CalcField("x2-input", "x2"),
        CalcField("y2-input", "y2"),
    ],
    fn=_js_calc,
)

register_calculator(
    "linear-regression-calculator", "Linear Regression Calculator", "basic",
    "Linear Regression Calculator",
    fields=[
        CalcField("x-data-input", "e.g., 1, 2, 3, 4, 5"),
        CalcField("y-data-input", "e.g., 2.1, 4.3, 5.8, 8.2, 9.9"),
    ],
    fn=_js_calc,
)

register_calculator(
    "log-antilog-calculator", "Logarithm and Antilog Calculator", "basic",
    "Logarithm and Antilog Calculator",
    fields=[
        CalcField("log-number-input", "e.g., 1000"),
        CalcField("log-base-input", "e.g., 10, 2, or 2.71828"),
        CalcField("antilog-exponent-input", "e.g., 3"),
        CalcField("antilog-base-input", "e.g., 10, 2, or 2.71828"),
    ],
    fn=_js_calc,
)

register_calculator(
    "matrix-calculator", "Matrix Calculator ($2 \times 2$)", "basic",
    "Matrix Calculator ($2 \times 2$)",
    fields=[
        CalcField("a11", "a11"),
        CalcField("a12", "a12"),
        CalcField("a21", "a21"),
        CalcField("a22", "a22"),
        CalcField("b11", "b11"),
        CalcField("b12", "b12"),
        CalcField("b21", "b21"),
        CalcField("b22", "b22"),
        CalcField("operation", "Operation:", type="select", options=[{"value": "A + B (Addition)", "label": "A + B (Addition)"}, {"value": "A - B (Subtraction)", "label": "A - B (Subtraction)"}, {"value": "A $\times$ B (Multiplication)", "label": "A $\times$ B (Multiplication)"}, {"value": "det(A) (Determinant of A)", "label": "det(A) (Determinant of A)"}, {"value": "det(B) (Determinant of B)", "label": "det(B) (Determinant of B)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "mean-median-mode-range-calculator", "Descriptive Statistics Calculator", "basic",
    "Descriptive Statistics Calculator",
    fields=[
        CalcField("data-input", "e.g., 2, 4, 4, 4, 5, 5, 7, 9"),
    ],
    fn=_js_calc,
)

register_calculator(
    "modulo-calculator", "Modulo Calculator ($\mathbf{A \pmod N}$)", "basic",
    "Modulo Calculator ($\mathbf{A \pmod N}$)",
    fields=[
        CalcField("dividend-a", "e.g., -10"),
        CalcField("divisor-n", "e.g., 3"),
    ],
    fn=_js_calc,
)

register_calculator(
    "normal-distribution-calculator", "Normal Distribution Calculator", "basic",
    "Normal Distribution Calculator",
    fields=[
        CalcField("mean-input", "e.g., 100"),
        CalcField("std-dev-input", "e.g., 15"),
        CalcField("x-value-input", "e.g., 115"),
    ],
    fn=_js_calc,
)

register_calculator(
    "percentage-calculator", "Percentage Calculator", "basic",
    "Percentage Calculator",
    fields=[
        CalcField("percent-input", "e.g., 15"),
        CalcField("number-input", "e.g., 200"),
    ],
    fn=_js_calc,
)

register_calculator(
    "percentage-change-calculator", "Percentage Change Calculator", "basic",
    "Percentage Change Calculator",
    fields=[
        CalcField("initial-value-input", "e.g., 100 (Start)"),
        CalcField("final-value-input", "e.g., 125 (End)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "permutation-calculator", "Permutation Calculator ($\mathbf{nPr}$)", "basic",
    "Permutation Calculator ($\mathbf{nPr}$)",
    fields=[
        CalcField("n-input", "e.g., 10 (Total people)"),
        CalcField("r-input", "e.g., 3 (Positions)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "pi-digit-finder", "Pi ($\pi$) Digit Finder", "basic",
    "Pi ($\pi$) Digit Finder",
    fields=[
        CalcField("position-input", "e.g., 10"),
    ],
    fn=_js_calc,
)

register_calculator(
    "prime-checker", "Prime Number Checker", "basic",
    "Prime Number Checker",
    fields=[
        CalcField("number-input", "Enter a whole number"),
    ],
    fn=_js_calc,
)

register_calculator(
    "probabily-calculator", "Probability Calculator", "basic",
    "Probability Calculator",
    fields=[
        CalcField("favorable-input", "e.g., 3 (Rolling a 1, 2, or 3)"),
        CalcField("total-input", "e.g., 6 (Rolling a single die)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "proportion-calculator", "Proportion Solver", "basic",
    "Proportion Solver",
    fields=[
        CalcField("part-a-input", "A (Numerator)"),
        CalcField("part-b-input", "B (Denominator)"),
        CalcField("part-c-input", "C (Numerator)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "pythagorean-calculator", "Pythagorean Theorem Calculator", "basic",
    "Pythagorean Theorem Calculator",
    fields=[
        CalcField("calculate-mode", "Select Unknown Side:", type="select", options=[{"value": "Hypotenuse ($\mathbf{c}$) - Given $\mathbf{a}$ and $\mathbf{b}$", "label": "Hypotenuse ($\mathbf{c}$) - Given $\mathbf{a}$ and $\mathbf{b}$"}, {"value": "Leg ($\mathbf{a}$) - Given $\mathbf{c}$ and $\mathbf{b}$", "label": "Leg ($\mathbf{a}$) - Given $\mathbf{c}$ and $\mathbf{b}$"}, {"value": "Leg ($\mathbf{b}$) - Given $\mathbf{c}$ and $\mathbf{a}$", "label": "Leg ($\mathbf{b}$) - Given $\mathbf{c}$ and $\mathbf{a}$"}]),
        CalcField("input-a", "Side a"),
        CalcField("input-b", "Side b"),
        CalcField("input-c", "Calculated c"),
    ],
    fn=_js_calc,
)

register_calculator(
    "quadratic-solver", "Quadratic Equation Solver", "basic",
    "Quadratic Equation Solver",
    fields=[
        CalcField("coeff_a", "e.g., 1"),
        CalcField("coeff_b", "e.g., -5"),
        CalcField("coeff_c", "e.g., 6"),
    ],
    fn=_js_calc,
)

register_calculator(
    "radical-simplifier", "Radical Simplifier ($\mathbf{\sqrt{N}}$)", "basic",
    "Radical Simplifier ($\mathbf{\sqrt{N}}$)",
    fields=[
        CalcField("radicand-n", "e.g., 72 or 150"),
    ],
    fn=_js_calc,
)

register_calculator(
    "ratio-calculator", "Ratio Calculator & Simplifier", "basic",
    "Ratio Calculator & Simplifier",
    fields=[
        CalcField("part-a-input", "e.g., 15"),
        CalcField("part-b-input", "e.g., 25"),
    ],
    fn=_js_calc,
)

register_calculator(
    "scientific-calculator", "Pro Scientific Calculator", "basic",
    "Pro Scientific Calculator",
    fields=[
        CalcField("display", "Calculator Display (button-based input)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "scientific-notation-converter", "Scientific Notation Converter", "basic",
    "Scientific Notation Converter",
    fields=[
        CalcField("standard-input", "e.g., 1230000000 or 0.000001", type="text"),
        CalcField("mantissa-input", "Base (A)", type="text"),
        CalcField("exponent-input", "Exponent (N)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "series-sum-calculator", "Sum of Series Calculator ($\mathbf{S_n}$)", "basic",
    "Sum of Series Calculator ($\mathbf{S_n}$)",
    fields=[
        CalcField("arithmetic-a-input", "e.g., 2", type="text"),
        CalcField("arithmetic-d-input", "e.g., 3", type="text"),
        CalcField("arithmetic-n-input", "e.g., 5"),
        CalcField("geometric-a-input", "e.g., 3", type="text"),
        CalcField("geometric-r-input", "e.g., 2", type="text"),
        CalcField("geometric-n-input", "e.g., 4"),
    ],
    fn=_js_calc,
)

register_calculator(
    "significant-figures-counter", "Significant Figures Counter", "basic",
    "Significant Figures Counter",
    fields=[
        CalcField("number-input", "Enter number here...", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "standard-deviation-calculator", "Standard Deviation Calculator ($\sigma$)", "basic",
    "Standard Deviation Calculator ($\sigma$)",
    fields=[
        CalcField("data-input", "e.g., 2, 4, 4, 4, 5, 5, 7, 9"),
    ],
    fn=_js_calc,
)

register_calculator(
    "system-solver", "System of Equations Solver ($2 \times 2$)", "basic",
    "System of Equations Solver ($2 \times 2$)",
    fields=[
        CalcField("a1", "a1", type="text"),
        CalcField("b1", "b1", type="text"),
        CalcField("c1", "c1", type="text"),
        CalcField("a2", "a2", type="text"),
        CalcField("b2", "b2", type="text"),
        CalcField("c2", "c2", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "trig-identity-verifier", "Trigonometric Identity Verifier", "basic",
    "Trigonometric Identity Verifier",
    fields=[
        CalcField("lhs-input", "e.g., sin(x)^2 + cos(x)^2", type="text"),
        CalcField("rhs-input", "e.g., 1", type="text"),
        CalcField("unit-selector", "Angle Unit:", type="select", options=[{"value": "Radians", "label": "Radians"}, {"value": "Degrees", "label": "Degrees"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "truth-table-generator", "Truth Table Generator", "basic",
    "Truth Table Generator",
    fields=[
        CalcField("expression-input", "e.g., (A AND B) OR NOT C", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "unit-vector-calculator", "Unit Vector Calculator (3D)", "basic",
    "Unit Vector Calculator (3D)",
    fields=[
        CalcField("vx-input", "X component"),
        CalcField("vy-input", "Y component"),
        CalcField("vz-input", "Z component"),
    ],
    fn=_js_calc,
)

register_calculator(
    "vector-product-calculator", "3D Vector Product Calculator", "basic",
    "3D Vector Product Calculator",
    fields=[
        CalcField("ax-input", "X component"),
        CalcField("ay-input", "Y component"),
        CalcField("az-input", "Z component"),
        CalcField("bx-input", "X component"),
        CalcField("by-input", "Y component"),
        CalcField("bz-input", "Z component"),
    ],
    fn=_js_calc,
)

register_calculator(
    "a1c-converter", "A1C to Average Blood Sugar Converter", "health",
    "A1C to Average Blood Sugar Converter",
    fields=[
        CalcField("a1c_input", "e.g., 7.0"),
    ],
    fn=_js_calc,
)

register_calculator(
    "apgar-score-calculator", "Apgar Score Calculator (A.P.G.A.R.)", "health",
    "Apgar Score Calculator (A.P.G.A.R.)",
    fields=[
        CalcField("A_0", "0 Points: Blue, pale all over"),
        CalcField("A_1", "1 Point: Pink body, blue extremities (acrocyanosis)"),
        CalcField("A_2", "2 Points: Pink all over"),
        CalcField("P_0", "0 Points: Absent"),
        CalcField("P_1", "1 Point: Slow (Less than 100 beats per minute)"),
        CalcField("P_2", "2 Points: Greater than 100 beats per minute"),
        CalcField("G_0", "0 Points: No response to stimulation"),
        CalcField("G_1", "1 Point: Grimace or weak cry with stimulation"),
        CalcField("G_2", "2 Points: Cries, sneezes, coughs, pulls away"),
        CalcField("Act_0", "0 Points: Limp"),
        CalcField("Act_1", "1 Point: Some flexion of extremities"),
        CalcField("Act_2", "2 Points: Active motion"),
        CalcField("R_0", "0 Points: Absent"),
        CalcField("R_1", "1 Point: Slow, irregular, weak cry"),
        CalcField("R_2", "2 Points: Good, strong cry"),
    ],
    fn=_js_calc,
)

register_calculator(
    "basal-insulin-calculator", "Basal Insulin Dose Calculator", "health",
    "Basal Insulin Dose Calculator",
    fields=[
        CalcField("weight_input", "e.g., 80"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Kg", "label": "Kg"}, {"value": "Lbs", "label": "Lbs"}]),
        CalcField("tdd_factor_min", "Tdd Factor Min"),
        CalcField("tdd_factor_max", "Tdd Factor Max"),
    ],
    fn=_js_calc,
)

register_calculator(
    "basal-metabolic-rate-calculator", "BMR & TDEE Calculator", "health",
    "BMR & TDEE Calculator",
    fields=[
        CalcField("genderMale", "Male"),
        CalcField("genderFemale", "Female"),
        CalcField("age", "Age (Years)"),
        CalcField("weight_lb", "Weight (e.g., 180)"),
        CalcField("height_ft", "Feet (e.g., 5)"),
        CalcField("height_in", "Inches (e.g., 10)"),
        CalcField("activity_level", "Select Activity Level for TDEE", type="select", options=[{"value": "Choose your level", "label": "Choose your level"}, {"value": "Sedentary (Little or no exercise)", "label": "Sedentary (Little or no exercise)"}, {"value": "Lightly Active (Light exercise/sports 1-3 days/week)", "label": "Lightly Active (Light exercise/sports 1-3 days/week)"}, {"value": "Moderately Active (Moderate exercise/sports 3-5 days/week)", "label": "Moderately Active (Moderate exercise/sports 3-5 days/week)"}, {"value": "Very Active (Hard exercise/sports 6-7 days a week)", "label": "Very Active (Hard exercise/sports 6-7 days a week)"}, {"value": "Extra Active (Very hard exercise/physical job)", "label": "Extra Active (Very hard exercise/physical job)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "blood-alcohol-content-calculator", "Blood Alcohol Content (BAC) Calculator", "health",
    "Blood Alcohol Content (BAC) Calculator",
    fields=[
        CalcField("genderMale", "Male (r=0.68)"),
        CalcField("genderFemale", "Female (r=0.55)"),
        CalcField("weight_lb", "Body Weight"),
        CalcField("standard_drinks", "Number of Standard Drinks Consumed"),
        CalcField("time_h", "Time since first drink"),
    ],
    fn=_js_calc,
)

register_calculator(
    "bmi", "BMI Calculator", "health",
    "BMI Calculator",
    fields=[
        CalcField("weight", "e.g. 70"),
        CalcField("height", "e.g. 175"),
    ],
    fn=_js_calc,
)

register_calculator(
    "body-fat-calculator-navy", "Body Fat Percentage Calculator (Navy Method)", "health",
    "Body Fat Percentage Calculator (Navy Method)",
    fields=[
        CalcField("genderMale", "Male"),
        CalcField("genderFemale", "Female"),
        CalcField("height_ft", "Feet (e.g., 5)"),
        CalcField("height_in", "Inches (e.g., 10)"),
        CalcField("weight_lb", "Body Weight (e.g., 180)"),
        CalcField("neck_in", "Neck Circumference (in)"),
        CalcField("waist_in", "Waist/Abdomen Circumference (in)"),
        CalcField("hips_in", "Hip Circumference (in)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "body-surface-area-calculator", "Body Surface Area (BSA) Calculator", "health",
    "Body Surface Area (BSA) Calculator",
    fields=[
        CalcField("height_ft", "Feet (e.g., 5)"),
        CalcField("height_in", "Inches (e.g., 5)"),
        CalcField("weight_input", "Weight"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Lbs", "label": "Lbs"}, {"value": "Kg", "label": "Kg"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "caffeine-half-life-calculator", "Caffeine Half-Life Calculator", "health",
    "Caffeine Half-Life Calculator",
    fields=[
        CalcField("initial_dose", "e.g., 200"),
        CalcField("consumption_time", "Consumption Time", type="date"),
        CalcField("half_life", "e.g., 5"),
    ],
    fn=_js_calc,
)

register_calculator(
    "calorie-burn-calculator", "Activity Calorie Burn Calculator", "health",
    "Activity Calorie Burn Calculator",
    fields=[
        CalcField("activity_select", "Select Activity", type="select", options=[{"value": "-- Choose an Activity --", "label": "-- Choose an Activity --"}, {"value": "Desk Work / Light Office Activity (1.5 METs)", "label": "Desk Work / Light Office Activity (1.5 METs)"}, {"value": "Walking, moderate pace (3.5 METs)", "label": "Walking, moderate pace (3.5 METs)"}, {"value": "Brisk Walking / Hiking (6.0 METs)", "label": "Brisk Walking / Hiking (6.0 METs)"}, {"value": "Jogging / Light Running (7.5 METs)", "label": "Jogging / Light Running (7.5 METs)"}, {"value": "Running (7.5 mph / 8 min/mile) (11.5 METs)", "label": "Running (7.5 mph / 8 min/mile) (11.5 METs)"}, {"value": "Swimming, moderate/vigorous (8.0 METs)", "label": "Swimming, moderate/vigorous (8.0 METs)"}, {"value": "Elliptical or Stair Climbing (7.0 METs)", "label": "Elliptical or Stair Climbing (7.0 METs)"}, {"value": "Aerobics / Water Aerobics (6.0 METs)", "label": "Aerobics / Water Aerobics (6.0 METs)"}, {"value": "Weight Lifting, general (5.5 METs)", "label": "Weight Lifting, general (5.5 METs)"}, {"value": "Golf / Yoga (4.0 METs)", "label": "Golf / Yoga (4.0 METs)"}, {"value": "Tennis, singles (7.0 METs)", "label": "Tennis, singles (7.0 METs)"}]),
        CalcField("duration_min", "Duration"),
        CalcField("weight_input", "Weight"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Lbs", "label": "Lbs"}, {"value": "Kg", "label": "Kg"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "calorie-deficit-calculator", "Calorie Deficit Calculator", "health",
    "Calorie Deficit Calculator",
    fields=[
        CalcField("genderMale", "Male"),
        CalcField("genderFemale", "Female"),
        CalcField("age", "Age (Years)"),
        CalcField("weight_lb", "Weight (e.g., 180)"),
        CalcField("height_ft", "Feet (e.g., 5)"),
        CalcField("height_in", "Inches (e.g., 10)"),
        CalcField("activity_level", "Select Your Average Activity Level", type="select", options=[{"value": "Choose your level", "label": "Choose your level"}, {"value": "Sedentary (Little or no exercise)", "label": "Sedentary (Little or no exercise)"}, {"value": "Lightly Active (Light exercise/sports 1-3 days/week)", "label": "Lightly Active (Light exercise/sports 1-3 days/week)"}, {"value": "Moderately Active (Moderate exercise/sports 3-5 days/week)", "label": "Moderately Active (Moderate exercise/sports 3-5 days/week)"}, {"value": "Very Active (Hard exercise/sports 6-7 days a week)", "label": "Very Active (Hard exercise/sports 6-7 days a week)"}, {"value": "Extra Active (Very hard exercise/physical job)", "label": "Extra Active (Very hard exercise/physical job)"}]),
        CalcField("weekly_loss", "Desired Weekly Weight Loss"),
    ],
    fn=_js_calc,
)

register_calculator(
    "calorie-surplus-calculator", "Calorie Surplus Calculator", "health",
    "Calorie Surplus Calculator",
    fields=[
        CalcField("genderMale", "Male"),
        CalcField("genderFemale", "Female"),
        CalcField("age", "Age (Years)"),
        CalcField("weight_lb", "Weight (e.g., 180)"),
        CalcField("height_ft", "Feet (e.g., 5)"),
        CalcField("height_in", "Inches (e.g., 10)"),
        CalcField("activity_level", "Select Your Average Activity Level", type="select", options=[{"value": "Choose your level", "label": "Choose your level"}, {"value": "Sedentary (Little or no exercise)", "label": "Sedentary (Little or no exercise)"}, {"value": "Lightly Active (Light exercise/sports 1-3 days/week)", "label": "Lightly Active (Light exercise/sports 1-3 days/week)"}, {"value": "Moderately Active (Moderate exercise/sports 3-5 days/week)", "label": "Moderately Active (Moderate exercise/sports 3-5 days/week)"}, {"value": "Very Active (Hard exercise/sports 6-7 days a week)", "label": "Very Active (Hard exercise/sports 6-7 days a week)"}, {"value": "Extra Active (Very hard exercise/physical job)", "label": "Extra Active (Very hard exercise/physical job)"}]),
        CalcField("weekly_gain", "Desired Weekly Weight Gain"),
    ],
    fn=_js_calc,
)

register_calculator(
    "carb-cycling-calculator", "Carb Cycling Macro Calculator", "health",
    "Carb Cycling Macro Calculator",
    fields=[
        CalcField("weight_input", "e.g., 180"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Lbs", "label": "Lbs"}, {"value": "Kg", "label": "Kg"}]),
        CalcField("goal_select", "Goal Select", type="select", options=[{"value": "-- Select Goal --", "label": "-- Select Goal --"}, {"value": "Fat Loss / Cutting", "label": "Fat Loss / Cutting"}, {"value": "Maintenance", "label": "Maintenance"}, {"value": "Muscle Gain / Bulking", "label": "Muscle Gain / Bulking"}]),
        CalcField("high_days", "e.g., 2"),
        CalcField("low_days", "e.g., 5"),
    ],
    fn=_js_calc,
)

register_calculator(
    "child-dose-calculator", "Child Dose Calculator (mg/kg)", "health",
    "Child Dose Calculator (mg/kg)",
    fields=[
        CalcField("weight_input", "e.g., 25"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Kg", "label": "Kg"}, {"value": "Lbs", "label": "Lbs"}]),
        CalcField("factor_min", "Factor Min"),
        CalcField("factor_max", "Factor Max"),
    ],
    fn=_js_calc,
)

register_calculator(
    "child-height-predictor", "Child Height Predictor", "health",
    "Child Height Predictor",
    fields=[
        CalcField("height_unit_select", "Height Unit Select", type="select", options=[{"value": "Inches", "label": "Inches"}, {"value": "Centimeters", "label": "Centimeters"}]),
        CalcField("father_height", "e.g., 70 (in)"),
        CalcField("mother_height", "e.g., 65 (in)"),
        CalcField("child_gender", "Child Gender", type="select", options=[{"value": "-- Select Child's Gender --", "label": "-- Select Child's Gender --"}, {"value": "Boy", "label": "Boy"}, {"value": "Girl", "label": "Girl"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "creatine-loading-calculator", "Creatine Loading Calculator", "health",
    "Creatine Loading Calculator",
    fields=[
        CalcField("weight_input", "e.g., 85"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Kg", "label": "Kg"}, {"value": "Lbs", "label": "Lbs"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "crossfit-pacing-calculator", "WOD Pacing Strategy Planner", "health",
    "WOD Pacing Strategy Planner",
    fields=[
        CalcField("total_volume", "e.g., 150 (for a 30-20-10 pullup WOD)"),
        CalcField("num_breaks", "e.g., 5 (for 5 rounds or 5 planned breaks)"),
        CalcField("time_m", "Minutes (M)"),
        CalcField("time_s", "Seconds (S)"),
        CalcField("rest_per_break", "e.g., 5"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cycling-pwr-calculator", "Cycling Power-to-Weight Ratio ($\text{W}/\text{kg}$)", "health",
    "Cycling Power-to-Weight Ratio ($\text{W}/\text{kg}$)",
    fields=[
        CalcField("ftp_input", "Your FTP (20-minute power x 0.95)"),
        CalcField("weight_input", "Current Riding Weight"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Kg", "label": "Kg"}, {"value": "Lbs", "label": "Lbs"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "due-date-calculator", "Pregnancy Due Date Calculator", "health",
    "Pregnancy Due Date Calculator",
    fields=[
        CalcField("lmp_date", "Date of the first day of your last period", type="date"),
        CalcField("cycle_length", "Average Cycle Length"),
    ],
    fn=_js_calc,
)

register_calculator(
    "egfr-calculator", "eGFR Calculator (CKD-EPI 2021)", "health",
    "eGFR Calculator (CKD-EPI 2021)",
    fields=[
        CalcField("gender_select", "Gender Select", type="select", options=[{"value": "-- Select Gender --", "label": "-- Select Gender --"}, {"value": "Female", "label": "Female"}, {"value": "Male", "label": "Male"}]),
        CalcField("creatinine_input", "e.g., 0.8"),
        CalcField("age_input", "e.g., 45"),
    ],
    fn=_js_calc,
)

register_calculator(
    "fertility-ovulation-calculator", "Fertility & Ovulation Calculator", "health",
    "Fertility & Ovulation Calculator",
    fields=[
        CalcField("lmp_date", "Lmp Date", type="date"),
        CalcField("cycle_length", "e.g., 28"),
    ],
    fn=_js_calc,
)

register_calculator(
    "fiber-intake-calculator", "Daily Fiber Intake Calculator", "health",
    "Daily Fiber Intake Calculator",
    fields=[
        CalcField("age", "Your Age (Years)"),
        CalcField("genderMale", "Male"),
        CalcField("genderFemale", "Female"),
        CalcField("calories", "Daily Caloric Intake (e.g., 2000)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "fitness-age-calculator", "Fitness Age Calculator", "health",
    "Fitness Age Calculator",
    fields=[
        CalcField("user_gender", "User Gender", type="select", options=[{"value": "-- Select Gender --", "label": "-- Select Gender --"}, {"value": "Male", "label": "Male"}, {"value": "Female", "label": "Female"}]),
        CalcField("actual_age", "e.g., 40"),
        CalcField("rhr_input", "e.g., 65"),
        CalcField("waist_input", "e.g., 90"),
        CalcField("waist_unit", "Waist Unit", type="select", options=[{"value": "cm", "label": "cm"}, {"value": "in", "label": "in"}]),
        CalcField("activity_level", "Activity Level", type="select", options=[{"value": "-- Select Activity Level --", "label": "-- Select Activity Level --"}, {"value": "Low (Less than 1 hour/week)", "label": "Low (Less than 1 hour/week)"}, {"value": "Moderate (1 to 3 hours/week)", "label": "Moderate (1 to 3 hours/week)"}, {"value": "High (More than 3 hours/week)", "label": "High (More than 3 hours/week)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "gym-plate-calculator", "Gym Plate Loading Calculator", "health",
    "Gym Plate Loading Calculator",
    fields=[
        CalcField("target_weight", "e.g., 100"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Kg", "label": "Kg"}, {"value": "Lbs", "label": "Lbs"}]),
        CalcField("bar_weight", "e.g., 20 or 45"),
    ],
    fn=_js_calc,
)

register_calculator(
    "heart-rate-recovery-calculator", "Heart Rate Recovery (HRR) Calculator", "health",
    "Heart Rate Recovery (HRR) Calculator",
    fields=[
        CalcField("peak_hr", "Peak Heart Rate (End of Exercise)"),
        CalcField("post_hr", "Heart Rate 1 Minute After Stopping"),
        CalcField("age", "Your Age (Years)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "hill-grade-calculator", "Hill Grade Percentage Calculator", "health",
    "Hill Grade Percentage Calculator",
    fields=[
        CalcField("measurement_unit", "Measurement Unit", type="select", options=[{"value": "Meters ($\text{m}$)", "label": "Meters ($\text{m}$)"}, {"value": "Feet ($\text{ft}$)", "label": "Feet ($\text{ft}$)"}]),
        CalcField("rise_input", "e.g., 10"),
        CalcField("run_input", "e.g., 100"),
    ],
    fn=_js_calc,
)

register_calculator(
    "ideal-weight-calculator", "Ideal Weight Calculator", "health",
    "Ideal Weight Calculator",
    fields=[
        CalcField("gender_select", "Gender Select", type="select", options=[{"value": "-- Select Gender --", "label": "-- Select Gender --"}, {"value": "Male", "label": "Male"}, {"value": "Female", "label": "Female"}]),
        CalcField("height_ft", "Feet"),
        CalcField("height_in", "Inches"),
        CalcField("height_unit", "Height Unit", type="select", options=[{"value": "ft / in", "label": "ft / in"}, {"value": "cm", "label": "cm"}]),
        CalcField("current_weight", "Optional"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Lbs", "label": "Lbs"}, {"value": "Kg", "label": "Kg"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "if-window-planner", "⏰ Intermittent Fasting Window Planner", "health",
    "⏰ Intermittent Fasting Window Planner",
    fields=[
        CalcField("protocol_select", "Protocol Select", type="select", options=[{"value": "-- Select IF Protocol --", "label": "-- Select IF Protocol --"}, {"value": "16:8 (Most Common)", "label": "16:8 (Most Common)"}, {"value": "18:6 (Advanced)", "label": "18:6 (Advanced)"}, {"value": "20:4 (The Warrior Diet)", "label": "20:4 (The Warrior Diet)"}, {"value": "23:1 (One Meal A Day - OMAD)", "label": "23:1 (One Meal A Day - OMAD)"}, {"value": "14:10 (Beginner)", "label": "14:10 (Beginner)"}, {"value": "12:12 (Easiest)", "label": "12:12 (Easiest)"}]),
        CalcField("start_time", "Start Time", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "lean-body-mass-calculator", "Lean Body Mass (LBM) Calculator", "health",
    "Lean Body Mass (LBM) Calculator",
    fields=[
        CalcField("genderMale", "Male"),
        CalcField("genderFemale", "Female"),
        CalcField("height_ft", "Feet (e.g., 5)"),
        CalcField("height_in", "Inches (e.g., 5)"),
        CalcField("weight_input", "Current Weight"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Lbs", "label": "Lbs"}, {"value": "Kg", "label": "Kg"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "macronutrient-calculator", "Macronutrient (Macros) Calculator", "health",
    "Macronutrient (Macros) Calculator",
    fields=[
        CalcField("daily_calorie_target", "Daily Calorie Target (e.g., 2000)"),
        CalcField("genderMale", "Male"),
        CalcField("genderFemale", "Female"),
        CalcField("age", "Age (Years)"),
        CalcField("weight_lb", "Weight (e.g., 180)"),
        CalcField("height_ft", "Feet (e.g., 5)"),
        CalcField("height_in", "Inches (e.g., 10)"),
        CalcField("activity_level", "Select Your Average Activity Level", type="select", options=[{"value": "Choose your level", "label": "Choose your level"}, {"value": "Sedentary", "label": "Sedentary"}, {"value": "Lightly Active", "label": "Lightly Active"}, {"value": "Moderately Active", "label": "Moderately Active"}, {"value": "Very Active", "label": "Very Active"}, {"value": "Extra Active", "label": "Extra Active"}]),
        CalcField("protein_pct", "Protein"),
        CalcField("carb_pct", "Carbohydrates"),
        CalcField("fat_pct", "Fat"),
    ],
    fn=_js_calc,
)

register_calculator(
    "mets-calculator", "METs (Metabolic Equivalents) Calculator", "health",
    "METs (Metabolic Equivalents) Calculator",
    fields=[
        CalcField("activity_select", "Select Activity", type="select", options=[{"value": "-- Choose an Activity --", "label": "-- Choose an Activity --"}, {"value": "Sitting/Resting (1.0 METs)", "label": "Sitting/Resting (1.0 METs)"}, {"value": "Typing/Office Work (1.5 METs)", "label": "Typing/Office Work (1.5 METs)"}, {"value": "Walking, easy pace (3.0 METs)", "label": "Walking, easy pace (3.0 METs)"}, {"value": "Brisk Walking (4.0 METs)", "label": "Brisk Walking (4.0 METs)"}, {"value": "Cycling (10-11.9 mph) (6.8 METs)", "label": "Cycling (10-11.9 mph) (6.8 METs)"}, {"value": "Weight Lifting, vigorous (6.0 METs)", "label": "Weight Lifting, vigorous (6.0 METs)"}, {"value": "Basketball game (7.0 METs)", "label": "Basketball game (7.0 METs)"}, {"value": "Soccer, recreational (8.0 METs)", "label": "Soccer, recreational (8.0 METs)"}, {"value": "Running (6.0 mph / 10 min/mile) (10.0 METs)", "label": "Running (6.0 mph / 10 min/mile) (10.0 METs)"}, {"value": "Running (10.0 mph / 6 min/mile) (15.0 METs)", "label": "Running (10.0 mph / 6 min/mile) (15.0 METs)"}]),
        CalcField("weight_input", "Weight"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Lbs", "label": "Lbs"}, {"value": "Kg", "label": "Kg"}]),
        CalcField("duration_min", "Duration"),
    ],
    fn=_js_calc,
)

register_calculator(
    "one-rep-max-calculator", "One-Rep Max (1RM) Calculator", "health",
    "One-Rep Max (1RM) Calculator",
    fields=[
        CalcField("weight_lifted", "Weight Lifted"),
        CalcField("repetitions", "Successful Repetitions (Reps)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "pregnancy-weight-gain-calculator", "Pregnancy Weight Gain Calculator", "health",
    "Pregnancy Weight Gain Calculator",
    fields=[
        CalcField("height_ft", "Feet (e.g., 5)"),
        CalcField("height_in", "Inches (e.g., 5)"),
        CalcField("pre_pregnancy_weight_lb", "Pre-Pregnancy Weight"),
        CalcField("current_week", "Current Week of Pregnancy (1-40)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "protein-intake-calculator", "Daily Protein Intake Calculator", "health",
    "Daily Protein Intake Calculator",
    fields=[
        CalcField("weight_input", "Body Weight"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Lbs", "label": "Lbs"}, {"value": "Kg", "label": "Kg"}]),
        CalcField("goal_level", "Primary Fitness Goal / Activity Level", type="select", options=[{"value": "Select your goal", "label": "Select your goal"}, {"value": "Maintenance / Sedentary (Minimal activity)", "label": "Maintenance / Sedentary (Minimal activity)"}, {"value": "Endurance Training (Running, cycling)", "label": "Endurance Training (Running, cycling)"}, {"value": "Strength Training (Muscle building / Hypertrophy)", "label": "Strength Training (Muscle building / Hypertrophy)"}, {"value": "Caloric Deficit / Weight Loss (High satiety)", "label": "Caloric Deficit / Weight Loss (High satiety)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "psa-density-calculator", "PSA Density ($\text{PSAD}$) Calculator", "health",
    "PSA Density ($\text{PSAD}$) Calculator",
    fields=[
        CalcField("total_psa", "e.g., 6.5"),
        CalcField("prostate_volume", "e.g., 40"),
    ],
    fn=_js_calc,
)

register_calculator(
    "race-pace-planner", "⏱ Race Pace Strategy Planner", "health",
    "⏱ Race Pace Strategy Planner",
    fields=[
        CalcField("race_distance", "Race Distance", type="select", options=[{"value": "-- Select Distance --", "label": "-- Select Distance --"}, {"value": "5K", "label": "5K"}, {"value": "10K", "label": "10K"}, {"value": "Half Marathon ($\text{21.1}$ km)", "label": "Half Marathon ($\text{21.1}$ km)"}, {"value": "Marathon ($\text{42.2}$ km)", "label": "Marathon ($\text{42.2}$ km)"}]),
        CalcField("pace_unit", "Pace Unit", type="select", options=[{"value": "Kilometers ($\text{km}$)", "label": "Kilometers ($\text{km}$)"}, {"value": "Miles ($\text{mi}$)", "label": "Miles ($\text{mi}$)"}]),
        CalcField("time_h", "Hours (H)"),
        CalcField("time_m", "Minutes (M)"),
        CalcField("time_s", "Seconds (S)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "race-time-predictor", "Race Time Predictor", "health",
    "Race Time Predictor",
    fields=[
        CalcField("race_distance_km", "Race Distance Km", type="select", options=[{"value": "-- Select Distance --", "label": "-- Select Distance --"}, {"value": "5K ($\text{3.1}$ miles)", "label": "5K ($\text{3.1}$ miles)"}, {"value": "10K ($\text{6.2}$ miles)", "label": "10K ($\text{6.2}$ miles)"}, {"value": "Half Marathon ($\text{13.1}$ miles)", "label": "Half Marathon ($\text{13.1}$ miles)"}, {"value": "Marathon ($\text{26.2}$ miles)", "label": "Marathon ($\text{26.2}$ miles)"}]),
        CalcField("time_h", "Hours (H)"),
        CalcField("time_m", "Minutes (M)"),
        CalcField("time_s", "Seconds (S)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "rep-max-percentage-converter", "1 Rep Max to Percentage Converter", "health",
    "1 Rep Max to Percentage Converter",
    fields=[
        CalcField("one_rep_max", "Weight for 1 Rep Max"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Kg", "label": "Kg"}, {"value": "Lbs", "label": "Lbs"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "running-pace-calculator", "⏱ Running Pace Calculator", "health",
    "⏱ Running Pace Calculator",
    fields=[
        CalcField("distance", "Distance"),
        CalcField("distance_unit", "Distance Unit", type="select", options=[{"value": "Miles", "label": "Miles"}, {"value": "Kilometers", "label": "Kilometers"}]),
        CalcField("time_h", "0"),
        CalcField("time_m", "0"),
        CalcField("time_s", "0"),
    ],
    fn=_js_calc,
)

register_calculator(
    "sleep-cycle-calculator", "Sleep Cycle Calculator (Wake-up Time)", "health",
    "Sleep Cycle Calculator (Wake-up Time)",
    fields=[
        CalcField("bedtime_h", "Bedtime H", type="select"),
        CalcField("bedtime_m", "Bedtime M", type="select", options=[{"value": "00", "label": "00"}, {"value": "15", "label": "15"}, {"value": "30", "label": "30"}, {"value": "45", "label": "45"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "strength-standard-calculator", "Strength Standard Calculator (1RM)", "health",
    "Strength Standard Calculator (1RM)",
    fields=[
        CalcField("user_gender", "User Gender", type="select", options=[{"value": "-- Select Gender --", "label": "-- Select Gender --"}, {"value": "Male", "label": "Male"}, {"value": "Female", "label": "Female"}]),
        CalcField("body_weight", "e.g., 80"),
        CalcField("weight_unit", "Weight Unit", type="select", options=[{"value": "Kg", "label": "Kg"}, {"value": "Lbs", "label": "Lbs"}]),
        CalcField("lift_type", "Lift Type", type="select", options=[{"value": "-- Select Lift --", "label": "-- Select Lift --"}, {"value": "Bench Press", "label": "Bench Press"}, {"value": "Squat", "label": "Squat"}, {"value": "Deadlift", "label": "Deadlift"}]),
        CalcField("lift_weight", "e.g., 100"),
    ],
    fn=_js_calc,
)

register_calculator(
    "swimming-interval-calculator", "Set Interval Planner", "health",
    "Set Interval Planner",
    fields=[
        CalcField("distance_unit", "Distance Unit", type="select", options=[{"value": "Meters ($\text{m}$)", "label": "Meters ($\text{m}$)"}, {"value": "Yards ($\text{yd}$)", "label": "Yards ($\text{yd}$)"}]),
        CalcField("pace_m", "Min (M)"),
        CalcField("pace_s", "Sec (S)"),
        CalcField("swim_distance", "e.g., 100"),
        CalcField("rest_time", "e.g., 10"),
    ],
    fn=_js_calc,
)

register_calculator(
    "swimming-pace-calculator", "Swimming Pace Calculator", "health",
    "Swimming Pace Calculator",
    fields=[
        CalcField("modePace", "Pace"),
        CalcField("modeTime", "Time"),
        CalcField("modeDistance", "Distance"),
        CalcField("distance_val", "Distance Value"),
        CalcField("distance_unit", "Distance Unit", type="select", options=[{"value": "Meters (m)", "label": "Meters (m)"}, {"value": "Yards (yd)", "label": "Yards (yd)"}]),
        CalcField("time_h", "Hours"),
        CalcField("time_m", "Minutes"),
        CalcField("time_s", "Seconds"),
        CalcField("pace_m", "Min"),
        CalcField("pace_s", "Sec"),
        CalcField("pace_unit", "Pace Unit", type="select", options=[{"value": "/ 100m", "label": "/ 100m"}, {"value": "/ 100yd", "label": "/ 100yd"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "target-heart-rate-calculator", "Target Heart Rate Zone Calculator", "health",
    "Target Heart Rate Zone Calculator",
    fields=[
        CalcField("age", "Your Age (Years)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "total-daily-energy-expenditure", "Total Daily Energy Expenditure (TDEE) Calculator", "health",
    "Total Daily Energy Expenditure (TDEE) Calculator",
    fields=[
        CalcField("genderMale", "Male"),
        CalcField("genderFemale", "Female"),
        CalcField("age", "Age (Years)"),
        CalcField("weight_lb", "Weight (e.g., 180)"),
        CalcField("height_ft", "Feet (e.g., 5)"),
        CalcField("height_in", "Inches (e.g., 10)"),
        CalcField("activity_level", "Select Your Average Activity Level", type="select", options=[{"value": "Choose your level (BMR is multiplied by this factor)", "label": "Choose your level (BMR is multiplied by this factor)"}, {"value": "1. Sedentary (Little or no exercise)", "label": "1. Sedentary (Little or no exercise)"}, {"value": "2. Lightly Active (Light exercise/sports 1-3 days/week)", "label": "2. Lightly Active (Light exercise/sports 1-3 days/week)"}, {"value": "3. Moderately Active (Moderate exercise/sports 3-5 days/week)", "label": "3. Moderately Active (Moderate exercise/sports 3-5 days/week)"}, {"value": "4. Very Active (Hard exercise/sports 6-7 days a week)", "label": "4. Very Active (Hard exercise/sports 6-7 days a week)"}, {"value": "5. Extra Active (Very hard exercise/physical job)", "label": "5. Extra Active (Very hard exercise/physical job)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "treadmill-pace-converter", "Treadmill Pace Converter", "health",
    "Treadmill Pace Converter",
    fields=[
        CalcField("input_format", "Input Format", type="select", options=[{"value": "-- Select Input Format --", "label": "-- Select Input Format --"}, {"value": "Speed: Kilometers per hour ($\text{km/h}$)", "label": "Speed: Kilometers per hour ($\text{km/h}$)"}, {"value": "Speed: Miles per hour ($\text{mph}$)", "label": "Speed: Miles per hour ($\text{mph}$)"}, {"value": "Pace: Time per Kilometre ($\text{M:SS/km}$)", "label": "Pace: Time per Kilometre ($\text{M:SS/km}$)"}, {"value": "Pace: Time per Mile ($\text{M:SS/mi}$)", "label": "Pace: Time per Mile ($\text{M:SS/mi}$)"}]),
        CalcField("speed_input", "e.g., 10"),
        CalcField("pace_m", "Min (M)"),
        CalcField("pace_s", "Sec (S)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "vo2-max-calculator", "VO2 Max Calculator", "health",
    "VO2 Max Calculator",
    fields=[
        CalcField("genderMale", "Male"),
        CalcField("genderFemale", "Female"),
        CalcField("age", "Age (Years)"),
        CalcField("weight_lb", "Weight (e.g., 180)"),
        CalcField("height_ft", "Feet (e.g., 5)"),
        CalcField("height_in", "Inches (e.g., 10)"),
        CalcField("activity_level", "How often do you engage in vigorous exercise?", type="select", options=[{"value": "Select frequency", "label": "Select frequency"}, {"value": "Never / Seldom", "label": "Never / Seldom"}, {"value": "Sometimes (1-2 times per week)", "label": "Sometimes (1-2 times per week)"}, {"value": "Regularly (3 or more times per week)", "label": "Regularly (3 or more times per week)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "waist-to-hip-ratio-calculator", "Waist-to-Hip Ratio (WHR) Calculator", "health",
    "Waist-to-Hip Ratio (WHR) Calculator",
    fields=[
        CalcField("genderMale", "Male"),
        CalcField("genderFemale", "Female"),
        CalcField("waist_input", "Waist (Smallest point)"),
        CalcField("hip_input", "Hips (Widest point)"),
        CalcField("unit_select", "Unit Select", type="select", options=[{"value": "In", "label": "In"}, {"value": "Cm", "label": "Cm"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "water-intake-calculator", "Water Intake Calculator", "health",
    "Water Intake Calculator",
    fields=[
        CalcField("weight_lb", "e.g. 150"),
        CalcField("activity_level", "Activity Level", type="select", options=[{"value": "Select activity...", "label": "Select activity..."}, {"value": "Sedentary (Little/No Exercise)", "label": "Sedentary (Little/No Exercise)"}, {"value": "Moderate (30-60 mins)", "label": "Moderate (30-60 mins)"}, {"value": "Active (60+ mins)", "label": "Active (60+ mins)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "air-conditioner-calculator", "Air Conditioner BTU Calculator", "construction",
    "Air Conditioner BTU Calculator",
    fields=[
        CalcField("roomLength", "Room Length"),
        CalcField("roomWidth", "Room Width"),
        CalcField("sunExposureFactor", "Sun Exposure/Shade", type="select", options=[{"value": "Moderate (Standard windows, some shade)", "label": "Moderate (Standard windows, some shade)"}, {"value": "Heavy Sun (Unshaded south or west facing windows)", "label": "Heavy Sun (Unshaded south or west facing windows)"}, {"value": "Heavy Shade (North facing, heavily shaded)", "label": "Heavy Shade (North facing, heavily shaded)"}]),
        CalcField("insulationFactor", "Insulation Quality / Climate", type="select", options=[{"value": "Average (Standard walls and ceiling)", "label": "Average (Standard walls and ceiling)"}, {"value": "Poor (Poorly insulated, high ceilings, hot climate)", "label": "Poor (Poorly insulated, high ceilings, hot climate)"}, {"value": "Excellent (Modern insulation, cool climate)", "label": "Excellent (Modern insulation, cool climate)"}]),
        CalcField("occupants", "Number of People Regularly in Room"),
    ],
    fn=_js_calc,
)

register_calculator(
    "area-calculator", "Area Calculator (Square Footage)", "construction",
    "Area Calculator (Square Footage)",
    fields=[
        CalcField("shape", "Rectangle"),
        CalcField("length", "Length"),
        CalcField("width", "Width"),
        CalcField("base", "Base"),
        CalcField("height", "Height"),
        CalcField("radius", "Radius"),
    ],
    fn=_js_calc,
)

register_calculator(
    "asphalt-tonnage-calculator", "Asphalt Tonnage Calculator", "construction",
    "Asphalt Tonnage Calculator",
    fields=[
        CalcField("areaLength", "Area Length"),
        CalcField("areaWidth", "Area Width"),
        CalcField("depthInches", "Compacted Depth/Thickness"),
        CalcField("densityLbsPerCf", "Asphalt Density (Pounds per Cubic Foot)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "bevel-angle-calculator", "Crown Molding Miter & Bevel Angle Calculator", "construction",
    "Crown Molding Miter & Bevel Angle Calculator",
    fields=[
        CalcField("springAngle", "Molding Spring Angle (A)"),
        CalcField("cornerAngle", "Inside Corner Angle (C)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "board-foot-lumber-calculator", "Board Foot Lumber Calculator", "construction",
    "Board Foot Lumber Calculator",
    fields=[
        CalcField("thickness", "Thickness"),
        CalcField("width", "Width"),
        CalcField("length", "Length"),
        CalcField("quantity", "Number of Pieces"),
        CalcField("pricePerBoardFoot", "Price per Board Foot"),
    ],
    fn=_js_calc,
)

register_calculator(
    "brick-block-calculator", "Brick & Block Calculator (Units & Mortar)", "construction",
    "Brick & Block Calculator (Units & Mortar)",
    fields=[
        CalcField("wallLength", "Wall Length"),
        CalcField("wallHeight", "Wall Height"),
        CalcField("unitType", "Type of Unit", type="select", options=[{"value": "Standard Brick (8\"x2.25\"x3.625\")", "label": "Standard Brick (8\"x2.25\"x3.625\")"}, {"value": "CMU Block (8\"x8\"x16\" nominal)", "label": "CMU Block (8\"x8\"x16\" nominal)"}]),
        CalcField("unitLength", "Unit Length (Actual)"),
        CalcField("unitHeight", "Unit Height (Actual)"),
        CalcField("unitDepth", "Unit Depth/Thickness (Actual)"),
        CalcField("jointThickness", "Mortar Joint Thickness"),
        CalcField("wastePercent", "Waste/Cut Allowance"),
    ],
    fn=_js_calc,
)

register_calculator(
    "circular-slab-volume-calculator", "Circular Slab Volume Calculator", "construction",
    "Circular Slab Volume Calculator",
    fields=[
        CalcField("slabDiameter", "Slab Diameter"),
        CalcField("slabDepth", "Slab Depth (Thickness)"),
        CalcField("materialType", "Material Type (Affects Waste Factor)", type="select", options=[{"value": "Concrete Slab", "label": "Concrete Slab"}, {"value": "Gravel/Crushed Stone", "label": "Gravel/Crushed Stone"}, {"value": "Sand/Bedding", "label": "Sand/Bedding"}]),
        CalcField("wastePercentage", "Waste/Compaction Factor (%)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "concrete-delivery-time-calculator", "Concrete Delivery Time Calculator", "construction",
    "Concrete Delivery Time Calculator",
    fields=[
        CalcField("slabLength", "Slab Length"),
        CalcField("slabWidth", "Slab Width"),
        CalcField("slabDepth", "Slab Depth (Thickness)"),
        CalcField("pourRate", "Estimated Pour/Finish Rate"),
        CalcField("truckCapacity", "Typical Ready-Mix Truck Capacity"),
        CalcField("unloadingLimit", "Allowed Free Unloading Time per Truck"),
    ],
    fn=_js_calc,
)

register_calculator(
    "concrete-mix-ratio-calculator", "Concrete Mix Ratio Calculator", "construction",
    "Concrete Mix Ratio Calculator",
    fields=[
        CalcField("cementRatio", "Cementratio"),
        CalcField("sandRatio", "Sandratio"),
        CalcField("gravelRatio", "Gravelratio"),
        CalcField("totalVolume", "Total Volume of Concrete Needed"),
        CalcField("volumeUnit", "Volumeunit", type="select", options=[{"value": "Cubic Yards (CY)", "label": "Cubic Yards (CY)"}, {"value": "Cubic Feet (CF)", "label": "Cubic Feet (CF)"}]),
        CalcField("bagVolume", "Volume of 1 Bag of Cement (Standard)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "concrete-slab-calculator", "Concrete Slab Calculator", "construction",
    "Concrete Slab Calculator",
    fields=[
        CalcField("length", "Slab Length"),
        CalcField("width", "Slab Width"),
        CalcField("thickness", "Slab Thickness (Depth)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "construction-loan-draw-calculator", "Construction Loan Draw Calculator", "construction",
    "Construction Loan Draw Calculator",
    fields=[
        CalcField("loanAmount", "Total Construction Loan Value"),
        CalcField("completionPercent", "Current Project Completion"),
        CalcField("holdbackPercent", "Lender Holdback/Retainage Rate"),
        CalcField("previousDraws", "Total Previous Draws Received"),
    ],
    fn=_js_calc,
)

register_calculator(
    "decking-calculator", "Decking Calculator (Boards & Joists)", "construction",
    "Decking Calculator (Boards & Joists)",
    fields=[
        CalcField("deckLength", "Deck Length (Direction Parallel to Deck Boards)"),
        CalcField("deckWidth", "Deck Width (Direction Perpendicular to Boards)"),
        CalcField("boardLength", "Deck Board Length (To be Purchased)"),
        CalcField("boardWidth", "Actual Board Width (The surface area it covers)"),
        CalcField("gap", "Gap Between Boards"),
        CalcField("wastePercent", "Waste/Cut Allowance"),
        CalcField("joistSpacing", "Joist Spacing (Center-to-Center)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "drywall-sheet-calculator", "Drywall Sheet Calculator", "construction",
    "Drywall Sheet Calculator",
    fields=[
        CalcField("length", "Length (ft)"),
        CalcField("width", "Width (ft)"),
        CalcField("height", "Wall Height (ft)"),
        CalcField("surface", "Walls Only"),
        CalcField("subtractArea", "Subtractarea"),
        CalcField("sheetSize", "4x8"),
    ],
    fn=_js_calc,
)

register_calculator(
    "dumpster-size-calculator", "Dumpster Size Calculator (Cubic Yards)", "construction",
    "Dumpster Size Calculator (Cubic Yards)",
    fields=[
        CalcField("pileLength", "Debris Pile Length"),
        CalcField("pileWidth", "Debris Pile Width"),
        CalcField("pileHeight", "Debris Pile Height/Depth"),
        CalcField("compactionFactor", "Compaction/Density of Debris", type="select", options=[{"value": "Light/Loose Debris (e.g., brush, light wood)", "label": "Light/Loose Debris (e.g., brush, light wood)"}, {"value": "Medium Debris (e.g., drywall, mixed remodel)", "label": "Medium Debris (e.g., drywall, mixed remodel)"}, {"value": "Heavy/Dense Debris (e.g., roofing, concrete rubble)", "label": "Heavy/Dense Debris (e.g., roofing, concrete rubble)"}, {"value": "Very Dense/Packed Fill (e.g., excavated soil, dense fill)", "label": "Very Dense/Packed Fill (e.g., excavated soil, dense fill)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "electrical-voltage-drop-calculator", "Electrical Voltage Drop Calculator", "construction",
    "Electrical Voltage Drop Calculator",
    fields=[
        CalcField("amps", "Circuit Current (Amps)"),
        CalcField("distance", "One-Way Distance from Source to Load"),
        CalcField("voltage", "Circuit Voltage", type="select", options=[{"value": "120 V (Standard)", "label": "120 V (Standard)"}, {"value": "240 V (Appliances)", "label": "240 V (Appliances)"}]),
        CalcField("material", "Wire Material", type="select", options=[{"value": "Copper (K=12.9)", "label": "Copper (K=12.9)"}, {"value": "Aluminum (K=21.2)", "label": "Aluminum (K=21.2)"}]),
        CalcField("awg", "Wire Gauge (AWG)", type="select", options=[{"value": "14 AWG", "label": "14 AWG"}, {"value": "12 AWG", "label": "12 AWG"}, {"value": "10 AWG", "label": "10 AWG"}, {"value": "8 AWG", "label": "8 AWG"}, {"value": "6 AWG", "label": "6 AWG"}, {"value": "4 AWG", "label": "4 AWG"}, {"value": "3 AWG", "label": "3 AWG"}, {"value": "2 AWG", "label": "2 AWG"}, {"value": "1 AWG", "label": "1 AWG"}, {"value": "1/0 AWG", "label": "1/0 AWG"}, {"value": "2/0 AWG", "label": "2/0 AWG"}, {"value": "3/0 AWG", "label": "3/0 AWG"}, {"value": "4/0 AWG", "label": "4/0 AWG"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "electrical-wire-size-calculator", "Electrical Wire Size (AWG) Calculator", "construction",
    "Electrical Wire Size (AWG) Calculator",
    fields=[
        CalcField("amps", "Maximum Circuit Current (Amps)"),
        CalcField("voltage", "Circuit Voltage", type="select", options=[{"value": "120 V (Standard Residential Circuit)", "label": "120 V (Standard Residential Circuit)"}, {"value": "240 V (Major Appliances/HVAC)", "label": "240 V (Major Appliances/HVAC)"}]),
        CalcField("distance", "One-Way Distance from Source to Load"),
        CalcField("maxDropPercent", "Maximum Acceptable Voltage Drop", type="select", options=[{"value": "3.0% (Common Residential/Lighting)", "label": "3.0% (Common Residential/Lighting)"}, {"value": "2.0% (Sensitive Electronics/Long Runs)", "label": "2.0% (Sensitive Electronics/Long Runs)"}, {"value": "5.0% (Motors/Short Runs)", "label": "5.0% (Motors/Short Runs)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "exterior-siding-calculator", "Exterior Siding Calculator", "construction",
    "Exterior Siding Calculator",
    fields=[
        CalcField("length", "Length (ft)"),
        CalcField("width", "Width (ft)"),
        CalcField("height", "Wall Height (ft)"),
        CalcField("subtractArea", "Subtractarea"),
        CalcField("wastePercent", "Wastepercent"),
    ],
    fn=_js_calc,
)

register_calculator(
    "fence-material-calculator", "Fence Material Calculator (Posts, Rails, Pickets)", "construction",
    "Fence Material Calculator (Posts, Rails, Pickets)",
    fields=[
        CalcField("fenceLength", "Total Fence Length (Perimeter)"),
        CalcField("fenceHeight", "Picket Height"),
        CalcField("postSpacing", "Post Spacing (Center-to-Center)"),
        CalcField("railsPerSection", "Horizontal Rails Per Section"),
        CalcField("picketWidth", "Actual Picket Width"),
        CalcField("picketGap", "Gap Between Pickets"),
        CalcField("wastePercent", "Waste/Cut Allowance"),
    ],
    fn=_js_calc,
)

register_calculator(
    "flooring-tile-calculator", "Flooring & Tile Calculator", "construction",
    "Flooring & Tile Calculator",
    fields=[
        CalcField("length", "Room Length (ft)"),
        CalcField("width", "Room Width (ft)"),
        CalcField("wastePercent", "Wastepercent"),
        CalcField("enable-tile-calc", "Enable Tile/Plank Count"),
        CalcField("tileLength", "Tilelength"),
        CalcField("tileWidth", "Tilewidth"),
    ],
    fn=_js_calc,
)

register_calculator(
    "french-drain-gravel-calculator", "French Drain Gravel Calculator", "construction",
    "French Drain Gravel Calculator",
    fields=[
        CalcField("trenchLength", "Total Trench Length"),
        CalcField("trenchWidth", "Trench Width"),
        CalcField("trenchDepth", "Trench Depth"),
        CalcField("pipeDiameter", "Perforated Pipe Diameter"),
    ],
    fn=_js_calc,
)

register_calculator(
    "furnace-size-calculator", "Furnace Size BTU Calculator", "construction",
    "Furnace Size BTU Calculator",
    fields=[
        CalcField("area", "Total Heated Area"),
        CalcField("climateFactor", "Climate Zone / Expected Coldest Temperature", type="select", options=[{"value": "Very Cold (Northern US / Canada - e.g., 50 BTU/sq ft)", "label": "Very Cold (Northern US / Canada - e.g., 50 BTU/sq ft)"}, {"value": "Moderate Cold (Mid-Latitude US - e.g., 40 BTU/sq ft)", "label": "Moderate Cold (Mid-Latitude US - e.g., 40 BTU/sq ft)"}, {"value": "Mild Cold (Southern US - e.g., 30 BTU/sq ft)", "label": "Mild Cold (Southern US - e.g., 30 BTU/sq ft)"}, {"value": "Very Mild (Extreme South - e.g., 20 BTU/sq ft)", "label": "Very Mild (Extreme South - e.g., 20 BTU/sq ft)"}]),
        CalcField("efficiencyFactor", "Home Efficiency/Insulation Quality", type="select", options=[{"value": "Poor (Old, drafty, poor insulation) - 15% increase", "label": "Poor (Old, drafty, poor insulation) - 15% increase"}, {"value": "Average (Standard 1980s-2000s construction)", "label": "Average (Standard 1980s-2000s construction)"}, {"value": "Excellent (New, well-sealed, high-efficiency windows) - 10% decrease", "label": "Excellent (New, well-sealed, high-efficiency windows) - 10% decrease"}, {"value": "Passive/High-Performance (Extremely well-sealed/insulated) - 20% decrease", "label": "Passive/High-Performance (Extremely well-sealed/insulated) - 20% decrease"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "gravel-aggregate-calculator", "Gravel & Aggregate Calculator (Volume & Weight)", "construction",
    "Gravel & Aggregate Calculator (Volume & Weight)",
    fields=[
        CalcField("areaLength", "Area Length"),
        CalcField("areaWidth", "Area Width"),
        CalcField("depthInches", "Required Depth"),
        CalcField("density", "Material Density"),
        CalcField("wastePercent", "Waste/Spillage Allowance"),
    ],
    fn=_js_calc,
)

register_calculator(
    "gutter-downspout-capacity-calculator", "Gutter Downspout Capacity Calculator", "construction",
    "Gutter Downspout Capacity Calculator",
    fields=[
        CalcField("roofAreaSqFt", "Effective Roof Drainage Area (A)"),
        CalcField("rainfallRate", "Maximum 5-Minute Rainfall Intensity (I)"),
        CalcField("downspoutCapacitySqIn", "Single Downspout Capacity/Area (C)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "insulation-calculator", "Insulation Calculator (Batts & Loose-Fill)", "construction",
    "Insulation Calculator (Batts & Loose-Fill)",
    fields=[
        CalcField("length", "Area Length"),
        CalcField("width", "Area Width"),
        CalcField("subtractArea", "Total Deduction Area"),
        CalcField("wastePercent", "Waste/Cut Allowance"),
        CalcField("insulationType", "Insulation Type", type="select", options=[{"value": "Batt/Roll (Fiberglass, Rockwool)", "label": "Batt/Roll (Fiberglass, Rockwool)"}, {"value": "Loose-Fill (Blown-In)", "label": "Loose-Fill (Blown-In)"}]),
        CalcField("rValue", "R-Value Per Batt"),
        CalcField("battCoverage", "Area Covered by One Batt Package"),
        CalcField("looseRValue", "Target R-Value"),
        CalcField("bagCoverage", "Sq Ft Covered Per Bag (at Target R-Value)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "labor-cost-estimator", "Labor Cost Estimator", "construction",
    "Labor Cost Estimator",
    fields=[
        CalcField("value", "Value"),
    ],
    fn=_js_calc,
)

register_calculator(
    "lighting-lumens-calculator", "Lighting Lumens Calculator", "construction",
    "Lighting Lumens Calculator",
    fields=[
        CalcField("roomLength", "Room Length"),
        CalcField("roomWidth", "Room Width"),
        CalcField("targetFootCandles", "Room Type (Sets Target Foot-Candles)", type="select", options=[{"value": "Low Activity (Hallway, Storage, Garage)", "label": "Low Activity (Hallway, Storage, Garage)"}, {"value": "Ambient (Bedroom, Living Room, Dining Room)", "label": "Ambient (Bedroom, Living Room, Dining Room)"}, {"value": "Task Lighting (Home Office, Bathroom Vanity)", "label": "Task Lighting (Home Office, Bathroom Vanity)"}, {"value": "High Task (Kitchen Counter, Workshop, Laundry)", "label": "High Task (Kitchen Counter, Workshop, Laundry)"}, {"value": "Fine Work (Detailed Workshop, Drafting)", "label": "Fine Work (Detailed Workshop, Drafting)"}]),
        CalcField("adjustmentFactor", "Room Finish & Fixture Efficiency", type="select", options=[{"value": "Excellent (Light colors, new efficient fixtures)", "label": "Excellent (Light colors, new efficient fixtures)"}, {"value": "Average (Mid-tone colors, standard fixtures)", "label": "Average (Mid-tone colors, standard fixtures)"}, {"value": "Poor (Dark colors, dusty/old fixtures)", "label": "Poor (Dark colors, dusty/old fixtures)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "material-waste-percentage-calculator", "Material Waste Percentage Calculator", "construction",
    "Material Waste Percentage Calculator",
    fields=[
        CalcField("materialName", "Material Name (Optional)", type="text"),
        CalcField("unit", "Unit of Measure", type="text"),
        CalcField("purchasedAmount", "Total Material Purchased"),
        CalcField("usedAmount", "Total Material Used/Installed"),
    ],
    fn=_js_calc,
)

register_calculator(
    "mulch-and-soil-calculator", "Mulch and Soil Calculator", "construction",
    "Mulch and Soil Calculator",
    fields=[
        CalcField("length", "Length"),
        CalcField("width", "Width"),
        CalcField("depth", "Depth"),
    ],
    fn=_js_calc,
)

register_calculator(
    "paint-thinner-dilution-calculator", "Paint Thinner Dilution Calculator", "construction",
    "Paint Thinner Dilution Calculator",
    fields=[
        CalcField("paintVolume", "Total Volume of Paint (V_P)"),
        CalcField("volumeUnit", "Volumeunit", type="select", options=[{"value": "Gallons (US)", "label": "Gallons (US)"}, {"value": "Liters", "label": "Liters"}, {"value": "Quarts (US)", "label": "Quarts (US)"}, {"value": "Milliliters", "label": "Milliliters"}, {"value": "Fluid Ounces", "label": "Fluid Ounces"}]),
        CalcField("dilutionRatio", "Desired Thinner-to-Paint Ratio (Percentage)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "paint-volume-calculator", "Paint Volume Calculator", "construction",
    "Paint Volume Calculator",
    fields=[
        CalcField("length", "Length (ft)"),
        CalcField("width", "Width (ft)"),
        CalcField("height", "Height (ft)"),
        CalcField("subtractArea", "Doors/Windows Area (sq ft)"),
        CalcField("coats", "Number of Coats"),
    ],
    fn=_js_calc,
)

register_calculator(
    "paver-sand-and-gravel-base-calculator", "Paver Sand & Gravel Base Calculator", "construction",
    "Paver Sand & Gravel Base Calculator",
    fields=[
        CalcField("areaLength", "Area Length"),
        CalcField("areaWidth", "Area Width"),
        CalcField("gravelDepth", "Gravel/Crushed Stone Base Depth"),
        CalcField("sandDepth", "Bedding Sand Depth"),
    ],
    fn=_js_calc,
)

register_calculator(
    "plumbing-vent-pipe-size-calculator", "Plumbing Vent Pipe Size Calculator", "construction",
    "Plumbing Vent Pipe Size Calculator",
    fields=[
        CalcField("dfu", "Total Drainage Fixture Units (DFU) Served"),
        CalcField("length", "Total Length of Vent Pipe"),
    ],
    fn=_js_calc,
)

register_calculator(
    "post-hole-concrete-calculator", "Post Hole Concrete Calculator", "construction",
    "Post Hole Concrete Calculator",
    fields=[
        CalcField("holeDiameter", "Hole Diameter (D_H)"),
        CalcField("holeDepth", "Hole Depth (L_H)"),
        CalcField("postShape", "Post Shape", type="select", options=[{"value": "Square Post", "label": "Square Post"}, {"value": "Round Post", "label": "Round Post"}]),
        CalcField("postSize", "Post Side (S)"),
        CalcField("quantity", "Number of Posts (Quantity)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "project-timeline-calculator", "Project Timeline Calculator (Critical Path)", "construction",
    "Project Timeline Calculator (Critical Path)",
    fields=[
        CalcField("value", "Value"),
    ],
    fn=_js_calc,
)

register_calculator(
    "rafter-length-calculator", "Rafter Length Calculator (Pythagorean Theorem)", "construction",
    "Rafter Length Calculator (Pythagorean Theorem)",
    fields=[
        CalcField("totalSpan", "Total Roof Span (Horizontal distance from wall plate to wall plate)"),
        CalcField("overhangRun", "Rafter Overhang (Distance past the wall plate)"),
        CalcField("pitchRise", "Roof Pitch Rise (e.g., enter 6 for a 6/12 pitch)"),
        CalcField("wastePercent", "Waste/Cut Allowance"),
    ],
    fn=_js_calc,
)

register_calculator(
    "rail-spindle-spacing-calculator", "Rail Spindle Spacing Calculator", "construction",
    "Rail Spindle Spacing Calculator",
    fields=[
        CalcField("runLengthFeet", "Total Railing Length (Center-to-Center of Posts)"),
        CalcField("postWidth", "Main Post (Newel) Width"),
        CalcField("spindleWidth", "Spindle (Baluster) Width"),
        CalcField("maxGap", "Maximum Allowed Gap (Building Code)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "rebar-material-calculator", "Rebar Material Calculator (Linear Feet & Bars)", "construction",
    "Rebar Material Calculator (Linear Feet & Bars)",
    fields=[
        CalcField("areaLength", "Area Length (Longest Dimension)"),
        CalcField("areaWidth", "Area Width (Shortest Dimension)"),
        CalcField("spacing", "Center-to-Center Spacing (Both Directions)"),
        CalcField("barLength", "Standard Bar Length (To be Purchased)"),
        CalcField("wastePercent", "Waste/Cut Allowance"),
    ],
    fn=_js_calc,
)

register_calculator(
    "retaining-wall-block-calculator", "Retaining Wall Block Calculator", "construction",
    "Retaining Wall Block Calculator",
    fields=[
        CalcField("wallLength", "Total Wall Length"),
        CalcField("wallHeight", "Wall Height (Exposed)"),
        CalcField("blockHeightInches", "Block Height (Visible Face)"),
        CalcField("blockWidthInches", "Block Width (Length of Face)"),
        CalcField("geogridDepth", "Geogrid/Fabric Depth (Length of strip)"),
        CalcField("geogridLayers", "Number of Geogrid/Fabric Layers"),
    ],
    fn=_js_calc,
)

register_calculator(
    "roof-pitch-to-angle-converter", "Roof Pitch to Angle Converter", "construction",
    "Roof Pitch to Angle Converter",
    fields=[
        CalcField("pitchRise", "Pitch Rise (Value of 'A' in A/12)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "roofing-shingle-calculator", "Roofing Shingle Calculator", "construction",
    "Roofing Shingle Calculator",
    fields=[
        CalcField("input-length", "Ridge Length (ft)"),
        CalcField("input-width", "Gable Distance (ft)"),
        CalcField("pitchType", "Low4/12"),
        CalcField("input-pitchRise", "Input Pitchrise"),
        CalcField("input-waste", "Input Waste", type="select", options=[{"value": "5% (Minimal cutting)", "label": "5% (Minimal cutting)"}, {"value": "10% (Standard Gable)", "label": "10% (Standard Gable)"}, {"value": "15% (Hip or Complex)", "label": "15% (Hip or Complex)"}, {"value": "20% (High Valleys/Dormers)", "label": "20% (High Valleys/Dormers)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "shed-base-material-volume-calculator", "Shed Base Material Volume Calculator", "construction",
    "Shed Base Material Volume Calculator",
    fields=[
        CalcField("shedLength", "Shed/Base Length"),
        CalcField("shedWidth", "Shed/Base Width"),
        CalcField("baseDepth", "Desired Material Depth (Thickness)"),
        CalcField("materialType", "Material Type (Affects Compaction)", type="select", options=[{"value": "Compacted Gravel/Crush", "label": "Compacted Gravel/Crush"}, {"value": "Sand (Uncompacted)", "label": "Sand (Uncompacted)"}, {"value": "Concrete Slab", "label": "Concrete Slab"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "slope-and-grade-percentage-calculator", "Slope & Grade Percentage Calculator", "construction",
    "Slope & Grade Percentage Calculator",
    fields=[
        CalcField("rise", "Vertical Rise (Elevation Change)"),
        CalcField("run", "Horizontal Run (Distance Covered)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "solar-panel-system-size-calculator", "Solar Panel System Size Calculator (kW)", "construction",
    "Solar Panel System Size Calculator (kW)",
    fields=[
        CalcField("monthlyKWh", "Average Monthly Electricity Use"),
        CalcField("peakSunHours", "Location's Peak Sun Hours (Daily Average)", type="select", options=[{"value": "Low Sun (e.g., Seattle, New England)", "label": "Low Sun (e.g., Seattle, New England)"}, {"value": "Average Sun (e.g., Midwest, East Coast)", "label": "Average Sun (e.g., Midwest, East Coast)"}, {"value": "High Sun (e.g., Arizona, California, Southwest)", "label": "High Sun (e.g., Arizona, California, Southwest)"}, {"value": "Very High Sun (e.g., Desert Regions)", "label": "Very High Sun (e.g., Desert Regions)"}]),
        CalcField("systemEfficiency", "System De-rating Factor (Losses)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "stair-calculator", "Stair Calculator (Risers, Treads, Stringer Length)", "construction",
    "Stair Calculator (Risers, Treads, Stringer Length)",
    fields=[
        CalcField("totalRiseFeet", "Total Vertical Rise (Floor to Floor)"),
        CalcField("maxRiser", "Max Riser Height (Code)"),
        CalcField("minTread", "Min Tread Depth (Code)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "stucco-volume-and-bag-calculator", "Stucco Volume and Bag Calculator", "construction",
    "Stucco Volume and Bag Calculator",
    fields=[
        CalcField("areaSqFt", "Total Surface Area to be Covered"),
        CalcField("depthInches", "Total Stucco Thickness (Depth)"),
        CalcField("bagWeight", "Bag Size (Typical 80lb or 90lb)"),
        CalcField("bagCoverage", "Coverage per Bag (at your required depth)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "tile-grout-calculator", "Tile Grout Calculator", "construction",
    "Tile Grout Calculator",
    fields=[
        CalcField("areaSqFt", "Total Area to be Tiled"),
        CalcField("tileLength", "Tile Size (Length x Width)"),
        CalcField("tileWidth", "Tilewidth"),
        CalcField("jointWidth", "Grout Joint Width"),
        CalcField("tileThickness", "Tile Thickness/Depth"),
        CalcField("bagWeight", "Weight of One Bag of Grout"),
    ],
    fn=_js_calc,
)

register_calculator(
    "topsoil-and-mulch-volume-calculator", "Topsoil and Mulch Volume Calculator", "construction",
    "Topsoil and Mulch Volume Calculator",
    fields=[
        CalcField("areaLength", "Area Length"),
        CalcField("areaWidth", "Area Width"),
        CalcField("depthInches", "Required Depth"),
        CalcField("density", "Material Density"),
        CalcField("wastePercent", "Waste/Compaction Allowance"),
    ],
    fn=_js_calc,
)

register_calculator(
    "volume-calculator", "Volume Calculator (Cubic Feet & Yards)", "construction",
    "Volume Calculator (Cubic Feet & Yards)",
    fields=[
        CalcField("shape", "Prism"),
        CalcField("length", "Length"),
        CalcField("width", "Width"),
        CalcField("height_prism", "Height Prism"),
        CalcField("radius_cyl", "Radius Cyl"),
        CalcField("height_cyl", "Height Cyl"),
        CalcField("radius_sph", "Radius Sph"),
    ],
    fn=_js_calc,
)

register_calculator(
    "wall-framing-stud-calculator", "Wall Framing Stud Calculator", "construction",
    "Wall Framing Stud Calculator",
    fields=[
        CalcField("wallLength", "Total Wall Length"),
        CalcField("ceilingHeight", "Ceiling/Plate Height"),
        CalcField("studSpacing", "On-Center Stud Spacing"),
        CalcField("doorWidth", "Doorwidth"),
        CalcField("doorQuantity", "Doorquantity"),
        CalcField("windowWidth", "Windowwidth"),
        CalcField("windowQuantity", "Windowquantity"),
    ],
    fn=_js_calc,
)

register_calculator(
    "water-heater-size-calculator", "Water Heater Size Calculator (First Hour Rating)", "construction",
    "Water Heater Size Calculator (First Hour Rating)",
    fields=[
        CalcField("people", "Number of People in Household"),
        CalcField("peakMultiplier", "Peak Usage Style (How many simultaneously?)", type="select", options=[{"value": "Low (Staggered use, few simultaneous activities)", "label": "Low (Staggered use, few simultaneous activities)"}, {"value": "Average (Standard morning/evening routine overlap)", "label": "Average (Standard morning/evening routine overlap)"}, {"value": "High (Multiple bathrooms/appliances used at once)", "label": "High (Multiple bathrooms/appliances used at once)"}]),
        CalcField("shower1", "Shower Head 1 (2.5 GPM)"),
        CalcField("shower2", "Shower Head 2 (2.5 GPM)"),
        CalcField("sinkKitchen", "Kitchen Sink (1.5 GPM)"),
        CalcField("sinkBathroom", "Bathroom Sink (1.0 GPM)"),
        CalcField("washer", "Washing Machine (2.0 GPM)"),
        CalcField("dishwasher", "Dishwasher (1.5 GPM)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "waterproofing-coverage-calculator", "Waterproofing Coverage Calculator", "construction",
    "Waterproofing Coverage Calculator",
    fields=[
        CalcField("areaSqFt", "Total Area to be Waterproofed"),
        CalcField("numCoats", "Number of Recommended Coats"),
        CalcField("coverageRate", "Manufacturer's Coverage Rate (Per Coat)"),
        CalcField("productUnit", "Product Unit Type (Gallons or Pounds)", type="select", options=[{"value": "Gallons (Volume)", "label": "Gallons (Volume)"}, {"value": "Pounds (Weight)", "label": "Pounds (Weight)"}]),
        CalcField("containerSize", "Container Size"),
    ],
    fn=_js_calc,
)

register_calculator(
    "401k-retirement-calculator", "401(k) Retirement Calculator", "business_investment",
    "401(k) Retirement Calculator",
    fields=[
        CalcField("current_balance", "Current 401(k) Balance"),
        CalcField("annual_return", "Expected Annual Return (%)"),
        CalcField("years_to_retirement", "Years Until Retirement"),
        CalcField("annual_salary", "Current Annual Salary"),
        CalcField("employee_rate", "Your Annual Contribution Rate (%)"),
        CalcField("match_pct", "Match Percentage (e.g., 50%)"),
        CalcField("match_limit_pct", "Match Limit (as % of Salary)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "annuity-payout-calculator", "Annuity Payout Calculator", "business_investment",
    "Annuity Payout Calculator",
    fields=[
        CalcField("principal", "Initial Annuity Principal (PV)"),
        CalcField("interest_rate", "Annual Interest Rate (%)"),
        CalcField("term_years", "Payout Term Length (Years)"),
        CalcField("payout_frequency", "Annually"),
        CalcField("payment_timing", "End of Period (**Ordinary Annuity**)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "asset-allocation-calculator", "Asset Allocation & Rebalancing Calculator", "business_investment",
    "Asset Allocation & Rebalancing Calculator",
    fields=[
        CalcField("value", "Value"),
    ],
    fn=_js_calc,
)

register_calculator(
    "beta-coefficient-calculator", "Beta Coefficient Calculator", "business_investment",
    "Beta Coefficient Calculator",
    fields=[
        CalcField("covariance", "Covariance ($\text{Stock}, \text{Market}$)"),
        CalcField("variance", "Variance ($\text{Market}$)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "bond-yield-to-maturity-calculator", "Bond Yield to Maturity (YTM) Calculator", "business_investment",
    "Bond Yield to Maturity (YTM) Calculator",
    fields=[
        CalcField("face_value", "Face Value (Par Value)"),
        CalcField("coupon_rate", "Annual Coupon Rate (%)"),
        CalcField("market_price", "Current Market Price"),
        CalcField("years_to_maturity", "Years to Maturity"),
        CalcField("coupon_frequency", "Annually (1x)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "break-even-analysis-calculator", "Break-Even Analysis Calculator", "business_investment",
    "Break-Even Analysis Calculator",
    fields=[
        CalcField("fixed_costs", "Total Fixed Costs ($)"),
        CalcField("selling_price", "Selling Price per Unit ($)"),
        CalcField("variable_cost", "Variable Cost per Unit ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "burn-rate-and-runway-calculator", "Burn Rate & Runway Calculator", "business_investment",
    "Burn Rate & Runway Calculator",
    fields=[
        CalcField("monthly_expenses", "Total Monthly Operating Expenses (Cash Out)"),
        CalcField("monthly_revenue", "Total Monthly Revenue (Cash In)"),
        CalcField("cash_reserve", "Current Cash Balance / Cash Reserve"),
    ],
    fn=_js_calc,
)

register_calculator(
    "business-loan-calculator", "Business Loan Calculator (Amortization)", "business_investment",
    "Business Loan Calculator (Amortization)",
    fields=[
        CalcField("loan_amount", "Loan Principal ($)"),
        CalcField("annual_rate", "Annual Interest Rate (%)"),
        CalcField("loan_term_years", "Loan Term (Years)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "business-valuation-calculator", "Business Valuation Calculator (Multiples)", "business_investment",
    "Business Valuation Calculator (Multiples)",
    fields=[
        CalcField("metric_type", "Revenue"),
        CalcField("financial_value", "Financial Value"),
        CalcField("valuation_multiple", "Valuation Multiple"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cash-runway-and-net-burn-calculator", "Cash Runway & Net Burn Calculator", "business_investment",
    "Cash Runway & Net Burn Calculator",
    fields=[
        CalcField("cash_reserve", "Current Cash Balance / Cash Reserve"),
        CalcField("monthly_expenses", "Total Monthly Operating Expenses (Cash Out)"),
        CalcField("monthly_revenue", "Total Monthly Revenue (Cash In)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "certificate-of-deposit-calculator", "Certificate of Deposit (CD) Calculator", "business_investment",
    "Certificate of Deposit (CD) Calculator",
    fields=[
        CalcField("principal", "Initial Deposit (Principal)"),
        CalcField("interest_rate", "Annual Interest Rate (%)"),
        CalcField("term_years", "Term Length (Years)"),
        CalcField("compounding_frequency", "Annually"),
    ],
    fn=_js_calc,
)

register_calculator(
    "churn-rate-calculator", "Churn Rate Calculator", "business_investment",
    "Churn Rate Calculator",
    fields=[
        CalcField("start_customers", "Customers at Start of Period"),
        CalcField("lost_customers", "Customers Lost During Period"),
    ],
    fn=_js_calc,
)

register_calculator(
    "compound-annual-growth-rate-calculator", "CAGR (Compound Annual Growth Rate) Calculator", "business_investment",
    "CAGR (Compound Annual Growth Rate) Calculator",
    fields=[
        CalcField("initial_value", "Initial Value ($\mathbf{PV}$)"),
        CalcField("final_value", "Final Value ($\mathbf{FV}$)"),
        CalcField("years", "Number of Years ($\mathbf{n}$)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "compound-interest-calculator", "Advanced Compound Interest Calculator", "business_investment",
    "Advanced Compound Interest Calculator",
    fields=[
        CalcField("principal", "Initial Principal ($)"),
        CalcField("rate", "Annual Interest Rate (%)"),
        CalcField("years", "Time Period (Years)"),
        CalcField("compounding_n", "Compounding Frequency ($n$)", type="select", options=[{"value": "Annually (1)", "label": "Annually (1)"}, {"value": "Semi-annually (2)", "label": "Semi-annually (2)"}, {"value": "Quarterly (4)", "label": "Quarterly (4)"}, {"value": "Monthly (12)", "label": "Monthly (12)"}, {"value": "Daily (365)", "label": "Daily (365)"}]),
        CalcField("contribution", "Regular Contribution (per period) ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "conversion-rate-calculator", "Conversion Rate Calculator", "business_investment",
    "Conversion Rate Calculator",
    fields=[
        CalcField("conversions", "Total Conversions (Goal Achieved)"),
        CalcField("visitors", "Total Visitors or Interactions"),
    ],
    fn=_js_calc,
)

register_calculator(
    "crypto-profit-calculator", "Crypto Profit/Loss Calculator", "business_investment",
    "Crypto Profit/Loss Calculator",
    fields=[
        CalcField("cryptoName", "Cryptocurrency", type="text"),
        CalcField("amount", "Amount (COIN)"),
        CalcField("entryPrice", "Entry Price ($)"),
        CalcField("exitPrice", "Exit Price ($)"),
        CalcField("buyFee", "Buy Fee Rate (%)"),
        CalcField("sellFee", "Sell Fee Rate (%)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "current-ratio-calculator", "Current Ratio Calculator", "business_investment",
    "Current Ratio Calculator",
    fields=[
        CalcField("current_assets", "Total Current Assets"),
        CalcField("current_liabilities", "Total Current Liabilities"),
    ],
    fn=_js_calc,
)

register_calculator(
    "customer-acquisition-cost-calculator", "Customer Acquisition Cost (CAC) Calculator", "business_investment",
    "Customer Acquisition Cost (CAC) Calculator",
    fields=[
        CalcField("total_cost", "Total Sales and Marketing Costs ($)"),
        CalcField("new_customers", "Number of New Customers Acquired"),
    ],
    fn=_js_calc,
)

register_calculator(
    "customer-lifetime-value-calculator", "Customer Lifetime Value (CLV) Calculator", "business_investment",
    "Customer Lifetime Value (CLV) Calculator",
    fields=[
        CalcField("avg_purchase_value", "Average Purchase Value ($)"),
        CalcField("avg_purchase_frequency", "Average Purchase Frequency (Per Year)"),
        CalcField("customer_lifespan", "Average Customer Lifespan (Years)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "days-sales-outstanding-calculator", "Days Sales Outstanding (DSO) Calculator", "business_investment",
    "Days Sales Outstanding (DSO) Calculator",
    fields=[
        CalcField("net_credit_sales", "Net Credit Sales (for the period)"),
        CalcField("average_ar", "Average Accounts Receivable (AR)"),
        CalcField("days_in_period", "Number of Days in the Period"),
    ],
    fn=_js_calc,
)

register_calculator(
    "debt-to-equity-ratio-calculator", "Debt-to-Equity Ratio Calculator", "business_investment",
    "Debt-to-Equity Ratio Calculator",
    fields=[
        CalcField("total_liabilities", "Total Liabilities (Numerator)"),
        CalcField("total_equity", "Total Shareholder Equity (Denominator)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "discount-calculator", "Discount Calculator", "business_investment",
    "Discount Calculator",
    fields=[
        CalcField("original_price", "Original Price ($)"),
        CalcField("discount_percent", "Discount Percentage (%)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "dividend-yield-calculator", "Dividend Yield Calculator", "business_investment",
    "Dividend Yield Calculator",
    fields=[
        CalcField("annual_dividend", "Annual Dividend Per Share ($)"),
        CalcField("current_price", "Current Share Price ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "dollar-cost-averaging-calculator", "Dollar-Cost Averaging (DCA) Calculator", "business_investment",
    "Dollar-Cost Averaging (DCA) Calculator",
    fields=[
        CalcField("investment_amount", "Fixed Investment Amount per Period ($)"),
        CalcField("num_periods", "Number of Investment Periods"),
        CalcField("start_price", "Asset Price at Start of Period 1 ($)"),
        CalcField("end_price", "Asset Price at End of Final Period ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "earnings-per-share-calculator", "Earnings Per Share (EPS) Calculator", "business_investment",
    "Earnings Per Share (EPS) Calculator",
    fields=[
        CalcField("net_income", "Net Income ($)"),
        CalcField("preferred_dividends", "Preferred Dividends ($)"),
        CalcField("shares_outstanding", "Weighted Average Common Shares Outstanding"),
    ],
    fn=_js_calc,
)

register_calculator(
    "ebitda-calculator", "EBITDA Calculator", "business_investment",
    "EBITDA Calculator",
    fields=[
        CalcField("net_income", "Net Income / Profit"),
        CalcField("interest", "Interest Expense (I)"),
        CalcField("taxes", "Taxes (T)"),
        CalcField("depreciation", "Depreciation (D)"),
        CalcField("amortization", "Amortization (A)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "financing-round-dilution-calculator", "Financing Round Dilution Calculator", "business_investment",
    "Financing Round Dilution Calculator",
    fields=[
        CalcField("pre_money_val", "Pre-Money Valuation"),
        CalcField("investment_amount", "New Investment Amount"),
        CalcField("pre_money_shares", "Total Pre-Money Shares Outstanding"),
    ],
    fn=_js_calc,
)

register_calculator(
    "forex-pip-calculator", "Forex Pip and P/L Calculator", "business_investment",
    "Forex Pip and P/L Calculator",
    fields=[
        CalcField("base", "Base Currency", type="text"),
        CalcField("quote", "Quote Currency", type="text"),
        CalcField("account", "Account Currency", type="text"),
        CalcField("lots", "Trade Size (Lots)"),
        CalcField("entry", "Entry Price"),
        CalcField("exit", "Exit Price"),
        CalcField("conversionRate", "Exchange Rate ()"),
    ],
    fn=_js_calc,
)

register_calculator(
    "gross-profit-margin-calculator", "Gross Profit Margin Calculator", "business_investment",
    "Gross Profit Margin Calculator",
    fields=[
        CalcField("revenue", "Net Sales Revenue ($)"),
        CalcField("cogs", "Cost of Goods Sold (COGS) ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "hsa-contribution-calculator", "HSA Contribution Calculator", "business_investment",
    "HSA Contribution Calculator",
    fields=[
        CalcField("age", "2. Your Age"),
        CalcField("months", "3. HDHP Months Eligible", type="select"),
        CalcField("goal", "4. Your Annual Contribution Goal"),
    ],
    fn=_js_calc,
)

register_calculator(
    "internal-rate-of-return-calculator", "Internal Rate of Return (IRR) Calculator", "business_investment",
    "Internal Rate of Return (IRR) Calculator",
    fields=[
        CalcField("initial_investment", "Initial Investment ($) (Year 0 Outflow)"),
        CalcField("hurdle_rate", "Required Rate of Return (Hurdle Rate) (%)"),
        CalcField("num_periods", "Number of Cash Flow Periods (Years)", type="select", options=[{"value": "1 Year", "label": "1 Year"}, {"value": "2 Years", "label": "2 Years"}, {"value": "3 Years", "label": "3 Years"}, {"value": "4 Years", "label": "4 Years"}, {"value": "5 Years", "label": "5 Years"}, {"value": "6 Years", "label": "6 Years"}, {"value": "7 Years", "label": "7 Years"}, {"value": "8 Years", "label": "8 Years"}, {"value": "9 Years", "label": "9 Years"}, {"value": "10 Years", "label": "10 Years"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "inventory-turnover-calculator", "Inventory Turnover Calculator", "business_investment",
    "Inventory Turnover Calculator",
    fields=[
        CalcField("cogs", "Cost of Goods Sold (COGS)"),
        CalcField("beginning_inventory", "Beginning Inventory"),
        CalcField("ending_inventory", "Ending Inventory"),
    ],
    fn=_js_calc,
)

register_calculator(
    "net-present-value-calculator", "Net Present Value (NPV) Calculator", "business_investment",
    "Net Present Value (NPV) Calculator",
    fields=[
        CalcField("initial_investment", "Initial Investment ($) (Year 0 Outflow)"),
        CalcField("discount_rate", "Discount Rate / Required Rate of Return (%)"),
        CalcField("num_periods", "Number of Cash Flow Periods (Years)", type="select", options=[{"value": "1 Year", "label": "1 Year"}, {"value": "2 Years", "label": "2 Years"}, {"value": "3 Years", "label": "3 Years"}, {"value": "4 Years", "label": "4 Years"}, {"value": "5 Years", "label": "5 Years"}, {"value": "6 Years", "label": "6 Years"}, {"value": "7 Years", "label": "7 Years"}, {"value": "8 Years", "label": "8 Years"}, {"value": "9 Years", "label": "9 Years"}, {"value": "10 Years", "label": "10 Years"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "net-profit-margin-calculator", "Net Profit Margin Calculator", "business_investment",
    "Net Profit Margin Calculator",
    fields=[
        CalcField("revenue", "Net Sales Revenue ($)"),
        CalcField("expenses", "Total Expenses (All Costs) ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "payback-period-calculator", "Payback Period Calculator", "business_investment",
    "Payback Period Calculator",
    fields=[
        CalcField("initial_investment", "Initial Investment ($) (Year 0 Outflow)"),
        CalcField("max_payback", "Maximum Acceptable Payback Period (Years)"),
        CalcField("num_periods", "Number of Cash Flow Periods (Years)", type="select", options=[{"value": "1 Year", "label": "1 Year"}, {"value": "2 Years", "label": "2 Years"}, {"value": "3 Years", "label": "3 Years"}, {"value": "4 Years", "label": "4 Years"}, {"value": "5 Years", "label": "5 Years"}, {"value": "6 Years", "label": "6 Years"}, {"value": "7 Years", "label": "7 Years"}, {"value": "8 Years", "label": "8 Years"}, {"value": "9 Years", "label": "9 Years"}, {"value": "10 Years", "label": "10 Years"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "portfolio-rebalancing-calculator", "Portfolio Rebalancing Calculator", "business_investment",
    "Portfolio Rebalancing Calculator",
    fields=[
        CalcField("value", "Value"),
    ],
    fn=_js_calc,
)

register_calculator(
    "price-to-earnings-ratio-calculator", "Price-to-Earnings (P/E) Ratio Calculator", "business_investment",
    "Price-to-Earnings (P/E) Ratio Calculator",
    fields=[
        CalcField("market_price", "Current Market Price per Share ($)"),
        CalcField("eps", "Earnings per Share (EPS) ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "profit-and-loss-calculator", "Option P/L Calculator", "business_investment",
    "Option P/L Calculator",
    fields=[
        CalcField("strike", "Strike Price ($)"),
        CalcField("premium", "Premium Paid/Received ($)"),
        CalcField("finalPrice", "Final Stock Price at Expiration ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "quick-ratio-calculator", "Quick Ratio (Acid-Test) Calculator", "business_investment",
    "Quick Ratio (Acid-Test) Calculator",
    fields=[
        CalcField("current_assets", "Total Current Assets"),
        CalcField("inventory", "Inventory (Minus)"),
        CalcField("prepaid_expenses", "Prepaid Expenses (Minus)"),
        CalcField("current_liabilities", "Total Current Liabilities (Denominator)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "retirement-pension-forecaster", "Retirement Pension Forecaster", "business_investment",
    "Retirement Pension Forecaster",
    fields=[
        CalcField("current_age", "1. Current Age"),
        CalcField("retirement_age", "2. Planned Retirement Age"),
        CalcField("current_pot", "3. Current Pension Savings Value"),
        CalcField("monthly_contribution", "4. Monthly Contribution (You + Employer)"),
        CalcField("annual_growth_rate", "5. Expected Annual Growth Rate"),
        CalcField("annuity_rate", "6. Annuity/Withdrawal Rate (Annual)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "return-on-ad-spend-calculator", "Return on Ad Spend (ROAS) Calculator", "business_investment",
    "Return on Ad Spend (ROAS) Calculator",
    fields=[
        CalcField("revenue", "Revenue Generated from Ads ($)"),
        CalcField("cost", "Total Advertising Cost ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "roi-calculator", "Advanced Return on Investment (ROI) Calculator", "business_investment",
    "Advanced Return on Investment (ROI) Calculator",
    fields=[
        CalcField("initial_investment", "Initial Investment"),
        CalcField("final_value", "Final Value"),
        CalcField("total_costs", "Total Costs"),
        CalcField("holding_years", "Holding Years"),
        CalcField("holding_months", "Holding Months"),
    ],
    fn=_js_calc,
)

register_calculator(
    "roth-ira-cetirement-calculator", "Roth IRA Retirement Calculator", "business_investment",
    "Roth IRA Retirement Calculator",
    fields=[
        CalcField("current_balance", "Current Roth IRA Balance"),
        CalcField("annual_return", "Expected Annual Return (%)"),
        CalcField("years_to_retirement", "Years Until Retirement"),
        CalcField("annual_contribution", "Total Annual Contribution"),
        CalcField("contribution_frequency", "Annually"),
    ],
    fn=_js_calc,
)

register_calculator(
    "sba-loan-calculator", "SBA Loan Calculator (7a Fee & Amortization)", "business_investment",
    "SBA Loan Calculator (7a Fee & Amortization)",
    fields=[
        CalcField("loan_amount", "Loan Principal ($)"),
        CalcField("annual_rate", "Annual Interest Rate (%)"),
        CalcField("loan_term_years", "Loan Term (Years)"),
        CalcField("guarantee_percent", "SBA Guaranteed Percentage (%)"),
        CalcField("fee_rate_percent", "Upfront Guarantee Fee Rate (%)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "sharpe-ratio-calculator", "Sharpe Ratio Calculator", "business_investment",
    "Sharpe Ratio Calculator",
    fields=[
        CalcField("portfolio_return", "Portfolio/Asset Return ($\mathbf{R_a}$)"),
        CalcField("risk_free_rate", "Risk-Free Rate ($\mathbf{R_f}$)"),
        CalcField("standard_deviation", "Standard Deviation ($\mathbf{\sigma_a}$)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "social-security-benefits-calculator", "Social Security Benefits Calculator", "business_investment",
    "Social Security Benefits Calculator",
    fields=[
        CalcField("fra_benefit", "Monthly Benefit at FRA (PIA)"),
        CalcField("claiming_age", "Age You Plan to Start Benefits"),
        CalcField("lifespan_years", "Expected Benefit Payout Years"),
        CalcField("cola_rate", "Expected Annual COLA (%)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "stock-total-return-calculator", "Stock Total Return Calculator (with Dividends)", "business_investment",
    "Stock Total Return Calculator (with Dividends)",
    fields=[
        CalcField("purchase_price", "Initial Purchase Price per Share ($)"),
        CalcField("selling_price", "Final Selling Price per Share or Current Price ($)"),
        CalcField("num_shares", "Number of Shares Purchased"),
        CalcField("total_dividends", "Total Dividends Received ($)"),
        CalcField("investment_years", "Investment Period (Years)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "through-rate-calculator", "Click-Through Rate (CTR) Calculator", "business_investment",
    "Click-Through Rate (CTR) Calculator",
    fields=[
        CalcField("impressions", "Total Impressions (Views)"),
        CalcField("clicks", "Total Clicks"),
    ],
    fn=_js_calc,
)

register_calculator(
    "working-capital-calculator", "Working Capital Calculator", "business_investment",
    "Working Capital Calculator",
    fields=[
        CalcField("current_assets", "Total Current Assets"),
        CalcField("current_liabilities", "Total Current Liabilities"),
    ],
    fn=_js_calc,
)

register_calculator(
    "acceleration-converter", "Acceleration Converter (m/s², ft/s², g)", "conversion",
    "Acceleration Converter (m/s², ft/s², g)",
    fields=[
        CalcField("inputValue", "Acceleration Value to Convert"),
        CalcField("inputUnitSelect", "Input Unit", type="select", options=[{"value": "Meters per Second Squared ($\text{m}/\text{s}^2$)", "label": "Meters per Second Squared ($\text{m}/\text{s}^2$)"}, {"value": "Feet per Second Squared ($\text{ft}/\text{s}^2$)", "label": "Feet per Second Squared ($\text{ft}/\text{s}^2$)"}, {"value": "Standard Gravity ($g$)", "label": "Standard Gravity ($g$)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "angle-converter", "Angle Converter (Degrees to Radians, etc.)", "conversion",
    "Angle Converter (Degrees to Radians, etc.)",
    fields=[
        CalcField("inputMethodSelect", "Input Method", type="select", options=[{"value": "Decimal/Standard Input (e.g., 90, 1.57)", "label": "Decimal/Standard Input (e.g., 90, 1.57)"}, {"value": "Degrees-Minutes-Seconds (DMS) Input", "label": "Degrees-Minutes-Seconds (DMS) Input"}]),
        CalcField("decimalValueInput", "Enter Angle Value"),
        CalcField("unitSelect", "Unitselect", type="select"),
        CalcField("dmsDegrees", "Degrees $\left(^{\circ}\right)$"),
        CalcField("dmsMinutes", "Minutes $\left(\prime\right)$"),
        CalcField("dmsSeconds", "Seconds $\left(\prime\prime\right)$"),
    ],
    fn=_js_calc,
)

register_calculator(
    "area-converter", "Area Converter (Acres, Hectares, Sq M, Sq Ft)", "conversion",
    "Area Converter (Acres, Hectares, Sq M, Sq Ft)",
    fields=[
        CalcField("inputValue", "Inputvalue"),
    ],
    fn=_js_calc,
)

register_calculator(
    "audio-conversion-calculator", "Audio Conversion Calculator (Bitrate & File Size)", "conversion",
    "Audio Conversion Calculator (Bitrate & File Size)",
    fields=[
        CalcField("calculationType", "What do you want to calculate?", type="select", options=[{"value": "File Size (MB)", "label": "File Size (MB)"}, {"value": "Bitrate (kbps)", "label": "Bitrate (kbps)"}, {"value": "Duration (h:m:s)", "label": "Duration (h:m:s)"}]),
        CalcField("bitrateValue", "Bitrate (in kbps - kilobits per second)"),
        CalcField("sizeValue", "File Size (in MB - Megabytes)"),
        CalcField("durationH", "Durationh"),
        CalcField("durationM", "Durationm"),
        CalcField("durationS", "Durations"),
    ],
    fn=_js_calc,
)

register_calculator(
    "blood-sugar-unit-converter", "Blood Sugar Unit Converter (mg/dL to mmol/L)", "conversion",
    "Blood Sugar Unit Converter (mg/dL to mmol/L)",
    fields=[
        CalcField("calculationMode", "Input Unit", type="select", options=[{"value": "Milligrams per Deciliter ($\text{mg/dL}$)", "label": "Milligrams per Deciliter ($\text{mg/dL}$)"}, {"value": "Millimoles per Liter ($\text{mmol/L}$)", "label": "Millimoles per Liter ($\text{mmol/L}$)"}]),
        CalcField("mgdlValue", "Value in $\text{mg/dL}$"),
        CalcField("mmolValue", "Value in $\text{mmol/L}$"),
    ],
    fn=_js_calc,
)

register_calculator(
    "braille-converter", "Braille Converter (English Text)", "conversion",
    "Braille Converter (English Text)",
    fields=[
        CalcField("inputValue", "Enter Text or Braille Characters"),
        CalcField("directionSelect", "Directionselect", type="select", options=[{"value": "English Text $\rightarrow$ Braille", "label": "English Text $\rightarrow$ Braille"}, {"value": "Braille $\rightarrow$ English Text", "label": "Braille $\rightarrow$ English Text"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "catalytic-activity-converter", "Catalytic Activity Converter (Katal to Enzyme Unit)", "conversion",
    "Catalytic Activity Converter (Katal to Enzyme Unit)",
    fields=[
        CalcField("inputValue", "Activity Value to Convert"),
        CalcField("directionSelect", "Conversion Direction", type="select", options=[{"value": "Enzyme Units ($\text{U}$) $\rightarrow$ Katal ($\text{kat}$)", "label": "Enzyme Units ($\text{U}$) $\rightarrow$ Katal ($\text{kat}$)"}, {"value": "Katal ($\text{kat}$) $\rightarrow$ Enzyme Units ($\text{U}$)", "label": "Katal ($\text{kat}$) $\rightarrow$ Enzyme Units ($\text{U}$)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "clothing-size-converter", "Clothing Size Converter (S/M/L, Numeric)", "conversion",
    "Clothing Size Converter (S/M/L, Numeric)",
    fields=[
        CalcField("categorySelect", "Select Garment/Gender Category", type="select", options=[{"value": "Men's Tops (Focus on Chest/Shirt Size)", "label": "Men's Tops (Focus on Chest/Shirt Size)"}, {"value": "Women's Tops (Focus on Bust Size)", "label": "Women's Tops (Focus on Bust Size)"}, {"value": "Men's Bottoms (Focus on Waist Size)", "label": "Men's Bottoms (Focus on Waist Size)"}, {"value": "Women's Bottoms (Focus on Hip Size)", "label": "Women's Bottoms (Focus on Hip Size)"}]),
        CalcField("inputValue", "Enter Size", type="text"),
        CalcField("unitSelect", "Unitselect", type="select"),
    ],
    fn=_js_calc,
)

register_calculator(
    "color-code-converter", "Color Code Converter (HEX, RGB, CMYK)", "conversion",
    "Color Code Converter (HEX, RGB, CMYK)",
    fields=[
        CalcField("hexInput", "Enter HEX Code (e.g., #1abc9c)", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cooking-measurement-converter", "Cooking Measurement Converter (Cups, Spoons, ml)", "conversion",
    "Cooking Measurement Converter (Cups, Spoons, ml)",
    fields=[
        CalcField("inputValue", "Inputvalue"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cryptographic-hash-generator", "Cryptographic Hash Generator", "conversion",
    "Cryptographic Hash Generator",
    fields=[
        CalcField("inputValue", "Enter Text to Hash"),
    ],
    fn=_js_calc,
)

register_calculator(
    "data-storage-converter", "Data Storage Converter (MB, GB, TB, Bytes)", "conversion",
    "Data Storage Converter (MB, GB, TB, Bytes)",
    fields=[
        CalcField("inputValue", "Inputvalue"),
    ],
    fn=_js_calc,
)

register_calculator(
    "density-converter", "Density Converter (kg/m³, g/cm³, lb/ft³)", "conversion",
    "Density Converter (kg/m³, g/cm³, lb/ft³)",
    fields=[
        CalcField("inputValue", "Density Value to Convert"),
        CalcField("inputUnitSelect", "Input Unit", type="select", options=[{"value": "Kilograms per Cubic Meter ($\text{kg}/\text{m}^3$)", "label": "Kilograms per Cubic Meter ($\text{kg}/\text{m}^3$)"}, {"value": "Grams per Cubic Centimeter ($\text{g}/\text{cm}^3$)", "label": "Grams per Cubic Centimeter ($\text{g}/\text{cm}^3$)"}, {"value": "Pounds per Cubic Foot ($\text{lb}/\text{ft}^3$)", "label": "Pounds per Cubic Foot ($\text{lb}/\text{ft}^3$)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "digital-image-resolution-converter", "Digital Image Resolution Converter (DPI to Pixels)", "conversion",
    "Digital Image Resolution Converter (DPI to Pixels)",
    fields=[
        CalcField("widthInput", "Widthinput"),
        CalcField("sizeUnitSelect", "Sizeunitselect", type="select", options=[{"value": "Inches (in)", "label": "Inches (in)"}, {"value": "Centimeters (cm)", "label": "Centimeters (cm)"}]),
        CalcField("heightInput", "Heightinput"),
        CalcField("resolutionInput", "Resolutioninput"),
        CalcField("resolutionUnitSelect", "Resolutionunitselect", type="select", options=[{"value": "DPI (Dots Per Inch)", "label": "DPI (Dots Per Inch)"}, {"value": "DPcm (Dots Per Centimeter)", "label": "DPcm (Dots Per Centimeter)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "earthquake-magnitude-scale-calculator", "Earthquake Magnitude Scale Converter (M to Energy)", "conversion",
    "Earthquake Magnitude Scale Converter (M to Energy)",
    fields=[
        CalcField("calculationMode", "What do you want to calculate?", type="select", options=[{"value": "Energy Released (Joules/TNT) from Magnitude", "label": "Energy Released (Joules/TNT) from Magnitude"}, {"value": "Magnitude ($\mathbf{M}$) from Energy (Joules)", "label": "Magnitude ($\mathbf{M}$) from Energy (Joules)"}, {"value": "Energy Comparison of Two Magnitudes", "label": "Energy Comparison of Two Magnitudes"}]),
        CalcField("magnitudeValue", "Earthquake Magnitude ($\mathbf{M}$)"),
        CalcField("energyValue", "Seismic Energy Released (in Joules)"),
        CalcField("magA", "Maga"),
        CalcField("magB", "Magb"),
    ],
    fn=_js_calc,
)

register_calculator(
    "electric-charge-converter", "Electric Charge Converter (C to Ah)", "conversion",
    "Electric Charge Converter (C to Ah)",
    fields=[
        CalcField("inputValue", "Value to Convert"),
        CalcField("directionSelect", "Conversion Direction", type="select", options=[{"value": "Coulombs (C) → Ampere-Hours (Ah)", "label": "Coulombs (C) → Ampere-Hours (Ah)"}, {"value": "Ampere-Hours (Ah) → Coulombs (C)", "label": "Ampere-Hours (Ah) → Coulombs (C)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "energy-converter", "Energy Converter (Joules, Calories, kWh, BTU)", "conversion",
    "Energy Converter (Joules, Calories, kWh, BTU)",
    fields=[
        CalcField("inputValue", "Inputvalue"),
    ],
    fn=_js_calc,
)

register_calculator(
    "flow-rate-converter", "Flow Rate Converter (GPM, L/s, m³/h)", "conversion",
    "Flow Rate Converter (GPM, L/s, m³/h)",
    fields=[
        CalcField("inputValue", "Value to Convert"),
        CalcField("inputUnitSelect", "Input Unit", type="select", options=[{"value": "Gallons per Minute (GPM)", "label": "Gallons per Minute (GPM)"}, {"value": "Liters per Second (L/s)", "label": "Liters per Second (L/s)"}, {"value": "Cubic Meters per Hour ($\text{m}^3/\text{h}$)", "label": "Cubic Meters per Hour ($\text{m}^3/\text{h}$)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "force-converter", "Force Converter (Newton to Pound-force)", "conversion",
    "Force Converter (Newton to Pound-force)",
    fields=[
        CalcField("inputValue", "Force Value to Convert"),
        CalcField("directionSelect", "Conversion Direction", type="select", options=[{"value": "Newton ($\text{N}$) $\rightarrow$ Pound-force ($\text{lbf}$)", "label": "Newton ($\text{N}$) $\rightarrow$ Pound-force ($\text{lbf}$)"}, {"value": "Pound-force ($\text{lbf}$) $\rightarrow$ Newton ($\text{N}$)", "label": "Pound-force ($\text{lbf}$) $\rightarrow$ Newton ($\text{N}$)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "fuel-consumption-converter", "Fuel Consumption Converter (MPG to L/100km)", "conversion",
    "Fuel Consumption Converter (MPG to L/100km)",
    fields=[
        CalcField("inputValue", "Enter Fuel Consumption Value (e.g., 30 for MPG, or 8 for L/100km)"),
        CalcField("unitSelect", "Unitselect", type="select", options=[{"value": "US MPG", "label": "US MPG"}, {"value": "Imperial MPG", "label": "Imperial MPG"}, {"value": "L/100km", "label": "L/100km"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "hurricane-speed-calculator", "Hurricane Category/Wind Speed Converter (Saffir-Simpson Scale)", "conversion",
    "Hurricane Category/Wind Speed Converter (Saffir-Simpson Scale)",
    fields=[
        CalcField("windSpeedValue", "Wind Speed (Sustained)"),
        CalcField("windSpeedUnit", "Windspeedunit", type="select", options=[{"value": "knots", "label": "knots"}, {"value": "MPH", "label": "MPH"}, {"value": "km/h", "label": "km/h"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "length-converter", "Length Converter (Miles, Km, Feet, Meters, etc.)", "conversion",
    "Length Converter (Miles, Km, Feet, Meters, etc.)",
    fields=[
        CalcField("inputValue", "Inputvalue"),
    ],
    fn=_js_calc,
)

register_calculator(
    "lumber-board-foot-calculator", "Lumber Board Foot Calculator", "conversion",
    "Lumber Board Foot Calculator",
    fields=[
        CalcField("thicknessInput", "Thickness (in)"),
        CalcField("widthInput", "Width (in)"),
        CalcField("lengthInput", "Length (ft)"),
        CalcField("quantityInput", "Quantity"),
        CalcField("pricePerBFInput", "Price Per Board Foot ($)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "luminous-intensity-converter", "Luminous Intensity Converter (Candela to Candlepower)", "conversion",
    "Luminous Intensity Converter (Candela to Candlepower)",
    fields=[
        CalcField("inputValue", "Intensity Value to Convert"),
        CalcField("directionSelect", "Conversion Direction", type="select", options=[{"value": "Candela ($\text{cd}$) $\rightarrow$ Candlepower ($\text{CP}$)", "label": "Candela ($\text{cd}$) $\rightarrow$ Candlepower ($\text{CP}$)"}, {"value": "Candlepower ($\text{CP}$) $\rightarrow$ Candela ($\text{cd}$)", "label": "Candlepower ($\text{CP}$) $\rightarrow$ Candela ($\text{cd}$)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "map-scale-calculator", "Map Scale Calculator (Map Distance, Ground Distance, Scale Factor)", "conversion",
    "Map Scale Calculator (Map Distance, Ground Distance, Scale Factor)",
    fields=[
        CalcField("calculationMode", "What do you want to calculate?", type="select", options=[{"value": "Scale Factor (1:X)", "label": "Scale Factor (1:X)"}, {"value": "Ground Distance", "label": "Ground Distance"}, {"value": "Map Distance", "label": "Map Distance"}]),
        CalcField("mapDistanceValue", "Map Distance"),
        CalcField("mapDistanceUnit", "Mapdistanceunit", type="select", options=[{"value": "mm", "label": "mm"}, {"value": "cm", "label": "cm"}, {"value": "m", "label": "m"}]),
        CalcField("groundDistanceValue", "Ground Distance"),
        CalcField("groundDistanceUnit", "Grounddistanceunit", type="select", options=[{"value": "m", "label": "m"}, {"value": "km", "label": "km"}]),
        CalcField("scaleX", "Scalex"),
        CalcField("scaleY", "Scaley"),
    ],
    fn=_js_calc,
)

register_calculator(
    "metric-prefix-converter", "Metric Prefix Converter (Kilo, Mega, Giga, Tera)", "conversion",
    "Metric Prefix Converter (Kilo, Mega, Giga, Tera)",
    fields=[
        CalcField("inputValue", "Value to Convert"),
        CalcField("inputUnitSelect", "Input Prefix", type="select", options=[{"value": "Tera ($\text{T}$ - $10^{12}$)", "label": "Tera ($\text{T}$ - $10^{12}$)"}, {"value": "Giga ($\text{G}$ - $10^9$)", "label": "Giga ($\text{G}$ - $10^9$)"}, {"value": "Mega ($\text{M}$ - $10^6$)", "label": "Mega ($\text{M}$ - $10^6$)"}, {"value": "Kilo ($\text{k}$ - $10^3$)", "label": "Kilo ($\text{k}$ - $10^3$)"}, {"value": "Base Unit (U - $10^0$)", "label": "Base Unit (U - $10^0$)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "moment-of-inertia-converter", "Moment of Inertia Converter (kg⋅m² to g⋅cm² to lbm⋅ft²)", "conversion",
    "Moment of Inertia Converter (kg⋅m² to g⋅cm² to lbm⋅ft²)",
    fields=[
        CalcField("inputValue", "Moment of Inertia Value to Convert"),
        CalcField("inputUnitSelect", "Input Unit", type="select", options=[{"value": "Kilogram meter squared ($\text{kg}\cdot\text{m}^2$)", "label": "Kilogram meter squared ($\text{kg}\cdot\text{m}^2$)"}, {"value": "Gram centimeter squared ($\text{g}\cdot\text{cm}^2$)", "label": "Gram centimeter squared ($\text{g}\cdot\text{cm}^2$)"}, {"value": "Pound-mass foot squared ($\text{lbm}\cdot\text{ft}^2$)", "label": "Pound-mass foot squared ($\text{lbm}\cdot\text{ft}^2$)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "morse-code-converter", "Morse Code Converter", "conversion",
    "Morse Code Converter",
    fields=[
        CalcField("inputValue", "Enter Text or Morse Code"),
        CalcField("directionSelect", "Directionselect", type="select", options=[{"value": "Text $\rightarrow$ Morse Code", "label": "Text $\rightarrow$ Morse Code"}, {"value": "Morse Code $\rightarrow$ Text", "label": "Morse Code $\rightarrow$ Text"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "number-system-converter", "Number System Converter (Binary, Decimal, Hex)", "conversion",
    "Number System Converter (Binary, Decimal, Hex)",
    fields=[
        CalcField("inputValue", "Enter Value", type="text"),
        CalcField("unitSelect", "Unitselect", type="select", options=[{"value": "Binary (Base 2)", "label": "Binary (Base 2)"}, {"value": "Decimal (Base 10)", "label": "Decimal (Base 10)"}, {"value": "Hexadecimal (Base 16)", "label": "Hexadecimal (Base 16)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "password-generator-calculator", "Password Generator & Strength Calculator", "conversion",
    "Password Generator & Strength Calculator",
    fields=[
        CalcField("passwordLength", "Length: 16 characters"),
        CalcField("includeUppercase", "Includeuppercase"),
        CalcField("includeLowercase", "Includelowercase"),
        CalcField("includeNumbers", "Includenumbers"),
        CalcField("includeSymbols", "Includesymbols"),
        CalcField("customPassword", "Evaluate Custom Password", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "ph-to-hydrogen-ion-concentration-converter", "pH to Hydrogen Ion Concentration Converter", "conversion",
    "pH to Hydrogen Ion Concentration Converter",
    fields=[
        CalcField("calculationMode", "What do you want to calculate?", type="select", options=[{"value": "Concentration ($[\text{H}^+]$) from $\text{pH}$", "label": "Concentration ($[\text{H}^+]$) from $\text{pH}$"}, {"value": "$\text{pH}$ from Concentration ($[\text{H}^+]$)", "label": "$\text{pH}$ from Concentration ($[\text{H}^+]$)"}]),
        CalcField("phValue", "Input $\text{pH}$ Value"),
        CalcField("concentrationValue", "Input Hydrogen Ion Concentration ($[\text{H}^+]$)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "power-converter", "Power Converter (Horsepower, Kilowatts, Watts)", "conversion",
    "Power Converter (Horsepower, Kilowatts, Watts)",
    fields=[
        CalcField("inputValue", "Inputvalue"),
    ],
    fn=_js_calc,
)

register_calculator(
    "pressure-converter", "Pressure Converter (PSI, Bar, Pascal, ATM)", "conversion",
    "Pressure Converter (PSI, Bar, Pascal, ATM)",
    fields=[
        CalcField("inputValue", "Inputvalue"),
    ],
    fn=_js_calc,
)

register_calculator(
    "radiation-dose-converter", "Radiation Dose Converter (Sieverts to Rems)", "conversion",
    "Radiation Dose Converter (Sieverts to Rems)",
    fields=[
        CalcField("inputValue", "Value to Convert"),
        CalcField("directionSelect", "Conversion Direction", type="select", options=[{"value": "Sieverts (Sv) → Rems (Rem)", "label": "Sieverts (Sv) → Rems (Rem)"}, {"value": "Rems (Rem) → Sieverts (Sv)", "label": "Rems (Rem) → Sieverts (Sv)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "radioactivity-converter", "Radioactivity Converter (Becquerel to Curie)", "conversion",
    "Radioactivity Converter (Becquerel to Curie)",
    fields=[
        CalcField("inputValue", "Activity Value to Convert"),
        CalcField("directionSelect", "Conversion Direction", type="select", options=[{"value": "Becquerel ($\text{Bq}$) $\rightarrow$ Curie ($\text{Ci}$)", "label": "Becquerel ($\text{Bq}$) $\rightarrow$ Curie ($\text{Ci}$)"}, {"value": "Curie ($\text{Ci}$) $\rightarrow$ Becquerel ($\text{Bq}$)", "label": "Curie ($\text{Ci}$) $\rightarrow$ Becquerel ($\text{Bq}$)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "ring-size-converter", "Ring Size Converter (US, UK, EU, Japan)", "conversion",
    "Ring Size Converter (US, UK, EU, Japan)",
    fields=[
        CalcField("inputValue", "Enter Ring Size or Diameter (e.g., 7, L, 55, 17.3)", type="text"),
        CalcField("unitSelect", "Unitselect", type="select", options=[{"value": "Internal Diameter (mm)", "label": "Internal Diameter (mm)"}, {"value": "US / Canada (Numeric)", "label": "US / Canada (Numeric)"}, {"value": "UK / Australia (Letter)", "label": "UK / Australia (Letter)"}, {"value": "European (Numeric/Circumference)", "label": "European (Numeric/Circumference)"}, {"value": "Japan / China (Numeric)", "label": "Japan / China (Numeric)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "roman-numeral-converter", "Roman Numeral Converter", "conversion",
    "Roman Numeral Converter",
    fields=[
        CalcField("inputValue", "Enter Number or Roman Numeral", type="text"),
        CalcField("directionSelect", "Directionselect", type="select", options=[{"value": "Decimal $\rightarrow$ Roman", "label": "Decimal $\rightarrow$ Roman"}, {"value": "Roman $\rightarrow$ Decimal", "label": "Roman $\rightarrow$ Decimal"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "screen-aspect-ratio-calculator", "Screen Aspect Ratio Calculator", "conversion",
    "Screen Aspect Ratio Calculator",
    fields=[
        CalcField("calculationMode", "What do you want to calculate?", type="select", options=[{"value": "Aspect Ratio ($\text{X}:\text{Y}$)", "label": "Aspect Ratio ($\text{X}:\text{Y}$)"}, {"value": "Screen Height ($\text{px}$)", "label": "Screen Height ($\text{px}$)"}, {"value": "Screen Width ($\text{px}$)", "label": "Screen Width ($\text{px}$)"}]),
        CalcField("widthValue", "Width ($\text{px}$)"),
        CalcField("heightValue", "Height ($\text{px}$)"),
        CalcField("ratioX", "Ratiox"),
        CalcField("ratioY", "Ratioy"),
    ],
    fn=_js_calc,
)

register_calculator(
    "shoe-size-converter", "Shoe Size Converter (US, UK, EU)", "conversion",
    "Shoe Size Converter (US, UK, EU)",
    fields=[
        CalcField("inputValue", "Inputvalue"),
    ],
    fn=_js_calc,
)

register_calculator(
    "speed-converter", "Speed Converter (KPH, MPH, Knots)", "conversion",
    "Speed Converter (KPH, MPH, Knots)",
    fields=[
        CalcField("inputValue", "Inputvalue"),
    ],
    fn=_js_calc,
)

register_calculator(
    "surface-tension-converter", "Surface Tension Converter (N/m <> dyne/cm)", "conversion",
    "Surface Tension Converter (N/m <> dyne/cm)",
    fields=[
        CalcField("inputValue", "Surface Tension Value to Convert"),
        CalcField("directionSelect", "Conversion Direction", type="select", options=[{"value": "Newton per Meter ($\text{N}/\text{m}$) $\rightarrow$ Dyne per Centimeter ($\text{dyne}/\text{cm}$)", "label": "Newton per Meter ($\text{N}/\text{m}$) $\rightarrow$ Dyne per Centimeter ($\text{dyne}/\text{cm}$)"}, {"value": "Dyne per Centimeter ($\text{dyne}/\text{cm}$) $\rightarrow$ Newton per Meter ($\text{N}/\text{m}$)", "label": "Dyne per Centimeter ($\text{dyne}/\text{cm}$) $\rightarrow$ Newton per Meter ($\text{N}/\text{m}$)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "temperature-converter", "Temperature Converter (Celsius, Fahrenheit, Kelvin)", "conversion",
    "Temperature Converter (Celsius, Fahrenheit, Kelvin)",
    fields=[
        CalcField("inputValue", "Inputvalue"),
    ],
    fn=_js_calc,
)

register_calculator(
    "time-zone-converter", "Time Zone Converter (World Clocks)", "conversion",
    "Time Zone Converter (World Clocks)",
    fields=[
        CalcField("dateTimeInput", "Source Date & Time (Leave blank for NOW)", type="date"),
        CalcField("sourceTimeZone", "Source Time Zone", type="select"),
        CalcField("targetTimeZone", "Target Time Zone", type="select"),
    ],
    fn=_js_calc,
)

register_calculator(
    "torque-converter", "Torque Converter (Newton-Meters to Foot-Pounds)", "conversion",
    "Torque Converter (Newton-Meters to Foot-Pounds)",
    fields=[
        CalcField("inputValue", "Torque Value to Convert"),
        CalcField("directionSelect", "Conversion Direction", type="select", options=[{"value": "Newton-Meters ($\text{N}\cdot\text{m}$) $\rightarrow$ Foot-Pounds ($\text{ft}\cdot\text{lb}$)", "label": "Newton-Meters ($\text{N}\cdot\text{m}$) $\rightarrow$ Foot-Pounds ($\text{ft}\cdot\text{lb}$)"}, {"value": "Foot-Pounds ($\text{ft}\cdot\text{lb}$) $\rightarrow$ Newton-Meters ($\text{N}\cdot\text{m}$)", "label": "Foot-Pounds ($\text{ft}\cdot\text{lb}$) $\rightarrow$ Newton-Meters ($\text{N}\cdot\text{m}$)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "typography-unit-converter", "Typography Unit Converter (pt, px, em)", "conversion",
    "Typography Unit Converter (pt, px, em)",
    fields=[
        CalcField("baseFontSize", "Base Font Size (in Pixels, $\text{px}$)"),
        CalcField("inputValue", "Value to Convert"),
        CalcField("inputUnitSelect", "Input Unit", type="select", options=[{"value": "Pixels ($\text{px}$)", "label": "Pixels ($\text{px}$)"}, {"value": "Points ($\text{pt}$)", "label": "Points ($\text{pt}$)"}, {"value": "Ems ($\text{em}$)", "label": "Ems ($\text{em}$)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "video-file-size-calculator", "Video File Size Calculator (Bitrate & Duration to MB)", "conversion",
    "Video File Size Calculator (Bitrate & Duration to MB)",
    fields=[
        CalcField("videoBitrateValue", "Video Bitrate ($\text{kbps}$)"),
        CalcField("audioBitrateValue", "Audio Bitrate ($\text{kbps}$)"),
        CalcField("durationH", "Durationh"),
        CalcField("durationM", "Durationm"),
        CalcField("durationS", "Durations"),
    ],
    fn=_js_calc,
)

register_calculator(
    "viscosity-converter", "Viscosity Converter (Dynamic & Kinematic)", "conversion",
    "Viscosity Converter (Dynamic & Kinematic)",
    fields=[
        CalcField("inputValue", "Value to Convert"),
        CalcField("inputUnitSelect", "Input Unit (Select the unit of your input)", type="select", options=[{"value": "Pascal-seconds ($\text{Pa} \cdot \text{s}$)", "label": "Pascal-seconds ($\text{Pa} \cdot \text{s}$)"}, {"value": "Centipoise ($\text{cP}$)", "label": "Centipoise ($\text{cP}$)"}, {"value": "Square meters per second ($\text{m}^2/\text{s}$)", "label": "Square meters per second ($\text{m}^2/\text{s}$)"}, {"value": "Centistokes ($\text{cSt}$)", "label": "Centistokes ($\text{cSt}$)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "volume-converter", "Volume Converter (Liters, Gallons, Cups, Milliliters)", "conversion",
    "Volume Converter (Liters, Gallons, Cups, Milliliters)",
    fields=[
        CalcField("inputValue", "Inputvalue"),
    ],
    fn=_js_calc,
)

register_calculator(
    "weight-mass-converter", "Weight & Mass Converter (Pounds, Kg, Ounces, Grams)", "conversion",
    "Weight & Mass Converter (Pounds, Kg, Ounces, Grams)",
    fields=[
        CalcField("inputValue", "Inputvalue"),
    ],
    fn=_js_calc,
)

register_calculator(
    "age-calculator", "🎂 Age Calculator", "date_time",
    "🎂 Age Calculator",
    fields=[
        CalcField("dob-date", "Date of Birth (DOB)", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "age-difference-calculator", "🧮 Age Difference Calculator", "date_time",
    "🧮 Age Difference Calculator",
    fields=[
        CalcField("date-older", "Date 1 (e.g., Older Person's Birthday)", type="date"),
        CalcField("date-newer", "Date 2 (e.g., Younger Person's Birthday)", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "airport-time-zone-finder", "✈️ Airport Time Zone Finder", "date_time",
    "✈️ Airport Time Zone Finder",
    fields=[
        CalcField("iata-code", "IATA Code (e.g., JFK, LHR, DXB)", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "animal-age-calculator", "🐾 Animal Age Converter", "date_time",
    "🐾 Animal Age Converter",
    fields=[
        CalcField("input-age", "Age in Dog Years"),
        CalcField("conversion-type", "Conversion Direction", type="select", options=[{"value": "Dog Years → Human Years", "label": "Dog Years → Human Years"}, {"value": "Human Years → Dog Years", "label": "Human Years → Dog Years"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "anniversary-and-milestone-calculator", "💖 Anniversary & Milestone Calculator", "date_time",
    "💖 Anniversary & Milestone Calculator",
    fields=[
        CalcField("start-date", "Date of Event (e.g., Wedding, Start of Relationship)", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "business-days-calculator", "💼 Business Days Calculator", "date_time",
    "💼 Business Days Calculator",
    fields=[
        CalcField("start-date", "Start Date", type="date"),
        CalcField("end-date", "End Date (Inclusive)", type="date"),
        CalcField("holidays-input", "List of Holiday Dates"),
    ],
    fn=_js_calc,
)

register_calculator(
    "chronological-age-calculator", "🎂 Chronological Age Calculator", "date_time",
    "🎂 Chronological Age Calculator",
    fields=[
        CalcField("dob", "Date of Birth", type="date"),
        CalcField("calc-date", "Date of Calculation", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "copyright-expiration-calculator", "📜 Copyright Expiration Calculator", "date_time",
    "📜 Copyright Expiration Calculator",
    fields=[
        CalcField("death-year", "Year of Author's Death"),
        CalcField("publication-year", "Year of First Publication"),
        CalcField("creation-year", "Year of Creation"),
        CalcField("work-type", "Type of Copyrighted Work", type="select", options=[{"value": "Individual Author (Life + 70 Years)", "label": "Individual Author (Life + 70 Years)"}, {"value": "Corporate / Anonymous (Shorter of 95/120 Years)", "label": "Corporate / Anonymous (Shorter of 95/120 Years)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "countdown-to-specific-event", "📅 Countdown to Specific Event", "date_time",
    "📅 Countdown to Specific Event",
    fields=[
        CalcField("event-name", "Event Name", type="text"),
        CalcField("target-date", "Target Date", type="date"),
        CalcField("target-time", "Target Time (Local Time)", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "court-filing-deadline-calculator", "⚖️ Court Filing Deadline Calculator", "date_time",
    "⚖️ Court Filing Deadline Calculator",
    fields=[
        CalcField("trigger-date", "Trigger Date (e.g., Date of Service)", type="date"),
        CalcField("rule-days", "Rule Days (Business Days After)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "credit-card-payment-due-date-calculator", "💳 Credit Card Payment Due Date Calculator", "date_time",
    "💳 Credit Card Payment Due Date Calculator",
    fields=[
        CalcField("closing-date", "Statement Closing Date", type="date"),
        CalcField("grace-period", "Grace Period (Days)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "custom-countdown-timer", "⏱️ Custom Countdown Timer", "date_time",
    "⏱️ Custom Countdown Timer",
    fields=[
        CalcField("target-date", "Target Date", type="date"),
        CalcField("target-time", "Target Time (Local)", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "date-addition-and-subtraction-calculator", "🗓️ Date Addition/Subtraction Calculator", "date_time",
    "🗓️ Date Addition/Subtraction Calculator",
    fields=[
        CalcField("start-date", "Starting Date", type="date"),
        CalcField("operation", "Add"),
        CalcField("value-input", "Value Input"),
        CalcField("unit-select", "Unit Select", type="select", options=[{"value": "Days", "label": "Days"}, {"value": "Weeks", "label": "Weeks"}, {"value": "Months", "label": "Months"}, {"value": "Years", "label": "Years"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "date-difference-calculator", "📅 Date Difference Calculator", "date_time",
    "📅 Date Difference Calculator",
    fields=[
        CalcField("start-date", "Start Date", type="date"),
        CalcField("end-date", "End Date", type="date"),
        CalcField("include-end-date", "Include the End Date in the count (Add 1 Day)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "day-of-the-week-calculator", "📅 Day of the Week Calculator", "date_time",
    "📅 Day of the Week Calculator",
    fields=[
        CalcField("target-date", "Date to Check", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "day-of-year-calculator", "📅 Day of Year (Ordinal Date) Calculator", "date_time",
    "📅 Day of Year (Ordinal Date) Calculator",
    fields=[
        CalcField("target-date", "Calendar Date", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "digital-stopwatch", "⏱️ Digital Stopwatch", "date_time",
    "⏱️ Digital Stopwatch",
    fields=[
        CalcField("value", "Value"),
    ],
    fn=_js_calc,
)

register_calculator(
    "floating-holiday-date-calculator", "🗓️ Holiday Date Calculator", "date_time",
    "🗓️ Holiday Date Calculator",
    fields=[
        CalcField("target-year", "Year of Calculation"),
        CalcField("holiday-name", "Holiday", type="select", options=[{"value": "Easter Sunday (Floating)", "label": "Easter Sunday (Floating)"}, {"value": "US Thanksgiving (4th Thursday in Nov)", "label": "US Thanksgiving (4th Thursday in Nov)"}, {"value": "US Memorial Day (Last Monday in May)", "label": "US Memorial Day (Last Monday in May)"}, {"value": "US Labor Day (1st Monday in Sep)", "label": "US Labor Day (1st Monday in Sep)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "galactic-time-converter", "🚀 Galactic Time Converter", "date_time",
    "🚀 Galactic Time Converter",
    fields=[
        CalcField("earth-days", "Earth Days"),
        CalcField("earth-hours", "Earth Hours"),
        CalcField("earth-minutes", "Earth Minutes"),
        CalcField("earth-seconds", "Earth Seconds"),
    ],
    fn=_js_calc,
)

register_calculator(
    "half-and-double-time-calculator", "💵 Overtime Pay Calculator", "date_time",
    "💵 Overtime Pay Calculator",
    fields=[
        CalcField("regular-rate", "Regular Hourly Rate ($)"),
        CalcField("time-and-a-half-hours", "Time & a Half Hours (1.5x)"),
        CalcField("double-time-hours", "Double Time Hours (2.0x)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "half-birthday-calculator", "🎂 'Half-Birthday' Calculator", "date_time",
    "🎂 'Half-Birthday' Calculator",
    fields=[
        CalcField("birthday-date", "Birthday Date (Month and Day)", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "historical-period-duration-calculator", "🏛️ Historical Period Duration Calculator", "date_time",
    "🏛️ Historical Period Duration Calculator",
    fields=[
        CalcField("start-year", "Start Year (e.g., 44)"),
        CalcField("end-year", "End Year (e.g., 476)"),
        CalcField("start-era", "Era", type="select", options=[{"value": "BCE (Before Common Era)", "label": "BCE (Before Common Era)"}, {"value": "CE (Common Era)", "label": "CE (Common Era)"}]),
        CalcField("end-era", "Era", type="select", options=[{"value": "CE (Common Era)", "label": "CE (Common Era)"}, {"value": "BCE (Before Common Era)", "label": "BCE (Before Common Era)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "interest-accrual-date-calculator", "💰 Interest Accrual Date Calculator", "date_time",
    "💰 Interest Accrual Date Calculator",
    fields=[
        CalcField("last-accrual-date", "Last Interest Calculation Date", type="date"),
        CalcField("custom-days", "Custom Accrual Period (Days)"),
        CalcField("compounding-frequency", "Compounding/Accrual Frequency", type="select", options=[{"value": "Daily", "label": "Daily"}, {"value": "Weekly (7 Days)", "label": "Weekly (7 Days)"}, {"value": "Bi-Weekly (14 Days)", "label": "Bi-Weekly (14 Days)"}, {"value": "Monthly (Approx. 30 Days)", "label": "Monthly (Approx. 30 Days)"}, {"value": "Quarterly (Approx. 90 Days)", "label": "Quarterly (Approx. 90 Days)"}, {"value": "Semi-Annually (Approx. 180 Days)", "label": "Semi-Annually (Approx. 180 Days)"}, {"value": "Annually (Approx. 365 Days)", "label": "Annually (Approx. 365 Days)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "international-phone-call-time-planner", "📞 International Phone Call Time Planner", "date_time",
    "📞 International Phone Call Time Planner",
    fields=[
        CalcField("origin-time", "Call Start Time (In Your Time Zone)", type="date"),
        CalcField("origin-timezone", "Your Time Zone", type="select"),
        CalcField("destination-timezone", "Destination Time Zone", type="select"),
    ],
    fn=_js_calc,
)

register_calculator(
    "lease-end-date-calculator", "🗓️ Lease End Date Calculator", "date_time",
    "🗓️ Lease End Date Calculator",
    fields=[
        CalcField("start-date", "Lease Start Date", type="date"),
        CalcField("lease-months", "Lease Term (Months)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "moon-phase-calendar-calculator", "🌕 Moon Phase Calendar Calculator", "date_time",
    "🌕 Moon Phase Calendar Calculator",
    fields=[
        CalcField("target-date", "Date to Calculate Moon Phase", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "overtime-hours-pay-calculator", "🕰️ Overtime Hours & Pay Calculator", "date_time",
    "🕰️ Overtime Hours & Pay Calculator",
    fields=[
        CalcField("weekly-threshold", "Weekly OT Threshold (Hours)"),
        CalcField("regular-wage", "Regular Hourly Wage ($)"),
        CalcField("overtime-rate-multiplier", "OT Rate Multiplier (e.g., 1.5 for Time-and-a-Half)"),
        CalcField("form-control-sm", "Form Control Sm", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "pay-period-date-calculator", "💸 Pay Period Calculator", "date_time",
    "💸 Pay Period Calculator",
    fields=[
        CalcField("last-pay-date", "Date of Last Payment Received", type="date"),
        CalcField("pay-frequency", "Select Pay Frequency", type="select", options=[{"value": "Weekly (Every 7 days)", "label": "Weekly (Every 7 days)"}, {"value": "Bi-Weekly (Every 14 days)", "label": "Bi-Weekly (Every 14 days)"}, {"value": "Semi-Monthly (Twice a month - 1st & 15th)", "label": "Semi-Monthly (Twice a month - 1st & 15th)"}, {"value": "Monthly (Same day each month)", "label": "Monthly (Same day each month)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "pregnancy-week-calculator", "🤰 Pregnancy Week Calculator", "date_time",
    "🤰 Pregnancy Week Calculator",
    fields=[
        CalcField("lmp-date", "Date of Last Menstrual Period (LMP)", type="date"),
        CalcField("current-date", "Date of Calculation (Today)", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "project-deadline-calculator", "📅 Project Deadline Calculator", "date_time",
    "📅 Project Deadline Calculator",
    fields=[
        CalcField("start-date", "Project Start Date", type="date"),
        CalcField("duration-value", "Required Business Days (e.g., 20 days for a one-month project)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "retirement-date-calculator", "🏖️ Retirement Date Calculator", "date_time",
    "🏖️ Retirement Date Calculator",
    fields=[
        CalcField("current-age", "Current Age (Years)"),
        CalcField("target-age", "Target Retirement Age (Years)"),
        CalcField("current-date", "Date of Calculation (Today)", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "seasons-start-end-calculator", "🌎 Seasons Start/End Calculator", "date_time",
    "🌎 Seasons Start/End Calculator",
    fields=[
        CalcField("target-year", "Year to Calculate"),
        CalcField("hemisphere", "Hemisphere", type="select", options=[{"value": "Northern Hemisphere", "label": "Northern Hemisphere"}, {"value": "Southern Hemisphere", "label": "Southern Hemisphere"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "seconds-to-time-converter", "⏳ Seconds to Time Converter", "date_time",
    "⏳ Seconds to Time Converter",
    fields=[
        CalcField("total-seconds", "Total Seconds to Convert"),
    ],
    fn=_js_calc,
)

register_calculator(
    "semester-quarter-end-date-calculator", "📅 Academic Term End Date Calculator", "date_time",
    "📅 Academic Term End Date Calculator",
    fields=[
        CalcField("start-date", "Course or Term Start Date", type="date"),
        CalcField("duration-value", "Duration Value (e.g., 15 for a 15-week semester)"),
        CalcField("duration-type", "Unit", type="select", options=[{"value": "Weeks", "label": "Weeks"}, {"value": "Days", "label": "Days"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "shipping-delivery-date-estimator", "🚚 Shipping Delivery Date Estimator", "date_time",
    "🚚 Shipping Delivery Date Estimator",
    fields=[
        CalcField("shipping-date", "Date Shipped/Ordered", type="date"),
        CalcField("shipping-speed", "Shipping Speed", type="select", options=[{"value": "Express (2 Business Days)", "label": "Express (2 Business Days)"}, {"value": "Standard (5 Business Days)", "label": "Standard (5 Business Days)"}, {"value": "Economy (10 Business Days)", "label": "Economy (10 Business Days)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "statute-of-limitations-calculator", "⚖️ Statute of Limitations Calculator", "date_time",
    "⚖️ Statute of Limitations Calculator",
    fields=[
        CalcField("discovery-date", "Date of Discovery/Accrual", type="date"),
        CalcField("sol-duration", "Duration"),
        CalcField("sol-unit", "Unit", type="select", options=[{"value": "Years", "label": "Years"}, {"value": "Months", "label": "Months"}, {"value": "Days", "label": "Days"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "subscription-renewal-date-calculator", "📅 Subscription Renewal Date Calculator", "date_time",
    "📅 Subscription Renewal Date Calculator",
    fields=[
        CalcField("start-date", "Subscription Start/Last Renewal Date", type="date"),
        CalcField("cycles-to-project", "Cycles to Project Ahead"),
        CalcField("renewal-frequency", "Billing Cycle / Frequency", type="select", options=[{"value": "Monthly", "label": "Monthly"}, {"value": "Quarterly (3 Months)", "label": "Quarterly (3 Months)"}, {"value": "Semi-Annually (6 Months)", "label": "Semi-Annually (6 Months)"}, {"value": "Annually (12 Months)", "label": "Annually (12 Months)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "sunrise-sunset-calculator", "🌅 Sunrise & Sunset Calculator", "date_time",
    "🌅 Sunrise & Sunset Calculator",
    fields=[
        CalcField("target-date", "Date to Calculate", type="date"),
        CalcField("timezone-offset", "Timezone Offset (Hours from UTC)"),
        CalcField("latitude", "Latitude ($\phi$)"),
        CalcField("longitude", "Longitude ($\lambda$)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "tax-filing-deadline-calculator", "🏛️ Tax Filing Deadline Calculator (US Federal)", "date_time",
    "🏛️ Tax Filing Deadline Calculator (US Federal)",
    fields=[
        CalcField("target-year", "Tax Year (Filing in the following year)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "time-duration-calculator", "⏰ Time Duration Calculator", "date_time",
    "⏰ Time Duration Calculator",
    fields=[
        CalcField("start-date", "Date", type="date"),
        CalcField("start-time", "Time (24-Hour)", type="date"),
        CalcField("end-date", "Date", type="date"),
        CalcField("end-time", "Time (24-Hour)", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "time-until-solar-eclipse-meteor-shower", "🔭 Time Until Astronomical Event Countdown", "date_time",
    "🔭 Time Until Astronomical Event Countdown",
    fields=[
        CalcField("target-date", "Target Date (Local Time)", type="date"),
        CalcField("target-time", "Peak/Start Time (Local Time)", type="date"),
        CalcField("event-type", "Type of Event", type="select", options=[{"value": "Solar Eclipse 🌑", "label": "Solar Eclipse 🌑"}, {"value": "Lunar Eclipse 🌕", "label": "Lunar Eclipse 🌕"}, {"value": "Meteor Shower ✨", "label": "Meteor Shower ✨"}, {"value": "Comet Flyby ☄️", "label": "Comet Flyby ☄️"}, {"value": "Other Celestial Event", "label": "Other Celestial Event"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "vacation-day-accrual-calculator", "🏝️ Vacation Day Accrual Calculator", "date_time",
    "🏝️ Vacation Day Accrual Calculator",
    fields=[
        CalcField("starting-balance", "Starting Balance (Hours)"),
        CalcField("periods-passed", "Periods Passed Since Balance Check"),
        CalcField("accrual-rate", "Accrual Rate (Hours per Period)"),
        CalcField("future-periods", "Project Ahead (Periods)"),
        CalcField("pay-frequency", "Pay Period Frequency", type="select", options=[{"value": "Bi-Weekly (26 Periods/Year)", "label": "Bi-Weekly (26 Periods/Year)"}, {"value": "Monthly (12 Periods/Year)", "label": "Monthly (12 Periods/Year)"}, {"value": "Semi-Monthly (24 Periods/Year)", "label": "Semi-Monthly (24 Periods/Year)"}, {"value": "Weekly (52 Periods/Year)", "label": "Weekly (52 Periods/Year)"}, {"value": "Annual (1 Period/Year)", "label": "Annual (1 Period/Year)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "warranty-expiry-date-calculator", "🛡️ Warranty Expiry Date Calculator", "date_time",
    "🛡️ Warranty Expiry Date Calculator",
    fields=[
        CalcField("purchase-date", "Date of Purchase/Warranty Start", type="date"),
        CalcField("term-value", "Duration"),
        CalcField("term-unit", "Unit", type="select", options=[{"value": "Years", "label": "Years"}, {"value": "Months", "label": "Months"}, {"value": "Days", "label": "Days"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "week-number-calculator", "🗓️ ISO Week Number Calculator", "date_time",
    "🗓️ ISO Week Number Calculator",
    fields=[
        CalcField("target-date", "Calendar Date", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "weekly-timesheet-pay-calculator", "📈 Weekly Timesheet Calculator", "date_time",
    "📈 Weekly Timesheet Calculator",
    fields=[
        CalcField("hourly-wage", "Hourly Wage ($)"),
        CalcField("form-control-sm", "Form Control Sm", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "work-hours-net-pay-calculator", "🕥 Work Hours Calculator", "date_time",
    "🕥 Work Hours Calculator",
    fields=[
        CalcField("start-time", "Shift Start Time", type="date"),
        CalcField("end-time", "Shift End Time", type="date"),
        CalcField("break-minutes", "Total Break Duration (in Minutes)"),
        CalcField("hourly-wage", "Hourly Wage (Optional)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "workday-time-calculator", "⏱️ Workday Start/End Time Calculator", "date_time",
    "⏱️ Workday Start/End Time Calculator",
    fields=[
        CalcField("start-time", "Shift Start Time", type="date"),
        CalcField("scheduled-hours", "Total Scheduled Hours (e.g., 8)"),
        CalcField("break-minutes", "Total Unpaid Break Duration (Minutes)"),
    ],
    fn=_js_calc,
)

register_calculator(
    "world-clock-meeting-planner", "🤝 World Clock Meeting Planner", "date_time",
    "🤝 World Clock Meeting Planner",
    fields=[
        CalcField("base-date", "Base Date for Calculation (Affects DST)", type="date"),
        CalcField("timezone-select", "Add a Time Zone", type="select"),
    ],
    fn=_js_calc,
)

register_calculator(
    "academic-paper-formatting-checker", "✍️ Paper Length Estimator", "education",
    "✍️ Paper Length Estimator",
    fields=[
        CalcField("word-count", "Total Word Count"),
        CalcField("font-size", "Font Size", type="select", options=[{"value": "10pt (Compact)", "label": "10pt (Compact)"}, {"value": "11pt (Modern)", "label": "11pt (Modern)"}, {"value": "12pt (Standard)", "label": "12pt (Standard)"}, {"value": "14pt (Large)", "label": "14pt (Large)"}]),
        CalcField("line-spacing", "Line Spacing", type="select", options=[{"value": "Single Spaced", "label": "Single Spaced"}, {"value": "Double Spaced (Standard)", "label": "Double Spaced (Standard)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "academic-probation-risk-calculator", "Probation Risk Calculator", "education",
    "Probation Risk Calculator",
    fields=[
        CalcField("current-gpa", "Current Gpa"),
        CalcField("current-credits", "Current Credits"),
        CalcField("form-control-sm", "Form Control Sm", type="text"),
        CalcField("form-select-sm", "Form Select Sm", type="select", options=[{"value": "${g}", "label": "${g}"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "act-to-sat-score-converter", "🔄 ACT ↔ SAT Score Converter", "education",
    "🔄 ACT ↔ SAT Score Converter",
    fields=[
        CalcField("sat-math", "Sat Math"),
        CalcField("sat-ebrw", "Sat Ebrw"),
        CalcField("act-composite", "Act Composite"),
    ],
    fn=_js_calc,
)

register_calculator(
    "citation-generator", "📚 Academic Citation Generator", "education",
    "📚 Academic Citation Generator",
    fields=[
        CalcField("${f.id}", "${F.Id}"),
        CalcField("citation_style", "Citation Style", type="select", options=[{"value": "APA (7th Ed.)", "label": "APA (7th Ed.)"}, {"value": "MLA (9th Ed.)", "label": "MLA (9th Ed.)"}]),
        CalcField("source_type", "Source Type", type="select", options=[{"value": "Website / Article", "label": "Website / Article"}, {"value": "Book / Textbook", "label": "Book / Textbook"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "class-curve-grade-calculator", "Class Curve Grade Calculator", "education",
    "Class Curve Grade Calculator",
    fields=[
        CalcField("param-points", "Param Points"),
        CalcField("param-percent", "Param Percent"),
        CalcField("param-target-mean", "Param Target Mean"),
        CalcField("param-target-stdev", "Param Target Stdev"),
        CalcField("curve-method", "Curve Method", type="select", options=[{"value": "Raw Scores (No Curve)", "label": "Raw Scores (No Curve)"}, {"value": "Fixed Points Adjustment", "label": "Fixed Points Adjustment"}, {"value": "Percentage Scaling", "label": "Percentage Scaling"}, {"value": "Highest Score = 100%", "label": "Highest Score = 100%"}, {"value": "Normal Distribution (Z-Score)", "label": "Normal Distribution (Z-Score)"}]),
        CalcField("raw-scores", "Raw Student Scores"),
    ],
    fn=_js_calc,
)

register_calculator(
    "class-schedule-conflict-checker", "🗓️ Class Schedule Conflict Checker", "education",
    "🗓️ Class Schedule Conflict Checker",
    fields=[
        CalcField("day-${day}-${rowId}", "${day}"),
        CalcField("course-name", "Course Name", type="text"),
        CalcField("start-time", "Start Time", type="date"),
        CalcField("end-time", "End Time", type="date"),
        CalcField("day--", "Day"),
    ],
    fn=_js_calc,
)

register_calculator(
    "college-gpa-calculator", "🎓 College GPA Calculator", "education",
    "🎓 College GPA Calculator",
    fields=[
        CalcField("prev_gpa", "Prev Gpa"),
        CalcField("prev_credits", "Prev Credits"),
        CalcField("course-credits", "Course Credits"),
        CalcField("course-grade", "Course Grade", type="select", options=[{"value": "${g}", "label": "${g}"}, {"value": "Pass (P)", "label": "Pass (P)"}, {"value": "No Pass (NP)", "label": "No Pass (NP)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "college-savings-plan-calculator", "🏦 529 College Savings Plan Calculator", "education",
    "🏦 529 College Savings Plan Calculator",
    fields=[
        CalcField("initial_deposit", "Initial Deposit"),
        CalcField("monthly_contribution", "Monthly Contribution"),
        CalcField("years_until_enrollment", "Years Until Enrollment"),
        CalcField("rate_of_return", "Rate Of Return"),
        CalcField("inflation_rate", "Inflation Rate"),
        CalcField("current_annual_cost", "Current Annual Cost"),
        CalcField("college_duration", "College Duration", type="select", options=[{"value": "2 Years (Associate)", "label": "2 Years (Associate)"}, {"value": "4 Years (Bachelor)", "label": "4 Years (Bachelor)"}, {"value": "6 Years (Graduate)", "label": "6 Years (Graduate)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "course-load-difficulty-calculator", "🧠 Course Load Difficulty Calculator", "education",
    "🧠 Course Load Difficulty Calculator",
    fields=[
        CalcField("input-credits", "Input Credits"),
        CalcField("form-range", "Form Range"),
    ],
    fn=_js_calc,
)

register_calculator(
    "dorm-room-size-usable-area-calculator", "📏 Dorm Room Usable Space Calculator", "education",
    "📏 Dorm Room Usable Space Calculator",
    fields=[
        CalcField("room-width", "Room Width"),
        CalcField("room-length", "Room Length"),
        CalcField("input-obstacle-width", "Input Obstacle Width"),
        CalcField("input-obstacle-length", "Input Obstacle Length"),
    ],
    fn=_js_calc,
)

register_calculator(
    "double-major-minor-time-calculator", "Academic Time Projector", "education",
    "Academic Time Projector",
    fields=[
        CalcField("credits-completed", "Credits Completed"),
        CalcField("credits-primary-total", "Credits Primary Total"),
        CalcField("credits-per-semester", "Credits Per Semester"),
        CalcField("credits-secondary-total", "Credits Secondary Total"),
        CalcField("credits-overlap", "Credits Overlap"),
    ],
    fn=_js_calc,
)

register_calculator(
    "essay-outline-generator", "Academic Essay Outline Generator", "education",
    "Academic Essay Outline Generator",
    fields=[
        CalcField("num-paragraphs", "Num Paragraphs"),
        CalcField("evidence-points", "Evidence Points"),
        CalcField("thesis-statement", "Thesis Statement"),
    ],
    fn=_js_calc,
)

register_calculator(
    "final-grade-calculator", "🎯 Final Grade Target Calculator", "education",
    "🎯 Final Grade Target Calculator",
    fields=[
        CalcField("final_weight", "Final Weight"),
        CalcField("target_grade", "Target Grade"),
        CalcField("assignment-score", "Assignment Score"),
        CalcField("assignment-weight", "Assignment Weight"),
    ],
    fn=_js_calc,
)

register_calculator(
    "gpa-calculator", "📊 Advanced Cumulative GPA Calculator", "education",
    "📊 Advanced Cumulative GPA Calculator",
    fields=[
        CalcField("prior_gpa", "Prior Gpa"),
        CalcField("prior_credits", "Prior Credits"),
        CalcField("course-name", "Course Name", type="text"),
        CalcField("course-credits", "Course Credits", type="select", options=[{"value": "${c} cr", "label": "${c} cr"}]),
        CalcField("course-grade", "Course Grade", type="select", options=[{"value": "${g}", "label": "${g}"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "graduation-timeline-planner", "🗓️ Graduation Timeline Planner", "education",
    "🗓️ Graduation Timeline Planner",
    fields=[
        CalcField("required-credits", "Required Credits"),
        CalcField("completed-credits", "Completed Credits"),
        CalcField("current-semester-year", "Current Semester Year"),
        CalcField("credits-per-semester", "Credits Per Semester"),
        CalcField("current-semester-name", "Current Semester Name", type="select", options=[{"value": "Fall", "label": "Fall"}, {"value": "Spring", "label": "Spring"}, {"value": "Summer", "label": "Summer"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "group-project-contribution-tracker", "Project Contribution Tracker", "education",
    "Project Contribution Tracker",
    fields=[
        CalcField("text-center", "Text Center"),
        CalcField("project-name-input", "Project Name Input", type="text"),
        CalcField("total-estimated-hours-input", "Total Estimated Hours Input"),
    ],
    fn=_js_calc,
)

register_calculator(
    "high-school-gpa-calculator", "🏫 High School GPA Calculator", "education",
    "🏫 High School GPA Calculator",
    fields=[
        CalcField("course-credits", "Course Credits"),
        CalcField("course-grade", "Course Grade", type="select", options=[{"value": "${g}", "label": "${g}"}]),
        CalcField("course-level", "Course Level", type="select", options=[{"value": "${l}", "label": "${l}"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "internship-stipend-budget-calculator", "💵 Internship Stipend Budget Planner", "education",
    "💵 Internship Stipend Budget Planner",
    fields=[
        CalcField("total-stipend", "Total Stipend"),
        CalcField("internship-weeks", "Internship Weeks"),
        CalcField("housing-cost", "Housing Cost"),
        CalcField("food-cost", "Food Cost"),
        CalcField("transport-cost", "Transport Cost"),
        CalcField("other-cost", "Other Cost"),
    ],
    fn=_js_calc,
)

register_calculator(
    "language-learning-fluency-timeline", "Fluency Timeline Planner", "education",
    "Fluency Timeline Planner",
    fields=[
        CalcField("weekly-hours", "Weekly Hours"),
        CalcField("language-difficulty", "Language Difficulty", type="select", options=[{"value": "Category I: Romance/Germanic (600h)", "label": "Category I: Romance/Germanic (600h)"}, {"value": "Category II: German (750h)", "label": "Category II: German (750h)"}, {"value": "Category III: Slavic/African (900h)", "label": "Category III: Slavic/African (900h)"}, {"value": "Category IV: Uralic/Estonian (1100h)", "label": "Category IV: Uralic/Estonian (1100h)"}, {"value": "Category V: Arabic/East Asian (2200h)", "label": "Category V: Arabic/East Asian (2200h)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "lecture-video-watch-time-calculator", "Watch Time Calculator", "education",
    "Watch Time Calculator",
    fields=[
        CalcField("video-durations", "Video Durations"),
    ],
    fn=_js_calc,
)

register_calculator(
    "lms-grade-calculator", "LMS Grade Calculator", "education",
    "LMS Grade Calculator",
    fields=[
        CalcField("target-grade", "Target Grade"),
        CalcField("fw-bold", "Fw Bold", type="text"),
        CalcField("form-control-sm", "Form Control Sm", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "major-change-impact-calculator", "Major Change Impact Calculator", "education",
    "Major Change Impact Calculator",
    fields=[
        CalcField("credits-completed", "Credits Completed"),
        CalcField("credits-original-major", "Credits Original Major"),
        CalcField("cost-per-credit", "Cost Per Credit"),
        CalcField("credits-new-major", "Credits New Major"),
        CalcField("credits-overlap", "Credits Overlap"),
        CalcField("credits-per-semester", "Credits Per Semester"),
    ],
    fn=_js_calc,
)

register_calculator(
    "memorization-time-estimator", "Flashcard Study Estimator", "education",
    "Flashcard Study Estimator",
    fields=[
        CalcField("num-cards", "Num Cards"),
        CalcField("learning-rate", "Learning Rate"),
        CalcField("daily-hours", "Daily Hours"),
        CalcField("review-factor", "Review Factor", type="select", options=[{"value": "Light (1.5x learning time)", "label": "Light (1.5x learning time)"}, {"value": "Balanced (3.0x - Standard SR)", "label": "Balanced (3.0x - Standard SR)"}, {"value": "Intensive (5.0x - Near-perfect recall)", "label": "Intensive (5.0x - Near-perfect recall)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "minimum-grade-required-calculator", "✨ Minimum Grade Required Calculator", "education",
    "✨ Minimum Grade Required Calculator",
    fields=[
        CalcField("remaining_weight", "Remaining Weight"),
        CalcField("target_grade", "Target Grade"),
        CalcField("name-field", "Name Field", type="text"),
        CalcField("assignment-score", "Assignment Score"),
        CalcField("assignment-weight", "Assignment Weight"),
    ],
    fn=_js_calc,
)

register_calculator(
    "online-course-progress-tracker", "Course Progress Tracker", "education",
    "Course Progress Tracker",
    fields=[
        CalcField("lesson-checkbox", "Lesson Checkbox"),
        CalcField("course-structure", "Course Structure"),
    ],
    fn=_js_calc,
)

register_calculator(
    "paragraph-structure-planner", "📝 Paragraph Structure Planner", "education",
    "📝 Paragraph Structure Planner",
    fields=[
        CalcField("target-word-count", "Target Word Count"),
        CalcField("t-words", "T Words"),
        CalcField("e-words", "E Words"),
        CalcField("a-words", "A Words"),
        CalcField("l-words", "L Words"),
    ],
    fn=_js_calc,
)

register_calculator(
    "percentile-rank-calculator", "📈 Percentile Rank Calculator", "education",
    "📈 Percentile Rank Calculator",
    fields=[
        CalcField("total-scores-n", "Total Scores N"),
        CalcField("scores-below-b", "Scores Below B"),
        CalcField("scores-equal-e", "Scores Equal E"),
    ],
    fn=_js_calc,
)

register_calculator(
    "plagiarism-checker-score-estimator", "🕵️‍♂️ Plagiarism Score Estimator", "education",
    "🕵️‍♂️ Plagiarism Score Estimator",
    fields=[
        CalcField("quote-percentage", "Direct Quotes 0%"),
        CalcField("paraphrase-quality", "Paraphrase Quality 100%"),
        CalcField("source-count", "Sources Cited 0"),
        CalcField("text-input", "Text Input"),
    ],
    fn=_js_calc,
)

register_calculator(
    "presentation-slide-count-estimator", "Slide Count Estimator", "education",
    "Slide Count Estimator",
    fields=[
        CalcField("total-minutes", "Total Minutes"),
        CalcField("qna-minutes", "Qna Minutes"),
        CalcField("pres-style", "Pres Style", type="select", options=[{"value": "Rapid (30s / slide)", "label": "Rapid (30s / slide)"}, {"value": "Dynamic (1m / slide)", "label": "Dynamic (1m / slide)"}, {"value": "Standard (1.5m / slide)", "label": "Standard (1.5m / slide)"}, {"value": "Detailed (2.5m / slide)", "label": "Detailed (2.5m / slide)"}, {"value": "Interactive (4m+ / slide)", "label": "Interactive (4m+ / slide)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "random-student-picker", "Fair Participation Picker", "education",
    "Fair Participation Picker",
    fields=[
        CalcField("student-list", "Student Names"),
    ],
    fn=_js_calc,
)

register_calculator(
    "rubric-score-calculator", "Rubric Score Calculator", "education",
    "Rubric Score Calculator",
    fields=[
        CalcField("form-control-sm", "Form Control Sm", type="text"),
        CalcField("text-center", "Text Center"),
        CalcField("form-select-sm", "Form Select Sm", type="select", options=[{"value": "${lvl.label}", "label": "${lvl.label}"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "scholarship-finder-match-score-calculator", "⭐ Scholarship Match Score Generator", "education",
    "⭐ Scholarship Match Score Generator",
    fields=[
        CalcField("gpa-input", "Gpa Input"),
        CalcField("need-input", "Need Input", type="select", options=[{"value": "Minimal/No Need (0 pts)", "label": "Minimal/No Need (0 pts)"}, {"value": "Low to Moderate (10 pts)", "label": "Low to Moderate (10 pts)"}, {"value": "Moderate to High (15 pts)", "label": "Moderate to High (15 pts)"}, {"value": "Very High Need (20 pts)", "label": "Very High Need (20 pts)"}]),
        CalcField("major-input", "Major Input", type="select", options=[{"value": "Broad/General (5 pts)", "label": "Broad/General (5 pts)"}, {"value": "Related Field (10 pts)", "label": "Related Field (10 pts)"}, {"value": "Exact Field Match (15 pts)", "label": "Exact Field Match (15 pts)"}]),
        CalcField("ecs-input", "Ecs Input", type="select", options=[{"value": "Low Involvement (5 pts)", "label": "Low Involvement (5 pts)"}, {"value": "Club Participation (10 pts)", "label": "Club Participation (10 pts)"}, {"value": "Consistent Involvement (15 pts)", "label": "Consistent Involvement (15 pts)"}, {"value": "Major Leadership/Impact (20 pts)", "label": "Major Leadership/Impact (20 pts)"}]),
        CalcField("essay-input", "Essay Input", type="select", options=[{"value": "Weak/Unfocused (5 pts)", "label": "Weak/Unfocused (5 pts)"}, {"value": "Meets requirements (10 pts)", "label": "Meets requirements (10 pts)"}, {"value": "Strong/Compelling (15 pts)", "label": "Strong/Compelling (15 pts)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "semester-countdown-calculator", "Semester Progress Tracker", "education",
    "Semester Progress Tracker",
    fields=[
        CalcField("start-date", "Semester Start", type="date"),
        CalcField("end-date", "Semester End", type="date"),
        CalcField("total-weeks", "Total Scheduled Weeks"),
    ],
    fn=_js_calc,
)

register_calculator(
    "semester-workload-calculator", "🎓 Semester Workload Calculator", "education",
    "🎓 Semester Workload Calculator",
    fields=[
        CalcField("input-credit-hours", "Input Credit Hours"),
        CalcField("input-study-hours", "Input Study Hours"),
    ],
    fn=_js_calc,
)

register_calculator(
    "speech-and-presentation-length-calculator", "🎙️ Speech Length Calculator", "education",
    "🎙️ Speech Length Calculator",
    fields=[
        CalcField("wpm-input", "Wpm Input"),
        CalcField("text-input", "Text Input"),
    ],
    fn=_js_calc,
)

register_calculator(
    "student-loan-amortization-calculator", "💸 Student Loan Repayment Calculator", "education",
    "💸 Student Loan Repayment Calculator",
    fields=[
        CalcField("principal", "Principal"),
        CalcField("rate", "Rate"),
        CalcField("term", "Term"),
    ],
    fn=_js_calc,
)

register_calculator(
    "student-loan-debt-to-income-projector", "Student Loan DTI Projector", "education",
    "Student Loan DTI Projector",
    fields=[
        CalcField("total-debt", "Total Debt"),
        CalcField("annual-salary", "Annual Salary"),
        CalcField("interest-rate", "Interest Rate"),
        CalcField("repayment-term", "Repayment Term"),
    ],
    fn=_js_calc,
)

register_calculator(
    "student-loan-forgiveness-eligibility-calculator", "✅ Loan Forgiveness Eligibility Calculator", "education",
    "✅ Loan Forgiveness Eligibility Calculator",
    fields=[
        CalcField("payments-made-pslf", "Payments Made Pslf"),
        CalcField("years-completed-idr", "Years Completed Idr"),
        CalcField("loan-type", "Loan Type", type="select", options=[{"value": "Direct Loans (Standard)", "label": "Direct Loans (Standard)"}, {"value": "FFEL or Perkins Loans", "label": "FFEL or Perkins Loans"}, {"value": "Private Student Loans", "label": "Private Student Loans"}]),
        CalcField("repayment-plan", "Repayment Plan", type="select", options=[{"value": "Income-Driven (SAVE, PAYE, IBR)", "label": "Income-Driven (SAVE, PAYE, IBR)"}, {"value": "10-Year Standard Plan", "label": "10-Year Standard Plan"}, {"value": "Extended or Graduated Plan", "label": "Extended or Graduated Plan"}]),
        CalcField("qualifying-employment", "Qualifying Employment", type="select", options=[{"value": "For-Profit Company / Self-Employed", "label": "For-Profit Company / Self-Employed"}, {"value": "Government or 501(c)(3) Non-Profit", "label": "Government or 501(c)(3) Non-Profit"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "student-loan-refinance-savings-calculator", "🔄 Student Loan Refinance Calculator", "education",
    "🔄 Student Loan Refinance Calculator",
    fields=[
        CalcField("current_principal", "Current Principal"),
        CalcField("current_rate", "Current Rate"),
        CalcField("current_term", "Current Term"),
        CalcField("new_principal_display", "New Principal Display", type="text"),
        CalcField("new_rate", "New Rate"),
        CalcField("new_term", "New Term"),
    ],
    fn=_js_calc,
)

register_calculator(
    "student-monthly-budget-calculator", "📊 Student Monthly Budget", "education",
    "📊 Student Monthly Budget",
    fields=[
        CalcField("form-control-sm", "Form Control Sm", type="text"),
        CalcField("${type}-amount", "${Type} Amount"),
        CalcField("-amount", "Amount"),
    ],
    fn=_js_calc,
)

register_calculator(
    "study-abroad-cost-calculator", "Study Abroad Cost Calculator", "education",
    "Study Abroad Cost Calculator",
    fields=[
        CalcField("program-fee", "Program Fee"),
        CalcField("duration-weeks", "Duration Weeks"),
        CalcField("flight-cost", "Flight Cost"),
        CalcField("visa-insurance", "Visa Insurance"),
        CalcField("pre-travel-misc", "Pre Travel Misc"),
        CalcField("weekly-food", "Weekly Food"),
        CalcField("weekly-transport", "Weekly Transport"),
        CalcField("weekly-fun-misc", "Weekly Fun Misc"),
        CalcField("scholarship-aid", "Scholarship Aid"),
    ],
    fn=_js_calc,
)

register_calculator(
    "teacher-gradebook-average-calculator", "Gradebook Average Calculator", "education",
    "Gradebook Average Calculator",
    fields=[
        CalcField("form-control-sm", "Form Control Sm", type="text"),
        CalcField("border-start-0", "Border Start 0"),
    ],
    fn=_js_calc,
)

register_calculator(
    "text-character-and-word-counter", "📝 Text Character & Word Counter", "education",
    "📝 Text Character & Word Counter",
    fields=[
        CalcField("text-input", "Text Input"),
    ],
    fn=_js_calc,
)

register_calculator(
    "text-reading-time-calculator", "⏱️ Reading Time Calculator", "education",
    "⏱️ Reading Time Calculator",
    fields=[
        CalcField("wpm-input", "Wpm Input"),
        CalcField("text-input", "Text Input"),
    ],
    fn=_js_calc,
)

register_calculator(
    "textbook-cost-calculator", "💰 Textbook Cost Calculator", "education",
    "💰 Textbook Cost Calculator",
    fields=[
        CalcField("input-price", "Input Price"),
    ],
    fn=_js_calc,
)

register_calculator(
    "thesis-page-count-estimator", "📚 Thesis Page Count Estimator", "education",
    "📚 Thesis Page Count Estimator",
    fields=[
        CalcField("target-word-count", "Target Word Count"),
        CalcField("custom-wpp", "Custom Wpp"),
        CalcField("fixed-pages", "Fixed Pages"),
        CalcField("form-control-sm", "Form Control Sm", type="text"),
        CalcField("ch-percent", "Ch Percent"),
        CalcField("words-per-page", "Words Per Page", type="select", options=[{"value": "250 (Double Spaced)", "label": "250 (Double Spaced)"}, {"value": "300 (1.5 Spacing)", "label": "300 (1.5 Spacing)"}, {"value": "500 (Single Spaced)", "label": "500 (Single Spaced)"}, {"value": "Custom", "label": "Custom"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "weekly-study-time-planner-and-workload-organizer", "📅 Weekly Study Time Planner", "education",
    "📅 Weekly Study Time Planner",
    fields=[
        CalcField("available-hours", "Total Available Study Hours"),
        CalcField("input-subject-hours", "Input Subject Hours"),
    ],
    fn=_js_calc,
)

register_calculator(
    "words-per-minute-typing-speed-calculator", "⌨️ Professional Typing Test", "education",
    "⌨️ Professional Typing Test",
    fields=[
        CalcField("hidden-input", "Hidden Input", type="text"),
    ],
    fn=_js_calc,
)

register_calculator(
    "work-study-earnings-calculator", "💰 Work-Study Earnings Calculator", "education",
    "💰 Work-Study Earnings Calculator",
    fields=[
        CalcField("total-award", "Total Award"),
        CalcField("hourly-wage", "Hourly Wage"),
        CalcField("academic-weeks", "Academic Weeks"),
        CalcField("hours-worked", "Hours Worked"),
    ],
    fn=_js_calc,
)

register_calculator(
    "annual-property-operating-data-calculator", "APOD Investment Modeler", "real_estate",
    "APOD Investment Modeler",
    fields=[
        CalcField("units", "Units"),
        CalcField("monthly-rent", "Monthly Rent"),
        CalcField("vacancy-rate", "Vacancy Rate"),
        CalcField("total-opex", "Total Opex"),
        CalcField("annual-debt", "Annual Debt"),
    ],
    fn=_js_calc,
)

register_calculator(
    "arm-calculator", "ARM Loan Forecaster", "real_estate",
    "ARM Loan Forecaster",
    fields=[
        CalcField("loan-amount", "Loan Amount"),
        CalcField("initial-rate", "Initial Rate"),
        CalcField("fixed-years", "Fixed Years"),
        CalcField("index-rate", "Index Rate"),
        CalcField("margin", "Margin"),
        CalcField("periodic-cap", "Periodic Cap"),
        CalcField("lifetime-cap", "Lifetime Cap"),
    ],
    fn=_js_calc,
)

register_calculator(
    "balloon-mortgage-calculator", "Balloon Loan Forecaster", "real_estate",
    "Balloon Loan Forecaster",
    fields=[
        CalcField("loan-amount", "Loan Amount"),
        CalcField("interest-rate", "Interest Rate"),
        CalcField("amort-years", "Amort Years"),
        CalcField("balloon-years", "Balloon Years"),
    ],
    fn=_js_calc,
)

register_calculator(
    "bi-weekly-portgage-payment-calculator", "Bi-Weekly Savings Pro", "real_estate",
    "Bi-Weekly Savings Pro",
    fields=[
        CalcField("principal-input", "Principal Input"),
        CalcField("rate-input", "Rate Input"),
        CalcField("term-input", "Term Input"),
    ],
    fn=_js_calc,
)

register_calculator(
    "buy-to-let-mortgage-calculator", "BTL Affordability Modeler", "real_estate",
    "BTL Affordability Modeler",
    fields=[
        CalcField("property-value", "Property Value"),
        CalcField("max-ltv", "Max Ltv"),
        CalcField("actual-rate", "Actual Rate"),
        CalcField("rental-income", "Rental Income"),
        CalcField("stress-rate", "Stress Rate"),
        CalcField("icr-coverage", "Icr Coverage"),
    ],
    fn=_js_calc,
)

register_calculator(
    "capital-gains-tax-on-real-estate-calculator", "Capital Gains Tax Forecaster", "real_estate",
    "Capital Gains Tax Forecaster",
    fields=[
        CalcField("sale-price", "Sale Price"),
        CalcField("purchase-price", "Purchase Price"),
        CalcField("improvements", "Improvements"),
        CalcField("selling-costs", "Selling Costs"),
        CalcField("months-owned", "Months Owned"),
        CalcField("agi", "Agi"),
        CalcField("filing-status", "Filing Status", type="select", options=[{"value": "Single", "label": "Single"}, {"value": "Married Filing Jointly", "label": "Married Filing Jointly"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "capitalization-rate-calculator", "Cap Rate Analyzer", "real_estate",
    "Cap Rate Analyzer",
    fields=[
        CalcField("price", "Price"),
        CalcField("rent", "Rent"),
        CalcField("vacancy", "Vacancy"),
        CalcField("tax-ins", "Tax Ins"),
        CalcField("maint", "Maint"),
        CalcField("mgmt", "Mgmt"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cash-on-cash-return-calculator", "CoC Return Calculator", "real_estate",
    "CoC Return Calculator",
    fields=[
        CalcField("cash-flow", "Cash Flow"),
        CalcField("invested", "Invested"),
    ],
    fn=_js_calc,
)

register_calculator(
    "closing-cost-calculator", "Closing Cost Calculator", "real_estate",
    "Closing Cost Calculator",
    fields=[
        CalcField("home-price", "Home Price"),
        CalcField("dp-percent", "Dp Percent"),
        CalcField("origination-pct", "Origination Pct"),
        CalcField("appraisal-fee", "Appraisal Fee"),
        CalcField("title-fee", "Title Fee"),
        CalcField("inspection-fee", "Inspection Fee"),
        CalcField("prepaid-taxes", "Prepaid Taxes"),
        CalcField("prepaid-ins", "Prepaid Ins"),
    ],
    fn=_js_calc,
)

register_calculator(
    "construction-loan-interest-calculator", "Construction Interest Forecaster", "real_estate",
    "Construction Interest Forecaster",
    fields=[
        CalcField("max-loan-amount", "Max Loan Amount"),
        CalcField("interest-rate", "Interest Rate"),
        CalcField("draw-months", "Draw Months"),
        CalcField("avg-draw-percent", "Avg Draw Percent"),
    ],
    fn=_js_calc,
)

register_calculator(
    "days-on-market-calculator", "Days on Market (DOM) Analyzer", "real_estate",
    "Days on Market (DOM) Analyzer",
    fields=[
        CalcField("listing-date", "Listing Date", type="date"),
        CalcField("closing-date", "Closing Date", type="date"),
        CalcField("avg-dom", "Avg Dom"),
    ],
    fn=_js_calc,
)

register_calculator(
    "debt-service-coverage-ratio-calculator", "DSCR Analyzer", "real_estate",
    "DSCR Analyzer",
    fields=[
        CalcField("noi", "Noi"),
        CalcField("debt-service", "Debt Service"),
    ],
    fn=_js_calc,
)

register_calculator(
    "depreciation-calculator", "Cost Recovery Modeler", "real_estate",
    "Cost Recovery Modeler",
    fields=[
        CalcField("asset-cost", "Asset Cost"),
        CalcField("salvage-value", "Salvage Value"),
        CalcField("useful-life", "Useful Life"),
        CalcField("db-factor", "Db Factor", type="select", options=[{"value": "200% (Double Declining)", "label": "200% (Double Declining)"}, {"value": "150% Declining Balance", "label": "150% Declining Balance"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "down-payment-calculator", "Down Payment Calculator", "real_estate",
    "Down Payment Calculator",
    fields=[
        CalcField("home-price-input", "Home Price Input"),
        CalcField("down-payment-percent", "Down Payment Percent"),
    ],
    fn=_js_calc,
)

register_calculator(
    "dti-ratio-calculator", "DTI Ratio Analyzer", "real_estate",
    "DTI Ratio Analyzer",
    fields=[
        CalcField("income-input", "Income Input"),
        CalcField("housing-debt", "Housing Debt"),
        CalcField("other-debt", "Other Debt"),
    ],
    fn=_js_calc,
)

register_calculator(
    "exchange-calculator", "1031 Exchange Modeler", "real_estate",
    "1031 Exchange Modeler",
    fields=[
        CalcField("sale-price", "Sale Price"),
        CalcField("adjusted-basis", "Adjusted Basis"),
        CalcField("old-mortgage", "Old Mortgage"),
        CalcField("purchase-price", "Purchase Price"),
        CalcField("new-mortgage", "New Mortgage"),
    ],
    fn=_js_calc,
)

register_calculator(
    "extra-mortgage-payment-calculator", "Payoff Accelerator", "real_estate",
    "Payoff Accelerator",
    fields=[
        CalcField("principal-input", "Principal Input"),
        CalcField("rate-input", "Rate Input"),
        CalcField("term-input", "Term Input"),
        CalcField("extra-payment-input", "Extra Payment Input"),
    ],
    fn=_js_calc,
)

register_calculator(
    "fha-loan-calculator", "FHA Loan Calculator", "real_estate",
    "FHA Loan Calculator",
    fields=[
        CalcField("home-price", "Home Price"),
        CalcField("interest-rate", "Interest Rate"),
        CalcField("loan-term", "Loan Term"),
        CalcField("ufmip-rate", "Ufmip Rate"),
        CalcField("annual-mip-rate", "Annual Mip Rate"),
        CalcField("dp-percent", "Dp Percent"),
    ],
    fn=_js_calc,
)

register_calculator(
    "gross-rent-multiplier-calculator", "GRM Calculator", "real_estate",
    "GRM Calculator",
    fields=[
        CalcField("purchase-price", "Purchase Price"),
        CalcField("monthly-rent", "Monthly Rent"),
    ],
    fn=_js_calc,
)

register_calculator(
    "heloc-calculator", "HELOC Phase Forecaster", "real_estate",
    "HELOC Phase Forecaster",
    fields=[
        CalcField("home-value", "Home Value"),
        CalcField("mortgage-balance", "Mortgage Balance"),
        CalcField("interest-rate", "Interest Rate"),
        CalcField("max-cltv", "Max Cltv"),
        CalcField("draw-amount", "Draw Amount"),
        CalcField("draw-term", "Draw Term"),
        CalcField("repayment-term", "Repayment Term"),
    ],
    fn=_js_calc,
)

register_calculator(
    "hoa-fee-affordability-calculator", "HOA Cost Profiler", "real_estate",
    "HOA Cost Profiler",
    fields=[
        CalcField("income-input", "Income Input"),
        CalcField("affordability-percent", "Affordability Percent"),
        CalcField("monthly-fee", "Monthly Fee"),
    ],
    fn=_js_calc,
)

register_calculator(
    "home-appreciation-value-projection-calculator", "Equity Growth Forecaster", "real_estate",
    "Equity Growth Forecaster",
    fields=[
        CalcField("initial-value", "Initial Value"),
        CalcField("appreciation-rate", "Appreciation Rate"),
        CalcField("years", "Years"),
    ],
    fn=_js_calc,
)

register_calculator(
    "home-equity-loan-calculator", "Home Equity Insight Tool", "real_estate",
    "Home Equity Insight Tool",
    fields=[
        CalcField("home-value", "Home Value"),
        CalcField("mortgage-balance", "Mortgage Balance"),
        CalcField("max-ltv", "Max Ltv"),
        CalcField("loan-amount", "Loan Amount"),
        CalcField("interest-rate", "Interest Rate"),
        CalcField("loan-term", "Loan Term"),
    ],
    fn=_js_calc,
)

register_calculator(
    "home-repair-budget-calculator", "Repair Budget Profiler", "real_estate",
    "Repair Budget Profiler",
    fields=[
        CalcField("home-value", "Home Value"),
        CalcField("budget-percent", "Budget Percent"),
        CalcField("repair-roof", "Repair Roof"),
        CalcField("repair-hvac", "Repair Hvac"),
        CalcField("repair-cosmetic", "Repair Cosmetic"),
        CalcField("repair-contingency-pct", "Repair Contingency Pct", type="select", options=[{"value": "10% Buffer (Standard)", "label": "10% Buffer (Standard)"}, {"value": "20% Buffer (Recommended for old homes)", "label": "20% Buffer (Recommended for old homes)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "homeowners-insurance-premium-estimator", "HOI Premium Estimator", "real_estate",
    "HOI Premium Estimator",
    fields=[
        CalcField("dwelling-cost", "Dwelling Cost"),
        CalcField("deductible", "Deductible", type="select", options=[{"value": "$500 (Lower deductible)", "label": "$500 (Lower deductible)"}, {"value": "$1,000 (Standard)", "label": "$1,000 (Standard)"}, {"value": "$2,500 (Higher deductible)", "label": "$2,500 (Higher deductible)"}, {"value": "$5,000 (Lowest premium)", "label": "$5,000 (Lowest premium)"}]),
        CalcField("construction", "Construction", type="select", options=[{"value": "Brick / Masonry", "label": "Brick / Masonry"}, {"value": "Wood Frame", "label": "Wood Frame"}]),
        CalcField("risk-zone", "Risk Zone", type="select", options=[{"value": "Low Risk (Suburban)", "label": "Low Risk (Suburban)"}, {"value": "Medium Risk (Urban)", "label": "Medium Risk (Urban)"}, {"value": "High Risk (Coastal/Catastrophe)", "label": "High Risk (Coastal/Catastrophe)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "land-lease-payment-calculator", "Land Lease Forecaster", "real_estate",
    "Land Lease Forecaster",
    fields=[
        CalcField("initial-rent", "Initial Rent"),
        CalcField("escalation-rate", "Escalation Rate"),
        CalcField("lease-term", "Lease Term"),
    ],
    fn=_js_calc,
)

register_calculator(
    "ltv-ratio-calculator", "LTV Ratio Calculator", "real_estate",
    "LTV Ratio Calculator",
    fields=[
        CalcField("loan-amount", "Loan Amount"),
        CalcField("property-value", "Property Value"),
    ],
    fn=_js_calc,
)

register_calculator(
    "mortgage-amortization-schedule-generator", "Amortization Pro Dashboard", "real_estate",
    "Amortization Pro Dashboard",
    fields=[
        CalcField("p-input", "P Input"),
        CalcField("r-input", "R Input"),
        CalcField("t-input", "T Input"),
        CalcField("date-input", "Date Input", type="date"),
    ],
    fn=_js_calc,
)

register_calculator(
    "mortgage-payment-calculator", "Mortgage P&I Calculator", "real_estate",
    "Mortgage P&I Calculator",
    fields=[
        CalcField("principal-input", "Principal Input"),
        CalcField("rate-input", "Rate Input"),
        CalcField("term-input", "Term Input"),
    ],
    fn=_js_calc,
)

register_calculator(
    "net-operating-income-calculator", "NOI Analysis Engine", "real_estate",
    "NOI Analysis Engine",
    fields=[
        CalcField("units", "Units"),
        CalcField("monthly-rent", "Monthly Rent"),
        CalcField("vacancy-rate", "Vacancy Rate"),
        CalcField("fixed-costs", "Fixed Costs"),
        CalcField("variable-costs", "Variable Costs"),
    ],
    fn=_js_calc,
)

register_calculator(
    "piti-as-percentage-of-income-calculator", "Affordability Health Check", "real_estate",
    "Affordability Health Check",
    fields=[
        CalcField("income-input", "Income Input"),
        CalcField("pi-input", "Pi Input"),
        CalcField("taxes-input", "Taxes Input"),
        CalcField("insurance-input", "Insurance Input"),
        CalcField("hoa-input", "Hoa Input"),
    ],
    fn=_js_calc,
)

register_calculator(
    "piti-mortgage-calculator", "PITI Mortgage Calculator", "real_estate",
    "PITI Mortgage Calculator",
    fields=[
        CalcField("principal-input", "Principal Input"),
        CalcField("rate-input", "Rate Input"),
        CalcField("term-input", "Term Input"),
        CalcField("taxes-input", "Taxes Input"),
        CalcField("insurance-input", "Insurance Input"),
    ],
    fn=_js_calc,
)

register_calculator(
    "pmi-calculator", "PMI Premium Calculator", "real_estate",
    "PMI Premium Calculator",
    fields=[
        CalcField("loan-amount", "Loan Amount"),
        CalcField("pmi-rate", "Pmi Rate"),
    ],
    fn=_js_calc,
)

register_calculator(
    "price-per-square-foot-calculator", "PPSF Analysis Tool", "real_estate",
    "PPSF Analysis Tool",
    fields=[
        CalcField("property-price", "Property Price"),
        CalcField("square-footage", "Square Footage"),
    ],
    fn=_js_calc,
)

register_calculator(
    "property-tax-calculator", "Property Tax Forecaster", "real_estate",
    "Property Tax Forecaster",
    fields=[
        CalcField("assessed-value", "Assessed Value"),
        CalcField("millage-rate", "Millage Rate"),
        CalcField("exemption", "Exemption"),
    ],
    fn=_js_calc,
)

register_calculator(
    "real-estate-agent-commission-calculator", "Agent Earnings Calculator", "real_estate",
    "Agent Earnings Calculator",
    fields=[
        CalcField("sale-price", "Sale Price"),
        CalcField("total-rate", "Total Rate"),
        CalcField("side-share", "Side Share"),
        CalcField("agent-split", "Agent Split"),
    ],
    fn=_js_calc,
)

register_calculator(
    "refinance-breakeven-calculator", "Refinance Breakeven Pro", "real_estate",
    "Refinance Breakeven Pro",
    fields=[
        CalcField("current-balance", "Current Balance"),
        CalcField("current-rate", "Current Rate"),
        CalcField("current-term", "Current Term"),
        CalcField("refi-cost", "Refi Cost"),
        CalcField("new-rate", "New Rate"),
        CalcField("new-term", "New Term"),
    ],
    fn=_js_calc,
)

register_calculator(
    "relocation-cost-modeler", "Relocation Cost Modeler", "real_estate",
    "Relocation Cost Modeler",
    fields=[
        CalcField("move-distance", "Move Distance"),
        CalcField("fuel-cost", "Fuel Cost"),
        CalcField("packing-service", "Full Professional Packing"),
        CalcField("storage-service", "30-Day Transition Storage"),
        CalcField("home-size", "Home Size", type="select", options=[{"value": "Studio / 1 Bedroom Apt", "label": "Studio / 1 Bedroom Apt"}, {"value": "2 Bedroom Home", "label": "2 Bedroom Home"}, {"value": "3 Bedroom Home", "label": "3 Bedroom Home"}, {"value": "4+ Bedroom Home", "label": "4+ Bedroom Home"}]),
        CalcField("insurance-tier", "Insurance Tier", type="select", options=[{"value": "Standard Release Value ($0.60/lb)", "label": "Standard Release Value ($0.60/lb)"}, {"value": "Full Value Protection (Basic)", "label": "Full Value Protection (Basic)"}, {"value": "High Value Protection", "label": "High Value Protection"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "rent-vs-buy-calculator", "Rent vs. Buy Analysis", "real_estate",
    "Rent vs. Buy Analysis",
    fields=[
        CalcField("time-horizon", "Time Horizon"),
        CalcField("appreciation-rate", "Appreciation Rate"),
        CalcField("investment-rate", "Investment Rate"),
        CalcField("home-price", "Home Price"),
        CalcField("down-payment-percent", "Down Payment Percent"),
        CalcField("mortgage-rate", "Mortgage Rate"),
        CalcField("annual-taxes", "Annual Taxes"),
        CalcField("annual-insurance", "Annual Insurance"),
        CalcField("current-rent", "Current Rent"),
        CalcField("rent-increase-rate", "Rent Increase Rate"),
        CalcField("upfront-savings", "Upfront Savings"),
    ],
    fn=_js_calc,
)

register_calculator(
    "rental-property-cash-flow-calculator", "Rental Property Analyzer", "real_estate",
    "Rental Property Analyzer",
    fields=[
        CalcField("price", "Price"),
        CalcField("dp-pct", "Dp Pct"),
        CalcField("rate", "Rate"),
        CalcField("upfront-costs", "Upfront Costs"),
        CalcField("rent", "Rent"),
        CalcField("vacancy", "Vacancy"),
        CalcField("tax-ins", "Tax Ins"),
        CalcField("maintenance", "Maintenance"),
        CalcField("mgmt", "Mgmt"),
        CalcField("other-exp", "Other Exp"),
    ],
    fn=_js_calc,
)

register_calculator(
    "reverse-mortgage-calculator", "HECM Equity Access Tool", "real_estate",
    "HECM Equity Access Tool",
    fields=[
        CalcField("home-value", "Home Value"),
        CalcField("borrower-age", "Borrower Age"),
        CalcField("expected-rate", "Expected Rate"),
        CalcField("current-debt", "Current Debt"),
    ],
    fn=_js_calc,
)

register_calculator(
    "rule-house-flipping-calculator", "70% Rule Calculator", "real_estate",
    "70% Rule Calculator",
    fields=[
        CalcField("arv", "Arv"),
        CalcField("repairs", "Repairs"),
        CalcField("offer", "Offer"),
        CalcField("rule", "Rule"),
    ],
    fn=_js_calc,
)

register_calculator(
    "rule-quickrental-analysis-calculator", "1% Rule Screener", "real_estate",
    "1% Rule Screener",
    fields=[
        CalcField("purchase-price", "Purchase Price"),
        CalcField("monthly-rent", "Monthly Rent"),
    ],
    fn=_js_calc,
)

register_calculator(
    "seller-net-proceeds-calculator", "Seller's Net Proceeds", "real_estate",
    "Seller's Net Proceeds",
    fields=[
        CalcField("sale-price", "Sale Price"),
        CalcField("mortgage-payoff", "Mortgage Payoff"),
        CalcField("list-comm", "List Comm"),
        CalcField("buy-comm", "Buy Comm"),
        CalcField("escrow-fees", "Escrow Fees"),
        CalcField("transfer-tax", "Transfer Tax"),
        CalcField("seller-credits", "Seller Credits"),
    ],
    fn=_js_calc,
)

register_calculator(
    "tenant-rent-to-income-ratio-calculator", "Tenant Income Screener", "real_estate",
    "Tenant Income Screener",
    fields=[
        CalcField("monthly-income", "Monthly Income"),
        CalcField("monthly-rent", "Monthly Rent"),
    ],
    fn=_js_calc,
)

register_calculator(
    "total-return-on-investment-calculator", "Total ROI Analyzer", "real_estate",
    "Total ROI Analyzer",
    fields=[
        CalcField("invested", "Invested"),
        CalcField("property-value", "Property Value"),
        CalcField("cash-flow", "Cash Flow"),
        CalcField("appreciation", "Appreciation"),
        CalcField("paydown", "Paydown"),
    ],
    fn=_js_calc,
)

register_calculator(
    "usda-loan-calculator", "USDA Loan Calculator", "real_estate",
    "USDA Loan Calculator",
    fields=[
        CalcField("home-price", "Home Price"),
        CalcField("interest-rate", "Interest Rate"),
        CalcField("loan-term", "Loan Term"),
        CalcField("upfront-rate", "Upfront Rate"),
        CalcField("annual-rate", "Annual Rate"),
    ],
    fn=_js_calc,
)

register_calculator(
    "va-loan-calculator", "VA Loan Calculator", "real_estate",
    "VA Loan Calculator",
    fields=[
        CalcField("home-price", "Home Price"),
        CalcField("interest-rate", "Interest Rate"),
        CalcField("loan-term", "Loan Term"),
        CalcField("dp-percent", "Dp Percent"),
        CalcField("is-exempt", "Exempt from Funding Fee"),
        CalcField("usage-status", "Usage Status", type="select", options=[{"value": "First-Time Use", "label": "First-Time Use"}, {"value": "Subsequent Use", "label": "Subsequent Use"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "audio-visual-equipment-calculator", "AV Tech Planner", "event_budget",
    "AV Tech Planner",
    fields=[
        CalcField("av-guests", "Av Guests"),
        CalcField("cost-video", "Cost Video"),
        CalcField("cost-audio", "Cost Audio"),
        CalcField("cost-light", "Cost Light"),
    ],
    fn=_js_calc,
)

register_calculator(
    "catering-cost-calculator", "Catering Cost Planner", "event_budget",
    "Catering Cost Planner",
    fields=[
        CalcField("catering-guests", "Catering Guests"),
        CalcField("menu-food", "Menu Food"),
        CalcField("menu-drinks", "Menu Drinks"),
        CalcField("menu-service", "Menu Service"),
    ],
    fn=_js_calc,
)

register_calculator(
    "conference-budget-calculator", "Conference Budget Calculator", "event_budget",
    "Conference Budget Calculator",
    fields=[
        CalcField("attendee-count", "Attendee Count"),
        CalcField("cost-ops", "Cost Ops"),
        CalcField("cost-talent", "Cost Talent"),
        CalcField("cost-marketing", "Cost Marketing"),
        CalcField("cost-delegate", "Cost Delegate"),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-beverage-alcohol-calculator", "Event Beverage Planner", "event_budget",
    "Event Beverage Planner",
    fields=[
        CalcField("bev-guests", "Bev Guests"),
        CalcField("bev-hours", "Bev Hours"),
        CalcField("add-ice", "Add Ice"),
        CalcField("thirst-level", "Thirst Level", type="select", options=[{"value": "Light (1 drink/hr)", "label": "Light (1 drink/hr)"}, {"value": "Standard (1.5 drinks/hr)", "label": "Standard (1.5 drinks/hr)"}, {"value": "Heavy (2+ drinks/hr)", "label": "Heavy (2+ drinks/hr)"}]),
        CalcField("drink-split", "Drink Split", type="select", options=[{"value": "Beer/Wine/Spirits (40/30/30)", "label": "Beer/Wine/Spirits (40/30/30)"}, {"value": "Beer & Wine Only (50/50)", "label": "Beer & Wine Only (50/50)"}, {"value": "Spirits Heavy (20/20/60)", "label": "Spirits Heavy (20/20/60)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-breakout-session-scheduler-capacity-calculator", "Breakout Session Scheduler", "event_budget",
    "Breakout Session Scheduler",
    fields=[
        CalcField("total-attendees", "Total Attendees"),
        CalcField("add-passing", "Add Passing"),
        CalcField("track-count", "Track Count", type="select", options=[{"value": "2 Tracks (Large Rooms)", "label": "2 Tracks (Large Rooms)"}, {"value": "4 Tracks (Medium Rooms)", "label": "4 Tracks (Medium Rooms)"}, {"value": "8 Tracks (Intimate/Small)", "label": "8 Tracks (Intimate/Small)"}]),
        CalcField("session-format", "Session Format", type="select", options=[{"value": "Lightning Talk (20m)", "label": "Lightning Talk (20m)"}, {"value": "Standard Presentation (45m)", "label": "Standard Presentation (45m)"}, {"value": "Workshop / Deep Dive (90m)", "label": "Workshop / Deep Dive (90m)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-budget-calculator", "Event Budget Planner", "event_budget",
    "Event Budget Planner",
    fields=[
        CalcField("target-budget", "Target Budget"),
        CalcField("cost-venue", "Cost Venue"),
        CalcField("cost-food", "Cost Food"),
        CalcField("cost-decor", "Cost Decor"),
        CalcField("cost-misc", "Cost Misc"),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-cake-serving-tier-calculator", "Cake Serving Calculator", "event_budget",
    "Cake Serving Calculator",
    fields=[
        CalcField("cake-guests", "Cake Guests"),
        CalcField("add-buffer", "Add Buffer"),
        CalcField("slice-style", "Slice Style", type="select", options=[{"value": "Wedding Style (Small)", "label": "Wedding Style (Small)"}, {"value": "Standard Party (Large)", "label": "Standard Party (Large)"}]),
        CalcField("tier-height", "Tier Height", type="select", options=[{"value": "Standard (4\" High)", "label": "Standard (4\" High)"}, {"value": "Tall (6\" High)", "label": "Tall (6\" High)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-decor-florist-cost-calculator", "Decor & Florist Calculator", "event_budget",
    "Decor & Florist Calculator",
    fields=[
        CalcField("decor-tables", "Decor Tables"),
        CalcField("cost-florals", "Cost Florals"),
        CalcField("cost-rentals", "Cost Rentals"),
        CalcField("cost-lighting", "Cost Lighting"),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-gift-bag-welcome-kit-calculator", "Gift Bag Cost Calculator", "event_budget",
    "Gift Bag Cost Calculator",
    fields=[
        CalcField("gift-count", "Gift Count"),
        CalcField("add-logistics", "Add Logistics"),
        CalcField("bag-tier", "Bag Tier", type="select", options=[{"value": "Paper Bag + Tissue ($1.50)", "label": "Paper Bag + Tissue ($1.50)"}, {"value": "Premium Gift Box ($5.00)", "label": "Premium Gift Box ($5.00)"}, {"value": "Branded Canvas Tote ($12.00)", "label": "Branded Canvas Tote ($12.00)"}]),
        CalcField("content-tier", "Content Tier", type="select", options=[{"value": "Basic (Water + 2 Snacks)", "label": "Basic (Water + 2 Snacks)"}, {"value": "Standard (Snacks + 1 Keepsake)", "label": "Standard (Snacks + 1 Keepsake)"}, {"value": "Deluxe (Tech item + Gourmet)", "label": "Deluxe (Tech item + Gourmet)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-insurance-cost-calculator", "Event Insurance Estimator", "event_budget",
    "Event Insurance Estimator",
    fields=[
        CalcField("ins-guests", "Ins Guests"),
        CalcField("ins-budget", "Ins Budget"),
        CalcField("ins-liquor-type", "Ins Liquor Type", type="select", options=[{"value": "No Alcohol", "label": "No Alcohol"}, {"value": "Host Liquor (Open Bar)", "label": "Host Liquor (Open Bar)"}, {"value": "Retail/Cash Bar", "label": "Retail/Cash Bar"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-invitation-stationery-cost-calculator", "Stationery Cost Calculator", "event_budget",
    "Stationery Cost Calculator",
    fields=[
        CalcField("paper-guests", "Paper Guests"),
        CalcField("add-dayof", "Add Dayof"),
        CalcField("print-method", "Print Method", type="select", options=[{"value": "Digital (Flat) - $5.00/ea", "label": "Digital (Flat) - $5.00/ea"}, {"value": "Letterpress / Foil - $12.00/ea", "label": "Letterpress / Foil - $12.00/ea"}, {"value": "Digital Only / E-Invite", "label": "Digital Only / E-Invite"}]),
        CalcField("postage-rate", "Postage Rate", type="select", options=[{"value": "Standard Stamp ($0.73)", "label": "Standard Stamp ($0.73)"}, {"value": "Heavy / Square ($1.50)", "label": "Heavy / Square ($1.50)"}, {"value": "No Mailing Needed", "label": "No Mailing Needed"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-lighting-requirements-calculator", "Event Lighting Planner", "event_budget",
    "Event Lighting Planner",
    fields=[
        CalcField("room-perimeter", "Room Perimeter"),
        CalcField("light-density", "Light Density", type="select", options=[{"value": "Soft (Every 15ft)", "label": "Soft (Every 15ft)"}, {"value": "Standard (Every 10ft)", "label": "Standard (Every 10ft)"}, {"value": "Intense (Every 6ft)", "label": "Intense (Every 6ft)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-marketing-cost-calculator", "Event Marketing Planner", "event_budget",
    "Event Marketing Planner",
    fields=[
        CalcField("mkt-guests", "Mkt Guests"),
        CalcField("cost-paid", "Cost Paid"),
        CalcField("cost-social", "Cost Social"),
        CalcField("cost-creative", "Cost Creative"),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-menu-planning-food-quantity-calculator", "Menu Quantity Calculator", "event_budget",
    "Menu Quantity Calculator",
    fields=[
        CalcField("food-guests", "Food Guests"),
        CalcField("protein-variety", "Protein Variety", type="select", options=[{"value": "Single Choice (1/2 lb)", "label": "Single Choice (1/2 lb)"}, {"value": "Buffet (3/4 lb total)", "label": "Buffet (3/4 lb total)"}, {"value": "Light Lunch (1/3 lb)", "label": "Light Lunch (1/3 lb)"}]),
        CalcField("sides-count", "Sides Count", type="select", options=[{"value": "1 Side Dish", "label": "1 Side Dish"}, {"value": "2 Side Dishes", "label": "2 Side Dishes"}, {"value": "3+ Side Dishes", "label": "3+ Side Dishes"}]),
        CalcField("app-duration", "App Duration", type="select", options=[{"value": "None", "label": "None"}, {"value": "Pre-Dinner (4 pcs/guest)", "label": "Pre-Dinner (4 pcs/guest)"}, {"value": "Cocktail Party (8 pcs/guest)", "label": "Cocktail Party (8 pcs/guest)"}, {"value": "Appetizer-Only Event (12+)", "label": "Appetizer-Only Event (12+)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-networking-social-time-calculator", "Networking Time Calculator", "event_budget",
    "Networking Time Calculator",
    fields=[
        CalcField("net-guests", "Net Guests"),
        CalcField("add-buffer", "Add Buffer"),
        CalcField("net-type", "Net Type", type="select", options=[{"value": "Open Cocktail Hour (Low Structure)", "label": "Open Cocktail Hour (Low Structure)"}, {"value": "Structured Intro (Medium)", "label": "Structured Intro (Medium)"}, {"value": "Speed Networking (High Intensity)", "label": "Speed Networking (High Intensity)"}]),
        CalcField("net-goals", "Net Goals", type="select", options=[{"value": "Casual (3-5 people)", "label": "Casual (3-5 people)"}, {"value": "Active (8-10 people)", "label": "Active (8-10 people)"}, {"value": "Maximum (15+ people)", "label": "Maximum (15+ people)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-permit-license-cost-calculator", "Permit & License Planner", "event_budget",
    "Permit & License Planner",
    fields=[
        CalcField("permit-days", "Permit Days"),
        CalcField("vendor-count", "Vendor Count"),
        CalcField("location-type", "Location Type", type="select", options=[{"value": "Private Venue (Indoor)", "label": "Private Venue (Indoor)"}, {"value": "Public Park / Plaza", "label": "Public Park / Plaza"}, {"value": "Street Closure Required", "label": "Street Closure Required"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-photography-videography-calculator", "Media Package Calculator", "event_budget",
    "Media Package Calculator",
    fields=[
        CalcField("media-hours", "Media Hours"),
        CalcField("add-highlight", "Add Highlight"),
        CalcField("add-raw", "Add Raw"),
        CalcField("photo-staff", "Photo Staff", type="select", options=[{"value": "No Photography", "label": "No Photography"}, {"value": "1 Lead Photographer", "label": "1 Lead Photographer"}, {"value": "2 Shooters (Lead + Assist)", "label": "2 Shooters (Lead + Assist)"}]),
        CalcField("video-staff", "Video Staff", type="select", options=[{"value": "No Videography", "label": "No Videography"}, {"value": "1 Lead Videographer", "label": "1 Lead Videographer"}, {"value": "2 Shooters + Drone", "label": "2 Shooters + Drone"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-power-generator-requirements-calculator", "Event Power Calculator", "event_budget",
    "Event Power Calculator",
    fields=[
        CalcField("watt-av", "Watt Av"),
        CalcField("qty-av", "Qty Av"),
        CalcField("watt-light", "Watt Light"),
        CalcField("qty-light", "Qty Light"),
        CalcField("watt-catering", "Watt Catering"),
        CalcField("qty-catering", "Qty Catering"),
        CalcField("voltage-input", "Voltage Input", type="select", options=[{"value": "120V (Standard US)", "label": "120V (Standard US)"}, {"value": "230V (EU / International)", "label": "230V (EU / International)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-registration-fee-tax-calculator", "Registration Fee Calculator", "event_budget",
    "Registration Fee Calculator",
    fields=[
        CalcField("base-price", "Base Price"),
        CalcField("fee-percent", "Fee Percent"),
        CalcField("fee-flat", "Fee Flat"),
        CalcField("tax-percent", "Tax Percent"),
        CalcField("fee-strategy", "Fee Strategy", type="select", options=[{"value": "Pass fees to Attendee", "label": "Pass fees to Attendee"}, {"value": "Absorb fees (Deduct from profit)", "label": "Absorb fees (Deduct from profit)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-roi-calculator", "Event ROI Calculator", "event_budget",
    "Event ROI Calculator",
    fields=[
        CalcField("rev-tickets", "Rev Tickets"),
        CalcField("rev-sponsors", "Rev Sponsors"),
        CalcField("exp-hard", "Exp Hard"),
        CalcField("exp-soft", "Exp Soft"),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-seating-chart-planner", "Seating Chart Planner", "event_budget",
    "Seating Chart Planner",
    fields=[
        CalcField("guest-count", "Guest Count"),
        CalcField("guests-per-table", "Guests Per Table", type="select", options=[{"value": "6 (Spacious / Small Round)", "label": "6 (Spacious / Small Round)"}, {"value": "8 (Standard Round)", "label": "8 (Standard Round)"}, {"value": "10 (Large Round)", "label": "10 (Large Round)"}, {"value": "12 (Very Large Round)", "label": "12 (Very Large Round)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-security-staff-risk-calculator", "Event Security Calculator", "event_budget",
    "Event Security Calculator",
    fields=[
        CalcField("sec-guests", "Sec Guests"),
        CalcField("has-alcohol", "Has Alcohol"),
        CalcField("sec-doors", "Sec Doors"),
        CalcField("sec-risk-modifier", "Sec Risk Modifier", type="select", options=[{"value": "Low Risk", "label": "Low Risk"}, {"value": "Moderate Risk", "label": "Moderate Risk"}, {"value": "High Risk", "label": "High Risk"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-sound-system-pa-coverage-calculator", "Audio Coverage Planner", "event_budget",
    "Audio Coverage Planner",
    fields=[
        CalcField("audio-sqft", "Audio Sqft"),
        CalcField("has-subs", "Has Subs"),
        CalcField("audio-type", "Audio Type", type="select", options=[{"value": "Speech / Background ($0.5W/sqft$)", "label": "Speech / Background ($0.5W/sqft$)"}, {"value": "Wedding / Party ($1.5W/sqft$)", "label": "Wedding / Party ($1.5W/sqft$)"}, {"value": "Live Band / Concert ($4.0W/sqft$)", "label": "Live Band / Concert ($4.0W/sqft$)"}]),
        CalcField("audio-env", "Audio Env", type="select", options=[{"value": "Indoor (Standard)", "label": "Indoor (Standard)"}, {"value": "Outdoor (Requires +50%)", "label": "Outdoor (Requires +50%)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-speaker-fee-budget-calculator", "Speaker Fee Calculator", "event_budget",
    "Speaker Fee Calculator",
    fields=[
        CalcField("speaker-count", "Speaker Count"),
        CalcField("add-travel", "Add Travel"),
        CalcField("speaker-tier", "Speaker Tier", type="select", options=[{"value": "Subject Matter Expert ($1.5k-$5k)", "label": "Subject Matter Expert ($1.5k-$5k)"}, {"value": "Professional Keynoter ($5k-$15k)", "label": "Professional Keynoter ($5k-$15k)"}, {"value": "Recognized Authority ($20k-$40k)", "label": "Recognized Authority ($20k-$40k)"}, {"value": "Celebrity / Icon ($50k+)", "label": "Celebrity / Icon ($50k+)"}]),
        CalcField("engagement-type", "Engagement Type", type="select", options=[{"value": "Keynote Only (60 min)", "label": "Keynote Only (60 min)"}, {"value": "Keynote + Workshop", "label": "Keynote + Workshop"}, {"value": "Panelist / Virtual Only", "label": "Panelist / Virtual Only"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-sponsorship-value-calculator", "Sponsorship Value Calculator", "event_budget",
    "Sponsorship Value Calculator",
    fields=[
        CalcField("spons-guests", "Spons Guests"),
        CalcField("asset-reach", "Asset Reach"),
        CalcField("asset-signage", "Asset Signage"),
        CalcField("asset-access", "Asset Access"),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-staffing-calculator", "Event Staffing Calculator", "event_budget",
    "Event Staffing Calculator",
    fields=[
        CalcField("staff-guests", "Staff Guests"),
        CalcField("shift-hours", "Shift Hours"),
        CalcField("rate-waiter", "Rate Waiter"),
        CalcField("rate-security", "Rate Security"),
        CalcField("rate-cleaner", "Rate Cleaner"),
        CalcField("service-style", "Service Style", type="select", options=[{"value": "Buffet (1:25 ratio)", "label": "Buffet (1:25 ratio)"}, {"value": "Plated (1:12 ratio)", "label": "Plated (1:12 ratio)"}, {"value": "VIP/Premium (1:10 ratio)", "label": "VIP/Premium (1:10 ratio)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-stage-backdrop-size-calculator", "Stage & Backdrop Planner", "event_budget",
    "Stage & Backdrop Planner",
    fields=[
        CalcField("stage-people", "Stage People"),
        CalcField("has-furniture", "Has Furniture"),
        CalcField("stage-style", "Stage Style", type="select", options=[{"value": "Static (Lectern Only)", "label": "Static (Lectern Only)"}, {"value": "Dynamic (Movement)", "label": "Dynamic (Movement)"}, {"value": "Performance (Large Gear)", "label": "Performance (Large Gear)"}]),
        CalcField("backdrop-overhang", "Backdrop Overhang", type="select", options=[{"value": "Minimal (+2' per side)", "label": "Minimal (+2' per side)"}, {"value": "Standard (+4' per side)", "label": "Standard (+4' per side)"}, {"value": "Wide / Panoramic (+8' per side)", "label": "Wide / Panoramic (+8' per side)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-table-chair-rental-calculator", "Table & Chair Calculator", "event_budget",
    "Table & Chair Calculator",
    fields=[
        CalcField("rental-guests", "Rental Guests"),
        CalcField("table-price", "Table Price"),
        CalcField("chair-tier", "Chair Tier", type="select", options=[{"value": "Folding / Resin ($2.50)", "label": "Folding / Resin ($2.50)"}, {"value": "Chiavari / Ghost ($8.00)", "label": "Chiavari / Ghost ($8.00)"}, {"value": "Luxury Velvet / Armed ($15.00)", "label": "Luxury Velvet / Armed ($15.00)"}]),
        CalcField("table-capacity", "Table Capacity", type="select", options=[{"value": "Round 60\" (Seats 8)", "label": "Round 60\" (Seats 8)"}, {"value": "Round 72\" (Seats 10)", "label": "Round 72\" (Seats 10)"}, {"value": "8' Rectangle (Seats 8)", "label": "8' Rectangle (Seats 8)"}, {"value": "6' Rectangle (Seats 6)", "label": "6' Rectangle (Seats 6)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-tent-size-capacity-calculator", "Event Tent Size Calculator", "event_budget",
    "Event Tent Size Calculator",
    fields=[
        CalcField("tent-guests", "Tent Guests"),
        CalcField("seating-style", "Seating Style", type="select", options=[{"value": "Round Tables (12 sqft/guest)", "label": "Round Tables (12 sqft/guest)"}, {"value": "Rectangular Tables (10 sqft/guest)", "label": "Rectangular Tables (10 sqft/guest)"}, {"value": "Theater Rows (8 sqft/guest)", "label": "Theater Rows (8 sqft/guest)"}, {"value": "Cocktail / Standing (6 sqft/guest)", "label": "Cocktail / Standing (6 sqft/guest)"}]),
        CalcField("feature-space", "Feature Space", type="select", options=[{"value": "None", "label": "None"}, {"value": "Small (20'x20' Dance Floor)", "label": "Small (20'x20' Dance Floor)"}, {"value": "Large (Dance Floor + Stage)", "label": "Large (Dance Floor + Stage)"}]),
        CalcField("service-space", "Service Space", type="select", options=[{"value": "None", "label": "None"}, {"value": "Standard (Buffet + Bar)", "label": "Standard (Buffet + Bar)"}, {"value": "Full (Catering Kitchen + Multiple Bars)", "label": "Full (Catering Kitchen + Multiple Bars)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-timeline-run-sheet-generator", "Event Run Sheet Generator", "event_budget",
    "Event Run Sheet Generator",
    fields=[
        CalcField("start-time", "Start Time", type="date"),
        CalcField("time-setup", "Time Setup"),
        CalcField("time-main", "Time Main"),
        CalcField("time-break", "Time Break"),
        CalcField("time-cleanup", "Time Cleanup"),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-transportation-parking-calculator", "Event Transportation Planner", "event_budget",
    "Event Transportation Planner",
    fields=[
        CalcField("transp-guests", "Transp Guests"),
        CalcField("cost-shuttle", "Cost Shuttle"),
        CalcField("cost-parking", "Cost Parking"),
        CalcField("cost-valet", "Cost Valet"),
        CalcField("shuttle-type", "Shuttle Type", type="select", options=[{"value": "Sprinter Van (14 pax)", "label": "Sprinter Van (14 pax)"}, {"value": "Mini Bus (28 pax)", "label": "Mini Bus (28 pax)"}, {"value": "Coach Bus (55 pax)", "label": "Coach Bus (55 pax)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-travel-accommodation-calculator", "VIP Travel & Lodging Calculator", "event_budget",
    "VIP Travel & Lodging Calculator",
    fields=[
        CalcField("vip-count", "Vip Count"),
        CalcField("hotel-rate", "Hotel Rate"),
        CalcField("add-stipend", "Add Stipend"),
        CalcField("air-class", "Air Class", type="select", options=[{"value": "Coach / Economy ($550)", "label": "Coach / Economy ($550)"}, {"value": "Business Class ($1,200)", "label": "Business Class ($1,200)"}, {"value": "International / First ($3,500)", "label": "International / First ($3,500)"}]),
        CalcField("hotel-nights", "Hotel Nights", type="select", options=[{"value": "1 Night", "label": "1 Night"}, {"value": "2 Nights", "label": "2 Nights"}, {"value": "3 Nights", "label": "3 Nights"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-waste-management-bin-calculator", "Event Waste Planner", "event_budget",
    "Event Waste Planner",
    fields=[
        CalcField("waste-guests", "Waste Guests"),
        CalcField("waste-hours", "Waste Hours"),
        CalcField("has-recycle", "Has Recycle"),
        CalcField("has-compost", "Has Compost"),
        CalcField("waste-style", "Waste Style", type="select", options=[{"value": "Light Snacks (0.5 lb/guest)", "label": "Light Snacks (0.5 lb/guest)"}, {"value": "Full Meal (1.5 lb/guest)", "label": "Full Meal (1.5 lb/guest)"}, {"value": "Heavy Festival (2.5 lb/guest)", "label": "Heavy Festival (2.5 lb/guest)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "event-wi-fi-bandwidth-calculator", "Event Bandwidth Planner", "event_budget",
    "Event Bandwidth Planner",
    fields=[
        CalcField("net-guests", "Net Guests"),
        CalcField("net-ops-check", "Net Ops Check"),
        CalcField("net-density", "Net Density", type="select", options=[{"value": "1 Device per person", "label": "1 Device per person"}, {"value": "1.5 Devices (Typical)", "label": "1.5 Devices (Typical)"}, {"value": "2+ Devices (Tech Conf)", "label": "2+ Devices (Tech Conf)"}]),
        CalcField("net-intensity", "Net Intensity", type="select", options=[{"value": "Light (Emails only)", "label": "Light (Emails only)"}, {"value": "Moderate (Social Media)", "label": "Moderate (Social Media)"}, {"value": "Heavy (Video Apps)", "label": "Heavy (Video Apps)"}]),
        CalcField("net-stream", "Net Stream", type="select", options=[{"value": "No Streaming", "label": "No Streaming"}, {"value": "1x HD Stream (6 Mbps)", "label": "1x HD Stream (6 Mbps)"}, {"value": "1x 4K Stream (15 Mbps)", "label": "1x 4K Stream (15 Mbps)"}, {"value": "Dual Multi-Stream (30 Mbps)", "label": "Dual Multi-Stream (30 Mbps)"}]),
    ],
    fn=_js_calc,
)

register_calculator(
    "guest-list-cost-per-person-calculator", "Cost Per Person Calculator", "event_budget",
    "Cost Per Person Calculator",
    fields=[
        CalcField("guest-count", "Guest Count"),
        CalcField("cost-fixed", "Cost Fixed"),
        CalcField("cost-food", "Cost Food"),
        CalcField("cost-extras", "Cost Extras"),
    ],
    fn=_js_calc,
)

register_calculator(
    "party-budget-calculator", "Party Budget Planner", "event_budget",
    "Party Budget Planner",
    fields=[
        CalcField("target-party-budget", "Target Party Budget"),
        CalcField("p-cost-core", "P Cost Core"),
        CalcField("p-cost-sweet", "P Cost Sweet"),
        CalcField("p-cost-fun", "P Cost Fun"),
        CalcField("p-cost-style", "P Cost Style"),
    ],
    fn=_js_calc,
)

register_calculator(
    "ticket-price-break-even-calculator", "Ticket Price Calculator", "event_budget",
    "Ticket Price Calculator",
    fields=[
        CalcField("calc-guests", "Calc Guests"),
        CalcField("cost-fixed", "Cost Fixed"),
        CalcField("cost-variable", "Cost Variable"),
        CalcField("target-profit", "Target Profit"),
    ],
    fn=_js_calc,
)

register_calculator(
    "venue-capacity-calculator", "Venue Capacity Planner", "event_budget",
    "Venue Capacity Planner",
    fields=[
        CalcField("total-sqft", "Total Sqft"),
    ],
    fn=_js_calc,
)

register_calculator(
    "wedding-budget-calculator", "Wedding Budget Planner", "event_budget",
    "Wedding Budget Planner",
    fields=[
        CalcField("target-wedding-budget", "Target Wedding Budget"),
        CalcField("cost-venue", "Cost Venue"),
        CalcField("cost-attire", "Cost Attire"),
        CalcField("cost-media", "Cost Media"),
        CalcField("cost-decor", "Cost Decor"),
        CalcField("cost-other", "Cost Other"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cino-long-1", "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 2, 6)", "garments",
    "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 2, 6)",
    fields=[
        CalcField("shrinkage_length", "Shrinkage Length (%)"),
        CalcField("shrinkage_width", "Shrinkage Width (%)"),
        CalcField("fabric_width", "Fabric Width (Inch)"),
        CalcField("waist_relaxed", "Waist (RELAXED)"),
        CalcField("waistband_height", "Waistband height"),
        CalcField("hip_measurement", "Hip (15 cm below WB seam, WB excluded)"),
        CalcField("thigh_crotch_level", "Thigh at crotch level (2.5cm down)"),
        CalcField("knee_width", "Knee width"),
        CalcField("leg_opening_hem", "Leg opening (hem)"),
        CalcField("inseam", "Inseam"),
        CalcField("front_rise_excl_wb", "Front rise, WB excluded"),
        CalcField("back_rise_excl_wb", "Back rise, WB excluded"),
        CalcField("hem_height", "Hem Height"),
        CalcField("back_pocket_top_width", "Back pocket top width"),
        CalcField("back_pocket_height_center", "Back pocket height at center"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cino-long-10", "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)", "garments",
    "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)",
    fields=[
        CalcField("shrinkage_length", "Shrinkage Length (%)"),
        CalcField("shrinkage_width", "Shrinkage Width (%)"),
        CalcField("fabric_width", "Fabric Width (cm)"),
        CalcField("waist_relaxed", "Waist (RELAXED)"),
        CalcField("waistband_height", "Waistband height"),
        CalcField("hip_measurement", "Hip (15 cm below WB seam, WB excluded)"),
        CalcField("thigh_crotch_level", "Thigh at crotch level (2.5cm down)"),
        CalcField("knee_width", "Knee width"),
        CalcField("leg_opening_hem", "Leg opening (hem)"),
        CalcField("inseam", "Inseam"),
        CalcField("front_rise_excl_wb", "Front rise, WB excluded"),
        CalcField("back_rise_excl_wb", "Back rise, WB excluded"),
        CalcField("hem_height", "Hem Height"),
        CalcField("back_pocket_top_width", "Back pocket top width"),
        CalcField("back_pocket_height_center", "Back pocket height at center"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cino-long-2", "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 3, 7)", "garments",
    "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 3, 7)",
    fields=[
        CalcField("shrinkage_length", "Shrinkage Length (%)"),
        CalcField("shrinkage_width", "Shrinkage Width (%)"),
        CalcField("fabric_width", "Fabric Width (cm)"),
        CalcField("waist_relaxed", "Waist (RELAXED)"),
        CalcField("waistband_height", "Waistband height"),
        CalcField("hip_measurement", "Hip (15 cm below WB seam, WB excluded)"),
        CalcField("thigh_crotch_level", "Thigh at crotch level (2.5cm down)"),
        CalcField("knee_width", "Knee width"),
        CalcField("leg_opening_hem", "Leg opening (hem)"),
        CalcField("inseam", "Inseam"),
        CalcField("front_rise_excl_wb", "Front rise, WB excluded"),
        CalcField("back_rise_excl_wb", "Back rise, WB excluded"),
        CalcField("hem_height", "Hem Height"),
        CalcField("back_pocket_top_width", "Back pocket top width"),
        CalcField("back_pocket_height_center", "Back pocket height at center"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cino-long-3", "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)", "garments",
    "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)",
    fields=[
        CalcField("shrinkage_length", "Shrinkage Length (%)"),
        CalcField("shrinkage_width", "Shrinkage Width (%)"),
        CalcField("fabric_width", "Fabric Width (cm)"),
        CalcField("waist_relaxed", "Waist (RELAXED)"),
        CalcField("waistband_height", "Waistband height"),
        CalcField("hip_measurement", "Hip (15 cm below WB seam, WB excluded)"),
        CalcField("thigh_crotch_level", "Thigh at crotch level (2.5cm down)"),
        CalcField("knee_width", "Knee width"),
        CalcField("leg_opening_hem", "Leg opening (hem)"),
        CalcField("inseam", "Inseam"),
        CalcField("front_rise_excl_wb", "Front rise, WB excluded"),
        CalcField("back_rise_excl_wb", "Back rise, WB excluded"),
        CalcField("hem_height", "Hem Height"),
        CalcField("back_pocket_top_width", "Back pocket top width"),
        CalcField("back_pocket_height_center", "Back pocket height at center"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cino-long-4", "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)", "garments",
    "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)",
    fields=[
        CalcField("shrinkage_length", "Shrinkage Length (%)"),
        CalcField("shrinkage_width", "Shrinkage Width (%)"),
        CalcField("fabric_width", "Fabric Width (cm)"),
        CalcField("waist_relaxed", "Waist (RELAXED)"),
        CalcField("waistband_height", "Waistband height"),
        CalcField("hip_measurement", "Hip (15 cm below WB seam, WB excluded)"),
        CalcField("thigh_crotch_level", "Thigh at crotch level (2.5cm down)"),
        CalcField("knee_width", "Knee width"),
        CalcField("leg_opening_hem", "Leg opening (hem)"),
        CalcField("inseam", "Inseam"),
        CalcField("front_rise_excl_wb", "Front rise, WB excluded"),
        CalcField("back_rise_excl_wb", "Back rise, WB excluded"),
        CalcField("hem_height", "Hem Height"),
        CalcField("back_pocket_top_width", "Back pocket top width"),
        CalcField("back_pocket_height_center", "Back pocket height at center"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cino-long-5", "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 8)", "garments",
    "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 8)",
    fields=[
        CalcField("shrinkage_length", "Shrinkage Length (%)"),
        CalcField("shrinkage_width", "Shrinkage Width (%)"),
        CalcField("fabric_width", "Fabric Width (cm)"),
        CalcField("waist_relaxed", "Waist (RELAXED)"),
        CalcField("waistband_height", "Waistband height"),
        CalcField("hip_measurement", "Hip (15 cm below WB seam, WB excluded)"),
        CalcField("thigh_crotch_level", "Thigh at crotch level (2.5cm down)"),
        CalcField("knee_width", "Knee width"),
        CalcField("leg_opening_hem", "Leg opening (hem)"),
        CalcField("inseam", "Inseam"),
        CalcField("front_rise_excl_wb", "Front rise, WB excluded"),
        CalcField("back_rise_excl_wb", "Back rise, WB excluded"),
        CalcField("hem_height", "Hem Height"),
        CalcField("back_pocket_top_width", "Back pocket top width"),
        CalcField("back_pocket_height_center", "Back pocket height at center"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cino-long-6", "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)", "garments",
    "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)",
    fields=[
        CalcField("shrinkage_length", "Shrinkage Length (%)"),
        CalcField("shrinkage_width", "Shrinkage Width (%)"),
        CalcField("fabric_width", "Fabric Width (cm)"),
        CalcField("waist_relaxed", "Waist (RELAXED)"),
        CalcField("waistband_height", "Waistband height"),
        CalcField("hip_measurement", "Hip (15 cm below WB seam, WB excluded)"),
        CalcField("thigh_crotch_level", "Thigh at crotch level (2.5cm down)"),
        CalcField("knee_width", "Knee width"),
        CalcField("leg_opening_hem", "Leg opening (hem)"),
        CalcField("inseam", "Inseam"),
        CalcField("front_rise_excl_wb", "Front rise, WB excluded"),
        CalcField("back_rise_excl_wb", "Back rise, WB excluded"),
        CalcField("hem_height", "Hem Height"),
        CalcField("back_pocket_top_width", "Back pocket top width"),
        CalcField("back_pocket_height_center", "Back pocket height at center"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cino-long-7", "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)", "garments",
    "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)",
    fields=[
        CalcField("shrinkage_length", "Shrinkage Length (%)"),
        CalcField("shrinkage_width", "Shrinkage Width (%)"),
        CalcField("fabric_width", "Fabric Width (cm)"),
        CalcField("waist_relaxed", "Waist (RELAXED)"),
        CalcField("waistband_height", "Waistband height"),
        CalcField("hip_measurement", "Hip (15 cm below WB seam, WB excluded)"),
        CalcField("thigh_crotch_level", "Thigh at crotch level (2.5cm down)"),
        CalcField("knee_width", "Knee width"),
        CalcField("leg_opening_hem", "Leg opening (hem)"),
        CalcField("inseam", "Inseam"),
        CalcField("front_rise_excl_wb", "Front rise, WB excluded"),
        CalcField("back_rise_excl_wb", "Back rise, WB excluded"),
        CalcField("hem_height", "Hem Height"),
        CalcField("back_pocket_top_width", "Back pocket top width"),
        CalcField("back_pocket_height_center", "Back pocket height at center"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cino-long-8", "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)", "garments",
    "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)",
    fields=[
        CalcField("shrinkage_length", "Shrinkage Length (%)"),
        CalcField("shrinkage_width", "Shrinkage Width (%)"),
        CalcField("fabric_width", "Fabric Width (cm)"),
        CalcField("waist_relaxed", "Waist (RELAXED)"),
        CalcField("waistband_height", "Waistband height"),
        CalcField("hip_measurement", "Hip (15 cm below WB seam, WB excluded)"),
        CalcField("thigh_crotch_level", "Thigh at crotch level (2.5cm down)"),
        CalcField("knee_width", "Knee width"),
        CalcField("leg_opening_hem", "Leg opening (hem)"),
        CalcField("inseam", "Inseam"),
        CalcField("front_rise_excl_wb", "Front rise, WB excluded"),
        CalcField("back_rise_excl_wb", "Back rise, WB excluded"),
        CalcField("hem_height", "Hem Height"),
        CalcField("back_pocket_top_width", "Back pocket top width"),
        CalcField("back_pocket_height_center", "Back pocket height at center"),
    ],
    fn=_js_calc,
)

register_calculator(
    "cino-long-9", "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)", "garments",
    "Cino Long 5 PKT Pant Fabric Consumption (Calculation Sheet 4)",
    fields=[
        CalcField("shrinkage_length", "Shrinkage Length (%)"),
        CalcField("shrinkage_width", "Shrinkage Width (%)"),
        CalcField("fabric_width", "Fabric Width (cm)"),
        CalcField("waist_relaxed", "Waist (RELAXED)"),
        CalcField("waistband_height", "Waistband height"),
        CalcField("hip_measurement", "Hip (15 cm below WB seam, WB excluded)"),
        CalcField("thigh_crotch_level", "Thigh at crotch level (2.5cm down)"),
        CalcField("knee_width", "Knee width"),
        CalcField("leg_opening_hem", "Leg opening (hem)"),
        CalcField("inseam", "Inseam"),
        CalcField("front_rise_excl_wb", "Front rise, WB excluded"),
        CalcField("back_rise_excl_wb", "Back rise, WB excluded"),
        CalcField("hem_height", "Hem Height"),
        CalcField("back_pocket_top_width", "Back pocket top width"),
        CalcField("back_pocket_height_center", "Back pocket height at center"),
    ],
    fn=_js_calc,
)

# Total registered: 490

# === NEW CALCULATORS FROM CALCULATOR.NET ===
register_calculator(
    "401k-calculator", "401K Calculator", "finance",
    "401K Calculator",
    fields=[
        CalcField("current-age", "Current Age", "number"),
        CalcField("retirement-age", "Retirement Age", "number"),
        CalcField("current-savings", "Current Savings", "number"),
        CalcField("annual-contribution", "Annual Contribution", "number"),
        CalcField("employer-match", "Employer Match", "number"),
        CalcField("expected-return", "Expected Return", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "amortization-calculator", "Amortization Calculator", "finance",
    "Amortization Calculator",
    fields=[
        CalcField("loan-amount", "Loan Amount", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number"),
        CalcField("start-date", "Start Date", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "annuity-calculator", "Annuity Calculator", "finance",
    "Annuity Calculator",
    fields=[
        CalcField("principal", "Principal", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("years", "Years", "number"),
        CalcField("payment-frequency", "Payment Frequency", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "apr-calculator", "Apr Calculator", "finance",
    "Apr Calculator",
    fields=[
        CalcField("loan-amount", "Loan Amount", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("fees", "Fees", "number"),
        CalcField("loan-term", "Loan Term", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "auto-lease-calculator", "Auto Lease Calculator", "finance",
    "Auto Lease Calculator",
    fields=[
        CalcField("vehicle-price", "Vehicle Price", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("lease-term", "Lease Term", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("residual-value", "Residual Value", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "auto-loan-calculator", "Auto Loan Calculator", "finance",
    "Auto Loan Calculator",
    fields=[
        CalcField("vehicle-price", "Vehicle Price", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("loan-term", "Loan Term", "number"),
        CalcField("interest-rate", "Interest Rate", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "average-return-calculator", "Average Return Calculator", "finance",
    "Average Return Calculator",
    fields=[
        CalcField("initial-investment", "Initial Investment", "number"),
        CalcField("final-value", "Final Value", "number"),
        CalcField("years", "Years", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "boat-loan-calculator", "Boat Loan Calculator", "finance",
    "Boat Loan Calculator",
    fields=[
        CalcField("boat-price", "Boat Price", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("loan-term", "Loan Term", "number"),
        CalcField("interest-rate", "Interest Rate", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "bond-calculator", "Bond Calculator", "finance",
    "Bond Calculator",
    fields=[
        CalcField("face-value", "Face Value", "number"),
        CalcField("coupon-rate", "Coupon Rate", "number"),
        CalcField("years-to-maturity", "Years To Maturity", "number"),
        CalcField("market-rate", "Market Rate", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "canadian-mortgage-calculator", "Canadian Mortgage Calculator", "finance",
    "Canadian Mortgage Calculator",
    fields=[
        CalcField("home-price", "Home Price", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("amortization-period", "Amortization Period", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "cash-back-or-low-interest-calculator", "Cash Back Or Low Interest Calculator", "finance",
    "Cash Back Or Low Interest Calculator",
    fields=[
        CalcField("loan-amount", "Loan Amount", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("cash-back", "Cash Back", "number"),
        CalcField("loan-term", "Loan Term", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "cd-calculator", "Cd Calculator", "finance",
    "Cd Calculator",
    fields=[
        CalcField("deposit-amount", "Deposit Amount", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("term", "Term", "number"),
        CalcField("compounding-frequency", "Compounding Frequency", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "college-cost-calculator", "College Cost Calculator", "finance",
    "College Cost Calculator",
    fields=[
        CalcField("current-age", "Current Age", "number"),
        CalcField("college-start-age", "College Start Age", "number"),
        CalcField("years-in-college", "Years In College", "number"),
        CalcField("annual-cost", "Annual Cost", "number"),
        CalcField("inflation-rate", "Inflation Rate", "number"),
        CalcField("current-savings", "Current Savings", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "commission-calculator", "Commission Calculator", "finance",
    "Commission Calculator",
    fields=[
        CalcField("sale-price", "Sale Price", "number"),
        CalcField("commission-rate", "Commission Rate", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "compound-interest-calculator", "Compound Interest Calculator", "finance",
    "Compound Interest Calculator",
    fields=[
        CalcField("principal", "Principal", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("years", "Years", "number"),
        CalcField("compounding-frequency", "Compounding Frequency", "number"),
        CalcField("monthly-contribution", "Monthly Contribution", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "credit-card-calculator", "Credit Card Calculator", "finance",
    "Credit Card Calculator",
    fields=[
        CalcField("balance", "Balance", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("monthly-payment", "Monthly Payment", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "credit-card-payoff-calculator", "Credit Card Payoff Calculator", "finance",
    "Credit Card Payoff Calculator",
    fields=[
        CalcField("balance", "Balance", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("monthly-payment", "Monthly Payment", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "debt-consolidation-calculator", "Debt Consolidation Calculator", "finance",
    "Debt Consolidation Calculator",
    fields=[
        CalcField("total-debt", "Total Debt", "number"),
        CalcField("current-rate", "Current Rate", "number"),
        CalcField("new-rate", "New Rate", "number"),
        CalcField("loan-term", "Loan Term", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "debt-payoff-calculator", "Debt Payoff Calculator", "finance",
    "Debt Payoff Calculator",
    fields=[
        CalcField("balance", "Balance", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("monthly-payment", "Monthly Payment", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "debt-ratio-calculator", "Debt Ratio Calculator", "finance",
    "Debt Ratio Calculator",
    fields=[
        CalcField("monthly-debt", "Monthly Debt", "number"),
        CalcField("gross-income", "Gross Income", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "depreciation-calculator", "Depreciation Calculator", "finance",
    "Depreciation Calculator",
    fields=[
        CalcField("asset-cost", "Asset Cost", "number"),
        CalcField("salvage-value", "Salvage Value", "number"),
        CalcField("useful-life", "Useful Life", "number"),
        CalcField("method", "Method", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "discount-calculator", "Discount Calculator", "finance",
    "Discount Calculator",
    fields=[
        CalcField("original-price", "Original Price", "number"),
        CalcField("discount-percent", "Discount Percent", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "down-payment-calculator", "Down Payment Calculator", "finance",
    "Down Payment Calculator",
    fields=[
        CalcField("home-price", "Home Price", "number"),
        CalcField("down-payment-percent", "Down Payment Percent", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "estate-tax-calculator", "Estate Tax Calculator", "finance",
    "Estate Tax Calculator",
    fields=[
        CalcField("estate-value", "Estate Value", "number"),
        CalcField("exemption-amount", "Exemption Amount", "number"),
        CalcField("tax-rate", "Tax Rate", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "fha-loan-calculator", "Fha Loan Calculator", "finance",
    "Fha Loan Calculator",
    fields=[
        CalcField("home-price", "Home Price", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "finance-calculator", "Finance Calculator", "finance",
    "Finance Calculator",
    fields=[
        CalcField("present-value", "Present Value", "number"),
        CalcField("future-value", "Future Value", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("periods", "Periods", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "future-value-calculator", "Future Value Calculator", "finance",
    "Future Value Calculator",
    fields=[
        CalcField("present-value", "Present Value", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("periods", "Periods", "number"),
        CalcField("payment", "Payment", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "heloc-calculator", "Heloc Calculator", "finance",
    "Heloc Calculator",
    fields=[
        CalcField("home-value", "Home Value", "number"),
        CalcField("mortgage-balance", "Mortgage Balance", "number"),
        CalcField("credit-limit", "Credit Limit", "number"),
        CalcField("interest-rate", "Interest Rate", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "home-equity-loan-calculator", "Home Equity Loan Calculator", "finance",
    "Home Equity Loan Calculator",
    fields=[
        CalcField("home-value", "Home Value", "number"),
        CalcField("mortgage-balance", "Mortgage Balance", "number"),
        CalcField("loan-amount", "Loan Amount", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "house-affordability-calculator", "House Affordability Calculator", "finance",
    "House Affordability Calculator",
    fields=[
        CalcField("annual-income", "Annual Income", "number"),
        CalcField("monthly-debt", "Monthly Debt", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "inflation-calculator", "Inflation Calculator", "finance",
    "Inflation Calculator",
    fields=[
        CalcField("amount", "Amount", "number"),
        CalcField("years", "Years", "number"),
        CalcField("inflation-rate", "Inflation Rate", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "interest-calculator", "Interest Calculator", "finance",
    "Interest Calculator",
    fields=[
        CalcField("principal", "Principal", "number"),
        CalcField("rate", "Rate", "number"),
        CalcField("time", "Time", "number"),
        CalcField("compounding", "Compounding", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "interest-rate-calculator", "Interest Rate Calculator", "finance",
    "Interest Rate Calculator",
    fields=[
        CalcField("principal", "Principal", "number"),
        CalcField("rate", "Rate", "number"),
        CalcField("time", "Time", "number"),
        CalcField("compounding", "Compounding", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "investment-calculator", "Investment Calculator", "finance",
    "Investment Calculator",
    fields=[
        CalcField("initial-investment", "Initial Investment", "number"),
        CalcField("annual-return", "Annual Return", "number"),
        CalcField("years", "Years", "number"),
        CalcField("monthly-contribution", "Monthly Contribution", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "ira-calculator", "Ira Calculator", "finance",
    "Ira Calculator",
    fields=[
        CalcField("current-age", "Current Age", "number"),
        CalcField("retirement-age", "Retirement Age", "number"),
        CalcField("annual-contribution", "Annual Contribution", "number"),
        CalcField("expected-return", "Expected Return", "number"),
        CalcField("tax-rate", "Tax Rate", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "irr-calculator", "Irr Calculator", "finance",
    "Irr Calculator",
    fields=[
        CalcField("initial-investment", "Initial Investment", "number"),
        CalcField("cash-flows", "Cash Flows", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "loan-calculator", "Loan Calculator", "finance",
    "Loan Calculator",
    fields=[
        CalcField("loan-amount", "Loan Amount", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "margin-calculator", "Margin Calculator", "finance",
    "Margin Calculator",
    fields=[
        CalcField("cost", "Cost", "number"),
        CalcField("margin-percent", "Margin Percent", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "mortgage-amortization-calculator", "Mortgage Amortization Calculator", "finance",
    "Mortgage Amortization Calculator",
    fields=[
        CalcField("loan-amount", "Loan Amount", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number"),
        CalcField("start-date", "Start Date", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "mortgage-calculator", "Mortgage Calculator", "finance",
    "Mortgage Calculator",
    fields=[
        CalcField("home-price", "Home Price", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number"),
        CalcField("property-tax", "Property Tax", "number"),
        CalcField("insurance", "Insurance", "number"),
        CalcField("pmi", "Pmi", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "mortgage-calculator-uk", "Mortgage Uk Calculator", "finance",
    "Mortgage Uk Calculator",
    fields=[
        CalcField("home-price", "Home Price", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number"),
        CalcField("property-tax", "Property Tax", "number"),
        CalcField("insurance", "Insurance", "number"),
        CalcField("pmi", "Pmi", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "mortgage-payoff-calculator", "Mortgage Payoff Calculator", "finance",
    "Mortgage Payoff Calculator",
    fields=[
        CalcField("home-price", "Home Price", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number"),
        CalcField("property-tax", "Property Tax", "number"),
        CalcField("insurance", "Insurance", "number"),
        CalcField("pmi", "Pmi", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "mutual-fund-calculator", "Mutual Fund Calculator", "finance",
    "Mutual Fund Calculator",
    fields=[
        CalcField("initial-investment", "Initial Investment", "number"),
        CalcField("expected-return", "Expected Return", "number"),
        CalcField("years", "Years", "number"),
        CalcField("monthly-contribution", "Monthly Contribution", "number"),
        CalcField("expense-ratio", "Expense Ratio", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "payback-period-calculator", "Payback Period Calculator", "finance",
    "Payback Period Calculator",
    fields=[
        CalcField("initial-investment", "Initial Investment", "number"),
        CalcField("annual-cash-flow", "Annual Cash Flow", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "pension-calculator", "Pension Calculator", "finance",
    "Pension Calculator",
    fields=[
        CalcField("current-age", "Current Age", "number"),
        CalcField("retirement-age", "Retirement Age", "number"),
        CalcField("annual-salary", "Annual Salary", "number"),
        CalcField("contribution-rate", "Contribution Rate", "number"),
        CalcField("employer-match", "Employer Match", "number"),
        CalcField("expected-return", "Expected Return", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "personal-loan-calculator", "Personal Loan Calculator", "finance",
    "Personal Loan Calculator",
    fields=[
        CalcField("loan-amount", "Loan Amount", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "present-value-calculator", "Present Value Calculator", "finance",
    "Present Value Calculator",
    fields=[
        CalcField("future-value", "Future Value", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("periods", "Periods", "number"),
        CalcField("payment", "Payment", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "refinance-calculator", "Refinance Calculator", "finance",
    "Refinance Calculator",
    fields=[
        CalcField("present-value", "Present Value", "number"),
        CalcField("future-value", "Future Value", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("periods", "Periods", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "rent-vs-buy-calculator", "Rent Vs Buy Calculator", "finance",
    "Rent Vs Buy Calculator",
    fields=[
        CalcField("monthly-rent", "Monthly Rent", "number"),
        CalcField("home-price", "Home Price", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number"),
        CalcField("property-tax", "Property Tax", "number"),
        CalcField("insurance", "Insurance", "number"),
        CalcField("years", "Years", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "rental-property-calculator", "Rental Property Calculator", "finance",
    "Rental Property Calculator",
    fields=[
        CalcField("purchase-price", "Purchase Price", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number"),
        CalcField("monthly-rent", "Monthly Rent", "number"),
        CalcField("expenses", "Expenses", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "repayment-calculator", "Repayment Calculator", "finance",
    "Repayment Calculator",
    fields=[
        CalcField("loan-amount", "Loan Amount", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "retirement-calculator", "Retirement Calculator", "finance",
    "Retirement Calculator",
    fields=[
        CalcField("current-age", "Current Age", "number"),
        CalcField("retirement-age", "Retirement Age", "number"),
        CalcField("current-savings", "Current Savings", "number"),
        CalcField("annual-contribution", "Annual Contribution", "number"),
        CalcField("expected-return", "Expected Return", "number"),
        CalcField("inflation-rate", "Inflation Rate", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "roi-calculator", "Roi Calculator", "finance",
    "Roi Calculator",
    fields=[
        CalcField("investment-cost", "Investment Cost", "number"),
        CalcField("gain-from-investment", "Gain From Investment", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "roth-ira-calculator", "Roth Ira Calculator", "finance",
    "Roth Ira Calculator",
    fields=[
        CalcField("current-age", "Current Age", "number"),
        CalcField("retirement-age", "Retirement Age", "number"),
        CalcField("annual-contribution", "Annual Contribution", "number"),
        CalcField("expected-return", "Expected Return", "number"),
        CalcField("tax-rate", "Tax Rate", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "salary-calculator", "Salary Calculator", "finance",
    "Salary Calculator",
    fields=[
        CalcField("hourly-rate", "Hourly Rate", "number"),
        CalcField("hours-per-week", "Hours Per Week", "number"),
        CalcField("weeks-per-year", "Weeks Per Year", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "sales-tax-calculator", "Sales Tax Calculator", "finance",
    "Sales Tax Calculator",
    fields=[
        CalcField("amount", "Amount", "number"),
        CalcField("tax-rate", "Tax Rate", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "savings-calculator", "Savings Calculator", "finance",
    "Savings Calculator",
    fields=[
        CalcField("initial-deposit", "Initial Deposit", "number"),
        CalcField("monthly-deposit", "Monthly Deposit", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("years", "Years", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "simple-interest-calculator", "Simple Interest Calculator", "finance",
    "Simple Interest Calculator",
    fields=[
        CalcField("principal", "Principal", "number"),
        CalcField("rate", "Rate", "number"),
        CalcField("time", "Time", "number"),
        CalcField("compounding", "Compounding", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "social-security-calculator", "Social Security Calculator", "finance",
    "Social Security Calculator",
    fields=[
        CalcField("birth-year", "Birth Year", "number"),
        CalcField("current-age", "Current Age", "number"),
        CalcField("retirement-age", "Retirement Age", "number"),
        CalcField("annual-earnings", "Annual Earnings", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "student-loan-calculator", "Student Loan Calculator", "finance",
    "Student Loan Calculator",
    fields=[
        CalcField("loan-amount", "Loan Amount", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "tax-calculator", "Tax Calculator", "finance",
    "Tax Calculator",
    fields=[
        CalcField("income", "Income", "number"),
        CalcField("filing-status", "Filing Status", "number"),
        CalcField("deductions", "Deductions", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "va-mortgage-calculator", "Va Mortgage Calculator", "finance",
    "Va Mortgage Calculator",
    fields=[
        CalcField("home-price", "Home Price", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number"),
        CalcField("property-tax", "Property Tax", "number"),
        CalcField("insurance", "Insurance", "number"),
        CalcField("pmi", "Pmi", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "vat-calculator", "Vat Calculator", "finance",
    "Vat Calculator",
    fields=[
        CalcField("amount", "Amount", "number"),
        CalcField("vat-rate", "Vat Rate", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "anorexic-bmi-calculator", "Anorexic Bmi Calculator", "health",
    "Anorexic Bmi Calculator",
    fields=[
        CalcField("weight", "Weight", "number"),
        CalcField("height", "Height", "number"),
        CalcField("unit", "Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "army-body-fat-calculator", "Army Body Fat Calculator", "health",
    "Army Body Fat Calculator",
    fields=[
        CalcField("waist", "Waist", "number"),
        CalcField("neck", "Neck", "number"),
        CalcField("height", "Height", "number"),
        CalcField("gender", "Gender", "number"),
        CalcField("unit", "Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "bac-calculator", "Bac Calculator", "health",
    "Bac Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("unit", "Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "body-type-calculator", "Body Type Calculator", "health",
    "Body Type Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("unit", "Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "calorie-calculator", "Calorie Calculator", "health",
    "Calorie Calculator",
    fields=[
        CalcField("age", "Age", "number"),
        CalcField("gender", "Gender", "number"),
        CalcField("weight", "Weight", "number"),
        CalcField("height", "Height", "number"),
        CalcField("activity-level", "Activity Level", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "calories-burned-calculator", "Calories Burned Calculator", "health",
    "Calories Burned Calculator",
    fields=[
        CalcField("age", "Age", "number"),
        CalcField("gender", "Gender", "number"),
        CalcField("weight", "Weight", "number"),
        CalcField("height", "Height", "number"),
        CalcField("activity-level", "Activity Level", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "carbohydrate-calculator", "Carbohydrate Calculator", "health",
    "Carbohydrate Calculator",
    fields=[
        CalcField("weight", "Weight", "number"),
        CalcField("activity-level", "Activity Level", "number"),
        CalcField("goal", "Goal", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "conception-calculator", "Conception Calculator", "health",
    "Conception Calculator",
    fields=[
        CalcField("due-date", "Due Date", "number"),
        CalcField("cycle-length", "Cycle Length", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "due-date-calculator", "Due Date Calculator", "health",
    "Due Date Calculator",
    fields=[
        CalcField("lmp", "Lmp", "number"),
        CalcField("cycle-length", "Cycle Length", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "fat-intake-calculator", "Fat Intake Calculator", "health",
    "Fat Intake Calculator",
    fields=[
        CalcField("calories", "Calories", "number"),
        CalcField("fat-percent", "Fat Percent", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "fitness-and-health-calculator", "Fitness And Health Calculator", "health",
    "Fitness And Health Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("unit", "Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "gfr-calculator", "Gfr Calculator", "health",
    "Gfr Calculator",
    fields=[
        CalcField("age", "Age", "number"),
        CalcField("gender", "Gender", "number"),
        CalcField("creatinine", "Creatinine", "number"),
        CalcField("race", "Race", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "healthy-weight-calculator", "Healthy Weight Calculator", "health",
    "Healthy Weight Calculator",
    fields=[
        CalcField("height", "Height", "number"),
        CalcField("gender", "Gender", "number"),
        CalcField("frame", "Frame", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "ideal-weight-calculator", "Ideal Weight Calculator", "health",
    "Ideal Weight Calculator",
    fields=[
        CalcField("height", "Height", "number"),
        CalcField("gender", "Gender", "number"),
        CalcField("formula", "Formula", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "lean-body-mass-calculator", "Lean Body Mass Calculator", "health",
    "Lean Body Mass Calculator",
    fields=[
        CalcField("weight", "Weight", "number"),
        CalcField("body-fat-percent", "Body Fat Percent", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "macro-calculator", "Macro Calculator", "health",
    "Macro Calculator",
    fields=[
        CalcField("calories", "Calories", "number"),
        CalcField("protein-percent", "Protein Percent", "number"),
        CalcField("carb-percent", "Carb Percent", "number"),
        CalcField("fat-percent", "Fat Percent", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "molecular-weight-calculator", "Molecular Weight Calculator", "health",
    "Molecular Weight Calculator",
    fields=[
        CalcField("formula", "Formula", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "one-rep-max-calculator", "One Rep Max Calculator", "health",
    "One Rep Max Calculator",
    fields=[
        CalcField("weight", "Weight", "number"),
        CalcField("reps", "Reps", "number"),
        CalcField("formula", "Formula", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "overweight-calculator", "Overweight Calculator", "health",
    "Overweight Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("unit", "Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "ovulation-calculator", "Ovulation Calculator", "health",
    "Ovulation Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("unit", "Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "pace-calculator", "Pace Calculator", "health",
    "Pace Calculator",
    fields=[
        CalcField("distance", "Distance", "number"),
        CalcField("time", "Time", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "period-calculator", "Period Calculator", "health",
    "Period Calculator",
    fields=[
        CalcField("last-period", "Last Period", "number"),
        CalcField("cycle-length", "Cycle Length", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "pregnancy-calculator", "Pregnancy Calculator", "health",
    "Pregnancy Calculator",
    fields=[
        CalcField("lmp", "Lmp", "number"),
        CalcField("cycle-length", "Cycle Length", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "pregnancy-conception-calculator", "Pregnancy Conception Calculator", "health",
    "Pregnancy Conception Calculator",
    fields=[
        CalcField("due-date", "Due Date", "number"),
        CalcField("cycle-length", "Cycle Length", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "pregnancy-weight-gain-calculator", "Pregnancy Weight Gain Calculator", "health",
    "Pregnancy Weight Gain Calculator",
    fields=[
        CalcField("lmp", "Lmp", "number"),
        CalcField("cycle-length", "Cycle Length", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "protein-calculator", "Protein Calculator", "health",
    "Protein Calculator",
    fields=[
        CalcField("weight", "Weight", "number"),
        CalcField("activity-level", "Activity Level", "number"),
        CalcField("goal", "Goal", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "sleep-calculator", "Sleep Calculator", "health",
    "Sleep Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("unit", "Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "target-heart-rate-calculator", "Target Heart Rate Calculator", "health",
    "Target Heart Rate Calculator",
    fields=[
        CalcField("age", "Age", "number"),
        CalcField("resting-heart-rate", "Resting Heart Rate", "number"),
        CalcField("intensity", "Intensity", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "tdee-calculator", "Tdee Calculator", "health",
    "Tdee Calculator",
    fields=[
        CalcField("age", "Age", "number"),
        CalcField("gender", "Gender", "number"),
        CalcField("weight", "Weight", "number"),
        CalcField("height", "Height", "number"),
        CalcField("activity-level", "Activity Level", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "weight-calculator", "Weight Calculator", "health",
    "Weight Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("unit", "Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "weight-watchers-points-calculator", "Weight Watchers Points Calculator", "health",
    "Weight Watchers Points Calculator",
    fields=[
        CalcField("food-points", "Food Points", "number"),
        CalcField("daily-allowance", "Daily Allowance", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "btu-calculator", "Btu Calculator", "construction",
    "Btu Calculator",
    fields=[
        CalcField("room-area", "Room Area", "number"),
        CalcField("ceiling-height", "Ceiling Height", "number"),
        CalcField("insulation", "Insulation", "number"),
        CalcField("climate", "Climate", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "circle-calculator", "Circle Calculator", "construction",
    "Circle Calculator",
    fields=[
        CalcField("radius", "Radius", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "concrete-calculator", "Concrete Calculator", "construction",
    "Concrete Calculator",
    fields=[
        CalcField("length", "Length", "number"),
        CalcField("width", "Width", "number"),
        CalcField("depth", "Depth", "number"),
        CalcField("unit", "Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "density-calculator", "Density Calculator", "construction",
    "Density Calculator",
    fields=[
        CalcField("length", "Length", "number"),
        CalcField("width", "Width", "number"),
        CalcField("height", "Height", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "electricity-calculator", "Electricity Calculator", "construction",
    "Electricity Calculator",
    fields=[
        CalcField("voltage", "Voltage", "number"),
        CalcField("current", "Current", "number"),
        CalcField("power-factor", "Power Factor", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "engine-horsepower-calculator", "Engine Horsepower Calculator", "construction",
    "Engine Horsepower Calculator",
    fields=[
        CalcField("torque", "Torque", "number"),
        CalcField("rpm", "Rpm", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "fuel-cost-calculator", "Fuel Cost Calculator", "construction",
    "Fuel Cost Calculator",
    fields=[
        CalcField("distance", "Distance", "number"),
        CalcField("mpg", "Mpg", "number"),
        CalcField("fuel-price", "Fuel Price", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "gravel-calculator", "Gravel Calculator", "construction",
    "Gravel Calculator",
    fields=[
        CalcField("length", "Length", "number"),
        CalcField("width", "Width", "number"),
        CalcField("depth", "Depth", "number"),
        CalcField("density", "Density", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "horsepower-calculator", "Horsepower Calculator", "construction",
    "Horsepower Calculator",
    fields=[
        CalcField("weight", "Weight", "number"),
        CalcField("quarter-mile-time", "Quarter Mile Time", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "molarity-calculator", "Molarity Calculator", "construction",
    "Molarity Calculator",
    fields=[
        CalcField("moles", "Moles", "number"),
        CalcField("volume", "Volume", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "mulch-calculator", "Mulch Calculator", "construction",
    "Mulch Calculator",
    fields=[
        CalcField("area", "Area", "number"),
        CalcField("depth", "Depth", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "ohms-law-calculator", "Ohms Law Calculator", "construction",
    "Ohms Law Calculator",
    fields=[
        CalcField("voltage", "Voltage", "number"),
        CalcField("current", "Current", "number"),
        CalcField("resistance", "Resistance", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "pythagorean-theorem-calculator", "Pythagorean Theorem Calculator", "construction",
    "Pythagorean Theorem Calculator",
    fields=[
        CalcField("a", "A", "number"),
        CalcField("b", "B", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "resistor-calculator", "Resistor Calculator", "construction",
    "Resistor Calculator",
    fields=[
        CalcField("band1", "Band1", "number"),
        CalcField("band2", "Band2", "number"),
        CalcField("band3", "Band3", "number"),
        CalcField("band4", "Band4", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "right-triangle-calculator", "Right Triangle Calculator", "construction",
    "Right Triangle Calculator",
    fields=[
        CalcField("side-a", "Side A", "number"),
        CalcField("side-b", "Side B", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "roofing-calculator", "Roofing Calculator", "construction",
    "Roofing Calculator",
    fields=[
        CalcField("roof-area", "Roof Area", "number"),
        CalcField("pitch", "Pitch", "number"),
        CalcField("material", "Material", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "square-footage-calculator", "Square Footage Calculator", "construction",
    "Square Footage Calculator",
    fields=[
        CalcField("length", "Length", "number"),
        CalcField("width", "Width", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "stair-calculator", "Stair Calculator", "construction",
    "Stair Calculator",
    fields=[
        CalcField("total-rise", "Total Rise", "number"),
        CalcField("total-run", "Total Run", "number"),
        CalcField("tread-depth", "Tread Depth", "number"),
        CalcField("riser-height", "Riser Height", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "surface-area-calculator", "Surface Area Calculator", "construction",
    "Surface Area Calculator",
    fields=[
        CalcField("length", "Length", "number"),
        CalcField("width", "Width", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "tile-calculator", "Tile Calculator", "construction",
    "Tile Calculator",
    fields=[
        CalcField("floor-length", "Floor Length", "number"),
        CalcField("floor-width", "Floor Width", "number"),
        CalcField("tile-size", "Tile Size", "number"),
        CalcField("grout-width", "Grout Width", "number"),
        CalcField("waste-percent", "Waste Percent", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "triangle-calculator", "Triangle Calculator", "construction",
    "Triangle Calculator",
    fields=[
        CalcField("base", "Base", "number"),
        CalcField("height", "Height", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "voltage-drop-calculator", "Voltage Drop Calculator", "construction",
    "Voltage Drop Calculator",
    fields=[
        CalcField("wire-length", "Wire Length", "number"),
        CalcField("current", "Current", "number"),
        CalcField("wire-gauge", "Wire Gauge", "number"),
        CalcField("voltage", "Voltage", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "volume-calculator", "Volume Calculator", "construction",
    "Volume Calculator",
    fields=[
        CalcField("length", "Length", "number"),
        CalcField("width", "Width", "number"),
        CalcField("height", "Height", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "basic-calculator", "Basic Calculator", "basic",
    "Basic Calculator",
    fields=[
        CalcField("expression", "Expression", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "calculators-for-your-site", "Calculators For Your Site Calculator", "basic",
    "Calculators For Your Site Calculator",
    fields=[
        CalcField("input", "Input", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "currency-calculator", "Currency Calculator", "basic",
    "Currency Calculator",
    fields=[
        CalcField("amount", "Amount", "number"),
        CalcField("from-currency", "From Currency", "number"),
        CalcField("to-currency", "To Currency", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "day-of-the-week-calculator", "Day Of The Week Calculator", "basic",
    "Day Of The Week Calculator",
    fields=[
        CalcField("input", "Input", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "financial-calculator", "Financial Calculator", "basic",
    "Financial Calculator",
    fields=[
        CalcField("input", "Input", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "gdp-calculator", "Gdp Calculator", "basic",
    "Gdp Calculator",
    fields=[
        CalcField("consumption", "Consumption", "number"),
        CalcField("investment", "Investment", "number"),
        CalcField("government", "Government", "number"),
        CalcField("exports", "Exports", "number"),
        CalcField("imports", "Imports", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "half-life-calculator", "Half Life Calculator", "basic",
    "Half Life Calculator",
    fields=[
        CalcField("initial-amount", "Initial Amount", "number"),
        CalcField("half-life", "Half Life", "number"),
        CalcField("time", "Time", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "ip-subnet-calculator", "Ip Subnet Calculator", "basic",
    "Ip Subnet Calculator",
    fields=[
        CalcField("ip-address", "Ip Address", "number"),
        CalcField("subnet-mask", "Subnet Mask", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "lease-calculator", "Lease Calculator", "basic",
    "Lease Calculator",
    fields=[
        CalcField("vehicle-price", "Vehicle Price", "number"),
        CalcField("residual-value", "Residual Value", "number"),
        CalcField("money-factor", "Money Factor", "number"),
        CalcField("lease-term", "Lease Term", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("sales-tax", "Sales Tax", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "long-division-calculator", "Long Division Calculator", "basic",
    "Long Division Calculator",
    fields=[
        CalcField("dividend", "Dividend", "number"),
        CalcField("divisor", "Divisor", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "other-calculator", "Other Calculator", "basic",
    "Other Calculator",
    fields=[
        CalcField("input", "Input", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "payment-calculator", "Payment Calculator", "basic",
    "Payment Calculator",
    fields=[
        CalcField("loan-amount", "Loan Amount", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "rmd-calculator", "Rmd Calculator", "basic",
    "Rmd Calculator",
    fields=[
        CalcField("account-balance", "Account Balance", "number"),
        CalcField("age", "Age", "number"),
        CalcField("beneficiary-age", "Beneficiary Age", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "take-home-pay-calculator", "Take Home Pay Calculator", "basic",
    "Take Home Pay Calculator",
    fields=[
        CalcField("gross-pay", "Gross Pay", "number"),
        CalcField("filing-status", "Filing Status", "number"),
        CalcField("allowances", "Allowances", "number"),
        CalcField("state", "State", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "bra-size-calculator", "Bra Size Calculator", "garments",
    "Bra Size Calculator",
    fields=[
        CalcField("band-size", "Band Size", "number"),
        CalcField("bust-size", "Bust Size", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "tire-size-calculator", "Tire Size Calculator", "garments",
    "Tire Size Calculator",
    fields=[
        CalcField("width", "Width", "number"),
        CalcField("aspect-ratio", "Aspect Ratio", "number"),
        CalcField("rim-diameter", "Rim Diameter", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "average-calculator", "Average Calculator", "conversion",
    "Average Calculator",
    fields=[
        CalcField("values", "Values", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "bandwidth-calculator", "Bandwidth Calculator", "conversion",
    "Bandwidth Calculator",
    fields=[
        CalcField("amount", "Amount", "number"),
        CalcField("from-unit", "From Unit", "number"),
        CalcField("to-unit", "To Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "big-number-calculator", "Big Number Calculator", "conversion",
    "Big Number Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("from-unit", "From Unit", "number"),
        CalcField("to-unit", "To Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "binary-calculator", "Binary Calculator", "conversion",
    "Binary Calculator",
    fields=[
        CalcField("number", "Number", "number"),
        CalcField("from-base", "From Base", "number"),
        CalcField("to-base", "To Base", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "common-factor-calculator", "Common Factor Calculator", "conversion",
    "Common Factor Calculator",
    fields=[
        CalcField("number", "Number", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "confidence-interval-calculator", "Confidence Interval Calculator", "conversion",
    "Confidence Interval Calculator",
    fields=[
        CalcField("sample-mean", "Sample Mean", "number"),
        CalcField("standard-deviation", "Standard Deviation", "number"),
        CalcField("sample-size", "Sample Size", "number"),
        CalcField("confidence-level", "Confidence Level", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "conversion-calculator", "Conversion Calculator", "conversion",
    "Conversion Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("from-unit", "From Unit", "number"),
        CalcField("to-unit", "To Unit", "number"),
        CalcField("category", "Category", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "distance-calculator", "Distance Calculator", "conversion",
    "Distance Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("from-unit", "From Unit", "number"),
        CalcField("to-unit", "To Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "exponent-calculator", "Exponent Calculator", "conversion",
    "Exponent Calculator",
    fields=[
        CalcField("base", "Base", "number"),
        CalcField("exponent", "Exponent", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "factor-calculator", "Factor Calculator", "conversion",
    "Factor Calculator",
    fields=[
        CalcField("number", "Number", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "fraction-calculator", "Fraction Calculator", "conversion",
    "Fraction Calculator",
    fields=[
        CalcField("numerator1", "Numerator1", "number"),
        CalcField("denominator1", "Denominator1", "number"),
        CalcField("operator", "Operator", "number"),
        CalcField("numerator2", "Numerator2", "number"),
        CalcField("denominator2", "Denominator2", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "gcf-calculator", "Gcf Calculator", "conversion",
    "Gcf Calculator",
    fields=[
        CalcField("numbers", "Numbers", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "gpa-calculator", "Gpa Calculator", "conversion",
    "Gpa Calculator",
    fields=[
        CalcField("grades", "Grades", "number"),
        CalcField("credits", "Credits", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "grade-calculator", "Grade Calculator", "conversion",
    "Grade Calculator",
    fields=[
        CalcField("score", "Score", "number"),
        CalcField("total", "Total", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "height-calculator", "Height Calculator", "conversion",
    "Height Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("from-unit", "From Unit", "number"),
        CalcField("to-unit", "To Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "hex-calculator", "Hex Calculator", "conversion",
    "Hex Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("from-base", "From Base", "number"),
        CalcField("to-base", "To Base", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "lcm-calculator", "Lcm Calculator", "conversion",
    "Lcm Calculator",
    fields=[
        CalcField("numbers", "Numbers", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "log-calculator", "Log Calculator", "conversion",
    "Log Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("base", "Base", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "mass-calculator", "Mass Calculator", "conversion",
    "Mass Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("from-unit", "From Unit", "number"),
        CalcField("to-unit", "To Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "math-calculator", "Math Calculator", "conversion",
    "Math Calculator",
    fields=[
        CalcField("expression", "Expression", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "math-calculator-for-your-site", "Math For Your Site Calculator", "conversion",
    "Math For Your Site Calculator",
    fields=[
        CalcField("expression", "Expression", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "matrix-calculator", "Matrix Calculator", "conversion",
    "Matrix Calculator",
    fields=[
        CalcField("matrix-a", "Matrix A", "number"),
        CalcField("matrix-b", "Matrix B", "number"),
        CalcField("operation", "Operation", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "mean-median-mode-range-calculator", "Mean Median Mode Range Calculator", "conversion",
    "Mean Median Mode Range Calculator",
    fields=[
        CalcField("values", "Values", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "number-sequence-calculator", "Number Sequence Calculator", "conversion",
    "Number Sequence Calculator",
    fields=[
        CalcField("start", "Start", "number"),
        CalcField("difference", "Difference", "number"),
        CalcField("count", "Count", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "p-value-calculator", "P Value Calculator", "conversion",
    "P Value Calculator",
    fields=[
        CalcField("test-statistic", "Test Statistic", "number"),
        CalcField("degrees-of-freedom", "Degrees Of Freedom", "number"),
        CalcField("test-type", "Test Type", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "percent-calculator", "Percent Calculator", "conversion",
    "Percent Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("percent", "Percent", "number"),
        CalcField("type", "Type", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "percent-error-calculator", "Percent Error Calculator", "conversion",
    "Percent Error Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("percent", "Percent", "number"),
        CalcField("type", "Type", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "percent-off-calculator", "Percent Off Calculator", "conversion",
    "Percent Off Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("percent", "Percent", "number"),
        CalcField("type", "Type", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "permutation-and-combination-calculator", "Permutation And Combination Calculator", "conversion",
    "Permutation And Combination Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("from-unit", "From Unit", "number"),
        CalcField("to-unit", "To Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "prime-factorization-calculator", "Prime Factorization Calculator", "conversion",
    "Prime Factorization Calculator",
    fields=[
        CalcField("number", "Number", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "probability-calculator", "Probability Calculator", "conversion",
    "Probability Calculator",
    fields=[
        CalcField("favorable", "Favorable", "number"),
        CalcField("total", "Total", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "quadratic-formula-calculator", "Quadratic Formula Calculator", "conversion",
    "Quadratic Formula Calculator",
    fields=[
        CalcField("a", "A", "number"),
        CalcField("b", "B", "number"),
        CalcField("c", "C", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "ratio-calculator", "Ratio Calculator", "conversion",
    "Ratio Calculator",
    fields=[
        CalcField("a", "A", "number"),
        CalcField("b", "B", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "root-calculator", "Root Calculator", "conversion",
    "Root Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("root", "Root", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "rounding-calculator", "Rounding Calculator", "conversion",
    "Rounding Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("decimals", "Decimals", "number"),
        CalcField("method", "Method", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "sample-size-calculator", "Sample Size Calculator", "conversion",
    "Sample Size Calculator",
    fields=[
        CalcField("population-size", "Population Size", "number"),
        CalcField("margin-of-error", "Margin Of Error", "number"),
        CalcField("confidence-level", "Confidence Level", "number"),
        CalcField("proportion", "Proportion", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "scientific-notation-calculator", "Scientific Notation Calculator", "conversion",
    "Scientific Notation Calculator",
    fields=[
        CalcField("value", "Value", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "slope-calculator", "Slope Calculator", "conversion",
    "Slope Calculator",
    fields=[
        CalcField("x1", "X1", "number"),
        CalcField("y1", "Y1", "number"),
        CalcField("x2", "X2", "number"),
        CalcField("y2", "Y2", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "speed-calculator", "Speed Calculator", "conversion",
    "Speed Calculator",
    fields=[
        CalcField("distance", "Distance", "number"),
        CalcField("time", "Time", "number"),
        CalcField("unit", "Unit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "standard-deviation-calculator", "Standard Deviation Calculator", "conversion",
    "Standard Deviation Calculator",
    fields=[
        CalcField("values", "Values", "number"),
        CalcField("type", "Type", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "statistics-calculator", "Statistics Calculator", "conversion",
    "Statistics Calculator",
    fields=[
        CalcField("values", "Values", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "time-zone-calculator", "Time Zone Calculator", "conversion",
    "Time Zone Calculator",
    fields=[
        CalcField("time", "Time", "number"),
        CalcField("from-zone", "From Zone", "number"),
        CalcField("to-zone", "To Zone", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "z-score-calculator", "Z Score Calculator", "conversion",
    "Z Score Calculator",
    fields=[
        CalcField("value", "Value", "number"),
        CalcField("mean", "Mean", "number"),
        CalcField("std-dev", "Std Dev", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "date-calculator", "Date Calculator", "date_time",
    "Date Calculator",
    fields=[
        CalcField("start-date", "Start Date", "number"),
        CalcField("end-date", "End Date", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "gas-mileage-calculator", "Gas Mileage Calculator", "date_time",
    "Gas Mileage Calculator",
    fields=[
        CalcField("distance", "Distance", "number"),
        CalcField("fuel-used", "Fuel Used", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "hours-calculator", "Hours Calculator", "date_time",
    "Hours Calculator",
    fields=[
        CalcField("start-time", "Start Time", "number"),
        CalcField("end-time", "End Time", "number"),
        CalcField("break-duration", "Break Duration", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "marriage-calculator", "Marriage Calculator", "date_time",
    "Marriage Calculator",
    fields=[
        CalcField("marriage-date", "Marriage Date", "number"),
        CalcField("current-date", "Current Date", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "mileage-calculator", "Mileage Calculator", "date_time",
    "Mileage Calculator",
    fields=[
        CalcField("distance", "Distance", "number"),
        CalcField("fuel-used", "Fuel Used", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "time-calculator", "Time Calculator", "date_time",
    "Time Calculator",
    fields=[
        CalcField("hours", "Hours", "number"),
        CalcField("minutes", "Minutes", "number"),
        CalcField("seconds", "Seconds", "number"),
        CalcField("operation", "Operation", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "time-card-calculator", "Time Card Calculator", "date_time",
    "Time Card Calculator",
    fields=[
        CalcField("hours", "Hours", "number"),
        CalcField("minutes", "Minutes", "number"),
        CalcField("seconds", "Seconds", "number"),
        CalcField("operation", "Operation", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "time-duration-calculator", "Time Duration Calculator", "date_time",
    "Time Duration Calculator",
    fields=[
        CalcField("a", "A", "number"),
        CalcField("b", "B", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "love-calculator-for-your-site", "Love For Your Site Calculator", "education",
    "Love For Your Site Calculator",
    fields=[
        CalcField("name1", "Name1", "number"),
        CalcField("name2", "Name2", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "scientific-calculator", "Scientific Calculator", "education",
    "Scientific Calculator",
    fields=[
        CalcField("expression", "Expression", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "scientific-calculator-for-your-site", "Scientific For Your Site Calculator", "education",
    "Scientific For Your Site Calculator",
    fields=[
        CalcField("expression", "Expression", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "real-estate-calculator", "Real Estate Calculator", "real_estate",
    "Real Estate Calculator",
    fields=[
        CalcField("property-value", "Property Value", "number"),
        CalcField("down-payment", "Down Payment", "number"),
        CalcField("interest-rate", "Interest Rate", "number"),
        CalcField("loan-term", "Loan Term", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "rent-calculator", "Rent Calculator", "real_estate",
    "Rent Calculator",
    fields=[
        CalcField("monthly-rent", "Monthly Rent", "number"),
        CalcField("lease-term", "Lease Term", "number"),
        CalcField("security-deposit", "Security Deposit", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "dew-point-calculator", "Dew Point Calculator", "event_budget",
    "Dew Point Calculator",
    fields=[
        CalcField("temperature", "Temperature", "number"),
        CalcField("humidity", "Humidity", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "golf-handicap-calculator", "Golf Handicap Calculator", "event_budget",
    "Golf Handicap Calculator",
    fields=[
        CalcField("scores", "Scores", "number"),
        CalcField("course-rating", "Course Rating", "number"),
        CalcField("slope-rating", "Slope Rating", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "heat-index-calculator", "Heat Index Calculator", "event_budget",
    "Heat Index Calculator",
    fields=[
        CalcField("temperature", "Temperature", "number"),
        CalcField("humidity", "Humidity", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "love-calculator", "Love Calculator", "event_budget",
    "Love Calculator",
    fields=[
        CalcField("name1", "Name1", "number"),
        CalcField("name2", "Name2", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "tip-calculator", "Tip Calculator", "event_budget",
    "Tip Calculator",
    fields=[
        CalcField("bill-amount", "Bill Amount", "number"),
        CalcField("tip-percent", "Tip Percent", "number"),
        CalcField("split", "Split", "number")
    ],
    fn=_js_calc,
)

register_calculator(
    "wind-chill-calculator", "Wind Chill Calculator", "event_budget",
    "Wind Chill Calculator",
    fields=[
        CalcField("temperature", "Temperature", "number"),
        CalcField("wind-speed", "Wind Speed", "number")
    ],
    fn=_js_calc,
)

