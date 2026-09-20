#!/usr/bin/env python3
"""
Ping IndexNow (Bing / Yandex) with updated TryCalc.net URLs.
Key: 4f89d31b26a849769e55728be26c117d
"""

import json
import urllib.request
import urllib.error

HOST = "trycalc.net"
KEY = "4f89d31b26a849769e55728be26c117d"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

CATEGORIES = [
    "finance",
    "business_investment",
    "health",
    "construction",
    "basic",
    "garments",
    "conversion",
    "date_time",
    "education",
    "real_estate",
    "event_budget",
]

CORE_URLS = [
    f"https://{HOST}/",
    f"https://{HOST}/sitemap.xml",
    f"https://{HOST}/about",
    f"https://{HOST}/contact",
    f"https://{HOST}/privacy",
    f"https://{HOST}/terms",
    f"https://{HOST}/disclaimer",
] + [f"https://{HOST}/category/{c}" for c in CATEGORIES]

def ping_indexnow(urls=None):
    if urls is None:
        urls = CORE_URLS

    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }

    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            print(f"[IndexNow] HTTP {resp.status} - Submitted {len(urls)} URLs successfully.")
            return True
    except urllib.error.HTTPError as e:
        print(f"[IndexNow] HTTP {e.code}: {e.read().decode('utf-8')}")
        return e.code in (200, 202)
    except Exception as e:
        print(f"[IndexNow] Error: {e}")
        return False

if __name__ == "__main__":
    ping_indexnow()
