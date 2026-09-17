"""
Date & Time calculators implemented in Python for fast, deterministic server-side execution.
"""
from datetime import datetime, date, timedelta
from dateutil.relativedelta import relativedelta
from .engine import CalcField, register_calculator


def _parse_date(val):
    if not val:
        return None
    val_str = str(val).strip().split("T")[0]
    for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%d-%m-%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(val_str, fmt).date()
        except ValueError:
            pass
    return None


def calc_half_birthday(data):
    dob_val = data.get("birthday-date") or data.get("dob-date") or data.get("birth-date") or data.get("date")
    bdate = _parse_date(dob_val)
    if not bdate:
        return {"error": "Please provide a valid birthdate (YYYY-MM-DD)"}

    today = date.today()
    # Calculate birthday this year
    try:
        bday_this_year = date(today.year, bdate.month, bdate.day)
    except ValueError:
        # Handle Feb 29 on non-leap year
        bday_this_year = date(today.year, 2, 28)

    # Half birthday is 6 months later
    half_bday = bday_this_year + relativedelta(months=6)

    # If already passed this year, find the next one
    if half_bday < today:
        try:
            bday_next_year = date(today.year + 1, bdate.month, bdate.day)
        except ValueError:
            bday_next_year = date(today.year + 1, 2, 28)
        half_bday = bday_next_year + relativedelta(months=6)

    days_left = (half_bday - today).days

    return {
        "Next Half-Birthday": half_bday.strftime("%A, %B %d, %Y"),
        "Days Remaining": f"{days_left} days away" if days_left > 0 else "Today is your Half-Birthday! 🎉",
        "Celebration Milestone": f"Exactly 6 months from your birthday on {bdate.strftime('%B %d')}",
        "Exact Date": half_bday.strftime("%Y-%m-%d"),
    }


def calc_age(data):
    dob_val = data.get("dob-date") or data.get("birthday-date") or data.get("birthdate") or data.get("dob")
    bdate = _parse_date(dob_val)
    if not bdate:
        return {"error": "Please provide a valid date of birth"}

    today = date.today()
    if bdate > today:
        return {"error": "Date of birth cannot be in the future"}

    delta = relativedelta(today, bdate)
    total_days = (today - bdate).days
    total_weeks = total_days // 7
    total_months = delta.years * 12 + delta.months
    total_hours = total_days * 24

    # Next birthday
    try:
        next_bday = date(today.year, bdate.month, bdate.day)
        if next_bday < today:
            next_bday = date(today.year + 1, bdate.month, bdate.day)
    except ValueError:
        next_bday = date(today.year if today < date(today.year, 2, 28) else today.year + 1, 2, 28)

    days_to_next = (next_bday - today).days

    return {
        "Age": f"{delta.years} years, {delta.months} months, {delta.days} days",
        "Total Months": f"{total_months:,} months",
        "Total Weeks": f"{total_weeks:,} weeks",
        "Total Days": f"{total_days:,} days",
        "Total Hours": f"{total_hours:,} hours",
        "Next Birthday": f"{next_bday.strftime('%A, %B %d, %Y')} ({days_to_next} days left)",
    }


def calc_age_difference(data):
    d1_val = data.get("date-older") or data.get("date1") or data.get("start-date")
    d2_val = data.get("date-newer") or data.get("date2") or data.get("end-date")
    d1 = _parse_date(d1_val)
    d2 = _parse_date(d2_val)
    if not d1 or not d2:
        return {"error": "Please provide both dates"}

    older, newer = (d1, d2) if d1 <= d2 else (d2, d1)
    diff = relativedelta(newer, older)
    total_days = (newer - older).days

    return {
        "Age Difference": f"{diff.years} years, {diff.months} months, {diff.days} days",
        "Total Days Difference": f"{total_days:,} days",
        "Total Weeks": f"{(total_days // 7):,} weeks, {total_days % 7} days",
        "Total Hours": f"{(total_days * 24):,} hours",
    }


def calc_date_difference(data):
    return calc_age_difference(data)


