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
