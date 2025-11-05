from django.shortcuts import render

# Create your views here.


def bmi_calculator(request):
    return render(request, 'basic_calculator/bmi.html')
