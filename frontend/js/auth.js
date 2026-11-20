
// =====================================
// EDUVERSE AI - AUTHENTICATION JAVASCRIPT
// =====================================

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


// 2. LOGIN FORM VALIDATION

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

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

        if (password.length < 8) {
            message.style.color = "#ff7777";
            message.textContent = "Password must contain at least 8 characters.";
            return;
        }

        message.style.color = "#9c8cff";
        message.textContent = "Login form validated! Backend integration coming soon.";

    });

}


// 3. REGISTRATION FORM VALIDATION

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const role = document.getElementById("role").value;

        const message = document.getElementById("registerMessage");

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

        message.style.color = "#9c8cff";
        message.textContent = "Registration form validated! Backend integration coming soon.";

    });

}


// 4. FORGOT PASSWORD MESSAGE

const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {

    forgotPassword.addEventListener("click", function(event) {

        event.preventDefault();

        document.getElementById("message").textContent =
            "Password recovery will be available after backend integration.";

    });

}
