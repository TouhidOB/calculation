"""
Mobile Phone Servicing & Repair Shop Suite.
Contains 50 dedicated calculators covering technical diagnostics, electronic component calculations,
and repair shop business/pricing operations.
"""
import math
from typing import Any, Dict
from .engine import CalcField, register_calculator


# ==============================================================================
# SECTION 1: TECHNICAL & HARDWARE DIAGNOSTICS (Calculators 1 - 30)
# ==============================================================================

# 1. Battery Health Percentage Calculator
def calc_battery_health(d: Dict[str, Any]) -> Dict[str, Any]:
    design = max(100.0, float(d.get("design_capacity", 4000)))
    current = max(0.0, float(d.get("current_capacity", 3400)))
    cycles = max(0, int(d.get("cycle_count", 450)))
    health = round((current / design) * 100.0, 1)
    wear = round(max(0.0, 100.0 - health), 1)
    if health >= 90:
        status = "Excellent Condition"
        rec = "Battery is in peak operating condition with minimal capacity degradation."
    elif health >= 80:
        status = "Good / Normal"
        rec = "Normal degradation. Typical for 1-2 years of daily charging cycles."
    elif health >= 70:
        status = "Service Recommended"
        rec = "Battery degradation is noticeable. Reduced screen-on-time; consider cell replacement."
    else:
        status = "Degraded / Urgent Replacement"
        rec = "Severe capacity degradation. Risk of unexpected throttling or sudden shutdowns."
    return {
        "battery_health_percentage": health,
        "estimated_wear_percentage": wear,
        "status": status,
        "cycle_count": cycles,
        "recommendation": rec,
        "retained_capacity_mah": round(current, 1)
    }

register_calculator(
    "battery-health-percentage-calculator",
    "Battery Health Percentage Calculator",
    "mobile_servicing",
    "Calculate smartphone battery state-of-health (SoH), capacity loss, and replacement urgency based on cycle count.",
    [
        CalcField("design_capacity", "Design Capacity (mAh)", "number", unit="mAh", required=True, default=4000, min=500, max=25000),
        CalcField("current_capacity", "Current Full Charge Capacity (mAh)", "number", unit="mAh", required=True, default=3400, min=100, max=25000),
        CalcField("cycle_count", "Battery Charge Cycles", "number", unit="cycles", required=False, default=450, min=0, max=10000),
    ],
    calc_battery_health
)

# 2. Battery Runtime Calculator
def calc_battery_runtime(d: Dict[str, Any]) -> Dict[str, Any]:
    cap = max(100.0, float(d.get("capacity_mah", 5000)))
    volt = max(3.0, float(d.get("voltage", 3.85)))
    load = max(10.0, float(d.get("consumption_ma", 350)))
    energy_wh = round((cap * volt) / 1000.0, 2)
    usable_cap = cap * 0.90
    runtime_hrs = round(usable_cap / load, 2)
    h = int(runtime_hrs)
    m = int(round((runtime_hrs - h) * 60))
    return {
        "estimated_runtime_hours": runtime_hrs,
        "formatted_runtime": f"{h}h {m}m",
        "total_energy_wh": energy_wh,
        "usable_capacity_mah": round(usable_cap, 0),
        "status": f"{h}h {m}m Battery Backup"
    }

register_calculator(
    "battery-runtime-calculator",
    "Battery Runtime Calculator",
    "mobile_servicing",
    "Estimate smartphone screen-on time (SOT) and continuous standby runtime under varied workload currents.",
    [
        CalcField("capacity_mah", "Battery Capacity (mAh)", "number", unit="mAh", required=True, default=5000, min=500, max=30000),
        CalcField("voltage", "Nominal Battery Voltage (V)", "number", unit="V", required=True, default=3.85, min=3.0, max=12.0),
        CalcField("consumption_ma", "Average Current Draw (mA)", "number", unit="mA", required=True, default=350, min=10, max=5000, help="Typical browsing: 300-450mA, Gaming: 800-1500mA"),
    ],
    calc_battery_runtime
)

# 3. Battery Charging-Time Calculator
def calc_charging_time(d: Dict[str, Any]) -> Dict[str, Any]:
    cap = max(100.0, float(d.get("capacity_mah", 4500)))
    current = max(0.1, float(d.get("charger_current_a", 2.0)))
    eff = max(50.0, min(100.0, float(d.get("efficiency_pct", 85)))) / 100.0
    effective_current_ma = current * 1000.0 * eff
    total_hours = round(cap / effective_current_ma, 2)
    h = int(total_hours)
    m = int(round((total_hours - h) * 60))
    quick_80_mins = int(round(total_hours * 0.8 * 0.7 * 60))
    return {
        "full_charge_hours": total_hours,
        "full_charge_duration": f"{h}h {m}m",
        "quick_charge_80pct_duration": f"{quick_80_mins} mins",
        "effective_charge_current_a": round(current * eff, 2),
        "status": f"{h}h {m}m to 100%"
    }

register_calculator(
    "battery-charging-time-calculator",
    "Battery Charging-Time Calculator",
    "mobile_servicing",
    "Calculate complete charging duration and 80% fast-charge benchmark accounting for thermal conversion losses.",
    [
        CalcField("capacity_mah", "Battery Capacity (mAh)", "number", unit="mAh", required=True, default=4500, min=500, max=30000),
        CalcField("charger_current_a", "Charger Current Rating (A)", "number", unit="A", required=True, default=2.0, min=0.2, max=20.0),
        CalcField("efficiency_pct", "Thermal Charging Efficiency (%)", "number", unit="%", required=False, default=85, min=50, max=100),
    ],
    calc_charging_time
)

# 4. Battery Capacity mAh/Wh Converter
def calc_mah_wh_converter(d: Dict[str, Any]) -> Dict[str, Any]:
    val = max(0.01, float(d.get("value", 5000)))
    volt = max(1.0, float(d.get("voltage", 3.85)))
    mode = str(d.get("conversion_type", "mah_to_wh"))
    if mode == "wh_to_mah":
        result = round((val * 1000.0) / volt, 1)
        unit = "mAh"
        formula = f"({val} Wh × 1000) ÷ {volt} V = {result} mAh"
    else:
        result = round((val * volt) / 1000.0, 3)
        unit = "Wh"
        formula = f"({val} mAh × {volt} V) ÷ 1000 = {result} Wh"
    return {
        "converted_value": result,
        "target_unit": unit,
        "voltage_used": volt,
        "calculation_formula": formula,
        "status": f"{result} {unit}"
    }

register_calculator(
    "battery-capacity-mah-wh-converter",
    "Battery Capacity mAh/Wh Converter",
    "mobile_servicing",
    "Accurately convert between battery energy (Watt-hours) and charge capacity (Milliampere-hours).",
    [
        CalcField("value", "Value to Convert", "number", required=True, default=5000, min=0.01, max=1000000),
        CalcField("voltage", "Nominal Cell Voltage (V)", "number", unit="V", required=True, default=3.85, min=1.0, max=48.0),
        CalcField("conversion_type", "Conversion Direction", "select", required=True, default="mah_to_wh",
                  options=[{"value": "mah_to_wh", "label": "mAh to Wh (Capacity to Energy)"},
                           {"value": "wh_to_mah", "label": "Wh to mAh (Energy to Capacity)"}]),
    ],
    calc_mah_wh_converter
)

# 5. Charging Current Calculator
def calc_charging_current(d: Dict[str, Any]) -> Dict[str, Any]:
    p = max(1.0, float(d.get("charger_wattage", 25.0)))
    v = max(3.0, float(d.get("charging_voltage", 9.0)))
    r = max(0.01, float(d.get("cable_resistance", 0.15)))
    current = round(p / v, 2)
    cable_loss = round((current ** 2) * r, 2)
    delivered = round(max(0.0, p - cable_loss), 2)
    eff = round((delivered / p) * 100.0, 1)
    return {
        "charging_current_a": current,
        "cable_power_loss_w": cable_loss,
        "delivered_power_w": delivered,
        "delivery_efficiency_pct": eff,
        "status": f"{current} A Current Flow"
    }

register_calculator(
    "charging-current-calculator",
    "Charging Current Calculator",
    "mobile_servicing",
    "Calculate electrical charging current, series cable resistive losses, and net wattage delivered to phone battery.",
    [
        CalcField("charger_wattage", "Charger Output Power (W)", "number", unit="W", required=True, default=25.0, min=1.0, max=300.0),
        CalcField("charging_voltage", "Negotiated Bus Voltage (V)", "number", unit="V", required=True, default=9.0, min=3.0, max=48.0),
        CalcField("cable_resistance", "Cable & Contact Resistance (Ω)", "number", unit="Ω", required=False, default=0.15, min=0.01, max=2.0),
    ],
    calc_charging_current
)

# 6. Fast-Charge Wattage Calculator
def calc_fast_charge_wattage(d: Dict[str, Any]) -> Dict[str, Any]:
    proto = str(d.get("protocol", "pd3"))
    v = max(3.0, float(d.get("voltage", 9.0)))
    i = max(0.1, float(d.get("current", 3.0)))
    watts = round(v * i, 1)
    if watts >= 65.0:
        tier = "Ultra Fast Charge (65W+ HyperCharge)"
    elif watts >= 30.0:
        tier = "Super Fast Charge (30W - 65W)"
    elif watts >= 18.0:
        tier = "Standard Fast Charge (18W - 27W)"
    else:
        tier = "Standard / Slow USB Rate (< 18W)"
    return {
        "effective_wattage_w": watts,
        "fast_charge_tier": tier,
        "protocol_active": proto.upper(),
        "joules_per_second": watts,
        "status": f"{watts} Watts ({tier})"
    }

register_calculator(
    "fast-charge-wattage-calculator",
    "Fast-Charge Wattage Calculator",
    "mobile_servicing",
    "Determine real charging speed and fast-charging protocol tier from V/A multimeter telemetries.",
    [
        CalcField("protocol", "Charging Protocol", "select", required=True, default="pd3",
                  options=[{"value": "pd3", "label": "USB Power Delivery 3.0 / PPS"},
                           {"value": "qc3", "label": "Qualcomm Quick Charge 3.0 / 4+"},
                           {"value": "supervooc", "label": "SuperVOOC / Warp Charge"},
                           {"value": "custom", "label": "Universal Fast Charge"}]),
        CalcField("voltage", "Measured Bus Voltage (V)", "number", unit="V", required=True, default=9.0, min=3.0, max=48.0),
        CalcField("current", "Measured Bus Current (A)", "number", unit="A", required=True, default=3.0, min=0.1, max=20.0),
    ],
    calc_fast_charge_wattage
)

# 7. USB Cable Voltage-Drop Calculator
def calc_usb_voltage_drop(d: Dict[str, Any]) -> Dict[str, Any]:
    v_src = max(4.0, float(d.get("source_voltage", 5.0)))
    current = max(0.1, float(d.get("current_amps", 2.4)))
    length = max(0.1, float(d.get("cable_length_m", 1.5)))
    awg = int(d.get("wire_gauge_awg", 24))
    awg_resistances = {20: 0.033, 22: 0.053, 24: 0.084, 26: 0.134, 28: 0.213}
    r_per_m = awg_resistances.get(awg, 0.084)
    total_loop_r = 2.0 * length * r_per_m
    v_drop = round(current * total_loop_r, 3)
    v_phone = round(max(0.0, v_src - v_drop), 3)
    loss_pct = round((v_drop / v_src) * 100.0, 1)
    status = "Pass (USB Specification Compliant)" if v_phone >= 4.75 or (v_src > 5.0 and loss_pct < 6.0) else "Fail (Severe Cable Drop - Slow Charging)"
    return {
        "voltage_drop_v": v_drop,
        "phone_received_voltage_v": v_phone,
        "power_loss_percentage": loss_pct,
        "roundtrip_cable_resistance_ohms": round(total_loop_r, 3),
        "status": status
    }

register_calculator(
    "usb-cable-voltage-drop-calculator",
    "USB Cable Voltage-Drop Calculator",
    "mobile_servicing",
    "Diagnose USB charging cable degradation, line resistance, and voltage drop across wire AWG gauges.",
    [
        CalcField("source_voltage", "Charger Port Voltage (V)", "number", unit="V", required=True, default=5.0, min=4.0, max=48.0),
        CalcField("current_amps", "Charging Current (A)", "number", unit="A", required=True, default=2.4, min=0.1, max=10.0),
        CalcField("cable_length_m", "Cable Length (meters)", "number", unit="m", required=True, default=1.5, min=0.1, max=10.0),
        CalcField("wire_gauge_awg", "Wire Gauge (AWG)", "select", required=True, default=24,
                  options=[{"value": 20, "label": "20 AWG (Heavy Duty High-Speed)"},
                           {"value": 22, "label": "22 AWG (Premium Fast Charge)"},
                           {"value": 24, "label": "24 AWG (Standard Quality)"},
                           {"value": 26, "label": "26 AWG (Thin / Budget Cable)"},
                           {"value": 28, "label": "28 AWG (Ultra-Thin Legacy Cable)"}]),
    ],
    calc_usb_voltage_drop
)

