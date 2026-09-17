"""
Date & Time calculators implemented in Python using standard library for zero-dependency reliability.
"""
from datetime import datetime, date, timedelta
import calendar
from typing import Optional

from .engine import register_calculator, CalcField


def _parse_date(val) -> Optional[date]:
    if not val:
        return None
    val = str(val).strip()
    for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(val, fmt).date()
        except ValueError:
            pass
    try:
        return date.fromisoformat(val[:10])
    except Exception:
        return None


def _add_months(d: date, months: int) -> date:
    year = d.year + (d.month + months - 1) // 12
    month = (d.month + months - 1) % 12 + 1
    # clamp day to max days in month
    max_day = calendar.monthrange(year, month)[1]
    day = min(d.day, max_day)
    return date(year, month, day)


def _diff_ymd(d1: date, d2: date):
    """Difference between two dates in (years, months, days). Assumes d2 >= d1."""
    if d1 > d2:
        d1, d2 = d2, d1
    years = d2.year - d1.year
    months = d2.month - d1.month
    days = d2.day - d1.day

    if days < 0:
        prev_month = d2.month - 1 or 12
        prev_year = d2.year if d2.month > 1 else d2.year - 1
        days += calendar.monthrange(prev_year, prev_month)[1]
        months -= 1

    if months < 0:
        months += 12
        years -= 1

    return years, months, days


def half_birthday_calc(data: dict) -> dict:
    raw_bday = data.get("birthday-date") or data.get("dob-date") or data.get("start-date") or data.get("date")
    bday = _parse_date(raw_bday)
    if not bday:
        return {"error": "Please select a valid birth date."}

    today = date.today()
    # Calculate half-birthday in the current year
    half_bday_this_year = _add_months(date(today.year, bday.month, bday.day if bday.day <= 28 else min(bday.day, calendar.monthrange(today.year, bday.month)[1])), 6)

    # If it has passed this year, take next year's
    if half_bday_this_year < today:
        next_half_bday = _add_months(date(today.year + 1, bday.month, bday.day if bday.day <= 28 else min(bday.day, calendar.monthrange(today.year + 1, bday.month)[1])), 6)
    else:
        next_half_bday = half_bday_this_year

    days_left = (next_half_bday - today).days

    return {
        "Next Half-Birthday": next_half_bday.strftime("%A, %B %d, %Y"),
        "Days Remaining": f"{days_left} days away" if days_left > 0 else "Today is your Half-Birthday! 🎉",
        "Celebration Milestone": f"Exactly 6 months from your birthday on {bday.strftime('%B %d')}",
        "Exact Date": next_half_bday.isoformat(),
    }


def age_calc(data: dict) -> dict:
    raw_dob = data.get("dob-date") or data.get("birth-date") or data.get("start-date") or data.get("birthday-date")
    dob = _parse_date(raw_dob)
    if not dob:
        return {"error": "Please select a valid date of birth."}

    target = _parse_date(data.get("target-date") or data.get("current-date")) or date.today()
    if dob > target:
        return {"error": "Date of birth cannot be in the future relative to comparison date."}

    years, months, days = _diff_ymd(dob, target)
    total_days = (target - dob).days
    total_weeks = total_days // 7
    total_months = years * 12 + months
    total_hours = total_days * 24

    # Next birthday
    try:
        next_bday = date(target.year, dob.month, dob.day)
    except ValueError:
        # Leap year handling
        next_bday = date(target.year, 2, 28)

    if next_bday < target:
        try:
            next_bday = date(target.year + 1, dob.month, dob.day)
        except ValueError:
            next_bday = date(target.year + 1, 2, 28)

    days_to_next = (next_bday - target).days

    return {
        "Age": f"{years} years, {months} months, {days} days",
        "Total Months": f"{total_months:,} months",
        "Total Weeks": f"{total_weeks:,} weeks",
        "Total Days": f"{total_days:,} days",
        "Total Hours": f"{total_hours:,} hours",
        "Next Birthday": f"{next_bday.strftime('%A, %B %d, %Y')} ({days_to_next} days left)",
    }


def date_difference_calc(data: dict) -> dict:
    d1 = _parse_date(data.get("date-older") or data.get("start-date") or data.get("date1"))
    d2 = _parse_date(data.get("date-newer") or data.get("end-date") or data.get("date2"))
    if not d1 or not d2:
        return {"error": "Please provide both dates."}

    if d1 > d2:
        d1, d2 = d2, d1

    years, months, days = _diff_ymd(d1, d2)
    total_days = (d2 - d1).days
    total_weeks = total_days // 7
    rem_days = total_days % 7
    total_hours = total_days * 24

    return {
        "Age Difference": f"{years} years, {months} months, {days} days",
        "Total Days Difference": f"{total_days:,} days",
        "Total Weeks": f"{total_weeks:,} weeks, {rem_days} days",
        "Total Hours": f"{total_hours:,} hours",
    }


def pregnancy_week_calc(data: dict) -> dict:
    raw_lmp = data.get("lmp-date") or data.get("start-date")
    lmp = _parse_date(raw_lmp)
    if not lmp:
        return {"error": "Please enter the first day of your Last Menstrual Period (LMP)."}

    curr = _parse_date(data.get("current-date")) or date.today()
    
    # Due date is LMP + 280 days (40 weeks)
    due_date = lmp + timedelta(days=280)
    days_pregnant = (curr - lmp).days

    if days_pregnant < 0:
        return {"error": "LMP date cannot be in the future."}

    weeks = days_pregnant // 7
    days = days_pregnant % 7
    days_left = max(0, (due_date - curr).days)

    trimester = "First Trimester (Weeks 1 - 13)"
    if weeks >= 28:
        trimester = "Third Trimester (Weeks 28 - 40+)"
    elif weeks >= 14:
        trimester = "Second Trimester (Weeks 14 - 27)"

    return {
        "Estimated Due Date (EDC)": due_date.strftime("%A, %B %d, %Y"),
        "Current Gestational Age": f"{weeks} weeks, {days} days",
        "Trimester": trimester,
        "Days Remaining to Due Date": f"{days_left} days",
    }


