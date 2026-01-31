from django.shortcuts import render

# Create your views here.
from django.urls import reverse
from . import urls

# Create your views here.



def conversion_dashboard(request):
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
        "conversion_calculator/app_dashboard.html",
        {
            "app_title": "Conversion Calculator Tools",
            "links": links,
        }
    )




def length_converter(request):
    return render(request, 'conversion_calculator/length_converter.html')


def weight_mass_converter(request):
    return render(request, 'conversion_calculator/weight_mass_converter.html')


def volume_converter(request):
    return render(request, 'conversion_calculator/volume_converter.html')


def area_converter(request):
    return render(request, 'conversion_calculator/area_converter.html')


def temperature_converter(request):
    return render(request, 'conversion_calculator/temperature_converter.html')


def speed_converter(request):
    return render(request, 'conversion_calculator/speed_converter.html')


def pressure_converter(request):
    return render(request, 'conversion_calculator/pressure_converter.html')


def energy_converter(request):
    return render(request, 'conversion_calculator/energy_converter.html')


def power_converter(request):
    return render(request, 'conversion_calculator/power_converter.html')


def data_storage_converter(request):
    return render(request, 'conversion_calculator/data_storage_converter.html')


def time_zone_converter(request):
    return render(request, 'conversion_calculator/time_zone_converter.html')


def cooking_measurement_converter(request):
    return render(request, 'conversion_calculator/cooking_measurement_converter.html')


def shoe_size_converter(request):
    return render(request, 'conversion_calculator/shoe_size_converter.html')


def clothing_size_converter(request):
    return render(request, 'conversion_calculator/clothing_size_converter.html')


def angle_converter(request):
    return render(request, 'conversion_calculator/angle_converter.html')


def fuel_consumption_converter(request):
    return render(request, 'conversion_calculator/fuel_consumption_converter.html')


def digital_image_resolution_converter(request):
    return render(request, 'conversion_calculator/digital_image_resolution_converter.html')


def lumber_board_foot_calculator(request):
    return render(request, 'conversion_calculator/lumber_board_foot_calculator.html')


def ring_size_converter(request):
    return render(request, 'conversion_calculator/ring_size_converter.html')


def number_system_converter(request):
    return render(request, 'conversion_calculator/number_system_converter.html')


def roman_numeral_converter(request):
    return render(request, 'conversion_calculator/roman_numeral_converter.html')


def morse_code_converter(request):
    return render(request, 'conversion_calculator/morse_code_converter.html')


def braille_converter(request):
    return render(request, 'conversion_calculator/braille_converter.html')


def password_generator_calculator(request):
    return render(request, 'conversion_calculator/password_generator_calculator.html')


def cryptographic_hash_generator(request):
    return render(request, 'conversion_calculator/cryptographic_hash_generator.html')


def color_code_converter(request):
    return render(request, 'conversion_calculator/color_code_converter.html')


def electric_charge_converter(request):
    return render(request, 'conversion_calculator/electric_charge_converter.html')


def radiation_dose_converter(request):
    return render(request, 'conversion_calculator/radiation_dose_converter.html')


def viscosity_converter(request):
    return render(request, 'conversion_calculator/viscosity_converter.html')


def flow_rate_converter(request):
    return render(request, 'conversion_calculator/flow_rate_converter.html')


def torque_converter(request):
    return render(request, 'conversion_calculator/torque_converter.html')


def density_converter(request):
    return render(request, 'conversion_calculator/density_converter.html')


def surface_tension_converter(request):
    return render(request, 'conversion_calculator/surface_tension_converter.html')


def catalytic_activity_converter(request):
    return render(request, 'conversion_calculator/catalytic_activity_converter.html')


def luminous_intensity_converter(request):
    return render(request, 'conversion_calculator/luminous_intensity_converter.html')


def radioactivity_converter(request):
    return render(request, 'conversion_calculator/radioactivity_converter.html')


def acceleration_converter(request):
    return render(request, 'conversion_calculator/acceleration_converter.html')


def force_converter(request):
    return render(request, 'conversion_calculator/force_converter.html')


def moment_of_inertia_converter(request):
    return render(request, 'conversion_calculator/moment_of_inertia_converter.html')


def metric_prefix_converter(request):
    return render(request, 'conversion_calculator/metric_prefix_converter.html')


def typography_unit_converter(request):
    return render(request, 'conversion_calculator/typography_unit_converter.html')


def audio_conversion_calculator(request):
    return render(request, 'conversion_calculator/audio_conversion_calculator.html')


def video_file_size_calculator(request):
    return render(request, 'conversion_calculator/video_file_size_calculator.html')


def screen_aspect_ratio_calculator(request):
    return render(request, 'conversion_calculator/screen_aspect_ratio_calculator.html')


def map_scale_calculator(request):
    return render(request, 'conversion_calculator/map_scale_calculator.html')


def earthquake_magnitude_scale_calculator(request):
    return render(request, 'conversion_calculator/earthquake_magnitude_scale_calculator.html')


def hurricane_speed_calculator(request):
    return render(request, 'conversion_calculator/hurricane_speed_calculator.html')


def ph_to_hydrogen_ion_concentration_converter(request):
    return render(request, 'conversion_calculator/ph_to_hydrogen_ion_concentration_converter.html')


def blood_sugar_unit_converter(request):
    return render(request, 'conversion_calculator/blood_sugar_unit_converter.html')
