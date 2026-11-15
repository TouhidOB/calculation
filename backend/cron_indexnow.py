#!/usr/bin/env python3
"""
Automated IndexNow Submission Script for TryCalc (https://trycalc.net)
====================================================================
Submits all site URLs in batches to the IndexNow protocol endpoints:
- IndexNow Hub: https://api.indexnow.org/indexnow
- Microsoft Bing: https://www.bing.com/indexnow

Key: 4f89d31b26a849769e55728be26c117d
Key Location: https://trycalc.net/4f89d31b26a849769e55728be26c117d.txt
"""

import argparse
from datetime import datetime, timezone
import json
import logging
import os
from pathlib import Path
import ssl
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

# ── Configuration Constants ────────────────────────────────────────────────
DEFAULT_HOST = "trycalc.net"
DEFAULT_KEY = "4f89d31b26a849769e55728be26c117d"
DEFAULT_KEY_LOCATION = f"https://{DEFAULT_HOST}/{DEFAULT_KEY}.txt"
DEFAULT_SITEMAP_URL = f"https://{DEFAULT_HOST}/sitemap.xml"
DEFAULT_BATCH_SIZE = 250
DEFAULT_BATCH_DELAY = 1.0  # seconds between batches
DEFAULT_TIMEOUT = 25       # network timeout in seconds

ENDPOINTS = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
]

# Paths for local offline fallbacks relative to repo root
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
FALLBACK_CATALOG_PATH = REPO_ROOT / "frontend" / "src" / "lib" / "calculators-fallback.json"
LOCAL_SITEMAP_TEMPLATES = [
    REPO_ROOT / "calculation" / "templates" / "sitemap.xml",
    REPO_ROOT / "frontend" / "public" / "sitemap.xml",
]
LOG_FILE_PATH = SCRIPT_DIR / "indexnow_submission.log"

# ── Logging Setup ──────────────────────────────────────────────────────────
class CleanFormatter(logging.Formatter):
    """Clean, high-legibility log output with standardized timestamps."""
    def formatTime(self, record, datefmt=None):
        dt = datetime.fromtimestamp(record.created, tz=timezone.utc)
        return dt.strftime("%Y-%m-%d %H:%M:%S UTC")

def setup_logger(verbose: bool = False) -> logging.Logger:
    logger = logging.getLogger("IndexNow")
    logger.setLevel(logging.DEBUG if verbose else logging.INFO)
    logger.handlers.clear()

    # Console Handler
    c_handler = logging.StreamHandler(sys.stdout)
    c_format = CleanFormatter("[%(asctime)s] [%(levelname)s] %(message)s")
    c_handler.setFormatter(c_format)
    logger.addHandler(c_handler)

    # File Handler
    try:
        f_handler = logging.FileHandler(LOG_FILE_PATH, encoding="utf-8")
        f_format = CleanFormatter("[%(asctime)s] [%(levelname)s] %(message)s")
        f_handler.setFormatter(f_format)
        logger.addHandler(f_handler)
    except Exception as e:
        logger.warning(f"Could not initialize file log handler at {LOG_FILE_PATH}: {e}")

    return logger

logger = setup_logger()

# ── Sitemap Extraction Helpers ─────────────────────────────────────────────
def parse_xml_urls(xml_content: str) -> list[str]:
    """Extract <loc> URLs from a standard sitemap or sitemap index XML string."""
    urls = []
    try:
        root = ET.fromstring(xml_content)
        # Handle namespaces like {http://www.sitemaps.org/schemas/sitemap/0.9}
        for elem in root.iter():
            tag_name = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
            if tag_name == "loc" and elem.text:
                loc = elem.text.strip()
                if loc.startswith("http://") or loc.startswith("https://"):
                    urls.append(loc)
    except Exception as e:
        logger.error(f"XML parsing failed: {e}")
    return urls

def fetch_live_sitemap(sitemap_url: str, timeout: int = DEFAULT_TIMEOUT) -> list[str]:
    """Fetch live sitemap over HTTPS and extract all destination URLs."""
    logger.info(f"Fetching live sitemap from {sitemap_url}...")
    ctx = ssl.create_default_context()
    req = urllib.request.Request(
        sitemap_url,
        headers={
            "User-Agent": "TryCalc-IndexNow-Cron/1.0 (+https://trycalc.net)",
            "Accept": "application/xml, text/xml, */*",
        },
    )

    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
        if resp.status != 200:
            raise urllib.error.HTTPError(
                sitemap_url, resp.status, f"HTTP {resp.status}", resp.headers, None
            )
        data = resp.read().decode("utf-8")
        raw_urls = parse_xml_urls(data)

        # Check if sitemap index pointing to sub-sitemaps
        resolved_urls = []
        for u in raw_urls:
            if u.endswith(".xml") and "sitemap" in u.lower():
                logger.info(f"Resolving child sitemap index: {u}")
                try:
                    child_urls = fetch_live_sitemap(u, timeout=timeout)
                    resolved_urls.extend(child_urls)
                except Exception as child_err:
                    logger.warning(f"Failed to fetch child sitemap {u}: {child_err}")
            else:
                resolved_urls.append(u)

        return resolved_urls

