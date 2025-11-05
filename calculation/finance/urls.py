from django.urls import path
from . import views

urlpatterns = [
    path("budget-calculator/", views.budget_calculator, name="budget_calculator"),
    path("net_worth/", views.net_worth, name="net_worth"),
    path("dti/", views.dti, name="dti"),
]
