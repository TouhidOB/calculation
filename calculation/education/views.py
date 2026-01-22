from django.shortcuts import render
from django.urls import reverse
from . import urls

# Create your views here.



def education_dashboard(request):
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
        "education/app_dashboard.html",
        {
            "app_title": "education Calculator Tools",
            "links": links,
        }
    )




def gpa_calculator(request):
    return render(request, 'education/gpa_calculator.html')


def final_grade_calculator(request):
    return render(request, 'education/final_grade_calculator.html')


def minimum_grade_required_calculator(request):
    return render(request, 'education/minimum_grade_required_calculator.html')


def high_school_gpa_calculator(request):
    return render(request, 'education/high_school_gpa_calculator.html')


def college_gpa_calculator(request):
    return render(request, 'education/college_gpa_calculator.html')


def student_loan_amortization_calculator(request):
    return render(request, 'education/student_loan_amortization_calculator.html')


def student_loan_refinance_savings_calculator(request):
    return render(request, 'education/student_loan_refinance_savings_calculator.html')


def college_savings_plan_calculator(request):
    return render(request, 'education/college_savings_plan_calculator.html')


def text_character_and_word_counter(request):
    return render(request, 'education/text_character_and_word_counter.html')


def text_reading_time_calculator(request):
    return render(request, 'education/text_reading_time_calculator.html')


def speech_and_presentation_length_calculator(request):
    return render(request, 'education/speech_and_presentation_length_calculator.html')


def words_per_minute_typing_speed_calculator(request):
    return render(request, 'education/words_per_minute_typing_speed_calculator.html')


def citation_generator(request):
    return render(request, 'education/citation_generator.html')


def plagiarism_checker_score_estimator(request):
    return render(request, 'education/plagiarism_checker_score_estimator.html')


def semester_workload_calculator(request):
    return render(request, 'education/semester_workload_calculator.html')


def weekly_study_time_planner_and_workload_organizer(request):
    return render(request, 'education/weekly_study_time_planner_and_workload_organizer.html')


def class_schedule_conflict_checker(request):
    return render(request, 'education/class_schedule_conflict_checker.html')


def textbook_cost_calculator(request):
    return render(request, 'education/textbook_cost_calculator.html')


def student_monthly_budget_calculator(request):
    return render(request, 'education/student_monthly_budget_calculator.html')


def dorm_room_size_usable_area_calculator(request):
    return render(request, 'education/dorm_room_size_usable_area_calculator.html')


def scholarship_finder_match_score_calculator(request):
    return render(request, 'education/scholarship_finder_match_score_calculator.html')


def act_to_sat_score_converter(request):
    return render(request, 'education/act_to_sat_score_converter.html')


def percentile_rank_calculator(request):
    return render(request, 'education/percentile_rank_calculator.html')


def course_load_difficulty_calculator(request):
    return render(request, 'education/course_load_difficulty_calculator.html')


def graduation_timeline_planner(request):
    return render(request, 'education/graduation_timeline_planner.html')


def student_loan_forgiveness_eligibility_calculator(request):
    return render(request, 'education/student_loan_forgiveness_eligibility_calculator.html')


def work_study_earnings_calculator(request):
    return render(request, 'education/work_study_earnings_calculator.html')


def internship_stipend_budget_calculator(request):
    return render(request, 'education/internship_stipend_budget_calculator.html')


def thesis_page_count_estimator(request):
    return render(request, 'education/thesis_page_count_estimator.html')


def paragraph_structure_planner(request):
    return render(request, 'education/paragraph_structure_planner.html')


def essay_outline_generator(request):
    return render(request, 'education/essay_outline_generator.html')


def memorization_time_estimator(request):
    return render(request, 'education/memorization_time_estimator.html')


def language_learning_fluency_timeline(request):
    return render(request, 'education/language_learning_fluency_timeline.html')


def project_deadline_calculator(request):
    return render(request, 'education/project_deadline_calculator.html')


def group_project_contribution_tracker(request):
    return render(request, 'education/group_project_contribution_tracker.html')


def presentation_slide_count_estimator(request):
    return render(request, 'education/presentation_slide_count_estimator.html')


def academic_probation_risk_calculator(request):
    return render(request, 'education/academic_probation_risk_calculator.html')


def major_change_impact_calculator(request):
    return render(request, 'education/major_change_impact_calculator.html')


def double_major_minor_time_calculator(request):
    return render(request, 'education/double_major_minor_time_calculator.html')


def study_abroad_cost_calculator(request):
    return render(request, 'education/study_abroad_cost_calculator.html')


def student_loan_debt_to_income_projector(request):
    return render(request, 'education/student_loan_debt_to_income_projector.html')


def teacher_gradebook_average_calculator(request):
    return render(request, 'education/teacher_gradebook_average_calculator.html')


def class_curve_grade_calculator(request):
    return render(request, 'education/class_curve_grade_calculator.html')


def rubric_score_calculator(request):
    return render(request, 'education/rubric_score_calculator.html')


def random_student_picker(request):
    return render(request, 'education/random_student_picker.html')


def semester_countdown_calculator(request):
    return render(request, 'education/semester_countdown_calculator.html')


def lecture_video_watch_time_calculator(request):
    return render(request, 'education/lecture_video_watch_time_calculator.html')


def online_course_progress_tracker(request):
    return render(request, 'education/online_course_progress_tracker.html')


def academic_paper_formatting_checker(request):
    return render(request, 'education/academic_paper_formatting_checker.html')


def lms_grade_calculator(request):
    return render(request, 'education/lms_grade_calculator.html')




