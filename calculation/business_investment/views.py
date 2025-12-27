from django.shortcuts import render

# Create your views here.

from django.urls import reverse
from . import urls


def business_investment_home(request):
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
        "business_investment/business_investment_home.html",
        {
            "app_title": "Business Investment Calculator Tools",
            "links": links,
        }
    )



def roi_calculator(request):
    return render(request, 'business_investment/roi_calculator.html')

def compound_interest_calculator(request):
    return render(request, 'business_investment/compound_interest_calculator.html')

def net_present_value_calculator(request):
    return render(request, 'business_investment/net_present_value_calculator.html')

def internal_rate_of_return_calculator(request):
    return render(request, 'business_investment/internal_rate_of_return_calculator.html')

def payback_period_calculator(request):
    return render(request, 'business_investment/payback_period_calculator.html')

def break_even_analysis_calculator(request):
    return render(request, 'business_investment/break_even_analysis_calculator.html')

def business_loan_calculator(request):
    return render(request, 'business_investment/business_loan_calculator.html')

def sba_loan_calculator(request):
    return render(request, 'business_investment/sba_loan_calculator.html')

def gross_profit_margin_calculator(request):
    return render(request, 'business_investment/gross_profit_margin_calculator.html')

def net_profit_margin_calculator(request):
    return render(request, 'business_investment/net_profit_margin_calculator.html')

def discount_calculator(request):
    return render(request, 'business_investment/discount_calculator.html')

def customer_lifetime_value_calculator(request):
    return render(request, 'business_investment/customer_lifetime_value_calculator.html')

def customer_acquisition_cost_calculator(request):
    return render(request, 'business_investment/customer_acquisition_cost_calculator.html')

def churn_rate_calculator(request):
    return render(request, 'business_investment/churn_rate_calculator.html')

def conversion_rate_calculator(request):
    return render(request, 'business_investment/conversion_rate_calculator.html')

def return_on_ad_spend_calculator(request):
    return render(request, 'business_investment/return_on_ad_spend_calculator.html')

def through_rate_calculator(request):
    return render(request, 'business_investment/through_rate_calculator.html')

def ebitda_calculator(request):
    return render(request, 'business_investment/ebitda_calculator.html')

def working_capital_calculator(request):
    return render(request, 'business_investment/working_capital_calculator.html')

def current_ratio_calculator(request):
    return render(request, 'business_investment/current_ratio_calculator.html')

def quick_ratio_calculator(request):
    return render(request, 'business_investment/quick_ratio_calculator.html')

def debt_to_equity_ratio_calculator(request):
    return render(request, 'business_investment/debt_to_equity_ratio_calculator.html')

def inventory_turnover_calculator(request):
    return render(request, 'business_investment/inventory_turnover_calculator.html')

def days_sales_outstanding_calculator(request):
    return render(request, 'business_investment/days_sales_outstanding_calculator.html')

def burn_rate_and_runway_calculator(request):
    return render(request, 'business_investment/burn_rate_and_runway_calculator.html')

def cash_runway_and_net_burn_calculator(request):
    return render(request, 'business_investment/cash_runway_and_net_burn_calculator.html')

def financing_round_dilution_calculator(request):
    return render(request, 'business_investment/financing_round_dilution_calculator.html')

def business_valuation_calculator(request):
    return render(request, 'business_investment/business_valuation_calculator.html')

def stock_total_return_calculator(request):
    return render(request, 'business_investment/stock_total_return_calculator.html')

def dividend_yield_calculator(request):
    return render(request, 'business_investment/dividend_yield_calculator.html')

def price_to_earnings_ratio_calculator(request):
    return render(request, 'business_investment/price_to_earnings_ratio_calculator.html')

def earnings_per_share_calculator(request):
    return render(request, 'business_investment/earnings_per_share_calculator.html')

def beta_coefficient_calculator(request):
    return render(request, 'business_investment/beta_coefficient_calculator.html')

def sharpe_ratio_calculator(request):
    return render(request, 'business_investment/sharpe_ratio_calculator.html')

def compound_annual_growth_rate_calculator(request):
    return render(request, 'business_investment/compound_annual_growth_rate_calculator.html')

def dollar_cost_averaging_calculator(request):
    return render(request, 'business_investment/dollar_cost_averaging_calculator.html')

def asset_allocation_calculator(request):
    return render(request, 'business_investment/asset_allocation_calculator.html')

def portfolio_rebalancing_calculator(request):
    return render(request, 'business_investment/portfolio_rebalancing_calculator.html')

def bond_yield_to_maturity_calculator(request):
    return render(request, 'business_investment/bond_yield_to_maturity_calculator.html')

def certificate_of_deposit_calculator(request):
    return render(request, 'business_investment/certificate_of_deposit_calculator.html')

def annuity_payout_calculator(request):
    return render(request, 'business_investment/annuity_payout_calculator.html')

def retirement_calculator(request):
    return render(request, 'business_investment/401k_retirement_calculator.html')

def roth_ira_cetirement_calculator(request):
    return render(request, 'business_investment/roth_ira_cetirement_calculator.html')

def social_security_benefits_calculator(request):
    return render(request, 'business_investment/social_security_benefits_calculator.html')

def retirement_pension_forecaster(request):
    return render(request, 'business_investment/retirement_pension_forecaster.html')

def hsa_contribution_calculator(request):
    return render(request, 'business_investment/hsa_contribution_calculator.html')

def profit_and_loss_calculator(request):
    return render(request, 'business_investment/profit_and_loss_calculator.html')

def forex_pip_calculator(request):
    return render(request, 'business_investment/forex_pip_calculator.html')

def crypto_profit_calculator(request):
    return render(request, 'business_investment/crypto_profit_calculator.html')

