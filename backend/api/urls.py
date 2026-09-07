"""
URL configuration for API endpoints.
"""
from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    path('health/', views.HealthCheckView.as_view(), name='health'),
    path('calculators/', views.CalculatorListView.as_view(), name='calculator_list'),
    path('calculators/<str:calc_id>/', views.CalculatorDetailView.as_view(), name='calculator_detail'),
    path('calculators/<str:calc_id>/run/', views.CalculatorRunView.as_view(), name='calculator_run'),
]