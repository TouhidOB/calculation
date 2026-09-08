"""
Basic / math calculators for the registry engine.
"""
from .engine import CalcField, register_calculator


def _arithmetic(data):
    ops = {
        "add": (lambda a, b: a + b, "+"),
        "subtract": (lambda a, b: a - b, "-"),
        "multiply": (lambda a, b: a * b, "×"),
        "divide": (lambda a, b: a / b, "÷"),
        "power": (lambda a, b: a ** b, "^"),
        "mod": (lambda a, b: a % b, "mod"),
    }
    fn, symbol = ops[data["operation"]]
    result = fn(data["a"], data["b"])
    return {
        "result": round(result, 10),
        "expression": f"{data['a']} {symbol} {data['b']}",
    }


register_calculator(
    "arithmetic", "Arithmetic", "basic",
    "Add, subtract, multiply, divide, power, modulo.",
    fields=[
        CalcField("a", "First Number"),
        CalcField("b", "Second Number"),
        CalcField("operation", "Operation", type="select", options=[
            {"value": "add", "label": "Add (+)"},
            {"value": "subtract", "label": "Subtract (−)"},
            {"value": "multiply", "label": "Multiply (×)"},
            {"value": "divide", "label": "Divide (÷)"},
            {"value": "power", "label": "Power (^)"},
            {"value": "mod", "label": "Modulo (mod)"},
        ]),
    ],
    fn=_arithmetic,
)


def _percentage(data):
    return {
        "value": round(data["part"] * data["percent"] / 100, 4),
        "expression": f"{data['percent']}% of {data['part']}",
        "as_ratio": round(data["percent"] / 100, 6),
    }


register_calculator(
    "percentage", "Percentage", "basic",
    "X% of a value.",
    fields=[
        CalcField("percent", "Percent", unit="%"),
        CalcField("part", "Of Value"),
    ],
    fn=_percentage,
)


def _statistics(data):
    import statistics as st
    nums = [float(x) for x in str(data["numbers"]).replace(",", " ").split() if x.strip()]
    if not nums:
        return {"error": "No numbers provided"}
    return {
        "count": len(nums),
        "sum": round(sum(nums), 4),
        "mean": round(st.mean(nums), 4),
        "median": st.median(nums),
        "stdev": round(st.stdev(nums), 4) if len(nums) > 1 else 0,
        "min": min(nums),
        "max": max(nums),
    }


register_calculator(
    "statistics", "Statistics", "basic",
    "Mean, median, stdev from a list of numbers.",
    fields=[
        CalcField("numbers", "Numbers (space or comma separated)", type="text",
                  default="", help="e.g. 10 20 30 40"),
    ],
    fn=_statistics,
)


def _quadratic(data):
    a, b, c = data["a"], data["b"], data["c"]
    if a == 0:
        if b == 0:
            return {"error": "Not an equation (a and b are zero)"}
        return {"roots": [-c / b], "type": "linear"}
    disc = b ** 2 - 4 * a * c
    if disc < 0:
        re = -b / (2 * a)
        im = (abs(disc) ** 0.5) / (2 * a)
        return {"roots": [f"{re:.3f}+{im:.3f}i", f"{re:.3f}-{im:.3f}i"], "type": "complex"}
    r1 = (-b + disc ** 0.5) / (2 * a)
    r2 = (-b - disc ** 0.5) / (2 * a)
    return {"roots": [round(r1, 6), round(r2, 6)], "type": "real", "discriminant": disc}


register_calculator(
    "quadratic", "Quadratic Solver", "basic",
    "Roots of ax² + bx + c = 0.",
    fields=[
        CalcField("a", "a", default=1),
        CalcField("b", "b"),
        CalcField("c", "c"),
    ],
    fn=_quadratic,
)


def _bmi_prime(data):
    height_m = data["height"] / 100
    bmi = data["weight"] / (height_m ** 2)
    return {"bmi": round(bmi, 2), "bmi_prime": round(bmi / 25, 3)}


register_calculator(
    "bmi-prime", "BMI Prime", "basic",
    "BMI divided by 25 (healthy upper limit).",
    fields=[
        CalcField("weight", "Weight", unit="kg", min=1),
        CalcField("height", "Height", unit="cm", min=1),
    ],
    fn=_bmi_prime,
)