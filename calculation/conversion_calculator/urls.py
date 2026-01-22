from django.urls import path
from . import views

urlpatterns = [
    path("", views.conversion_dashboard, name="conversion_dashboard"),
    path("length_converter/", views.length_converter, name="length_converter"),

]