def extract_fallback_urls() -> list[str]:
    """Generate comprehensive catalog URLs from local JSON repository fallback."""
    logger.info("Attempting local repository fallback for URLs...")
    urls = set()

    # 1. Check local template sitemaps
    for template_path in LOCAL_SITEMAP_TEMPLATES:
        if template_path.is_file():
            try:
                content = template_path.read_text(encoding="utf-8").strip()
                # Skip Django template files that have not been rendered
                if content.startswith("{%"):
                    continue
                template_urls = parse_xml_urls(content)
                if template_urls:
                    logger.info(f"Extracted {len(template_urls)} URLs from local template: {template_path.name}")
                    urls.update(template_urls)
            except Exception as e:
                logger.warning(f"Could not read local sitemap template {template_path}: {e}")

    # 2. Extract from calculators-fallback.json
    if FALLBACK_CATALOG_PATH.is_file():
        try:
            with open(FALLBACK_CATALOG_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Static core routes
            static_pages = [
                "",
                "guides",
                "widgets",
                "about",
                "contact",
                "disclaimer",
                "privacy-policy",
                "terms-of-service",
            ]
            for p in static_pages:
                urls.add(f"https://{DEFAULT_HOST}/{p}".rstrip("/"))

            # Category routes & Calculator routes
            cats = data.get("categories", {})
            for cat_name, calc_list in cats.items():
                urls.add(f"https://{DEFAULT_HOST}/category/{cat_name}")
                if isinstance(calc_list, list):
                    for calc in calc_list:
                        cid = calc.get("id")
                        if cid:
                            urls.add(f"https://{DEFAULT_HOST}/calculators/{cid}")

            logger.info(f"Extracted catalog routes from {FALLBACK_CATALOG_PATH.name} (total URLs now: {len(urls)})")
        except Exception as e:
            logger.error(f"Error parsing {FALLBACK_CATALOG_PATH}: {e}")

    return sorted(urls)

def get_all_target_urls(sitemap_url: str) -> list[str]:
    """Main discovery logic: live sitemap first, robust local fallback if offline."""
    try:
        urls = fetch_live_sitemap(sitemap_url)
        if urls:
            logger.info(f"Successfully retrieved {len(urls)} URLs from live sitemap.")
            return sorted(set(urls))
    except Exception as e:
        logger.warning(f"Live sitemap fetch failed ({e}). Falling back to offline local catalog.")

    fallback_urls = extract_fallback_urls()
    if not fallback_urls:
        raise RuntimeError("Failed to extract URLs from both live sitemap and local catalog fallback.")

    logger.info(f"Recovered {len(fallback_urls)} URLs using offline fallback catalog.")
    return sorted(set(fallback_urls))

# ── Batch Submission to IndexNow API ────────────────────────────────────────
def submit_batch_to_endpoint(
    endpoint: str,
    host: str,
    key: str,
    key_location: str,
    url_batch: list[str],
    timeout: int = DEFAULT_TIMEOUT,
) -> tuple[int, str]:
    """
    Submits a batch of URLs to a given IndexNow API endpoint via HTTP POST.
    Returns (status_code, response_message).
    """
    payload = {
        "host": host,
        "key": key,
        "keyLocation": key_location,
        "urlList": url_batch,
    }
    json_bytes = json.dumps(payload).encode("utf-8")

    req = urllib.request.Request(
        endpoint,
        data=json_bytes,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "TryCalc-IndexNow-Cron/1.0 (+https://trycalc.net)",
        },
        method="POST",
    )

    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            status = resp.status
            body = resp.read().decode("utf-8", errors="replace")
            return status, body or "OK"
    except urllib.error.HTTPError as he:
        err_body = he.read().decode("utf-8", errors="replace") if he.fp else ""
        return he.code, f"HTTPError {he.code}: {he.reason} - {err_body}"
    except Exception as e:
        return 0, f"NetworkError: {str(e)}"

