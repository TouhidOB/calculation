"""
Serve the extracted client-side JS logic and HTML runtime for JS-driven calculators.

Endpoints:
  GET /api/calculators/<id>/script/  → {"id": "...", "js_key": "...", "script": "...", "html": "...", "css": "..."}
"""
import json
import os

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .calculators.engine import registry
from . import calculators  # noqa: F401

_BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_RUNTIME_PATH = os.path.join(_BASE_DIR, "extracted_calc_runtime.json")
_JS_PATH = os.path.join(_BASE_DIR, "extracted_js_logic.json")

_CACHE: dict = {}
_BY_CALC_ID: dict = {}

_ALIASES = {
    '401k-calculator': 'business_investment__401k_retirement_calculator',
    'amortization-calculator': 'education__student_loan_amortization_calculator',
    'annuity-calculator': 'business_investment__annuity_payout_calculator',
    'anorexic-bmi-calculator': 'health__bmi',
    'army-body-fat-calculator': 'health__body_fat_calculator_navy',
    'auto-lease-calculator': 'date_time__lease_end_date_calculator',
    'auto-loan-calculator': 'finance__personal_loan_comparison_calculator',
    'boat-loan-calculator': 'finance__personal_loan_comparison_calculator',
    'body-fat': 'health__body_fat_calculator_navy',
    'body-type-calculator': 'health__body_fat_calculator_navy',
    'bond-calculator': 'business_investment__bond_yield_to_maturity_calculator',
    'break-even': 'business_investment__break_even_analysis_calculator',
    'brick': 'construction_calculator__brick_block_calculator',
    'calorie-calculator': 'health__calorie_burn_calculator',
    'canadian-mortgage-calculator': 'finance__mortgage_affordability_calculator',
    'commission-calculator': 'real_estate_calculator__real_estate_agent_commission_calculator',
    'common-factor-calculator': 'basic_calculator__factor_calculator',
    'concrete': 'construction_calculator__concrete_delivery_time_calculator',
    'concrete-calculator': 'construction_calculator__concrete_delivery_time_calculator',
    'convert-area': 'basic_calculator__area_volume_calculator',
    'convert-length': 'construction_calculator__rafter_length_calculator',
    'convert-temperature': 'conversion_calculator__temperature_converter',
    'convert-volume': 'basic_calculator__area_volume_calculator',
    'convert-weight': 'conversion_calculator__weight_mass_converter',
    'credit-card-calculator': 'date_time__credit_card_payment_due_date_calculator',
    'credit-card-payoff-calculator': 'finance__credit_utilization_calculator',
    'debt-consolidation-calculator': 'finance__debt_consolidation_savings_calculator',
    'debt-payoff-calculator': 'finance__debt_consolidation_savings_calculator',
    'debt-ratio-calculator': 'business_investment__debt_to_equity_ratio_calculator',
    'density-calculator': 'conversion_calculator__density_converter',
    'fat-intake-calculator': 'health__body_fat_calculator_navy',
    'financial-calculator': 'finance__financial_health_check_calculator',
    'fitness-and-health-calculator': 'health__fitness_age_calculator',
    'flooring': 'construction_calculator__flooring_tile_calculator',
    'fraction-calculator': 'basic_calculator__decimal_to_fraction_converter',
    'fuel-cost-calculator': 'business_investment__customer_acquisition_cost_calculator',
    'gravel-calculator': 'construction_calculator__french_drain_gravel_calculator',
    'half-life-calculator': 'health__caffeine_half_life_calculator',
    'healthy-weight-calculator': 'health__ideal_weight_calculator',
    'heart-rate': 'health__heart_rate_recovery_calculator',
    'hours-calculator': 'date_time__overtime_hours_pay_calculator',
    'house-affordability-calculator': 'finance__car_affordability_calculator',
    'interest-calculator': 'business_investment__compound_interest_calculator',
    'interest-rate-calculator': 'finance__personal_inflation_rate_calculator',
    'investment-calculator': 'real_estate_calculator__total_return_on_investment_calculator',
    'ira-calculator': 'business_investment__roth_ira_cetirement_calculator',
    'lease-calculator': 'date_time__lease_end_date_calculator',
    'loan-calculator': 'finance__personal_loan_comparison_calculator',
    'loan-payment': 'finance__personal_loan_comparison_calculator',
    'log-calculator': 'basic_calculator__log_antilog_calculator',
    'margin-calculator': 'business_investment__gross_profit_margin_calculator',
    'mass-calculator': 'conversion_calculator__weight_mass_converter',
    'molecular-weight-calculator': 'health__ideal_weight_calculator',
    'mortgage': 'finance__mortgage_affordability_calculator',
    'mortgage-amortization-calculator': 'real_estate_calculator__mortgage_amortization_schedule_generator',
    'mortgage-calculator': 'finance__mortgage_affordability_calculator',
    'mortgage-calculator-uk': 'finance__mortgage_affordability_calculator',
    'mortgage-payoff-calculator': 'finance__mortgage_affordability_calculator',
    'mulch-calculator': 'construction_calculator__mulch_and_soil_calculator',
    'mutual-fund-calculator': 'finance__emergency_fund',
    'ovulation-calculator': 'health__fertility_ovulation_calculator',
    'pace-calculator': 'health__race_pace_planner',
    'paint': 'construction_calculator__paint_thinner_dilution_calculator',
    'payment-calculator': 'date_time__credit_card_payment_due_date_calculator',
    'pension-calculator': 'business_investment__retirement_pension_forecaster',
    'period-calculator': 'business_investment__payback_period_calculator',
    'personal-loan-calculator': 'finance__personal_loan_comparison_calculator',
    'pregnancy-calculator': 'health__pregnancy_weight_gain_calculator',
    'pregnancy-conception-calculator': 'health__pregnancy_weight_gain_calculator',
    'present-value-calculator': 'business_investment__net_present_value_calculator',
    'prime-factorization-calculator': 'basic_calculator__prime_checker',
    'protein-calculator': 'health__protein_intake_calculator',
    'quadratic-formula-calculator': 'basic_calculator__quadratic_solver',
    'real-estate-calculator': 'real_estate_calculator__capital_gains_tax_on_real_estate_calculator',
    'rebar': 'construction_calculator__rebar_material_calculator',
    'refinance-calculator': 'education__student_loan_refinance_savings_calculator',
    'rent-calculator': 'finance__rent_affordability_calculator',
    'rental-property-calculator': 'real_estate_calculator__rental_property_cash_flow_calculator',
    'retirement': 'business_investment__401k_retirement_calculator',
    'retirement-calculator': 'business_investment__401k_retirement_calculator',
    'roofing': 'construction_calculator__roofing_shingle_calculator',
    'roofing-calculator': 'construction_calculator__roofing_shingle_calculator',
    'roth-ira-calculator': 'business_investment__roth_ira_cetirement_calculator',
    'salary-calculator': 'finance__hourly_to_salary_converter',
    'simple-interest-calculator': 'business_investment__compound_interest_calculator',
    'sleep-calculator': 'health__sleep_cycle_calculator',
    'slope-calculator': 'construction_calculator__slope_and_grade_percentage_calculator',
    'social-security-calculator': 'business_investment__social_security_benefits_calculator',
    'speed-calculator': 'conversion_calculator__hurricane_speed_calculator',
    'square-footage-calculator': 'real_estate_calculator__price_per_square_foot_calculator',
    'student-loan-calculator': 'finance__student_loan_affordability_calculator',
    'surface-area-calculator': 'health__body_surface_area_calculator',
    'tile-calculator': 'construction_calculator__flooring_tile_calculator',
    'time-calculator': 'date_time__airport_time_zone_finder',
    'time-card-calculator': 'date_time__airport_time_zone_finder',
    'time-zone-calculator': 'conversion_calculator__time_zone_converter',
    'va-mortgage-calculator': 'finance__mortgage_affordability_calculator',
    'voltage-drop-calculator': 'construction_calculator__electrical_voltage_drop_calculator',
    'weight-calculator': 'health__ideal_weight_calculator',
    'weight-watchers-points-calculator': 'health__ideal_weight_calculator',
}


