
// EduVerse AI Dashboard

document.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll(".sidebar-nav .nav-link");

    links.forEach(link => {

        link.addEventListener("click", function(event) {

            const href = this.getAttribute("href");

            // Temporary navigation placeholders
            if (href === "#") {
                event.preventDefault();
                alert("This AI feature will be available soon!");
            }

        });

    });

    console.log("EduVerse AI Dashboard loaded successfully!");

});
