from django.urls import path
from . import views

urlpatterns = [
    path('roi_calculator/', views.roi_calculator, name='roi_calculator'),
    path('compound_interest_calculator/', views.compound_interest_calculator, name='compound_interest_calculator'),
    path('net_present_value_calculator/', views.net_present_value_calculator, name='net_present_value_calculator'),
    path('internal_rate_of_return_calculator/', views.internal_rate_of_return_calculator, name='internal_rate_of_return_calculator'),
    path('payback_period_calculator/', views.payback_period_calculator, name='payback_period_calculator'),
    path('break_even_analysis_calculator/', views.break_even_analysis_calculator, name='break_even_analysis_calculator'),

]