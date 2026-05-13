// ===== BASE URL =====
const BASE_URL =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "https://ministore-phdo.onrender.com"; // 👈 deploy ke baad change

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    setupDropdown();
    setupRegisterForm();
    setupUserLetter();
});

// ===== NAV MENU =====
function toggleMenu() {
    document.getElementById("nav")?.classList.toggle("show");
}

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

// ===== REGISTER =====
function setupRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        // ===== VALIDATION =====
        if (!name || !email || !password || !confirmPassword) {
            alert("Fill all fields ❌");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match ❌");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (data.success) {
                alert("Registration Successful ✅");

                // optional UI storage
                localStorage.setItem("loggedInUser", name);
                localStorage.setItem("loggedInEmail", email);

                window.location.href = "login.html";
            } else {
                alert(data.message || "Registration failed ❌");
            }

        } catch (err) {
            console.error("Signup error:", err);
            alert("Server error ❌");
        }
    });
}

// ===== USER LETTER =====
function setupUserLetter() {
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
        .catch(err => console.error("User fetch error:", err));
}

// ===== LOGOUT =====
function logout() {
    localStorage.clear();
    alert("Logged Out Successfully");
    window.location.href = "login.html";
}