# 8. USB-C Power-Delivery Wattage Calculator
def calc_usb_pd_wattage(d: Dict[str, Any]) -> Dict[str, Any]:
    prof = str(d.get("pd_profile", "9v3a"))
    profiles = {
        "5v3a": (5.0, 3.0),
        "9v3a": (9.0, 3.0),
        "15v3a": (15.0, 3.0),
        "20v3_25a": (20.0, 3.25),
        "20v5a": (20.0, 5.0),
        "28v5a": (28.0, 5.0),
    }
    if prof in profiles:
        v, a = profiles[prof]
    else:
        v = max(3.0, float(d.get("custom_voltage", 9.0)))
        a = max(0.1, float(d.get("custom_amps", 3.0)))
    w = round(v * a, 1)
    epr = "EPR (Extended Power Range 100W+)" if w > 100.0 else "SPR (Standard Power Range)"
    cable = "5A E-Marked Type-C to Type-C Cable Required" if a > 3.0 or w > 60.0 else "Standard 3A Type-C Cable"
    return {
        "output_wattage_w": w,
        "operating_voltage_v": v,
        "operating_current_a": a,
        "epr_status": epr,
        "cable_spec_required": cable,
        "status": f"{w}W ({epr})"
    }

register_calculator(
    "usb-c-power-delivery-wattage-calculator",
    "USB-C Power-Delivery Wattage Calculator",
    "mobile_servicing",
    "Calculate USB-PD 3.0/3.1 wattage profiles and verify E-Marker 5A cable requirements.",
    [
        CalcField("pd_profile", "USB-PD Fixed Profile", "select", required=True, default="9v3a",
                  options=[{"value": "5v3a", "label": "5V / 3A (15W Basic)"},
                           {"value": "9v3a", "label": "9V / 3A (27W Standard Fast Charge)"},
                           {"value": "15v3a", "label": "15V / 3A (45W Fast Charge / Tablet)"},
                           {"value": "20v3_25a", "label": "20V / 3.25A (65W Laptop / Ultra Phone)"},
                           {"value": "20v5a", "label": "20V / 5A (100W High Power)"},
                           {"value": "28v5a", "label": "28V / 5A (140W USB-PD 3.1 EPR)"},
                           {"value": "custom", "label": "Custom Voltage & Current"}]),
        CalcField("custom_voltage", "Custom Voltage (V)", "number", unit="V", required=False, default=9.0, min=3.0, max=48.0),
        CalcField("custom_amps", "Custom Current (A)", "number", unit="A", required=False, default=3.0, min=0.1, max=10.0),
    ],
    calc_usb_pd_wattage
)

# 9. Charger Output Compatibility Checker
def calc_charger_compatibility(d: Dict[str, Any]) -> Dict[str, Any]:
    phone_w = max(5.0, float(d.get("phone_max_wattage", 33.0)))
    phone_v = max(5.0, float(d.get("phone_max_volts", 11.0)))
    phone_a = max(1.0, float(d.get("phone_max_amps", 3.0)))
    chg_w = max(5.0, float(d.get("charger_wattage", 65.0)))
    chg_v = max(5.0, float(d.get("charger_max_volts", 20.0)))
    chg_a = max(1.0, float(d.get("charger_max_amps", 3.25)))
    negotiated_w = min(phone_w, chg_w)
    if phone_w < chg_w:
        bottleneck = "Phone Charge Controller Limited (Safe)"
    elif chg_w < phone_w:
        bottleneck = "Charger Wattage Limited (Phone will charge slower than max capability)"
    else:
        bottleneck = "Optimal Match (100% Saturated)"
    return {
        "negotiated_wattage_w": negotiated_w,
        "compatibility_status": "Fully Safe & Compatible (Smart Protocol Auto-Handshake)",
        "bottleneck_factor": bottleneck,
        "max_phone_supported_w": phone_w,
        "max_charger_supply_w": chg_w,
        "status": f"{negotiated_w}W Negotiated Speed"
    }

register_calculator(
    "charger-output-compatibility-checker",
    "Charger Output Compatibility Checker",
    "mobile_servicing",
    "Verify smartphone handshake compatibility and wattage negotiation with third-party GaN chargers.",
    [
        CalcField("phone_max_wattage", "Phone Max Fast Charge Rating (W)", "number", unit="W", required=True, default=33.0, min=5.0, max=240.0),
        CalcField("phone_max_volts", "Phone Max Voltage (V)", "number", unit="V", required=False, default=11.0, min=5.0, max=30.0),
        CalcField("phone_max_amps", "Phone Max Current (A)", "number", unit="A", required=False, default=3.0, min=1.0, max=12.0),
        CalcField("charger_wattage", "Charger Maximum Wattage (W)", "number", unit="W", required=True, default=65.0, min=5.0, max=300.0),
        CalcField("charger_max_volts", "Charger Max Voltage (V)", "number", unit="V", required=False, default=20.0, min=5.0, max=48.0),
        CalcField("charger_max_amps", "Charger Max Current (A)", "number", unit="A", required=False, default=3.25, min=1.0, max=15.0),
    ],
    calc_charger_compatibility
)

# 10. Screen Size & Diagonal Calculator
def calc_screen_diagonal(d: Dict[str, Any]) -> Dict[str, Any]:
    w = max(10.0, float(d.get("screen_width_mm", 70.6)))
    h = max(10.0, float(d.get("screen_height_mm", 152.8)))
    diag_mm = math.sqrt(w**2 + h**2)
    diag_in = round(diag_mm / 25.4, 2)
    area_cm2 = round((w * h) / 100.0, 2)
    ratio = round(h / w, 2)
    return {
        "diagonal_inches": diag_in,
        "diagonal_mm": round(diag_mm, 1),
        "screen_area_cm2": area_cm2,
        "aspect_ratio_decimal": ratio,
        "status": f"{diag_in} Inch Display"
    }

register_calculator(
    "screen-size-diagonal-calculator",
    "Screen Size & Diagonal Calculator",
    "mobile_servicing",
    "Calculate display diagonal inches, surface area, and physical dimensions from millimeter screen measurements.",
    [
        CalcField("screen_width_mm", "Screen Active Width (mm)", "number", unit="mm", required=True, default=70.6, min=10.0, max=500.0),
        CalcField("screen_height_mm", "Screen Active Height (mm)", "number", unit="mm", required=True, default=152.8, min=10.0, max=500.0),
    ],
    calc_screen_diagonal
)

# 11. Screen PPI Calculator
def calc_screen_ppi(d: Dict[str, Any]) -> Dict[str, Any]:
    w = max(100, int(d.get("horizontal_pixels", 1080)))
    h = max(100, int(d.get("vertical_pixels", 2400)))
    diag = max(1.0, float(d.get("diagonal_inches", 6.67)))
    diag_px = math.sqrt(w**2 + h**2)
    ppi = round(diag_px / diag, 1)
    mp = round((w * h) / 1000000.0, 2)
    retina_dist_cm = round(8630.0 / ppi, 1)
    tier = "Flagship Ultra-Sharp (400+ PPI)" if ppi >= 400 else ("FHD Standard (300-400 PPI)" if ppi >= 300 else "Budget / Low Pixel Density (< 300 PPI)")
    return {
        "pixel_density_ppi": ppi,
        "total_screen_megapixels": mp,
        "retina_viewing_distance_cm": retina_dist_cm,
        "sharpness_tier": tier,
        "status": f"{ppi} PPI"
    }

register_calculator(
    "screen-ppi-calculator",
    "Screen PPI Calculator",
    "mobile_servicing",
    "Calculate screen pixels-per-inch (PPI) density, total megapixels, and retina viewing distance.",
    [
        CalcField("horizontal_pixels", "Horizontal Resolution (pixels)", "number", unit="px", required=True, default=1080, min=100, max=10000),
        CalcField("vertical_pixels", "Vertical Resolution (pixels)", "number", unit="px", required=True, default=2400, min=100, max=10000),
        CalcField("diagonal_inches", "Screen Diagonal (inches)", "number", unit="in", required=True, default=6.67, min=1.0, max=32.0),
    ],
    calc_screen_ppi
)

# 12. Screen Aspect-Ratio Calculator
def calc_screen_aspect_ratio(d: Dict[str, Any]) -> Dict[str, Any]:
    w = max(10, int(d.get("width_pixels", 1080)))
    h = max(10, int(d.get("height_pixels", 2400)))
    gcd = math.gcd(w, h)
    rw = w // gcd
    rh = h // gcd
    dec = round(max(w, h) / min(w, h), 2)
    if dec >= 2.15:
        category = "Tall Ultrawide 20.5:9 / 21:9 (Cinematic)"
    elif dec >= 2.05:
        category = "Modern FullView 20:9"
    elif dec >= 1.95:
        category = "Smartphone Notch Standard 19.5:9"
    elif dec >= 1.85:
        category = "19:9 Smartphone Display"
    elif dec >= 1.75:
        category = "18:9 / 2:1 Bezel-less Standard"
    else:
        category = "Classic 16:9 / 4:3 Display"
    return {
        "aspect_ratio_standard": f"{rh}:{rw}",
        "decimal_aspect_ratio": f"{dec}:1",
        "display_form_factor": category,
        "status": f"{rh}:{rw} ({dec}:1)"
    }

register_calculator(
    "screen-aspect-ratio-calculator",
    "Screen Aspect-Ratio Calculator",
    "mobile_servicing",
    "Find greatest common divisor (GCD) aspect ratio and modern smartphone display form factor.",
    [
        CalcField("width_pixels", "Width Resolution (pixels)", "number", unit="px", required=True, default=1080, min=100, max=10000),
        CalcField("height_pixels", "Height Resolution (pixels)", "number", unit="px", required=True, default=2400, min=100, max=10000),
    ],
    calc_screen_aspect_ratio
)

# 13. Display Replacement Size Matcher
def calc_display_replacement_matcher(d: Dict[str, Any]) -> Dict[str, Any]:
    ow = max(10.0, float(d.get("original_width_mm", 75.8)))
    oh = max(10.0, float(d.get("original_height_mm", 164.2)))
    rw = max(10.0, float(d.get("replacement_width_mm", 75.5)))
    rh = max(10.0, float(d.get("replacement_height_mm", 163.9)))
    margin = max(0.1, float(d.get("frame_margin_mm", 0.8)))
    dw = round(abs(ow - rw), 2)
    dh = round(abs(oh - rh), 2)
    if dw <= 0.2 and dh <= 0.2:
        fit = "Exact OEM Flush Fit"
    elif dw <= margin and dh <= margin:
        fit = "Compatible Aftermarket (Suitable with B-7000/T-8000 adhesive)"
    else:
        fit = "Incompatible Dimensions (High frame gap or bezel pressure risk)"
    return {
        "match_verdict": fit,
        "width_variance_mm": dw,
        "height_variance_mm": dh,
        "frame_clearance_limit_mm": margin,
        "status": fit
    }

register_calculator(
    "display-replacement-size-matcher",
    "Display Replacement Size Matcher",
    "mobile_servicing",
    "Verify aftermarket LCD/OLED replacement frame fit tolerance against OEM housing specifications.",
    [
        CalcField("original_width_mm", "Original Screen Width (mm)", "number", unit="mm", required=True, default=75.8, min=20.0, max=300.0),
        CalcField("original_height_mm", "Original Screen Height (mm)", "number", unit="mm", required=True, default=164.2, min=20.0, max=300.0),
        CalcField("replacement_width_mm", "Replacement Glass Width (mm)", "number", unit="mm", required=True, default=75.5, min=20.0, max=300.0),
        CalcField("replacement_height_mm", "Replacement Glass Height (mm)", "number", unit="mm", required=True, default=163.9, min=20.0, max=300.0),
        CalcField("frame_margin_mm", "Frame Gasket Tolerance (mm)", "number", unit="mm", required=False, default=0.8, min=0.1, max=3.0),
    ],
    calc_display_replacement_matcher
)

