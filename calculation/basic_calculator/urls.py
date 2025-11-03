from django.urls import path
from . import views

urlpatterns = [
    path('bmi/', views.bmi_calculator, name='bmi'),
]
