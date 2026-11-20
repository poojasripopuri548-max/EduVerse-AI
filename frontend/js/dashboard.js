// =====================================
// EDUVERSE AI - DASHBOARD JAVASCRIPT
// =====================================

const API_BASE_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("eduverse_token");
    const rawStudent = localStorage.getItem("eduverse_student");

    // Profile elements in topbar
    const profileAvatar = document.querySelector(".profile-avatar");
    const profileName = document.querySelector(".profile h4");
    const profileRole = document.querySelector(".profile small");
    const welcomeTitle = document.querySelector(".welcome-section h1");
    const logoutBtn = document.querySelector(".nav-link.logout");

    // Populate from cached localStorage
    if (rawStudent) {
        try {
            const student = JSON.parse(rawStudent);
            renderStudentInfo(student);
        } catch (e) {
            console.error("Failed to parse student data from storage", e);
        }
    }

    // If token exists, fetch latest profile from backend API
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/accounts/profile/`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.student) {
                    localStorage.setItem("eduverse_student", JSON.stringify(data.student));
                    renderStudentInfo(data.student);
                }
            } else if (response.status === 401) {
                // Token expired
                localStorage.removeItem("eduverse_token");
                localStorage.removeItem("eduverse_student");
            }
        } catch (error) {
            console.log("Using cached profile data (offline/disconnected).");
        }
    }

    function renderStudentInfo(student) {
        if (!student) return;
        const name = student.full_name || "Student";
        const firstLetter = name.charAt(0).toUpperCase();

        if (profileAvatar) profileAvatar.textContent = firstLetter;
        if (profileName) profileName.textContent = name;
        if (profileRole) profileRole.textContent = student.department || student.college_name || "EduVerse Member";
        if (welcomeTitle) welcomeTitle.textContent = `Welcome back, ${name.split(" ")[0]}!`;
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("eduverse_token");
            localStorage.removeItem("eduverse_student");
            window.location.href = "login.html";
        });
    }

    console.log("EduVerse AI Dashboard initialized with backend support.");
});
