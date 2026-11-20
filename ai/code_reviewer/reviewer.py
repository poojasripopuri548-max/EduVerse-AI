
from ai.common.llm_client import generate_response


def review_code(code, language):

    prompt = f"""
    You are EduVerse AI, an expert programming code reviewer.

    Review this {language} code:

    {code}

    Provide:
    1. Code quality
    2. Syntax errors
    3. Logical errors
    4. Bugs
    5. Time and space complexity
    6. Security concerns
    7. Improved code
    8. Explanation of improvements

    Explain everything in beginner-friendly language.
    Do not claim that code was executed or tested.
    """

    return generate_response(prompt)


if __name__ == "__main__":

    print("=" * 50)
    print("       EDUVERSE AI CODE REVIEWER")
    print("=" * 50)

    language = input("\nEnter programming language: ")

    print("\nPaste your code below.")
    print("Type END on a new line when finished.")

    code_lines = []

    while True:
        line = input()

        if line.strip() == "END":
            break

        code_lines.append(line)

    code = "\n".join(code_lines)

    print("\nReviewing your code...\n")

    result = review_code(code, language)

    print("\nCODE REVIEW REPORT")
    print("=" * 50)
    print(result)
