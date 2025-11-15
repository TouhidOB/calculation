from django.urls import path
from . import views

urlpatterns = [
    path('arithmetic/', views.arithmetic, name='arithmetic'),
    path('scientific_calculator/', views.scientific_calculator, name='scientific_calculator'),
    path('graphing_calculator/', views.graphing_calculator, name='graphing_calculator'),
    path('quadratic_solver/', views.quadratic_solver, name='quadratic_solver'),
    path('system_solver/', views.system_solver, name='system_solver'),
    path('matrix_calculator/', views.matrix_calculator, name='matrix_calculator'),
    path('derivative_calculator/', views.derivative_calculator, name='derivative_calculator'),
    path('integral_calculator/', views.integral_calculator, name='integral_calculator'),
    path('limit_calculator/', views.limit_calculator, name='limit_calculator'),
    path('prime_checker/', views.prime_checker, name='prime_checker'),
    path('factor_calculator/', views.factor_calculator, name='factor_calculator'),
    path('gcf_calculator/', views.gcf_calculator, name='gcf_calculator'),
    path('lcm_calculator/', views.lcm_calculator, name='lcm_calculator'),
    path('fraction_simplifier/', views.fraction_simplifier, name='fraction_simplifier'),
]
