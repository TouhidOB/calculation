#!/usr/bin/env python3
"""
Automated IndexNow & Bing Search Submitter for TryCalc.net
Reads live sitemap.xml and pings search engines (Bing, IndexNow, Yandex)
"""
import sys
import json
import logging
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime

HOST = "trycalc.net"
SITEMAP_URL = "https://trycalc.net/sitemap.xml"
KEY = "4f89d31b26a849769e55728be26c117d"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

def fetch_sitemap_urls():
    req = urllib.request.Request(SITEMAP_URL, headers={"User-Agent": "TryCalc-IndexNow-Cron/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        xml_data = resp.read()
    root = ET.fromstring(xml_data)
    urls = [elem.text for elem in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc") if elem.text]
    return urls

def submit_indexnow(urls):
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls
    }
    endpoints = [
        ("IndexNow Central", "https://api.indexnow.org/indexnow"),
        ("Bing", "https://www.bing.com/indexnow")
    ]
    
    for name, endpoint in endpoints:
        try:
            req = urllib.request.Request(
                endpoint,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": "TryCalc-IndexNow-Cron/1.0"}
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                logging.info(f"{name} submitted {len(urls)} URLs. Status: {resp.status}")
        except urllib.error.HTTPError as e:
            logging.error(f"{name} HTTP Error: {e.code} - {e.reason}")
        except Exception as e:
            logging.error(f"{name} Error: {e}")

if __name__ == "__main__":
    try:
        urls = fetch_sitemap_urls()
        logging.info(f"Fetched {len(urls)} URLs from sitemap.")
        if urls:
            submit_indexnow(urls)
    except Exception as e:
        logging.error(f"Execution failed: {e}")
        sys.exit(1)
