"""
Calculator Registry Engine.

Each calculator registers: id, name, category, input fields, and a
pure calculate() function. A single generic API view serves them all.

This replaces 371 near-identical Django views from the original repo.
"""
from dataclasses import dataclass, field
from typing import Any, Callable, Optional


@dataclass
class CalcField:
    """Definition of one calculator input field (drives both API docs and frontend forms)."""
    name: str
    label: str
    type: str = "number"          # number | select | date | text
    default: Any = None
    unit: str = ""
    options: Optional[list] = None  # for select: [{"value":..., "label":...}]
    min: Optional[float] = None
    max: Optional[float] = None
    step: Optional[float] = None
    required: bool = True
    help: str = ""


@dataclass
class Calculator:
    id: str
    name: str
    category: str
    description: str = ""
    fields: list = field(default_factory=list)
    calculate: Optional[Callable[[dict], dict]] = None

    def run(self, data: dict) -> dict:
        # Coerce + validate inputs
        cleaned = {}
        errors = []
        for f in self.fields:
            raw = data.get(f.name, None)
            if raw is None or (isinstance(raw, str) and raw == ""):
                if f.required and f.default is None:
                    errors.append(f"'{f.name}' is required")
                    continue
                raw = f.default
            if f.type in ("number",):
                try:
                    cleaned[f.name] = float(raw)
                except (TypeError, ValueError):
                    errors.append(f"'{f.name}' must be numeric")
            elif f.type == "select":
                val = str(raw)
                allowed = [o["value"] for o in (f.options or [])]
                if allowed and val not in allowed:
                    errors.append(f"'{f.name}' must be one of {allowed}")
                else:
                    cleaned[f.name] = val
            else:
                cleaned[f.name] = str(raw)
        if errors:
            return {"ok": False, "errors": errors}
        try:
            result = self.calculate(cleaned)
        except ZeroDivisionError:
            return {"ok": False, "errors": ["Division by zero in calculation"]}
        except (ValueError, TypeError) as e:
            return {"ok": False, "errors": [str(e)]}
        return {"ok": True, "result": result}


class Registry:
    def __init__(self):
        self._calcs: dict[str, Calculator] = {}

    def register(self, calc: 'Calculator'):
        if calc.id in self._calcs:
            # Skip duplicate (manual registrations take priority)
            return
        self._calcs[calc.id] = calc

    def get(self, calc_id: str) -> Optional[Calculator]:
        return self._calcs.get(calc_id)

    def all(self) -> list[Calculator]:
        return list(self._calcs.values())

    def by_category(self) -> dict:
        cats: dict[str, list] = {}
        for c in self._calcs.values():
            cats.setdefault(c.category, []).append(c)
        return cats


registry = Registry()


def calculator(id, name, category, description=""):
    """Decorator-style helper to register a calculator function."""
    def wrapper(fn):
        registry.register(Calculator(
            id=id,
            name=name,
            category=category,
            description=description,
            calculate=fn,
            # fields are attached by the register_fields helper below
        ))
        return fn
    return wrapper


# The fields are usually declared alongside; helper to bind them:
def register_calculator(id, name, category, description, fields, fn):
    registry.register(Calculator(
        id=id, name=name, category=category,
        description=description, fields=fields, calculate=fn,
    ))