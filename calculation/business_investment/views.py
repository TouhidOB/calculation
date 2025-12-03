from django.shortcuts import render

# Create your views here.


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

