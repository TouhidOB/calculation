from django.shortcuts import render

# Create your views here.

from django.urls import reverse
from . import urls

# Create your views here.



def real_estate_dashboard(request):
    links = []

    for pattern in urls.urlpatterns:
        # skip dashboard itself
        if pattern.name and pattern.name != "dashboard":
            links.append({
                "title": pattern.name.replace("_", " ").title(),
                "url": reverse(pattern.name),
            })

    return render(
        request,
        "real_estate_calculator/app_dashboard.html",
        {
            "app_title": "Real Estate Calculator Tools",
            "links": links,
        }
    )




def days_on_market_calculator(request):
    return render(request, 'real_estate_calculator/days_on_market_calculator.html')

def mortgage_payment_calculator(request):
    return render(request, 'real_estate_calculator/mortgage_payment_calculator.html')

def piti_mortgage_calculator(request):
    return render(request, 'real_estate_calculator/piti_mortgage_calculator.html')

def mortgage_affordability_calculator(request):
    return render(request, 'real_estate_calculator/mortgage_affordability_calculator.html')

def rent_vs_buy_calculator(request):
    return render(request, 'real_estate_calculator/rent_vs_buy_calculator.html')

def mortgage_amortization_schedule_generator(request):
    return render(request, 'real_estate_calculator/mortgage_amortization_schedule_generator.html')

def extra_mortgage_payment_calculator(request):
    return render(request, 'real_estate_calculator/extra_mortgage_payment_calculator.html')

def bi_weekly_portgage_payment_calculator(request):
    return render(request, 'real_estate_calculator/bi_weekly_portgage_payment_calculator.html')

def refinance_breakeven_calculator(request):
    return render(request, 'real_estate_calculator/refinance_breakeven_calculator.html')

def dti_ratio_calculator(request):
    return render(request, 'real_estate_calculator/dti_ratio_calculator.html')

def ltv_ratio_calculator(request):
    return render(request, 'real_estate_calculator/ltv_ratio_calculator.html')

def down_payment_calculator(request):
    return render(request, 'real_estate_calculator/down_payment_calculator.html')

def pmi_calculator(request):
    return render(request, 'real_estate_calculator/pmi_calculator.html')

def fha_loan_calculator(request):
    return render(request, 'real_estate_calculator/fha_loan_calculator.html')

def va_loan_calculator(request):
    return render(request, 'real_estate_calculator/va_loan_calculator.html')

def usda_loan_calculator(request):
    return render(request, 'real_estate_calculator/usda_loan_calculator.html')

def arm_calculator(request):
    return render(request, 'real_estate_calculator/arm_calculator.html')

def closing_cost_calculator(request):
    return render(request, 'real_estate_calculator/closing_cost_calculator.html')


def seller_net_proceeds_calculator(request):
    return render(request, 'real_estate_calculator/seller_net_proceeds_calculator.html')

def capital_gains_tax_on_real_estate_calculator(request):
    return render(request, 'real_estate_calculator/capital_gains_tax_on_real_estate_calculator.html')

def rental_property_cash_flow_calculator(request):
    return render(request, 'real_estate_calculator/rental_property_cash_flow_calculator.html')

def gross_rent_multiplier_calculator(request):
    return render(request, 'real_estate_calculator/gross_rent_multiplier_calculator.html')

def capitalization_rate_calculator(request):
    return render(request, 'real_estate_calculator/capitalization_rate_calculator.html')

def cash_on_cash_return_calculator(request):
    return render(request, 'real_estate_calculator/cash_on_cash_return_calculator.html')

def total_return_on_investment_calculator(request):
    return render(request, 'real_estate_calculator/total_return_on_investment_calculator.html')

def debt_service_coverage_ratio_calculator(request):
    return render(request, 'real_estate_calculator/debt_service_coverage_ratio_calculator.html')

def rule_quickrental_analysis_calculator(request):
    return render(request, 'real_estate_calculator/rule_quickrental_analysis_calculator.html')

def rule_house_flipping_calculator(request):
    return render(request, 'real_estate_calculator/rule_house_flipping_calculator.html')

def property_tax_calculator(request):
    return render(request, 'real_estate_calculator/property_tax_calculator.html')

def homeowners_insurance_premium_estimator(request):
    return render(request, 'real_estate_calculator/homeowners_insurance_premium_estimator.html')

def home_appreciation_value_projection_calculator(request):
    return render(request, 'real_estate_calculator/home_appreciation_value_projection_calculator.html')

def price_per_square_foot_calculator(request):
    return render(request, 'real_estate_calculator/price_per_square_foot_calculator.html')

def real_estate_agent_commission_calculator(request):
    return render(request, 'real_estate_calculator/real_estate_agent_commission_calculator.html')

def land_lease_payment_calculator(request):
    return render(request, 'real_estate_calculator/land_lease_payment_calculator.html')

def piti_as_percentage_of_income_calculator(request):
    return render(request, 'real_estate_calculator/piti_as_percentage_of_income_calculator.html')

def balloon_mortgage_calculator(request):
    return render(request, 'real_estate_calculator/balloon_mortgage_calculator.html')

def construction_loan_interest_calculator(request):
    return render(request, 'real_estate_calculator/construction_loan_interest_calculator.html')

def home_equity_loan_calculator(request):
    return render(request, 'real_estate_calculator/home_equity_loan_calculator.html')

def heloc_calculator(request):
    return render(request, 'real_estate_calculator/heloc_calculator.html')

def reverse_mortgage_calculator(request):
    return render(request, 'real_estate_calculator/reverse_mortgage_calculator.html')

def buy_to_let_mortgage_calculator(request):
    return render(request, 'real_estate_calculator/buy_to_let_mortgage_calculator.html')

def hoa_fee_affordability_calculator(request):
    return render(request, 'real_estate_calculator/hoa_fee_affordability_calculator.html')

def moving_cost_estimator(request):
    return render(request, 'real_estate_calculator/moving_cost_estimator.html')

def home_repair_budget_calculator(request):
    return render(request, 'real_estate_calculator/home_repair_budget_calculator.html')

def depreciation_calculator(request):
    return render(request, 'real_estate_calculator/depreciation_calculator.html')

def exchange_calculator(request):
    return render(request, 'real_estate_calculator/exchange_calculator.html')

def annual_property_operating_data_calculator(request):
    return render(request, 'real_estate_calculator/annual_property_operating_data_calculator.html')

def net_operating_income_calculator(request):
    return render(request, 'real_estate_calculator/net_operating_income_calculator.html')

def internal_rate_of_return_calculator(request):
    return render(request, 'real_estate_calculator/internal_rate_of_return_calculator.html')

def tenant_rent_to_income_ratio_calculator(request):
    return render(request, 'real_estate_calculator/tenant_rent_to_income_ratio_calculator.html')
