
const roadmapForm = document.getElementById("roadmapForm");
const roadmapContent = document.getElementById("roadmapContent");
const roadmapResults = document.getElementById("roadmapResults");

// Career-specific learning paths
const careerPaths = {
    "AI Engineer": [
        {
            title: "Programming Foundations",
            topics: ["Python fundamentals", "Functions and OOP", "Data structures and algorithms"]
        },
        {
            title: "Mathematics and Data Handling",
            topics: ["Linear algebra and statistics", "NumPy and Pandas", "Data preprocessing"]
        },
        {
            title: "Machine Learning",
            topics: ["Regression and classification", "Clustering algorithms", "Model evaluation"]
        },
        {
            title: "Deep Learning and AI",
            topics: ["Neural networks", "CNN and RNN fundamentals", "Introduction to transformers"]
        },
        {
            title: "Projects and Deployment",
            topics: ["Build an AI application", "Develop APIs", "Deploy and document your project"]
        }
    ],

    "Machine Learning Engineer": [
        {
            title: "Programming Foundations",
            topics: ["Python programming", "OOP and data structures", "NumPy and Pandas"]
        },
        {
            title: "Mathematics for ML",
            topics: ["Linear algebra", "Probability and statistics", "Optimization basics"]
        },
        {
            title: "Machine Learning Algorithms",
            topics: ["Regression and classification", "Clustering", "Ensemble learning"]
        },
        {
            title: "Model Development",
            topics: ["Feature engineering", "Hyperparameter tuning", "Model evaluation"]
        },
        {
            title: "Deployment and Projects",
            topics: ["Build ML projects", "Model deployment", "MLOps fundamentals"]
        }
    ],

    "Data Scientist": [
        {
            title: "Programming and Data Analysis",
            topics: ["Python programming", "NumPy and Pandas", "Data cleaning"]
        },
        {
            title: "Statistics and Mathematics",
            topics: ["Probability distributions", "Hypothesis testing", "Linear algebra"]
        },
        {
            title: "Data Visualization",
            topics: ["Matplotlib", "Seaborn", "Exploratory data analysis"]
        },
        {
            title: "Machine Learning",
            topics: ["Supervised learning", "Unsupervised learning", "Model evaluation"]
        },
        {
            title: "Real-World Projects",
            topics: ["Predictive analytics", "End-to-end data science project", "Portfolio development"]
        }
    ],

    "Data Analyst": [
        {
            title: "Data Fundamentals",
            topics: ["Excel fundamentals", "Data cleaning", "Basic statistics"]
        },
        {
            title: "SQL and Databases",
            topics: ["SQL queries", "Joins and subqueries", "Database management"]
        },
        {
            title: "Python for Analysis",
            topics: ["Python basics", "Pandas and NumPy", "Data manipulation"]
        },
        {
            title: "Visualization and Reporting",
            topics: ["Power BI or Tableau", "Data visualization", "Dashboard development"]
        },
        {
            title: "Portfolio Projects",
            topics: ["Business data analysis", "Create interactive dashboards", "Present insights"]
        }
    ],

    "Web Developer": [
        {
            title: "HTML and CSS",
            topics: ["HTML structure", "CSS styling", "Responsive web design"]
        },
        {
            title: "JavaScript",
            topics: ["JavaScript fundamentals", "DOM manipulation", "Events and validation"]
        },
        {
            title: "Frontend Development",
            topics: ["Modern UI design", "API integration", "Frontend frameworks"]
        },
        {
            title: "Backend Fundamentals",
            topics: ["Server-side programming", "REST APIs", "Database connectivity"]
        },
        {
            title: "Projects and Deployment",
            topics: ["Build a complete website", "Testing and debugging", "Deploy your website"]
        }
    ],

    "Full Stack Developer": [
        {
            title: "Frontend Foundations",
            topics: ["HTML and CSS", "JavaScript", "Responsive design"]
        },
        {
            title: "Frontend Frameworks",
            topics: ["Component-based development", "State management", "API integration"]
        },
        {
            title: "Backend Development",
            topics: ["Node.js or Django", "REST API development", "Authentication"]
        },
        {
            title: "Database and Tools",
            topics: ["SQL and NoSQL", "Git and GitHub", "Testing and debugging"]
        },
        {
            title: "Full Stack Projects",
            topics: ["Build a complete application", "Deployment", "Portfolio development"]
        }
    ],

    "Software Engineer": [
        {
            title: "Programming Foundations",
            topics: ["Java or Python", "OOP concepts", "Data structures"]
        },
        {
            title: "Problem Solving",
            topics: ["Arrays and strings", "Trees and graphs", "Algorithmic problem solving"]
        },
        {
            title: "Software Development",
            topics: ["Clean code principles", "Design patterns", "Testing and debugging"]
        },
        {
            title: "System Fundamentals",
            topics: ["Operating systems", "DBMS", "Computer networks"]
        },
        {
            title: "Projects and Interview Preparation",
            topics: ["Build software projects", "Git and collaboration", "Technical interview practice"]
        }
    ],

    "Cloud Engineer": [
        {
            title: "Technical Foundations",
            topics: ["Linux fundamentals", "Networking basics", "Python or Bash scripting"]
        },
        {
            title: "Cloud Fundamentals",
            topics: ["Cloud computing concepts", "AWS, Azure or GCP basics", "Cloud storage and compute"]
        },
        {
            title: "Infrastructure and DevOps",
            topics: ["Docker fundamentals", "CI/CD pipelines", "Infrastructure as code"]
        },
        {
            title: "Cloud Security",
            topics: ["Identity and access management", "Network security", "Monitoring"]
        },
        {
            title: "Cloud Projects",
            topics: ["Deploy a cloud application", "Build cloud infrastructure", "Portfolio documentation"]
        }
    ]
};