# 14. Camera Megapixel Calculator
def calc_camera_megapixel(d: Dict[str, Any]) -> Dict[str, Any]:
    w = max(100, int(d.get("sensor_width_pixels", 8192)))
    h = max(100, int(d.get("sensor_height_pixels", 6144)))
    mode = str(d.get("binning_mode", "4in1_quad_bayer"))
    raw_mp = round((w * h) / 1000000.0, 1)
    div_map = {"1x1_raw": 1, "4in1_quad_bayer": 4, "9in1_nona_bayer": 9, "16in1_tetra": 16}
    div = div_map.get(mode, 4)
    binned_mp = round(raw_mp / div, 1)
    factor = math.sqrt(div)
    out_w = int(w / factor)
    out_h = int(h / factor)
    return {
        "raw_sensor_megapixels": raw_mp,
        "effective_output_megapixels": binned_mp,
        "output_photo_resolution": f"{out_w} × {out_h} px",
        "low_light_signal_boost": f"{div}x Pixel Area Combined",
        "status": f"{binned_mp} MP Photo"
    }

register_calculator(
    "camera-megapixel-calculator",
    "Camera Megapixel Calculator",
    "mobile_servicing",
    "Calculate raw sensor megapixels, pixel binning (Tetracell/Nonacell) resolution, and aspect ratio.",
    [
        CalcField("sensor_width_pixels", "Sensor Width (pixels)", "number", unit="px", required=True, default=8192, min=100, max=25000),
        CalcField("sensor_height_pixels", "Sensor Height (pixels)", "number", unit="px", required=True, default=6144, min=100, max=25000),
        CalcField("binning_mode", "Pixel Binning Architecture", "select", required=True, default="4in1_quad_bayer",
                  options=[{"value": "1x1_raw", "label": "Full Sensor Resolution (1x1 Raw)"},
                           {"value": "4in1_quad_bayer", "label": "Quad Bayer / Tetracell (4-in-1)"},
                           {"value": "9in1_nona_bayer", "label": "Nona Bayer / Nonacell (9-in-1)"},
                           {"value": "16in1_tetra", "label": "Tetra2Pixel (16-in-1)"}]),
    ],
    calc_camera_megapixel
)

# 15. Storage Capacity Converter
def calc_storage_converter(d: Dict[str, Any]) -> Dict[str, Any]:
    gb = max(1.0, float(d.get("advertised_gb", 128.0)))
    mode = str(d.get("unit_system", "decimal_to_binary"))
    if mode == "binary_to_decimal":
        dec_gb = round(gb * (1024.0**3) / (1000.0**3), 2)
        return {
            "retail_decimal_gb": dec_gb,
            "os_binary_gib": gb,
            "status": f"{dec_gb} GB Retail"
        }
    else:
        gib = round((gb * (1000.0**3)) / (1024.0**3), 2)
        diff = round(gb - gib, 2)
        pct = round((diff / gb) * 100.0, 1)
        return {
            "actual_os_capacity_gib": gib,
            "unallocated_conversion_loss_gb": diff,
            "conversion_discrepancy_pct": pct,
            "status": f"{gib} GiB Real Memory"
        }

register_calculator(
    "storage-capacity-converter",
    "Storage Capacity Converter",
    "mobile_servicing",
    "Explain decimal retail storage (GB) versus true operating system binary storage (GiB).",
    [
        CalcField("advertised_gb", "Advertised Capacity", "number", unit="GB", required=True, default=128.0, min=1.0, max=4096.0),
        CalcField("unit_system", "Conversion Mode", "select", required=True, default="decimal_to_binary",
                  options=[{"value": "decimal_to_binary", "label": "Retail GB (Base 1000) to OS GiB (Base 1024)"},
                           {"value": "binary_to_decimal", "label": "OS GiB (Base 1024) to Retail GB (Base 1000)"}]),
    ],
    calc_storage_converter
)

# 16. Usable Storage Calculator
def calc_usable_storage(d: Dict[str, Any]) -> Dict[str, Any]:
    rom = max(8.0, float(d.get("rom_capacity_gb", 128.0)))
    sys_gb = max(2.0, float(d.get("system_overhead_gb", 16.0)))
    binary_real = (rom * (1000.0**3)) / (1024.0**3)
    usable = round(max(0.0, binary_real - sys_gb), 1)
    photos = int((usable * 1024.0) / 4.5)
    video_hrs = round((usable * 1024.0) / (60.0 * 150.0), 1)
    return {
        "usable_user_storage_gb": usable,
        "operating_system_reserved_gb": round(sys_gb, 1),
        "estimated_photos_capacity": photos,
        "estimated_4k_video_hours": video_hrs,
        "status": f"{usable} GB Available"
    }

register_calculator(
    "usable-storage-calculator",
    "Usable Storage Calculator",
    "mobile_servicing",
    "Calculate actual available storage space for user files after Android/iOS OS partitions and firmware.",
    [
        CalcField("rom_capacity_gb", "Phone Internal Storage (ROM)", "number", unit="GB", required=True, default=128.0, min=8.0, max=2048.0),
        CalcField("os_type", "Operating System", "select", required=True, default="android",
                  options=[{"value": "android", "label": "Android OS (OneUI, HyperOS, ColorOS)"},
                           {"value": "ios", "label": "Apple iOS (iPhone)"},
                           {"value": "stock", "label": "Stock / Clean Android"}]),
        CalcField("system_overhead_gb", "Firmware & System Reserved (GB)", "number", unit="GB", required=False, default=16.0, min=2.0, max=64.0),
    ],
    calc_usable_storage
)

# 17. RAM / Storage Performance Estimator
def calc_ram_storage_perf(d: Dict[str, Any]) -> Dict[str, Any]:
    ram = str(d.get("ram_type", "lpddr5"))
    storage = str(d.get("storage_type", "ufs31"))
    ram_bw = {"lpddr4": 25.6, "lpddr4x": 34.1, "lpddr5": 51.2, "lpddr5x": 68.2}.get(ram, 51.2)
    s_read = {"emmc51": 300, "ufs22": 1000, "ufs31": 2100, "ufs40": 4200}.get(storage, 2100)
    s_write = {"emmc51": 150, "ufs22": 260, "ufs31": 1200, "ufs40": 2800}.get(storage, 1200)
    if ram_bw >= 50.0 and s_read >= 2000:
        tier = "Flagship Tier: Ultra-Responsive (Zero App Stutter)"
    elif s_read >= 800:
        tier = "Mid-Range Tier: Smooth Multitasking & Fast App Launch"
    else:
        tier = "Entry-Level Tier: Standard Everyday Browsing"
    return {
        "ram_peak_bandwidth_gbs": ram_bw,
        "storage_seq_read_mbs": s_read,
        "storage_seq_write_mbs": s_write,
        "app_performance_tier": tier,
        "status": tier
    }

register_calculator(
    "ram-storage-performance-estimator",
    "RAM / Storage Performance Estimator",
    "mobile_servicing",
    "Estimate system memory bandwidth and storage read/write throughput speeds across LPDDR and UFS generations.",
    [
        CalcField("ram_type", "RAM Architecture", "select", required=True, default="lpddr5",
                  options=[{"value": "lpddr4", "label": "LPDDR4 (Legacy Budget)"},
                           {"value": "lpddr4x", "label": "LPDDR4X (Budget / Mid-range Standard)"},
                           {"value": "lpddr5", "label": "LPDDR5 (Flagship Standard)"},
                           {"value": "lpddr5x", "label": "LPDDR5X (Next-Gen AI Flagship)"}]),
        CalcField("storage_type", "Internal Storage Flash Type", "select", required=True, default="ufs31",
                  options=[{"value": "emmc51", "label": "eMMC 5.1 (Legacy Entry-level)"},
                           {"value": "ufs22", "label": "UFS 2.2 (Modern Budget)"},
                           {"value": "ufs31", "label": "UFS 3.1 (High Speed Flagship)"},
                           {"value": "ufs40", "label": "UFS 4.0 (Ultra High-Speed)"}]),
    ],
    calc_ram_storage_perf
)

# 18. Processor Performance Comparison Calculator
def calc_processor_comparison(d: Dict[str, Any]) -> Dict[str, Any]:
    a_cores = max(1, int(d.get("chip_a_cores", 8)))
    a_freq = max(0.5, float(d.get("chip_a_freq_ghz", 3.2)))
    a_nm = max(1, int(d.get("chip_a_node_nm", 4)))
    b_cores = max(1, int(d.get("chip_b_cores", 8)))
    b_freq = max(0.5, float(d.get("chip_b_freq_ghz", 2.4)))
    b_nm = max(1, int(d.get("chip_b_node_nm", 6)))
    score_a = round((a_cores * 0.7 + a_freq * 2.5) * (10.0 / a_nm) * 100.0, 0)
    score_b = round((b_cores * 0.7 + b_freq * 2.5) * (10.0 / b_nm) * 100.0, 0)
    diff = round(((score_a - score_b) / max(1.0, score_b)) * 100.0, 1)
    winner = "Chipset A" if diff >= 0 else "Chipset B"
    lead_pct = abs(diff)
    return {
        "chipset_a_benchmark_index": score_a,
        "chipset_b_benchmark_index": score_b,
        "performance_difference_pct": lead_pct,
        "faster_processor": winner,
        "status": f"{winner} Leads by {lead_pct}%"
    }

register_calculator(
    "processor-performance-comparison-calculator",
    "Processor Performance Comparison Calculator",
    "mobile_servicing",
    "Compare smartphone mobile SoC compute capabilities based on clock frequency, core architecture, and lithography nodes.",
    [
        CalcField("chip_a_cores", "Chip A Core Count", "number", required=True, default=8, min=1, max=16),
        CalcField("chip_a_freq_ghz", "Chip A Peak Clock (GHz)", "number", unit="GHz", required=True, default=3.2, min=0.5, max=5.0),
        CalcField("chip_a_node_nm", "Chip A Process Node (nm)", "number", unit="nm", required=True, default=4, min=1, max=28),
        CalcField("chip_b_cores", "Chip B Core Count", "number", required=True, default=8, min=1, max=16),
        CalcField("chip_b_freq_ghz", "Chip B Peak Clock (GHz)", "number", unit="GHz", required=True, default=2.4, min=0.5, max=5.0),
        CalcField("chip_b_node_nm", "Chip B Process Node (nm)", "number", unit="nm", required=True, default=6, min=1, max=28),
    ],
    calc_processor_comparison
)

# 19. Device Heat / Power Consumption Calculator
def calc_device_heat_power(d: Dict[str, Any]) -> Dict[str, Any]:
    b_temp = float(d.get("battery_temp_c", 38.5))
    c_temp = float(d.get("cpu_temp_c", 52.0))
    amb = float(d.get("ambient_temp_c", 28.0))
    p = max(0.1, float(d.get("power_draw_w", 4.5)))
    delta_t = round(c_temp - amb, 1)
    if c_temp >= 75.0 or b_temp >= 48.0:
        throttling = "Severe Thermal Throttling / Safety Shutdown Imminent"
    elif c_temp >= 60.0 or b_temp >= 42.0:
        throttling = "Moderate Thermal Throttling Active"
    else:
        throttling = "Normal Thermal State (Passive Cooling Efficient)"
    heat_w = round(p * 0.95, 2)
    return {
        "thermal_delta_c": delta_t,
        "throttling_status": throttling,
        "heat_dissipation_rate_w": heat_w,
        "battery_safety_status": "Overheating Warning" if b_temp >= 45.0 else "Normal Safe Range",
        "status": throttling
    }

register_calculator(
    "device-heat-power-consumption-calculator",
    "Device Heat / Power Consumption Calculator",
    "mobile_servicing",
    "Analyze mobile device thermal dissipation, SoC temperature deltas, and throttling thresholds.",
    [
        CalcField("battery_temp_c", "Battery Temperature (°C)", "number", unit="°C", required=True, default=38.5, min=0.0, max=100.0),
        CalcField("cpu_temp_c", "CPU SoC Temperature (°C)", "number", unit="°C", required=True, default=52.0, min=0.0, max=120.0),
        CalcField("ambient_temp_c", "Ambient Room Temperature (°C)", "number", unit="°C", required=True, default=28.0, min=-10.0, max=55.0),
        CalcField("power_draw_w", "Instantaneous Power Draw (W)", "number", unit="W", required=True, default=4.5, min=0.1, max=50.0),
    ],
    calc_device_heat_power
)

# 20. Resistor Color-Code Calculator
def calc_resistor_color(d: Dict[str, Any]) -> Dict[str, Any]:
    b1 = int(d.get("band1", 1))
    b2 = int(d.get("band2", 0))
    mult = float(d.get("band3_multiplier", 1000))
    tol = float(d.get("band4_tolerance", 5))
    val = (b1 * 10 + b2) * mult
    min_r = round(val * (1.0 - tol / 100.0), 2)
    max_r = round(val * (1.0 + tol / 100.0), 2)
    if val >= 1000000:
        fmt = f"{val/1000000:.2f} MΩ"
    elif val >= 1000:
        fmt = f"{val/1000:.1f} kΩ"
    else:
        fmt = f"{val:.1f} Ω"
    return {
        "resistance_ohms": val,
        "formatted_resistance": f"{fmt} ±{tol}%",
        "min_resistance_ohms": min_r,
        "max_resistance_ohms": max_r,
        "status": f"{fmt} ±{tol}%"
    }

