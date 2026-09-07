"""
Finance calculators for the registry engine.
"""
from .engine import CalcField, register_calculator


def _budget(data):
    income = data["income"]
    expenses = (
        data["rent"] + data["food"] + data["transport"]
        + data.get("utilities", 0) + data.get("entertainment", 0)
    )
    savings = income - expenses
    if savings > 0:
        category, color = "Surplus", "#10b981"
    elif savings < 0:
        category, color = "Deficit", "#ef4444"
    else:
        category, color = "Break-Even", "#f59e0b"
    return {
        "total_income": round(income, 2),
        "total_expenses": round(expenses, 2),
        "monthly_savings": round(savings, 2),
        "category": category,
        "color": color,
        "savings_rate_pct": round(savings / income * 100, 2) if income else 0,
    }


register_calculator(
    "budget", "Budget Calculator", "finance",
    "Monthly income vs expenses breakdown with savings rate.",
    fields=[
        CalcField("income", "Monthly Income", unit="$", min=0),
        CalcField("rent", "Rent / Mortgage", unit="$", min=0),
        CalcField("food", "Food", unit="$", min=0),
        CalcField("transport", "Transport", unit="$", min=0),
        CalcField("utilities", "Utilities", unit="$", required=False, default=0),
        CalcField("entertainment", "Entertainment", unit="$", required=False, default=0),
    ],
    fn=_budget,
)


def _net_worth(data):
    assets = data["cash"] + data["savings"] + data["investments"] + data["property"]
    liabilities = data["loans"] + data.get("other_debt", 0)
    return {
        "total_assets": round(assets, 2),
        "total_liabilities": round(liabilities, 2),
        "net_worth": round(assets - liabilities, 2),
        "status": "Positive" if assets - liabilities >= 0 else "Negative",
    }


register_calculator(
    "net-worth", "Net Worth", "finance",
    "Assets minus liabilities.",
    fields=[
        CalcField("cash", "Cash", unit="$", min=0),
        CalcField("savings", "Savings", unit="$", min=0),
        CalcField("investments", "Investments", unit="$", min=0),
        CalcField("property", "Property Value", unit="$", min=0),
        CalcField("loans", "Loans", unit="$", min=0),
        CalcField("other_debt", "Other Debt", unit="$", required=False, default=0),
    ],
    fn=_net_worth,
)


def _dti(data):
    ratio = data["monthly_debt"] / data["gross_income"] * 100
    if ratio <= 36:
        category, color = "Healthy", "#10b981"
    elif ratio <= 43:
        category, color = "Acceptable", "#f59e0b"
    else:
        category, color = "Concerning", "#ef4444"
    return {
        "dti_ratio": round(ratio, 2),
        "category": category,
        "color": color,
        "monthly_debt": data["monthly_debt"],
        "gross_income": data["gross_income"],
    }


register_calculator(
    "dti", "Debt-to-Income Ratio", "finance",
    "Monthly debt payments divided by gross monthly income.",
    fields=[
        CalcField("monthly_debt", "Monthly Debt Payments", unit="$", min=0),
        CalcField("gross_income", "Gross Monthly Income", unit="$", min=0),
    ],
    fn=_dti,
)


def _compound_interest(data):
    p, r, t, n = data["principal"], data["rate"] / 100, data["years"], int(data["frequency"])
    amount = p * (1 + r / n) ** (n * t)
    return {
        "final_amount": round(amount, 2),
        "interest_earned": round(amount - p, 2),
        "principal": p,
        "years": t,
        "compounding": n,
    }


register_calculator(
    "compound-interest", "Compound Interest", "finance",
    "A = P(1 + r/n)^(nt)",
    fields=[
        CalcField("principal", "Principal", unit="$", min=0),
        CalcField("rate", "Annual Interest Rate", unit="%", min=0, max=100, step=0.1),
        CalcField("years", "Years", unit="yr", min=0, step=0.5),
        CalcField("frequency", "Compounds per year", type="select", default=12, options=[
            {"value": "1", "label": "Annually"},
            {"value": "2", "label": "Semi-annually"},
            {"value": "4", "label": "Quarterly"},
            {"value": "12", "label": "Monthly"},
            {"value": "365", "label": "Daily"},
        ]),
    ],
    fn=_compound_interest,
)


