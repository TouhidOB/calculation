#!/usr/bin/env python3
"""
Ping IndexNow (Bing / Yandex) with all TryCalc.net URLs (Core, Categories, 674 Calculators).
Key: 4f89d31b26a849769e55728be26c117d
"""

import json
import os
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
    "conversion",
    "date_time",
    "education",
    "real_estate",
    "event_budget",
]

CORE_URLS = [
    f"https://{HOST}/",
    f"https://{HOST}/sitemap.xml",
    f"https://{HOST}/calculators",
    f"https://{HOST}/about",
    f"https://{HOST}/contact",
    f"https://{HOST}/privacy",
    f"https://{HOST}/terms",
    f"https://{HOST}/disclaimer",
] + [f"https://{HOST}/category/{c}" for c in CATEGORIES]

def get_all_calculator_urls():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(script_dir, "../frontend/src/lib/calculators-fallback.json"),
        os.path.join(script_dir, "../frontend/src/calculators-fallback.json"),
        "/root/trycalc/app/frontend/src/lib/calculators-fallback.json",
    ]
    json_path = None
    for p in candidates:
        if os.path.exists(p):
            json_path = p
            break
    
    calc_urls = []
    if json_path:
        with open(json_path) as f:
            data = json.load(f)
        for cat, items in data.get("categories", {}).items():
            for item in items:
                cid = item.get("id")
                if cid and cid != "fabric-consumption":
                    calc_urls.append(f"https://{HOST}/calculators/{cid}")
    return calc_urls

def ping_indexnow(urls=None):
    if urls is None:
        calc_urls = get_all_calculator_urls()
        urls = list(dict.fromkeys(CORE_URLS + calc_urls))

    print(f"[IndexNow] Preparing submission of {len(urls)} URLs...")
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
        with urllib.request.urlopen(req, timeout=30) as resp:
            print(f"[IndexNow] HTTP {resp.status} - Submitted {len(urls)} URLs successfully to Bing/Yandex.")
            return True
    except urllib.error.HTTPError as e:
        print(f"[IndexNow] HTTP {e.code}: {e.read().decode('utf-8')}")
        return e.code in (200, 202)
    except Exception as e:
        print(f"[IndexNow] Error: {e}")
        return False

if __name__ == "__main__":
    ping_indexnow()
