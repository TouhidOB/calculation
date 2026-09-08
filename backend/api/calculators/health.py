"""
Health calculators for the registry engine.
"""
from .engine import CalcField, register_calculator


def _bmi(data):
    height_m = data["height"] / 100
    bmi = data["weight"] / (height_m ** 2)
    if bmi < 18.5:
        category, color = "Underweight", "#3b82f6"
    elif bmi < 25:
        category, color = "Normal Weight", "#10b981"
    elif bmi < 30:
        category, color = "Overweight", "#f59e0b"
    else:
        category, color = "Obese", "#ef4444"
    return {
        "bmi": round(bmi, 1),
        "category": category,
        "color": color,
        "ideal_weight_min_kg": round(18.5 * height_m ** 2, 1),
        "ideal_weight_max_kg": round(24.9 * height_m ** 2, 1),
    }


register_calculator(
    "bmi", "BMI Calculator", "health",
    "Body Mass Index from weight and height.",
    fields=[
        CalcField("weight", "Weight", unit="kg", min=1),
        CalcField("height", "Height", unit="cm", min=1),
    ],
    fn=_bmi,
)


def _bmr(data):
    w, h, a = data["weight"], data["height"], data["age"]
    if data["gender"] == "male":
        bmr = 10 * w + 6.25 * h - 5 * a + 5
    else:
        bmr = 10 * w + 6.25 * h - 5 * a - 161
    return {"bmr": round(bmr, 0), "gender": data["gender"]}


register_calculator(
    "bmr", "BMR (Mifflin-St Jeor)", "health",
    "Basal metabolic rate calories per day.",
    fields=[
        CalcField("weight", "Weight", unit="kg", min=1),
        CalcField("height", "Height", unit="cm", min=1),
        CalcField("age", "Age", min=1, max=120),
        CalcField("gender", "Gender", type="select", options=[
            {"value": "male", "label": "Male"},
            {"value": "female", "label": "Female"},
        ]),
    ],
    fn=_bmr,
)


def _tdee(data):
    factors = {
        "sedentary": 1.2, "light": 1.375, "moderate": 1.55,
        "active": 1.725, "very_active": 1.9,
    }
    tdee = data["bmr"] * factors[data["activity"]]
    return {
        "tdee": round(tdee, 0),
        "maintenance": round(tdee, 0),
        "mild_loss": round(tdee - 250, 0),
        "loss": round(tdee - 500, 0),
        "gain": round(tdee + 500, 0),
    }


register_calculator(
    "tdee", "TDEE", "health",
    "Total daily energy expenditure from BMR and activity level.",
    fields=[
        CalcField("bmr", "BMR", unit="kcal", min=1),
        CalcField("activity", "Activity Level", type="select", options=[
            {"value": "sedentary", "label": "Sedentary (office job)"},
            {"value": "light", "label": "Light (1-2 days exercise)"},
            {"value": "moderate", "label": "Moderate (3-5 days exercise)"},
            {"value": "active", "label": "Active (6-7 days exercise)"},
            {"value": "very_active", "label": "Very Active (athlete)"},
        ]),
    ],
    fn=_tdee,
)


def _body_fat_navy(data):
    if data["gender"] == "male":
        neck, waist, height = data["neck"], data["waist"], data["height"]
        v = 495 / (1.0324 - 0.19077 * _log10(waist - neck) + 0.15456 * _log10(height)) - 450
    else:
        neck, waist, hip, height = data["neck"], data["waist"], data["hip"], data["height"]
        v = 495 / (1.29579 - 0.35004 * _log10(waist + hip - neck) + 0.22100 * _log10(height)) - 450
    return {"body_fat_pct": round(v, 1), "method": "US Navy method"}


def _log10(x):
    import math
    return math.log10(max(x, 1e-9))


register_calculator(
    "body-fat", "Body Fat (Navy)", "health",
    "Body fat percentage via US Navy circumference method.",
    fields=[
        CalcField("gender", "Gender", type="select", options=[
            {"value": "male", "label": "Male"}, {"value": "female", "label": "Female"},
        ]),
        CalcField("height", "Height", unit="cm", min=1),
        CalcField("neck", "Neck", unit="cm", min=1),
        CalcField("waist", "Waist", unit="cm", min=1),
        CalcField("hip", "Hip (female only)", unit="cm", required=False, default=0),
    ],
    fn=_body_fat_navy,
)


def _ideal_weight_devine(data):
    inches_over_5ft = max(data["height"] - 152.4, 0) / 2.54
    if data["gender"] == "male":
        base = 50
    else:
        base = 45.5
    kg = base + 2.3 * inches_over_5ft
    return {
        "ideal_weight_kg": round(kg, 1),
        "ideal_weight_lb": round(kg * 2.20462, 1),
        "formula": "Devine formula",
    }


register_calculator(
    "ideal-weight", "Ideal Weight (Devine)", "health",
    "Ideal body weight via Devine formula.",
    fields=[
        CalcField("gender", "Gender", type="select", options=[
            {"value": "male", "label": "Male"}, {"value": "female", "label": "Female"},
        ]),
        CalcField("height", "Height", unit="cm", min=1),
    ],
    fn=_ideal_weight_devine,
)


def _heart_rate(data):
    age = data["age"]
    max_hr = 220 - age
    return {
        "max_hr": max_hr,
        "zone2_fat_burn": [round(max_hr * 0.6), round(max_hr * 0.7)],
        "zone3_aerobic": [round(max_hr * 0.7), round(max_hr * 0.8)],
        "zone4_threshold": [round(max_hr * 0.8), round(max_hr * 0.9)],
        "zone5_maximum": [round(max_hr * 0.9), max_hr],
    }


register_calculator(
    "heart-rate", "Heart Rate Zones", "health",
    "Training zones from age using 220-age formula.",
    fields=[CalcField("age", "Age", min=1, max=120)],
    fn=_heart_rate,
)