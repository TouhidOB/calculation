from django.shortcuts import render

def cino_long_1(request):    
    context = {}
    
    calculated_results = None

    if request.method == 'POST':
        try:
            shrinkage_length_percent = (float(request.POST.get('shrinkage_length', 1)) + 1) / 100
            shrinkage_width_percent = (float(request.POST.get('shrinkage_width', 1)) + 1) / 100
            fabric_width = float(request.POST.get('fabric_width', 1))

            # --- Garments Size ---
            waist_relaxed = float(request.POST.get('waist_relaxed', 1))
            waistband_height = float(request.POST.get('waistband_height', 1))
            hip_measurement = float(request.POST.get('hip_measurement', 1))
            thigh_crotch_level = float(request.POST.get('thigh_crotch_level', 1))
            knee_width = float(request.POST.get('knee_width', 1))
            leg_opening_hem = float(request.POST.get('leg_opening_hem', 1))
            inseam = float(request.POST.get('inseam', 1))
            front_rise_excl_wb = float(request.POST.get('front_rise_excl_wb', 1))
            back_rise_excl_wb = float(request.POST.get('back_rise_excl_wb', 1))
            hem_height = float(request.POST.get('hem_height', 1))
            back_pocket_top_width = float(request.POST.get('back_pocket_top_width', 1))
            back_pocket_height_center = float(request.POST.get('back_pocket_height_center', 1))
            
            # --- 2. Perform Consumption Calculation ---
            
            # width calculation
            hip_width = hip_measurement / 2
            thigh_hip_width = (thigh_crotch_level - hip_width) / 2
            front_thigh_width = (hip_width + thigh_hip_width) - 1.2
            front_knee_width = knee_width - 2.5
            net_front_pattern_width_inch = ((front_thigh_width / 2.54) + 1) + ((front_knee_width / 2.54) + 1)
            net_front_pattern_in_inch_with_shirnkage = (net_front_pattern_width_inch * shrinkage_width_percent) + net_front_pattern_width_inch

            print("hip_width", hip_width)
            print("thigh_hip_width", thigh_hip_width)
            print("front_thigh_width", front_thigh_width)
            print("front_knee_width", front_knee_width)
            print("net_front_pattern_width_inch", net_front_pattern_width_inch)
            print("net_front_pattern_in_inch_with_shirnkage", net_front_pattern_in_inch_with_shirnkage)
            

            # width calculation for back 
            back_thigh_width = front_thigh_width + (thigh_hip_width * 2) + 2.4
            back_knee_width = front_knee_width + 5
            net_back_pattern_inch = ((back_thigh_width / 2.54) + 1) + ((back_knee_width / 2.54) + 1)
            net_back_pattern_shrinkage = (net_back_pattern_inch * shrinkage_width_percent) + net_back_pattern_inch


            print("back_thigh_width", back_thigh_width)
            print("back_knee_width", back_knee_width)
            print("net_back_pattern_inch", net_back_pattern_inch)
            print("net_back_pattern_shrinkage", net_back_pattern_shrinkage)


            # length calculation for front
            front_rise_inseam_length = inseam + front_rise_excl_wb
            front_side_seam_length = front_rise_inseam_length - 1
            total_with_hem_length = front_side_seam_length + hem_height
            net_front_pattern_length = (total_with_hem_length / 2.54) + 1
            net_front_pattern_length_shrinkage = (net_front_pattern_length * shrinkage_length_percent) + net_front_pattern_length

            print("front_rise_inseam_length", front_rise_inseam_length)
            print("front_side_seam_length", front_side_seam_length)
            print("total_with_hem_length", total_with_hem_length)
            print("net_front_pattern_length", net_front_pattern_length)
            print("net_front_pattern_length_shrinkage", net_front_pattern_length_shrinkage)
                         
            
            
            
            # length calculation for back
            total_back_length = front_rise_inseam_length + 3
            total_back_with_hem_length = total_back_length + hem_height
            net_back_pattern_length = (total_back_with_hem_length / 2.54) + 1
            net_front_pattern_with_shrinkage = (net_back_pattern_length * shrinkage_length_percent) + net_back_pattern_length

            print("total_back_length", total_back_length)
            print("total_back_with_hem_length", total_back_with_hem_length)
            print("net_back_pattern_length", net_back_pattern_length)
            print("net_front_pattern_with_shrinkage", net_front_pattern_with_shrinkage)




            # Consumption calculation 
            front_consumption = ((net_front_pattern_length_shrinkage * net_front_pattern_in_inch_with_shirnkage) / 36) / fabric_width
            back_consumption = ((net_back_pattern_shrinkage * net_front_pattern_with_shrinkage) / 36) / fabric_width
            total_body_consumption = front_consumption + back_consumption
            round_waistband = (((((waist_relaxed / 2.54) * 2) + 4.75) * ((waistband_height / 2.54) + 1) / 36) * 2) / fabric_width
            back_welt = 0.035 / fabric_width * 56
            pocket_seam = 0.055
            belt_loop = 0.01
            zipper_fly = 0.01
            total_cutting_consumtion = total_body_consumption + round_waistband + back_welt + pocket_seam + belt_loop + zipper_fly
            net_consumption = (total_cutting_consumtion * 0.02) + total_cutting_consumtion



            print("front_consumption", front_consumption)
            print("back_consumption", back_consumption)
            print("total_body_consumption", total_body_consumption)
            print("round_waistband", round_waistband)
            print("back_welt", back_welt)
            print("pocket_seam", pocket_seam)
            print("belt_loop", belt_loop)
            print("zipper_fly", zipper_fly)
            print("total_cutting_consumtion", total_cutting_consumtion)
            print("net_consumption", net_consumption)


            # Effiency Calculation
            block_box = back_thigh_width * 2
            actual_height_back = back_thigh_width + back_knee_width
            efficiency_loss = (((actual_height_back / block_box) * 100) - 100) / 2
            block_box_2 = front_thigh_width * 2
            actual_height_back_2 = front_thigh_width + front_knee_width
            efficiency_loss_2 = (((actual_height_back_2 / block_box_2) * 100) - 100) / 2


            Efficiency = efficiency_loss - efficiency_loss_2
            consumption = (abs(Efficiency) + 0.02) * 100


            print("block_box", block_box)
            print("actual_height_back", actual_height_back)
            print("efficiency_loss", efficiency_loss)
            print("block_box_2", block_box_2)
            print("actual_height_back_2", actual_height_back_2)
            print("efficiency_loss_2", efficiency_loss_2)
            print("Efficiency", Efficiency)
            print("consumption", consumption)







            # --- 3. Prepare Calculated Results ---
            calculated_results = {
                'consumption_length_meters': round(consumption, 2),
                'consumption_length_cm': round(Efficiency, 2),
                'shrink_factor': round(Efficiency, 4),
                'notes': "This calculation is a simplified length-based estimate (meters of fabric per piece)."
            }

        except ValueError:
            context['error_message'] = "Invalid input detected. Please ensure all fields contain numbers."

        context['calculated_results'] = calculated_results
        

        context['form_data'] = request.POST
        return render(request, 'garments_calculations/cino_long_1.html', context)

    return render(request, 'garments_calculations/cino_long_1.html', context)