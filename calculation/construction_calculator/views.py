from django.shortcuts import render

# Create your views here.


from django.shortcuts import render
from django.urls import reverse
from . import urls  # IMPORT YOUR OWN URLS

def construction_home(request):
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
        "construction_calculator/app_dashboard.html",
        {
            "app_title": "Construction Calculator Tools",
            "links": links,
        }
    )




def area_calculator(request):
    return render(request, 'construction_calculator/area_calculator.html')


def volume_calculator(request):
    return render(request, 'construction_calculator/volume_calculator.html')


def concrete_slab_calculator(request):
    return render(request, 'construction_calculator/concrete_slab_calculator.html')


def mulch_and_soil_calculator(request):
    return render(request, 'construction_calculator/mulch_and_soil_calculator.html')


def paint_volume_calculator(request):
    return render(request, 'construction_calculator/paint_volume_calculator.html')


def drywall_sheet_calculator(request):
    return render(request, 'construction_calculator/drywall_sheet_calculator.html')


def flooring_tile_calculator(request):
    return render(request, 'construction_calculator/flooring_tile_calculator.html')


def exterior_siding_calculator(request):
    return render(request, 'construction_calculator/exterior_siding_calculator.html')


def roofing_shingle_calculator(request):
    return render(request, 'construction_calculator/roofing_shingle_calculator.html')


def insulation_calculator(request):
    return render(request, 'construction_calculator/insulation_calculator.html')


def decking_calculator(request):
    return render(request, 'construction_calculator/decking_calculator.html')


def fence_material_calculator(request):
    return render(request, 'construction_calculator/fence_material_calculator.html')


def stair_calculator(request):
    return render(request, 'construction_calculator/stair_calculator.html')


def rafter_length_calculator(request):
    return render(request, 'construction_calculator/rafter_length_calculator.html')


def brick_block_calculator(request):
    return render(request, 'construction_calculator/brick_block_calculator.html')


def rebar_material_calculator(request):
    return render(request, 'construction_calculator/rebar_material_calculator.html')


def gravel_aggregate_calculator(request):
    return render(request, 'construction_calculator/gravel_aggregate_calculator.html')


def topsoil_and_mulch_volume_calculator(request):
    return render(request, 'construction_calculator/topsoil_and_mulch_volume_calculator.html')


def slope_and_grade_percentage_calculator(request):
    return render(request, 'construction_calculator/slope_and_grade_percentage_calculator.html')


def roof_pitch_to_angle_converter(request):
    return render(request, 'construction_calculator/roof_pitch_to_angle_converter.html')


def board_foot_lumber_calculator(request):
    return render(request, 'construction_calculator/board_foot_lumber_calculator.html')


def concrete_mix_ratio_calculator(request):
    return render(request, 'construction_calculator/concrete_mix_ratio_calculator.html')


def asphalt_tonnage_calculator(request):
    return render(request, 'construction_calculator/asphalt_tonnage_calculator.html')


def post_hole_concrete_calculator(request):
    return render(request, 'construction_calculator/post_hole_concrete_calculator.html')


def wall_framing_stud_calculator(request):
    return render(request, 'construction_calculator/wall_framing_stud_calculator.html')


def tile_grout_calculator(request):
    return render(request, 'construction_calculator/tile_grout_calculator.html')


def rail_spindle_spacing_calculator(request):
    return render(request, 'construction_calculator/rail_spindle_spacing_calculator.html')


def paint_thinner_dilution_calculator(request):
    return render(request, 'construction_calculator/paint_thinner_dilution_calculator.html')


def waterproofing_coverage_calculator(request):
    return render(request, 'construction_calculator/waterproofing_coverage_calculator.html')


def stucco_volume_and_bag_calculator(request):
    return render(request, 'construction_calculator/stucco_volume_and_bag_calculator.html')


def french_drain_gravel_calculator(request):
    return render(request, 'construction_calculator/french_drain_gravel_calculator.html')


def gutter_downspout_capacity_calculator(request):
    return render(request, 'construction_calculator/gutter_downspout_capacity_calculator.html')


def shed_base_material_volume_calculator(request):
    return render(request, 'construction_calculator/shed_base_material_volume_calculator.html')


def circular_slab_volume_calculator(request):
    return render(request, 'construction_calculator/circular_slab_volume_calculator.html')


def retaining_wall_block_calculator(request):
    return render(request, 'construction_calculator/retaining_wall_block_calculator.html')


def paver_sand_and_gravel_base_calculator(request):
    return render(request, 'construction_calculator/paver_sand_and_gravel_base_calculator.html')


def bevel_angle_calculator(request):
    return render(request, 'construction_calculator/bevel_angle_calculator.html')


def concrete_delivery_time_calculator(request):
    return render(request, 'construction_calculator/concrete_delivery_time_calculator.html')


def dumpster_size_calculator(request):
    return render(request, 'construction_calculator/dumpster_size_calculator.html')


def construction_loan_draw_calculator(request):
    return render(request, 'construction_calculator/construction_loan_draw_calculator.html')


def labor_cost_estimator(request):
    return render(request, 'construction_calculator/labor_cost_estimator.html')


def material_waste_percentage_calculator(request):
    return render(request, 'construction_calculator/material_waste_percentage_calculator.html')


def project_timeline_calculator(request):
    return render(request, 'construction_calculator/project_timeline_calculator.html')


def air_conditioner_calculator(request):
    return render(request, 'construction_calculator/air_conditioner_calculator.html')


def furnace_size_calculator(request):
    return render(request, 'construction_calculator/furnace_size_calculator.html')


def electrical_wire_size_calculator(request):
    return render(request, 'construction_calculator/electrical_wire_size_calculator.html')


def electrical_voltage_drop_calculator(request):
    return render(request, 'construction_calculator/electrical_voltage_drop_calculator.html')


def lighting_lumens_calculator(request):
    return render(request, 'construction_calculator/lighting_lumens_calculator.html')


def plumbing_vent_pipe_size_calculator(request):
    return render(request, 'construction_calculator/plumbing_vent_pipe_size_calculator.html')


def water_heater_size_calculator(request):
    return render(request, 'construction_calculator/water_heater_size_calculator.html')


def solar_panel_system_size_calculator(request):
    return render(request, 'construction_calculator/solar_panel_system_size_calculator.html')