def calc_pregnancy_week(data):
    lmp_val = data.get("lmp-date") or data.get("start-date")
    calc_val = data.get("current-date") or date.today()
    lmp = _parse_date(lmp_val)
    calc_date = _parse_date(calc_val) or date.today()
    if not lmp:
        return {"error": "Please enter Last Menstrual Period (LMP) date"}

    edc = lmp + timedelta(days=280)  # Naegele's rule
    days_pregnant = (calc_date - lmp).days
    if days_pregnant < 0:
        return {"error": "LMP date cannot be in the future"}

    weeks = days_pregnant // 7
    days = days_pregnant % 7

    if weeks <= 13:
        trimester = "First Trimester (Weeks 1 - 13)"
    elif weeks <= 27:
        trimester = "Second Trimester (Weeks 14 - 27)"
    elif weeks <= 42:
        trimester = "Third Trimester (Weeks 28 - 40+)"
    else:
        trimester = "Post-term"

    days_left = (edc - calc_date).days

    return {
        "Estimated Due Date (EDC)": edc.strftime("%A, %B %d, %Y"),
        "Current Gestational Age": f"{weeks} weeks, {days} days",
        "Trimester": trimester,
        "Days Remaining to Due Date": f"{max(0, days_left)} days",
    }


def calc_anniversary_milestone(data):
    start_val = data.get("start-date") or data.get("event-date")
    sdate = _parse_date(start_val)
    if not sdate:
        return {"error": "Please provide a valid event or wedding date"}

    today = date.today()
    diff = relativedelta(today, sdate)
    total_days = (today - sdate).days

    # Next annual anniversary
    try:
        next_ann = date(today.year, sdate.month, sdate.day)
        if next_ann < today:
            next_ann = date(today.year + 1, sdate.month, sdate.day)
    except ValueError:
        next_ann = date(today.year + 1, 2, 28)

    days_to_ann = (next_ann - today).days

    return {
        "Time Elapsed": f"{diff.years} years, {diff.months} months, {diff.days} days",
        "Total Days Together": f"{total_days:,} days",
        "Next Anniversary": f"{next_ann.strftime('%A, %B %d, %Y')} ({days_to_ann} days away)",
        "Next Milestone (Years)": f"{diff.years + 1}th Anniversary",
    }


def calc_animal_age(data):
    age = float(data.get("input-age", 1))
    direction = str(data.get("conversion-type", "Dog Years → Human Years"))
    
    if "Dog" in direction and "Human" in direction:
        if direction.startswith("Dog"):
            # Dog -> Human
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
        else:
            # Human -> Dog
            if age <= 15:
                dog_age = age / 15
            elif age <= 24:
                dog_age = 1 + (age - 15) / 9
            else:
                dog_age = 2 + (age - 24) / 5
            return {
                "Equivalent Dog Age": f"{round(dog_age, 1)} dog years",
                "Input Human Age": f"{age} years",
                "Calculation Rule": "Standard canine biological aging curve",
            }

    return {"Calculated Age": f"{age * 7} equivalent years"}


def calc_day_of_week(data):
    d_val = data.get("input-date") or data.get("date") or data.get("date-input")
    d = _parse_date(d_val)
    if not d:
        return {"error": "Please select a valid date"}

    return {
        "Day of the Week": d.strftime("%A"),
        "Formatted Date": d.strftime("%B %d, %Y"),
        "Day of Year": f"Day {d.strftime('%j')} of {d.year}",
        "ISO Week Number": f"Week {d.isocalendar()[1]}",
        "Is Leap Year": "Yes" if (d.year % 4 == 0 and (d.year % 100 != 0 or d.year % 400 == 0)) else "No",
    }


def calc_lease_end(data):
    start_val = data.get("start-date") or data.get("date")
    months = int(data.get("lease-term-months") or data.get("months") or 12)
    sdate = _parse_date(start_val)
    if not sdate:
        return {"error": "Please enter lease start date"}

    end_date = sdate + relativedelta(months=months) - timedelta(days=1)
    return {
        "Lease End Date": end_date.strftime("%A, %B %d, %Y"),
        "Lease Duration": f"{months} months",
        "Start Date": sdate.strftime("%B %d, %Y"),
        "Exact Expiration Date": end_date.strftime("%Y-%m-%d"),
    }


def calc_retirement_date(data):
    curr_age = float(data.get("current-age", 30))
    ret_age = float(data.get("target-retirement-age", 65))
    calc_date_val = data.get("current-date") or date.today()
    cdate = _parse_date(calc_date_val) or date.today()

    years_left = max(0.0, ret_age - curr_age)
    ret_date = cdate + relativedelta(years=int(years_left), months=int((years_left % 1) * 12))

    return {
        "Target Retirement Date": ret_date.strftime("%B %Y"),
        "Years Remaining to Work": f"{years_left:.1f} years",
        "Target Retirement Age": f"{ret_age} years old",
        "Current Age": f"{curr_age} years old",
    }


