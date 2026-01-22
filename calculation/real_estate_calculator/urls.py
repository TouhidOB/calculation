from django.urls import path
from . import views

urlpatterns = [
    path("", views.real_estate_dashboard, name="real_estate_dashboard"),
    path("days_on_market_calculator/", views.days_on_market_calculator, name="days_on_market_calculator"),

]