register_calculator(
    "resistor-color-code-calculator",
    "Resistor Color-Code Calculator",
    "mobile_servicing",
    "Decode 4-band axial resistor color bands into exact resistance value and tolerance margins.",
    [
        CalcField("band1", "1st Color Band", "select", required=True, default=1,
                  options=[{"value": 0, "label": "Black (0)"}, {"value": 1, "label": "Brown (1)"},
                           {"value": 2, "label": "Red (2)"}, {"value": 3, "label": "Orange (3)"},
                           {"value": 4, "label": "Yellow (4)"}, {"value": 5, "label": "Green (5)"},
                           {"value": 6, "label": "Blue (6)"}, {"value": 7, "label": "Violet (7)"},
                           {"value": 8, "label": "Grey (8)"}, {"value": 9, "label": "White (9)"}]),
        CalcField("band2", "2nd Color Band", "select", required=True, default=0,
                  options=[{"value": 0, "label": "Black (0)"}, {"value": 1, "label": "Brown (1)"},
                           {"value": 2, "label": "Red (2)"}, {"value": 3, "label": "Orange (3)"},
                           {"value": 4, "label": "Yellow (4)"}, {"value": 5, "label": "Green (5)"},
                           {"value": 6, "label": "Blue (6)"}, {"value": 7, "label": "Violet (7)"},
                           {"value": 8, "label": "Grey (8)"}, {"value": 9, "label": "White (9)"}]),
        CalcField("band3_multiplier", "Multiplier Band", "select", required=True, default=1000,
                  options=[{"value": 1, "label": "Black (×1)"}, {"value": 10, "label": "Brown (×10)"},
                           {"value": 100, "label": "Red (×100)"}, {"value": 1000, "label": "Orange (×1k)"},
                           {"value": 10000, "label": "Yellow (×10k)"}, {"value": 100000, "label": "Green (×100k)"},
                           {"value": 1000000, "label": "Blue (×1M)"}, {"value": 0.1, "label": "Gold (×0.1)"},
                           {"value": 0.01, "label": "Silver (×0.01)"}]),
        CalcField("band4_tolerance", "Tolerance Band", "select", required=True, default=5,
                  options=[{"value": 1, "label": "Brown (±1%)"}, {"value": 2, "label": "Red (±2%)"},
                           {"value": 5, "label": "Gold (±5%)"}, {"value": 10, "label": "Silver (±10%)"}]),
    ],
    calc_resistor_color
)

# 21. SMD Resistor Code Calculator
def calc_smd_resistor(d: Dict[str, Any]) -> Dict[str, Any]:
    raw = str(d.get("code", "103")).strip().upper()
    val = 0.0
    std = "3-Digit Standard (5% Tolerance)"
    tol = "±5%"
    if "R" in raw:
        std = "Decimal Point 'R' Notation"
        try:
            val = float(raw.replace("R", "."))
        except Exception:
            val = 0.0
    elif len(raw) == 3 and raw.isdigit():
        val = int(raw[:2]) * (10 ** int(raw[2]))
        std = "3-Digit EIA Standard"
        tol = "±5%"
    elif len(raw) == 4 and raw.isdigit():
        val = int(raw[:3]) * (10 ** int(raw[3]))
        std = "4-Digit Precision Standard (1% Tolerance)"
        tol = "±1%"
    else:
        # Fallback EIA-96 estimation or standard
        val = 10000.0
        std = "Custom / High Precision Code"
    if val >= 1000000:
        fmt = f"{val/1000000:.2f} MΩ"
    elif val >= 1000:
        fmt = f"{val/1000:.1f} kΩ"
    else:
        fmt = f"{val:.1f} Ω"
    return {
        "resistance_ohms": val,
        "formatted_resistance": f"{fmt} {tol}",
        "code_standard": std,
        "tolerance": tol,
        "status": f"{fmt} ({raw})"
    }

register_calculator(
    "smd-resistor-code-calculator",
    "SMD Resistor Code Calculator",
    "mobile_servicing",
    "Decode 3-digit, 4-digit, and R-notation surface mount (SMD) smartphone resistor markings.",
    [
        CalcField("code", "SMD Resistor Code", "text", required=True, default="103", help="Examples: 103, 4R7, 1002, 0R0"),
    ],
    calc_smd_resistor
)

# 22. SMD Capacitor Code Calculator
def calc_smd_capacitor(d: Dict[str, Any]) -> Dict[str, Any]:
    raw = str(d.get("code", "104")).strip()
    volt = str(d.get("voltage_rating", "16V"))
    pf = 0.0
    if len(raw) == 3 and raw.isdigit():
        pf = int(raw[:2]) * (10 ** int(raw[2]))
    else:
        pf = 100000.0
    nf = round(pf / 1000.0, 3)
    uf = round(pf / 1000000.0, 4)
    return {
        "capacitance_pf": pf,
        "capacitance_nf": nf,
        "capacitance_uf": uf,
        "working_voltage_rating": volt,
        "common_application": "Decoupling / Bypass Capacitor" if uf >= 0.1 else "RF Filter / Timing Capacitor",
        "status": f"{uf} µF ({nf} nF)"
    }

register_calculator(
    "smd-capacitor-code-calculator",
    "SMD Capacitor Code Calculator",
    "mobile_servicing",
    "Decode 3-digit ceramic SMD capacitor codes into Picofarads (pF), Nanofarads (nF), and Microfarads (µF).",
    [
        CalcField("code", "3-Digit Marking Code", "text", required=True, default="104", help="Examples: 104 = 0.1µF, 226 = 22µF"),
        CalcField("voltage_rating", "Voltage Rating Label", "text", required=False, default="16V"),
    ],
    calc_smd_capacitor
)

# 23. Inductor Value Calculator
def calc_inductor_value(d: Dict[str, Any]) -> Dict[str, Any]:
    raw = str(d.get("code", "4R7")).strip().upper()
    core = str(d.get("core_type", "shielded_ferrite"))
    uh = 0.0
    if "R" in raw:
        try:
            uh = float(raw.replace("R", "."))
        except Exception:
            uh = 4.7
    elif len(raw) == 3 and raw.isdigit():
        uh = int(raw[:2]) * (10 ** int(raw[2]))
    else:
        uh = 4.7
    mh = round(uh / 1000.0, 4)
    app = "DC-DC Buck Converter Switching Choke" if core == "shielded_ferrite" else "RF High-Frequency Filter"
    return {
        "inductance_microhenries_uh": uh,
        "inductance_millihenries_mh": mh,
        "core_technology": core.replace("_", " ").title(),
        "primary_application": app,
        "status": f"{uh} µH Inductor"
    }

register_calculator(
    "inductor-value-calculator",
    "Inductor Value Calculator",
    "mobile_servicing",
    "Decode surface mount power inductors and switching chokes in mobile PMIC power lines.",
    [
        CalcField("code", "Inductor Marking Code", "text", required=True, default="4R7", help="Examples: 4R7 = 4.7µH, 100 = 10µH, 221 = 220µH"),
        CalcField("core_type", "Core Construction", "select", required=True, default="shielded_ferrite",
                  options=[{"value": "shielded_ferrite", "label": "Shielded Ferrite Power Choke"},
                           {"value": "ceramic_rf", "label": "Multilayer Ceramic RF Choke"},
                           {"value": "iron_powder", "label": "Iron Powder High-Current"}]),
    ],
    calc_inductor_value
)

# 24. Ohm’s Law Calculator
def calc_ohms_law(d: Dict[str, Any]) -> Dict[str, Any]:
    target = str(d.get("calculate_target", "r"))
    v = float(d.get("voltage_v", 4.2))
    i = float(d.get("current_a", 1.2))
    r = float(d.get("resistance_ohms", 3.5))
    if target == "v":
        res = round(i * r, 3)
        unit = "V"
        p = round(res * i, 2)
        formula = f"V = I × R = {i}A × {r}Ω = {res}V"
    elif target == "i":
        res = round(v / max(0.001, r), 3)
        unit = "A"
        p = round(v * res, 2)
        formula = f"I = V ÷ R = {v}V ÷ {r}Ω = {res}A"
    elif target == "p":
        res = round(v * i, 2)
        unit = "W"
        p = res
        formula = f"P = V × I = {v}V × {i}A = {res}W"
    else:  # r
        res = round(v / max(0.001, i), 3)
        unit = "Ω"
        p = round(v * i, 2)
        formula = f"R = V ÷ I = {v}V ÷ {i}A = {res}Ω"
    return {
        "calculated_result": res,
        "result_unit": unit,
        "power_dissipated_w": p,
        "formula_used": formula,
        "status": f"{res} {unit}"
    }

register_calculator(
    "ohms-law-calculator",
    "Ohm’s Law Calculator",
    "mobile_servicing",
    "Solve electrical circuits for voltage, current, resistance, and power dissipation.",
    [
        CalcField("voltage_v", "Voltage (V)", "number", unit="V", required=False, default=4.2, min=0.0, max=1000.0),
        CalcField("current_a", "Current (A)", "number", unit="A", required=False, default=1.2, min=0.001, max=100.0),
        CalcField("resistance_ohms", "Resistance (Ω)", "number", unit="Ω", required=False, default=3.5, min=0.001, max=1000000.0),
        CalcField("calculate_target", "Solve For Variable", "select", required=True, default="r",
                  options=[{"value": "r", "label": "Resistance (R = V ÷ I)"},
                           {"value": "v", "label": "Voltage (V = I × R)"},
                           {"value": "i", "label": "Current (I = V ÷ R)"},
                           {"value": "p", "label": "Power (P = V × I)"}]),
    ],
    calc_ohms_law
)

# 25. Voltage / Current / Power Calculator
def calc_voltage_current_power(d: Dict[str, Any]) -> Dict[str, Any]:
    v = max(0.1, float(d.get("voltage_v", 12.0)))
    i = max(0.01, float(d.get("current_a", 2.5)))
    w = round(v * i, 2)
    r = round(v / i, 2)
    joules = round(w * 60.0, 1)
    return {
        "power_watts": w,
        "calculated_resistance_ohms": r,
        "energy_dissipation_joules_sec": w,
        "thermal_energy_per_minute_joules": joules,
        "status": f"{w} Watts"
    }

register_calculator(
    "voltage-current-power-calculator",
    "Voltage / Current / Power Calculator",
    "mobile_servicing",
    "Direct DC power calculation, load resistance, and Joule heating emission.",
    [
        CalcField("voltage_v", "DC Voltage (V)", "number", unit="V", required=True, default=12.0, min=0.1, max=500.0),
        CalcField("current_a", "Current Load (A)", "number", unit="A", required=True, default=2.5, min=0.01, max=100.0),
    ],
    calc_voltage_current_power
)

# 26. Series / Parallel Resistance Calculator
def calc_series_parallel_resistance(d: Dict[str, Any]) -> Dict[str, Any]:
    r1 = max(0.0, float(d.get("r1", 100.0)))
    r2 = max(0.0, float(d.get("r2", 100.0)))
    r3 = max(0.0, float(d.get("r3", 0.0)))
    mode = str(d.get("circuit_mode", "parallel"))
    resistors = [r for r in [r1, r2, r3] if r > 0]
    if not resistors:
        return {"equivalent_resistance_ohms": 0.0, "status": "0 Ω"}
    if mode == "series":
        req = round(sum(resistors), 2)
    else:
        req = round(1.0 / sum(1.0 / r for r in resistors), 2)
    return {
        "equivalent_resistance_ohms": req,
        "resistors_counted": len(resistors),
        "configuration": mode.capitalize(),
        "status": f"{req} Ω ({mode.capitalize()})"
    }

register_calculator(
    "series-parallel-resistance-calculator",
    "Series / Parallel Resistance Calculator",
    "mobile_servicing",
    "Calculate combined equivalent resistance for series or parallel board circuit resistor arrays.",
    [
        CalcField("r1", "Resistor 1 (Ω)", "number", unit="Ω", required=True, default=100.0, min=0.1, max=10000000.0),
        CalcField("r2", "Resistor 2 (Ω)", "number", unit="True", default=100.0, min=0.1, max=10000000.0),
        CalcField("r3", "Resistor 3 (Optional, Ω)", "number", unit="Ω", required=False, default=0.0, min=0.0, max=10000000.0),
        CalcField("circuit_mode", "Connection Topology", "select", required=True, default="parallel",
                  options=[{"value": "parallel", "label": "Parallel Network"},
                           {"value": "series", "label": "Series Network"}]),
    ],
    calc_series_parallel_resistance
)

