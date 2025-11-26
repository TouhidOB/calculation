from django.shortcuts import render

# Create your views here.


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
