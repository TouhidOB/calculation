from django.urls import path
from . import views

urlpatterns = [
    path('cino_long_1/', views.cino_long_1, name='cino_long_1'),
]