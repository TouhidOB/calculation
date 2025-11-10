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
