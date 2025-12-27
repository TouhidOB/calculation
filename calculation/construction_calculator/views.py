from django.shortcuts import render

# Create your views here.


from django.shortcuts import render
from django.urls import reverse
from . import urls  # IMPORT YOUR OWN URLS

def construction_home(request):
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
        "construction_calculator/app_dashboard.html",
        {
            "app_title": "Construction Calculator Tools",
            "links": links,
        }
    )




def area_calculator(request):
    return render(request, 'construction_calculator/area_calculator.html')


def volume_calculator(request):
    return render(request, 'construction_calculator/volume_calculator.html')


def concrete_slab_calculator(request):
    return render(request, 'construction_calculator/concrete_slab_calculator.html')


def mulch_and_soil_calculator(request):
    return render(request, 'construction_calculator/mulch_and_soil_calculator.html')


def paint_volume_calculator(request):
    return render(request, 'construction_calculator/paint_volume_calculator.html')


def drywall_sheet_calculator(request):
    return render(request, 'construction_calculator/drywall_sheet_calculator.html')


def flooring_tile_calculator(request):
    return render(request, 'construction_calculator/flooring_tile_calculator.html')


def exterior_siding_calculator(request):
    return render(request, 'construction_calculator/exterior_siding_calculator.html')


def roofing_shingle_calculator(request):
    return render(request, 'construction_calculator/roofing_shingle_calculator.html')


