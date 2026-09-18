"""
Serve the extracted client-side JS logic and HTML runtime for JS-driven calculators.

Endpoints:
  GET /api/calculators/<id>/script/  → {"id": "...", "js_key": "...", "script": "...", "html": "...", "css": "..."}
"""
import json
import os

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .calculators.engine import registry
from . import calculators  # noqa: F401

_BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_RUNTIME_PATH = os.path.join(_BASE_DIR, "extracted_calc_runtime.json")
_JS_PATH = os.path.join(_BASE_DIR, "extracted_js_logic.json")

_CACHE: dict = {}
_BY_CALC_ID: dict = {}


def _load_data() -> dict:
    """Load extracted runtime or fallback JS lazily."""
    global _CACHE, _BY_CALC_ID
    if not _CACHE:
        target_path = _RUNTIME_PATH if os.path.exists(_RUNTIME_PATH) else _JS_PATH
        if os.path.exists(target_path):
            with open(target_path) as f:
                _CACHE = json.load(f)
    if not _BY_CALC_ID and _CACHE:
        _BY_CALC_ID = {}
        for k in _CACHE:
            if "__" in k:
                cat, tpl = k.split("__", 1)
                calc_id = tpl.replace("_", "-")
                _BY_CALC_ID[calc_id] = k
                if calc_id.endswith("-calculator"):
                    short_id = calc_id[:-11]
                    _BY_CALC_ID[short_id] = k
    return _BY_CALC_ID


class CalcScriptView(APIView):
    """GET /api/calculators/<id>/script/ — inline JS and DOM runtime for one calculator."""

    def get(self, request, calc_id):
        mapping = _load_data()
        js_key = mapping.get(calc_id)
        if not js_key:
            return Response({"error": "No client-side script for this calculator"}, status=404)
        item = _CACHE.get(js_key, {})
        if isinstance(item, dict):
            script = item.get("script", "")
            html = item.get("html", "")
            css = item.get("css", "")
        else:
            script = str(item)
            html = ""
            css = ""
        return Response({
            "id": calc_id,
            "js_key": js_key,
            "script": script,
            "html": html,
            "css": css,
        })


class CalcScriptListView(APIView):
    """GET /api/scripts/ — all JS scripts keyed by calc id (for offline bundling)."""

    def get(self, request):
        mapping = _load_data()
        out = {}
        for calc_id, js_key in mapping.items():
            item = _CACHE.get(js_key, "")
            out[calc_id] = item.get("script", "") if isinstance(item, dict) else str(item)
        return Response({"scripts": out, "total": len(out)})
