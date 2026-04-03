from django.shortcuts import render

def retail_change(request):
    return render(request, 'antigravity_suite/retail_change.html')

def forex_portal(request):
    return render(request, 'antigravity_suite/forex_portal.html')

def crypto_change(request):
    return render(request, 'antigravity_suite/crypto_change.html')