// Handle Form Submission
roadmapForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const career = document.getElementById("careerGoal").value;
    const level = document.getElementById("currentLevel").value;
    const duration = Number(document.getElementById("duration").value);
    const hours = Number(document.getElementById("hours").value);
    const interests = document.getElementById("interests").value.trim();

    if (!career || !level || !duration || !hours || !interests) {
        return;
    }

    generateRoadmap(career, level, duration, hours, interests);
});

// Generate Personalized Roadmap
function generateRoadmap(career, level, duration, hours, interests) {

    const originalPath = careerPaths[career];

    // Adjust the learning path according to current level
    let path = originalPath.map(function (phase) {
        return {
            title: phase.title,
            topics: [...phase.topics]
        };
    });

    if (level === "Intermediate") {
        path = path.slice(1);
    } else if (level === "Advanced") {
        path = path.slice(2);
    }

    // Ensure at least one phase is displayed
    if (path.length === 0) {
        path = [originalPath[originalPath.length - 1]];
    }

    const phaseDuration = duration / path.length;

    roadmapContent.replaceChildren();

    // Create roadmap summary
    const summary = document.createElement("div");
    summary.className = "roadmap-summary";

    const heading = document.createElement("h3");
    heading.textContent = career + " Career Roadmap";

    const description = document.createElement("p");
    description.textContent =
        "Your " + level.toLowerCase() +
        " level learning journey is planned across " +
        duration + " month(s). Focus areas: " + interests + ".";

    const meta = document.createElement("div");
    meta.className = "roadmap-meta";

    [
        "Career: " + career,
        "Level: " + level,
        "Duration: " + duration + " Months",
        "Study: " + hours + " Hours/Day"
    ].forEach(function (value) {
        const tag = document.createElement("span");
        tag.className = "meta-tag";
        tag.textContent = value;
        meta.appendChild(tag);
    });

    summary.appendChild(heading);
    summary.appendChild(description);
    summary.appendChild(meta);

    roadmapContent.appendChild(summary);

    // Create timeline
    const timeline = document.createElement("div");
    timeline.className = "timeline";

    path.forEach(function (phase, index) {

        const item = document.createElement("div");
        item.className = "timeline-item";

        const phaseHeading = document.createElement("h3");
        phaseHeading.textContent =
            "Phase " + (index + 1) + ": " + phase.title;

        const time = document.createElement("p");
        time.textContent =
            "Suggested duration: " +
            phaseDuration.toFixed(1) + " month(s)";

        const topics = document.createElement("ul");

        phase.topics.forEach(function (topic) {
            const li = document.createElement("li");
            li.textContent = topic;
            topics.appendChild(li);
        });

        item.appendChild(phaseHeading);
        item.appendChild(time);
        item.appendChild(topics);

        timeline.appendChild(item);
    });

    roadmapContent.appendChild(timeline);

    // Create weekly study plan
    const weeklyPlan = document.createElement("div");
    weeklyPlan.className = "weekly-plan";

    const weeklyHeading = document.createElement("h3");
    weeklyHeading.textContent = "Your Weekly Study Plan";

    weeklyPlan.appendChild(weeklyHeading);

    const schedule = [
        ["Monday", "Learn new concepts"],
        ["Tuesday", "Practice technical topics"],
        ["Wednesday", "Solve coding exercises"],
        ["Thursday", "Work on practical applications"],
        ["Friday", "Revise and strengthen concepts"],
        ["Saturday", "Build a mini project"],
        ["Sunday", "Review your progress and plan the next week"]
    ];

    schedule.forEach(function (day) {
        const paragraph = document.createElement("p");

        paragraph.textContent =
            day[0] + ": " + day[1] +
            " (" + hours + " hour(s) per day)";

        weeklyPlan.appendChild(paragraph);
    });

    roadmapContent.appendChild(weeklyPlan);

    // Scroll to generated roadmap
    roadmapResults.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}
