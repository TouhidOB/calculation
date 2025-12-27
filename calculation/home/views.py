from django.shortcuts import render

# Create your views here.


from django.shortcuts import render
from django.conf import settings
from django.urls import reverse
import importlib

def home_page(request):
    app_links = []

    for app in settings.INSTALLED_APPS:
        # skip Django/system apps
        if app.startswith("django.") or app == "home":
            continue

        try:
            urls_module = importlib.import_module(f"{app}.urls")
        except ModuleNotFoundError:
            continue

        for pattern in getattr(urls_module, "urlpatterns", []):
            # only collect app home pages
            if pattern.name == "dashboard":
                try:
                    app_links.append({
                        "app_name": app.split(".")[-1].replace("_", " ").title(),
                        "url": reverse(pattern.name),
                    })
                except Exception:
                    pass

    return render(request, "home/index.html", {"apps": app_links})


def contact_page(request):
    return render(request, "home/contact.html")