def _load_data() -> dict:
    """Load extracted runtime or fallback JS lazily."""
    global _CACHE, _BY_CALC_ID
    if not _CACHE:
        target_path = _RUNTIME_PATH if os.path.exists(_RUNTIME_PATH) else _JS_PATH
        if os.path.exists(target_path):
            with open(target_path) as f:
                _CACHE = json.load(f)
    if not _BY_CALC_ID and _CACHE:
        _BY_CALC_ID = {}
        for k in _CACHE:
            if "__" in k:
                cat, tpl = k.split("__", 1)
                calc_id = tpl.replace("_", "-")
                _BY_CALC_ID[calc_id] = k
                if calc_id.endswith("-calculator"):
                    short_id = calc_id[:-11]
                    _BY_CALC_ID[short_id] = k
        # Apply aliases for shorthand and category-specific slugs
        for alias_id, target_key in _ALIASES.items():
            if target_key in _CACHE and alias_id not in _BY_CALC_ID:
                _BY_CALC_ID[alias_id] = target_key
    return _BY_CALC_ID


class CalcScriptView(APIView):
    """GET /api/calculators/<id>/script/ — inline JS and DOM runtime for one calculator."""

    def get(self, request, calc_id):
        mapping = _load_data()
        js_key = mapping.get(calc_id)
        if not js_key:
            return Response({"error": "No client-side script for this calculator"}, status=404)
        item = _CACHE.get(js_key, {})
        if isinstance(item, dict):
            script = item.get("script", "")
            html = item.get("html", "")
            css = item.get("css", "")
        else:
            script = str(item)
            html = ""
            css = ""
        return Response({
            "id": calc_id,
            "js_key": js_key,
            "script": script,
            "html": html,
            "css": css,
        })


class CalcScriptListView(APIView):
    """GET /api/scripts/ — all JS scripts keyed by calc id (for offline bundling)."""

    def get(self, request):
        mapping = _load_data()
        out = {}
        for calc_id, js_key in mapping.items():
            item = _CACHE.get(js_key, "")
            out[calc_id] = item.get("script", "") if isinstance(item, dict) else str(item)
        return Response({"scripts": out, "total": len(out)})
