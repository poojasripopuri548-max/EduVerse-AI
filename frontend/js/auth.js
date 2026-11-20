// =====================================
// EDUVERSE AI - AUTHENTICATION JAVASCRIPT
// =====================================

const API_BASE_URL = "http://127.0.0.1:8000/api";

// 1. SHOW / HIDE PASSWORD
document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", function () {
        const input = document.getElementById(this.dataset.target);
        if (input.type === "password") {
            input.type = "text";
            this.textContent = "Hide";
        } else {
            input.type = "password";
            this.textContent = "Show";
        }
    });
});

// 2. LOGIN FORM INTEGRATION
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");
        const submitBtn = loginForm.querySelector(".submit-btn");

        if (!email || !password) {
            message.style.color = "#ff7777";
            message.textContent = "Please fill in all fields.";
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            message.style.color = "#ff7777";
            message.textContent = "Please enter a valid email address.";
            return;
        }

        try {
            message.style.color = "#9c8cff";
            message.textContent = "Signing in...";
            if (submitBtn) submitBtn.disabled = true;

            const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Save authentication data
                localStorage.setItem("eduverse_token", data.token);
                localStorage.setItem("eduverse_student", JSON.stringify(data.student));

                message.style.color = "#4ade80";
                message.textContent = "Login successful! Redirecting to dashboard...";

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);
            } else {
                message.style.color = "#ff7777";
                message.textContent = data.error || (data.detail || "Invalid email or password.");
            }
        } catch (error) {
            message.style.color = "#ff7777";
            message.textContent = "Unable to connect to EduVerse backend server. Make sure the server is running on port 8000.";
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

// 3. REGISTRATION FORM INTEGRATION
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const role = document.getElementById("role").value;
        const message = document.getElementById("registerMessage");
        const submitBtn = registerForm.querySelector(".submit-btn");

        if (!name || !email || !password || !confirmPassword || !role) {
            message.style.color = "#ff7777";
            message.textContent = "Please fill in all fields.";
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            message.style.color = "#ff7777";
            message.textContent = "Please enter a valid email address.";
            return;
        }

        if (password.length < 8) {
            message.style.color = "#ff7777";
            message.textContent = "Password must contain at least 8 characters.";
            return;
        }

        if (password !== confirmPassword) {
            message.style.color = "#ff7777";
            message.textContent = "Passwords do not match.";
            return;
        }

        try {
            message.style.color = "#9c8cff";
            message.textContent = "Creating your account...";
            if (submitBtn) submitBtn.disabled = true;

            const response = await fetch(`${API_BASE_URL}/accounts/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    full_name: name,
                    email: email,
                    password: password,
                    confirm_password: confirmPassword,
                    college_name: "EduVerse Member",
                    department: "Student",
                    year_of_study: 1,
                    career_goal: "Full Stack AI Developer"
                })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Save authentication session
                localStorage.setItem("eduverse_token", data.token);
                localStorage.setItem("eduverse_student", JSON.stringify(data.student));

                message.style.color = "#4ade80";
                message.textContent = "Account created successfully! Redirecting to dashboard...";

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1200);
            } else {
                message.style.color = "#ff7777";
                let errText = "Registration failed.";
                if (data.error) {
                    errText = data.error;
                } else if (typeof data === "object") {
                    const firstKey = Object.keys(data)[0];
                    errText = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
                }
                message.textContent = errText;
            }
        } catch (error) {
            message.style.color = "#ff7777";
            message.textContent = "Unable to connect to EduVerse backend server. Make sure the server is running on port 8000.";
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

// 4. FORGOT PASSWORD MESSAGE
const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {
    forgotPassword.addEventListener("click", function(event) {
        event.preventDefault();
        const message = document.getElementById("message");
        if (message) {
            message.style.color = "#9c8cff";
            message.textContent = "Password recovery link sent if email exists.";
        }
    });
}
