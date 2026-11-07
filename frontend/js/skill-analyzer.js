
const skillForm = document.getElementById("skillForm");

const overallScore = document.getElementById("overallScore");
const strengths = document.getElementById("strengths");
const weaknesses = document.getElementById("weaknesses");
const skillBars = document.getElementById("skillBars");
const resultsSection = document.getElementById("resultsSection");

const skillNames = {
    python: "Python Programming",
    java: "Java Programming",
    ml: "Machine Learning",
    web: "Web Development",
    dbms: "Database Management",
    communication: "Communication"
};

const proficiencyLevels = {
    1: "Beginner",
    2: "Basic",
    3: "Intermediate",
    4: "Advanced",
    5: "Expert"
};

// Handle Skill Assessment
skillForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const skills = [];

    for (const [id, name] of Object.entries(skillNames)) {
        const rating = Number(document.getElementById(id).value);

        if (!rating || rating < 1 || rating > 5) {
            return;
        }

        skills.push({
            name: name,
            rating: rating,
            level: proficiencyLevels[rating],
            percentage: rating * 20
        });
    }

    analyzeSkills(skills);
});

// Analyze Selected Skills
function analyzeSkills(skills) {

    const totalScore = skills.reduce(function (sum, skill) {
        return sum + skill.rating;
    }, 0);

    const maximumScore = skills.length * 5;

    const percentage = Math.round(
        (totalScore / maximumScore) * 100
    );

    overallScore.textContent = percentage + "%";

    // Identify strengths
    const strongSkills = skills.filter(function (skill) {
        return skill.rating >= 4;
    });

    // Identify improvement areas
    const weakSkills = skills.filter(function (skill) {
        return skill.rating <= 2;
    });

    displayStrengths(strongSkills);
    displayWeaknesses(weakSkills);
    displaySkillBars(skills);

    resultsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Display Strengths
function displayStrengths(skills) {

    strengths.replaceChildren();

    if (skills.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent =
            "No advanced skills identified yet. Keep practicing to build your strengths.";

        strengths.appendChild(message);
        return;
    }

    skills.forEach(function (skill) {
        const item = document.createElement("p");
        item.className = "result-list-item";
        item.textContent = "✓ " + skill.name + " - " + skill.level;

        strengths.appendChild(item);
    });
}

// Display Weaknesses
function displayWeaknesses(skills) {

    weaknesses.replaceChildren();

    if (skills.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent =
            "Great! No beginner-level skills identified. Continue developing your expertise.";

        weaknesses.appendChild(message);
        return;
    }

    skills.forEach(function (skill) {
        const item = document.createElement("p");
        item.className = "result-list-item";
        item.textContent = "↑ " + skill.name + " - " + skill.level;

        weaknesses.appendChild(item);
    });
}

// Display Skill Proficiency Bars
function displaySkillBars(skills) {

    skillBars.replaceChildren();

    skills.forEach(function (skill) {

        const item = document.createElement("div");
        item.className = "skill-bar-item";

        const heading = document.createElement("div");
        heading.className = "skill-bar-heading";

        const name = document.createElement("span");
        name.textContent = skill.name;

        const percentage = document.createElement("span");
        percentage.textContent =
            skill.level + " (" + skill.percentage + "%)";

        heading.appendChild(name);
        heading.appendChild(percentage);

        const track = document.createElement("div");
        track.className = "skill-track";

        const fill = document.createElement("div");
        fill.className = "skill-fill";

        fill.style.width = skill.percentage + "%";

        track.appendChild(fill);

        item.appendChild(heading);
        item.appendChild(track);

        skillBars.appendChild(item);
    });
}
