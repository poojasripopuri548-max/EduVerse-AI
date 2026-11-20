const codeInput = document.getElementById("codeInput");
const languageSelect = document.getElementById("language");
const reviewBtn = document.getElementById("reviewBtn");
const clearBtn = document.getElementById("clearBtn");
const resultMessage = document.getElementById("resultMessage");
const reviewResults = document.getElementById("reviewResults");

// Review Code Button
reviewBtn.addEventListener("click", function () {
    const code = codeInput.value.trim();
    const language = languageSelect.value;

    reviewResults.replaceChildren();

    if (code === "") {
        resultMessage.textContent = "Please enter some code before reviewing.";
        return;
    }

    resultMessage.textContent = "Basic demo analysis completed.";

    const issues = analyzeCode(code, language);

    if (issues.length === 0) {
        addResult(
            "No basic issues detected",
            "The simple checks did not identify any obvious problems. This does not guarantee that the code is correct."
        );
    } else {
        issues.forEach(function (issue) {
            addResult(issue.title, issue.description);
        });
    }
});

// Basic Demo Code Analysis
function analyzeCode(code, language) {
    const issues = [];

    if (language === "python") {
        if (code.includes("print ") && !code.includes("print(")) {
            issues.push({
                title: "Possible print syntax issue",
                description: "In Python 3, use print() with parentheses."
            });
        }

        if (/^\s*(if|for|while|def|class)\b[^:\n]*$/m.test(code)) {
            issues.push({
                title: "Possible missing colon",
                description: "Python if, for, while, def and class statements usually end with a colon (:)."
            });
        }

        if (/\t/.test(code)) {
            issues.push({
                title: "Indentation suggestion",
                description: "Consider using consistent spaces for Python indentation."
            });
        }
    }

    if (language === "java") {
        if (!/\bclass\s+\w+/.test(code)) {
            issues.push({
                title: "Class declaration not detected",
                description: "Check whether your Java program needs a class declaration."
            });
        }

        if (/\bSystem\.out\.println\s*\([^;]*\)\s*(?!;)/.test(code)) {
            issues.push({
                title: "Possible missing semicolon",
                description: "Check whether your System.out.println statement ends with a semicolon."
            });
        }
    }

    if (language === "c") {
        if (!/#include\s*<stdio\.h>/.test(code)) {
            issues.push({
                title: "Header file suggestion",
                description: "If you use printf() or scanf(), include stdio.h."
            });
        }

        if (!/\bmain\s*\(/.test(code)) {
            issues.push({
                title: "Main function not detected",
                description: "Check whether your C program contains a main() function."
            });
        }
    }

    if (!code.includes(";") && language !== "python") {
        issues.push({
            title: "Semicolon check",
            description: "Check whether your language statements require semicolons."
        });
    }

    return issues;
}

// Display Results Safely
function addResult(title, description) {
    const item = document.createElement("div");
    item.className = "review-item";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = description;

    item.appendChild(heading);
    item.appendChild(paragraph);

    reviewResults.appendChild(item);
}

// Clear Code Button
clearBtn.addEventListener("click", function () {
    codeInput.value = "";
    reviewResults.replaceChildren();

    resultMessage.textContent =
        "Your code review results will appear here.";
});