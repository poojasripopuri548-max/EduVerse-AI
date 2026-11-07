
from ai.common.llm_client import generate_response


def generate_roadmap(career, current_skills, hours_per_day, duration):

    prompt = f"""
    You are EduVerse AI, an expert personalized learning mentor.

    Create a practical learning roadmap for a student.

    Target career: {career}
    Current skills: {current_skills}
    Available study time: {hours_per_day} hours per day
    Learning duration: {duration}

    Generate the roadmap with these sections:

    1. Student profile
    2. Learning goals
    3. Week-by-week learning plan
    4. Topics to study in each week
    5. Hands-on projects
    6. Recommended tools and technologies
    7. Weekly assessments
    8. Final portfolio project
    9. Expected learning outcomes

    Make the roadmap realistic and beginner-friendly.
    Consider the student's existing skills.
    Avoid repeating topics the student already knows unnecessarily.
    """

    return generate_response(prompt)


if __name__ == "__main__":

    print("=" * 55)
    print("       EDUVERSE AI PERSONALIZED ROADMAP")
    print("=" * 55)

    career = input("\nEnter your target career: ")
    skills = input("Enter your current skills: ")
    hours = input("Available study hours per day: ")
    duration = input("Learning duration (e.g. 8 weeks): ")

    print("\nGenerating your personalized roadmap...\n")

    roadmap = generate_roadmap(career, skills, hours, duration)

    print("\nYOUR PERSONALIZED LEARNING ROADMAP")
    print("=" * 55)
    print(roadmap)