# 27. Short-Circuit Current Estimator
def calc_short_circuit_current(d: Dict[str, Any]) -> Dict[str, Any]:
    v = max(0.5, float(d.get("supply_voltage_v", 4.0)))
    r_mohm = max(1.0, float(d.get("line_impedance_milliohm", 80.0)))
    limit_a = max(0.1, float(d.get("psu_current_limit_a", 3.0)))
    r_ohm = r_mohm / 1000.0
    theo_a = round(v / r_ohm, 1)
    actual_a = min(theo_a, limit_a)
    heat_w = round(actual_a * v, 2)
    sev = "Dead Short (< 0.1Ω VDD_MAIN)" if theo_a > 30.0 else "High-Impedance Secondary Line Leakage"
    return {
        "prospective_short_current_a": theo_a,
        "actual_psu_clamped_current_a": actual_a,
        "heat_dissipated_at_short_w": heat_w,
        "short_severity": sev,
        "status": f"{actual_a} A Clamped ({sev})"
    }

register_calculator(
    "short-circuit-current-estimator",
    "Short-Circuit Current Estimator",
    "mobile_servicing",
    "Estimate DC bench power supply current clamp behavior and localized Joule heat during motherboard short-finding.",
    [
        CalcField("supply_voltage_v", "DC Power Supply Voltage (V)", "number", unit="V", required=True, default=4.0, min=0.5, max=30.0),
        CalcField("line_impedance_milliohm", "Probe & Line Impedance (mΩ)", "number", unit="mΩ", required=True, default=80.0, min=1.0, max=5000.0),
        CalcField("psu_current_limit_a", "PSU Current Limit (A)", "number", unit="A", required=True, default=3.0, min=0.1, max=10.0),
    ],
    calc_short_circuit_current
)

# 28. Fuse Rating Calculator
def calc_fuse_rating(d: Dict[str, Any]) -> Dict[str, Any]:
    load = max(0.1, float(d.get("continuous_load_a", 2.0)))
    inrush = max(0.1, float(d.get("inrush_current_a", 3.5)))
    margin = max(100.0, float(d.get("safety_factor_pct", 125.0))) / 100.0
    rating = round(load * margin, 2)
    rec = 2.5 if rating <= 2.5 else (3.0 if rating <= 3.0 else round(rating, 1))
    return {
        "recommended_fuse_rating_a": rec,
        "safety_margin_percentage": int(margin * 100),
        "standard_smd_package": "0402 / 0603 Fast-Blow SMD Fuse",
        "trip_profile": "Fast-Acting (Electronic Circuit Protection)",
        "status": f"{rec} A Rated Fuse"
    }

register_calculator(
    "fuse-rating-calculator",
    "Fuse Rating Calculator",
    "mobile_servicing",
    "Select appropriate continuous and inrush safety margins for SMD polyfuses and protective fuses.",
    [
        CalcField("continuous_load_a", "Continuous Operating Load (A)", "number", unit="A", required=True, default=2.0, min=0.1, max=50.0),
        CalcField("inrush_current_a", "Peak Surge / Inrush Current (A)", "number", unit="A", required=False, default=3.5, min=0.1, max=100.0),
        CalcField("safety_factor_pct", "Safety Factor (%)", "number", unit="%", required=False, default=125.0, min=105.0, max=200.0),
    ],
    calc_fuse_rating
)

# 29. PCB Trace Current Calculator
def calc_pcb_trace_current(d: Dict[str, Any]) -> Dict[str, Any]:
    w_mils = max(1.0, float(d.get("trace_width_mils", 25.0)))
    t_oz = max(0.5, float(d.get("copper_thickness_oz", 1.0)))
    delta_t = max(1.0, float(d.get("temp_rise_c", 10.0)))
    layer = str(d.get("layer_type", "external"))
    k = 0.048 if layer == "external" else 0.024
    area_sq_mils = w_mils * (t_oz * 1.378)
    max_a = round(k * (delta_t ** 0.44) * (area_sq_mils ** 0.725), 2)
    r_per_cm = round((0.678 / (w_mils * t_oz)), 4)
    return {
        "max_current_capacity_amps": max_a,
        "trace_cross_section_sq_mils": round(area_sq_mils, 1),
        "trace_resistance_per_cm_ohms": r_per_cm,
        "status": f"{max_a} A Max Current"
    }

register_calculator(
    "pcb-trace-current-calculator",
    "PCB Trace Current Calculator",
    "mobile_servicing",
    "Compute maximum PCB copper trace current capacity per IPC-2152 standards for smartphone motherboards.",
    [
        CalcField("trace_width_mils", "Trace Width (mils / 0.001 in)", "number", unit="mils", required=True, default=25.0, min=1.0, max=500.0),
        CalcField("copper_thickness_oz", "Copper Foil Thickness (oz)", "number", unit="oz", required=True, default=1.0, min=0.5, max=4.0),
        CalcField("temp_rise_c", "Allowable Temperature Rise (°C)", "number", unit="°C", required=True, default=10.0, min=1.0, max=100.0),
        CalcField("layer_type", "Trace Layer", "select", required=True, default="external",
                  options=[{"value": "external", "label": "External Layer (Microstrip)"},
                           {"value": "internal", "label": "Internal Layer (Stripline)"}]),
    ],
    calc_pcb_trace_current
)

# 30. Repair Cost vs. Phone Value Calculator
def calc_repair_vs_phone_value(d: Dict[str, Any]) -> Dict[str, Any]:
    val = max(10.0, float(d.get("phone_market_value", 350.0)))
    quote = max(1.0, float(d.get("repair_quote", 120.0)))
    life = max(1, int(d.get("expected_extra_life_months", 12)))
    ratio = round((quote / val) * 100.0, 1)
    cost_per_month = round(quote / life, 2)
    if ratio <= 40.0:
        verdict = "Economically Sound - Highly Recommended to Repair"
    elif ratio <= 65.0:
        verdict = "Borderline - Repair Only If Data or High Sentimental Value"
    else:
        verdict = "Uneconomical - Recommend Upgrading / Replacing Phone"
    return {
        "repair_to_value_ratio_pct": ratio,
        "economic_verdict": verdict,
        "cost_per_extended_month": cost_per_month,
        "phone_resale_market_value": val,
        "status": verdict
    }

register_calculator(
    "repair-cost-vs-phone-value-calculator",
    "Repair Cost vs. Phone Value Calculator",
    "mobile_servicing",
    "Evaluate smartphone repair feasibility comparing repair quote against current secondary device market value.",
    [
        CalcField("phone_market_value", "Phone Current Market Value ($)", "number", unit="$", required=True, default=350.0, min=10.0, max=3000.0),
        CalcField("repair_quote", "Total Quoted Repair Cost ($)", "number", unit="$", required=True, default=120.0, min=1.0, max=2000.0),
        CalcField("phone_age_months", "Phone Age (Months)", "number", unit="mo", required=False, default=18, min=1, max=120),
        CalcField("expected_extra_life_months", "Expected Added Life After Repair (Months)", "number", unit="mo", required=True, default=12, min=1, max=60),
    ],
    calc_repair_vs_phone_value
)


# ==============================================================================
# SECTION 2: REPAIR SHOP BUSINESS & PRICING (Calculators 31 - 50)
# ==============================================================================

# 31. Mobile Repair Quote Calculator
def calc_repair_quote(d: Dict[str, Any]) -> Dict[str, Any]:
    parts = max(0.0, float(d.get("parts_cost", 45.0)))
    labor_hrs = max(0.1, float(d.get("labor_hours", 1.5)))
    rate = max(5.0, float(d.get("labor_rate_hourly", 30.0)))
    margin_pct = max(0.0, float(d.get("target_margin_pct", 25.0)))
    tax_pct = max(0.0, float(d.get("tax_rate_pct", 10.0)))
    parts_billed = parts * (1.0 + margin_pct / 100.0)
    labor_billed = labor_hrs * rate
    subtotal = parts_billed + labor_billed
    tax = round(subtotal * (tax_pct / 100.0), 2)
    total = round(subtotal + tax, 2)
    profit = round(parts_billed - parts + (labor_billed * 0.7), 2)
    return {
        "total_repair_quote": total,
        "parts_total_billed": round(parts_billed, 2),
        "labor_total_billed": round(labor_billed, 2),
        "tax_amount": tax,
        "estimated_gross_profit": profit,
        "status": f"${total} Total Quote"
    }

register_calculator(
    "mobile-repair-quote-calculator",
    "Mobile Repair Quote Calculator",
    "repair_business",
    "Generate comprehensive repair price estimates including parts markup, technician labor, and local taxes.",
    [
        CalcField("parts_cost", "Replacement Parts Cost ($)", "number", unit="$", required=True, default=45.0, min=0.0, max=5000.0),
        CalcField("labor_hours", "Bench Labor Time (Hours)", "number", unit="hrs", required=True, default=1.5, min=0.1, max=20.0),
        CalcField("labor_rate_hourly", "Labor Hourly Rate ($)", "number", unit="$/hr", required=True, default=30.0, min=5.0, max=300.0),
        CalcField("target_margin_pct", "Parts Markup Margin (%)", "number", unit="%", required=False, default=25.0, min=0.0, max=200.0),
        CalcField("tax_rate_pct", "Sales Tax / VAT (%)", "number", unit="%", required=False, default=10.0, min=0.0, max=50.0),
    ],
    calc_repair_quote
)

# 32. Screen Replacement Price Calculator
def calc_screen_replacement_price(d: Dict[str, Any]) -> Dict[str, Any]:
    grade = str(d.get("screen_grade", "premium_oled"))
    cost = max(5.0, float(d.get("screen_wholesale_cost", 65.0)))
    diff = str(d.get("installation_difficulty", "standard"))
    warranty_days = int(d.get("warranty_days", 90))
    diff_mult = 1.0 if diff == "standard" else (1.35 if diff == "curved_edge" else 2.2)
    base_labor = 25.0 * diff_mult
    warranty_fund = round(cost * 0.08, 2)
    retail_parts = round(cost * 1.35, 2)
    price = round(retail_parts + base_labor + warranty_fund, 2)
    return {
        "recommended_retail_price": price,
        "parts_retail_portion": retail_parts,
        "labor_installation_charge": round(base_labor, 2),
        "warranty_risk_reserve": warranty_fund,
        "screen_grade_label": grade.replace("_", " ").title(),
        "status": f"${price} Price ({warranty_days}d Warranty)"
    }

register_calculator(
    "screen-replacement-price-calculator",
    "Screen Replacement Price Calculator",
    "repair_business",
    "Price smartphone display replacements across OLED, OEM Refurb, and Incell tiers with warranty reserves.",
    [
        CalcField("screen_grade", "Screen Quality Tier", "select", required=True, default="premium_oled",
                  options=[{"value": "original_oem", "label": "Original OEM Service Pack"},
                           {"value": "premium_oled", "label": "Premium OLED (Hard/Soft)"},
                           {"value": "incell_lcd", "label": "Incell LCD (Budget Option)"},
                           {"value": "glass_only", "label": "OCA Refurbished Glass"}]),
        CalcField("screen_wholesale_cost", "Screen Wholesale Cost ($)", "number", unit="$", required=True, default=65.0, min=5.0, max=1500.0),
        CalcField("installation_difficulty", "Chassis Structure Difficulty", "select", required=True, default="standard",
                  options=[{"value": "standard", "label": "Standard Bezel (Flat Glass)"},
                           {"value": "curved_edge", "label": "Curved Edge Display (High Care)"},
                           {"value": "foldable", "label": "Foldable / Flip Screen (Complex)"}]),
        CalcField("warranty_days", "Warranty Period (Days)", "number", unit="days", required=False, default=90, min=0, max=365),
    ],
    calc_screen_replacement_price
)

# 33. Battery Replacement Price Calculator
def calc_battery_replacement_price(d: Dict[str, Any]) -> Dict[str, Any]:
    cost = max(5.0, float(d.get("battery_cost", 18.0)))
    bms = str(d.get("bms_flex_transplant", "no"))
    gasket = max(0.0, float(d.get("adhesive_waterproof_gasket_cost", 3.0)))
    labor = max(10.0, float(d.get("labor_markup", 25.0)))
    bms_fee = 25.0 if bms == "yes" else 0.0
    bench_min = 60 if bms == "yes" else 20
    total = round(cost * 1.3 + gasket + labor + bms_fee, 2)
    return {
        "customer_battery_price": total,
        "parts_and_gasket_cost": round(cost + gasket, 2),
        "bms_microsolder_surcharge": bms_fee,
        "technician_time_minutes": bench_min,
        "status": f"${total} Installed"
    }

