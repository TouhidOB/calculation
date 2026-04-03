from django.urls import path
from . import views

urlpatterns = [
    path('retail-change/', views.retail_change, name='retail_change'),
    path('forex-portal/', views.forex_portal, name='forex_portal'),
    path('crypto-change/', views.crypto_change, name='crypto_change'),
]
