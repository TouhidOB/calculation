"""
Serve the extracted client-side JS logic for JS-driven calculators.

Endpoints:
  GET /api/calculators/<id>/script/  → {"js_key": "finance__budget_calculator", "script": "..."}
"""
import json
import os

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .calculators.engine import registry
from . import calculators  # noqa: F401

_JS_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "extracted_js_logic.json")
_JS_CACHE: dict = {}
_JS_BY_CALC_ID: dict = {}


def _load_js() -> dict:
    """Load extracted JS (category__template → JS source) lazily."""
    global _JS_CACHE, _JS_BY_CALC_ID
    if not _JS_CACHE and os.path.exists(_JS_PATH):
        with open(_JS_PATH) as f:
            _JS_CACHE = json.load(f)
    if not _JS_BY_CALC_ID and _JS_CACHE:
        # calc-id → js_key mapping: template ids in the three batch files carry category info
        _JS_BY_CALC_ID = {}
        for k in _JS_CACHE:
            if "__" in k:
                cat, tpl = k.split("__", 1)
                calc_id = tpl.replace("_", "-")
                _JS_BY_CALC_ID[calc_id] = k
                # Also map without "-calculator" suffix for short IDs like "budget" vs "budget-calculator"
                if calc_id.endswith("-calculator"):
                    short_id = calc_id[:-11]  # remove "-calculator"
                    _JS_BY_CALC_ID[short_id] = k
    return _JS_BY_CALC_ID


class CalcScriptView(APIView):
    """GET /api/calculators/<id>/script/ — inline JS for one calculator."""

    def get(self, request, calc_id):
        mapping = _load_js()
        js_key = mapping.get(calc_id)
        if not js_key:
            return Response({"error": "No client-side script for this calculator"}, status=404)
        script = _JS_CACHE.get(js_key, "")
        return Response({"id": calc_id, "js_key": js_key, "script": script})


class CalcScriptListView(APIView):
    """GET /api/scripts/ — all JS scripts keyed by calc id (for offline bundling)."""

    def get(self, request):
        mapping = _load_js()
        out = {}
        for calc_id, js_key in mapping.items():
            out[calc_id] = _JS_CACHE.get(js_key, "")
        return Response({"scripts": out, "total": len(out)})
