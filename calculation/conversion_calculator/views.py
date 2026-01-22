from django.shortcuts import render

# Create your views here.
from django.urls import reverse
from . import urls

# Create your views here.



def conversion_dashboard(request):
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
        "conversion_calculator/app_dashboard.html",
        {
            "app_title": "Conversion Calculator Tools",
            "links": links,
        }
    )




def length_converter(request):
    return render(request, 'conversion_calculator/length_converter.html')
