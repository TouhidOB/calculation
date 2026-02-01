from django.shortcuts import render
from . import urls
from django.urls import reverse


# Create your views here.

def event_dashboard(request):
    links = []

    for pattern in urls.urlpatterns:
        # skip dashboard itself
        if pattern.name and pattern.name != "dashboard":
            links.append({
                "title": pattern.name.replace("_", " ").title(),
                "url": reverse(pattern.name),
            })

    return render(
        request,
        "event_budget_calculator/app_dashboard.html",
        {
            "app_title": "Event Budget Calculator Tools",
            "links": links,
        }
    )



def event_budget_calculator(request):
    return render(request, 'event_budget_calculator/event_budget_calculator.html')

def venue_capacity_calculator(request):
    return render(request, 'event_budget_calculator/venue_capacity_calculator.html')

def guest_list_cost_per_person_calculator(request):
    return render(request, 'event_budget_calculator/guest_list_cost_per_person_calculator.html')

def catering_cost_calculator(request):
    return render(request, 'event_budget_calculator/catering_cost_calculator.html')

def event_seating_chart_planner(request):
    return render(request, 'event_budget_calculator/event_seating_chart_planner.html')

def event_timeline_run_sheet_generator(request):
    return render(request, 'event_budget_calculator/event_timeline_run_sheet_generator.html')

def audio_visual_equipment_calculator(request):
    return render(request, 'event_budget_calculator/audio_visual_equipment_calculator.html')

def event_lighting_requirements_calculator(request):
    return render(request, 'event_budget_calculator/event_lighting_requirements_calculator.html')

def wedding_budget_calculator(request):
    return render(request, 'event_budget_calculator/wedding_budget_calculator.html')

def conference_budget_calculator(request):
    return render(request, 'event_budget_calculator/conference_budget_calculator.html')

def party_budget_calculator(request):
    return render(request, 'event_budget_calculator/party_budget_calculator.html')

def event_staffing_calculator(request):
    return render(request, 'event_budget_calculator/event_staffing_calculator.html')

def event_insurance_cost_calculator(request):
    return render(request, 'event_budget_calculator/event_insurance_cost_calculator.html')

def event_permit_license_cost_calculator(request):
    return render(request, 'event_budget_calculator/event_permit_license_cost_calculator.html')

def event_roi_calculator(request):
    return render(request, 'event_budget_calculator/event_roi_calculator.html')

def ticket_price_break_even_calculator(request):
    return render(request, 'event_budget_calculator/ticket_price_break_even_calculator.html')

def event_registration_fee_tax_calculator(request):
    return render(request, 'event_budget_calculator/event_registration_fee_tax_calculator.html')

def event_sponsorship_value_calculator(request):
    return render(request, 'event_budget_calculator/event_sponsorship_value_calculator.html')

def event_marketing_cost_calculator(request):
    return render(request, 'event_budget_calculator/event_marketing_cost_calculator.html')

def event_decor_florist_cost_calculator(request):
    return render(request, 'event_budget_calculator/event_decor_florist_cost_calculator.html')

def event_transportation_parking_calculator(request):
    return render(request, 'event_budget_calculator/event_transportation_parking_calculator.html')

def event_power_generator_requirements_calculator(request):
    return render(request, 'event_budget_calculator/event_power_generator_requirements_calculator.html')

def event_wi_fi_bandwidth_calculator(request):
    return render(request, 'event_budget_calculator/event_wi_fi_bandwidth_calculator.html')

def event_waste_management_bin_calculator(request):
    return render(request, 'event_budget_calculator/event_waste_management_bin_calculator.html')

def event_security_staff_risk_calculator(request):
    return render(request, 'event_budget_calculator/event_security_staff_risk_calculator.html')

def event_photography_videography_calculator(request):
    return render(request, 'event_budget_calculator/event_photography_videography_calculator.html')

def event_stage_backdrop_size_calculator(request):
    return render(request, 'event_budget_calculator/event_stage_backdrop_size_calculator.html')

def event_sound_system_pa_coverage_calculator(request):
    return render(request, 'event_budget_calculator/event_sound_system_pa_coverage_calculator.html')

def event_tent_size_capacity_calculator(request):
    return render(request, 'event_budget_calculator/event_tent_size_capacity_calculator.html')

def event_table_chair_rental_calculator(request):
    return render(request, 'event_budget_calculator/event_table_chair_rental_calculator.html')

def event_menu_planning_food_quantity_calculator(request):
    return render(request, 'event_budget_calculator/event_menu_planning_food_quantity_calculator.html')

def event_beverage_alcohol_calculator(request):
    return render(request, 'event_budget_calculator/event_beverage_alcohol_calculator.html')

def event_cake_serving_tier_calculator(request):
    return render(request, 'event_budget_calculator/event_cake_serving_tier_calculator.html')

def event_invitation_stationery_cost_calculator(request):
    return render(request, 'event_budget_calculator/event_invitation_stationery_cost_calculator.html')

def event_gift_bag_welcome_kit_calculator(request):
    return render(request, 'event_budget_calculator/event_gift_bag_welcome_kit_calculator.html')

def event_speaker_fee_budget_calculator(request):
    return render(request, 'event_budget_calculator/event_speaker_fee_budget_calculator.html')

def event_travel_accommodation_calculator(request):
    return render(request, 'event_budget_calculator/event_travel_accommodation_calculator.html')

def event_networking_social_time_calculator(request):
    return render(request, 'event_budget_calculator/event_networking_social_time_calculator.html')

def event_breakout_session_scheduler_capacity_calculator(request):
    return render(request, 'event_budget_calculator/event_breakout_session_scheduler_capacity_calculator.html')