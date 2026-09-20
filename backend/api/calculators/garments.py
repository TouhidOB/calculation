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
    if data["value"] <= 0:
        return {"error": "Value must be greater than zero"}
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


def _cino_pant_consumption(data):
    """
    Fabric consumption for Cino Long 5-pocket pants.
    Calculates net consumption (yards/meters per piece & dozen) and pattern efficiency.
    """
    shrinkage_len = (float(data.get("shrinkage_length", 1) or 1) + 1) / 100
    shrinkage_width = (float(data.get("shrinkage_width", 1) or 1) + 1) / 100
    fabric_width = max(1.0, float(data.get("fabric_width", 56) or 56))

    waist_relaxed = float(data.get("waist_relaxed", 32) or 32)
    waistband_height = float(data.get("waistband_height", 1.5) or 1.5)
    hip = float(data.get("hip_measurement", 38) or 38)
    thigh = float(data.get("thigh_crotch_level", 24) or 24)
    knee = float(data.get("knee_width", 16) or 16)
    inseam = float(data.get("inseam", 32) or 32)
    front_rise = float(data.get("front_rise_excl_wb", 10) or 10)
    hem_height = float(data.get("hem_height", 1) or 1)

    # Width calculation
    hip_width = hip / 2
    thigh_hip_width = (thigh - hip_width) / 2
    front_thigh_width = max(1.0, (hip_width + thigh_hip_width) - 1.2)
    front_knee_width = max(1.0, knee - 2.5)
    net_front_pattern_width_inch = ((front_thigh_width / 2.54) + 1) + ((front_knee_width / 2.54) + 1)
    net_front_pattern_width_shrinkage = (net_front_pattern_width_inch * shrinkage_width) + net_front_pattern_width_inch

    back_thigh_width = front_thigh_width + (thigh_hip_width * 2) + 2.4
    back_knee_width = front_knee_width + 5
    net_back_pattern_inch = ((back_thigh_width / 2.54) + 1) + ((back_knee_width / 2.54) + 1)
    net_back_pattern_shrinkage = (net_back_pattern_inch * shrinkage_width) + net_back_pattern_inch

    # Length calculation
    front_rise_inseam = inseam + front_rise
    total_front_length = front_rise_inseam - 1 + hem_height
    net_front_pattern_length = (total_front_length / 2.54) + 1
    net_front_pattern_length_shrinkage = (net_front_pattern_length * shrinkage_len) + net_front_pattern_length

    total_back_length = front_rise_inseam + 3 + hem_height
    net_back_pattern_length = (total_back_length / 2.54) + 1
    net_back_pattern_length_shrinkage = (net_back_pattern_length * shrinkage_len) + net_back_pattern_length

    # Consumption
    front_cons = ((net_front_pattern_length_shrinkage * net_front_pattern_width_shrinkage) / 36) / fabric_width
    back_cons = ((net_back_pattern_shrinkage * net_back_pattern_length_shrinkage) / 36) / fabric_width
    body_cons = front_cons + back_cons
    wb_cons = (((((waist_relaxed / 2.54) * 2) + 4.75) * ((waistband_height / 2.54) + 1) / 36) * 2) / fabric_width
    trims = (0.035 / fabric_width * 56) + 0.055 + 0.01 + 0.01  # welt + pocket + belt loop + fly
    total_cutting = body_cons + wb_cons + trims
    net_consumption = total_cutting * 1.02

    # Efficiency calculation
    box_back = max(0.1, back_thigh_width * 2)
    box_front = max(0.1, front_thigh_width * 2)
    loss_back = (((back_thigh_width + back_knee_width) / box_back) * 100 - 100) / 2
    loss_front = (((front_thigh_width + front_knee_width) / box_front) * 100 - 100) / 2
    efficiency = (abs(loss_back - loss_front) + 0.02) * 100

    return {
        "net_consumption_yds": round(net_consumption, 2),
        "consumption_per_dozen_yds": round(net_consumption * 12, 2),
        "pattern_efficiency_pct": round(efficiency, 1),
        "body_consumption_yds": round(body_cons, 3),
        "waistband_consumption_yds": round(wb_cons, 3),
        "cutting_consumption_yds": round(total_cutting, 3),
    }


_CINO_FIELDS = [
    CalcField("shrinkage_length", "Shrinkage Length (%)", default=1),
    CalcField("shrinkage_width", "Shrinkage Width (%)", default=1),
    CalcField("fabric_width", "Fabric Width (Inch)", unit="in", default=56),
    CalcField("waist_relaxed", "Waist (RELAXED)", unit="cm", default=32),
    CalcField("waistband_height", "Waistband height", unit="cm", default=1.5),
    CalcField("hip_measurement", "Hip (15 cm below WB seam)", unit="cm", default=38),
    CalcField("thigh_crotch_level", "Thigh at crotch level", unit="cm", default=24),
    CalcField("knee_width", "Knee width", unit="cm", default=16),
    CalcField("leg_opening_hem", "Leg opening (hem)", unit="cm", default=14),
    CalcField("inseam", "Inseam", unit="cm", default=32),
    CalcField("front_rise_excl_wb", "Front rise, WB excluded", unit="cm", default=10),
    CalcField("back_rise_excl_wb", "Back rise, WB excluded", unit="cm", default=14),
    CalcField("hem_height", "Hem Height", unit="cm", default=1),
    CalcField("back_pocket_top_width", "Back pocket top width", unit="cm", default=5.5),
    CalcField("back_pocket_height_center", "Back pocket height at center", unit="cm", default=6),
]

for i in range(1, 11):
    register_calculator(
        f"cino-long-{i}",
        f"Cino Long 5 PKT Pant Fabric Consumption (Sheet {i})",
        "garments",
        "Fabric consumption and pattern efficiency for 5-pocket cino pants.",
        fields=_CINO_FIELDS,
        fn=_cino_pant_consumption,
    )
