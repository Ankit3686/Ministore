// ===== BASE URL =====
const BASE_URL =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "htthttps://ministore-1.onrender.com"; // 👈 change after deploy

// ===== NAV MENU =====
function toggleMenu() {
    document.getElementById("nav")?.classList.toggle("show");
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    setupDropdown();
    setupLogin();
    setupUser();
    setupAdmin();
});

// ===== MOBILE DROPDOWN =====
function setupDropdown() {
    const dropdown = document.querySelector(".dropdown");
    if (!dropdown) return;

    const link = dropdown.querySelector("a");

    link.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle("active");
        }
    });
}

// ===== LOGIN =====
function setupLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email")?.value;
        const password = document.getElementById("password")?.value;

        if (!email || !password) {
            alert("Fill all fields ❌");
            return;
        }

        fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {

                    // ✅ STORE DATA
                    localStorage.setItem("user_id", data.user_id);
                    localStorage.setItem("loggedInEmail", email);

                    // ⚠️ backend name nahi de raha → safe fallback
                    localStorage.setItem("loggedInUser", data.name || email);

                    alert("Login Successful ✅");

                    window.location.href = "index.html";

                } else {
                    alert("Invalid Email or Password ❌");
                }
            })
            .catch(() => {
                alert("Server error ❌");
            });
    });
}

// ===== USER LETTER =====
function setupUser() {
    const user_id = localStorage.getItem("user_id");
    const usernameEl = document.getElementById("username");

    if (!user_id || !usernameEl) {
        if (usernameEl) usernameEl.style.display = "none";
        return;
    }

    fetch(`${BASE_URL}/user/${user_id}`)
        .then(res => res.json())
        .then(user => {
            if (user?.name) {
                usernameEl.innerText = user.name.charAt(0).toUpperCase();
            }
        })
        .catch(() => console.log("User fetch error"));
}

// ===== ADMIN LINK =====
function setupAdmin() {
    const adminEmail = "kumar22102001ankit@gmail.com";
    const currentEmail = localStorage.getItem("loggedInEmail");
    const adminEl = document.getElementById("adminLink");

    if (!adminEl) return;

    adminEl.style.display =
        currentEmail === adminEmail ? "inline-block" : "none";
}
