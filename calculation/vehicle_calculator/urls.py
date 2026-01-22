from django.urls import path
from . import views

urlpatterns = [
    path("", views.vehicle_dashboard, name="vehicle_dashboard"),
    path("car_affordability_calculator/", views.car_affordability_calculator, name="car_affordability_calculator"),

]