register_calculator(
    "battery-replacement-price-calculator",
    "Battery Replacement Price Calculator",
    "repair_business",
    "Standardize smartphone battery replacement charges including OEM BMS flex transplant surcharges.",
    [
        CalcField("battery_cost", "Battery Cell Wholesale Cost ($)", "number", unit="$", required=True, default=18.0, min=5.0, max=250.0),
        CalcField("bms_flex_transplant", "Transfer Original BMS Flex & Spot Weld?", "select", required=True, default="no",
                  options=[{"value": "no", "label": "No (Standard Drop-in Cell)"},
                           {"value": "yes", "label": "Yes (Transfer BMS & Reprogram Cycles)"}]),
        CalcField("adhesive_waterproof_gasket_cost", "Adhesive & Seal Gasket Cost ($)", "number", unit="$", required=False, default=3.0, min=0.0, max=30.0),
        CalcField("labor_markup", "Standard Installation Labor ($)", "number", unit="$", required=True, default=25.0, min=5.0, max=100.0),
    ],
    calc_battery_replacement_price
)

# 34. Charging-Port Repair Quote Calculator
def calc_charging_port_quote(d: Dict[str, Any]) -> Dict[str, Any]:
    repair_type = str(d.get("repair_type", "microsoldering_port"))
    comp_cost = max(1.0, float(d.get("component_cost", 4.0)))
    bench_min = max(10, int(d.get("bench_time_minutes", 40)))
    rate = max(15.0, float(d.get("hourly_rate", 45.0)))
    labor = round((bench_min / 60.0) * rate, 2)
    skill_premium = 15.0 if repair_type == "microsoldering_port" else 0.0
    total = round(comp_cost * 1.8 + labor + skill_premium, 2)
    return {
        "charging_port_repair_quote": total,
        "labor_fee": labor,
        "microsoldering_skill_premium": skill_premium,
        "component_cost": comp_cost,
        "status": f"${total} Port Repair"
    }

register_calculator(
    "charging-port-repair-quote-calculator",
    "Charging-Port Repair Quote Calculator",
    "repair_business",
    "Quote Type-C & Lightning port repairs for sub-board swaps versus board-level micro-soldering.",
    [
        CalcField("repair_type", "Repair Technique", "select", required=True, default="microsoldering_port",
                  options=[{"value": "microsoldering_port", "label": "Type-C Pin Micro-soldering"},
                           {"value": "sub_board_swap", "label": "Sub-Board PCB Swap"},
                           {"value": "flex_cable", "label": "Interconnect Flex Cable Replacement"}]),
        CalcField("component_cost", "Component Hardware Cost ($)", "number", unit="$", required=True, default=4.0, min=0.5, max=50.0),
        CalcField("bench_time_minutes", "Bench Work Duration (Minutes)", "number", unit="min", required=True, default=40, min=10, max=180),
        CalcField("hourly_rate", "Technician Hourly Rate ($)", "number", unit="$/hr", required=True, default=45.0, min=15.0, max=200.0),
    ],
    calc_charging_port_quote
)

# 35. Motherboard-Level Repair Quote Calculator
def calc_motherboard_repair_quote(d: Dict[str, Any]) -> Dict[str, Any]:
    scope = str(d.get("repair_scope", "pmic_audio_reball"))
    ic_cost = max(5.0, float(d.get("base_ic_cost", 15.0)))
    risk = str(d.get("risk_level", "medium"))
    rate = max(20.0, float(d.get("shop_hourly_rate", 50.0)))
    hrs_map = {"vbatt_short": 1.5, "pmic_audio_reball": 2.5, "cpu_ram_sandwich": 4.5, "layer_jumper": 2.0}
    hrs = hrs_map.get(scope, 2.0)
    risk_mult = 1.1 if risk == "low" else (1.35 if risk == "medium" else 1.65)
    quote = round((ic_cost + hrs * rate) * risk_mult, 2)
    no_fix = round(quote * 0.25, 2)
    return {
        "motherboard_repair_quote": quote,
        "diagnostic_no_fix_fee": no_fix,
        "estimated_bench_hours": hrs,
        "risk_contingency_reserve": round(quote - (ic_cost + hrs * rate), 2),
        "status": f"${quote} Logic Board Repair"
    }

register_calculator(
    "motherboard-level-repair-quote-calculator",
    "Motherboard-Level Repair Quote Calculator",
    "repair_business",
    "Quote advanced logic board diagnostics, BGA IC reballing, and sandwich PCB repairs.",
    [
        CalcField("repair_scope", "Board Repair Scope", "select", required=True, default="pmic_audio_reball",
                  options=[{"value": "vbatt_short", "label": "V_BAT / Main Line Short Finding"},
                           {"value": "pmic_audio_reball", "label": "PMIC / Audio IC Reballing"},
                           {"value": "cpu_ram_sandwich", "label": "CPU + RAM Dual-Decker Split"},
                           {"value": "layer_jumper", "label": "Torn Pad / Inner-Layer Jumper"}]),
        CalcField("base_ic_cost", "Replacement IC & Solder Consumables ($)", "number", unit="$", required=True, default=15.0, min=2.0, max=300.0),
        CalcField("risk_level", "Thermal Risk Profile", "select", required=True, default="medium",
                  options=[{"value": "low", "label": "Low Risk (Single BGA chip)"},
                           {"value": "medium", "label": "Medium Risk (Adjacent Underfill)"},
                           {"value": "high", "label": "High Risk (Sandwich / Memory)"}]),
        CalcField("shop_hourly_rate", "Master Technician Hourly Rate ($)", "number", unit="$/hr", required=True, default=50.0, min=20.0, max=300.0),
    ],
    calc_motherboard_repair_quote
)

# 36. Software / Unlock Service Price Calculator
def calc_software_unlock_price(d: Dict[str, Any]) -> Dict[str, Any]:
    cat = str(d.get("service_category", "firmware_flashing"))
    token_cost = max(0.0, float(d.get("server_credit_token_cost", 10.0)))
    mins = max(10, int(d.get("technician_minutes", 30)))
    labor = round((mins / 60.0) * 35.0, 2)
    total = round(token_cost * 1.5 + labor, 2)
    margin = round(((total - token_cost) / total) * 100.0, 1)
    return {
        "service_price_quote": total,
        "server_api_token_cost": token_cost,
        "technician_labor_charge": labor,
        "gross_profit_margin_pct": margin,
        "service_name": cat.replace("_", " ").title(),
        "status": f"${total} ({margin}% Margin)"
    }

register_calculator(
    "software-unlock-service-price-calculator",
    "Software / Unlock Service Price Calculator",
    "repair_business",
    "Calculate profitable pricing for firmware flashing, FRP bypass, bootloop recovery, and SIM unlocking.",
    [
        CalcField("service_category", "Software Service Category", "select", required=True, default="firmware_flashing",
                  options=[{"value": "firmware_flashing", "label": "Stock ROM Flashing & Unbrick"},
                           {"value": "bootloop_recovery", "label": "Bootloop Recovery / Cache Reset"},
                           {"value": "frp_bypass", "label": "FRP Google Account Bypass"},
                           {"value": "carrier_sim_unlock", "label": "Carrier Network SIM Unlock"}]),
        CalcField("server_credit_token_cost", "Server Credits / Dongle Authorization ($)", "number", unit="$", required=False, default=10.0, min=0.0, max=200.0),
        CalcField("technician_minutes", "Technician Time (Minutes)", "number", unit="min", required=True, default=30, min=5, max=180),
    ],
    calc_software_unlock_price
)

# 37. Data-Recovery Price Calculator
def calc_data_recovery_price(d: Dict[str, Any]) -> Dict[str, Any]:
    cond = str(d.get("damage_condition", "damaged_screen_locked"))
    vol_gb = max(1.0, float(d.get("data_volume_gb", 64.0)))
    priority = str(d.get("priority", "standard"))
    base_map = {"damaged_screen_locked": 45.0, "logical_loop": 65.0, "dead_motherboard": 140.0, "corrupted_emmc_ufs": 280.0}
    base = base_map.get(cond, 65.0)
    transfer = round(vol_gb * 0.25, 2)
    p_mult = 1.4 if priority == "express_24h" else 1.0
    quote = round((base + transfer) * p_mult, 2)
    return {
        "data_recovery_quote": quote,
        "bench_engineering_fee": base,
        "storage_extraction_fee": transfer,
        "policy": "No Data - No Fee Guarantee",
        "status": f"${quote} Data Recovery"
    }

register_calculator(
    "data-recovery-price-calculator",
    "Data-Recovery Price Calculator",
    "repair_business",
    "Quote smartphone data recovery based on hardware damage severity and storage volume extraction.",
    [
        CalcField("damage_condition", "Hardware / System Condition", "select", required=True, default="damaged_screen_locked",
                  options=[{"value": "damaged_screen_locked", "label": "Locked Device with Broken Screen"},
                           {"value": "logical_loop", "label": "Corrupted OS / Boot Partition"},
                           {"value": "dead_motherboard", "label": "Dead Motherboard (Temporary Power Bypass)"},
                           {"value": "corrupted_emmc_ufs", "label": "Chip-off UFS/eMMC Reader Extraction"}]),
        CalcField("data_volume_gb", "Target Data Volume (GB)", "number", unit="GB", required=True, default=64.0, min=1.0, max=1024.0),
        CalcField("priority", "Turnaround Priority", "select", required=True, default="standard",
                  options=[{"value": "standard", "label": "Standard Queue (3-5 Days)"},
                           {"value": "express_24h", "label": "Emergency Priority (24-Hour Express)"}]),
    ],
    calc_data_recovery_price
)

# 38. Water-Damage Repair Estimate Calculator
def calc_water_damage_estimate(d: Dict[str, Any]) -> Dict[str, Any]:
    liq = str(d.get("liquid_type", "freshwater"))
    hrs = max(1, int(d.get("time_since_exposure_hours", 24)))
    cleaning = max(15.0, float(d.get("ultrasonic_cleaning_fee", 30.0)))
    parts = max(0.0, float(d.get("components_replaced_cost", 40.0)))
    c_mult = 1.0 if liq == "freshwater" else (1.8 if liq == "saltwater" else 1.4)
    t_mult = 1.0 if hrs <= 12 else (1.25 if hrs <= 48 else 1.6)
    total = round((cleaning + parts) * c_mult * (1.0 + (t_mult - 1.0) * 0.35), 2)
    rel = "High Survival (85%)" if hrs < 24 and liq == "freshwater" else ("Fair (50-60%)" if hrs < 72 else "Low (< 35% - Data Backup Recommended)")
    return {
        "estimated_water_damage_total": total,
        "ultrasonic_cleaning_fee": cleaning,
        "projected_device_survival_rate": rel,
        "corrosion_factor_multiplier": c_mult,
        "status": f"${total} ({rel})"
    }

register_calculator(
    "water-damage-repair-estimate-calculator",
    "Water-Damage Repair Estimate Calculator",
    "repair_business",
    "Estimate ultrasonic desoxidation, parts replacement, and long-term phone survival probabilities.",
    [
        CalcField("liquid_type", "Liquid Contaminant", "select", required=True, default="freshwater",
                  options=[{"value": "freshwater", "label": "Freshwater (Rain / Clean Tap)"},
                           {"value": "saltwater", "label": "Saltwater / Sea Water (Extreme Corrosion)"},
                           {"value": "soda_coffee", "label": "Coffee, Soda or Sugary Drink"}]),
        CalcField("time_since_exposure_hours", "Hours Elapsed Since Exposure", "number", unit="hrs", required=True, default=24, min=1, max=300),
        CalcField("ultrasonic_cleaning_fee", "Ultrasonic Desoxidation Fee ($)", "number", unit="$", required=False, default=30.0, min=10.0, max=100.0),
        CalcField("components_replaced_cost", "Estimated Corroded Parts ($)", "number", unit="$", required=False, default=40.0, min=0.0, max=500.0),
    ],
    calc_water_damage_estimate
)

# 39. Parts Markup Calculator
def calc_parts_markup(d: Dict[str, Any]) -> Dict[str, Any]:
    cost = max(0.5, float(d.get("wholesale_cost", 25.0)))
    strat = str(d.get("pricing_strategy", "percentage_markup"))
    pct = max(0.0, float(d.get("markup_pct", 50.0)))
    if strat == "keystone_2x":
        retail = cost * 2.0
    elif strat == "target_gross_margin":
        retail = cost / max(0.01, (1.0 - pct / 100.0))
    else:
        retail = cost * (1.0 + pct / 100.0)
    profit = round(retail - cost, 2)
    margin = round((profit / retail) * 100.0, 1)
    return {
        "retail_selling_price": round(retail, 2),
        "gross_profit_amount": profit,
        "effective_gross_margin_pct": margin,
        "markup_multiplier": round(retail / cost, 2),
        "status": f"${round(retail, 2)} Retail ({margin}% Margin)"
    }

