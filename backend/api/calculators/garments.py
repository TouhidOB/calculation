"""
Garments industry calculators for the registry engine.
"""
from .engine import CalcField, register_calculator


def _fabric_consumption(data):
    """
    Fabric consumption for a garment in kg.
    body_length and sleeve in inches, chest in inches, GSM in g/m².
    Formula: (CPL + SPL) × (1 + wastage%) × GSM / 1550 / 1000 in kg
    Simplified industry formula: consumption (kg) = L × W × 2 × GSM / 10000000-ish;
    we use the common: (BL + SL + 5cm) × (chest/2 + 5cm) × 2 × GSM × (1+waste) / 10^7
    """
    body_len_m = data["body_length"] * 0.0254      # inches → meters
    chest_half_m = (data["chest"] / 2) * 0.0254
    allowance = 0.05 + 0.05                        # sewing + hem allowance
    area_one_panel = body_len_m * chest_half_m
    panels = 2 if data["garment"] == "tshirt" else 2.4
    total_area = area_one_panel * panels
    waste = data.get("wastage_pct", 5) / 100
    consumption_kg = total_area * (1 + allowance * 10) * data["gsm"] / 1000 * (1 + waste)
    qty = int(data.get("quantity", 1))
    return {
        "consumption_per_pcs_kg": round(consumption_kg, 4),
        "consumption_per_dozen_kg": round(consumption_kg * 12, 3),
        "total_kg": round(consumption_kg * qty, 3),
        "quantity": qty,
        "gsm": data["gsm"],
        "garment": data["garment"],
    }


register_calculator(
    "fabric-consumption", "Fabric Consumption", "garments",
    "Fabric needed per piece / dozen for knit garments.",
    fields=[
        CalcField("garment", "Garment Type", type="select", options=[
            {"value": "tshirt", "label": "T-Shirt"},
            {"value": "polo", "label": "Polo Shirt"},
        ]),
        CalcField("body_length", "Body Length", unit="in", min=1),
        CalcField("chest", "Chest Width", unit="in", min=1),
        CalcField("gsm", "Fabric GSM", unit="g/m²", min=1),
        CalcField("wastage_pct", "Wastage %", unit="%", default=5),
        CalcField("quantity", "Quantity", default=1),
    ],
    fn=_fabric_consumption,
)


def _yarn_count(data):
    """
    Cotton count conversion: Ne = L/(840×W)
    """
    if data["direction"] == "to_metric":
        # English (Ne) → Tex
        ne = data["value"]
        tex = 590.5 / ne
        return {"tex": round(tex, 2), "ne": ne, "converted": round(tex, 2)}
    else:
        tex = data["value"]
        ne = 590.5 / tex
        return {"ne": round(ne, 2), "tex": tex, "converted": round(ne, 2)}


register_calculator(
    "yarn-count", "Yarn Count Converter", "garments",
    "Convert between English cotton count (Ne) and Tex.",
    fields=[
        CalcField("value", "Value"),
        CalcField("direction", "Direction", type="select", options=[
            {"value": "to_metric", "label": "Ne → Tex"},
            {"value": "to_english", "label": "Tex → Ne"},
        ]),
    ],
    fn=_yarn_count,
)


def _efficiency(data):
    if data["standard_minutes"] <= 0 or data["output"] <= 0 or data["workers"] <= 0 or data["hours"] <= 0:
        return {"error": "All inputs must be positive"}
    earned_minutes = data["output"] * data["standard_minutes"]
    available_minutes = data["workers"] * data["hours"] * 60
    efficiency = earned_minutes / available_minutes * 100
    return {
        "efficiency_pct": round(efficiency, 1),
        "earned_minutes": round(earned_minutes, 0),
        "available_minutes": round(available_minutes, 0),
        "verdict": "Above target" if efficiency >= 85 else "Below target",
    }


register_calculator(
    "sewing-efficiency", "Sewing Line Efficiency", "garments",
    "Line efficiency from output, SAM, workers and hours.",
    fields=[
        CalcField("output", "Output (pcs)", min=1),
        CalcField("standard_minutes", "SAM (min/pcs)", min=0.01),
        CalcField("workers", "Workers", min=1),
        CalcField("hours", "Working Hours", min=0.1),
    ],
    fn=_efficiency,
)


def _gsm(data):
    # GSM from weight of a small swatch
    # swatch area: 100 cm² swatch weight in grams × 100 = GSM
    if data["swatch_area_cm2"] <= 0:
        return {"error": "Swatch area must be positive"}
    gsm = data["swatch_weight_g"] / data["swatch_area_cm2"] * 10000
    return {
        "gsm": round(gsm, 1),
        "oz_per_yd2": round(gsm * 0.0294935, 2),
    }


register_calculator(
    "fabric-gsm", "Fabric GSM", "garments",
    "GSM from swatch weight and area.",
    fields=[
        CalcField("swatch_weight_g", "Swatch Weight", unit="g", min=0),
        CalcField("swatch_area_cm2", "Swatch Area", unit="cm²", min=1, default=100),
    ],
    fn=_gsm,
)