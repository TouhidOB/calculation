from django.shortcuts import render

# Create your views here.

from django.urls import reverse
from . import urls


def basic_calculator_home(request):
    links = []

    for pattern in urls.urlpatterns:
        # skip dashboard itself
        if pattern.name and pattern.name != "dashboard":
            links.append({
                "title": pattern.name.replace("_", " ").title(),
                "url": reverse(pattern.name),
            })

    return render(
        request,
        "basic_calculator/basic_calculator_home.html",
        {
            "app_title": "Basic Calculator Tools",
            "links": links,
        }
    )




def arithmetic(request):
    return render(request, 'basic_calculator/arithmetic.html')

def scientific_calculator(request):
    return render(request, 'basic_calculator/scientific_calculator.html')

def graphing_calculator(request):
    return render(request, 'basic_calculator/graphing_calculator.html')

def quadratic_solver(request):
    return render(request, 'basic_calculator/quadratic_solver.html')

def system_solver(request):
    return render(request, 'basic_calculator/system_solver.html')

def matrix_calculator(request):
    return render(request, 'basic_calculator/matrix_calculator.html')

def derivative_calculator(request):
    return render(request, 'basic_calculator/derivative_calculator.html')

def integral_calculator(request):
    return render(request, 'basic_calculator/integral_calculator.html')

def limit_calculator(request):
    return render(request, 'basic_calculator/limit_calculator.html')

def prime_checker(request):
    return render(request, 'basic_calculator/prime_checker.html')

def factor_calculator(request):
    return render(request, 'basic_calculator/factor_calculator.html')

def gcf_calculator(request):
    return render(request, 'basic_calculator/gcf_calculator.html')

def lcm_calculator(request):
    return render(request, 'basic_calculator/lcm_calculator.html')

def fraction_simplifier(request):
    return render(request, 'basic_calculator/fraction_simplifier.html')

def fraction_to_decimal_converter(request):
    return render(request, 'basic_calculator/fraction_to_decimal_converter.html')

def decimal_to_fraction_converter(request):
    return render(request, 'basic_calculator/decimal_to_fraction_converter.html')

def percentage_calculator(request):
    return render(request, 'basic_calculator/percentage_calculator.html')

def percentage_change_calculator(request):
    return render(request, 'basic_calculator/percentage_change_calculator.html')

def ratio_calculator(request):
    return render(request, 'basic_calculator/ratio_calculator.html')

def proportion_calculator(request):
    return render(request, 'basic_calculator/proportion_calculator.html')

def standard_deviation_calculator(request):
    return render(request, 'basic_calculator/standard_deviation_calculator.html')

def mean_median_mode_range_calculator(request):
    return render(request, 'basic_calculator/mean_median_mode_range_calculator.html')

def probabily_calculator(request):
    return render(request, 'basic_calculator/probabily_calculator.html')

def permutation_calculator(request):
    return render(request, 'basic_calculator/permutation_calculator.html')

def combination_calculator(request):
    return render(request, 'basic_calculator/combination_calculator.html')

def binomial_theorem_calculator(request):
    return render(request, 'basic_calculator/binomial_theorem_calculator.html')

def linear_regression_calculator(request):
    return render(request, 'basic_calculator/linear_regression_calculator.html')

def normal_distribution_calculator(request):
    return render(request, 'basic_calculator/normal_distribution_calculator.html')

def pi_digit_finder(request):
    return render(request, 'basic_calculator/pi_digit_finder.html')

def eulers_number_calculator(request):
    return render(request, 'basic_calculator/eulers_number_calculator.html')

def complex_number_calculator(request):
    return render(request, 'basic_calculator/complex_number_calculator.html')

def vector_product_calculator(request):
    return render(request, 'basic_calculator/vector_product_calculator.html')

def unit_vector_calculator(request):
    return render(request, 'basic_calculator/unit_vector_calculator.html')

def coordinate_converter(request):
    return render(request, 'basic_calculator/coordinate_converter.html')

def base_converter(request):
    return render(request, 'basic_calculator/base_converter.html')

def scientific_notation_converter(request):
    return render(request, 'basic_calculator/scientific_notation_converter.html')

def significant_figures_counter(request):
    return render(request, 'basic_calculator/significant_figures_counter.html')

def log_antilog_calculator(request):
    return render(request, 'basic_calculator/log_antilog_calculator.html')

def factorial_calculator(request):
    return render(request, 'basic_calculator/factorial_calculator.html')

def series_sum_calculator(request):
    return render(request, 'basic_calculator/series_sum_calculator.html')

def pythagorean_calculator(request):
    return render(request, 'basic_calculator/pythagorean_calculator.html')

def area_volume_calculator(request):
    return render(request, 'basic_calculator/area_volume_calculator.html')

def trig_identity_verifier(request):
    return render(request, 'basic_calculator/trig_identity_verifier.html')

def absolute_value_calculator(request):
    return render(request, 'basic_calculator/absolute_value_calculator.html')

def modulo_calculator(request):
    return render(request, 'basic_calculator/modulo_calculator.html')

def radical_simplifier(request):
    return render(request, 'basic_calculator/radical_simplifier.html')

def line_equation_calculator(request):
    return render(request, 'basic_calculator/line_equation_calculator.html')

def truth_table_generator(request):
    return render(request, 'basic_calculator/truth_table_generator.html')

def boolean_algebra_calculator(request):
    return render(request, 'basic_calculator/boolean_algebra_calculator.html')