def anniversary_calc(data: dict) -> dict:
    raw_start = data.get("start-date") or data.get("date")
    start = _parse_date(raw_start)
    if not start:
        return {"error": "Please select a start date."}

    today = date.today()
    if start > today:
        return {"error": "Start date cannot be in the future."}

    years, months, days = _diff_ymd(start, today)
    total_days = (today - start).days

    try:
        next_ann = date(today.year, start.month, start.day)
    except ValueError:
        next_ann = date(today.year, 2, 28)

    if next_ann < today:
        try:
            next_ann = date(today.year + 1, start.month, start.day)
        except ValueError:
            next_ann = date(today.year + 1, 2, 28)

    days_until_next = (next_ann - today).days

    return {
        "Time Elapsed": f"{years} years, {months} months, {days} days",
        "Total Days Together": f"{total_days:,} days",
        "Next Anniversary": f"{next_ann.strftime('%A, %B %d, %Y')} ({days_until_next} days away)",
        "Next Milestone (Years)": f"{years + 1}th Anniversary",
    }


def animal_age_calc(data: dict) -> dict:
    age_str = data.get("input-age") or data.get("age")
    direction = str(data.get("conversion-type") or "")
    try:
        age = float(str(age_str or "0"))
    except (TypeError, ValueError):
        return {"error": "Please enter a valid numeric age."}

    if "Human Years → Dog" in direction:
        # Human to Dog
        if age <= 15:
            dog_age = age / 15.0
        elif age <= 24:
            dog_age = 1 + (age - 15) / 9.0
        else:
            dog_age = 2 + (age - 24) / 5.0
        return {
            "Equivalent Dog Age": f"{round(dog_age, 1)} dog years",
            "Input Human Age": f"{age} years",
            "Calculation Rule": "First year ≈ 15 human years, 2nd year ≈ +9, each subsequent ≈ +5",
        }
    else:
        # Dog to Human
        if age <= 1:
            human_age = age * 15
        elif age <= 2:
            human_age = 15 + (age - 1) * 9
        else:
            human_age = 24 + (age - 2) * 5
        return {
            "Equivalent Human Age": f"{round(human_age, 1)} years old",
            "Input Dog Age": f"{age} years",
            "Calculation Rule": "First year ≈ 15 human years, 2nd year ≈ +9, each subsequent ≈ +5",
        }


# Register all Date/Time calculators with explicit high precision
register_calculator(
    "half-birthday-calculator", "🎂 'Half-Birthday' Calculator", "date_time",
    "Calculate your exact half-birthday date (6 months away) and countdown timer.",
    fields=[
        CalcField("birthday-date", "Date of Birth", type="date", required=True),
    ],
    fn=half_birthday_calc,
)

register_calculator(
    "age-calculator", "🎂 Age Calculator", "date_time",
    "Calculate precise age in years, months, days, hours, and countdown to next birthday.",
    fields=[
        CalcField("dob-date", "Date of Birth (DOB)", type="date", required=True),
    ],
    fn=age_calc,
)

register_calculator(
    "chronological-age-calculator", "📅 Chronological Age Calculator", "date_time",
    "Calculate exact chronological age from date of birth to current or target date.",
    fields=[
        CalcField("dob-date", "Date of Birth", type="date", required=True),
    ],
    fn=age_calc,
)

register_calculator(
    "age-difference-calculator", "🧮 Age Difference Calculator", "date_time",
    "Calculate the exact difference in years, months, and days between two birthdays.",
    fields=[
        CalcField("date-older", "Date 1 (Older Person's Birthday)", type="date", required=True),
        CalcField("date-newer", "Date 2 (Younger Person's Birthday)", type="date", required=True),
    ],
    fn=date_difference_calc,
)

register_calculator(
    "date-difference-calculator", "📆 Date Difference Calculator", "date_time",
    "Calculate elapsed time, days, weeks, and hours between any two calendar dates.",
    fields=[
        CalcField("date-older", "Start Date", type="date", required=True),
        CalcField("date-newer", "End Date", type="date", required=True),
    ],
    fn=date_difference_calc,
)

register_calculator(
    "pregnancy-week-calculator", "🤰 Pregnancy Week Calculator", "date_time",
    "Calculate gestational age, current trimester, and estimated delivery due date (EDC).",
    fields=[
        CalcField("lmp-date", "First Day of Last Menstrual Period (LMP)", type="date", required=True),
        CalcField("current-date", "Current Calculation Date", type="date", default=date.today().isoformat()),
    ],
    fn=pregnancy_week_calc,
)

register_calculator(
    "anniversary-and-milestone-calculator", "💖 Anniversary & Milestone Calculator", "date_time",
    "Calculate elapsed relationship milestones, next anniversary date, and days together.",
    fields=[
        CalcField("start-date", "Date of Event / Wedding", type="date", required=True),
    ],
    fn=anniversary_calc,
)

register_calculator(
    "animal-age-calculator", "🐾 Animal Age Converter", "date_time",
    "Convert between dog/cat years and equivalent human years with veterinary accuracy.",
    fields=[
        CalcField("input-age", "Age", type="number", default=5),
        CalcField("conversion-type", "Conversion Direction", type="select", options=[
            {"value": "Dog Years → Human Years", "label": "Dog Years → Human Years"},
            {"value": "Human Years → Dog Years", "label": "Human Years → Dog Years"},
        ]),
    ],
    fn=animal_age_calc,
)
