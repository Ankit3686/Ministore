// ===== BASE URL =====
const BASE_URL =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "https://ministore-phdo.onrender.com"; // 👈 deploy ke baad change karna

// ===== NAV MENU =====
function toggleMenu() {
    document.getElementById("nav")?.classList.toggle("show");
}

// ===== MOBILE DROPDOWN =====
document.addEventListener("DOMContentLoaded", function () {

    const dropdown = document.querySelector(".dropdown");

    if (!dropdown) return; // ✅ FIX (error avoid)

    const dropdownLink = dropdown.querySelector("a");

    dropdownLink.addEventListener("click", function (e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle("active");
        }
    });

});

// ===== USER LETTER =====
document.addEventListener("DOMContentLoaded", function () {

    const user_id = localStorage.getItem("user_id");
    const usernameEl = document.getElementById("username");

    if (!user_id || !usernameEl) {
        if (usernameEl) usernameEl.style.display = "none";
        return;
    }

    fetch(`${BASE_URL}/user/${user_id}`)
        .then(res => res.json())
        .then(user => {

            if (!user || !user.name) return;

            usernameEl.innerText = user.name.charAt(0).toUpperCase();

        })
        .catch(err => {
            console.error("User fetch error:", err);
        });

});