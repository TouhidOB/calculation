from django.urls import path
from . import views

urlpatterns = [
    path("", views.construction_home, name="construction_dashboard"),
    path('area_calculator/', views.area_calculator, name='area_calculator'),
    path('volume_calculator/', views.volume_calculator, name='volume_calculator'),
    path('concrete_slab_calculator/', views.concrete_slab_calculator, name='concrete_slab_calculator'),
    path('mulch_and_soil_calculator/', views.mulch_and_soil_calculator, name='mulch_and_soil_calculator'),
    path('paint_volume_calculator/', views.paint_volume_calculator, name='paint_volume_calculator'),
    path('drywall_sheet_calculator/', views.drywall_sheet_calculator, name='drywall_sheet_calculator'),
    path('flooring_tile_calculator/', views.flooring_tile_calculator, name='flooring_tile_calculator'),
    path('exterior_siding_calculator/', views.exterior_siding_calculator, name='exterior_siding_calculator'),
    path('roofing_shingle_calculator/', views.roofing_shingle_calculator, name='roofing_shingle_calculator'),
]