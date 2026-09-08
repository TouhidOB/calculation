"""
URL configuration for API endpoints.
"""
from django.urls import path
from . import views
from . import js_views

app_name = 'api'

urlpatterns = [
    path('health/', views.HealthCheckView.as_view(), name='health'),
    path('calculators/', views.CalculatorListView.as_view(), name='calculator_list'),
    path('calculators/<str:calc_id>/', views.CalculatorDetailView.as_view(), name='calculator_detail'),
    path('calculators/<str:calc_id>/run/', views.CalculatorRunView.as_view(), name='calculator_run'),
    path('calculators/<str:calc_id>/script/', js_views.CalcScriptView.as_view(), name='calculator_script'),
    path('scripts/', js_views.CalcScriptListView.as_view(), name='calculator_scripts'),
]