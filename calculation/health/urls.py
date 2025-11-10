from django.urls import path
from . import views

urlpatterns = [
    path("basal_metabolic_rate_calculator/", views.basal_metabolic_rate_calculator, name="basal_metabolic_rate_calculator"),
    path("total_daily_energy_expenditure/", views.total_daily_energy_expenditure, name="total_daily_energy_expenditure"),
    path("calorie_deficit_calculator/", views.calorie_deficit_calculator, name="calorie_deficit_calculator"),
    path("calorie_surplus_calculator/", views.calorie_surplus_calculator, name="calorie_surplus_calculator"),
    path("macronutrient_calculator/", views.macronutrient_calculator, name="macronutrient_calculator"),
    path("body_fat_calculator_navy/", views.body_fat_calculator_navy, name="body_fat_calculator_navy"),
    path("one_rep_max_calculator/", views.one_rep_max_calculator, name="one_rep_max_calculator"),
    
    path("fertility_ovulation_calculator/", views.fertility_ovulation_calculator, name="fertility_ovulation_calculator"),
    path("child_height_predictor/", views.child_height_predictor, name="child_height_predictor"),
    path("strength_standard_calculator/", views.strength_standard_calculator, name="strength_standard_calculator"),
    path("fitness_age_calculator/", views.fitness_age_calculator, name="fitness_age_calculator"),
    path("race_time_predictor/", views.race_time_predictor, name="race_time_predictor"),
    path("race_pace_planner/", views.race_pace_planner, name="race_pace_planner"),
    path("hill_grade_calculator/", views.hill_grade_calculator, name="hill_grade_calculator"),
    path("treadmill_pace_converter/", views.treadmill_pace_converter, name="treadmill_pace_converter"),
    path("swimming_interval_calculator/", views.swimming_interval_calculator, name="swimming_interval_calculator"),
    path("crossfit_pacing_calculator/", views.crossfit_pacing_calculator, name="crossfit_pacing_calculator"),
    path("bmi/", views.bmi, name="bmi"),
]