register_calculator(
    "parts-markup-calculator",
    "Parts Markup Calculator",
    "repair_business",
    "Calculate spare parts retail prices and gross margin percentages across multiple pricing formulas.",
    [
        CalcField("wholesale_cost", "Parts Wholesale Cost ($)", "number", unit="$", required=True, default=25.0, min=0.5, max=5000.0),
        CalcField("pricing_strategy", "Pricing Strategy", "select", required=True, default="percentage_markup",
                  options=[{"value": "percentage_markup", "label": "Cost-Plus Percentage Markup"},
                           {"value": "target_gross_margin", "label": "Target Gross Margin %"},
                           {"value": "keystone_2x", "label": "Keystone Pricing (2x Wholesale Cost)"}]),
        CalcField("markup_pct", "Markup / Margin Percentage (%)", "number", unit="%", required=False, default=50.0, min=0.0, max=500.0),
    ],
    calc_parts_markup
)

# 40. Labor-Rate Calculator
def calc_labor_rate(d: Dict[str, Any]) -> Dict[str, Any]:
    level = str(d.get("technician_level", "intermediate"))
    overhead = max(100.0, float(d.get("monthly_bench_overhead", 1200.0)))
    hours = max(20.0, float(d.get("billable_hours_monthly", 120.0)))
    margin = max(5.0, float(d.get("desired_profit_pct", 30.0)))
    wages = {"junior": 18.0, "intermediate": 28.0, "master_microsolder": 48.0}
    wage = wages.get(level, 28.0)
    overhead_hr = overhead / hours
    cost_hr = wage + overhead_hr
    rate = round(cost_hr / max(0.01, (1.0 - margin / 100.0)), 2)
    min_charge = round(rate * 0.5, 2)
    return {
        "recommended_hourly_labor_rate": rate,
        "break_even_hourly_cost": round(cost_hr, 2),
        "minimum_bench_inspection_fee": min_charge,
        "technician_base_wage_hourly": wage,
        "status": f"${rate}/hour"
    }

register_calculator(
    "labor-rate-calculator",
    "Labor-Rate Calculator",
    "repair_business",
    "Calculate hourly technician billable rates based on shop overhead expenses and profit targets.",
    [
        CalcField("technician_level", "Technician Skill Band", "select", required=True, default="intermediate",
                  options=[{"value": "junior", "label": "Junior Technician (Modular Swaps)"},
                           {"value": "intermediate", "label": "Intermediate Technician (Displays & Soldering)"},
                           {"value": "master_microsolder", "label": "Master Technician (BGA & Micro-soldering)"}]),
        CalcField("monthly_bench_overhead", "Monthly Bench Overhead Share ($)", "number", unit="$", required=True, default=1200.0, min=100.0, max=10000.0),
        CalcField("billable_hours_monthly", "Monthly Billable Bench Hours", "number", unit="hrs", required=True, default=120.0, min=20.0, max=250.0),
        CalcField("desired_profit_pct", "Shop Target Profit Margin (%)", "number", unit="%", required=False, default=30.0, min=5.0, max=70.0),
    ],
    calc_labor_rate
)

# 41. Technician Hourly Cost Calculator
def calc_technician_hourly_cost(d: Dict[str, Any]) -> Dict[str, Any]:
    salary = max(500.0, float(d.get("monthly_salary", 2500.0)))
    benefits_pct = max(0.0, float(d.get("benefits_taxes_pct", 15.0)))
    hrs_week = max(10.0, float(d.get("hours_worked_per_week", 40.0)))
    util = max(20.0, float(d.get("utilization_rate_pct", 70.0))) / 100.0
    burdened = salary * (1.0 + benefits_pct / 100.0)
    monthly_clock = (hrs_week * 52.0) / 12.0
    clock_cost = round(burdened / monthly_clock, 2)
    billable_hours = monthly_clock * util
    billable_cost = round(burdened / max(1.0, billable_hours), 2)
    return {
        "true_cost_per_billable_hour": billable_cost,
        "cost_per_clocked_hour": clock_cost,
        "monthly_burdened_cost": round(burdened, 2),
        "annual_technician_expense": round(burdened * 12.0, 2),
        "status": f"${billable_cost}/billable hr"
    }

register_calculator(
    "technician-hourly-cost-calculator",
    "Technician Hourly Cost Calculator",
    "repair_business",
    "Calculate true employer burdened hourly cost for mobile phone repair technicians.",
    [
        CalcField("monthly_salary", "Technician Monthly Base Salary ($)", "number", unit="$", required=True, default=2500.0, min=500.0, max=15000.0),
        CalcField("benefits_taxes_pct", "Taxes, Insurance & Benefits Overhead (%)", "number", unit="%", required=False, default=15.0, min=0.0, max=50.0),
        CalcField("hours_worked_per_week", "Weekly Scheduled Hours", "number", unit="hrs", required=True, default=40.0, min=10.0, max=60.0),
        CalcField("utilization_rate_pct", "Billable Bench Utilization Rate (%)", "number", unit="%", required=True, default=70.0, min=20.0, max=100.0),
    ],
    calc_technician_hourly_cost
)

# 42. Callout / Home-Service Fee Calculator
def calc_callout_fee(d: Dict[str, Any]) -> Dict[str, Any]:
    km = max(0.5, float(d.get("travel_distance_km", 15.0)))
    mins = max(5, int(d.get("travel_time_minutes", 35)))
    fuel_rate = max(0.1, float(d.get("vehicle_cost_per_km", 0.75)))
    opp_cost = max(10.0, float(d.get("bench_hourly_opportunity_cost", 35.0)))
    dispatch = max(5.0, float(d.get("dispatch_fee", 15.0)))
    fuel = km * fuel_rate
    time_cost = (mins / 60.0) * opp_cost
    total = round(dispatch + fuel + time_cost, 2)
    return {
        "total_callout_fee": total,
        "travel_expense_portion": round(fuel, 2),
        "technician_transit_cost": round(time_cost, 2),
        "base_dispatch_surcharge": dispatch,
        "status": f"${total} Callout Fee"
    }

register_calculator(
    "callout-home-service-fee-calculator",
    "Callout / Home-Service Fee Calculator",
    "repair_business",
    "Calculate on-site doorstep mobile repair callout dispatch fees factoring distance and technician transit time.",
    [
        CalcField("travel_distance_km", "Roundtrip Distance (km)", "number", unit="km", required=True, default=15.0, min=0.5, max=100.0),
        CalcField("travel_time_minutes", "Roundtrip Travel Time (Minutes)", "number", unit="min", required=True, default=35, min=5, max=240),
        CalcField("vehicle_cost_per_km", "Vehicle Wear & Fuel Rate ($/km)", "number", unit="$/km", required=False, default=0.75, min=0.1, max=3.0),
        CalcField("bench_hourly_opportunity_cost", "Technician Opportunity Cost ($/hr)", "number", unit="$/hr", required=True, default=35.0, min=10.0, max=150.0),
        CalcField("dispatch_fee", "Base Dispatch Administration Fee ($)", "number", unit="$", required=False, default=15.0, min=0.0, max=100.0),
    ],
    calc_callout_fee
)

# 43. Pickup-and-Delivery Charge Calculator
def calc_pickup_delivery_charge(d: Dict[str, Any]) -> Dict[str, Any]:
    km = max(0.5, float(d.get("roundtrip_km", 12.0)))
    base = max(1.0, float(d.get("courier_base_fare", 5.0)))
    per_km = max(0.2, float(d.get("per_km_rate", 1.2)))
    pack = max(0.0, float(d.get("packaging_insurance_fee", 3.0)))
    express = str(d.get("express_turnaround", "no"))
    sub = base + (km * per_km) + pack
    mult = 1.5 if express == "yes" else 1.0
    total = round(sub * mult, 2)
    return {
        "customer_delivery_charge": total,
        "courier_transit_cost": round(base + km * per_km, 2),
        "protective_packaging_insurance": pack,
        "service_tier": "Express 2-Hour" if express == "yes" else "Standard Dispatch",
        "status": f"${total} Delivery"
    }

register_calculator(
    "pickup-and-delivery-charge-calculator",
    "Pickup-and-Delivery Charge Calculator",
    "repair_business",
    "Calculate courier transit, insurance, and packaging fees for phone repair pickup-and-return services.",
    [
        CalcField("roundtrip_km", "Courier Roundtrip (km)", "number", unit="km", required=True, default=12.0, min=0.5, max=80.0),
        CalcField("courier_base_fare", "Base Fare ($)", "number", unit="$", required=False, default=5.0, min=1.0, max=30.0),
        CalcField("per_km_rate", "Distance Rate per km ($)", "number", unit="$/km", required=False, default=1.2, min=0.2, max=5.0),
        CalcField("packaging_insurance_fee", "Protective Pouch & Insurance ($)", "number", unit="$", required=False, default=3.0, min=0.0, max=25.0),
        CalcField("express_turnaround", "Express Rush Delivery (+50%)?", "select", required=True, default="no",
                  options=[{"value": "no", "label": "No (Standard Same-Day)"},
                           {"value": "yes", "label": "Yes (Express Rush Delivery)"}]),
    ],
    calc_pickup_delivery_charge
)

# 44. Warranty / Rework Cost Calculator
def calc_warranty_rework_cost(d: Dict[str, Any]) -> Dict[str, Any]:
    jobs = max(1, int(d.get("total_jobs_monthly", 150)))
    rework_pct = max(0.1, float(d.get("rework_return_rate_pct", 4.0)))
    avg_cost = max(5.0, float(d.get("avg_rework_cost_per_job", 35.0)))
    claims = round((jobs * rework_pct) / 100.0, 1)
    monthly_pool = round(claims * avg_cost, 2)
    burden = round(monthly_pool / jobs, 2)
    return {
        "monthly_warranty_reserve_pool": monthly_pool,
        "warranty_cost_burden_per_repair": burden,
        "annual_projected_warranty_loss": round(monthly_pool * 12.0, 2),
        "expected_monthly_return_jobs": claims,
        "status": f"${burden}/job Reserve"
    }

register_calculator(
    "warranty-rework-cost-calculator",
    "Warranty / Rework Cost Calculator",
    "repair_business",
    "Calculate warranty claim reserve funds and rework cost burden per repaired device.",
    [
        CalcField("total_jobs_monthly", "Monthly Completed Repairs", "number", unit="jobs", required=True, default=150, min=10, max=5000),
        CalcField("rework_return_rate_pct", "Warranty Claim / Return Rate (%)", "number", unit="%", required=True, default=4.0, min=0.1, max=30.0),
        CalcField("avg_rework_cost_per_job", "Average Cost to Re-repair ($)", "number", unit="$", required=True, default=35.0, min=5.0, max=500.0),
    ],
    calc_warranty_rework_cost
)

# 45. Repair-vs-Replace Calculator
def calc_repair_vs_replace(d: Dict[str, Any]) -> Dict[str, Any]:
    repair_cost = max(10.0, float(d.get("repair_cost", 140.0)))
    phone_cost = max(50.0, float(d.get("replacement_phone_cost", 450.0)))
    cur_mo = max(1, int(d.get("current_phone_months_left", 14)))
    new_mo = max(1, int(d.get("new_phone_expected_months", 36)))
    cost_repair_mo = round(repair_cost / cur_mo, 2)
    cost_replace_mo = round(phone_cost / new_mo, 2)
    savings = round((cost_replace_mo * cur_mo) - repair_cost, 2)
    verdict = "Repair Phone (Saves Money)" if cost_repair_mo <= cost_replace_mo else "Replace Phone (Better Long-term Value)"
    return {
        "monthly_cost_repairing": cost_repair_mo,
        "monthly_cost_replacing": cost_replace_mo,
        "net_savings_from_repair": savings,
        "decision_recommendation": verdict,
        "status": verdict
    }

register_calculator(
    "repair-vs-replace-calculator",
    "Repair-vs-Replace Calculator",
    "repair_business",
    "Compare monthly ownership costs between repairing an existing phone versus buying a brand new replacement.",
    [
        CalcField("repair_cost", "Total Quoted Repair Cost ($)", "number", unit="$", required=True, default=140.0, min=10.0, max=2000.0),
        CalcField("replacement_phone_cost", "New Replacement Phone Price ($)", "number", unit="$", required=True, default=450.0, min=50.0, max=3000.0),
        CalcField("current_phone_months_left", "Expected Repaired Phone Life (Months)", "number", unit="mo", required=True, default=14, min=1, max=60),
        CalcField("new_phone_expected_months", "Expected New Phone Life (Months)", "number", unit="mo", required=True, default=36, min=1, max=120),
    ],
    calc_repair_vs_replace
)

