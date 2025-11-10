from django.shortcuts import render

# Create your views here.


def basal_metabolic_rate_calculator(request):
    return render(request, "health/basal_metabolic_rate_calculator.html")

def total_daily_energy_expenditure(request):
    return render(request, "health/total_daily_energy_expenditure.html")

def calorie_deficit_calculator(request):
    return render(request, "health/calorie_deficit_calculator.html")

def calorie_surplus_calculator(request):
    return render(request, "health/calorie_surplus_calculator.html")

def macronutrient_calculator(request):
    return render(request, "health/macronutrient_calculator.html")

def body_fat_calculator_navy(request):
    return render(request, "health/body_fat_calculator_navy.html")


def one_rep_max_calculator(request):
    return render(request, "health/one_rep_max_calculator.html")





def fertility_ovulation_calculator(request):
    return render(request, "health/fertility_ovulation_calculator.html")

def child_height_predictor(request):
    return render(request, "health/child_height_predictor.html")

def strength_standard_calculator(request):
    return render(request, "health/strength_standard_calculator.html")

def fitness_age_calculator(request):
    return render(request, "health/fitness_age_calculator.html")

def race_time_predictor(request):
    return render(request, "health/race_time_predictor.html")

def race_pace_planner(request):
    return render(request, "health/race_pace_planner.html")

def hill_grade_calculator(request):
    return render(request, "health/hill_grade_calculator.html")

def treadmill_pace_converter(request):
    return render(request, "health/treadmill_pace_converter.html")

def swimming_interval_calculator(request):
    return render(request, "health/swimming_interval_calculator.html")

def crossfit_pacing_calculator(request):
    return render(request, "health/crossfit_pacing_calculator.html")

def bmi(request):
    return render(request, "health/bmi.html")
