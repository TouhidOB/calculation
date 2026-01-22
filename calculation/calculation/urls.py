"""
URL configuration for calculation project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.sitemaps.views import sitemap
from home.sitemaps import GlobalStaticSitemap



sitemaps = {
    'static': GlobalStaticSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('home.urls')),
    path('math/', include('basic_calculator.urls')),
    path('finance/', include('finance.urls')),
    path('health/', include('health.urls')),
    path('business/', include('business_investment.urls')),
    path('date_time/', include('date_time.urls')),
    path('garments_calculator/', include('garments_calculator.urls')),
    path('construction_calculator/', include('construction_calculator.urls')),
    
    path('education_calculator/', include('education.urls')),
    path('conversion_calculator/', include('conversion_calculator.urls')),
    path('real_estate_calculator/', include('real_estate_calculator.urls')),
    path('vehicle_calculator/', include('vehicle_calculator.urls')),

    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),
]




