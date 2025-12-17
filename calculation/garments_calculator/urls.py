from django.urls import path
from . import views

urlpatterns = [
    path('cino_long_1/', views.cino_long_1, name='cino_long_1'),
    path('cino_long_2/', views.cino_long_2, name='cino_long_2'),
    path('cino_long_3/', views.cino_long_3, name='cino_long_3'),
    path('cino_long_4/', views.cino_long_4, name='cino_long_4'),
    path('cino_long_5/', views.cino_long_5, name='cino_long_5'),
    path('cino_long_6/', views.cino_long_6, name='cino_long_6'),
    path('cino_long_7/', views.cino_long_7, name='cino_long_7'),
    path('cino_long_8/', views.cino_long_8, name='cino_long_8'),
    path('cino_long_9/', views.cino_long_9, name='cino_long_9'),
    path('cino_long_10/', views.cino_long_10, name='cino_long_10'),
]