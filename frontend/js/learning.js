// ========================================
// EDUVERSE AI - LEARNING COMPANION
// Connected to Django Backend + Fallback
// ========================================

const API_BASE_URL = "http://127.0.0.1:8000/api";

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");
const clearChat = document.getElementById("clearChat");

// 1. ADD MESSAGE TO CHAT
function addMessage(text, sender, isPending = false) {
    const message = document.createElement("div");
    message.className = sender === "user"
        ? "message user-message"
        : "message assistant-message";

    if (isPending) {
        message.id = "pendingAssistantMessage";
    }

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = sender === "user" ? "S" : "✦";

    const content = document.createElement("div");
    content.className = "message-content";

    const name = document.createElement("strong");
    name.textContent = sender === "user" ? "You" : "EduVerse AI";

    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    paragraph.style.whiteSpace = "pre-line";

    content.appendChild(name);
    content.appendChild(paragraph);

    message.appendChild(avatar);
    message.appendChild(content);

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return message;
}

// 2. GENERATE DEMO / OFFLINE RESPONSES
function generateFallbackResponse(question) {
    const text = question.toLowerCase();

    if (text.includes("machine learning") || text.includes("ml")) {
        return `Machine Learning is a branch of Artificial Intelligence.\n\nIt allows computers to learn patterns from data without being explicitly programmed for every task.\n\nThree main types:\n1. Supervised Learning\n2. Unsupervised Learning\n3. Reinforcement Learning\n\nExample: Predicting house prices using previous housing data.`;
    } else if (text.includes("python") || text.includes("oop")) {
        return `Python OOP means Object-Oriented Programming.\n\nIt organizes code using classes and objects.\n\nFour important concepts:\n1. Encapsulation\n2. Inheritance\n3. Polymorphism\n4. Abstraction\n\nExample:\nclass Student:\n    def display(self):\n        print("Hello Student")\n\nstudent = Student()\nstudent.display()`;
    } else if (text.includes("neural network") || text.includes("deep learning")) {
        return `A Neural Network is a computing model inspired by the human brain.\n\nIt contains three main layers:\n1. Input Layer - Receives data.\n2. Hidden Layer - Learns patterns.\n3. Output Layer - Produces predictions.\n\nExample: Recognizing handwritten digits using image data.`;
    } else if (text.includes("study plan") || text.includes("roadmap")) {
        return `Here is a beginner-friendly AI study roadmap:\n\n1. Learn Python fundamentals.\n2. Study Mathematics and Statistics.\n3. Understand Machine Learning.\n4. Practice with real datasets.\n5. Learn Deep Learning.\n6. Build AI projects.\n7. Create a portfolio.\n\nConsistency is more important than studying everything in one day!`;
    } else if (text.includes("hello") || text.includes("hi")) {
        return "Hello! Welcome to EduVerse AI. What topic would you like to explore today?";
    } else if (text.includes("data structure")) {
        return `Data Structures organize and store data efficiently.\n\nCommon types:\n1. Arrays\n2. Linked Lists\n3. Stacks\n4. Queues\n5. Trees\n6. Graphs\n\nThey help solve programming problems efficiently.`;
    } else {
        return `EduVerse AI Learning Companion:\n\nThank you for asking about "${question}".\n\nTo master this concept, break it into fundamentals, study key principles, practice with exercises, and build small projects!`;
    }
}

// 3. HANDLE USER MESSAGE (BACKEND API INTEGRATION)
async function sendMessage(question) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    addMessage(cleanQuestion, "user");
    userInput.value = "";

    const pendingMsg = addMessage("Thinking...", "assistant", true);

    const token = localStorage.getItem("eduverse_token");
    const headers = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/learning/chat/`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ question: cleanQuestion })
        });

        if (response.ok) {
            const data = await response.json();
            pendingMsg.remove();
            addMessage(data.answer, "assistant");
            return;
        }
    } catch (error) {
        console.warn("Backend API offline or unreachable, switching to fallback response.", error);
    }

    // Fallback if backend was not reachable
    pendingMsg.remove();
    const fallbackAnswer = generateFallbackResponse(cleanQuestion);
    addMessage(fallbackAnswer, "assistant");
}

// 4. SEND BUTTON FUNCTIONALITY
chatForm.addEventListener("submit", function(event) {
    event.preventDefault();
    sendMessage(userInput.value);
});

// 5. SUGGESTED QUESTIONS
const suggestionButtons = document.querySelectorAll(".suggestion-btn");
suggestionButtons.forEach(button => {
    button.addEventListener("click", function() {
        const question = this.dataset.question;
        sendMessage(question);
    });
});

// 6. CLEAR CHAT FUNCTIONALITY
clearChat.addEventListener("click", function() {
    chatMessages.innerHTML = "";
    addMessage(
        "Hello! I'm your Learning Companion. Ask me anything about your studies. Let's learn together!",
        "assistant"
    );
});

// 7. INITIALIZATION
console.log("EduVerse AI Learning Companion connected to backend API.");
