from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from django.urls.resolvers import URLPattern, URLResolver
from django.conf import settings
import importlib


def get_all_named_urls():
    urls = []

    for app in settings.INSTALLED_APPS:
        try:
            urls_module = importlib.import_module(f"{app}.urls")
            urlpatterns = getattr(urls_module, 'urlpatterns', [])
            urls.extend(extract_urls(urlpatterns))
        except Exception:
            continue

    return urls

def extract_urls(urlpatterns, prefix=''):
    collected = []

    for pattern in urlpatterns:
        if isinstance(pattern, URLPattern):
            if pattern.name:
                collected.append(pattern.name)

        elif isinstance(pattern, URLResolver):
            collected.extend(extract_urls(pattern.url_patterns))

    return collected


class GlobalStaticSitemap(Sitemap):
    priority = 0.8
    changefreq = "daily"

    def items(self):
        return get_all_named_urls()

    def location(self, item):
        try:
            return reverse(item)
        except:
            return None
