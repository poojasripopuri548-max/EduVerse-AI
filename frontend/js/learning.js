
// ========================================
// EDUVERSE AI - LEARNING COMPANION
// Interactive Demo Chatbot
// ========================================

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");
const clearChat = document.getElementById("clearChat");


// 1. ADD MESSAGE TO CHAT

function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className = sender === "user"
        ? "message user-message"
        : "message assistant-message";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = sender === "user" ? "S" : "✦";

    const content = document.createElement("div");
    content.className = "message-content";

    const name = document.createElement("strong");
    name.textContent = sender === "user" ? "You" : "EduVerse AI";

    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    content.appendChild(name);
    content.appendChild(paragraph);

    message.appendChild(avatar);
    message.appendChild(content);

    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// 2. GENERATE DEMO AI RESPONSES

function generateResponse(question) {

    const text = question.toLowerCase();

    if (text.includes("machine learning") || text.includes("ml")) {

        return `Machine Learning is a branch of Artificial Intelligence.

It allows computers to learn patterns from data without being explicitly programmed for every task.

Three main types:
1. Supervised Learning
2. Unsupervised Learning
3. Reinforcement Learning

Example: Predicting house prices using previous housing data.`;

    }

    else if (text.includes("python") || text.includes("oop")) {

        return `Python OOP means Object-Oriented Programming.

It organizes code using classes and objects.

Four important concepts:
1. Encapsulation
2. Inheritance
3. Polymorphism
4. Abstraction

Example:
class Student:
    def display(self):
        print("Hello Student")

student = Student()
student.display()`;

    }

    else if (text.includes("neural network") || text.includes("deep learning")) {

        return `A Neural Network is a computing model inspired by the human brain.

It contains three main layers:

1. Input Layer - Receives data.
2. Hidden Layer - Learns patterns.
3. Output Layer - Produces predictions.

Example: Recognizing handwritten digits using image data.`;

    }

    else if (text.includes("study plan") || text.includes("roadmap")) {

        return `Here is a beginner-friendly AI study roadmap:

1. Learn Python fundamentals.
2. Study Mathematics and Statistics.
3. Understand Machine Learning.
4. Practice with real datasets.
5. Learn Deep Learning.
6. Build AI projects.
7. Create a portfolio.

Consistency is more important than studying everything in one day!`;

    }

    else if (text.includes("hello") || text.includes("hi")) {

        return "Hello! Welcome to EduVerse AI. What topic would you like to explore today?";

    }

    else if (text.includes("data structure")) {

        return `Data Structures organize and store data efficiently.

Common types:
1. Arrays
2. Linked Lists
3. Stacks
4. Queues
5. Trees
6. Graphs

They help solve programming problems efficiently.`;

    }

    else if (text.includes("python") || text.includes("java") || text.includes("programming")) {

        return "Programming is the process of writing instructions for computers. Start with variables, data types, conditional statements, loops and functions. Then practice small projects!";

    }

    else {

        return `That's an interesting question!

I'm currently running in demo mode, so I have a limited set of prepared educational responses.

Try asking me about:
• Machine Learning
• Python OOP
• Neural Networks
• Data Structures
• AI Study Plans

Real AI-powered answers will be connected through our AI module later.`;

    }

}


// 3. HANDLE USER MESSAGE

function sendMessage(question) {

    const cleanQuestion = question.trim();

    if (!cleanQuestion) return;

    addMessage(cleanQuestion, "user");

    userInput.value = "";

    // Demo response
    const response = generateResponse(cleanQuestion);

    setTimeout(() => {
        addMessage(response, "assistant");
    }, 500);

}


// 4. SEND BUTTON FUNCTIONALITY

chatForm.addEventListener("submit", function(event) {

    event.preventDefault();

    sendMessage(userInput.value);

});


// 5. SUGGESTED QUESTIONS

const suggestionButtons =
    document.querySelectorAll(".suggestion-btn");

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

console.log("EduVerse AI Learning Companion loaded successfully!");
