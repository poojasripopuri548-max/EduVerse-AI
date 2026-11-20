
from ai.common.llm_client import generate_response


def analyze_skill_gap(current_skills, target_role):

    prompt = f"""
    You are an expert AI career mentor.

    Student's current skills: {current_skills}
    Student's target career: {target_role}

    Analyze the student's skill gaps.

    Include:
    1. Skills the student already has.
    2. Important missing skills.
    3. Skills to prioritize.
    4. Recommended projects.
    5. A practical 30-day learning plan.

    Keep the explanation beginner-friendly and structured.
    Do not assume the student has skills that were not provided.
    """

    return generate_response(prompt)


if __name__ == "__main__":

    print("=" * 50)
    print("       EDUVERSE AI SKILL GAP ANALYZER")
    print("=" * 50)

    skills = input("\nEnter your current skills: ")
    career = input("Enter your target career: ")

    print("\nAnalyzing your skill gaps...\n")

    result = analyze_skill_gap(skills, career)

    print("\nEDUVERSE AI ANALYSIS")
    print("=" * 50)
    print(result)