# Register all Date & Time calculators with high-precision Python handlers
register_calculator(
    "half-birthday-calculator", "🎂 Half-Birthday Calculator", "date_time",
    "Calculate the exact date of your next half-birthday exactly 6 months from your birthday.",
    fields=[
        CalcField("birthday-date", "Birthday Date (Month and Day)", type="date"),
    ],
    fn=calc_half_birthday,
)

register_calculator(
    "age-calculator", "🎂 Age Calculator", "date_time",
    "Calculate exact age in years, months, weeks, days, and next birthday countdown.",
    fields=[
        CalcField("dob-date", "Date of Birth (DOB)", type="date"),
    ],
    fn=calc_age,
)

register_calculator(
    "chronological-age-calculator", "📅 Chronological Age Calculator", "date_time",
    "Calculate chronological age from birthdate with detailed time breakdown.",
    fields=[
        CalcField("dob-date", "Date of Birth (DOB)", type="date"),
    ],
    fn=calc_age,
)

register_calculator(
    "age-difference-calculator", "🧮 Age Difference Calculator", "date_time",
    "Calculate the exact difference in years, months, and days between two people or dates.",
    fields=[
        CalcField("date-older", "Date 1 (Older Person / Start Date)", type="date"),
        CalcField("date-newer", "Date 2 (Younger Person / End Date)", type="date"),
    ],
    fn=calc_age_difference,
)

register_calculator(
    "date-difference-calculator", "📆 Date Difference Calculator", "date_time",
    "Calculate exact days, weeks, and months between two dates.",
    fields=[
        CalcField("date-older", "Start Date", type="date"),
        CalcField("date-newer", "End Date", type="date"),
    ],
    fn=calc_date_difference,
)

register_calculator(
    "pregnancy-week-calculator", "🤰 Pregnancy Week & Due Date Calculator", "date_time",
    "Calculate estimated due date (EDC), current gestational age, and trimester.",
    fields=[
        CalcField("lmp-date", "Last Menstrual Period (LMP) Date", type="date"),
        CalcField("current-date", "Calculation Date", type="date"),
    ],
    fn=calc_pregnancy_week,
)

register_calculator(
    "anniversary-and-milestone-calculator", "💖 Anniversary & Milestone Calculator", "date_time",
    "Calculate relationship milestones, elapsed days, and upcoming anniversaries.",
    fields=[
        CalcField("start-date", "Date of Event (Wedding / Anniversary)", type="date"),
    ],
    fn=calc_anniversary_milestone,
)

register_calculator(
    "animal-age-calculator", "🐾 Animal Age Converter", "date_time",
    "Convert pet age between human years and animal years.",
    fields=[
        CalcField("input-age", "Age", type="number", default=2),
        CalcField("conversion-type", "Conversion Direction", type="select", options=[
            {"value": "Dog Years → Human Years", "label": "Dog Years → Human Years"},
            {"value": "Human Years → Dog Years", "label": "Human Years → Dog Years"}
        ], default="Dog Years → Human Years"),
    ],
    fn=calc_animal_age,
)

register_calculator(
    "day-of-the-week-calculator", "📆 Day of the Week Calculator", "date_time",
    "Find the exact day of the week for any past or future date.",
    fields=[
        CalcField("input-date", "Select Date", type="date"),
    ],
    fn=calc_day_of_week,
)

register_calculator(
    "lease-end-date-calculator", "🏢 Lease End Date Calculator", "date_time",
    "Calculate exact lease expiration date from start date and term.",
    fields=[
        CalcField("start-date", "Lease Start Date", type="date"),
        CalcField("lease-term-months", "Lease Term (Months)", type="number", default=12),
    ],
    fn=calc_lease_end,
)

register_calculator(
    "retirement-date-calculator", "🏖️ Retirement Date Calculator", "date_time",
    "Calculate target retirement date and years remaining to work.",
    fields=[
        CalcField("current-age", "Current Age", type="number", default=30),
        CalcField("target-retirement-age", "Target Retirement Age", type="number", default=65),
        CalcField("current-date", "Current Date", type="date"),
    ],
    fn=calc_retirement_date,
)