def _loan_payment(data):
    p, r, n = data["principal"], data["rate"] / 100 / 12, int(data["months"])
    if r == 0:
        payment = p / n
    else:
        payment = p * r / (1 - (1 + r) ** -n)
    return {
        "monthly_payment": round(payment, 2),
        "total_paid": round(payment * n, 2),
        "total_interest": round(payment * n - p, 2),
        "principal": p,
        "months": n,
    }


register_calculator(
    "loan-payment", "Loan Payment", "finance",
    "Fixed monthly payment for an amortizing loan.",
    fields=[
        CalcField("principal", "Loan Amount", unit="$", min=0),
        CalcField("rate", "Annual Interest Rate", unit="%", min=0, step=0.1),
        CalcField("months", "Term (months)", min=1),
    ],
    fn=_loan_payment,
)


def _mortgage(data):
    p, annual_rate, years = data["principal"], data["rate"], data["years"]
    n = int(years * 12)
    r = annual_rate / 100 / 12
    if r == 0:
        payment = p / n
    else:
        payment = p * r / (1 - (1 + r) ** -n)
    return {
        "monthly_payment": round(payment, 2),
        "total_paid": round(payment * n, 2),
        "total_interest": round(payment * n - p, 2),
        "months": n,
    }


register_calculator(
    "mortgage", "Mortgage Payment", "finance",
    "Monthly mortgage payment including interest.",
    fields=[
        CalcField("principal", "Home Price", unit="$", min=0),
        CalcField("rate", "Interest Rate", unit="%", min=0, step=0.1),
        CalcField("years", "Term", unit="yr", default=30),
    ],
    fn=_mortgage,
)


def _inflation(data):
    amount, rate, years = data["amount"], data["rate"], data["years"]
    future = amount * (1 + rate / 100) ** years
    return {
        "future_cost": round(future, 2),
        "purchasing_power": round(amount / (1 + rate / 100) ** years, 2),
        "amount": amount, "rate": rate, "years": years,
    }


register_calculator(
    "inflation", "Inflation Impact", "finance",
    "Future cost of goods and today's money purchasing power.",
    fields=[
        CalcField("amount", "Amount Today", unit="$", min=0),
        CalcField("rate", "Inflation Rate", unit="%", min=0, step=0.1),
        CalcField("years", "Years", min=0),
    ],
    fn=_inflation,
)


def _savings_goal(data):
    remaining = data["target"] - data["current"]
    if remaining <= 0:
        return {"months_remaining": 0, "message": "Goal already achieved!"}
    months = remaining / data["monthly"]
    return {
        "months_remaining": round(months, 1),
        "years_remaining": round(months / 12, 1),
        "remaining": round(remaining, 2),
        "monthly": data["monthly"],
    }


register_calculator(
    "savings-goal", "Savings Goal", "finance",
    "How long until you reach your savings target.",
    fields=[
        CalcField("current", "Current Savings", unit="$", min=0),
        CalcField("target", "Target Amount", unit="$", min=0),
        CalcField("monthly", "Monthly Contribution", unit="$", min=1),
    ],
    fn=_savings_goal,
)


def _emergency_fund(data):
    target = data["monthly_expenses"] * data["months"]
    return {
        "target_amount": round(target, 2),
        "monthly_expenses": data["monthly_expenses"],
        "months": data["months"],
        "recommendation": f"Keep ${target:,.0f} saved for {int(data['months'])} months of expenses.",
    }


register_calculator(
    "emergency-fund", "Emergency Fund", "finance",
    "3-6 months of living expenses target.",
    fields=[
        CalcField("monthly_expenses", "Monthly Expenses", unit="$", min=0),
        CalcField("months", "Months of coverage", default=6, options=[
            {"value": "3", "label": "3 months"},
            {"value": "6", "label": "6 months"},
            {"value": "9", "label": "9 months"},
            {"value": "12", "label": "12 months"},
        ], type="select"),
    ],
    fn=_emergency_fund,
)


def _retirement(data):
    years = data["retire_age"] - data["current_age"]
    if years <= 0:
        return {"error": "Retirement age must be greater than current age"}
    r = data["return_rate"] / 100
    growth = ((1 + r) ** years - 1) / r if r > 0 else years
    corpus = data["current_savings"] * ((1 + r) ** years) + data["monthly"] * 12 * growth
    annual_4pct = corpus * 0.04
    return {
        "projected_corpus": round(corpus, 2),
        "safe_annual_withdrawal": round(annual_4pct, 2),
        "safe_monthly_withdrawal": round(annual_4pct / 12, 2),
        "years_to_grow": years,
    }


