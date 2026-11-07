
from ai.common.llm_client import generate_response
from ai.skill_analyzer.quiz_generator import generate_quiz
from ai.skill_analyzer.skill_gap_analyzer import analyze_skill_gap
from ai.roadmap_generator.roadmap import generate_roadmap
from ai.code_reviewer.reviewer import review_code


def learning_companion(question, history=None):
    return generate_response(question, history)


def create_quiz(topic, number_of_questions=5):
    return generate_quiz(topic, number_of_questions)


def get_skill_gap(current_skills, target_role):
    return analyze_skill_gap(current_skills, target_role)


def get_learning_roadmap(career, skills, hours_per_day, duration):
    return generate_roadmap(career, skills, hours_per_day, duration)


def get_code_review(code, language):
    return review_code(code, language)
