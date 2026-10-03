#!/usr/bin/env python3
"""
Sync live Caddy access logs to SQLite database.
Runs on VPS to ensure every day's visitor data is permanently aggregated and stored in database.
"""
import sqlite3
import gzip
import json
import glob
from datetime import datetime, timezone
from collections import defaultdict, Counter

DB_PATH = "/root/trycalc/app/backend/db.sqlite3"
LOG_GLOB = "/var/lib/docker/volumes/stockwhisk_updated_caddy_data/_data/trycalc_access*.log*"

BOT_KEYWORDS = [
    "bot", "spider", "crawler", "googlebot", "bingbot", "slurp", "duckduckbot",
    "baiduspider", "yandex", "semrush", "ahref", "bytespider", "petalbot",
    "headless", "curl", "python", "wget", "gptbot", "claudebot", "perplexity"
]

def sync_visitor_logs():
    if not glob.glob(LOG_GLOB):
        return

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS visitor_daily_analytics (
        date TEXT PRIMARY KEY,
        total_requests INTEGER NOT NULL DEFAULT 0,
        total_unique_ips INTEGER NOT NULL DEFAULT 0,
        real_human_visitors INTEGER NOT NULL DEFAULT 0,
        bot_crawler_requests INTEGER NOT NULL DEFAULT 0,
        top_pages_json TEXT,
        top_countries_json TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    files = sorted(glob.glob(LOG_GLOB))
    daily_aggregates = defaultdict(lambda: {
        "total_requests": 0,
        "ips": set(),
        "human_ips": set(),
        "bot_requests": 0,
        "pages": Counter(),
        "countries": Counter(),
    })

    for fpath in files:
        opener = gzip.open if fpath.endswith(".gz") else open
        try:
            with opener(fpath, "rt", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    if not line.strip():
                        continue
                    try:
                        data = json.loads(line)
                        req = data.get("request", {})
                        ts = data.get("ts", 0)
                        if not ts:
                            continue
                        date_str = datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
                        uri = req.get("uri", "/")
                        headers = req.get("headers", {})
                        ua = (headers.get("User-Agent", [""])[0]).lower()
                        ip = req.get("client_ip", "")
                        country = (headers.get("Cf-Ipcountry", ["US"])[0]).upper()

                        is_bot = any(k in ua for k in BOT_KEYWORDS)
                        clean_path = uri.split("?")[0].split("#")[0]

                        st = daily_aggregates[date_str]
                        st["total_requests"] += 1
                        st["ips"].add(ip)
                        if is_bot:
                            st["bot_requests"] += 1
                        else:
                            st["human_ips"].add(ip)
                            if clean_path and not clean_path.startswith("/imon") and not clean_path.endswith((".php", ".png", ".jpg", ".ico", ".css", ".js")):
                                st["pages"][clean_path] += 1
                            st["countries"][country] += 1
                    except Exception:
                        pass
        except Exception:
            pass

    for date_str, st in daily_aggregates.items():
        top_pages = [{"path": p, "views": count} for p, count in st["pages"].most_common(10)]
        top_countries = [{"code": c, "count": count} for c, count in st["countries"].most_common(10)]

        cur.execute("""
        INSERT INTO visitor_daily_analytics 
        (date, total_requests, total_unique_ips, real_human_visitors, bot_crawler_requests, top_pages_json, top_countries_json, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(date) DO UPDATE SET
            total_requests=excluded.total_requests,
            total_unique_ips=excluded.total_unique_ips,
            real_human_visitors=excluded.real_human_visitors,
            bot_crawler_requests=excluded.bot_crawler_requests,
            top_pages_json=excluded.top_pages_json,
            top_countries_json=excluded.top_countries_json,
            updated_at=CURRENT_TIMESTAMP;
        """, (
            date_str,
            st["total_requests"],
            len(st["ips"]),
            len(st["human_ips"]),
            st["bot_requests"],
            json.dumps(top_pages),
            json.dumps(top_countries)
        ))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    sync_visitor_logs()