# 46. Old-Phone Trade-In Value Calculator
def calc_trade_in_value(d: Dict[str, Any]) -> Dict[str, Any]:
    base = max(10.0, float(d.get("base_used_market_price", 280.0)))
    screen = str(d.get("screen_condition", "minor_scratches"))
    batt = str(d.get("battery_health_condition", "above_85"))
    housing = str(d.get("housing_cosmetics", "scuffed"))
    margin = max(5.0, float(d.get("shop_resale_margin_pct", 20.0)))
    deduct = 0.0
    deduct += 0.0 if screen == "flawless" else (0.10 if screen == "minor_scratches" else 0.45)
    deduct += 0.0 if batt == "above_85" else (0.10 if batt == "75_to_85" else 0.25)
    deduct += 0.0 if housing == "mint" else (0.10 if housing == "scuffed" else 0.30)
    adjusted = base * max(0.1, (1.0 - deduct))
    offer = round(adjusted * (1.0 - margin / 100.0), 2)
    profit = round(adjusted - offer, 2)
    return {
        "trade_in_offer_price": offer,
        "projected_resale_market_value": round(adjusted, 2),
        "shop_resale_profit": profit,
        "total_condition_deduction_pct": round(deduct * 100.0, 1),
        "status": f"${offer} Trade-In Offer"
    }

register_calculator(
    "old-phone-trade-in-value-calculator",
    "Old-Phone Trade-In Value Calculator",
    "repair_business",
    "Appraise smartphone buyback trade-in values based on screen condition, battery health, and cosmetics.",
    [
        CalcField("base_used_market_price", "Flawless Grade-A Market Value ($)", "number", unit="$", required=True, default=280.0, min=10.0, max=2500.0),
        CalcField("screen_condition", "Screen Display State", "select", required=True, default="minor_scratches",
                  options=[{"value": "flawless", "label": "Flawless (No Marks)"},
                           {"value": "minor_scratches", "label": "Light Micro-Scratches (-10%)"},
                           {"value": "cracked", "label": "Cracked Glass / Defective LCD (-45%)"}]),
        CalcField("battery_health_condition", "Battery Health Condition", "select", required=True, default="above_85",
                  options=[{"value": "above_85", "label": "Good Health (> 85%)"},
                           {"value": "75_to_85", "label": "Moderate Health (75-85%) (-10%)"},
                           {"value": "needs_service", "label": "Service Required (< 75%) (-25%)"}]),
        CalcField("housing_cosmetics", "Chassis & Back Housing", "select", required=True, default="scuffed",
                  options=[{"value": "mint", "label": "Mint / Like New"},
                           {"value": "scuffed", "label": "Pocket Scuffs / Minor Paint Chips (-10%)"},
                           {"value": "bent_dented", "label": "Bent Frame / Impact Dents (-30%)"}]),
        CalcField("shop_resale_margin_pct", "Shop Target Resale Margin (%)", "number", unit="%", required=False, default=20.0, min=5.0, max=50.0),
    ],
    calc_trade_in_value
)

# 47. Refurbished Phone Price Calculator
def calc_refurbished_phone_price(d: Dict[str, Any]) -> Dict[str, Any]:
    buy = max(10.0, float(d.get("device_acquisition_cost", 150.0)))
    parts = max(0.0, float(d.get("parts_spent", 45.0)))
    hrs = max(0.1, float(d.get("technician_labor_hours", 1.2)))
    rate = max(10.0, float(d.get("hourly_rate", 30.0)))
    warranty_mo = int(d.get("warranty_months", 6))
    margin = max(5.0, float(d.get("target_profit_margin_pct", 25.0)))
    labor = hrs * rate
    reserve = parts * 0.10 + 10.0
    invested = buy + parts + labor + reserve
    retail = round(invested / max(0.01, (1.0 - margin / 100.0)), 2)
    profit = round(retail - invested, 2)
    return {
        "refurbished_selling_price": retail,
        "total_cost_invested": round(invested, 2),
        "net_profit_amount": profit,
        "warranty_contingency_fund": round(reserve, 2),
        "status": f"${retail} Price ({warranty_mo}m Warranty)"
    }

register_calculator(
    "refurbished-phone-price-calculator",
    "Refurbished Phone Price Calculator",
    "repair_business",
    "Price refurbished and renewed mobile phones covering parts spent, tech labor, and warranty reserve.",
    [
        CalcField("device_acquisition_cost", "Device Acquisition / Buyback Cost ($)", "number", unit="$", required=True, default=150.0, min=10.0, max=2000.0),
        CalcField("parts_spent", "Parts & Glass Replaced ($)", "number", unit="$", required=True, default=45.0, min=0.0, max=1000.0),
        CalcField("technician_labor_hours", "Refurbishing Labor (Hours)", "number", unit="hrs", required=True, default=1.2, min=0.1, max=10.0),
        CalcField("hourly_rate", "Labor Hourly Rate ($)", "number", unit="$/hr", required=True, default=30.0, min=10.0, max=150.0),
        CalcField("warranty_months", "Included Warranty (Months)", "number", unit="mo", required=False, default=6, min=1, max=24),
        CalcField("target_profit_margin_pct", "Target Net Profit Margin (%)", "number", unit="%", required=False, default=25.0, min=5.0, max=60.0),
    ],
    calc_refurbished_phone_price
)

# 48. Daily Revenue Calculator
def calc_daily_revenue(d: Dict[str, Any]) -> Dict[str, Any]:
    sc_cnt = max(0, int(d.get("screen_repairs_count", 4)))
    sc_pr = max(0.0, float(d.get("screen_avg_price", 85.0)))
    bat_cnt = max(0, int(d.get("battery_repairs_count", 3)))
    bat_pr = max(0.0, float(d.get("battery_avg_price", 45.0)))
    bd_cnt = max(0, int(d.get("board_repairs_count", 1)))
    bd_pr = max(0.0, float(d.get("board_avg_price", 110.0)))
    acc = max(0.0, float(d.get("accessory_sales", 60.0)))
    total = round((sc_cnt * sc_pr) + (bat_cnt * bat_pr) + (bd_cnt * bd_pr) + acc, 2)
    jobs = sc_cnt + bat_cnt + bd_cnt
    avg_ticket = round(total / max(1, jobs), 2)
    proj_mo = round(total * 26.0, 2)
    return {
        "total_daily_revenue": total,
        "total_repair_jobs": jobs,
        "average_ticket_value": avg_ticket,
        "projected_monthly_revenue_26d": proj_mo,
        "status": f"${total}/day"
    }

register_calculator(
    "daily-revenue-calculator",
    "Daily Revenue Calculator",
    "repair_business",
    "Track daily mobile repair shop tickets, accessory sales, and projected monthly sales volume.",
    [
        CalcField("screen_repairs_count", "Screen Repairs Completed", "number", unit="qty", required=True, default=4, min=0, max=100),
        CalcField("screen_avg_price", "Screen Average Ticket ($)", "number", unit="$", required=True, default=85.0, min=10.0, max=1000.0),
        CalcField("battery_repairs_count", "Battery Replacements Completed", "number", unit="qty", required=True, default=3, min=0, max=100),
        CalcField("battery_avg_price", "Battery Average Ticket ($)", "number", unit="$", required=True, default=45.0, min=10.0, max=300.0),
        CalcField("board_repairs_count", "Board / IC Repairs Completed", "number", unit="qty", required=True, default=1, min=0, max=50),
        CalcField("board_avg_price", "Board Repair Average Ticket ($)", "number", unit="$", required=True, default=110.0, min=20.0, max=1000.0),
        CalcField("accessory_sales", "Accessories / Cable Sales ($)", "number", unit="$", required=False, default=60.0, min=0.0, max=2000.0),
    ],
    calc_daily_revenue
)

# 49. Monthly Shop Profit Calculator
def calc_monthly_shop_profit(d: Dict[str, Any]) -> Dict[str, Any]:
    rev = max(0.0, float(d.get("monthly_gross_revenue", 12500.0)))
    parts = max(0.0, float(d.get("parts_inventory_cost", 4200.0)))
    wages = max(0.0, float(d.get("staff_wages", 3400.0)))
    rent = max(0.0, float(d.get("shop_rent_utilities", 1600.0)))
    tools = max(0.0, float(d.get("software_tools_subscriptions", 300.0)))
    misc = max(0.0, float(d.get("misc_expenses", 400.0)))
    total_exp = parts + wages + rent + tools + misc
    profit = round(rev - total_exp, 2)
    margin = round((profit / max(1.0, rev)) * 100.0, 1)
    daily_be = round(total_exp / 26.0, 2)
    return {
        "monthly_net_profit": profit,
        "net_profit_margin_pct": margin,
        "total_operating_expenses": round(total_exp, 2),
        "daily_break_even_target": daily_be,
        "status": f"${profit} Net Profit ({margin}%)"
    }

register_calculator(
    "monthly-shop-profit-calculator",
    "Monthly Shop Profit Calculator",
    "repair_business",
    "Calculate monthly net repair shop profit, overhead expense breakdown, and daily break-even sales.",
    [
        CalcField("monthly_gross_revenue", "Monthly Gross Sales Revenue ($)", "number", unit="$", required=True, default=12500.0, min=100.0, max=500000.0),
        CalcField("parts_inventory_cost", "Parts & Hardware Inventory Costs ($)", "number", unit="$", required=True, default=4200.0, min=0.0, max=200000.0),
        CalcField("staff_wages", "Technician & Front Desk Wages ($)", "number", unit="$", required=True, default=3400.0, min=0.0, max=100000.0),
        CalcField("shop_rent_utilities", "Shop Rent, Power & Internet ($)", "number", unit="$", required=True, default=1600.0, min=0.0, max=50000.0),
        CalcField("software_tools_subscriptions", "Schematic Tools & Server Subscriptions ($)", "number", unit="$", required=False, default=300.0, min=0.0, max=10000.0),
        CalcField("misc_expenses", "Merchant Fees, Packaging & Misc ($)", "number", unit="$", required=False, default=400.0, min=0.0, max=20000.0),
    ],
    calc_monthly_shop_profit
)

# 50. Customer Estimate / Invoice Generator
def calc_invoice_generator(d: Dict[str, Any]) -> Dict[str, Any]:
    cust = str(d.get("customer_name", "John Smith")).strip()
    model = str(d.get("phone_model", "Samsung Galaxy S22")).strip()
    desc = str(d.get("service_description", "Screen Replacement & Port Cleaning")).strip()
    parts = max(0.0, float(d.get("parts_amount", 85.0)))
    labor = max(0.0, float(d.get("labor_amount", 40.0)))
    disc = max(0.0, float(d.get("discount_amount", 10.0)))
    tax_pct = max(0.0, float(d.get("tax_rate_pct", 8.0)))
    sub = max(0.0, parts + labor - disc)
    tax = round(sub * (tax_pct / 100.0), 2)
    total = round(sub + tax, 2)
    return {
        "final_invoice_amount": total,
        "subtotal_before_tax": round(sub, 2),
        "sales_tax_amount": tax,
        "discount_applied": disc,
        "customer_name": cust,
        "device_model": model,
        "service_summary": desc,
        "invoice_status": "Ready for Billing / Printable",
        "status": f"${total} Total Invoice"
    }

register_calculator(
    "customer-estimate-invoice-generator",
    "Customer Estimate & Invoice Generator",
    "repair_business",
    "Generate itemized repair invoices with parts, labor charges, discounts, and sales tax breakdown.",
    [
        CalcField("customer_name", "Customer Name", "text", required=True, default="John Smith"),
        CalcField("phone_model", "Phone Model & IMEI", "text", required=True, default="Samsung Galaxy S22"),
        CalcField("service_description", "Service Description", "text", required=True, default="Screen Replacement & Port Cleaning"),
        CalcField("parts_amount", "Parts Subtotal ($)", "number", unit="$", required=True, default=85.0, min=0.0, max=5000.0),
        CalcField("labor_amount", "Labor Subtotal ($)", "number", unit="$", required=True, default=40.0, min=0.0, max=2000.0),
        CalcField("discount_amount", "Discount / Promotion ($)", "number", unit="$", required=False, default=10.0, min=0.0, max=500.0),
        CalcField("tax_rate_pct", "Sales Tax Rate (%)", "number", unit="%", required=False, default=8.0, min=0.0, max=50.0),
    ],
    calc_invoice_generator
)
