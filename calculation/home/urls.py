from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_page, name='home_page'),
    path('contact/', views.contact_page, name='contact'),
    path('about/', views.about_page, name='about'),
    path('terms/', views.terms_page, name='terms'),
    path('disclaimer/', views.disclaimer_page, name='disclaimer'),
    path('robots.txt', views.robots_txt, name='robots_txt'),
]