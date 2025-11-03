from django.shortcuts import render

# Create your views here.


def bmi_calculator(request):
    result = None
    if request.method == 'POST':
        try:
            weight = float(request.POST.get('weight', 0))
            height_cm = float(request.POST.get('height', 0))
            height_m = height_cm / 100.0
            if height_m > 0:
                result = round(weight / (height_m ** 2), 2)
        except Exception:
            result = 'Invalid input'
    return render(request, 'basic_calculator/bmi.html', {'result': result})
