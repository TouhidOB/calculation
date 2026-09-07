"""
Construction calculators for the registry engine.
"""
from .engine import CalcField, register_calculator


def _concrete(data):
    # volume in cubic meters (dimensions in meters)
    volume = data["length"] * data["width"] * (data["thickness"] / 100)
    bags = volume / 0.017  # 1 x 50kg bag ≈ 0.017 m³
    return {
        "volume_m3": round(volume, 3),
        "volume_ft3": round(volume * 35.3147, 2),
        "bags_50kg": round(bags, 1),
        "cement_kg": round(bags * 50, 0),
        "sand_m3": round(volume * 0.5, 3),
        "gravel_m3": round(volume * 0.75, 3),
    }


register_calculator(
    "concrete", "Concrete Volume", "construction",
    "Concrete volume, cement bags, sand and gravel needed.",
    fields=[
        CalcField("length", "Length", unit="m", min=0, step=0.1),
        CalcField("width", "Width", unit="m", min=0, step=0.1),
        CalcField("thickness", "Thickness", unit="cm", min=1),
    ],
    fn=_concrete,
)


def _rebar(data):
    import math
    spacing_m = data["spacing"] / 100
    length_m = data["length"]
    bars = math.floor(length_m / spacing_m) + 1
    total_len = bars * data["width"]
    # weight per meter for common diameters (kg/m)
    weights = {8: 0.395, 10: 0.617, 12: 0.888, 14: 1.21, 16: 1.58, 20: 2.47, 25: 3.85}
    d = int(data["diameter"])
    kg_per_m = weights.get(d, round(d * d / 162, 3))
    return {
        "bars": bars,
        "total_length_m": round(total_len, 2),
        "weight_kg": round(total_len * kg_per_m, 2),
        "kg_per_meter": kg_per_m,
    }


register_calculator(
    "rebar", "Rebar Estimation", "construction",
    "Number of bars, total length and steel weight.",
    fields=[
        CalcField("length", "Slab Length", unit="m", min=0, step=0.1),
        CalcField("width", "Slab Width", unit="m", min=0, step=0.1),
        CalcField("spacing", "Bar Spacing", unit="cm", min=1),
        CalcField("diameter", "Bar Diameter", unit="mm", type="select", options=[
            {"value": "8", "label": "8 mm"}, {"value": "10", "label": "10 mm"},
            {"value": "12", "label": "12 mm"}, {"value": "14", "label": "14 mm"},
            {"value": "16", "label": "16 mm"}, {"value": "20", "label": "20 mm"},
            {"value": "25", "label": "25 mm"},
        ]),
    ],
    fn=_rebar,
)


def _paint(data):
    area = data["length"] * data["width"]  # wall area m²
    litres = area / 10 * data["coats"]     # 1L covers ~10m² per coat
    return {
        "area_m2": round(area, 2),
        "litres": round(litres, 2),
        "gallons": round(litres / 3.78541, 2),
        "coats": int(data["coats"]),
    }


register_calculator(
    "paint", "Paint Quantity", "construction",
    "Wall area and paint volume needed.",
    fields=[
        CalcField("length", "Wall Length", unit="m", min=0, step=0.1),
        CalcField("width", "Wall Height", unit="m", min=0, step=0.1),
        CalcField("coats", "Number of Coats", default=2, options=[
            {"value": "1", "label": "1 coat"}, {"value": "2", "label": "2 coats"},
            {"value": "3", "label": "3 coats"},
        ], type="select"),
    ],
    fn=_paint,
)


def _flooring(data):
    import math
    room_area = data["length"] * data["width"]
    board_area = (data["board_length"] / 100) * (data["board_width"] / 100)
    boards = math.ceil(room_area / board_area * 1.1)  # +10% waste
    return {
        "room_area_m2": round(room_area, 2),
        "boards_needed": boards,
        "packs_of_10": math.ceil(boards / 10),
        "waste_pct": 10,
    }


register_calculator(
    "flooring", "Flooring Boards", "construction",
    "Number of laminate boards including 10% waste.",
    fields=[
        CalcField("length", "Room Length", unit="m", min=0, step=0.1),
        CalcField("width", "Room Width", unit="m", min=0, step=0.1),
        CalcField("board_length", "Board Length", unit="cm", default=120),
        CalcField("board_width", "Board Width", unit="cm", default=20),
    ],
    fn=_flooring,
)


def _brick(data):
    import math
    # Standard Bangladeshi/Indian brick with mortar: 0.24 x 0.12 x 0.07 m
    wall_area = data["length"] * data["height"]
    brick_area = 0.24 * 0.12
    bricks = math.ceil(wall_area / brick_area * 1.05)  # +5% waste
    return {
        "wall_area_m2": round(wall_area, 2),
        "bricks_needed": bricks,
        "cement_bags": round(wall_area * 0.4, 1),
        "sand_m3": round(wall_area * 0.25, 2),
    }


register_calculator(
    "brick", "Brick Estimation", "construction",
    "Bricks, cement and sand for a masonry wall.",
    fields=[
        CalcField("length", "Wall Length", unit="m", min=0, step=0.1),
        CalcField("height", "Wall Height", unit="m", min=0, step=0.1),
    ],
    fn=_brick,
)


def _roofing(data):
    import math
    slope_area = data["length"] * data["width"] / math.cos(math.radians(data["pitch"]))
    sheets = math.ceil(slope_area / (data["sheet_length"] * data["sheet_width"]))
    return {
        "roof_area_m2": round(slope_area, 2),
        "sheets_needed": sheets,
        "rows": math.ceil(data["length"] / data["sheet_length"]),
        "pitch_degrees": data["pitch"],
    }


register_calculator(
    "roofing", "Roofing Sheets", "construction",
    "Corrugated sheet count adjusted for roof pitch.",
    fields=[
        CalcField("length", "Roof Length", unit="m", min=0, step=0.1),
        CalcField("width", "Roof Width", unit="m", min=0, step=0.1),
        CalcField("pitch", "Roof Pitch", unit="°", default=30),
        CalcField("sheet_length", "Sheet Length", unit="m", default=2),
        CalcField("sheet_width", "Sheet Width", unit="m", default=1),
    ],
    fn=_roofing,
)