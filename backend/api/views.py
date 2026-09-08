"""
API views: registry-driven calculator endpoints.

Three endpoints replace 371 individual Django views:
  GET  /api/calculators/          → list all calculators + categories
  GET  /api/calculators/<id>/     → one calculator's definition (fields)
  POST /api/calculators/<id>/run/ → run a calculation
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .calculators.engine import registry
# Ensure all calculator modules register themselves
from . import calculators  # noqa: F401


def _serialize(calc):
    return {
        "id": calc.id,
        "name": calc.name,
        "category": calc.category,
        "description": calc.description,
        "fields": [
            {
                "name": f.name,
                "label": f.label,
                "type": f.type,
                "unit": f.unit,
                "required": f.required,
                "default": f.default,
                "options": f.options,
                "min": f.min,
                "max": f.max,
                "step": f.step,
                "help": f.help,
            }
            for f in calc.fields
        ],
    }


class CalculatorListView(APIView):
    """GET /api/calculators/ — all calculators grouped by category."""

    def get(self, request):
        return Response({
            "categories": {
                cat: [_serialize(c) for c in calcs]
                for cat, calcs in registry.by_category().items()
            },
            "total": len(registry.all()),
        })


class CalculatorDetailView(APIView):
    """GET /api/calculators/<id>/ — one calculator definition."""

    def get(self, request, calc_id):
        calc = registry.get(calc_id)
        if not calc:
            return Response(
                {"error": f"Unknown calculator: {calc_id}"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(_serialize(calc))


class CalculatorRunView(APIView):
    """POST /api/calculators/<id>/run/ — execute a calculation."""

    def post(self, request, calc_id):
        calc = registry.get(calc_id)
        if not calc:
            return Response(
                {"error": f"Unknown calculator: {calc_id}"},
                status=status.HTTP_404_NOT_FOUND,
            )
        outcome = calc.run(request.data)
        if not outcome["ok"]:
            return Response(
                {"errors": outcome["errors"]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({"ok": True, "calculator": calc.id, "result": outcome["result"]})


class HealthCheckView(APIView):
    """GET /api/health/ — service heartbeat."""

    def get(self, request):
        return Response({"status": "ok", "calculators": len(registry.all())})