register_calculator(
    "retirement", "Retirement Projection", "finance",
    "Projected corpus at retirement using compound growth.",
    fields=[
        CalcField("current_age", "Current Age", min=1, max=100),
        CalcField("retire_age", "Retirement Age", min=1, max=100),
        CalcField("current_savings", "Current Savings", unit="$", min=0),
        CalcField("monthly", "Monthly Contribution", unit="$", min=0),
        CalcField("return_rate", "Expected Annual Return", unit="%", default=7, step=0.5),
    ],
    fn=_retirement,
)


def _roi(data):
    gain = data["final_value"] - data["initial"]
    roi = gain / data["initial"] * 100
    return {
        "roi_pct": round(roi, 2),
        "absolute_gain": round(gain, 2),
        "initial": data["initial"],
        "final_value": data["final_value"],
    }


register_calculator(
    "roi", "Return on Investment", "business_investment",
    "ROI percentage and absolute gain.",
    fields=[
        CalcField("initial", "Initial Investment", unit="$", min=0),
        CalcField("final_value", "Final Value", unit="$", min=0),
    ],
    fn=_roi,
)


def _npv(data):
    rate = data["rate"] / 100
    initial = data["initial"]
    flows = data.get("cash_flows", "")
    numbers = [float(x) for x in str(flows).replace(",", " ").split() if x.strip()]
    npv = -initial + sum(cf / (1 + rate) ** (i + 1) for i, cf in enumerate(numbers))
    return {
        "npv": round(npv, 2),
        "cash_flow_count": len(numbers),
        "verdict": "Accept (NPV > 0)" if npv > 0 else "Reject (NPV < 0)",
    }


register_calculator(
    "npv", "Net Present Value", "business_investment",
    "NPV from initial investment and space-separated yearly cash flows.",
    fields=[
        CalcField("initial", "Initial Investment", unit="$", min=0),
        CalcField("rate", "Discount Rate", unit="%", step=0.5),
        CalcField("cash_flows", "Yearly Cash Flows (space separated)", type="text",
                  default="", help="e.g. 10000 12000 15000"),
    ],
    fn=_npv,
)


def _irr(data):
    initial = data["initial"]
    flows_str = data.get("cash_flows", "")
    flows = [float(x) for x in str(flows_str).replace(",", " ").split() if x.strip()]
    if not flows:
        return {"error": "Provide at least one cash flow"}
    cashflows = [-initial] + flows

    def npv_at(rate):
        return sum(cf / (1 + rate) ** i for i, cf in enumerate(cashflows))

    lo, hi = -0.99, 10.0
    for _ in range(200):
        mid = (lo + hi) / 2
        v = npv_at(mid)
        if abs(v) < 0.0001:
            break
        if v > 0:
            lo = mid
        else:
            hi = mid
    return {"irr_pct": round(mid * 100, 2), "cash_flow_count": len(flows)}


register_calculator(
    "irr", "Internal Rate of Return", "business_investment",
    "IRR via bisection from initial investment and yearly cash flows.",
    fields=[
        CalcField("initial", "Initial Investment", unit="$", min=0),
        CalcField("cash_flows", "Yearly Cash Flows (space separated)", type="text",
                  default="", help="e.g. 5000 6000 7000"),
    ],
    fn=_irr,
)


def _break_even(data):
    fc, sp, vc = data["fixed_costs"], data["price"], data["variable_cost"]
    if sp <= vc:
        return {"error": "Selling price must exceed variable cost"}
    units = fc / (sp - vc)
    return {
        "break_even_units": round(units, 1),
        "break_even_revenue": round(units * sp, 2),
        "contribution_margin": round(sp - vc, 2),
    }


register_calculator(
    "break-even", "Break-Even Point", "business_investment",
    "Units needed to cover fixed costs.",
    fields=[
        CalcField("fixed_costs", "Fixed Costs", unit="$", min=0),
        CalcField("price", "Price per Unit", unit="$", min=0),
        CalcField("variable_cost", "Variable Cost per Unit", unit="$", min=0),
    ],
    fn=_break_even,
)