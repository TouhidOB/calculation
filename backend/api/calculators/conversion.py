"""
Conversion calculators for the registry engine.
"""
from .engine import CalcField, register_calculator

LENGTH_UNITS = {
    "mm": 0.001, "cm": 0.01, "m": 1, "km": 1000,
    "in": 0.0254, "ft": 0.3048, "yd": 0.9144, "mi": 1609.344,
}
WEIGHT_UNITS = {
    "mg": 1e-6, "g": 0.001, "kg": 1, "tonne": 1000,
    "oz": 0.0283495, "lb": 0.453592, "ton": 907.185,
}
VOLUME_UNITS = {
    "ml": 0.001, "l": 1, "m3": 1000, "cm3": 0.001,
    "tsp": 0.00492892, "tbsp": 0.0147868, "cup": 0.236588,
    "pint": 0.473176, "quart": 0.946353, "gallon": 3.78541,
}
AREA_UNITS = {
    "cm2": 0.0001, "m2": 1, "km2": 1e6, "ha": 10000,
    "ft2": 0.092903, "yd2": 0.836127, "acre": 4046.86, "bigha": 1337.8,
}


def _make_converter(units, category, name, desc):
    def fn(data):
        value = data["value"]
        from_unit = data["from_unit"]
        to_unit = data["to_unit"]
        base = value * units[from_unit]
        converted = base / units[to_unit]
        return {
            "converted": round(converted, 6),
            "from": f"{value} {from_unit}",
            "to": to_unit,
        }
    options = [{"value": u, "label": u} for u in units]
    register_calculator(
        f"convert-{category}", name, "conversion", desc,
        fields=[
            CalcField("value", "Value"),
            CalcField("from_unit", "From", type="select", options=options),
            CalcField("to_unit", "To", type="select", options=options),
        ],
        fn=fn,
    )


_make_converter(LENGTH_UNITS, "length", "Length Converter", "mm, cm, m, km, in, ft, yd, mi")
_make_converter(WEIGHT_UNITS, "weight", "Weight Converter", "mg, g, kg, oz, lb, ton")
_make_converter(VOLUME_UNITS, "volume", "Volume Converter", "ml, l, m3, tsp, cup, gallon")
_make_converter(AREA_UNITS, "area", "Area Converter", "cm2, m2, km2, ft2, yd2, acre, bigha")


def _temperature(data):
    f, t, v = data["from_unit"], data["to_unit"], data["value"]
    # to celsius first
    if f == "celsius":
        c = v
    elif f == "fahrenheit":
        c = (v - 32) * 5 / 9
    else:  # kelvin
        c = v - 273.15
    if t == "celsius":
        out = c
    elif t == "fahrenheit":
        out = c * 9 / 5 + 32
    else:
        out = c + 273.15
    return {"converted": round(out, 2), "from": f"{v}° {f}", "to": t}


register_calculator(
    "convert-temperature", "Temperature Converter", "conversion",
    "Celsius, Fahrenheit, Kelvin.",
    fields=[
        CalcField("value", "Value"),
        CalcField("from_unit", "From", type="select", options=[
            {"value": "celsius", "label": "Celsius"},
            {"value": "fahrenheit", "label": "Fahrenheit"},
            {"value": "kelvin", "label": "Kelvin"},
        ]),
        CalcField("to_unit", "To", type="select", options=[
            {"value": "celsius", "label": "Celsius"},
            {"value": "fahrenheit", "label": "Fahrenheit"},
            {"value": "kelvin", "label": "Kelvin"},
        ]),
    ],
    fn=_temperature,
)