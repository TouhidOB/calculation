from django.shortcuts import render

# Create your views here.

def budget_calculator(request):
    return render(request, "finance/budget_calculator.html")

def net_worth(request):
    return render(request, "finance/net_worth.html")

def dti(request):
    return render(request, "finance/dti.html")
