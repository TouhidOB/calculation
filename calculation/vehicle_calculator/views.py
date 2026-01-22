from django.shortcuts import render

# Create your views here.
from django.urls import reverse
from . import urls

# Create your views here.



def vehicle_dashboard(request):
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
        "vehicle_calculator/app_dashboard.html",
        {
            "app_title": "Vehicle Calculator Tools",
            "links": links,
        }
    )




def car_affordability_calculator(request):
    return render(request, 'vehicle_calculator/car_affordability_calculator.html')
