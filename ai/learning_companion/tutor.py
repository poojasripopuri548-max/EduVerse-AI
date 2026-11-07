from ai.common.llm_client import generate_response

print("=" * 50)
print("       EDUVERSE AI LEARNING COMPANION")
print("=" * 50)
print("Chat with EduVerse AI! Type 'exit' to stop.")

conversation_history = []

while True:

    question = input("\nYou: ")

    if question.lower() in ["exit", "quit", "bye"]:
        print("EduVerse AI: Happy learning! Goodbye!")
        break

    try:
        answer = generate_response(question, conversation_history)

        print("\nEduVerse AI:", answer)

        conversation_history.append({
            "role": "user",
            "content": question
        })

        conversation_history.append({
            "role": "assistant",
            "content": answer
        })

    except Exception as error:
        print("\nError:", error)