# ── Main Orchestrator ──────────────────────────────────────────────────────
def run_indexnow_submission(
    host: str = DEFAULT_HOST,
    key: str = DEFAULT_KEY,
    key_location: str = DEFAULT_KEY_LOCATION,
    sitemap_url: str = DEFAULT_SITEMAP_URL,
    batch_size: int = DEFAULT_BATCH_SIZE,
    batch_delay: float = DEFAULT_BATCH_DELAY,
    endpoints: list[str] = ENDPOINTS,
    dry_run: bool = False,
    limit: int | None = None,
) -> dict:
    """
    Executes complete automated IndexNow submission workflow.
    """
    start_time = time.time()
    logger.info("=" * 70)
    logger.info(f"Starting TryCalc IndexNow Submission Job for host: {host}")
    logger.info(f"Target Key: {key[:8]}...{key[-4:]} | Key Location: {key_location}")
    logger.info(f"Endpoints: {', '.join(endpoints)}")
    logger.info("=" * 70)

    # Step 1: Discover all URLs
    all_urls = get_all_target_urls(sitemap_url)
    if limit and limit > 0:
        all_urls = all_urls[:limit]
        logger.info(f"Applying --limit: truncated to {len(all_urls)} URLs.")

    total_urls = len(all_urls)
    logger.info(f"Total verified URLs prepared for submission: {total_urls}")

    if total_urls == 0:
        logger.warning("No URLs found to submit. Exiting.")
        return {"status": "empty", "total_urls": 0}

    # Step 2: Split into batches
    batches = [all_urls[i : i + batch_size] for i in range(0, total_urls, batch_size)]
    total_batches = len(batches)
    logger.info(f"Split into {total_batches} batches (batch size: {batch_size}).")

    if dry_run:
        logger.info("[DRY RUN] Would submit the following sample URLs:")
        for idx, u in enumerate(all_urls[:5], start=1):
            logger.info(f"  {idx}. {u}")
        if total_urls > 5:
            logger.info(f"  ... and {total_urls - 5} more URLs across {total_batches} batches.")
        logger.info("[DRY RUN] Completed without dispatching network requests.")
        return {"status": "dry_run", "total_urls": total_urls, "batches": total_batches}

    # Step 3: Submit batches
    results_summary = {ep: {"success": 0, "failed": 0, "codes": {}} for ep in endpoints}

    for b_idx, batch in enumerate(batches, start=1):
        logger.info(f"── Processing Batch {b_idx}/{total_batches} ({len(batch)} URLs) ──")

        for endpoint in endpoints:
            ep_name = "IndexNow API" if "api.indexnow.org" in endpoint else "Bing IndexNow"
            status, msg = submit_batch_to_endpoint(
                endpoint=endpoint,
                host=host,
                key=key,
                key_location=key_location,
                url_batch=batch,
            )

            # Record stats
            code_str = str(status)
            results_summary[endpoint]["codes"][code_str] = (
                results_summary[endpoint]["codes"].get(code_str, 0) + 1
            )

            if status in (200, 202):
                results_summary[endpoint]["success"] += len(batch)
                logger.info(f"  [SUCCESS] {ep_name} -> HTTP {status} (Batch {b_idx}/{total_batches})")
            else:
                results_summary[endpoint]["failed"] += len(batch)
                logger.error(f"  [FAILED]  {ep_name} -> HTTP {status} ({msg}) (Batch {b_idx}/{total_batches})")

        # Polite rate limiting between batches
        if b_idx < total_batches and batch_delay > 0:
            time.sleep(batch_delay)

    elapsed = round(time.time() - start_time, 2)
    logger.info("=" * 70)
    logger.info(f"IndexNow Submission Job Finished in {elapsed}s")
    logger.info(f"Total URLs Processed: {total_urls} in {total_batches} batches")

    for endpoint in endpoints:
        ep_name = "IndexNow API (api.indexnow.org)" if "api.indexnow.org" in endpoint else "Bing (www.bing.com)"
        stats = results_summary[endpoint]
        codes_repr = ", ".join(f"HTTP {k}: {v} batches" for k, v in stats["codes"].items())
        logger.info(
            f"Endpoint: {ep_name} | Success: {stats['success']}/{total_urls} URLs | {codes_repr}"
        )
    logger.info("=" * 70)

    return {
        "status": "completed",
        "total_urls": total_urls,
        "batches": total_batches,
        "elapsed_seconds": elapsed,
        "endpoints": results_summary,
    }

def main():
    parser = argparse.ArgumentParser(
        description="TryCalc Automated IndexNow Batch URL Submitter"
    )
    parser.add_argument("--host", default=DEFAULT_HOST, help="Host domain (default: trycalc.net)")
    parser.add_argument("--key", default=DEFAULT_KEY, help="IndexNow API key")
    parser.add_argument("--key-location", default=DEFAULT_KEY_LOCATION, help="Key location URL")
    parser.add_argument("--sitemap", default=DEFAULT_SITEMAP_URL, help="Sitemap URL")
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE, help="URLs per batch (default: 250)")
    parser.add_argument("--batch-delay", type=float, default=DEFAULT_BATCH_DELAY, help="Delay between batches in seconds")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of URLs to submit (for testing)")
    parser.add_argument("--dry-run", action="store_true", help="Extract and validate URLs without sending API requests")
    parser.add_argument("--verbose", "-v", action="store_true", help="Enable verbose debug logging")

    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    try:
        res = run_indexnow_submission(
            host=args.host,
            key=args.key,
            key_location=args.key_location,
            sitemap_url=args.sitemap,
            batch_size=args.batch_size,
            batch_delay=args.batch_delay,
            dry_run=args.dry_run,
            limit=args.limit,
        )
        # Exit with error code if any batches failed
        has_failures = False
        if res.get("status") == "completed":
            for ep_stats in res.get("endpoints", {}).values():
                if ep_stats.get("failed", 0) > 0:
                    has_failures = True
        sys.exit(1 if has_failures else 0)
    except Exception as exc:
        logger.critical(f"Unhandled fatal error during IndexNow submission: {exc}", exc_info=args.verbose)
        sys.exit(1)

if __name__ == "__main__":
    main()
